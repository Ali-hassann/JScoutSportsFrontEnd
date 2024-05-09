import { GenericBaseModel } from "src/app/shared/models/base.model";

export class FinancialReportRequest extends GenericBaseModel {
    public FromDate: any = '';
    public ToDate: any = '';
    public IncludeZeroValue: boolean = false;
    public IsActive: boolean = false;
    public SelectedAccountsIds: string = "";
    public PostingAccountsIds?: number[];
    public PostingAccountsId: number = 0;
    public OwnerEquityId: number = 0;
    public SubCategoriesId: number = 0;
}