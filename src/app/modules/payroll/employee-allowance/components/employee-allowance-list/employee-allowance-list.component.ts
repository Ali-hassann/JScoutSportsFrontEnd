import { Component, Input, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { EmployeeAllowancesRequest } from '../../models/employee-allowance.model';
import { EmployeeAllowanceService } from '../../services/employee-allowance.service';
import { AddEmployeeAllowanceComponent } from '../add-employee-allowance/add-employee-allowance.component';

@Component({
  selector: 'app-employee-allowance-list',
  templateUrl: './employee-allowance-list.component.html',
  styleUrls: ['./employee-allowance-list.component.scss']
})
export class EmployeeAllowanceListComponent implements OnInit {

  @Input() EmployeeId: number = 0;

  allowanceList: EmployeeAllowancesRequest[] = [];

  selectedAllowances: EmployeeAllowancesRequest[] = [];
  allowanceId: string = "";

  constructor(
    private _messageService: MessageService,
    private _employeeAllowanceService: EmployeeAllowanceService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    if (this.EmployeeId > 0) {
      this._employeeAllowanceService.getAllowanceList(this.EmployeeId).subscribe(
        (data: EmployeeAllowancesRequest[]) => {
          if (data) {
            this.allowanceList = data;
          }
        }
      )
    }
  }

  printAllowanceLedger() {
  }

  addAllowance(allowance?: EmployeeAllowancesRequest) {
    let employeeData = {
      EmployeeAllowancesRequest: allowance,
      EmployeeId: this.EmployeeId
    }
    let dialogRef = this._dialogService.open(AddEmployeeAllowanceComponent, {
      header: `${allowance?.EmployeeAllowancesId ?? 0 > 0 ? 'Edit' : 'Add'} Allowance`,
      data: employeeData,
      // width: '35%',
    });
    dialogRef.onClose.subscribe((x: any) => {
      if (x) {
        this.ngOnInit();
      }
    })
  }

  deleteAllowance(allowance: EmployeeAllowancesRequest) {
    this.allowanceId = allowance.EmployeeAllowancesId.toString()
    setTimeout(() => {
      this._confirmationService.confirm({
        message: 'Are you sure you want to delete allowance?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._employeeAllowanceService.removeAllowance(allowance).subscribe(
            (x: boolean) => {
              if (x) {
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Allowance Deleted Successfully', life: 3000 });
                this.ngOnInit();
              }
            }
          )
        },
        reject: () => {
        },
        key: allowance.EmployeeAllowancesId.toString()
      });
    }, 10);
  }
}