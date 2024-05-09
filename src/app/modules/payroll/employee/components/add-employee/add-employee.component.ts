import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { DepartmentsRequest } from 'src/app/modules/setting/department/models/department.model';
import { DepartmentQuery } from 'src/app/modules/setting/department/states/departments.query';
import { DesignationRequestResponse } from 'src/app/modules/setting/designation-type/models/benefit-type.model';
import { DesignationTypeQuery } from 'src/app/modules/setting/designation-type/states/designation-type.query';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { EmployeeBasicRequest, EmployeeRequest } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeQuery } from '../../states/employee.query';
import { environment } from 'src/environments/environment';
import { SalaryTypeEnum } from 'src/app/shared/enums/SalaryType';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { AddDepartmentComponent } from 'src/app/modules/setting/department/components/add-department/add-department.component';
import { AddDesignationTypeComponent } from 'src/app/modules/setting/designation-type/components/add-designation-type/add-designation-type.component';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  defaultImageUrl: string = 'assets/profile9.png';
  imageUrl: string = "assets/profile9.png";
  employeeRequest: EmployeeRequest = new EmployeeRequest();
  departmentList: DepartmentsRequest[] = [];
  designationList: DesignationRequestResponse[] = [];
  public datePickerFormat = DateHelperService.datePickerFormat;

  workingHoursList = [
    { Id: 1, Name: '1 hour' },
    { Id: 2, Name: '2 hours' },
    { Id: 3, Name: '3 hours' },
    { Id: 4, Name: '4 hours' },
    { Id: 5, Name: '5 hours' },
    { Id: 6, Name: '6 hours' },
    { Id: 7, Name: '7 hours' },
    { Id: 8, Name: '8 hours' },
    { Id: 9, Name: '9 hours' },
    { Id: 10, Name: '10 hours' },
    { Id: 11, Name: '11 hours' },
    { Id: 12, Name: '12 hours' },
  ];

  salaryType: any[] = [];
  // { value: SalaryTypeEnum.SalaryPerson, Name: 'Salary Person' },
  // { value: SalaryTypeEnum.Wages, Name: 'Wages' },
  // { value: SalaryTypeEnum.Fix, Name: 'Fix Salary' },

  genderList = [
    "Male",
    "Female",
    "Others"
  ];

  maritalStatus = [
    "Single",
    "Married",
    "Widowed",
    "Divorced"
  ];

  workingDaysNG: string = "";

  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _employeeService: EmployeeService,
    public _configDialog: DynamicDialogConfig,
    private _messageService: MessageService,
    public _dialogService: DialogService,
    private _departmentQuery: DepartmentQuery,
    private _designationTypeQuery: DesignationTypeQuery,
    private _employeeQuery: EmployeeQuery,
  ) {
    CommonHelperService.mapSourceObjToDestination(_configDialog.data, this.employeeRequest.Employee);
    if (_configDialog?.data?.EmployeeId > 0) {
      this._employeeService.getEmployeeById(_configDialog?.data.EmployeeId).subscribe(
        (data) => {
          this.employeeRequest = data;
          this.employeeRequest.Employee.JoiningDate = DateHelperService.getDatePickerFormat(this.employeeRequest.Employee.JoiningDate)
          this.employeeRequest.EmployeeDetail.DOB = DateHelperService.getDatePickerFormat(this.employeeRequest.EmployeeDetail.DOB)

          if (this.employeeRequest.Employee?.LeftDate) {
            let date = this.employeeRequest.Employee.LeftDate ?? new Date();
            this.employeeRequest.Employee.LeftDate = DateHelperService.getDatePickerFormat(date);
          }

          if (data.Employee.ImagePath) {
            this.imageUrl = environment.baseImageIP + data.Employee.ImagePath;
          }
          else {
          }
        });
    }
    if (this.employeeRequest.Employee?.LeftDate) {
      let date = this.employeeRequest.Employee.LeftDate ?? new Date();
      this.employeeRequest.Employee.LeftDate = DateHelperService.getDatePickerFormat(date);
    }
  }

  onSelectFile(event: any) {
    if (event.target.files) {
      let reader: FileReader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {

        const base64String = (reader.result as string).split(',')[1];
        this.employeeRequest.Employee.ImagePath = base64String;
        this.imageUrl = event.target.result
      }
    }
  }

  resetImage() {
    this.imageUrl = this.defaultImageUrl;
    this.employeeRequest.Employee.IsToDeleteImage = true;
  }

  ngOnInit(): void {
    this._departmentQuery.departmentList$.subscribe(
      (data: DepartmentsRequest[]) => {
        this.departmentList = data;
      }
    );
    this._designationTypeQuery.designationTypeList$.subscribe(
      (designation: DesignationRequestResponse[]) => {
        this.designationList = designation;
      }
    );

    this.setSalarType();
  }

  public setSalarType() {
    this.salaryType = [];
    if (this.employeeRequest.Employee.SalaryType === SalaryTypeEnum.Wages) {
      this.salaryType = [{ value: SalaryTypeEnum.Wages, Name: "Wages Person" }];
      this.employeeRequest.Employee.SalaryType = SalaryTypeEnum.Wages;
    } else {
      this.salaryType = [
        { value: SalaryTypeEnum.SalaryPerson, Name: 'Salary Person' },
        { value: SalaryTypeEnum.Fix, Name: 'Fix Salary' },
      ]
    }
  }

  addDepartment() {
    let dialogRef = this._dialogService.open(AddDepartmentComponent, {
      header: 'Add Department',
      data: null,
      // width: '35%',
    });
  }

  addDesignation() {
    let dialogRef = this._dialogService.open(AddDesignationTypeComponent, {
      header: 'Add Designation',
      data: null,
      // width: '35%',
    });
  }

  public close(isToRefresh: boolean = false) {
    this._configDialogRef.close(isToRefresh);
  }

  public submit(f: NgForm) {
    if (!f.invalid) {
      let request: EmployeeRequest = new EmployeeRequest();

      request.Employee = this.employeeRequest.Employee;
      request.Employee.DesignationName = this.designationList?.find(t => t.DesignationId === request.Employee.DesignationId)?.DesignationName ?? "";
      request.EmployeeDetail = this.employeeRequest.EmployeeDetail;

      request.Employee.OrganizationId = this._authQuery.PROFILE.OrganizationId;
      request.Employee.OutletId = this._authQuery.PROFILE.OutletId;

      request.EmployeeDetail.DOB = DateHelperService.getServerDateFormat(request.EmployeeDetail.DOB);
      request.Employee.JoiningDate = DateHelperService.getServerDateFormat(request.Employee.JoiningDate);

      if (request.Employee.EmployeeId > 0) {
        this.updateEmployee(request);
      }
      else {
        this.addEmployee(request);
      }
    }
    else {
      this._messageService.add({ severity: 'warn', summary: 'Forms Field are invalid', detail: 'Validation failed' });
    }
  }

  private addEmployee(request: EmployeeRequest) {
    this._employeeService.addEmployee(request).subscribe(
      (x: any) => {
        if (x) {
          this._messageService.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          this._employeeQuery.addEmployee(x);
          this.close(true);
        }
      }
    )
  }

  private updateEmployee(request: EmployeeRequest) {
    this._employeeService.updateEmployee(request).subscribe(
      (x: EmployeeBasicRequest) => {
        if (x) {
          this._messageService.add({ severity: 'success', summary: 'updated Sucessfully', detail: 'Saved Sucessfully' });
          this._employeeQuery.removeEmployeeById(x.EmployeeId);
          this._employeeQuery.addEmployee(x);
          this.close(true);
        }
      }
    )
  }
}
