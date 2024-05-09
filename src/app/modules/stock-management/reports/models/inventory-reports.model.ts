import { GenericBaseModel } from "src/app/shared/models/base.model";

export class StockManagementReportRequest extends GenericBaseModel {
    ItemIds: string = "";
    FromDate: Date | string = new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate());
    ToDate: Date | string = new Date();
    MonthOf: number = 0;
    YearOf: number = 0;
    DocumentTypeId: number = 0;
    ParticularId: number = 0;
    IsIncludeZeroValue: boolean = true;
}