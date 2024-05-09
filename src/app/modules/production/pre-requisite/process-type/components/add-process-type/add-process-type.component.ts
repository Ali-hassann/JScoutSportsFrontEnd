import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { ProcessTypeRequest } from '../../models/process-type.model';
import { ProcessTypeService } from '../../services/process-type.service';
import { ProcessTypeQuery } from '../../states/process-type.query';
import { MainProcessType } from 'src/app/shared/enums/main-process-type.enum';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';

@Component({
  selector: 'app-add-Process-type',
  templateUrl: './add-Process-type.component.html'
})
export class AddProcessTypeComponent implements OnInit {

  processType: ProcessTypeRequest = new ProcessTypeRequest();
  mainProcessTypeList = [
    { name: "Press Cutting", value: MainProcessType.PressCutting },
    { name: "Laser Cutting", value: MainProcessType.LaserCutting },
    { name: "Sublimation", value: MainProcessType.Sublimation },
    { name: "Pu/Pvc Printing", value: MainProcessType.PuPvcPrinting },
    { name: "Silicon Printing", value: MainProcessType.SiliconPrinting },
    { name: "Stitching", value: MainProcessType.Stitching },
    { name: "Rubber Injection", value: MainProcessType.RubberInjection },
    { name: "Embossing", value: MainProcessType.Embossing },
    { name: "Packing", value: MainProcessType.Packing },
    { name: "Contract", value: MainProcessType.Contract },
  ];

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _processTypeService: ProcessTypeService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _processTypeQuery: ProcessTypeQuery
  ) {

    if (_configDialog?.data) {
      CommonHelperService.mapSourceObjToDestination(_configDialog?.data, this.processType);
    }
  }

  ngOnInit(): void {
  }

  public Close() {
    this._configDialogRef.close();
  }

  public submit(f: NgForm) {
    if (!f.invalid) {
      if (this.processType.ProcessTypeId > 0) {
        this.UpdateProcessType();
      }
      else {
        this.addProcessType();
      }
    }
    else {
      this._service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  private addProcessType() {
    this._processTypeService.addProcessType(this.processType).subscribe(
      (x: ProcessTypeRequest) => {
        if (x) {
          this._processTypeQuery.addProcessType(x);
          this.processType.ProcessTypeName = "";
          this.processType.ProcessTypeId = 0;
          this._service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
        }
      }
    )
  }

  private UpdateProcessType() {
    this._processTypeService.updateProcessType(this.processType).subscribe(
      (x: any) => {
        if (x) {
          this._processTypeQuery.updateProcessType(x);
          this._service.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
      }
    )
  }
}
