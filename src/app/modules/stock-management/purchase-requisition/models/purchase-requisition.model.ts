export class PurchaseRequisitionMasterRequest {
    PurchaseRequisitionMasterId: number = 0;
    PurchaseRequisitionDate: string | Date = new Date();
    ParticularId: number = 0;
    ParticularName: string = "";
    ReferenceNo: string = "";
    Remarks: string = "";
    Status: number = 0;
    ProjectsId: number = 0;
    TotalAmount: number = 0;
    OutletId: number = 0;
    PurchaseRequisitionDetailRequest: PurchaseRequisitionDetailRequest[] = [];
}

export class PurchaseRequisitionDetailRequest {
    PurchaseRequisitionDetailId: number = 0;
    PurchaseRequisitionMasterId: number = 0;
    ItemId: number = 0;
    ItemName: string = "";
    UnitName: string = "";
    CategoryName: string = "";
    TypeName: string = "";
    BarCode: string = "";
    Quantity: number = 0;
    Price: number = 0;
    Total: number = 0;
}