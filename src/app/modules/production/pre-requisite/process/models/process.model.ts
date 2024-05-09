import { EntityStateEnum } from "src/app/shared/enums/entity-state.enum";

export class ProcessRequest {
    ProcessId: number;
    ProductId: number;
    ProductSizeId: number = 0;
    OrderMasterId: number = 0;
    ProcessTypeId: number;
    ProcessRate: number;
    OtherRate: number;
    ProductName: string;
    Description: string;
    ProcessTypeName: string;
    ProductCategoryName: string;
    OrderName: string = "";
    UnitName: string;
    MainProcessTypeId: number;
    EntityState: EntityStateEnum = EntityStateEnum.Inserted;
    Selected: boolean = false;
    constructor() {
        this.ProcessId = 0;
        this.ProductId = 0;
        this.ProcessTypeId = 0;
        this.OtherRate = 0;
        this.ProcessRate = 0;
        this.Description = "";
        this.ProductName = "";
        this.ProcessTypeName = "";
        this.ProductCategoryName = "";
        this.UnitName = "";
        this.MainProcessTypeId = 0;
    }
}

export class ProductionFilterRequest {
    OrderMasterId: number = 0;
    ProductId: number = 0;
    ProductColorIds: number[] = [];
    ProductSizeId: number = 0;
    ProductSizeIds: number[] = [];
    OutletId: number = 0;
}