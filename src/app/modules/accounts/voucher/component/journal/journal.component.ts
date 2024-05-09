import { Component, OnInit } from '@angular/core';
import { VoucherImagesRequest, VoucherMasterList, VouchersDetailRequest, VouchersMasterRequest } from '../../models/voucher.model';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { MessageService } from 'primeng/api';
import { VoucherService } from '../../services/voucher.service';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { NgForm } from '@angular/forms';
import { Gallery as ImagesRequest } from 'src/app/modules/common/gallery/models/gallery.model';
import { PostingAccountsResponse } from '../../../charts-of-accounts/models/posting-accounts.model';
import { PostingAccountsQuery } from '../../../charts-of-accounts/states/data-state/posting-account.query';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { VoucherQuery } from '../../states/data-state/voucher-query';
import { environment } from 'src/environments/environment.prod';
import { VOUCHER_TYPE, VoucherTypeEnum } from 'src/app/shared/enums/voucher.enum';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { AddPostingAccountsComponent } from '../../../charts-of-accounts/components/posting-accounts/add-posting-accounts/add-posting-accounts.component';

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {

  public voucherMasterRequest: VouchersMasterRequest = new VouchersMasterRequest();
  public postingAccountsList: PostingAccountsResponse[] = [];

  public addPostingJvDetail: PostingAccountsResponse = new PostingAccountsResponse();
  totalDebitAmount: number = 0;
  totalCreditAmount: number = 0;

  public addJVDetail: VouchersDetailRequest = new VouchersDetailRequest()

  public images: ImagesRequest[] = [];
  VoucherTypeEnum = [
    { name: 'Cash Payment', value: VOUCHER_TYPE.CashPayment },
    { name: 'Cash Receipt', value: VOUCHER_TYPE.CashReceipt },
    { name: 'Bank Payment', value: VOUCHER_TYPE.BankPayment },
    { name: 'Bank Receipt', value: VOUCHER_TYPE.BankReceipt },
    { name: 'Journal', value: VOUCHER_TYPE.Journal },
  ]
  voucher: VoucherMasterList = new VoucherMasterList();
  // VoucherTypeEnum = CommonHelperService.convertEnumObjectToList(VoucherTypeEnum);
  isToShowAddNew: boolean = false;
  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _voucherService: VoucherService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    public _dialogService: DialogService,
    private _postingAccountsQuery: PostingAccountsQuery,
    private _voucherQuery: VoucherQuery,
    private _fileViewerService: FileViewerService
  ) {

    this.voucher = _configDialog?.data ?? new VoucherMasterList();

    if (this.voucher.VouchersMasterId > 0) {
      this._voucherService.getVouchersById(this.voucher.VouchersMasterId).subscribe(
        (master: VouchersMasterRequest) => {
          if (master) {
            master.VoucherDate = DateHelperService.getDatePickerFormat(master.VoucherDate);
            this.voucherMasterRequest = master;
            if (this.voucherMasterRequest.VoucherImagesRequest) {
              this.images = this.voucherMasterRequest.VoucherImagesRequest?.map(x => {
                let image: ImagesRequest = {
                  Id: x.VoucherImagesId,
                  Path: environment.baseUrlApp + x.Imagepath,
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
            this.updateSummary();
          }
        }
      )
    }
    else {
      this.voucherMasterRequest.VoucherTypeId = 3;
    }
  }

  ngOnInit(): void {

    this._postingAccountsQuery.activePostingAccountsList$.subscribe(
      (x: PostingAccountsResponse[]) => {
        this.postingAccountsList = x;
      }
    );
  }

  public close(isToRefresh: boolean = false) {
    this._configDialogRef.close(isToRefresh);
  }

  public submit(f: NgForm) {
    if (!f.invalid) {
      let request: VouchersMasterRequest = new VouchersMasterRequest();
      this.addImagesInVoucherRequest();
      CommonHelperService.mapSourceObjToDestination(this.voucherMasterRequest, request);
      request.VoucherDate = DateHelperService.getServerDateFormat(request.VoucherDate);
      request.OutletId = this._authQuery?.PROFILE?.OutletId;
      if (request.VouchersDetailRequest?.length > 0 && this.totalCreditAmount == this.totalDebitAmount) {
        request.TotalAmount = this.totalCreditAmount;
        request.VouchersMasterId > 0 ? this.UpdateVoucher(request) : this.addVoucher(request);
      }
      else {
        this._service.add({ severity: 'error', summary: 'Voucher details are incorrect', detail: 'Voucher details are incorrect' });
      }

    }
    else {
      this._service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  public printVoucher(): void {
    this._service.add({ severity: 'info', summary: 'Loading', detail: 'Please wait report is being generating', sticky: true });
    this._voucherService
      .printVoucher(this.voucherMasterRequest.VouchersMasterId).subscribe(reportResponse => {
        if (reportResponse) {
          this._service.clear();
          this._service.add({ severity: 'success', summary: 'Successful', detail: 'Report generated successfully', life: 3000 });
          this._fileViewerService.loadFileViewer(reportResponse);
        }
        else {
          this._service.clear();
          this._service.add({ severity: 'info', summary: 'Info', detail: 'No record found for selected criteria', life: 3000 });
        }
      });
  }

  initialStage() {
    this.isToShowAddNew = false;
    this.voucherMasterRequest = new VouchersMasterRequest();
    this.updateSummary();
  }

  private addVoucher(request: VouchersMasterRequest) {
    this._service.add({ severity: 'info', summary: 'Add', detail: 'Voucher is being add' });

    this._voucherService.addVoucher(request).subscribe(
      (x: VoucherMasterList) => {
        if (x) {
          this._service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          x.CreatedBy = this._authQuery.PROFILE.UserName;
          this._voucherQuery.addVoucher(x);
          // this.close(true);
          this.voucherMasterRequest.VouchersMasterId = x.VouchersMasterId;
          this.voucherMasterRequest.SerialNumber = x.SerialNumber;
          this.isToShowAddNew = true;
        }
      }
    )
  }

  addPostingAccount() {
    let dialogRef = this._dialogService.open(AddPostingAccountsComponent, {
      header: 'Add Posting Account',
      data: null,
      width: '40%',
    });
  }

  private UpdateVoucher(request: VouchersMasterRequest) {
    this._service.add({ severity: 'info', summary: 'Update', detail: 'Voucher is being update' });

    this._voucherService.updateVoucher(request).subscribe(
      (x: VoucherMasterList) => {
        if (x) {
          x.CreatedBy = this._authQuery.PROFILE.UserName;
          this._voucherQuery.updateVoucher(x);
          this._service.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          this.close(true);
        }
      }
    )
  }
  deleteVoucherDetail(index: number) {
    this.voucherMasterRequest.VouchersDetailRequest.splice(index, 1);
    this.updateSummary();
  }


  updateSummary() {
    this.totalCreditAmount = CommonHelperService.getSumofArrayPropert(this.voucherMasterRequest.VouchersDetailRequest, 'CreditAmount')
    this.totalDebitAmount = CommonHelperService.getSumofArrayPropert(this.voucherMasterRequest.VouchersDetailRequest, 'DebitAmount')
  }
  onDetailChange(detail: VouchersDetailRequest, type: string) {
    if (type == 'debit') {
      detail.CreditAmount = 0;
    }
    else {
      detail.DebitAmount = 0;
    }
    this.updateSummary()
  }

  debitChange() {
    this.addJVDetail.CreditAmount = 0;
  }
  creditChange() {
    this.addJVDetail.DebitAmount = 0;
  }
  onPostingAccountChange(event: any) {
    this.addJVDetail.PostingAccountsId = event.value.PostingAccountsId;
    this.addJVDetail.PostingAccountsName = event.value.PostingAccountsName;
  }
  public onGalleryChange(event: ImagesRequest[]): void {
    this.images = event;
  }

  addJournalVoucherDetail() {

    if (this.addJVDetail.PostingAccountsId && (this.addJVDetail.DebitAmount > 0 || this.addJVDetail.CreditAmount > 0)) {
      this.voucherMasterRequest.VouchersDetailRequest.push(this.addJVDetail);
      this.addJVDetail = new VouchersDetailRequest();
      this.addPostingJvDetail = new PostingAccountsResponse();
    }
    else {
      this._service.add({ severity: 'error', summary: 'Detail', detail: 'Please Select Posting account and add proper credit or debit amount' });

    }
    this.updateSummary()
  }


  private addImagesInVoucherRequest(): void {
    this.voucherMasterRequest.VoucherImagesRequest = [];
    this.voucherMasterRequest.VoucherImagesRequest = this.images?.map(x => {
      let voucherImageRequest: VoucherImagesRequest = new VoucherImagesRequest();
      voucherImageRequest.VouchersMasterId = this.voucherMasterRequest.VouchersMasterId;
      if (x.IsNew) {

        voucherImageRequest.VoucherImagesId = 0;
        //index sometime 22 or 23 its depend on image type belew line find auurate index automatically
        let index = x.Path.indexOf('base64,');

        //find index of 'base64,' and + 7 of length of 'base64,' character for total length and accurate index
        voucherImageRequest.Imagepath = x.Path.slice(index + 7);
      }
      else {
        voucherImageRequest.VoucherImagesId = x.Id;
        voucherImageRequest.Imagepath = x.Path;
      }
      voucherImageRequest.IsDeleted = x.IsDeleted;
      return voucherImageRequest;
    });
  }

}
