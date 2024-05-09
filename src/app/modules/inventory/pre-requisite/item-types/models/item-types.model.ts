export class ItemTypeRequest {
    ItemTypeId: number;
    ItemTypeName: string;
    OutletId: number;
    constructor() {
        this.ItemTypeId = 0;
        this.OutletId = 0;
        this.ItemTypeName = "";
    }
}