import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UserRightsRequest } from '../models/user-rights.model';
import { UserRightsState, UserRightsStore } from './user-rights.store';

@Injectable({ providedIn: 'root' })
export class UserRightsQuery extends QueryEntity<UserRightsState> {

  constructor(protected _store: UserRightsStore) {
    super(_store);
  }
  public add(rights: UserRightsRequest[]): void {
    this._store.add(rights)
  }
  public remove(): void {
    this._store.remove();
  }

  getHasRight(rightName: string): boolean {
    if (rightName) {
      return this.getCount(c =>
        c.RightsName.toLowerCase() === rightName.toLowerCase()
        && c.HasAccess
      ) > 0;
    }
    return false;
  }

}
