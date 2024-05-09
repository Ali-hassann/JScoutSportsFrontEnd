import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { MainHeadsResponse } from '../../../models/main-head.model';
import { MainHeadService } from '../../../services/main-head.service';
import { MeanHeadQuery } from '../../../states/data-state/main-head.query';
@Component({
  selector: 'app-main-head-list',
  templateUrl: './main-head-list.component.html',
  styleUrls: ['./main-head-list.component.scss']
})
export class MainHeadListComponent implements OnInit {

  public mainHeadList: MainHeadsResponse[] = [];

  public selectedBranch: any = null;
  public clearMainHeadSearch: string = "";

  cols: any[] = [
    { field: 'Name', header: 'Name' },
  ];


  constructor(
    private _mainHeadQuery: MeanHeadQuery,
    private _mainHeadService: MainHeadService,
    private route: ActivatedRoute
  ) {
    this._mainHeadQuery.mainHeadList$.subscribe(
      (x: any) => {
        this.mainHeadList = x;
      }
    );
    // this.route.data.subscribe((data: any) => {
    //   data.breadcrumb = 'Main Head';
    // });
  }

  public ngOnInit(): void {
    this.initialDataServiceCalls();

  }

  public initialDataServiceCalls(): void {
    if (!this._mainHeadQuery.hasEntity()) {
      this._mainHeadService.getMainHeadList();
    }
  }

  public clear(table: Table): void {
    this.clearMainHeadSearch = "";
    table.clear();
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}
