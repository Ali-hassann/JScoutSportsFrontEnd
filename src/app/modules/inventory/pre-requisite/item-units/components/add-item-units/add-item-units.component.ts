import { Component, OnInit } from '@angular/core';
import { UnitRequest } from '../../models/item-units.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { MessageService } from 'primeng/api';
import { UnitsQuery } from '../../states/item-units.query';
import { ItemUnitsService } from '../../services/item-units.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-item-units',
  templateUrl: './add-item-units.component.html',
  styleUrls: ['./add-item-units.component.scss']
})
export class AddItemUnitsComponent implements OnInit {


  itemUnit: UnitRequest = new UnitRequest()
  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _itemUnitsService: ItemUnitsService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _unitsQuery: UnitsQuery
  ) {
    if (_configDialog?.data) {
      let itemTypeObject: UnitRequest = new UnitRequest();
      itemTypeObject.UnitName = _configDialog?.data?.UnitName;
      itemTypeObject.UnitId = _configDialog?.data?.UnitId;
      this.itemUnit = itemTypeObject;
    }
  }

  ngOnInit(): void {

  }

  public Close() {
    this._configDialogRef.close();
  }

  public submit(f: NgForm) {
    if (!f.invalid) {
      let request: UnitRequest = new UnitRequest();
      request.UnitId = this.itemUnit.UnitId;
      request.UnitName = this.itemUnit.UnitName;
      request.OutletId = this._authQuery?.PROFILE?.OutletId;
      if (request.UnitId > 0) {
        this.UpdateItemUnit(request);
      }
      else {
        this.addItemUnit(request);
      }
    }
    else {
      this._service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  private addItemUnit(request: UnitRequest) {
    this._itemUnitsService.addUnit(request).subscribe(
      (x: UnitRequest) => {
        if (x) {
          this._unitsQuery.addUnit(x);
          this._service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
        }
      }
    )
  }

  private UpdateItemUnit(request: UnitRequest) {
    this._itemUnitsService.updateUnit(request).subscribe(
      (x: any) => {
        if (x) {
          this._unitsQuery.updateUnit(x);
          this._service.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
      }
    )
  }
}
