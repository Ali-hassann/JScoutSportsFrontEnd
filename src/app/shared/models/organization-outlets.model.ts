export class OrganizationOutletRequest {
    OrganizationId: number = 0;
    LogoPath: string = "";
    FoundedYear: string = "";
    OutletId: number = 0;
    OutletName: string = "";
    OutletOwnerName: string = "";
    Address: string = "";
    Country: string = "";
    State: number = 0;
    City: number = 0;
    ContactNumber: string = "";
    Email: string = "";
    ImagePath: string = "";
    IsDefault: boolean = false;
    IsActive: boolean = false;
    Selected: boolean = false;
    IsGloballySelected: boolean = false;
    StartingTime: any;
    EndTime: any;
    BranchWorkingDays: number[] = [];
    WorkingDaysCount: number = 0;
    IsToUpdateWorkingDays: boolean = false;
    IsToDeleteImage: boolean = false;
}