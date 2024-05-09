export class OrganizationRoleRequest {
    OrganizationRoleId: number = 0;
    RoleName: string = "";
    NormalizedName: string = "";
    OrganizationId: number = 0;
    IsDefault: boolean = false;
    RightsCount: number = 0;
}

export class OrgRoleRightsRequest {
    constructor() {
        this.OrgRoleRightsId = 0;
        this.RightsId = 0;
        this.OrganizationRoleId = 0;
        this.OrganizationId = 0;
        this.RoleName = "";
        this.RightsName = "";
    }

    OrgRoleRightsId: number;
    RightsId: number;
    OrganizationRoleId: number;
    OrganizationId: number;
    RoleName: string;
    RightsName: string;
}

export class OrgRoleRightsBaseResponse extends OrgRoleRightsRequest {

    constructor() {
        super();
        this.Description = "";
        this.RightsArea = "";
        this.ParentName = "";
        this.HasMenuRights = false;
        this.HasSubMenuRights = false;
        this.HasAccess = false;
    }

    Description: string;
    RightsArea: string;
    ParentName: string;
    HasMenuRights: boolean;
    HasSubMenuRights: boolean;
    HasAccess: boolean;
}

export class SubMenuOrgRoleRightsResponse {

    constructor() {
        this.SubMenuRight = new OrgRoleRightsBaseResponse();
        this.SubMenuRightsList = [];
        this.SubMenuRightsArea = "";
        this.SubMenuSelectAll = false;
    }

    SubMenuSelectAll: boolean;
    SubMenuRightsArea: string;
    SubMenuRight: OrgRoleRightsBaseResponse;
    SubMenuRightsList: OrgRoleRightsBaseResponse[];
}

export class OrgRoleRightsResponse {

    constructor() {
        this.MenuSelectAll = false;
        this.MenuRightsArea = "";
        this.MenuRight = new OrgRoleRightsBaseResponse;
        this.MenuRightsList = [];
    }

    MenuSelectAll: boolean;
    MenuRightsArea: string;
    MenuRight: OrgRoleRightsBaseResponse;
    MenuRightsList: SubMenuOrgRoleRightsResponse[];
}