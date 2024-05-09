import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './components/gallery/gallery.component';
import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
  declarations: [
    GalleryComponent
  ],
  imports: [
    CommonModule,
    GalleriaModule,
    ButtonModule,
    CheckboxModule
  ],
  exports:[
    GalleryComponent
  ],
  providers:[
    DynamicDialogRef,
    DialogService
  ]
})
export class GalleryModule { }
