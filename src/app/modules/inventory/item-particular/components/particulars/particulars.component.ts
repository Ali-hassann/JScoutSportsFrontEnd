import { Component, Input, OnInit } from '@angular/core';
import { ParticularRequest } from '../../models/item-particular.model';
import { Table } from 'primeng/table';
import { AddItemVendorsComponent } from '../add-item-vendors/add-item-vendors.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { ParticularService } from '../../services/item-particular.service';
import { ParticularQuery } from '../../states/item-paticular.query';

@Component({
  selector: 'app-particulars',
  templateUrl: './particulars.component.html',
  styleUrls: ['./particulars.component.scss']
})
export class ParticularsComponent implements OnInit {

  partcularList: ParticularRequest[] = [];

  @Input() ParticularType: string = "";
  deleteDialogKey: string = "";

  constructor(
    private _messageService: MessageService,
    private _particularService: ParticularService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _particularQuery: ParticularQuery,
    private _breadcrumbService: AppBreadcrumbService,
  ) {
  }

  ngOnInit() {
    this.getParticularsList();
  }

  private getParticularsList() {
    if (this.ParticularType == 'Vendor') {
      this._particularQuery.VendorList$.subscribe(
        (data: ParticularRequest[]) => {
          if (data) {
            this.partcularList = data;
          }
        }
      );
      this._breadcrumbService.setBreadcrumbs([
        { label: 'Vendors' },
      ]);
    }
    else if (this.ParticularType == 'Customer') {
      this._particularQuery.CustomerList$.subscribe(
        (data: ParticularRequest[]) => {
          if (data) {
            this.partcularList = data;
          }
        }
      );
      this._breadcrumbService.setBreadcrumbs([
        { label: 'Customers' },
      ]);
    }
    else {
      this._particularQuery.OthersList$.subscribe(
        (data: ParticularRequest[]) => {
          if (data) {
            this.partcularList = data;
          }
        }
      );
      this._breadcrumbService.setBreadcrumbs([
        { label: 'Others' },
      ]);
    }
  }

  addParticular(particular?: ParticularRequest) {
    let addData = {
      particular: particular,
      particularType: this.ParticularType,
    }
    let dialogRef = this._dialogService.open(AddItemVendorsComponent, {
      header: `${particular?.ParticularId ?? 0 > 0 ? 'Edit' : 'Add'} ${this.ParticularType}`,
      data: addData,
      width: '60%'
    });

    dialogRef.onClose.subscribe(isToRefresh => {
      if (isToRefresh == true) {
        this.getParticularsList();
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deleteParticular(particular: ParticularRequest) {
    this.deleteDialogKey = particular.ParticularId.toString();
    setTimeout(() => {
      this._confirmationService.confirm({
        message: 'Are you sure you want to delete Particular?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._particularService.removeParticular(particular.ParticularId).subscribe(
            (x: boolean) => {
              if (x) {
                this._particularQuery.removeParticularById(particular.ParticularId);
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Particular Deleted Successfully', life: 3000 });
              }
            }
          )
        },
        reject: () => {
        },
        key: particular.ParticularId.toString()
      });
    }, 10);
  }
}
