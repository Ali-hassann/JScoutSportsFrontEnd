import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { Payroll } from 'src/app/shared/enums/rights.enum';
import { AnnualLeaveRequest } from '../../models/annual-leave.model';
import { AnnualLeaveService } from '../../services/annual-leave.service';
import { AddAnnualLeaveComponent } from '../add-annual-leave/add-annual-leave.component';

@Component({
  selector: 'app-annual-leave-list',
  templateUrl: './annual-leave-list.component.html'
})
export class AnnualLeaveListComponent implements OnInit {

  annualLeavesList: AnnualLeaveRequest[] = [];
  Payroll = Payroll;
  product: AnnualLeaveRequest = new AnnualLeaveRequest();

  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private _messageService: MessageService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _annualLeavesService: AnnualLeaveService,
    private _breadCrumbService: AppBreadcrumbService,
  ) {

  }

  private getAnnualLeavesList() {
    this._annualLeavesService.getAnnualLeaveList().subscribe(
      (annualLeavesList: AnnualLeaveRequest[]) => {
        this.annualLeavesList = annualLeavesList;
      }
    );
  }

  private setBreadCrumb(): void {
    this._breadCrumbService.setBreadcrumbs([
      { label: 'Payroll Setting', routerLink: ['payroll-settings'] },
      { label: 'AnnualLeave' },
    ]);
  }

  ngOnInit() {
    this.setBreadCrumb();
    this.getAnnualLeavesList();
  }

  public addAnnualLeaveDialog(annualLeaves?: AnnualLeaveRequest): void {
    let dialogRef = this._dialogService.open(AddAnnualLeaveComponent, {
      header: `${annualLeaves?.AnnualLeaveId ?? 0 > 0 ? 'Edit' : 'Add'} Annual Leave Planning`,
      data: annualLeaves,
      // width: '35%',
    });
    dialogRef.onClose.subscribe(res => {
      if (res) {
        this.getAnnualLeavesList();
      }
    });
  }

  deleteAnnualLeave(annualLeaves: AnnualLeaveRequest) {
    if (annualLeaves) {
      this._confirmationService.confirm({
        // target: event?.target,
        message: 'Are you sure you want to delete gazetted Holiday?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._annualLeavesService.deleteAnnualLeave(annualLeaves.AnnualLeaveId).subscribe(
            (x: boolean) => {
              if (x) {
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Gazetted Holiday Deleted Successfully', life: 3000 });
              }
            }
          )
        },
        reject: () => {
          //reject action
        }
      });
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
