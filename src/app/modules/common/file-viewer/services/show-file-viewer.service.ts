import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { CommonHelperService } from '../../../../shared/services/common-helper.service';
import { ShowFileViewerComponent } from '../components/show-file-viewer/show-file-viewer.component';

@Injectable({
  providedIn: 'root'
})
export class ShowFileViewerService {

  constructor(
    private dialogService: DialogService
    , private _commonHelperSevice: CommonHelperService

  ) { }

  public loadFileViewer(link: string) {

    this._commonHelperSevice
      .loadModule(() =>
        import('src/app/modules/common/file-viewer/file-viewer.module').then(m => m.FileViewerModule));        
    let dialogRef = this.dialogService.open(ShowFileViewerComponent, {
      width: "80vw",
      height: "100vh",
      data: link
    });
  }
}
