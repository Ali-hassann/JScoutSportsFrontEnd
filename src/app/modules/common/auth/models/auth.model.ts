import { BaseResponse } from "src/app/shared/models/base.model"
import { OrganizationProfile } from "../../institute-profile/models/institute-profile.model"

export class UserProfile {
    constructor() {
        this.OutletId = 0;
        this.Email = "";
        this.UserName = "";
        this.Id = "";
        this.PhoneNumber = "";
        this.OrganizationId = 0;
        this.Since = "";
        this.RoleName = "";
        this.Token = "";
        this.ImagePath = "";
        this.OrganizationProfile = new OrganizationProfile();
        this.CurrentOutletId = 0;
        this.FirstName = "";
        this.LastName = ""
    }

    OutletId: number;
    Email: string;
    UserName: string;
    Id: string;
    PhoneNumber: string;
    OrganizationId: number;
    Since: string;
    RoleName: string;
    Token: string;
    ImagePath: string;
    OrganizationProfile: OrganizationProfile;
    CurrentOutletId: number;
    FirstName: string;
    LastName: string;
}

export class SignInRequest {
    constructor() {
        this.UserName = "";
        this.Password = "";
    }

    UserName: string;
    Password: string;
}

export class ChangePasswordResponse extends BaseResponse { }