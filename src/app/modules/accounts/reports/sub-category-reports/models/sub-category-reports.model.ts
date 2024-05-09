import { GenericBaseModel } from "src/app/shared/models/base.model";


export class PrintSubCategoryReportsRequest extends GenericBaseModel {
    public SubCategoriesId: number = 0;
    public FromDate: any = '';
    public ToDate: any = '';
    public IncludeZeroValue: boolean = false;
    public IsActive: boolean = false;
}

export class SubCategoryListResponse {
    public CustomId: number = 0;
    public SubCategoriesId: number = 0;
    SubCategoriesName: string = "";
    PostingAccountsId: number = 0;
    PostingAccountsName: string = "";
    CreditAmount: number = 0;
    DebitAmount: number = 0;
    OpeningBalance: number = 0;
    ClosingBalance: number = 0;
}

export class SubCategoryLReportsCallResponse {
    public PageNumber: number = 0;
    public RecordsPerPage: number = 0;
    public Status: string = "";
    public TotalPages: number = 0;
    public TotalRecords: number = 0;
    public OpeningBalance: number = 0;
    public TotalCreditAmount: number = 0;
    public TotalDebitAmount: number = 0;
    public Data: SubCategoryListResponse[] = [];
}