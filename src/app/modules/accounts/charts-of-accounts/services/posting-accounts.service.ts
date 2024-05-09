import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GenericBaseModel } from 'src/app/shared/models/base.model';
import { AccountHeadsFilterRequest } from '../models/charts-of-account.model';
import { PostingAccountsResponse } from '../models/posting-accounts.model';
import { PostingAccountsQuery } from '../states/data-state/posting-account.query';

@Injectable({
  providedIn: 'root'
})
export class PostingAccountsService {

  constructor(
    private _http: HttpClient,
    private _postingAccountQuery: PostingAccountsQuery,
  ) { }

  public getPostingAccountList(outletId: number) {
    let url = `ChartOfAccounts/GetPostingAccountList?outletId=${outletId}`;
    this._http
      .get<PostingAccountsResponse[]>(url)
      .pipe(
        tap((data: PostingAccountsResponse[]) => {
          if (data?.length > 0) {
            this._postingAccountQuery.addPostingAccountList(data)
          } else {
            this._postingAccountQuery.addPostingAccountList([]);
          }
        }))
      .subscribe();
  }

  public addPostingAccount(entity: PostingAccountsResponse): Observable<PostingAccountsResponse> {
    let url = "ChartOfAccounts/AddPostingAccounts";
    return this._http.post<PostingAccountsResponse>(url, entity) as Observable<PostingAccountsResponse>;
  }
  public updatePostingAccount(entity: PostingAccountsResponse): Observable<PostingAccountsResponse> {
    let url = "ChartOfAccounts/UpdatePostingAccounts";
    return this._http.post<PostingAccountsResponse>(url, entity) as Observable<PostingAccountsResponse>;
  }

  public deletePostingAccount(id: number): Observable<boolean> {
    let url = `ChartOfAccounts/RemovePostingAccount?postingAccountsId=${id}`;
    return this._http.post<boolean>(url, id) as Observable<boolean>;
  }
}
