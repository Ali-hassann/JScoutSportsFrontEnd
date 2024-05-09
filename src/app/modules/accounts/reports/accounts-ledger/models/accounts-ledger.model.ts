import { GenericBaseModel } from "src/app/shared/models/base.model";

export class PrintAccountLedgerRequest extends GenericBaseModel {
    public SelectedAccountsIds: string = '';
    public PostingAccountsIds?: number[];
    public FromDate: any = '';
    public ToDate: any = '';
}