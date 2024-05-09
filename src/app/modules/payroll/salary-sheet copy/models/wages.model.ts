export class WagesRequest {
    EmployeeId: number = 0;
    WagesId: number = 0;
    WagesDate: string | any = new Date();
    WagesAmount: number = 0;
    Installment: number = 0;
    Advance: number = 0;
    NetPay: number = 0;
    OutletId: number = 0;
    Remarks: string = "";
    DepartmentsName: string = "";
    EmployeeName: string = "";
    Selected: boolean = false;
    IsPosted: boolean = false;
}

export class WagesFooter {
    TotalWagesAmount: number = 0;
    TotalInstallment: number = 0;
    TotalAdvance: number = 0;
}