import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { AuthQuery } from 'src/app/modules/common/auth/states/auth.query';
import { COA } from 'src/app/shared/enums/rights.enum';
import { AccountHeadsFilterRequest } from '../../../models/charts-of-account.model';
import { PostingAccountsResponse } from '../../../models/posting-accounts.model';
import { PostingAccountsService } from '../../../services/posting-accounts.service';
import { PostingAccountsQuery } from '../../../states/data-state/posting-account.query';
import { AddPostingAccountsComponent } from '../add-posting-accounts/add-posting-accounts.component';

@Component({
    selector: 'app-posting-accounts-list',
    templateUrl: './posting-accounts-list.component.html',
    styleUrls: ['./posting-accounts-list.component.scss']
})
export class PostingAccountsListComponent implements OnInit {
    public postingAccountList: PostingAccountsResponse[] = [];
    public clearPostingAccountSearch: string = "";
    public isDataLoading: boolean = false;
    cols: any[] = [
        { field: 'PostingAccountsName', header: 'Account' },
        { field: 'SubCategoriesName', header: 'Sub Category' },
        { field: 'HeadCategoriesName', header: 'Head Category' },
        { field: 'MainHeadsName', header: 'Main Head' },
        { field: 'IsActive', header: 'Status' },
    ];
    COA = COA;

    constructor(
        private _authQuery: AuthQuery,
        private _postingAccontQuery: PostingAccountsQuery,
        private _postingAccontService: PostingAccountsService,
        private _dialogService: DialogService,
        private _confirmationService: ConfirmationService,
        private _messageService: MessageService,
    ) {
        this._postingAccontQuery.selectLoading().subscribe(
            (x: any) => {
                this.isDataLoading = x
            }
        )
        this._postingAccontQuery.selectAllPostingAccountsList$.subscribe(
            (x: any) => {
                this.postingAccountList = x;
            }
        );
    }

    public ngOnInit(): void {
        this.initialDataServiceCalls();
    }

    public addPostingAccounts(postingAccount?: PostingAccountsResponse): void {
        let dialogRef = this._dialogService.open(AddPostingAccountsComponent, {
            header: 'Add Posting Account ',
            data: postingAccount,
            width: '50%'
        });
    }

    deleteSelected(postingAccount?: PostingAccountsResponse | any): void {
        this._confirmationService.confirm({
            message: 'Are you sure you want to delete the selected posting account?',
            accept: () => {
                this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Posting account is being deleted', sticky: true });
                this._postingAccontQuery.removePostingAccount(postingAccount.PostingAccountsId);
                this._postingAccontService.deletePostingAccount(postingAccount.PostingAccountsId).subscribe(response => {
                    this._messageService.clear();
                    this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Posting account deleted successfully', life: 3000 });
                }, error => {
                    this._messageService.clear();
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error Message',
                        detail: 'An error occurred. Please try again later.',
                        life: 3000
                    });
                })
            }
        });
    }

    public initialDataServiceCalls(): void {
        if (!this._postingAccontQuery.hasEntity()) {
            let filterModal: AccountHeadsFilterRequest = new AccountHeadsFilterRequest();
            filterModal.OrganizationId = this._authQuery.OrganizationId;
            filterModal.OutletId = this._authQuery.OutletId;
            // this.isDataLoading$ = of(true);            
        }
    }
    public clear(table: Table): void {
        this.clearPostingAccountSearch = "";
        table.clear();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
