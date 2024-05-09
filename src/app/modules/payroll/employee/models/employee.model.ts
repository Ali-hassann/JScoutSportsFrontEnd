import { EntityStateEnum } from "src/app/shared/enums/entity-state.enum";


export class EmployeeRequest {
    Employee: EmployeeBasicRequest = new EmployeeBasicRequest();
    EmployeeDetail: EmployeeDetail = new EmployeeDetail();
    // EmployeeBenefits: EmployeeBenefits[] = [];
}


export class EmployeeBasicRequest {
    EmployeeId: number = 0;
    EmployeeName: string = "";
    FatherName: string = "";
    ContactNumber: string = "";
    Gender: string = "";
    HusbandName: string = "";
    MaritalStatus: string = "";
    CNIC: string = "";
    IsActive: boolean = false;
    ImagePath: string = "";
    QRCodePath: string = "";
    DepartmentsId: number = 0;
    DepartmentsName: string = "";

    OutletId: number = 0;
    OrganizationId: number = 0;
    OutletName: string = "";
    JoiningDate: Date | string = "";
    LeftDate?: Date | string;
    SalaryAmount: number = 0;
    MonthlyOffHours: number = 0;
    OvertimeAllowed: boolean = false;
    BenefitsAllowed: boolean = false;
    OvertimeHourlyWageAmount: number = 0;
    HourlyWageAmount: number = 0;
    WorkingHours: number = 0;
    SalaryType: number = 0;
    RecordState: EntityStateEnum | any;
    OvertimeThreshold: number = 0;
    Selected: boolean = false;
    DesignationId: number = 0;
    DesignationName: string = "";
    IsToDeleteImage: boolean = false;
    PreviousOrganization: string = "";
    PersonType: string = "";
    EmployeeSerialNo: number = 0;
    EmployeeCode: string = "";
}

export class EmployeeDetail {
    EmployeeDetailId: number = 0;
    EmployeeId: number = 0;
    DOB: Date | string = "";
    Address: string = "";
    Email: string = "";
    CasteName: string = "";
    CasteId: number = 0;
    ReligionId: number = 0;
    ReligionName: string = "";
    MOIId: number = 0;
    AreaId: number = 0;
    MOIName: string = "";
    AreaName: string = "";
    Nationality: string = "";
    ContactNumber1: string = "";
    ContactNumber2: string = "";
    ContactNumber3: string = "";
    RecordState: EntityStateEnum | any;
}

export class EmployeeBenefits {
    EmployeeBenefitsId: number = 0;
    BenefitAmount: number = 0;
    BenefitTypeId: number = 0;
    EmployeeId: number = 0;
    RecordState: EntityStateEnum | any;
    Errors: string = "";
    Type: string = "";
    Percentage: any;
}

export class EmployeePayrollRequest {
    OrganizationId: number;
    OutletId: number;
    FromDate: Date | string;
    ToDate: Date | string;
    StatusIds: string;
    TypeIds: string;
    EmployeeIds: string;
    constructor() {
        this.OrganizationId = 0
        this.OutletId = 0
        this.FromDate = ""
        this.ToDate = ""
        this.StatusIds = ""
        this.TypeIds = ""
        this.EmployeeIds = ""
    }
}