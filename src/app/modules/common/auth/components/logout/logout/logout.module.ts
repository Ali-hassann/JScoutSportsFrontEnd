import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from '../logout.component';

const routes: Routes = [
  {
    path: '', component: LogoutComponent, pathMatch: 'full'
  }
]

@NgModule({
  declarations: [LogoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class LogoutModule { }
