export class EmployeeAllowancesRequest {
    EmployeeAllowancesId: number;
    Amount: number;
    AllowanceTypeId: number;
    Name: string;
    EmployeeId: number;
    constructor() {
        this.EmployeeAllowancesId = 0;
        this.Amount = 0;
        this.AllowanceTypeId = 0;
        this.Name = "";
        this.EmployeeId = 0;
    }
}