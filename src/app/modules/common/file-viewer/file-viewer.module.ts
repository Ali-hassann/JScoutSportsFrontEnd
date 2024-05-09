import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileViewerComponent } from './components/file-viewer/file-viewer.component';
import { DialogService } from 'primeng/dynamicdialog';
import { FileViewerService } from './services/file-viewer.service';
import { ShowFileViewerComponent } from './components/show-file-viewer/show-file-viewer.component';
import { ShowFileViewerService } from './services/show-file-viewer.service';
import { CommonSharedModule } from '../../../shared/modules/common-shared.module';



@NgModule({
  declarations: [
    FileViewerComponent,
    ShowFileViewerComponent
  ],
  imports: [
    CommonModule,
    CommonSharedModule,
  ],
  exports:[
    FileViewerComponent,
    ShowFileViewerComponent
  ],
  providers: [
    FileViewerService,
    DialogService,
    ShowFileViewerService,
  ]
})
export class FileViewerModule { }
