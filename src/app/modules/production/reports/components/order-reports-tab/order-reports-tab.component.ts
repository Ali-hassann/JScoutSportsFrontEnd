import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { AuthQuery } from "src/app/modules/common/auth/states/auth.query";
import { map } from "rxjs";
import { ProductionReportService } from "../services/production-reports.service";
import { OrderQuery } from "../../../order/states/order.query";
import { OrderMasterRequest } from "../../../order/models/order.model";
import { ProductionParameterRequest } from "../../../production-process/models/production-process.model";

@Component({
    selector: "app-order-reports-tab",
    templateUrl: "./order-reports-tab.component.html",
    styleUrls: ["./order-reports-tab.component.scss"],
})
export class ProductReportTabComponent implements OnInit {
    public orderList: OrderMasterRequest[] = [];
    public productionParameterRequest: ProductionParameterRequest = new ProductionParameterRequest();
    constructor(
        private _productionReportService: ProductionReportService,
        private _authQuery: AuthQuery,
        private _messageService: MessageService,
        private _orderQuery: OrderQuery,
    ) {
    }

    ngOnInit(): void {
        this._orderQuery.orderList$.subscribe(
            (data: OrderMasterRequest[]) => {
                this.orderList = data;
            }
        );
    }

    public printOrderStatusReport() {
        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
        this._productionReportService
            .orderStatusReport(this.productionParameterRequest)
            .pipe(
                map((response: any) => {
                    if (response) {
                        this._messageService.clear();
                        this._messageService.add(
                            { severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 }
                        );

                        let blob: Blob = response.body as Blob;
                        let frame = document.getElementById("OrderStatus") as HTMLIFrameElement;
                        frame.src = window.URL.createObjectURL(blob);
                    } else {
                        this._messageService.clear();
                        this._messageService.add({
                            severity: 'info',
                            summary: 'Message',
                            detail: 'No record found for selected criteria',
                            life: 3000
                        });
                    }
                })
            )
            .subscribe();
    }


    public printArticleBalanceEmployeeWise() {
        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
        this._productionReportService
            .printArticleBalanceEmployeeWise(this.productionParameterRequest)
            .pipe(
                map((response: any) => {
                    if (response) {
                        this._messageService.clear();
                        this._messageService.add(
                            { severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 }
                        );

                        let blob: Blob = response.body as Blob;
                        let frame = document.getElementById("OrderStatus") as HTMLIFrameElement;
                        frame.src = window.URL.createObjectURL(blob);
                    } else {
                        this._messageService.clear();
                        this._messageService.add({
                            severity: 'info',
                            summary: 'Message',
                            detail: 'No record found for selected criteria',
                            life: 3000
                        });
                    }
                })
            )
            .subscribe();
    }
}