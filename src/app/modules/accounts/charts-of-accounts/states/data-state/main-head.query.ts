import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { MainHeadsResponse } from '../../models/main-head.model';
import { MainHeadState, MainHeadStore } from './main-head.store';

@Injectable({ providedIn: "root" })
export class MeanHeadQuery extends QueryEntity<MainHeadState> {

    public mainHeadList$: Observable<MainHeadsResponse[]>;


    constructor(
        protected _mainHeadStore: MainHeadStore
    ) {
        super(_mainHeadStore);

        this.mainHeadList$ = this.selectAll();
    }
    public reset():void{
        this.store.remove();
    }

}