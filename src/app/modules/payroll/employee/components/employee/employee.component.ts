import { Component, OnInit } from '@angular/core';
import { SalaryTypeEnum } from 'src/app/shared/enums/SalaryType';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html'
})
export class EmployeeComponent {
  salaryType = SalaryTypeEnum.SalaryPerson;
}