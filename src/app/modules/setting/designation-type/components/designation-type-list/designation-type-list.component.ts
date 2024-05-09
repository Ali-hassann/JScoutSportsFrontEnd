import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { Payroll } from 'src/app/shared/enums/rights.enum';
import { DesignationRequestResponse } from '../../models/benefit-type.model';
import { DesignationTypeService } from '../../services/designation-type.service';
import { DesignationTypeQuery } from '../../states/designation-type.query';
import { AddDesignationTypeComponent } from '../add-designation-type/add-designation-type.component';

@Component({
  selector: 'app-designation-type-list',
  templateUrl: './designation-type-list.component.html',
  styleUrls: ['./designation-type-list.component.scss']
})
export class DesignationTypeListComponent implements OnInit {

  public benefitTypeList: DesignationRequestResponse[] = [];

  rowsPerPageOptions = [5, 10, 20];
  Payroll = Payroll

  constructor(
    private _messageService: MessageService,
    public _dialogService: DialogService,
    private _benefitQuery: DesignationTypeQuery,
    private _confirmationService: ConfirmationService,
    private _departmentService: DesignationTypeService,
    private _breadCrumbService: AppBreadcrumbService,
  ) {

    this._benefitQuery.designationTypeList$.subscribe(
      (departmentList: DesignationRequestResponse[]) => {
        this.benefitTypeList = departmentList;
      }
    )

  }

  private setBreadCrumb(): void {
    this._breadCrumbService.setBreadcrumbs([
      { label: 'Payroll Setting', routerLink: ['payroll-settings'] },
      { label: 'Designation' },
    ]);
  }

  ngOnInit() {
    this.setBreadCrumb();
  }



  public addDesignationDialog(department?: DesignationRequestResponse): void {
    let dialogRef = this._dialogService.open(AddDesignationTypeComponent, {
      header: 'Add Designation',
      data: department,
      // width: '35%',
    });
  }

  deleteDesignation(department: DesignationRequestResponse) {
    this._confirmationService.confirm({
      // target: event?.target,
      message: 'Are you sure you want to delete designation type?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._departmentService.removeDesignationType(department.DesignationId).subscribe(
          (x: boolean) => {
            if (x) {
              this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Designation Deleted Successfully', life: 3000 });
              this._benefitQuery.removeDesignationTypeById(department.DesignationId);
            }
          }
        )
      },
      reject: () => {
      }
    });

  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
