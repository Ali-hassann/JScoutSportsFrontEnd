import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { AuthQuery } from "src/app/modules/common/auth/states/auth.query";
import { InventoryReportService } from "../services/payroll-reports.service";
import { map } from "rxjs";
import { InventoryRights } from "src/app/shared/enums/rights.enum";

@Component({
    selector: "app-item-reports-tab",
    templateUrl: "./item-reports-tab.component.html",
    styleUrls: ["./item-reports-tab.component.scss"],
})
export class ItemReportTabComponent implements OnInit {

    InventoryRights = InventoryRights;
    constructor(
        private _inventoryReportService: InventoryReportService,
        private _authQuery: AuthQuery,
        private _messageService: MessageService,
    ) {
    }

    ngOnInit(): void {

    }

    public printItemReport() {
        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
        this._inventoryReportService
            .itemReport()
            .pipe(
                map((response: any) => {
                    if (response) {
                        this._messageService.clear();
                        this._messageService.add(
                            { severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 }
                        );

                        let blob: Blob = response.body as Blob;
                        let frame = document.getElementById("item") as HTMLIFrameElement;
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