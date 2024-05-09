import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AllowanceTypeRequest } from 'src/app/modules/setting/benefit-types/models/allowance-type.model';
import { AllowanceTypeQuery } from 'src/app/modules/setting/benefit-types/states/allowance-types.query';
import { EmployeeAllowancesRequest } from '../../models/employee-allowance.model';
import { EmployeeAllowanceService } from '../../services/employee-allowance.service';

@Component({
  selector: 'app-add-employee-allowance',
  templateUrl: './add-employee-allowance.component.html',
  styleUrls: ['./add-employee-allowance.component.scss']
})
export class AddEmployeeAllowanceComponent implements OnInit {

  employeeAllowance: EmployeeAllowancesRequest = new EmployeeAllowancesRequest()
  allowanceTypeList: AllowanceTypeRequest[] = []
  employeeId: number = 0;
  constructor(
    public _configDialogRef: DynamicDialogRef,
    // private _authQuery: AuthQuery,
    private _employeeAllowanceService: EmployeeAllowanceService,
    public _configDialog: DynamicDialogConfig,
    private service: MessageService,
    private _benefitTypeQuery: AllowanceTypeQuery
  ) {
    this.employeeAllowance = _configDialog?.data.EmployeeAllowancesRequest ?? new EmployeeAllowancesRequest();
  }

  ngOnInit(): void {
    this.employeeId = this._configDialog?.data.EmployeeId;
    this._benefitTypeQuery.allowanceTypeList$.subscribe(
      (data: AllowanceTypeRequest[]) => {
        if (data) {
          this.allowanceTypeList = data;
        }
      }
    )
  }

  public Close(data?: any) {
    this._configDialogRef.close(data);
  }

  public submit(f: NgForm) {
    if (!f.invalid) {
      
      let request: EmployeeAllowancesRequest = new EmployeeAllowancesRequest();
      request = this.employeeAllowance;
      // request.OrganizationId = this._authQuery.PROFILE.OrganizationId;
      // request.OutletId = this._authQuery.PROFILE.OutletId;
      request.EmployeeId = this.employeeId;
      if (request.EmployeeAllowancesId > 0) {
        this.UpdateAllowance(request);
      }
      else {
        this.addAllowance(request);
      }
    }
    else {
      this.service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  private addAllowance(request: EmployeeAllowancesRequest) {
    this._employeeAllowanceService.addAllowance(request).subscribe(
      (x: EmployeeAllowancesRequest) => {
        if (x) {
          this.service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          this.Close(x);
        }
      }
    )
  }

  private UpdateAllowance(request: EmployeeAllowancesRequest) {
    this._employeeAllowanceService.updateAllowance(request).subscribe(
      (x: any) => {
        if (x) {
          this.service.add({ severity: 'success', summary: 'updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close(x);
        }
      }
    )
  }
}
