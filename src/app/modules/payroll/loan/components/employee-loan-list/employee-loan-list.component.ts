import { Component, Input, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { EmployeeLoanRequest } from '../../models/employee-loan.model';
import { EmloyeeLoanService } from '../../services/emloyee-loan.service';
import { AddEmployeeLoanComponent } from '../add-employee-loan/add-employee-loan.component';
import { EmployeeBasicRequest } from '../../../employee/models/employee.model';

@Component({
  selector: 'app-employee-loan-list',
  templateUrl: './employee-loan-list.component.html',
  styleUrls: ['./employee-loan-list.component.scss']
})
export class EmployeeLoanListComponent implements OnInit {
  @Input() EmployeeId: number = 0;
  @Input() EmployeeName: string = "";

  loanList: EmployeeLoanRequest[] = [];
  LoanMenuItems: MenuItem[] = [];

  LoanActions = [
    "Adjust Loan",
  ]
  loanId: string = "";

  constructor(
    private _messageService: MessageService,
    private _employeeLoanService: EmloyeeLoanService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {

    this._employeeLoanService.getEmployeeLoanList(this.EmployeeId).subscribe(
      (data: EmployeeLoanRequest[]) => {
        if (data) {
          this.loanList = data;
        }
      }
    )
  }

  onRowSelect(event: any, selectedLoanData: EmployeeLoanRequest) {
    switch (event.data) {
      case 'Edit':
        this.addEmployeeLoan(selectedLoanData)
        break;
      case 'Delete':
        this.removeLoan(selectedLoanData)
        break;
      default:
        break;
    }
  }

  addEmployeeLoan(loan?: EmployeeLoanRequest) {
    let employeeData = {
      EmployeeLoan: loan,
      EmployeeId: this.EmployeeId,
      EmployeeName: this.EmployeeName
    }
    let dialogRef = this._dialogService.open(AddEmployeeLoanComponent, {
      header: `${loan?.EmployeeLoanId ?? 0 > 0 ? 'Edit' : 'Add'} Loan`,
      data: employeeData,
    });
    dialogRef.onClose.subscribe((x: any) => {
      this.ngOnInit();
    })
  }

  removeLoan(loan: EmployeeLoanRequest) {
    this.loanId = loan.EmployeeLoanId.toString();
    setTimeout(() => {
      this._confirmationService.confirm({
        message: `Are you sure you want to delete ${loan.TypeName}?`,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._employeeLoanService.removeEmployeeLoan(loan.EmployeeLoanId).subscribe(
            (x: boolean) => {
              if (x) {
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Loan Deleted Successfully', life: 3000 });
                this.ngOnInit();
              }
            }
          )
        },
        reject: () => {
        }
        , key: loan.EmployeeLoanId.toString()
      });
    }, 10)
  }

  public printLoanLedger() {

  }
}
