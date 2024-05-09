import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursorPointerDirective } from '../directives/cursor-pointer.directive';
import { DateHelperService } from '../services/date-helper.service';
import { SafePipe } from '../pipes/safe-url.pipe';
import { BoldAmountDirective } from '../directives/bold-amount.directive';
import { HasRightDirective } from '../directives/has-right.directive';
import { SelectAllDirective } from '../directives/select-all.directive';

@NgModule({
  declarations: [
    CursorPointerDirective,
    BoldAmountDirective,
    SafePipe,
    HasRightDirective,
    SelectAllDirective
  ],
  imports: [
    CommonModule,    
  ],
  exports: [
    CursorPointerDirective,
    SafePipe,
    BoldAmountDirective,
    HasRightDirective,
    SelectAllDirective
  ],
  providers: [
    DateHelperService
  ]
})
export class CommonSharedModule { }
