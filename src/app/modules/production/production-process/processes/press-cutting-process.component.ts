import { Component, OnInit } from '@angular/core';
import { MainProcessType } from 'src/app/shared/enums/main-process-type.enum';

@Component({
  selector: 'app-press-cutting-process',
  template: '<app-process-tabs [mainProcessTypeId]="mainProcessTypeEnum.PressCutting"></app-process-tabs>',
})
export class PressCuttingProcessComponent {

  mainProcessTypeEnum = MainProcessType;
}