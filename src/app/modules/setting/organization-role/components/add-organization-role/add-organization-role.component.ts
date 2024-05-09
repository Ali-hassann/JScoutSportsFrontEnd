import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { OrganizationRoleRequest } from '../../models/organization-role.model';
import { OrganizationRoleService } from '../../services/organization-role.service';

@Component({
  selector: 'app-add-organization-role',
  templateUrl: './add-organization-role.component.html',
  styleUrls: ['./add-organization-role.component.scss']
})
export class AddOrganizationRoleComponent implements OnInit {

  organizationRole: OrganizationRoleRequest = new OrganizationRoleRequest()

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _organizationRoleService: OrganizationRoleService,
    public _configDialog: DynamicDialogConfig,
    private service: MessageService
  ) {
    this.organizationRole = _configDialog?.data ?? new OrganizationRoleRequest();
  }

  ngOnInit(): void {

  }

  public Close() {
    this._configDialogRef.close();
  }
  public submit(f: NgForm) {
    if (!f.invalid) {
      this.organizationRole.OrganizationId = this._authQuery.PROFILE.OrganizationId;
      if (this.organizationRole.OrganizationRoleId > 0) {
        this.UpdateRole();
      }
      else{
        this.addRole();
      }
    }
    else {
      this.service.add({ key: 'tst', severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }

  }

  private addRole() {
    this._organizationRoleService.addOrganizationRole(this.organizationRole).subscribe(
      (x: any) => {
        if (x) {
          this.service.add({ key: 'tst', severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
        }
      }
    )

  }
  private UpdateRole() {
    this._organizationRoleService.updateOrganizationRole(this.organizationRole).subscribe(
      (x: any) => {
        if (x) {
          this.service.add({ key: 'tst', severity: 'success', summary: 'updated Sucessfully', detail: 'Saved Sucessfully' });
        }
      }
    )

  }


}
