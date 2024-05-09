import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import { GenericBaseModel } from 'src/app/shared/models/base.model';
import { HeadCategoriesRequest } from '../models/head-category.model';
import { HeadCategoryQuery } from '../states/data-state/head-category.query';

@Injectable({
  providedIn: 'root'
})
export class HeadCategoryService {

  constructor(
    private _http: HttpClient,
    private _headCategoryQuery: HeadCategoryQuery,
  ) { }

  public getHeadCategoryList(outletId: number) {
    let url = `ChartOfAccounts/GetHeadCategoriesList?outletId=${outletId}`;
    this._http
      .get<HeadCategoriesRequest[]>(url)
      .pipe(
        tap((data: HeadCategoriesRequest[]) => {
          if (data?.length > 0) {
            this._headCategoryQuery.addHeadCategoryList(data)
          } else {
            this._headCategoryQuery.addHeadCategoryList([]);
          }
        }))
      .subscribe();
  }

  public addHeadCategory(entity: HeadCategoriesRequest): Observable<HeadCategoriesRequest> {
    let url = "ChartOfAccounts/AddHeadCategory";
    return this._http.post<HeadCategoriesRequest>(url, entity) as Observable<HeadCategoriesRequest>;
  }

  public updateHeadCategory(entity: HeadCategoriesRequest): Observable<HeadCategoriesRequest> {
    let url = "ChartOfAccounts/UpdateHeadCategory";
    return this._http.post<HeadCategoriesRequest>(url, entity) as Observable<HeadCategoriesRequest>;
  }

  public deleteHeadCategory(id: number): Observable<boolean> {
    let url = `ChartOfAccounts/RemoveHeadCategory?headCategoriesId=${id}`;
    return this._http.post<boolean>(url, null) as Observable<boolean>;
  }
}
