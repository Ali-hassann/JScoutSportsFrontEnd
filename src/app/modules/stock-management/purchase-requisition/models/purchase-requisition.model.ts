export class PurchaseRequisitionMasterRequest {
    PurchaseRequisitionMasterId: number = 0;
    PurchaseRequisitionDate: string | Date = new Date();
    ReferenceNo: string = "";
    Remarks: string = "";
    Status: number = 0;
    ProjectsId: number = 0;
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
}