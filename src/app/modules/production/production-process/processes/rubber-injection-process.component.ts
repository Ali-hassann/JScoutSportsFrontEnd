import { Component, OnInit } from '@angular/core';
import { MainProcessType } from 'src/app/shared/enums/main-process-type.enum';

@Component({
  selector: 'app-rubber-injection-process',
  template: '<app-process-tabs [mainProcessTypeId]="mainProcessTypeEnum.RubberInjection"></app-process-tabs>',
})
export class RubberInjectionProcessComponent {

  mainProcessTypeEnum = MainProcessType;
}