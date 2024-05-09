import { Component, OnInit } from '@angular/core';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { GenericBaseModel } from 'src/app/shared/models/base.model';
import { ChartsOfAccountService } from '../../services/charts-of-account.service';

@Component({
  selector: 'app-tree-structure',
  templateUrl: './tree-structure.component.html',
  styleUrls: ['./tree-structure.component.scss']
})
export class TreeStructureComponent implements OnInit {

  constructor(
    private _authQuery: AuthQuery,
    private _chartsOfAccountService: ChartsOfAccountService,
  ) {
  }

  public ngOnInit(): void {
    this.printChartOfAccountsReport()
  }
  public printChartOfAccountsReport() {
    let baseModel = new GenericBaseModel();
    baseModel.OrganizationId = this._authQuery.OrganizationId;
    baseModel.OutletId = this._authQuery.OutletId;
    baseModel.OutletName = this._authQuery.PROFILE.OrganizationProfile.OutletName ?? "Outlet Name";
    baseModel.OutletName = this._authQuery.PROFILE.OrganizationProfile.Address ?? "Address";
    this._chartsOfAccountService.printChartOfAccounts(baseModel).subscribe(response => {
      if (response) {

        let blob: Blob = response.body as Blob;
        let frame = document.getElementById("frame") as HTMLIFrameElement;
        frame.src = window.URL.createObjectURL(blob);
      }
    });
  }
}
