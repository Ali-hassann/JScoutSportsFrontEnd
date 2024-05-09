import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VoucherImagesRequest, VoucherMasterList, VouchersDetailRequest, VouchersMasterRequest } from '../../models/voucher.model';
import { PostingAccountsResponse } from '../../../charts-of-accounts/models/posting-accounts.model';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { DateHelperService } from 'src/app/shared/services/date-helper.service';
import { environment } from 'src/environments/environment.prod';
import { PostingAccountsQuery } from '../../../charts-of-accounts/states/data-state/posting-account.query';
import { VoucherService } from '../../services/voucher.service';
import { VoucherQuery } from '../../states/data-state/voucher-query';
import { Gallery as ImagesRequest } from 'src/app/modules/common/gallery/models/gallery.model';
import { VOUCHER_TRANSACTION_TYPE, VoucherTypeEnum } from 'src/app/shared/enums/voucher.enum';
import { ConfigurationSettingQuery } from '../../../accounts-configuration/states/data-states/accounts-configuration.query';
import { FileViewerService } from 'src/app/modules/common/file-viewer/services/file-viewer.service';
import { AddPostingAccountsComponent } from '../../../charts-of-accounts/components/posting-accounts/add-posting-accounts/add-posting-accounts.component';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {


  public voucherMasterRequest: VouchersMasterRequest = new VouchersMasterRequest();
  public postingAccountsList: PostingAccountsResponse[] = [];

  public addPostingJvDetail: PostingAccountsResponse = new PostingAccountsResponse();
  public cash: number = 0;
  public narration: string = "";
  // public addJVDetail: VouchersDetailRequest = new VouchersDetailRequest();

  public images: ImagesRequest[] = [];

  voucher: VoucherMasterList = new VoucherMasterList();
  cashAccountId: number = 0;
  isToShowAddNew: boolean = false;
  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _voucherService: VoucherService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _postingAccountsQuery: PostingAccountsQuery,
    private _voucherQuery: VoucherQuery,
    private _configurationSettingQuery: ConfigurationSettingQuery,
    private _fileViewerService: FileViewerService,
    public _dialogService: DialogService,
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
          }
        }
      )
    }
    else {
      this.voucherMasterRequest.VoucherTypeId = 3;
    }
  }

  ngOnInit(): void {
    this.cashAccountId = this._configurationSettingQuery.getAllConfigurationList()?.find(x => x.AccountName === "CashAccount")?.AccountValue ?? 0;

    this._postingAccountsQuery.activePostingAccountsList$.subscribe(
      (x: PostingAccountsResponse[]) => {
        this.postingAccountsList = x;
      }
    );
  }

  public close(isToRefresh: boolean = false) {
    this._configDialogRef.close(isToRefresh);
  }

  initialStage() {
    this.isToShowAddNew = false;
    this.cash = 0;
    this.narration = "";
    this.addPostingJvDetail = new PostingAccountsResponse();
    this.voucherMasterRequest = new VouchersMasterRequest();
  }

  addPostingAccount() {
    let dialogRef = this._dialogService.open(AddPostingAccountsComponent, {
      header: 'Add Posting Account',
      data: null,
      width: '40%',
    });
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

  public submit(f: NgForm) {
    if (!f.invalid) {
      let request: VouchersMasterRequest = new VouchersMasterRequest();
      this.addImagesInVoucherRequest();
      this.addPaymentVoucherDetail();
      CommonHelperService.mapSourceObjToDestination(this.voucherMasterRequest, request);
      request.VoucherDate = DateHelperService.getServerDateFormat(request.VoucherDate);
      request.OutletId = this._authQuery?.PROFILE?.OutletId;
      if (request.VouchersDetailRequest?.length > 0) {
        this.addVoucher(request);
        // request.VouchersMasterId > 0 ? this.UpdateInvoice(request) : this.addInvoice(request);
      }
      else {
        this._service.add({ severity: 'error', summary: 'Voucher details are incorrect', detail: 'Voucher details are incorrect' });
      }
    }
    else {
      this._service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  private addVoucher(request: VouchersMasterRequest) {
    this._service.add({ severity: 'info', summary: 'Add', detail: 'Voucher is being add' });
    this._voucherService.addVoucher(request).subscribe(
      (x: VoucherMasterList) => {
        if (x) {
          this._service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          x.CreatedBy = this._authQuery.PROFILE.UserName;
          this._voucherQuery.addVoucher(x);
          this.voucherMasterRequest.VouchersMasterId = x.VouchersMasterId;
          this.voucherMasterRequest.SerialNumber = x.SerialNumber;
          this.isToShowAddNew = true;
          // this.Close();
          // this.postingAccountField.nativeElement.focus();
        }
      }
    );
  }

  private addPaymentVoucherDetail() {
    if (this.cashAccountId > 0) {
      if (this.addPostingJvDetail.PostingAccountsId > 0 && this.cash > 0) {
        this.voucherMasterRequest.VoucherTypeId = VoucherTypeEnum.Payment;
        this.voucherMasterRequest.TotalAmount = this.cash;

        for (let i = 0; i < 2; i++) {
          let voucherDetail: VouchersDetailRequest = new VouchersDetailRequest();
          if (i == 0) {
            voucherDetail.PostingAccountsId = this.addPostingJvDetail.PostingAccountsId;
            // voucherDetail.PostingAccountsName = this.addPostingJvDetail.PostingAccountsName;
            voucherDetail.DebitAmount = this.cash;
            voucherDetail.Narration = this.narration;

          }
          else {
            voucherDetail.PostingAccountsId = this.cashAccountId;
            // voucherDetail.PostingAccountsName = this.addPostingJvDetail.PostingAccountsName;
            voucherDetail.CreditAmount = this.cash;
            voucherDetail.Narration = this.narration;
          }
          voucherDetail.TransactionType = VOUCHER_TRANSACTION_TYPE.Cash;
          this.voucherMasterRequest.VouchersDetailRequest.push(voucherDetail)
        }
      }
      else {
        this._service.add({ severity: 'error', summary: 'Detail', detail: 'Please select posting account and cash must be greater then zero' });
      }
    }
    else {
      this._service.add({ severity: 'error', summary: 'Detail', detail: 'Please set account configuration', sticky: true });
    }
  }

  public onGalleryChange(event: ImagesRequest[]): void {
    this.images = event;
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

  @ViewChild('debitInputField') debitInputField!: ElementRef;
  @ViewChild('postingAccountField') postingAccountField!: ElementRef;

  focusInputField() {
    this.debitInputField.nativeElement.focus();
  }
}