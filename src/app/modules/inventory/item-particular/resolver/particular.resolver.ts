import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { ParticularService } from '../services/item-particular.service';

@Injectable({
  providedIn: 'root'
})
export class ParticularResolver implements Resolve<boolean> {
  constructor(
    private _particularService: ParticularService,
    private _authQuery: AuthQuery,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this._particularService.getParticularList(this._authQuery.PROFILE.OutletId);
    return of(true);
  }
}
