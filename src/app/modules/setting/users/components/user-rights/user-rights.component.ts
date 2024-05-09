import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserRightsRequest } from '../../../rights/models/user-rights.model';
import { SubMenuRightsResponse, UserRightsBaseResponse, UserRightsResponse, Users } from '../../models/users.models';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-user-rights',
  templateUrl: './user-rights.component.html',
  styleUrls: ['./user-rights.component.scss']
})

export class UserRightsComponent implements OnInit {

  roleRightsResponseList: UserRightsResponse[] = [];
  user: Users = new Users();
  rightsListToUpdate: UserRightsRequest[] = [];

  constructor(
    private _roleRightsService: UsersService
    , private _messageService: MessageService
    , public _configDialog: DynamicDialogConfig
    , private _dynamicDialogRef: DynamicDialogRef
  ) {
    this.user = this._configDialog?.data;
  }

  ngOnInit(): void {

    this.gettingRoleRights();
  }

  gettingRoleRights() {
    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait rights are being fetched.', sticky: true });
    this._roleRightsService.getUserAllRightsById(this.user.Id).subscribe(x => {
      this._messageService.clear();
      if (x?.length > 0) {
        this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Rights are fetched successfuly.', life: 3000 });
        this.roleRightsResponseList = x;
      } else {
        this._messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred. Please try again later.',
          life: 3000
        });
      }
    });
  }

  saveRoleRights() {
    this.rightsListToUpdate = [];
    this.roleRightsResponseList?.forEach(x => {
      if (x.MenuRight?.ParentName?.length > 0) {
        this.rightsListToUpdate.push(x.MenuRight);
      }
      x.MenuRightsList?.forEach(c => {
        if (c.SubMenuRight?.ParentName?.length > 0) {
          this.rightsListToUpdate.push(c.SubMenuRight);
        }
        c.SubMenuRightsList?.forEach(d => {
          let roleRightsRequest: UserRightsRequest = new UserRightsRequest();
          roleRightsRequest.HasAccess = d.HasAccess;
          roleRightsRequest.UserRightsId = d.UserRightsId;
          roleRightsRequest.RightsId = d.RightsId;
          roleRightsRequest.Id = d.Id;
          this.rightsListToUpdate.push(roleRightsRequest);
        })
      });
    });

    this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Please wait rights are being saved.', sticky: true });

    // if (this.user?.RightsCount == 0) {
    this._roleRightsService.saveUserRightsList(this.rightsListToUpdate).subscribe(x => {
      this._messageService.clear();
      if (x) {
        this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Rights are saved successfuly.', life: 3000 });
        this._dynamicDialogRef.close();
      } else {
        this._messageService.add({
          severity: 'error',
          summary: 'Error Message',
          detail: 'An error occurred. Please try again later.',
          life: 3000
        });;
        this._dynamicDialogRef.close();
      }
    }
    );
  }

  close() {
    this._dynamicDialogRef.close();
  }

  selectAllRightsByParent(parent: UserRightsResponse, event: any) {
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



  onSectionChildChange(sectionChild: SubMenuRightsResponse, parent: UserRightsResponse) {
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


  selectAllRightsByChild(childList: UserRightsBaseResponse[], parent: UserRightsResponse, event: any) {

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
