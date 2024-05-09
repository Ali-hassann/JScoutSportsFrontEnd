export class UserRightsResponse {
    constructor() {
        this.RightsId = 0;
        this.RightsName = "";
        this.RightsArea = "";
        this.Description = "";
        this.UserRightsId = 0;
        this.HasAccess = false;
    }

    RightsId: number;
    RightsName: string;
    RightsArea: string;
    Description: string;
    UserRightsId: number;
    HasAccess: boolean;
}