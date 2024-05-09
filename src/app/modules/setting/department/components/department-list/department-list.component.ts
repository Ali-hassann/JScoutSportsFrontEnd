import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { Payroll } from 'src/app/shared/enums/rights.enum';
import { DepartmentsRequest } from '../../models/department.model';
import { DepartmentService } from '../../services/department.service';
import { DepartmentQuery } from '../../states/departments.query';
import { AddDepartmentComponent } from '../add-department/add-department.component';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent implements OnInit {

  departmentsList: DepartmentsRequest[] = [];
  Payroll = Payroll;
  product: DepartmentsRequest = new DepartmentsRequest();

  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private _messageService: MessageService,
    public _dialogService: DialogService,
    private _departmentQuery: DepartmentQuery,
    private _confirmationService: ConfirmationService,
    private _departmentService: DepartmentService,
    private _breadCrumbService: AppBreadcrumbService,
  ) {
    this._departmentQuery.departmentList$.subscribe(
      (departmentList: DepartmentsRequest[]) => {
        this.departmentsList = departmentList;
      }
    )
  }

  private setBreadCrumb(): void {
    this._breadCrumbService.setBreadcrumbs([
      { label: 'Payroll Setting', routerLink: ['payroll-settings'] },
      { label: 'Departments' },
    ]);
  }

  ngOnInit() {
    this.setBreadCrumb()
  }

  public addDepartmentDialog(department?: DepartmentsRequest): void {
    let dialogRef = this._dialogService.open(AddDepartmentComponent, {
      header: `${department?.DepartmentsId ?? 0 > 0 ? 'Edit' : 'Add'} Department`,
      data: department,
      // width: '35%',
    });
  }

  deleteDepartment(department: DepartmentsRequest) {
    if (department) {
      this._confirmationService.confirm({
        // target: event?.target,
        message: 'Are you sure you want to delete department?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._departmentService.deleteDepartment(department.DepartmentsId).subscribe(
            (x: boolean) => {
              if (x) {
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Department Deleted Successfully', life: 3000 });
                this._departmentQuery.removeDepartmentById(department.DepartmentsId);
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
