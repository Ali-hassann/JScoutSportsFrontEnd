import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { VALIDATION_TYPE } from 'src/app/shared/enums/validation-type.enum';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { DomainValidatorsService } from 'src/app/shared/services/domain-validators.service';
import { OrganizationRoleRequest } from '../../../organization-role/models/organization-role.model';
import { OrganizationRoleService } from '../../../organization-role/services/organization-role.service';
import { Users } from '../../models/users.models';
import { UsersService } from '../../services/users.service';
import { UserQuery } from '../../states/data-state/user-query';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  public parentFormData: Users = new Users();

  public addUserForm: FormGroup | any;
  public userProfileForm: FormGroup | any;
  public userLoginForm: FormGroup | any;

  public display: boolean = true;

  public userRoleList: OrganizationRoleRequest[] = [];
  isUpdated: boolean = false;

  constructor(
    private _parentDialogConfig: DynamicDialogConfig,
    private _dval: DomainValidatorsService,
    private _formBuilder: FormBuilder,
    private _usersService: UsersService,
    private _userQuery: UserQuery,
    private _authQuery: AuthQuery,
    private _messageService: MessageService,
    private _roleService: OrganizationRoleService,
    private _dynamicDialogRef: DynamicDialogRef,
    private confirmationService: ConfirmationService

  ) {

    this.parentFormData = this._parentDialogConfig.data ?? new Users();
    if (this.parentFormData.Id.length > 0) {
      this.isUpdated = true;

    }
  }

  public ngOnInit(): void {
    this.buildForm();
    this.assignParentFormData();
    this._roleService.getOrganizationRoleList(this._authQuery.OrganizationId).subscribe(res => {
      if (res?.length > 0) {
        this.userRoleList = res;
      }
    });
  }

  public addUser() {
    if (this.isUpdated) {

      // let tes = this.parentFormData.Email
      // let test = this.parentFormData.Email
      this.userLoginForm.controls["UserName"].setValue(this.parentFormData.UserName);
      this.userProfileForm.controls["Email"].setValue(this.parentFormData.Email);
      // this.parentFormData.UserName = this._parentDialogConfig.data.UserName;
    }

    if (this.userProfileForm.invalid || this.userLoginForm.invalid) {
      this.userLoginForm.markAllAsTouched();
      this.userProfileForm.markAllAsTouched();
    }
    else {
      this.parentFormData = new Users();
      CommonHelperService.assignFormValuesToObject(this.userLoginForm, this.parentFormData);
      CommonHelperService.assignFormValuesToObject(this.userProfileForm, this.parentFormData);
      this.parentFormData.OutletId = this._authQuery.OutletId;
      this.parentFormData.OrganizationId = this._authQuery.OrganizationId;

      if (this.parentFormData.Id.length > 0) {
        this.confirmationService.confirm({
          // target: event?.target,
          message: 'Are you sure you want to update user?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            //confirm action
            this._usersService.updateUser(this.parentFormData).subscribe((x: any) => {
              if (x) {
                this._userQuery.updateUser(x);
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated Successfully', life: 3000 });
                this._dynamicDialogRef.close();
              }
              else {
                this._messageService.add({
                  severity: 'error',
                  summary: 'Error Message',
                  detail: 'An error occurred. Please try again later.',
                  life: 3000
                });
              }
            })
          },
          reject: () => {
            //reject action
          }
        });

      }
      else {

        this._usersService.checkExistingUsernameEmail(this.parentFormData.UserName, this.parentFormData.Email).subscribe(
          (data: boolean) => {
            if (data) {
              this._messageService.add({
                severity: 'error',
                summary: 'Error Message',
                detail: 'UserName or Email already exist.',
                life: 3000
              });
            }
            else {
              this._usersService.addUser(this.parentFormData).subscribe(
                user => {
                  if (user) {
                    this._userQuery.addUsers([user]);
                    this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Added Successfully', life: 3000 });
                    this._dynamicDialogRef.close();

                  }
                }
              )
            }
          }
        );



      }

    }
  }

  private assignParentFormData(): void {

    this.userProfileForm = this.addUserForm.controls["UserPersonal"] as FormGroup;
    this.userLoginForm = this.addUserForm.controls["UserLogin"] as FormGroup;

    if (this.parentFormData) {
      this._dval.assignObjectValuesToForm(this.userProfileForm, this.parentFormData);
      this._dval.assignObjectValuesToForm(this.userLoginForm, this.parentFormData);

    }
  }

  private loginFormControlsValidation(): void {
    this.userLoginForm.controls['UserName'].disable();
    this.userLoginForm.controls['Password'].disable();
    this.userLoginForm.controls['ConfirmPassword'].disable();
    this.userLoginForm.controls['Password'].setValue("*****");
    this.userLoginForm.controls['ConfirmPassword'].setValue("*****");
    this.userLoginForm.controls['UserName'].setValidators([]);
    this.userLoginForm.controls['Password'].setValidators([]);
    this.userLoginForm.controls['ConfirmPassword'].setValidators([]);
  }

  public Close(): void {
    this._dynamicDialogRef.close();
  }

  private checkPasswordValidation(control: AbstractControl | any) {
    const password = control.get("Password").value;
    const confirmPassword = control.get("ConfirmPassword").value;
    if (password != confirmPassword) {
      control.get("ConfirmPassword").setErrors({ ConfirmPassword: true });
    }
  }

  private buildForm(): void {
    this.addUserForm = this._formBuilder.group({
      UserPersonal: this._formBuilder.group({
        Id: ["", []],
        OrganizationId: [this.parentFormData.OrganizationId],
        OutletName: ['', []],
        IsActive: [false, []],
        OutletId: [this._authQuery?.PROFILE?.CurrentOutletId, [Validators.required]],
        FirstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), this._dval.getValidator(VALIDATION_TYPE.ONLYNAME)]],
        LastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), this._dval.getValidator(VALIDATION_TYPE.ONLYNAME)]],
        PhoneNumber: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(13), this._dval.getValidator(VALIDATION_TYPE.PHONE)]],
        // LockoutEnabled: [true, [Validators.required]],
        Email: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.required, this._dval.getValidator(VALIDATION_TYPE.EMAIL)]]
      }),
      UserLogin: this._formBuilder.group({
        // RoleName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), this._dval.getValidator(VALIDATION_TYPE.ONLYNAME)]],
        UserName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(20), this._dval.getValidator(VALIDATION_TYPE.USERNAME)]],
        Password: ["", [Validators.minLength(8), Validators.maxLength(20), this._dval.getValidator(VALIDATION_TYPE.PASSWORD)]],
        ConfirmPassword: ["", [this._dval.getValidator(VALIDATION_TYPE.PASSWORD)]],
        OrganizationRoleId: [0, [Validators.required]]
      },
        {
          validator: this.checkPasswordValidation,
        })
    });
  }
}
