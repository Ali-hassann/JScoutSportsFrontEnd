import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CommonHelperService } from '../../../../shared/services/common-helper.service';
import { FileViewerComponent } from '../components/file-viewer/file-viewer.component';

@Injectable({
  providedIn: 'root'
})
export class FileViewerService {

  constructor(
    private dialogService: DialogService
    , private _commonHelperSevice: CommonHelperService

  ) { }

  // public loadFileViewer(link: string) {

  //   this._commonHelperSevice
  //     .loadModule(() =>
  //       import('src/app/modules/common/file-viewer/file-viewer.module').then(m => m.FileViewerModule));        
  //   let dialogRef = this.dialogService.open(FileViewerComponent, {
  //     width: "80vw",
  //     height: "100vh",
  //     data: link
  //   });
  // }

  public loadFileViewer(pdfFile: any) {
    
    let blob: Blob = pdfFile.body as Blob;
    let url = window.URL.createObjectURL(blob);

    this._commonHelperSevice
      .loadModule(() =>
        import('src/app/modules/common/file-viewer/file-viewer.module').then(m => m.FileViewerModule));
    let dialogRef = this.dialogService.open(FileViewerComponent, {
      width: "80vw",
      height: "100vh",
      data: url
    });
  }
}
