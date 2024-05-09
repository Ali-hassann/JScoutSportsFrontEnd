import { GenericBaseModel } from "src/app/shared/models/base.model";

export class PayrollReportRequest extends GenericBaseModel {
    Ids: string = "";
    DepartmentIds: string = "";
    EmployeeIds: string = "";
    FromDate: Date | string = new Date();
    ToDate: Date | string = new Date();
    MonthOf: number = 0;
    YearOf: number = 0;
    DepartmentTypeId: number = 0;
}