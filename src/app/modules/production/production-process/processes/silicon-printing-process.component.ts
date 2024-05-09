import { Component, OnInit } from '@angular/core';
import { MainProcessType } from 'src/app/shared/enums/main-process-type.enum';

@Component({
  selector: 'app-silicon-printing-process',
  template: '<app-process-tabs [mainProcessTypeId]="mainProcessTypeEnum.SiliconPrinting"></app-process-tabs>',
})
export class SiliconPrintingProcessComponent {

  mainProcessTypeEnum = MainProcessType;
}