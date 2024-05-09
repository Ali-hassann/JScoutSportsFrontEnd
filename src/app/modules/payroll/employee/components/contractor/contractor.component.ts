import { Component, OnInit } from '@angular/core';
import { SalaryTypeEnum } from 'src/app/shared/enums/SalaryType';

@Component({
  selector: 'app-contractor',
  templateUrl: './contractor.component.html'
})
export class ContractorComponent {
  salaryType = SalaryTypeEnum.Wages;
}