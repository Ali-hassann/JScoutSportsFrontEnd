import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { Can_View_Role } from 'src/app/shared/enums/rights.enum';
import { OrganizationRoleRequest } from '../../models/organization-role.model';
import { OrganizationRoleService } from '../../services/organization-role.service';
import { AddOrganizationRoleComponent } from '../add-organization-role/add-organization-role.component';
import { RoleRightsComponent } from '../role-rights/role-rights.component';

@Component({
  selector: 'app-organization-role-list',
  templateUrl: './organization-role-list.component.html',
  styleUrls: ['./organization-role-list.component.scss']
})
export class OrganizationRoleListComponent implements OnInit {

  public organizationRoleList: OrganizationRoleRequest[] = [];

  public selectedBranch: any = null;
  public clearMainHeadSearch: string = "";

  cols: any[] = [
    { field: 'Name', header: 'Name' },
  ];

  Can_View_Role = Can_View_Role;

  constructor(
    private _organizationRoleService: OrganizationRoleService,
    private _authQuery: AuthQuery,
    public _dialogService: DialogService,
    private _breadCrumbService: AppBreadcrumbService,
  ) {
  }


  public ngOnInit(): void {
    this.setBreadCrumb();
    this._organizationRoleService.getOrganizationRoleList(this._authQuery?.PROFILE?.OrganizationId).subscribe(
      (x: any) => {
        if (x) {
          this.organizationRoleList = x;
        }
      }
    )
  }


  private setBreadCrumb(): void {
    this._breadCrumbService.setBreadcrumbs([
      { label: 'Setting', routerLink: ['setting'] },
      { label: 'Organization Roles' }
    ]);
  }

  public addRoleDialog(organizationRole?: OrganizationRoleRequest): void {
    let dialogRef = this._dialogService.open(AddOrganizationRoleComponent, {
      header: 'Add Category',
      data: organizationRole,
      width: '35%',
    });

    dialogRef.onClose.subscribe((res: any) => {
      this.ngOnInit();
    })

  }

  public manageRights(organizationRole?: OrganizationRoleRequest): void {
    let dialogRef = this._dialogService.open(RoleRightsComponent, {
      header: `Manage Rights of ${organizationRole?.RoleName ?? ""}`,
      data: organizationRole,
      width: '90%',
      height: '90%',
    });

    dialogRef.onClose.subscribe((res: any) => {
      this.ngOnInit();
    })

  }

  public clear(table: Table): void {
    this.clearMainHeadSearch = "";
    table.clear();
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
