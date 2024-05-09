import { ItemRequest } from "../../../items/models/items.model";

export class BundleRequest {
    BundleId: number;
    BundleName: string;
    Description: string;
    OutletId: number;
    ItemCount: number;
    Items: ItemRequest[];
    constructor() {
        this.BundleId = 0;
        this.BundleName = "";
        this.Description = "";
        this.OutletId = 0;
        this.ItemCount = 0;
        this.Items = [];
    }
}