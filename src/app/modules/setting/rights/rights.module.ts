import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { RightsService } from './services/rights.service';

@NgModule({
  declarations: [
  ],
  imports: [
  ],
  providers:[RightsService]
})
export class RightsModule { }
