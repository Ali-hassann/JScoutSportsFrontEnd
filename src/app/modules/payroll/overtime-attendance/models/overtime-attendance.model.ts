import { GenericBaseModel } from "src/app/shared/models/base.model";

export class OvertimeDetailRequest {
    OvertimeDetailId: number = 0;
    OvertimeId: number = 0;
    CheckIn: string = "";
    CheckOut: string = "";
    EmployeeId: number = 0;
    DetailMarkType: string = "User";
    DeviceIP: string = "";
}

export class OvertimeDetailResponse {
    OvertimeDetailId: number = 0;
    OvertimeId: number = 0;
    CheckIn?: any = "";
    CheckOut?: any = null;
    EmployeeId: number = 0;
    DetailMarkType: string = "User";
    DeviceIP: string = "";
    OvertimeDate: string | Date = "";
}

export class OvertimeResponse {
    OvertimeId: number = 0;
    OvertimeDate: string | Date = "";
    Remarks: string = "";
    CheckIn: string = "";
    CheckOut: string = "";
    OvertimeMinutes: number = 0;
    WorkingHours: number = 0;
    MarkType: string = "";
    EmployeeName: string = "";
    EmployeeId: number = 0;
    DepartmentsId: number = 0;
    DepartmentsName: string = "";
    Selected: boolean = false;
}


export class OvertimeRequest extends GenericBaseModel {
    EmployeeId: number = 0;
    OvertimeId: number = 0;
    Remarks: string = "";
    OvertimeDate: string | Date = "";
    MarkType: string = "User";
}



