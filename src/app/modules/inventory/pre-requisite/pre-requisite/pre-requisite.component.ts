import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { InventoryRights } from 'src/app/shared/enums/rights.enum';

@Component({
  selector: 'app-pre-requisite',
  templateUrl: './pre-requisite.component.html',
  styleUrls: ['./pre-requisite.component.scss']
})
export class PreRequisiteComponent implements OnInit {

  public display: boolean = true;
  public activeTabindex: number = 0;
  InventoryRights = InventoryRights;
  
  constructor(
    private _breadcrumbService: AppBreadcrumbService,
  ) {
  }

  public ngOnInit(): void {
    this.setBreadCrumb('Item Types');
  }

  public setBreadCrumb(name: string): void {
    this._breadcrumbService.setBreadcrumbs([
      { label: 'Stock Management' },
      { label: name },
    ]);
  }


  public onTabChange(event: any): void {
    if (event?.index > -1) {
      this.setBreadCrumb(event.originalEvent?.currentTarget?.innerText);
    }
    this.activeTabindex = event.index;
  }


}
