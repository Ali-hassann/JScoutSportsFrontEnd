import { GenericBaseModel } from "src/app/shared/models/base.model";

export class TransactionReportRequest extends GenericBaseModel {
    public VoucherTypeId: number = 0;
    public FromDate: any = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate());
    public ToDate: any = '';
    public IsActive: boolean = false;
}