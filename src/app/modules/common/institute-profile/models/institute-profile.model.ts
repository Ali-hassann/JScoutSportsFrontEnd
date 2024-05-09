export class OrganizationProfile {
    OrganizationId: number = 0;
    InstituteName: string = "";
    OwnerName: string = "";
    ImagePath: string = "";
    FoundedYear: string = "";
    OutletId: number = 0;
    OutletName: string = "";
    PrincipalName: string = "";
    ContactNumber : string = "";
    Address: string = "";
    Email: string = "";
    Country: string = "";
    State: number = 0;
    City: number = 0;
    IsDefault: boolean = false;
    IsActive: boolean = false;
    StartDate: Date | any;
    EndDate: Date | any;
}

export class OutletRequest {
    OrganizationId: number = 0;
    LogoPath: string = "";
    FoundedYear: string = "";
    OutletId: number = 0;
    OutletName: string = "";
    PrincipalName: string = "";
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
}

export class OrganizationLogo {
    LogoId: number = 0;
    Description: string = "";
    LogoPath: string = "";
    OutletId: number = 0;
}