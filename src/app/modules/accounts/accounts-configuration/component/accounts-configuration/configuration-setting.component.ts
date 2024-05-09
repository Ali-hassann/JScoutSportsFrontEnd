import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccountHeadsFilterRequest } from 'src/app/modules/accounts/charts-of-accounts/models/charts-of-account.model';
import { PostingAccountsResponse } from 'src/app/modules/accounts/charts-of-accounts/models/posting-accounts.model';
import { SubCategoriesResponse } from 'src/app/modules/accounts/charts-of-accounts/models/sub-category.model';
import { PostingAccountsQuery } from 'src/app/modules/accounts/charts-of-accounts/states/data-state/posting-account.query';
import { SubCategoryQuery } from 'src/app/modules/accounts/charts-of-accounts/states/data-state/sub-category.query';
import { ConfigurationSetting } from '../../models/configuration-setting.model';
import { ConfigurationSettingService } from '../../services/configuration-setting.service';
import { ConfigurationSettingQuery } from '../../states/data-states/accounts-configuration.query';

@Component({
  selector: 'app-configuration-setting',
  templateUrl: './configuration-setting.component.html',
  styleUrls: ['./configuration-setting.component.scss'],
  providers:[MessageService ]
})
export class ConfigurationSettingComponent implements OnInit {

  public postingAccountsList: PostingAccountsResponse[] = [];
  public subCategoryList: SubCategoriesResponse[] = [];
  public accountHeadsFilterRequest: AccountHeadsFilterRequest = new AccountHeadsFilterRequest();
  public configurationSettingList: ConfigurationSetting[] = [];
  selectedNumber: number = 0;
  constructor(
    private _postingAccountsQuery: PostingAccountsQuery
    , private _subCategoryQuery: SubCategoryQuery
    , private _dialogRef: DynamicDialogRef
    , private _accountsConfigQuery: ConfigurationSettingQuery
    , private _accountsConfigService: ConfigurationSettingService
    , private _messageService: MessageService
  ) { }

  public ngOnInit(): void {

    this.assignObservableValues();
    this._accountsConfigQuery.getAllConfigurationList().forEach(
      (x: ConfigurationSetting) => {
        let request = new ConfigurationSetting();
        request.AccountName = x.AccountName;
        request.AccountValue = x.AccountValue;
        request.ConfigurationSettingId = x.ConfigurationSettingId;
        request.OutletId = x.OutletId;
        this.configurationSettingList.push(request);
      }
    );
  }


  public saveConfigurationSetting(): void {
    this._dialogRef.close();
    this._accountsConfigService
      .saveConfigurationSetting(this.configurationSettingList)
      .subscribe
      (accountsConfigResponse => {
        if (accountsConfigResponse) {
          // Store Working
          this._accountsConfigQuery.removeConfigurationSetting();
          this._accountsConfigQuery.saveConfigurationSetting(accountsConfigResponse);
          //
          this.showToastMessage("Configuration setting saved successfully.", "success");
        }
      })
  }

  public close(): void {
    this._dialogRef.close();
  }

  private assignObservableValues(): void {

    // Assigning COA from Store
    this._postingAccountsQuery.activePostingAccountsList$.subscribe(
      (x: any) => {
        this.postingAccountsList = x
      }
    );
    this._subCategoryQuery.subCategoryList$.subscribe(
      (x: any) => {
        this.subCategoryList = x;
      }
    );
    //   
  }

  getAccountValue(event: any) {
    if (event) {
      this.selectedNumber = event.value;
    }
  }

  private showToastMessage(
    messageToShow: string = "Something went wrong"
    , messageType: string = "error"
    , life: number = 3000
  ): void {

    this._messageService.add({
      severity: messageType,
      summary: messageType == "error" ? 'Error' : 'Successful',
      detail: messageToShow,
      life: life
    });
  }
}
