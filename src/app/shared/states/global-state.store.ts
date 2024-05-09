import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface GlobalState {
  SelectedOutletId: number;
}

export function createInitialState(): GlobalState {
  return {
    SelectedOutletId: 0
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'GLOBAL-STATE' })
export class GlobalStore extends Store<GlobalState> {

  constructor() {
    super(createInitialState());
  }

}
