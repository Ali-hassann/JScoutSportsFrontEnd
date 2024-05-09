import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { AuthQuery } from "src/app/modules/common/auth/states/auth.query";
import { map } from "rxjs";
import { StockManagementReportService } from "../services/stock-management-reports.service";
import { StockManagementReportRequest } from "../../models/inventory-reports.model";
import { DateHelperService } from "src/app/shared/services/date-helper.service";
import { ParticularRequest } from "src/app/modules/inventory/item-particular/models/item-particular.model";
import { ParticularQuery } from "src/app/modules/inventory/item-particular/states/item-paticular.query";

@Component({
    selector: "app-party-ledger-reports-tab",
    templateUrl: "./party-ledger-reports-tab.component.html",
    styleUrls: ["./party-ledger-reports-tab.component.scss"],
})
export class PartyLedgerReportTabComponent implements OnInit {
    public partyLedger: StockManagementReportRequest = new StockManagementReportRequest();
    venderList: ParticularRequest[] = [];
    selectedParty: number = 0;

    constructor(
        private _inventoryReportService: StockManagementReportService,
        private _authQuery: AuthQuery,
        private _messageService: MessageService,
        private _particularQuery: ParticularQuery,
    ) {
    }

    ngOnInit(): void {
        this._particularQuery.VendorList$.subscribe(
            res => {
                res?.length > 0 ? this.venderList = res : false;
            }
        );
    }

    public printItemLedgerReport() {
        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
        let request = new StockManagementReportRequest();
        request.FromDate = DateHelperService.getServerDateFormat(this.partyLedger.FromDate, DateHelperService.currentDateFormat);
        request.ToDate = DateHelperService.getServerDateFormat(this.partyLedger.ToDate, DateHelperService.currentDateFormat);
        request.ParticularId = this.selectedParty;
        request.OutletId = this.partyLedger.OutletId;
        this._inventoryReportService
            .verderLedgerReport(request)
            .pipe(
                map((response: any) => {
                    if (response) {
                        this._messageService.clear();
                        this._messageService.add(
                            { severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 }
                        );

                        let blob: Blob = response.body as Blob;
                        let frame = document.getElementById("partyLedger") as HTMLIFrameElement;
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