import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { FileUploaderComponent } from 'src/app/modules/common/file-uploader/components/file-uploader/file-uploader.component';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { Gallery } from '../../models/gallery.model';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  @Input() Gallery: Gallery[] = [];
  @Output() EmitGallery: EventEmitter<Gallery[]> = new EventEmitter<Gallery[]>();

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  displayCustom: boolean = false;

  activeIndex: number = 0;

  constructor(
    private _commonHelperService: CommonHelperService,
    private _dialogService: DialogService
  ) { }

  ngOnInit() {

  }

  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }
  public deleteImages(i: any): void {
    if (this.Gallery[i]?.IsNew) {
      this.Gallery.splice(i, 1);
    }
    else {
      this.Gallery[i].IsDeleted = true;
    }
  }

  public openAddImage(): void {

    // Loading Dynamically Module
    this._commonHelperService
      .loadModule
      (
        () => import('src/app/modules/common/file-uploader/file-uploader.module')
          .then(x => x.FileUploaderModule)
      );
    //

    let dialogRef = this._dialogService.open(FileUploaderComponent, {
      header: `File uploader`,
      width: '50%'
    });
    dialogRef.onClose.subscribe(base64List => {
      base64List?.forEach((element: any, i: any) => {
        this.Gallery.push(
          {
            Id: new Date().getTime() + i,
            Path: element,
            IsNew: true,
            IsDeleted: false,
            IsSelected: false
          }
        );
      });
      this.EmitGallery.emit(this.Gallery);
    })
  }
}