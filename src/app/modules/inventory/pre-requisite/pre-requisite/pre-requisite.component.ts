import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { InventoryRights } from 'src/app/shared/enums/rights.enum';
import { UiInventoryTabQuery } from '../state/ui-inventory-tab.query';
import { TabsUIModel } from 'src/app/modules/accounts/charts-of-accounts/models/charts-of-account.model';

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
    private _uiInventoryTabQuery: UiInventoryTabQuery,
  ) {
  }

  public ngOnInit(): void {
    this.setBreadCrumb('Item Types');
    this.uiDataBinding();
  }

  private setBreadCrumb(name: string): void {
    this._breadcrumbService.setBreadcrumbs([
      { label: 'Inventory' },
      { label: name },
    ]);
  }

  private uiDataBinding(): void {
    this.activeTabindex = this._uiInventoryTabQuery.getUi()?.ActiveTabIndex;
  }

  public onTabChange(event: any): void {
    if (event?.index > -1) {
      this.setBreadCrumb(event.originalEvent?.currentTarget?.innerText);
    }
    this.activeTabindex = event.index;
    this.updateUI();
  }

  public ngOnDestroy(): void {
    this.updateUI();
  }

  private updateUI(): void {
    this._uiInventoryTabQuery.updateUi({ ActiveTabIndex: this.activeTabindex });
  }
}