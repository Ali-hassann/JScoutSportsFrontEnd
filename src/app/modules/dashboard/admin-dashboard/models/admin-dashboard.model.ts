import { GenericBaseModel } from "src/app/shared/models/base.model";

export class AdminDashboardDetail {
    Cash: number = 0;
    Bank: number = 0;
    CreditCard: number = 0;
    Income: number = 0;
    Expense: number = 0;
}
export class AdminDashboardDetailRequest extends AdminDashboardDetail {
    MaxIncomeExpenseDetail: MaxIncomeExpenseDetail[] = [];
}
export class DashboardMonthWiseProfitLossRequest extends GenericBaseModel {
    Year: number = 0;
    MonthId: number = 0;
    IsActive: boolean = false;
}
export class DashboardMonthWiseProfitLossResponse extends GenericBaseModel {
    public Income: number = 0;
    public Expense: number = 0;
    public Profit: number = 0;
    public Loss: number = 0;
    public MonthName: string = "";
    public MonthNumber: number = 0;
}
export class MaxIncomeExpenseDetail {
    public OutletId: number = 0;
    public OrganizationId: number = 0;
    public PostingAccountsId: number = 0;
    public PostingAccountsName: string = "";
    public Amount: number = 0;
    public Type: string = "";
}
export class dashboardTransactionHistory {
    public VouchersMasterId: number = 0;
    public VouchersTypeName: string = "";
    public TotalAmount: number = 0;
    public CreatedDate: any;
}
export class DashboardTransactionHistoryRequest extends GenericBaseModel {
    public FromDate: any | Date = "";
    public ToDate: string | Date = "";
    public IsActive: boolean = false;
}

export class dashboardBranches {
    OutletId: number = 0;
    BranchName: string = '';
    PrincipalName: string = '';
    ImagePath: string = '';
    OrganizationId: number = 0;
    Cash: number = 0;
    Bank: number = 0;
    CreditCard: number = 0;
    Income: number = 0;
    Expense: number = 0;
}

export class DashboardDetailRequest extends GenericBaseModel {
    FromDate: any;
    ToDate: any;
    IsActive?: boolean;
}

export class TrialBalanceDataResponse {
    PostingAccountsId: number = 0;
    PostingAccountsName: string = "";
    SubCategoriesId: number = 0;
    SubCategoriesName: string = "";
    HeadCategoriesId: number = 0;
    HeadCategoriesName: string = "";
    MainHeadsId: number = 0;
    MainHeadsName: string = "";
    OpeningBalance: number = 0;
    DebitAmount: number = 0;
    CreditAmount: number = 0;
    ClosingBalance: number = 0;
}