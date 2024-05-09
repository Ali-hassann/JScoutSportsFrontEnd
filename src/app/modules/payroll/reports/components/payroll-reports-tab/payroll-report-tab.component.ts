import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { map } from "rxjs/operators";
import { PayrollReportService } from "../services/payroll-reports.service";

@Component({
    selector: "app-payroll-report-tab",
    templateUrl: "./payroll-report-tab.component.html",
    styleUrls: ["./payroll-report-tab.component.scss"],
})
export class PayrollReportTabComponent implements OnInit {
    constructor(
        private _payrollReportService: PayrollReportService,
        private _messageService: MessageService,

    ) {
    }

    ngOnInit(): void {
    }

    public printReport() {
        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });


        this._payrollReportService
            .departmentReport(1)
            .pipe(
                map((response: any) => {
                    if (response) {
                        this._messageService.clear();
                        this._messageService.add(
                            { severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 }
                        );

                        let blob: Blob = response.body as Blob;
                        let frame = document.getElementById("payroll") as HTMLIFrameElement;
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