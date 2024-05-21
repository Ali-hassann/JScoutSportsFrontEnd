export class ItemRequest {
    ItemId: number;
    ItemCategoryId: number;
    UnitId: number;
    ItemName: string;
    PartNo: string;
    Size: string = "";
    Color: string = "";
    GSM: string = "";
    RackNo: number = 0;
    RowNo: string = "";
    BinNo: string = "";
    LineNumber: string = "";
    PurchasePrice: number;
    SalePrice: number;
    ReorderLevel: number;
    IsActive: boolean;
    ItemCategoryName: string;
    UnitName: string;
    OutletId: number;
    BalanceQuantity: number;
    LastPrice: number;
    Quantity: number; // for planing detail
    Price: number; // for planing detail
    ProductId: number; // for planing detail
    PlaningMasterId: number = 0; // for planing detail
    ProductName: string; // for planing detail

    IssuanceNo: number; // for production processd
    ProductionProcessId: number; // for production processd
    EmployeeId: number; // for production process
    OrderMasterId: number; // for production process
    ProcessId: number; // for production process
    OrderName: string; // for production process
    EmployeeName: string; // for production process
    Status: number; // for production process
    ProcessTypeName: string; // for production process
    ProductCategoryName: string; // for production process
    IssueDate?: string | Date; // for production processd
    ReceiveDate?: string | Date; // for production processd
    IssueQuantity: number; // for planing detail
    ReceiveQuantity: number; // for planing detail
    IssuePrice: number; // for planing detail
    ReceivePrice: number; // for planing detail
    IsManualPrice: boolean; // for planing detail

    constructor() {
        this.ItemId = 0;
        this.ItemCategoryId = 0;
        this.UnitId = 0;
        this.ItemName = "";
        this.PartNo = "";
        this.PurchasePrice = 0;
        this.SalePrice = 0;
        this.ReorderLevel = 0;
        this.IsActive = true;
        this.ItemCategoryName = "";
        this.UnitName = "";
        this.OutletId = 0;
        this.BalanceQuantity = 0;
        this.LastPrice = 0;
        this.Quantity = 0;
        this.Price = 0;
        this.ProductId = 0;
        this.ProductName = "";

        this.ProductionProcessId = 0;
        this.IssuanceNo = 0;
        this.EmployeeId = 0;
        this.OrderMasterId = 0;
        this.OrderName = "";
        this.ProcessId = 0;
        this.EmployeeName = "";
        this.ProcessTypeName = "";
        this.ProductCategoryName = "";
        this.Status = 1;
        this.IssueQuantity = 0;
        this.ReceiveQuantity = 0;
        this.ReceivePrice = 0;
        this.IssuePrice = 0;
        this.IsManualPrice = false;
    }
}