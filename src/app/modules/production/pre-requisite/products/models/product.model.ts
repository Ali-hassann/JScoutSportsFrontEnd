export class ProductRequest {
    ProductId: number = 0;
    ProductCategoryId: number = 0;
    ProductName: string = "";
    PartNo: string = "";
    Color: string = "";
    UnitId: number = 0;
    CostPrice: number = 0;
    SalePrice: number = 0;
    IsActive: boolean = true;
    OutletId: number = 0;
    UnitName: string = "";
    ProductCategoryName: string = "";
    ProductSizeId: number = 0; // used on order product select
    Quantity: number = 0; // used on order product select
    Price: number = 0; // used on order product select
}