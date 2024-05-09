import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { AllowanceTypeRequest } from '../../models/allowance-type.model';
import { AllowanceTypeService } from '../../services/allowance-type.service';
import { AllowanceTypeQuery } from '../../states/allowance-types.query';

@Component({
  selector: 'app-add-allowance-type',
  templateUrl: './add-allowance-type.component.html',
  styleUrls: ['./add-allowance-type.component.scss']
})
export class AddAllowanceTypeComponent implements OnInit {

  allowanceTypeRequest: AllowanceTypeRequest = new AllowanceTypeRequest()
  allowanceForm: FormGroup | any;
  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    public _configDialog: DynamicDialogConfig,
    private service: MessageService,
    private _DepartmentQuery: AllowanceTypeQuery,
    private _departmentService: AllowanceTypeService,
    private _formBuilder: FormBuilder,
  ) {
    this.allowanceTypeRequest = _configDialog?.data ?? new AllowanceTypeRequest();
  }

  ngOnInit(): void {
    this.buildForm();
    if (this.allowanceTypeRequest.AllowanceTypeId > 0) {
      CommonHelperService.assignObjectValuesToForm(this.allowanceForm, this.allowanceTypeRequest)
    }
  }

  public Close() {
    this._configDialogRef.close();
  }
  public submit() {
    if (!(this.allowanceForm.invalid)) {
      this.allowanceTypeRequest = new AllowanceTypeRequest();
      CommonHelperService.assignFormValuesToObject(this.allowanceForm, this.allowanceTypeRequest);
      this.allowanceTypeRequest.OrganizationId = this._authQuery.PROFILE.OrganizationId;
      if (this.allowanceTypeRequest.AllowanceTypeId > 0) {
        this.updateallowanceType();
      }
      else {
        this.addallowanceType();
      }
    }
    else {
      this.service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }

  }

  private addallowanceType() {
    this._departmentService.addAllowanceType(this.allowanceTypeRequest).subscribe(
      (x: AllowanceTypeRequest) => {
        if (x) {
          this._DepartmentQuery.addAllowanceType(x);
          this.service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
        else {
          this.service.add({ severity: 'error', summary: 'Saved Sucessfully', detail: 'Something went wrong' });
        }
      }
    )

  }
  private updateallowanceType() {
    this._departmentService.updateAllowanceType(this.allowanceTypeRequest).subscribe(
      (x: AllowanceTypeRequest) => {
        if (x) {
          this._DepartmentQuery.updateAllowanceType(x);
          this.service.add({ severity: 'success', summary: 'updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
        else {
          this.service.add({ severity: 'error', summary: 'not saved', detail: 'Something went wrong' });
        }
      }
    )
  }

  private buildForm(): void {
    this.allowanceForm = this._formBuilder.group({
      AllowanceTypeId: [0, []],
      OrganizationId: [this._authQuery.OrganizationId, [Validators.required]],
      OutletId: [this._authQuery.OutletId, [Validators.required]],
      Name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
    });
  }

}
