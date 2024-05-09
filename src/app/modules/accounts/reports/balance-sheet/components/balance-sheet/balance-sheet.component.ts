import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl, } from "@angular/forms";
import { MessageService } from "primeng/api";
import { map } from "rxjs/operators";
import { DateHelperService } from "src/app/shared/services/date-helper.service";
import { FinancialReportRequest } from "../../../financial-reports/models/financial-report-model.model";
import { BalanceSheetService } from "../../services/balance-sheet.service";
import { ConfigurationSettingQuery } from "src/app/modules/accounts/accounts-configuration/states/data-states/accounts-configuration.query";

@Component({
    selector: "app-balance-sheet",
    templateUrl: "./balance-sheet.component.html",
    styleUrls: ["./balance-sheet.component.scss"],
})
export class BalanceSheetComponent implements OnInit {
    @Input() balanceSheetRequest = new FinancialReportRequest();
    constructor(
        // private _breadCrumbService: AppBreadcrumbService,
        private _balanceSheetService: BalanceSheetService,
        private _messageService: MessageService,
        private _configurationSettingQuery: ConfigurationSettingQuery,
    ) {
    }

    ngOnInit(): void {
        this.setBreadCrumb();
        this._configurationSettingQuery.configurationSetting$.subscribe(res => {
            this.balanceSheetRequest.OwnerEquityId = res.find(r => r.AccountName === "OwnerEquity")?.AccountValue ?? 0;
        });
    }

    public printReport() {
        let request = this.getRequestModel();

        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
        this._balanceSheetService
            .printBalanceSheet(request)
            .pipe(
                map((response: any) => {
                    if (response?.body?.size > 0) {
                        this._messageService.clear();
                        this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 });

                        let blob: Blob = response.body as Blob;
                        let frame = document.getElementById("balanceframe") as HTMLIFrameElement;
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

    getRequestModel(): FinancialReportRequest {
        let response = new FinancialReportRequest();
        response.OrganizationId = this.balanceSheetRequest.OrganizationId;
        response.OutletId = this.balanceSheetRequest.OutletId;
        response.Address = this.balanceSheetRequest.Address;
        response.OutletName = this.balanceSheetRequest.OutletName;
        response.FromDate = DateHelperService.getServerDateFormat(this.balanceSheetRequest.FromDate);
        response.ToDate = DateHelperService.getServerDateFormat(this.balanceSheetRequest.ToDate);
        response.IncludeZeroValue = this.balanceSheetRequest.IncludeZeroValue;
        response.IsActive = this.balanceSheetRequest.IsActive;
        response.PostingAccountsIds = this.balanceSheetRequest.PostingAccountsIds;
        return response;
    }

    public setBreadCrumb(): void {
        // this._breadCrumbService.setItems([
        //     {
        //         label: "Reports",
        //         url: "reports",
        //     },
        //     { label: "Balance Sheet" },
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
