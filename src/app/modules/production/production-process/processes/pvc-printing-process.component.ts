import { Component, OnInit } from '@angular/core';
import { MainProcessType } from 'src/app/shared/enums/main-process-type.enum';

@Component({
  selector: 'app-pu-pvc-printing-process',
  template: '<app-process-tabs [mainProcessTypeId]="mainProcessTypeEnum.PuPvcPrinting"></app-process-tabs>',
})
export class PuPvcPrintingProcessComponent {

  mainProcessTypeEnum = MainProcessType;
}