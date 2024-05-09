import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemOpeningRequest } from './models/item-opening.model';

@Injectable({
    providedIn: 'root'
})
export class ItemOpeningService {

    constructor(
        private _http: HttpClient,
    ) { }

    saveItemOpening(request: ItemOpeningRequest[]): Observable<boolean> {
        const url = `Inventory/SaveItemOpening`;
        return this._http.post(url, request) as Observable<boolean>;
    }

    getItemOpeningList(outletId: number): Observable<ItemOpeningRequest[]> {
        const url = `Inventory/GetItemOpeningList?outletId=${outletId}`;
        return this._http.get<ItemOpeningRequest[]>(url) as Observable<ItemOpeningRequest[]>;
    }
}