import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DATA_STORE_NAME } from 'src/app/shared/enums/stores.enum';
import { UserRightsRequest } from '../models/user-rights.model';

export interface UserRightsState extends EntityState<UserRightsRequest> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({
  name: DATA_STORE_NAME.USERRIGHTS,
  idKey: 'RightsId'
})
export class UserRightsStore extends EntityStore<UserRightsState> {

  constructor() {
    super();
  }

}
