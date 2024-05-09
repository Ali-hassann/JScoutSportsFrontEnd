import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { OrgRoleRightsResponse, OrgRoleRightsRequest, OrganizationRoleRequest, SubMenuOrgRoleRightsResponse, OrgRoleRightsBaseResponse } from '../../models/organization-role.model';
import { OrganizationRoleService } from '../../services/organization-role.service';

@Component({
  selector: 'app-role-rights',
  templateUrl: './role-rights.component.html',
  styleUrls: ['./role-rights.component.scss']
})
export class RoleRightsComponent implements OnInit {

  roleRightsResponseList: OrgRoleRightsResponse[] = [];
  orgRole: OrganizationRoleRequest = new OrganizationRoleRequest();
  rightsListToUpdate: any = [];

  constructor(
    private _authQuery: AuthQuery
    , private _roleRightsService: OrganizationRoleService
    , public _configDialog: DynamicDialogConfig
    , private _messageService: MessageService
    , private _dynamicDialogRef: DynamicDialogRef
  ) {
    this.orgRole = this._configDialog?.data;
  }

  ngOnInit(): void {

    this.gettingRoleRights();
  }

  gettingRoleRights() {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait rights are being fetched.', sticky: true });
    this._roleRightsService.getOrgRoleRightsList(this._authQuery.PROFILE.OrganizationId, this.orgRole.OrganizationRoleId).subscribe(x => {
      this._messageService.clear();
      if (x?.length > 0) {
        this._messageService.add(
          { severity: 'success', summary: 'Successful', detail: 'Rights are fetched successfuly.', life: 3000 }
        );
        this.roleRightsResponseList = x;
      } else {
        this._messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'Please try again.',
          life: 3000
        });
      }
    });
  }

  saveRoleRights() {
    this.rightsListToUpdate = [];
    this.roleRightsResponseList?.forEach(x => {
      if (x.MenuRight?.HasAccess) {
        this.rightsListToUpdate.push(x.MenuRight);
      }
      x.MenuRightsList?.forEach(c => {
        if (c.SubMenuRight?.HasAccess) {
          this.rightsListToUpdate.push(c.SubMenuRight);
        }
        c.SubMenuRightsList?.forEach(d => {

          if (d.HasAccess) {
            let roleRightsRequest: OrgRoleRightsRequest = new OrgRoleRightsRequest();
            roleRightsRequest.OrganizationId = d.OrganizationId;
            roleRightsRequest.OrganizationRoleId = d.OrganizationRoleId;
            roleRightsRequest.OrgRoleRightsId = d.OrgRoleRightsId;
            roleRightsRequest.RightsId = d.RightsId;
            this.rightsListToUpdate.push(roleRightsRequest);
          }
        })
      });
    });

    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait rights are being saved.', sticky: true });

    if (this.orgRole?.RightsCount == 0) {
      this._roleRightsService.addRightsToOrganizationRoles(this.rightsListToUpdate).subscribe(x => {
        this._messageService.clear();
        if (x) {
          this._messageService.add(
            { severity: 'success', summary: 'Successful', detail: 'Rights are saved successfuly.', life: 3000 }
          );
          this._dynamicDialogRef.close();
        } else {
          this._messageService.add({
            severity: 'error',
            summary: 'Error Message',
            detail: 'An error occurred. Please try again.',
            life: 3000
          });
          this._dynamicDialogRef.close();
        }
      }
      );
    } else {
      this._roleRightsService.updateRightsToOrganizationRoles(this.rightsListToUpdate).subscribe(x => {
        this._messageService.clear();
        if (x) {
          this._messageService.add(
            { severity: 'success', summary: 'Successful', detail: 'Rights are saved successfuly.', life: 3000 }
          );
          this._dynamicDialogRef.close();
        } else {
          this._messageService.add({
            severity: 'error',
            summary: 'Error Message',
            detail: 'An error occurred. Please try again.',
            life: 3000
          });
          this._dynamicDialogRef.close();
        }
      });
    }
  }

  close() {
    this._dynamicDialogRef.close();
  }

  selectAllRightsByParent(parent: OrgRoleRightsResponse, event: any) {
    if (event?.checked) {
      parent.MenuSelectAll = true;
      parent.MenuRightsList.forEach(c => {
        c.SubMenuSelectAll = true;
        c.SubMenuRight.HasAccess = true;
        this.selectAllRightsByChild(c.SubMenuRightsList, parent, event);
      });
    } else {
      parent.MenuSelectAll = false;
      parent.MenuRightsList.forEach(c => {
        c.SubMenuSelectAll = false;
        c.SubMenuRight.HasAccess = false;
        this.selectAllRightsByChild(c.SubMenuRightsList, parent, event);
      });
    }
  }



  onSectionChildChange(sectionChild: SubMenuOrgRoleRightsResponse, parent: OrgRoleRightsResponse) {
    let child = sectionChild.SubMenuRightsList.find(x => x.HasAccess);
    if (child && sectionChild.SubMenuRight) {
      sectionChild.SubMenuRight.HasAccess = true;
      parent.MenuRight.HasAccess = true;
    } else {
      sectionChild.SubMenuRight.HasAccess = false;
      let anyChildRight = parent.MenuRightsList.find(x => x.SubMenuRight.HasAccess);
      if (!anyChildRight) {
        parent.MenuRight.HasAccess = false;
      }
    }
  }


  selectAllRightsByChild(childList: OrgRoleRightsBaseResponse[], parent: OrgRoleRightsResponse, event: any) {

    if (event?.checked) {
      childList.forEach(e => {
        e.HasAccess = true;
      });
      if (parent.MenuRight) {
        parent.MenuRight.HasAccess = true;
      }
    } else {
      childList.forEach(e => {
        e.HasAccess = false;
      });
      let anyChildRight = parent.MenuRightsList.find(x => x.SubMenuRight.HasAccess);
      if (!anyChildRight && parent.MenuRight) {
        parent.MenuRight.HasAccess = false;
      }
    }
  }
}
