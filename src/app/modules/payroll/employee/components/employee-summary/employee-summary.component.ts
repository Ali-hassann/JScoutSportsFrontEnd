import { Component, Input, OnInit } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { EmployeeBasicRequest } from '../../models/employee.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-employee-summary',
  templateUrl: './employee-summary.component.html',
  styleUrls: ['./employee-summary.component.scss']
})
export class EmployeeSummaryComponent implements OnInit {
  @Input() EmployeeId: number = 0;
  @Input() EmployeeName: string = "";
  
  salaryType = 0;

  constructor(
    private _breadcrumbService: AppBreadcrumbService,
    public _configDialog: DynamicDialogConfig,
    public _configDialogRef: DynamicDialogRef,
  ) {
    this.EmployeeId = _configDialog?.data.EmployeeId;
    this.EmployeeName = _configDialog?.data.EmployeeName;
    this.salaryType = _configDialog?.data.salaryType;
  }

  ngOnInit(): void {
    // this.setBreadCrumb();
  }
}
