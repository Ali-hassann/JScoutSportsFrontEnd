import { Component, OnInit } from '@angular/core';
import { CommonHelperService } from 'src/app/shared/services/common-helper.service';
import { ParticularRequest } from '../../models/item-particular.model';
import { ParticularService } from '../../services/item-particular.service';
import { ParticularQuery } from '../../states/item-paticular.query';
import { MessageService } from 'primeng/api';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgForm } from '@angular/forms';
import { ParticularType } from 'src/app/shared/enums/particular-type.enum';
import { FinancialReportResolverResolver } from 'src/app/modules/accounts/reports/financial-reports/financial-report-resolver.resolver';

@Component({
  selector: 'app-add-item-vendors',
  templateUrl: './add-item-vendors.component.html',
  styleUrls: ['./add-item-vendors.component.scss']
})
export class AddItemVendorsComponent implements OnInit {

  particular: ParticularRequest = new ParticularRequest();
  partciclarType: string = "";
  isToAddOpening = false;
  constructor(
    public _configDialogRef: DynamicDialogRef,
    private _authQuery: AuthQuery,
    private _particularService: ParticularService,
    public _configDialog: DynamicDialogConfig,
    private _service: MessageService,
    private _particularQuery: ParticularQuery,
    private _financialReportResolverResolver: FinancialReportResolverResolver
  ) {

    if (this._configDialog?.data?.particular?.ParticularId > 0) {
      CommonHelperService.mapSourceObjToDestination(this._configDialog?.data.particular, this.particular);
    }
    if (this._configDialog?.data) {
      this.partciclarType = this._configDialog?.data?.particularType;
    }
  }

  ngOnInit(): void {
  }

  public Close(isToRefresh?: boolean) {
    this._configDialogRef.close(isToRefresh);
  }

  public submit(f: NgForm) {
    if (!f.invalid) {

      if (this.partciclarType == 'Vendor') {
        this.particular.ParticularType = ParticularType.VENDOR;
      }
      else if (this.partciclarType === "Others") {
        this.particular.ParticularType = ParticularType.OTHERS;
      }
      else {
        this.particular.ParticularType = ParticularType.CUSTOMER;
      }
      this.particular.OutletId = this._authQuery.PROFILE.CurrentOutletId;
      this._service.add({ severity: 'info', summary: 'Loading ...', detail: 'Data is being saving.' });

      if (this.particular?.ParticularId > 0) {
        this.UpdateItem(this.particular);
      }
      else {
        this.addItem(this.particular);
      }
    }
    else {
      this._service.add({ severity: 'warn', summary: 'Forms Field is invalid', detail: 'Validation failed' });
    }
  }

  private addItem(request: ParticularRequest) {
    this._particularService.addParticular(request).subscribe(
      (x: ParticularRequest) => {
        if (x) {
          this._particularQuery.addParticular(x);
          this._financialReportResolverResolver.resolve().subscribe();
          this._service.clear();
          this._service.add({ severity: 'success', summary: 'Saved Sucessfully', detail: 'Saved Sucessfully' });
          this.Close(true);
        }
      }
    )
  }

  private UpdateItem(request: ParticularRequest) {
    this._particularService.updateParticular(request).subscribe(
      (x: ParticularRequest) => {
        if (x) {
          this._particularQuery.updateParticular(x);
          this._financialReportResolverResolver.resolve().subscribe();
          this._service.add({ severity: 'success', summary: 'Updated Sucessfully', detail: 'Saved Sucessfully' });
          this.Close(true);
        }
      }
    )
  }

  onCreditAmountChange(event: any) {
    if (event > 0) {
      this.particular.DebitAmount = 0;
    }
  }
  onDebitAmountChange(event: any) {
    if (event > 0) {
      this.particular.CreditAmount = 0;
    }
  }
}
