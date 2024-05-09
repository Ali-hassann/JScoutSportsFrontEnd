import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent implements OnInit {
  uploadedFiles: any[] = [];
  public base64FileList: string[] = [];

  constructor(
    private _dialogRef: DynamicDialogRef
  ) { }
  ngOnInit(): void {

  }

  myupload(event: any) {

    this.base64FileList = this.imageFileToBase64Convert(event);
    setTimeout(() => {
      this._dialogRef.close(this.base64FileList);
    }, 1000);
  }
  onClear(event: any) {
    this._dialogRef.close([]);
  }
  public imageFileToBase64Convert(fileList: any): string[] {
    let base64: string[] = [];
    fileList?.files?.forEach((file: any) => {
      var reader = new FileReader();
      reader.onloadend = () => {
        let src = reader.result as string;
        this.base64FileList.push(src);
      }
      reader.readAsDataURL(file);
    });

    return base64;
  }
}