import { GenericBaseModel } from "src/app/shared/models/base.model";

export class PrintHeadCategoryReportsRequest extends GenericBaseModel {
    public HeadCategoriesId: number = 0;
    public ClosingBalance: number = 0;
    public FromDate: any = '';
    public ToDate: any = '';
    public IncludeDetail: boolean = false;
    public IncludeZeroValue: boolean=false;
    public IsActive: boolean=false;
}

export class HeadCategoryListResponse {
    public CustomId: number = 0;
    HeadCategoriesId: number=0;
    HeadCategoriesName: string="";
    SubCategoriesId: number=0;
    SubCategoriesName: string="";
    CreditAmount: number=0;
    DebitAmount: number=0;
    OpeningBalance: number=0;
    ClosingBalance: number=0;

}

export class HeadCategoryReportsCallResponse {
    public PageNumber: number=0;
    ClosingBalance: number=0;
    public RecordsPerPage: number=0;
    public Status: string="";
    public TotalPages: number=0;
    public TotalRecords: number=0;
    public OpeningBalance: number=0;
    public TotalCreditAmount: number=0;
    public TotalDebitAmount: number=0;
    public Data: HeadCategoryListResponse[]=[];
}