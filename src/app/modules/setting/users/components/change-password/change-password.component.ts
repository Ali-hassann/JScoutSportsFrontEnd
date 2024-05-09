import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChangePassword } from '../../models/users.models';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ChangePasswordComponent implements OnInit {

  public changePassword: ChangePassword = new ChangePassword();

  constructor(
    private _dynamicDialogRef: DynamicDialogRef,
    private _usersService: UsersService,
    private _dynamicDialogConfig: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    public _configDialogRef: DynamicDialogRef,
    private _messageService: MessageService,



  ) { }

  ngOnInit(): void {
    if (this._dynamicDialogConfig.data) {
      this.changePassword.UserName = this._dynamicDialogConfig.data;
    }
  }


  public submit(f: NgForm) {
    if (f.invalid) {
      this._messageService.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });

    }
    else {

      if (this.changePassword.ConfirmPassword == this.changePassword.Password) {
        this.confirmationService.confirm({
          // target: event?.target,
          message: 'Are you sure you want to change password?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this._usersService.changePassword(this.changePassword).subscribe(
              (user: any) => {
                if (user.Success) {
                  this._dynamicDialogRef.close();
                }
              }
            )
          },
          reject: () => {
            //reject action
          },
          key: "changePassword"
        });
      } else {
        this._messageService.add({ severity: 'error', summary: 'Password not matched', detail: 'Password and confirm password are not matched' });


      }



    }

  }


  public Close() {
    this._configDialogRef.close();
  }

}
