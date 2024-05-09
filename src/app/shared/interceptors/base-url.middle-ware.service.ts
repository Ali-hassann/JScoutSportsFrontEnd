import { HttpResponse } from '@angular/common/http';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class BaseUrlMiddleWareService implements HttpInterceptor {

    constructor(
        private _authQuery: AuthQuery,
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // adding base url
        const baseUrlAdded = request.clone({ url: `${environment.baseUrl}${request.url}` });

        // adding header to pass api key
        let token = this._authQuery?.PROFILE?.Token ?? '';
        let currentLogin = '';
        if (token) {
            const decoded = jwt_decode(token);
            if (decoded) {
                currentLogin = JSON.stringify(decoded);
            }
        }
        
        const tokenAdded = baseUrlAdded.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
                Outletname: this._authQuery?.PROFILE?.OrganizationProfile?.OutletName ?? "",
                Address: this._authQuery?.PROFILE?.OrganizationProfile?.Address ?? "",
                Outletimage: this._authQuery?.PROFILE?.OrganizationProfile?.ImagePath ?? "",
                // CurrentOutletId: `${this._authQuery?.PROFILE?.CurrentOutletId}`,
                currentlogin: currentLogin
            }
        });

        return next.handle(tokenAdded);
    }
}