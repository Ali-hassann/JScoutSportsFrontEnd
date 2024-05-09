export class ItemCategoryRequest {
    ItemCategoryId: number;
    ItemTypeId: number;
    ItemTypeName: string;
    ItemCategoryName: string;
    OutletId: number;
    constructor() {
        this.ItemCategoryId = 0;
        this.ItemTypeId = 0;
        this.ItemTypeName = "";
        this.ItemCategoryName = "";
        this.OutletId = 0;
    }
}