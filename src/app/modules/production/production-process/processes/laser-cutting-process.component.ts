import { Component, OnInit } from '@angular/core';
import { MainProcessType } from 'src/app/shared/enums/main-process-type.enum';

@Component({
  selector: 'app-laser-cutting-process',
  template: '<app-process-tabs [mainProcessTypeId]="mainProcessTypeEnum.LaserCutting"></app-process-tabs>',
})
export class LaserCuttingProcessComponent {

  mainProcessTypeEnum = MainProcessType;
}