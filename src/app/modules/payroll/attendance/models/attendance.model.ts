import { GenericBaseModel as CommonBaseModel } from "src/app/shared/models/base.model";

export class EmployeeBaseResponse {
    EmployeeId: number = 0;
    FirstName: string = "";
    LastName: string = "";
    OutletId: number = 0;
    OutletName: string = "";
    OutletImagePath: string = "";
    DepartmentsId: number = 0;
    DepartmentsName: string = "";
    DesignationName: string = "";
    ImagePath: string = "";
    QRCodePath: string = "";
    JoiningDate: string = "";
    OvertimeAllowed: boolean = false;
}

export class EmployeeFilterRequest extends CommonBaseModel {
    constructor() {
        super();
    }

    OutletIds: string = "";
    FromDate: string | Date = "";
    StatusIds: string = "";
    DepartmentIds: string = "";
}

export class AttendanceResponse extends EmployeeBaseResponse {
    constructor() {
        super();
    }

    AttendanceId: number = 0;
    AttendanceDate: string = "";
    StatusName: string = "";
    ShortDescription: string = "";
    Remarks: string = "";
    CheckIn: string = "";
    CheckOut: string = "";
    Overtime: string = "";
    OvertimeMinutes: number = 0;
    WorkingHours: number = 0;
    MarkType: string = "User";
    DetailMarkType: string = "User";
    Selected: boolean = false;
}

export class AttendanceRequest extends CommonBaseModel {
    EmployeeId: number = 0;
    AttendanceId: number = 0;
    AttendanceStatusId: number = 0;
    StatusName: string = "";
    Remarks: string = "";
    AttendanceDate: string = "";
    MarkType: string = "";
}

export class AttendanceDetailResponse {
    AttendanceId: number = 0;
    AttendanceDetailId: number = 0;
    AttendanceDate: string | Date = "";
    CheckIn?: any = "";
    CheckOut?: any = null;
    StatusName: string = "";
    ShortDescription: string = "";
    WorkingDetail: string = "";
    WorkingStatus: string = "";
    EmployeeId: number = 0;
    MarkType: string = "";
    DetailMarkType: string = "";
}