import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class SignUpService {
  defaultCountryCode = 'pak';

  constructor(
    private _http: HttpClient) { }

  checkUserExist(username: string): Observable<boolean> {
    return this._http.get<boolean>(`Identity/CheckExistingUserNameOrEmail?userName=${username}&email=''`);
  }

  checkEmailExist(email: string): Observable<boolean> {
    return this._http.get<boolean>(`Identity/CheckExistingUserNameOrEmail?userName=''&email=${email}`);
  }
}
