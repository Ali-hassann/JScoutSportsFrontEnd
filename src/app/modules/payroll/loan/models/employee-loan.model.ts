export class EmployeeLoanRequest {
    OutletId: number = 0;
    EmployeeLoanId: number = 0;
    LoanAmount: number = 0;
    Installment: number = 0;
    DeductAmount: number = 0;
    PaidAmount: number = 0;
    LoanDate: Date | String = new Date();
    LoanTypeId: number = 1;
    TypeName: string = ""
    EmployeeId: number = 0;
    EmployeeName: string = "";
    DesignationName: string = "";
    DepartmentsName: string = "";
    Balance: number = 0;
    VoucherMasterId: number = 0;
    Remarks: string = "";
    IsApproved: boolean = false;
    IsAdvanceDeducted: boolean = false;
    IsToCreateVoucher: boolean = false;
    Selected: boolean = false;
    constructor() {
        this.LoanDate = new Date();
    }
}
