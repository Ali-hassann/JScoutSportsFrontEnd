export class PurchaseOrderMasterRequest {
    PurchaseOrderMasterId: number = 0;
    PurchaseOrderDate: string | Date = new Date();
    ParticularId: number = 0;
    ParticularName: string = "";
    ReferenceNo: string = "";
    Remarks: string = "";
    Status: number = 0;
    OrderMasterId: number = 0;
    TotalAmount: number = 0;
    OutletId: number = 0;
    PurchaseOrderDetailRequest: PurchaseOrderDetailRequest[] = [];
}

export class PurchaseOrderDetailRequest {
    PurchaseOrderDetailId: number = 0;
    PurchaseOrderMasterId: number = 0;
    ItemId: number = 0;
    ItemName: string = "";
    UnitName: string = "";
    ItemCategoryName: string = "";
    ItemTypeName: string = "";
    BarCode: string = "";
    Quantity: number = 0;
    Price: number = 0;
    Amount: number = 0;
}