import { ItemRequest } from "src/app/modules/inventory/pre-requisite/items/models/items.model";

export class PlaningMasterRequest {
    PlaningMasterId: number;
    OutletId: number;
    ProductId: number;
    ProductSizeId: number;
    OrderMasterId: number = 0;
    ProductName: string;
    ProductCategoryName: string;
    Amount: number;
    Items: ItemRequest[];

    constructor() {
        this.PlaningMasterId = 0;
        this.OutletId = 0;
        this.ProductId = 0;
        this.ProductSizeId = 0;
        this.Amount = 0;
        this.ProductName = "";
        this.ProductCategoryName = "";
        this.Items = [];
    }
}