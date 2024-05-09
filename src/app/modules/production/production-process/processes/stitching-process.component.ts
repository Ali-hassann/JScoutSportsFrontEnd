import { Component, OnInit } from '@angular/core';
import { MainProcessType } from 'src/app/shared/enums/main-process-type.enum';

@Component({
  selector: 'app-stitching-process',
  template: '<app-process-tabs [mainProcessTypeId]="mainProcessTypeEnum.Stitching"></app-process-tabs>',
})
export class StitchingProcessComponent {

  mainProcessTypeEnum = MainProcessType;
}