import { GenericBaseModel } from "src/app/shared/models/base.model";

export class DailyTransactionReport extends GenericBaseModel {
    public VoucherTypeId: number = 0;
    public FromDate: any = '';
    public ToDate: any = '';
}