import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GenericBaseModel } from 'src/app/shared/models/base.model';
import { SubCategoriesRequest, SubCategoriesResponse } from '../models/sub-category.model';
import { SubCategoryQuery } from '../states/data-state/sub-category.query';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

  constructor(
    private _http: HttpClient,
    private _subCategoryQuery: SubCategoryQuery,
  ) { }

  public getSubCategoryList(outletId: number) {
    let url = `ChartOfAccounts/GetSubCategoriesList?outletId=${outletId}`;
    this._http
      .get<SubCategoriesResponse[]>(url)
      .pipe(
        tap((data: SubCategoriesResponse[]) => {
          if (data?.length > 0) {
            this._subCategoryQuery.addSubCategoryList(data)
          } else {
            this._subCategoryQuery.addSubCategoryList([]);
          }
        }))
      .subscribe();
  }
  public addSubCategory(entity: SubCategoriesResponse): Observable<SubCategoriesResponse> {
    let url = "ChartOfAccounts/AddSubCategory";
    return this._http.post<SubCategoriesResponse>(url, entity) as Observable<SubCategoriesResponse>;
  }
  public updateSubCategory(entity: SubCategoriesRequest): Observable<SubCategoriesResponse> {
    let url = "ChartOfAccounts/UpdateSubCategory";
    return this._http.post<SubCategoriesResponse>(url, entity) as Observable<SubCategoriesResponse>;
  }

  public deleteSubCategory(id: number): Observable<boolean> {
    let url = `ChartOfAccounts/RemoveSubCategory?subCategoriesId=${id}`;
    return this._http.post<boolean>(url, null) as Observable<boolean>;
  }
}
