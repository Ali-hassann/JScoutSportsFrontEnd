import { Component, OnInit } from '@angular/core';
import { MainProcessType } from 'src/app/shared/enums/main-process-type.enum';

@Component({
  selector: 'app-contract-process',
  template: '<app-process-tabs [mainProcessTypeId]="mainProcessTypeEnum.Contract"></app-process-tabs>',
})
export class ContractProcessComponent {

  mainProcessTypeEnum = MainProcessType;
}