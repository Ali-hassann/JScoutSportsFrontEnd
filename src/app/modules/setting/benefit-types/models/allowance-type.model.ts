export class AllowanceTypeRequest {
    AllowanceTypeId: number;
    Name: string;
    OutletId: number;
    OutletName: string;
    OrganizationId: number;

    constructor() {
        this.AllowanceTypeId = 0;
        this.Name = "";
        this.OutletId = 0;
        this.OutletName = "";
        this.OrganizationId = 0;
    }
}