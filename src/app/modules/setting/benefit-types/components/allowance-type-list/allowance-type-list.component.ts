import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { Payroll } from 'src/app/shared/enums/rights.enum';
import { AllowanceTypeRequest } from '../../models/allowance-type.model';
import { AllowanceTypeService } from '../../services/allowance-type.service';
import { AllowanceTypeQuery } from '../../states/allowance-types.query';
import { AddAllowanceTypeComponent } from '../add-allowance-type/add-allowance-type.component';

@Component({
  selector: 'app-allowance-type-list',
  templateUrl: './allowance-type-list.component.html',
  styleUrls: ['./allowance-type-list.component.scss']
})
export class AllowanceTypeListComponent implements OnInit {

  public allowanceTypeList: AllowanceTypeRequest[] = [];

  rowsPerPageOptions = [5, 10, 20];
  Payroll = Payroll;

  constructor(
    private _messageService: MessageService,
    public _dialogService: DialogService,
    private _allowanceQuery: AllowanceTypeQuery,
    private _confirmationService: ConfirmationService,
    private _AllowanceTypeService: AllowanceTypeService,
    private _breadCrumbService: AppBreadcrumbService,

  ) {

    this._allowanceQuery.allowanceTypeList$.subscribe(
      (allowanceTypeList: AllowanceTypeRequest[]) => {
        this.allowanceTypeList = allowanceTypeList;
      }
    )
  }

  ngOnInit() {
    this.setBreadCrumb();
  }
  private setBreadCrumb(): void {
    this._breadCrumbService.setBreadcrumbs([
      { label: 'Payroll Setting', routerLink: ['payroll-settings'] },
      { label: 'Allowance Types' },
    ]);
  }

  public addAllowanceTypeDialog(AllowanceType?: AllowanceTypeRequest): void {
    let dialogRef = this._dialogService.open(AddAllowanceTypeComponent, {
      header: `${AllowanceType?.AllowanceTypeId ?? 0 > 0 ? 'Edit' : 'Add'} Allowance Type`,
      data: AllowanceType,
      // width: '35%',
    });
  }

  deleteAllowanceType(AllowanceType: AllowanceTypeRequest) {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete Allowance type?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._AllowanceTypeService.removeAllowanceType(AllowanceType.AllowanceTypeId).subscribe(
          (x: boolean) => {
            if (x) {
              this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Allowance Type Deleted Successfully', life: 3000 });
              this._allowanceQuery.removeAllowanceTypeById(AllowanceType.AllowanceTypeId);
            }
          }
        )
      },
      reject: () => {
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
