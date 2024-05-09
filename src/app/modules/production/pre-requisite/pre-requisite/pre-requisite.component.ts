import { Component, OnInit } from '@angular/core';
import { AppBreadcrumbService } from 'src/app/layout/app.breadcrumb.service';

@Component({
  selector: 'app-pre-requisite',
  templateUrl: './pre-requisite.component.html',
})
export class PreRequisiteComponent implements OnInit {
  public display: boolean = true;
  public activeTabindex: number = 0;
  constructor(
    private _breadcrumbService: AppBreadcrumbService,
  ) {
  }

  public ngOnInit(): void {
    this.setBreadCrumb('Article Category');
  }

  public setBreadCrumb(name: string): void {
    this._breadcrumbService.setBreadcrumbs([
      { label: 'Production' },
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
