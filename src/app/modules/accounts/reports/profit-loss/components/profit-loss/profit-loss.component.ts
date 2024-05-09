import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { MessageService } from "primeng/api";
import { map } from "rxjs/operators";
import { DateHelperService } from "src/app/shared/services/date-helper.service";
import { FinancialReportRequest } from "../../../financial-reports/models/financial-report-model.model";
import { ProfitLossService } from "../../services/profit-loss.service";

@Component({
    selector: "app-profit-loss",
    templateUrl: "./profit-loss.component.html",
    styleUrls: ["./profit-loss.component.scss"],
})
export class ProfitLossComponent implements OnInit {
    @Input() profitLossRequest = new FinancialReportRequest();
    constructor(
        private _profitLossService: ProfitLossService,
        private _messageService: MessageService,
    ) {
    }

    ngOnInit(): void {
        this.setBreadCrumb();
    }

    public printReport() {

        let request = this.getRequestModel();
        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });

        this._profitLossService
            .printprofitLossSheet(request)
            .pipe(
                map((response: any) => {
                    if (response) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 });
                        let blob: Blob = response.body as Blob;
                        let frame = document.getElementById("profitlossframe") as HTMLIFrameElement;
                        frame.src = window.URL.createObjectURL(blob);

                    } else {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'info', summary: 'Loading', detail: "No record found for selected criteria" });
                    }
                })
            )
            .subscribe();
    }

    getRequestModel(): FinancialReportRequest {
        let response = new FinancialReportRequest();
        response.OrganizationId = this.profitLossRequest.OrganizationId;
        response.OutletId = this.profitLossRequest.OutletId;
        response.Address = this.profitLossRequest.Address;
        response.OutletName = this.profitLossRequest.OutletName;
        response.FromDate = DateHelperService.getServerDateFormat(this.profitLossRequest.FromDate);
        response.ToDate = DateHelperService.getServerDateFormat(this.profitLossRequest.ToDate);
        response.IncludeZeroValue = this.profitLossRequest.IncludeZeroValue;
        response.IsActive = this.profitLossRequest.IsActive;
        response.PostingAccountsIds = this.profitLossRequest.PostingAccountsIds;
        return response;
    }

    public setBreadCrumb(): void {
        // this._breadCrumbService.setItems([
        //     {
        //         label: "Reports",
        //         url: "reports",
        //     },
        //     { label: "Profit Loss" },
        // ]);
    }

    public CheckDate(control: AbstractControl | any): void {
        const FromDate = control.get("FromDate").value;
        const ToDate = control.get("ToDate").value;
        if (FromDate > ToDate) {
            control.get("ToDate").setErrors({ ToDate: true });
        } else {
            control.get("ToDate").setErrors(null);
        }
    }
}
