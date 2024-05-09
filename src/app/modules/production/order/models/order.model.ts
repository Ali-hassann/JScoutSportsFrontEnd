export class OrderMasterRequest {
    OrderMasterId: number = 0;
    OrderName: string = "";
    Remarks: string = "";
    OrderDate: string | Date = new Date();
    DeliveryDate: string | Date = new Date();
    TotalAmount: number = 0;
    OrderStatus: number = 0;
    ParticularId: number = 0;
    ParticularName: string = "";
    OutletId: number = 0;
    OtherCost: number = 0;
    OrderDetailsRequest: OrderDetailRequest[] = [];
}

export class OrderDetailRequest {
    OrderDetailId: number = 0;
    OrderMasterId: number = 0;
    OrderName: string = "";
    ProductId: number = 0;
    ProductName: string = "";
    ProductSizeId: number = 0;
    ProductSizeName: string = "";
    Quantity: number = 0;
    Price: number = 0;
    Amount: number = 0;
    UnitId: number = 0;
    UnitName: string = "";
    ProductCategoryName: string = "";
    isShowIcon: boolean = false;
}