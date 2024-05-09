import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { Can_View_Users } from 'src/app/shared/enums/rights.enum';
import { Users } from '../../models/users.models';
import { UsersService } from '../../services/users.service';
import { UserQuery } from '../../states/data-state/user-query';
import { AddUserComponent } from '../add-user/add-user.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { UserRightsComponent } from '../user-rights/user-rights.component';

@Component({
    selector: 'app-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

    public usersList: Users[];
    public userRegisterRequestForm: FormGroup | any;
    isAdmin: boolean = false;
    Can_View_Users = Can_View_Users;
    selectedUser: Users = new Users();
    constructor(
        private _usersService: UsersService,
        private _usersQuery: UserQuery,
        private _dialogService: DialogService,
        private _breadcrumbService: AppBreadcrumbService,
        private _auth: AuthQuery,
        private confirmationService: ConfirmationService,
        private _messageService: MessageService,
    ) {
        this.usersList = [];
        if (this._auth.PROFILE.RoleName == "SuperAdmin") {
            this.isAdmin = true;
        }

    }

    public ngOnInit(): void {
        this.assignParentFormData();
        // if(!(this._usersQuery.hasEntity())){
        //     this._usersService.getUsersList();
        // }
        this.setBreadCrumb();

    }

    private setBreadCrumb(): void {
        this._breadcrumbService.setBreadcrumbs([
            { label: 'Setting', routerLink: ['setting'] },
            { label: 'Users' }
        ]);
    }



    deleteUser(user: Users) {
        this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait user is being deleted', sticky: true });

        this._usersService.deleteUser(user.Id).subscribe(res => {
            this._messageService.clear();
            if (res.Success) {
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'User deleted successfully', life: 3000 });
                this._usersQuery.removeById(user.Id);
                this.usersList = this._usersQuery.getAll();
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    private assignParentFormData(): void {
        this.usersList = this._usersQuery.getAll();
    }

    public showAddUserPopUp(user?: Users): void {
        let dialogRef = this._dialogService.open(AddUserComponent, {
            header: 'Add User',
            width: '70%',
            data: user ?? new Users()
        });
        dialogRef.onClose.subscribe((x: any) => {
            this.usersList = this._usersQuery.getAll();
        })
    }

    public showRightsPopUp(user?: Users): void {
        let dialogRef = this._dialogService.open(UserRightsComponent, {
            header: `Manage ${user?.UserName ?? ""} Rights`,
            width: '70%',
            data: user ?? new Users()
        });
    }

    public resetPaswordPopUp(user: Users): void {
        let dialogRef = this._dialogService.open(ResetPasswordComponent, {
            header: `Reset Password`,
            // width: '70%',
            data: user

        });
    }

    public changePaswordPopUp(userName: string): void {
        let dialogRef = this._dialogService.open(ChangePasswordComponent, {
            header: `Change Password`,
            width: '70%',
            data: userName

        });
    }

    getSelectedUser(user: Users) {
        this.selectedUser = user;
    }
    confirm(event: Event) {
        this.confirmationService.confirm({
            // target: event?.target,
            message: 'Are you sure you want to delete user?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //confirm action
                this.deleteUser(this.selectedUser);
            },
            reject: () => {
                //reject action
            }
        });
    }
}