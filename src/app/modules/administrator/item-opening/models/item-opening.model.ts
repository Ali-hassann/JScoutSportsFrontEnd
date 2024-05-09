export class ItemOpeningRequest {
    ItemOpeningId: number;
    ItemId: number;
    ItemName: string;
    UnitName: string;
    ItemCategoryName: string;
    OpeningQuantity: number;
    OpeningPrice: number;
    OutletId: number;

    constructor() {
        this.ItemOpeningId = 0;
        this.ItemId = 0;
        this.ItemName = "";
        this.UnitName = "";
        this.ItemCategoryName = "";
        this.OpeningQuantity = 0;
        this.OpeningPrice = 0;
        this.OutletId = 0;
    }
} 

