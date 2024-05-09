import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { environment } from 'src/environments/environment.prod';
import { AuthQuery } from '../modules/common/auth/states/auth.query';
import { UserProfile } from '../modules/common/auth/models/auth.model';
import { DialogService } from 'primeng/dynamicdialog';
import { ChangePasswordComponent } from '../modules/setting/users/components/change-password/change-password.component';
import { CommonHelperService } from '../shared/services/common-helper.service';
// import { ChangePasswordComponent } from '../modules/setting/users/components/change-password/change-password.component';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [DialogService]

})
export class AppTopBarComponent implements OnInit {

    items!: MenuItem[];
    public baseUrl = environment.baseUrlApp ?? "";
    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    userProfile: UserProfile = new UserProfile();

    constructor(
        public layoutService: LayoutService,
        public _authQuery: AuthQuery,
        private _dialogService: DialogService,
        private _commonHelperService: CommonHelperService
    ) {

    }
    ngOnInit(): void {
        this.userProfile = this._authQuery.PROFILE;
    }
    public changePaswordPopUp(): void {


        this._commonHelperService
            .loadModule
            (
                () => import('src/app/modules/setting/users/users.module')
                    .then(x => x.UsersModule)
            );

        let dialogRef = this._dialogService.open(ChangePasswordComponent, {
            header: `Change Password`,
            width: '70%',
            data: this.userProfile.UserName

        });
    }
}
