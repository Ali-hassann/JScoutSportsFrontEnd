export class ProductCategoryRequest {
    ProductCategoryId: number;
    ProductCategoryName: string;
    OutletId: number;
    constructor() {
        this.ProductCategoryId = 0;
        this.ProductCategoryName = "";
        this.OutletId = 0;
    }
}