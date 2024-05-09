import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { EmployeeLoanRequest } from '../../models/employee-loan.model';
import { EmloyeeLoanService } from '../../services/emloyee-loan.service';

@Component({
  selector: 'app-add-employee-loan',
  templateUrl: './add-employee-loan.component.html',
  styleUrls: ['./add-employee-loan.component.scss']
})
export class AddEmployeeLoanComponent implements OnInit {

  employeeLoan: EmployeeLoanRequest = new EmployeeLoanRequest();
  isAdvance: boolean = false;

  employeeLoanTypes = [
    { loanTypeId: 1, Name: "Loan" },
    { loanTypeId: 2, Name: "Advance" },
  ]
  employeeId: number = 0;
  employeeName: string = "";
  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _employeeLoanService: EmloyeeLoanService,
    public _configDialog: DynamicDialogConfig,
    private service: MessageService,
  ) {
    this.employeeLoan = _configDialog?.data.EmployeeLoan ?? new EmployeeLoanRequest();
    if (this.employeeLoan?.LoanTypeId == 2) {
      this.isAdvance = true;
      this.employeeLoan.Installment = 0;
    }
    this.employeeId = _configDialog?.data.EmployeeId ?? 0;
    this.employeeName = _configDialog?.data.EmployeeName ?? "";
    if (this.employeeLoan.EmployeeLoanId > 0) {
      this.employeeLoan.LoanDate = DateHelperService.getDatePickerFormat(this.employeeLoan.LoanDate.toString());
    }
  }

  ngOnInit(): void {
  }

  public onLoanTypeChange(event: number) {
    if (event == 2) {
      this.isAdvance = true;
      this.employeeLoan.Installment = 0;
    }
    else {
      this.isAdvance = false;
    }
  }

  public Close() {
    this._configDialogRef.close();
  }

  public submit(f: NgForm) {
    if (!f.invalid) {
      let request: EmployeeLoanRequest = new EmployeeLoanRequest();
      request = this.employeeLoan;
      request.OutletId = this._authQuery.PROFILE.OutletId;
      request.EmployeeId = this.employeeId;
      request.EmployeeName = this.employeeName;
      request.IsApproved = false;
      request.LoanDate = DateHelperService.getServerDateFormat(request.LoanDate.toString());
      if (request.EmployeeLoanId > 0) {
        this.UpdateLoan(request);
      }
      else {
        this.addLoan(request);
      }
    }
    else {
      this.service.add({ severity: 'warn', summary: 'Forms Field are invalid', detail: 'Validation failed' });
    }
  }

  private addLoan(request: EmployeeLoanRequest) {
    this._employeeLoanService.addEmployeeLoan(request).subscribe(
      (x: any) => {
        if (x) {
          this.service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
      }
    )
  }

  private UpdateLoan(request: EmployeeLoanRequest) {
    this._employeeLoanService.updateEmployeeLoan(request).subscribe(
      (x: any) => {
        if (x) {
          this.service.add({ severity: 'success', summary: 'updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close();
        }
      }
    )
  }
}
