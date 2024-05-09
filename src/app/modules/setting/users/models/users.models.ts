export class Users {
    Id: string = "";
    UserName: string = "";
    ImagePath: string = "";
    Selected: boolean = false;
    OrganizationId: number = 0;
    Password: string = ""
    OutletId: number = 0;
    RoleName: string = "";
    RoleDescription: string = "";
    FirstName: string = "";
    LastName: string = "";
    IsDeleted: boolean = false;
    OutletName: string = "";
    Email: string = ""
    PhoneNumber: string = "";
    LockoutEnabled: boolean = true;
    IsActive: boolean = false;
}

export class ChangePassword {
    UserName: string = "";
    ConfirmPassword: string = "";
    NewPassword: string = "";
    CurrentPassword: string = "";
    Password: string = "";
}

export class SuccessMessageResponse {
    Success: boolean = false;
    Message: string = "";
}

export class UserRightsBaseResponse {

    constructor() {
        this.RightsId = 0;
        this.RightsName = "";
        this.Description = "";
        this.RightsArea = "";
        this.ParentName = "";
        this.UserRightsId = 0;
        this.Id = "";
        this.HasMenuRights = false;
        this.HasSubMenuRights = false;
        this.HasAccess = false;
    }

    RightsId: number;
    RightsName: string;
    Description: string;
    RightsArea: string;
    ParentName: string;
    UserRightsId: number;
    Id: string;
    HasMenuRights: boolean;
    HasSubMenuRights: boolean;
    HasAccess: boolean;
}

export class SubMenuRightsResponse {

    constructor() {
        this.SubMenuSelectAll = false;
        this.SubMenuRightsArea = "";
        this.SubMenuRight = new UserRightsBaseResponse();
        this.SubMenuRightsList = [];
    }

    SubMenuSelectAll: boolean;
    SubMenuRightsArea: string;
    SubMenuRight: UserRightsBaseResponse;
    SubMenuRightsList: UserRightsBaseResponse[];
}

export class UserRightsResponse {
    constructor() {
        this.MenuSelectAll = false;
        this.MenuRightsArea = "";
        this.MenuRight = new UserRightsBaseResponse();
        this.MenuRightsList = [];
    }

    MenuSelectAll: boolean;
    MenuRightsArea: string;
    MenuRight: UserRightsBaseResponse;
    MenuRightsList: SubMenuRightsResponse[];
}