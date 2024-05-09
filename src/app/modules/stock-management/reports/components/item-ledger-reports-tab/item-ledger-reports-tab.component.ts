import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { AuthQuery } from "src/app/modules/common/auth/states/auth.query";
import { map } from "rxjs";
import { StockManagementReportService } from "../services/stock-management-reports.service";
import { StockManagementReportRequest } from "../../models/inventory-reports.model";
import { DateHelperService } from "src/app/shared/services/date-helper.service";
import { ItemsQuery } from "src/app/modules/inventory/pre-requisite/items/states/items.query";
import { ItemRequest } from "src/app/modules/inventory/pre-requisite/items/models/items.model";

@Component({
    selector: "app-item-ledger-reports-tab",
    templateUrl: "./item-ledger-reports-tab.component.html",
    styleUrls: ["./item-ledger-reports-tab.component.scss"],
})
export class ItemLedgerReportTabComponent implements OnInit {
    public itemLedger: StockManagementReportRequest = new StockManagementReportRequest();
    itemsList: ItemRequest[] = [];
    selectedItems: number[] = [];
    constructor(
        private _inventoryReportService: StockManagementReportService,
        private _authQuery: AuthQuery,
        private _messageService: MessageService,
        private _itemsQuery: ItemsQuery,
    ) {
    }

    ngOnInit(): void {
        this._itemsQuery.itemsList$.subscribe(
            res => {
                res?.length > 0 ? this.itemsList = res : false;
            }
        );
    }

    public printItemLedgerReport() {
        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
        let request = new StockManagementReportRequest();
        request.FromDate = DateHelperService.getServerDateFormat(this.itemLedger.FromDate, DateHelperService.currentDateFormat);
        request.ToDate = DateHelperService.getServerDateFormat(this.itemLedger.ToDate, DateHelperService.currentDateFormat);
        request.ItemIds = this.selectedItems?.join(',') ?? "";
        request.OutletId = this.itemLedger.OutletId;
        this._inventoryReportService
            .itemLedgerReport(request)
            .pipe(
                map((response: any) => {
                    if (response) {
                        this._messageService.clear();
                        this._messageService.add(
                            { severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 }
                        );

                        let blob: Blob = response.body as Blob;
                        let frame = document.getElementById("itemLedger") as HTMLIFrameElement;
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