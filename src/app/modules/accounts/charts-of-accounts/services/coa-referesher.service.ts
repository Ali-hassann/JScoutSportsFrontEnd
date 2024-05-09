import { Injectable } from '@angular/core';
import { GenericBaseModel } from 'src/app/shared/models/base.model';
import { AuthQuery } from '../../../common/auth/states/auth.query';
import { HeadCategoryService } from './head-category.service';
import { MainHeadService } from './main-head.service';
import { PostingAccountsService } from './posting-accounts.service';
import { SubCategoryService } from './sub-category.service';

@Injectable({
  providedIn: 'root'
})
export class CoaReferesherService {

  constructor(
    private _headCategoryService: HeadCategoryService,
    private _mainHeadService: MainHeadService,
    private _postingAccountsService: PostingAccountsService,
    private _subCategoryService: SubCategoryService,
    private _authQuery: AuthQuery
  ) {
  }

  public getChartOfAccountDataList() {
    this._headCategoryService.getHeadCategoryList(this._authQuery.OutletId);
    this._mainHeadService.getMainHeadList();
    this._postingAccountsService.getPostingAccountList(this._authQuery.OutletId);
    this._subCategoryService.getSubCategoryList(this._authQuery.OutletId);
  }
}
