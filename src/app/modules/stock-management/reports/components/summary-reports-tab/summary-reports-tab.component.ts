import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { map } from "rxjs";
import { StockManagementReportService } from "../services/stock-management-reports.service";
import { DateHelperService } from "src/app/shared/services/date-helper.service";
import { StockManagementReportRequest } from "../../models/inventory-reports.model";
import { InventoryDocumentType } from "src/app/shared/enums/invoices.enum";

@Component({
    selector: "app-summary-reports-tab",
    templateUrl: "./summary-reports-tab.component.html",
    styleUrls: ["./summary-reports-tab.component.scss"],
})
export class SummaryReportTabComponent implements OnInit {

    public summaryRequest: StockManagementReportRequest = new StockManagementReportRequest();

    constructor(
        private _inventoryReportService: StockManagementReportService,
        private _messageService: MessageService,
    ) {
    }

    ngOnInit(): void {
        this.summaryRequest.FromDate = new Date();
        this.summaryRequest.ToDate = new Date();
        this.summaryRequest.DocumentTypeId = +InventoryDocumentType.Purchase;
    }

    public printStockSummaryReport() {
        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
        let request = new StockManagementReportRequest();
        request.FromDate = DateHelperService.getServerDateFormat(this.summaryRequest.FromDate, DateHelperService.currentDateFormat);
        request.ToDate = DateHelperService.getServerDateFormat(this.summaryRequest.ToDate, DateHelperService.currentDateFormat);
        request.DocumentTypeId = this.summaryRequest.DocumentTypeId;
        request.OutletId = this.summaryRequest.OutletId;
        request.IsIncludeZeroValue = this.summaryRequest.IsIncludeZeroValue;
        this._inventoryReportService
            .printStockSummary(request)
            .pipe(
                map((response: any) => {
                    if (response) {
                        this._messageService.clear();

                        this._messageService.add(
                            { severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 }
                        );

                        let blob: Blob = response.body as Blob;
                        let frame = document.getElementById("summary") as HTMLIFrameElement;
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