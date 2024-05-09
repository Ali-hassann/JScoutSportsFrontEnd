import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.scss']
})
export class FileViewerComponent implements OnInit {

  constructor(
    public _dialogService: DialogService,
    public _config: DynamicDialogConfig,
    public dialogRef: DynamicDialogRef,) {
  }

  ngOnInit(): void {
  }
  public addHeadCategoryDialog(): void {

  }
  // ngAfterViewInit(): void {
  //   if (this._config?.data) {
  //     let elem = document.getElementById("frame") as HTMLIFrameElement;
  //     elem.src = environment.baseUrlApp+this._config?.data;
  //   }
  // }
  
  ngAfterViewInit(): void {
    if (this._config?.data) {
      let elem = document.getElementById("frame") as HTMLIFrameElement;
      elem.src = this._config?.data;
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
