import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { Payroll } from 'src/app/shared/enums/rights.enum';
import { GazettedHolidayRequest } from '../../models/gazetted-holiday.model';
import { GazettedHolidayService } from '../../services/gazetted-holiday.service';
import { AddGazettedHolidayComponent } from '../add-gazetted-holiday/add-gazetted-holiday.component';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';

@Component({
  selector: 'app-gazetted-holiday-list',
  templateUrl: './gazetted-holiday-list.component.html'
})
export class GazettedHolidayListComponent implements OnInit {

  gazettedHolidaysList: GazettedHolidayRequest[] = [];
  Payroll = Payroll;
  product: GazettedHolidayRequest = new GazettedHolidayRequest();

  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private _messageService: MessageService,
    public _dialogService: DialogService,
    private _confirmationService: ConfirmationService,
    private _gazettedHolidayService: GazettedHolidayService,
    private _breadCrumbService: AppBreadcrumbService,
  ) {

  }

  private getGazettedHolidaysList() {
    this._gazettedHolidayService.getGazettedHolidayList().subscribe(
      (gazettedHolidayList: GazettedHolidayRequest[]) => {
        this.gazettedHolidaysList = gazettedHolidayList;
      }
    );
  }

  private setBreadCrumb(): void {
    this._breadCrumbService.setBreadcrumbs([
      { label: 'Payroll Setting', routerLink: ['payroll-settings'] },
      { label: 'GazettedHoliday' },
    ]);
  }

  ngOnInit() {
    this.setBreadCrumb();
    this.getGazettedHolidaysList();
  }

  public addGazettedHolidayDialog(gazettedHoliday?: GazettedHolidayRequest): void {
    if ((gazettedHoliday?.GazettedHolidayId ?? 0) > 0) {
      gazettedHoliday ? gazettedHoliday.GazettedHolidayDate = DateHelperService.getDatePickerFormat(gazettedHoliday?.GazettedHolidayDate) : "";
    }
    let dialogRef = this._dialogService.open(AddGazettedHolidayComponent, {
      header: `${gazettedHoliday?.GazettedHolidayId ?? 0 > 0 ? 'Edit' : 'Add'} Gazetted Holiday`,
      data: gazettedHoliday,
      // width: '35%',
    });
    dialogRef.onClose.subscribe(res => {
      if (res) {
        this.getGazettedHolidaysList();
      }
    });
  }

  deleteGazettedHoliday(gazettedHoliday: GazettedHolidayRequest) {
    if (gazettedHoliday) {
      this._confirmationService.confirm({
        // target: event?.target,
        message: 'Are you sure you want to delete gazetted Holiday?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this._gazettedHolidayService.deleteGazettedHoliday(gazettedHoliday.GazettedHolidayId).subscribe(
            (x: boolean) => {
              if (x) {
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Gazetted Holiday Deleted Successfully', life: 3000 });
              }
            }
          )
        },
        reject: () => {
          //reject action
        }
      });
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
