import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { DesignationRequestResponse } from '../../models/benefit-type.model';
import { DesignationTypeService } from '../../services/designation-type.service';
import { DesignationTypeQuery } from '../../states/designation-type.query';

@Component({
  selector: 'app-add-designation-type',
  templateUrl: './add-designation-type.component.html',
  styleUrls: ['./add-designation-type.component.scss']
})
export class AddDesignationTypeComponent implements OnInit {

  designationRequest: DesignationRequestResponse = new DesignationRequestResponse()
  public designationForm: FormGroup | any;

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    public _configDialog: DynamicDialogConfig,
    private service: MessageService,
    private _DepartmentQuery: DesignationTypeQuery,
    private _departmentService: DesignationTypeService,
    private _formBuilder: FormBuilder,
  ) {
    this.designationRequest = _configDialog?.data ?? new DesignationRequestResponse();
  }

  ngOnInit(): void {
    this.buildForm();
    if (this.designationRequest.DesignationId > 0) {
      CommonHelperService.assignObjectValuesToForm(this.designationForm, this.designationRequest);
    }
  }

  public Close() {
    this._configDialogRef.close();
  }
  public submit() {
    if (!(this.designationForm.invalid)) {
      this.designationRequest=new DesignationRequestResponse();
      CommonHelperService.assignFormValuesToObject(this.designationForm, this.designationRequest)
      this.designationRequest.OrganizationId = this._authQuery.PROFILE.OrganizationId;
      if (this.designationRequest.DesignationId > 0) {
        this.UpdateDesignation();
      }
      else {
        this.addDesignation();
      }
    }
    else {
      this.service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }

  }

  private addDesignation() {
    this._departmentService.addDesignationType(this.designationRequest).subscribe(
      (x: DesignationRequestResponse) => {
        if (x) {
          this._DepartmentQuery.addDesignationType(x);
          this.service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
        else {
          this.service.add({ severity: 'error', summary: 'Saved Sucessfully', detail: 'Something went wrong' });
        }
      }
    )

  }
  private UpdateDesignation() {
    this._departmentService.updateDesignationType(this.designationRequest).subscribe(
      (x: DesignationRequestResponse) => {
        if (x) {
          this._DepartmentQuery.updateDesignationType(x);
          this.service.add({ severity: 'success', summary: 'updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
      }
    )
  }

  private buildForm(): void {
    this.designationForm = this._formBuilder.group({
      DesignationId: [0, []],
      OrganizationId: [this._authQuery.OrganizationId, [Validators.required, Validators.min(1)]],
      DesignationName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    });
  }


}
