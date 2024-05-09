import { GenericBaseModel } from "src/app/shared/models/base.model";

export class PrintMainHeadReportsRequest extends GenericBaseModel {
    public MainHeadId: number = 0;
    public FromDate: any = '';
    public ToDate: any = '';
    public IncludeZeroValue: boolean = false;
    public IsActive: boolean = false;
}

export class MainHeadListResponse {
    public MainHeadId: number = 0;
    public MainHeadName: string = "";
    public HeadCategoriesId: number = 0;
    public HeadCategoriesName: string = "";
    public CreditAmount: number = 0;
    public DebitAmount: number = 0;
    public OpeningBalance: number = 0;
    public ClosingBalance: number = 0;
}


export class MainHeadReportsCallResponse {
    public PageNumber: number = 0;
    public RecordsPerPage: number = 0;
    public Status: string = "";
    public TotalPages: number = 0;
    public TotalRecords: number = 0;
    public OpeningBf: number = 0;
    public TotalCreditAmount: number = 0;
    public TotalDebitAmount: number = 0;
    public Title: string = "";
    public OpeningBalance: number = 0;
    public ClosingBalance: number = 0;
    public Data: MainHeadListResponse[] = [];
}