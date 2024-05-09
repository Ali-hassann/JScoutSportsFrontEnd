import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { DepartmentsRequest } from '../../models/department.model';
import { DepartmentService } from '../../services/department.service';
import { DepartmentQuery } from '../../states/departments.query';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.scss']
})
export class AddDepartmentComponent implements OnInit {

  public departmentForm: FormGroup | any;
  public departmentRequest: DepartmentsRequest = new DepartmentsRequest()
  departmentType = [
    { name: 'Production', value: 1 },
    { name: 'Official Staff', value: 2 },
    { name: 'Directors', value: 3 },]
  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _departmentService: DepartmentService,
    public _configDialog: DynamicDialogConfig,
    private service: MessageService,
    private _DepartmentQuery: DepartmentQuery,
    private _formBuilder: FormBuilder,

  ) {
    this.departmentRequest = _configDialog?.data ?? new DepartmentsRequest();
    this.departmentType
  }

  ngOnInit(): void {
    this.buildForm();
    if (this.departmentRequest.DepartmentsId > 0) {
      CommonHelperService.assignObjectValuesToForm(this.departmentForm, this.departmentRequest);
    }
  }

  public Close() {
    this._configDialogRef.close();
  }

  public submit() {
    if (!(this.departmentForm.invalid)) {
      this.departmentRequest = new DepartmentsRequest();
      CommonHelperService.assignFormValuesToObject(this.departmentForm, this.departmentRequest);
      this.departmentRequest.OrganizationId = this._authQuery.PROFILE.OrganizationId;
      if (this.departmentRequest?.DepartmentsId > 0) {
        this.UpdateDepartment();
      }
      else {
        this.addDepartment();
      }
    }
    else {
      this.service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  private addDepartment() {
    this._departmentService.addDepartment(this.departmentRequest).subscribe(
      (x: DepartmentsRequest) => {
        if (x) {
          this._DepartmentQuery.addDepartment(x);
          this.service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
        else {
          this.service.add({ severity: 'error', summary: 'Saved Sucessfully', detail: 'Something went wrong' });
        }
      }
    )
  }

  private UpdateDepartment() {
    this._departmentService.updateDepartment(this.departmentRequest).subscribe(
      (x: DepartmentsRequest) => {
        if (x) {
          this._DepartmentQuery.updateDepartment(x);
          this.service.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
      }
    )
  }

  private buildForm(): void {
    this.departmentForm = this._formBuilder.group({
      DepartmentsId: [0, []],
      OrganizationId: [this._authQuery.OrganizationId, [Validators.required, Validators.min(1)]],
      OutletId: [this._authQuery.OutletId, [Validators.required, Validators.min(1)]],
      Name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      Description: ['', []],
      DepartmentTypeId: [1, [Validators.required]],
    });
  }
}
