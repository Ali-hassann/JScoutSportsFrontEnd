import { Component, OnInit } from '@angular/core';
import { MainProcessType } from 'src/app/shared/enums/main-process-type.enum';

@Component({
  selector: 'app-embossing-process',
  template: '<app-process-tabs [mainProcessTypeId]="mainProcessTypeEnum.Embossing"></app-process-tabs>',
})
export class EmbossingProcessComponent {

  mainProcessTypeEnum = MainProcessType;
}