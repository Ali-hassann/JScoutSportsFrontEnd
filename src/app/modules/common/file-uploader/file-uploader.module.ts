import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { RouterModule, Routes } from '@angular/router';
import {FileUploadModule} from 'primeng/fileupload';


const routes:Routes=[
  {path:'',component:FileUploaderComponent,pathMatch:'full'}
]

@NgModule({
  declarations: [
    FileUploaderComponent
  ],
  imports: [
    CommonModule,
    FileUploadModule,
    RouterModule.forChild(routes)
  ]
})
export class FileUploaderModule { }
