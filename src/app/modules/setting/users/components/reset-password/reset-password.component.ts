import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VALIDATION_TYPE } from 'src/app/shared/enums/validation-type.enum';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { ChangePassword } from '../../models/users.models';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public userLoginForm: FormGroup = this._formBuilder.group({})
  public changePassword: ChangePassword = new ChangePassword();

  constructor(
    private _formBuilder: FormBuilder,
    private _dynamicDialogRef: DynamicDialogRef,
    private _usersService: UsersService,
    private _dynamicDialogConfig: DynamicDialogConfig,
    private confirmationService: ConfirmationService

  ) { }

  ngOnInit(): void {
    this.buildForm();
    if (this._dynamicDialogConfig.data) {
      this.userLoginForm.controls["UserName"].setValue(this._dynamicDialogConfig.data.UserName);
    }
  }


  public addUser() {
    if (this.userLoginForm.invalid) {
      this.userLoginForm.markAllAsTouched();
    }
    else {
      this.confirmationService.confirm({
        // target: event?.target,
        message: 'Are you sure you want to reset password?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          //confirm action
          CommonHelperService.assignFormValuesToObject(this.userLoginForm, this.changePassword);
          this._usersService.resetPassword(this.changePassword).subscribe(
            (user: any) => {
              if (user.Success) {
                this._dynamicDialogRef.close();
              }
            }
          )
        },
        reject: () => {
          //reject action
        }
      });

    }

  }




  buildForm() {
    this.userLoginForm = this._formBuilder.group({
      UserName: ["", [Validators.required, Validators.minLength(5), Validators.maxLength(20), CommonHelperService.getValidator(VALIDATION_TYPE.USERNAME)]],
      ConfirmPassword: ["", [CommonHelperService.getValidator(VALIDATION_TYPE.PASSWORD), Validators.required]],
    }
    );


  }
}