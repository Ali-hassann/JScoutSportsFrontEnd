import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { Gallery as ImagesRequest } from 'src/app/modules/common/gallery/models/gallery.model';
import { environment } from 'src/environments/environment';
import { EmployeeDocument } from '../../models/employee-document.model';
import { EmployeeDocumentsService } from '../../services/employee-documents.service';

@Component({
  selector: 'app-employee-document-list',
  templateUrl: './employee-document-list.component.html',
  styleUrls: ['./employee-document-list.component.scss']
})
export class EmployeeDocumentListComponent implements OnInit {
  @Input() EmployeeId: number = 0;
  public images: ImagesRequest[] = [];
  public documents: EmployeeDocument[] = [];

  constructor(
    private _employeeDocumentsService: EmployeeDocumentsService
    , private _messageService: MessageService
    , private _authQuery: AuthQuery) { }

  ngOnInit(): void {
    this.getDocuments();
  }
  public onGalleryChange(event: ImagesRequest[]): void {
    this.images = event;
    this.addInEmployeeDocument()
  }

  private saveDocuments(gallery: EmployeeDocument[]) {
//     gallery.forEach((x: EmployeeDocument) => {
// x.ImagePath.()
//     })
    this._employeeDocumentsService.saveEmployeeDocuments(gallery).subscribe(
      (x: any) => {
        if (x) {
          this._messageService.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully',key:'document' });
        }
      }
    )
  }

  private getDocuments() {
    let gallery: EmployeeDocument = new EmployeeDocument();
    gallery.EmployeeId = this.EmployeeId;
    gallery.OrganizationId = this._authQuery.OrganizationId;
    gallery.OutletId = this._authQuery.OutletId;
    this._employeeDocumentsService.getEmployeeDocuments(gallery).subscribe(
      (x: EmployeeDocument[]) => {
        if (x) {
          this.images = x?.map((x: EmployeeDocument) => {
            let image: ImagesRequest = {
              Id: x.EmployeeDocumentsId,
              Path: environment.baseUrlApp + x.ImagePath,
              IsNew: false,
              IsDeleted: x.IsDeleted,
              IsSelected: false
            };
            return image;
          })
        }
        else {
          this.images = [];
        }
      }
    )
  }

  public addInEmployeeDocument(): void {
    this.documents = [];
    this.documents = this.images?.map(x => {
      let employeeDocument: EmployeeDocument = new EmployeeDocument();

      if (x.IsNew) {
        //index sometime 22 or 23 its depend on image type belew line find auurate index automatically
        let index = x.Path.indexOf('base64,');
        //find index of 'base64,' and + 7 of length of 'base64,' character for total length and accurate index
        employeeDocument.ImagePath = x.Path.slice(index + 7);
      }
      else {
        employeeDocument.EmployeeDocumentsId = x.Id;
        employeeDocument.ImagePath = x.Path;
      }
      employeeDocument.IsDeleted = x.IsDeleted;
      employeeDocument.EmployeeId = this.EmployeeId;
      employeeDocument.OrganizationId = this._authQuery.OrganizationId;
      employeeDocument.OutletId = this._authQuery.OutletId;
      return employeeDocument;
    });

    this.saveDocuments(this.documents)
  }
}
