import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { MainHeadsResponse } from '../models/main-head.model';
import { MainHeadStore } from '../states/data-state/main-head.store';

@Injectable({
  providedIn: 'root'
})
export class MainHeadService {

  constructor(
    private _http: HttpClient,
    private _mainHeadStore: MainHeadStore,
  ) { }

  public getMainHeadList(): void {
    let url = "ChartOfAccounts/GetMainHeadsList";
    this._http.get<MainHeadsResponse[]>(url).pipe(
      map(response => {
        if (response?.length > 0) {
          this._mainHeadStore.add(response);
        } else {
          this._mainHeadStore.add([]);
        }
      })
    ).subscribe();
  }
}
