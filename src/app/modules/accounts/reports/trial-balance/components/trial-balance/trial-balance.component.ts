import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl, } from "@angular/forms";
import { map } from "rxjs/operators";
import { DateHelperService } from "src/app/shared/services/date-helper.service";
import { TrialBalanceService } from "../../services/trial-balance.service";
import { FinancialReportRequest } from "../../../financial-reports/models/financial-report-model.model";
import { MessageService } from "primeng/api";

@Component({
    selector: "app-trial-balance",
    templateUrl: "./trial-balance.component.html",
    styleUrls: ["./trial-balance.component.scss"],
})
export class TrialBalanceComponent implements OnInit {
    @Input() trialBalanceRequest = new FinancialReportRequest();
    constructor(
        // private _breadCrumbService: AppBreadcrumbService,
        private _trialBalanceService: TrialBalanceService,
        private _messageService: MessageService,
    ) {
    }

    ngOnInit(): void {
        this.setBreadCrumb();
    }

    public printReport() {
        let request = this.getRequestModel();
        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
        this._trialBalanceService
            .printTrailBalance(request)
            .pipe(
                map((response: any) => {
                    if (response) {
                        this._messageService.clear();

                        this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Report generated successfully"', life: 3000 });


                        let blob: Blob = response.body as Blob;
                        let frame = document.getElementById("trialbalanceframe") as HTMLIFrameElement;
                        frame.src = window.URL.createObjectURL(blob);

                    } else {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'No record found for selected criteria' });
                    }
                })
            )
            .subscribe();
    }

    getRequestModel(): FinancialReportRequest {
        let response = new FinancialReportRequest();
        response.OrganizationId = this.trialBalanceRequest.OrganizationId;
        response.OutletId = this.trialBalanceRequest.OutletId;
        response.Address = this.trialBalanceRequest.Address;
        response.OutletName = this.trialBalanceRequest.OutletName;
        response.FromDate = DateHelperService.getServerDateFormat(this.trialBalanceRequest.FromDate);
        response.ToDate = DateHelperService.getServerDateFormat(this.trialBalanceRequest.ToDate);
        response.IncludeZeroValue = this.trialBalanceRequest.IncludeZeroValue;
        response.IsActive = this.trialBalanceRequest.IsActive;
        response.PostingAccountsIds = this.trialBalanceRequest.PostingAccountsIds;
        return response;
    }

    public setBreadCrumb(): void {
        // this._breadCrumbService.setItems([
        //     {
        //         label: "Reports",
        //         url: "reports",
        //     },
        //     { label: "Trial Balance" },
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
