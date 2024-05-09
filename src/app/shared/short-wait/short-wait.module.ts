import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortWaitForRightsComponent } from './components/short-wait-for-rights/short-wait-for-rights.component';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    component: ShortWaitForRightsComponent,
    pathMatch: "full",
  },
];

@NgModule({
  declarations: [
    ShortWaitForRightsComponent
  ],
  imports: [
    CommonModule
    , RouterModule.forChild(routes)
  ]
})
export class ShortWaitModule { }
