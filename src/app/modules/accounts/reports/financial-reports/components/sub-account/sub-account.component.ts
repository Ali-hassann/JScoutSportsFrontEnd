import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl, } from "@angular/forms";
import { map } from "rxjs/operators";
import { DateHelperService } from "src/app/shared/services/date-helper.service";
import { FinancialReportRequest } from "../../models/financial-report-model.model";
import { MessageService } from "primeng/api";
import { TrialBalanceService } from "../../../trial-balance/services/trial-balance.service";

@Component({
    selector: "app-sub-account",
    templateUrl: "./sub-account.component.html",
    styleUrls: ["./sub-account.component.scss"],
})
export class SubAccountComponent implements OnInit {
    @Input() subCategoryReportRequest = new FinancialReportRequest();
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
            .printSubAccountReport(request)
            .pipe(
                map((response: any) => {
                    if (response) {
                        this._messageService.clear();

                        this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Report generated successfully"', life: 3000 });

                        let blob: Blob = response.body as Blob;
                        let frame = document.getElementById("subaccountframe") as HTMLIFrameElement;
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
        response.OrganizationId = this.subCategoryReportRequest.OrganizationId;
        response.OutletId = this.subCategoryReportRequest.OutletId;
        response.Address = this.subCategoryReportRequest.Address;
        response.OutletName = this.subCategoryReportRequest.OutletName;
        response.FromDate = DateHelperService.getServerDateFormat(this.subCategoryReportRequest.FromDate);
        response.ToDate = DateHelperService.getServerDateFormat(this.subCategoryReportRequest.ToDate);
        response.IncludeZeroValue = this.subCategoryReportRequest.IncludeZeroValue;
        response.IsActive = this.subCategoryReportRequest.IsActive;
        response.PostingAccountsIds = [];
        response.PostingAccountsId = 0;
        response.SubCategoriesId = this.subCategoryReportRequest.SubCategoriesId;
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
