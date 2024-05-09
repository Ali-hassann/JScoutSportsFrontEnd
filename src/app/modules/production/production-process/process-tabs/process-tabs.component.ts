import { Component, Input, OnInit } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';

@Component({
  selector: 'app-process-tabs',
  templateUrl: './process-tabs.component.html',
  styleUrls: ['./process-tabs.component.scss']
})
export class ProcessTabsComponent implements OnInit {
  public activeTabindex: number = 0;
  @Input() mainProcessTypeId: number = 0;
  constructor(
    private _authQuery: AuthQuery,
    private breadcrumbService: AppBreadcrumbService,
  ) {
  }

  ngOnInit(): void {

    this.breadcrumbService.setBreadcrumbs([
      { label: 'Production Process' }
    ]);
  }

  public onTabChange(event: any): void {
    this.activeTabindex = event.index;
  }
}
