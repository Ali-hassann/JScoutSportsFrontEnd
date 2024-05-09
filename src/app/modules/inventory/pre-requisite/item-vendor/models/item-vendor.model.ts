export class ItemVendorRequest {
    ItemParticularId: number;
    ItemId: number;
    ParticularId: number;
    Price: number;
    OutletId: number;
    ItemName: string;
    ItemCategoryName: string;
    UnitName: string;
    SalePrice: number;
    PurchasePrice: number;
    TotalParticulars: number;
    ParticularDetail: string;
    ParticularName: string;
    ContactNo: string;
    constructor() {
        this.ItemParticularId = 0;
        this.ItemId = 0;
        this.ParticularId = 0;
        this.ItemName = "";
        this.UnitName = "";
        this.ItemCategoryName = "";
        this.ParticularName = "";
        this.ParticularDetail = "";
        this.ContactNo = "";
        this.OutletId = 0;
        this.TotalParticulars = 0;
        this.PurchasePrice = 0;
        this.SalePrice = 0;
        this.Price = 0;
    }
}