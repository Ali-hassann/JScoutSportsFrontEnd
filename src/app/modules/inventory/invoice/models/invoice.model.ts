import { TransactionTypeInvoiceENUM } from "src/app/shared/enums/invoices.enum";

export class InvoiceDetailRequest {
    InvoiceDetailId: number;
    InvoiceMasterId: number;
    ItemId: number;
    ItemName: string;
    Description: string;
    UnitName: string;
    ItemCategoryName: string;
    ItemTypeName: string;
    BarCode: string;
    Quantity: number;
    Amount: number;
    Price: number;
    AverageRate: number;
    RunningTotal: number;
    TransactionType: number;
    constructor() {
        this.InvoiceDetailId = 0;
        this.InvoiceMasterId = 0;
        this.ItemId = 0;
        this.ItemName = "";
        this.Description = "";
        this.UnitName = "";
        this.ItemCategoryName = "";
        this.ItemTypeName = "";
        this.BarCode = "";
        this.Quantity = 0;
        this.Price = 0;
        this.AverageRate = 0;
        this.RunningTotal = 0;
        this.Amount = 0;
        this.TransactionType = TransactionTypeInvoiceENUM.StockIn;
    }
}

export class InvoiceMasterRequest {
    InvoiceMasterId: number;
    InvoiceDate: string | Date;
    ParticularId: number;
    ParticularName: string;
    ReferenceNo: string;
    DocumentTypeId: number;
    DocumentTypeName: string;
    Remarks: string;
    InvoiceStatus: number;
    TotalAmount: number;
    Discount: number;
    NetAmount: number;
    PaidReceivedAmount: number;
    BalanceAmount: number;
    OutletId: number;
    OrderMasterId: number = 0;
    PaymentMode: number;
    SerialIndex: number;
    InvoiceSerialNo: string;
    InvoiceDetailsRequest: InvoiceDetailRequest[];
    constructor() {
        this.InvoiceMasterId = 0;
        this.InvoiceDate = new Date();
        this.ParticularId = 0;
        this.ParticularName = ""
        this.ReferenceNo = ""
        this.DocumentTypeId = 0;
        this.DocumentTypeName = ""
        this.Remarks = ""
        this.InvoiceStatus = 0;
        this.TotalAmount = 0;
        this.Discount = 0;
        this.NetAmount = 0;
        this.PaidReceivedAmount = 0;
        this.BalanceAmount = 0;
        this.OutletId = 0;
        this.PaymentMode = 1;
        this.SerialIndex = 0;
        this.InvoiceSerialNo = "";
        this.InvoiceDetailsRequest = [];
    }
}

export class PaginationBase {
    PageNumber: number;
    RecordsPerPage: number;
    Status: string;
    TotalPages: number;
    TotalRecords: number;
    constructor() {
        this.PageNumber = 1;
        this.RecordsPerPage = 10;
        this.Status = "";
        this.TotalPages = 0;
        this.TotalRecords = 0;
    }
}

export class InvoiceListResponse extends PaginationBase {
    Data: InvoiceMasterRequest[];
    constructor() {
        super();
        this.Data = []
    }
}

export class PaginationRequest extends PaginationBase {
    SearchQuery: string;
    OutletName: string;
    OutletImagePath: string;
    Address: string;
    OutletId: number;
    OrganizationId: number;
    constructor() {
        super()
        this.SearchQuery = "";
        this.OutletName = "";
        this.OutletImagePath = "";
        this.Address = "";
        this.OutletId = 0;
        this.OrganizationId = 0;
    }
}

export class InvoiceParameterRequest extends PaginationRequest {
    FromDate: Date | string;
    ToDate: Date | string;
    DocumentTypeId: number;
    ItemIds: string;
    ParticularId: number;
    VendorIds: string;
    CustomersIds: string;
    DocumentCode: number;
    constructor() {
        super();
        this.FromDate = new Date();
        this.ToDate = new Date();
        this.DocumentTypeId = 0;
        this.ItemIds = "";
        this.ParticularId = 0;
        this.VendorIds = "";
        this.CustomersIds = "";
        this.DocumentCode = 0;
    }
}



