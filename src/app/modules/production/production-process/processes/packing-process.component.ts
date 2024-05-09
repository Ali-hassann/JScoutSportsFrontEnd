import { Component, OnInit } from '@angular/core';
import { MainProcessType } from 'src/app/shared/enums/main-process-type.enum';

@Component({
  selector: 'app-packing-process',
  template: '<app-process-tabs [mainProcessTypeId]="mainProcessTypeEnum.Packing"></app-process-tabs>',
})
export class PackingProcessComponent {

  mainProcessTypeEnum = MainProcessType;
}