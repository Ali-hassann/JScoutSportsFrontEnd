import { Component, OnInit } from '@angular/core';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { GenericBaseModel } from 'src/app/shared/models/base.model';
import { ChartsOfAccountService } from '../../services/charts-of-account.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-tree-structure',
  templateUrl: './tree-structure.component.html',
  styleUrls: ['./tree-structure.component.scss']
})
export class TreeStructureComponent implements OnInit {

  constructor(
    private _authQuery: AuthQuery,
    private _chartsOfAccountService: ChartsOfAccountService,
    private _messageService: MessageService,
  ) {
  }

  public ngOnInit(): void {
    this.printChartOfAccountsReport()
  }
  public printChartOfAccountsReport() {
    this._messageService.add({ severity: 'info', summary: 'Fetching Data.', detail: `Please wait data is being fetched.` });
    let baseModel = new GenericBaseModel();
    baseModel.OrganizationId = this._authQuery.OrganizationId;
    baseModel.OutletId = this._authQuery.OutletId;
    baseModel.OutletName = this._authQuery.PROFILE.OrganizationProfile.OutletName ?? "Outlet Name";
    baseModel.OutletName = this._authQuery.PROFILE.OrganizationProfile.Address ?? "Address";
    this._chartsOfAccountService.printChartOfAccounts(baseModel).subscribe(response => {
      if (response) {
        this._messageService.clear();
        this._messageService.add({ severity: 'success', summary: 'Succesfully.', detail: `Succesfully data fetched.`, life: 3000 });

        let blob: Blob = response.body as Blob;
        let frame = document.getElementById("frame") as HTMLIFrameElement;
        frame.src = window.URL.createObjectURL(blob);
      }
    });
  }
}
