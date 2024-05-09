import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { AuthQuery } from "src/app/modules/common/auth/states/auth.query";
import { map } from "rxjs";
import { StockManagementReportService } from "../services/stock-management-reports.service";
import { DateHelperService } from "src/app/shared/services/date-helper.service";
import { StockManagementReportRequest } from "../../models/inventory-reports.model";
import { InventoryDocumentType } from "src/app/shared/enums/invoices.enum";

@Component({
    selector: "app-transaction-reports-tab",
    templateUrl: "./transaction-reports-tab.component.html",
    styleUrls: ["./transaction-reports-tab.component.scss"],
})
export class TransactionReportTabComponent implements OnInit {

    public transactionRequest: StockManagementReportRequest = new StockManagementReportRequest();

    public docTypes = [
        { name: 'Purchase            ', value: InventoryDocumentType.Purchase },
        { name: 'Purchase Return          ', value: InventoryDocumentType.PurchaseReturn },
        { name: 'Issuance', value: InventoryDocumentType.Issuance },
        { name: 'Issuance Return             ', value: InventoryDocumentType.IssuanceReturn },
        { name: 'Adjustment                 ', value: InventoryDocumentType.Adjustment }
    ];

    constructor(
        private _inventoryReportService: StockManagementReportService,
        private _authQuery: AuthQuery,
        private _messageService: MessageService,
    ) {
    }

    ngOnInit(): void {
        this.transactionRequest.FromDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate());
        this.transactionRequest.ToDate = new Date();
        this.transactionRequest.DocumentTypeId = +InventoryDocumentType.Purchase;
    }

    public printDailyTransactionReport() {
        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
        let request = new StockManagementReportRequest();
        request.FromDate = DateHelperService.getServerDateFormat(this.transactionRequest.FromDate, DateHelperService.currentDateFormat);
        request.ToDate = DateHelperService.getServerDateFormat(this.transactionRequest.ToDate, DateHelperService.currentDateFormat);
        request.DocumentTypeId = this.transactionRequest.DocumentTypeId;
        request.OutletId = this.transactionRequest.OutletId;
        this._inventoryReportService
            .printDailyTransactions(request)
            .pipe(
                map((response: any) => {
                    if (response) {
                        this._messageService.clear();

                        this._messageService.add(
                            { severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 }
                        );

                        let blob: Blob = response.body as Blob;
                        let frame = document.getElementById("transaction") as HTMLIFrameElement;
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