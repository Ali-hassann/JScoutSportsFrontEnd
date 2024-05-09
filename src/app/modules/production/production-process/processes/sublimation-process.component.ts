import { Component, OnInit } from '@angular/core';
import { MainProcessType } from 'src/app/shared/enums/main-process-type.enum';

@Component({
  selector: 'app-sublimation-process',
  template: '<app-process-tabs [mainProcessTypeId]="mainProcessTypeEnum.Sublimation"></app-process-tabs>',
})
export class SublimationProcessComponent {

  mainProcessTypeEnum = MainProcessType;
}