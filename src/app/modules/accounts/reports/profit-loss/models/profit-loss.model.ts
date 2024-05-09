import { GenericBaseModel } from "src/app/shared/models/base.model";

export class ProfitLossRequest extends GenericBaseModel {
    public FromDate: any = '';
    public ToDate: any = '';
    public IncludeZeroValue: boolean = false;
    public IsActive: boolean = false;
    public SelectedAccountsIds: string = "";
    public PostingAccountsIds?: number[];
}