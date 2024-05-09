import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { Observable, of } from 'rxjs';
import { COA } from 'src/app/shared/enums/rights.enum';
import { SubCategoriesResponse } from '../../../models/sub-category.model';
import { SubCategoryService } from '../../../services/sub-category.service';
import { SubCategoryQuery } from '../../../states/data-state/sub-category.query';
import { AddSubCategoryComponent } from '../add-sub-category/add-sub-category.component';
import { GenericBaseModel } from 'src/app/shared/models/base.model';

@Component({
    selector: 'app-sub-category-list',
    templateUrl: './sub-category-list.component.html',
    styleUrls: ['./sub-category-list.component.scss']
})
export class SubCategoryListComponent implements OnInit {

    public subCategoryList: SubCategoriesResponse[] = [];
    public clearSubCategorySearch: string = "";
    public isDataLoading$: Observable<boolean> = of(false);

    cols: any[] = [
        { field: 'SubCategoriesName', header: 'Sub Category' },
        { field: 'HeadCategoriesName', header: 'Head Category' },
        { field: 'MainHeadsName', header: 'Main Head' },
    ];
    COA = COA;

    constructor(
        private _subCategoryQuery: SubCategoryQuery,
        private _subCategoryService: SubCategoryService,
        private _dialogService: DialogService,
        private _confirmationService: ConfirmationService,
        private _messageService: MessageService,
    ) {
    }

    public ngOnInit(): void {
        this.getSubCategoriesList();
    }

    getSubCategoriesList() {
        this._subCategoryQuery.subCategoryList$.subscribe(
            (x: any) => {
                this.subCategoryList = x;
            }
        );
    }

    public addSubCategory(subCategory?: SubCategoriesResponse): void {
        let dialogRef = this._dialogService.open(AddSubCategoryComponent, {
            header: 'Add SubCategory',
            data: subCategory,
            width: '35%'
        });
        dialogRef.onClose.subscribe(s => {
            if (s) {
                this.getSubCategoriesList();
            }
        });
    }

    deleteSelected(subCategory?: SubCategoriesResponse | any): void {
        this._confirmationService.confirm({
            message: 'Are you sure you want to delete the selected sub category?',
            accept: () => {
                this._messageService.add({ severity: 'info', summary: 'Loading', detail: 'Sub category is being added' });



                if (this._subCategoryQuery.IsChildExist(subCategory.SubCategoriesId)) {
                    this._messageService.clear();
                    this._messageService.add({
                        severity: 'error',
                        summary: 'Error Message',
                        detail: 'Can not deleted because it has a child exist',
                        life: 3000
                    });
                }
                else {
                    this._subCategoryQuery.removeSubCategory(subCategory.SubCategoriesId);
                    this._subCategoryService.deleteSubCategory(subCategory.SubCategoriesId).subscribe(response => {
                        if (response) {
                            this._messageService.clear();
                            this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'SubCategory deleted successfully', life: 3000 });
                        }
                        else {
                            this._messageService.clear();
                            this._messageService.add({
                                severity: 'error',
                                summary: 'Error Message',
                                detail: 'An error occurred. Please try again later.',
                                life: 3000
                            });
                        }
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
            }
        });
    }


    public clear(table: Table): void {
        this.clearSubCategorySearch = "";
        table.clear();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
