import { EntityStateEnum } from "src/app/shared/enums/entity-state.enum";

export class ProductionProcessRequest {
    ProductionProcessId: number;
    ProductId: number;
    ProductSizeId: number = 0;
    ProductName: string;
    ProductSizeName: string = "";
    IssuanceNo: number; // parent level prop
    EmployeeId: number; // parent level prop
    OrderMasterId: number; // parent level prop
    ProcessId: number;
    OrderName: string; // parent level prop
    EmployeeName: string; // parent level prop
    Status: number; // parent level prop
    ProcessTypeName: string;
    ProductCategoryName: string;
    UnitName: string;
    ProductionDate: string | Date; // parent level prop
    // ReceiveDate?: string | Date; // parent level prop
    OrderQuantity: number;
    IssueQuantity: number;
    ReceiveQuantity: number;
    AlreadyReceiveQuantity: number = 0;
    ProcessRate: number = 0;
    EntityState: EntityStateEnum = EntityStateEnum.Inserted;

    constructor() {
        this.ProductionProcessId = 0;
        this.ProductId = 0;
        this.ProductName = "";
        this.IssuanceNo = 0;
        this.EmployeeId = 0;
        this.OrderMasterId = 0;
        this.OrderName = "";
        this.ProcessId = 0;
        this.EmployeeName = "";
        this.ProcessTypeName = "";
        this.ProductCategoryName = "";
        this.ProductionDate = "";
        this.UnitName = "";
        this.Status = 1;
        this.OrderQuantity = 0;
        this.IssueQuantity = 0;
        this.ReceiveQuantity = 0;
    }
}

export class ProductionParameterRequest {
    OutletId: number = 0;
    ProductId: number = 0;
    ProcessTypeId: number = 0;
    ProductSizeId: number = 0;
    IssuanceNo: number = 0; // parent level prop
    EmployeeId: number = 0; // parent level prop
    OrderMasterId: number = 0; // parent level prop
    Status: number = 0; // parent level prop
    FromDate: string | Date = new Date(); // parent level prop
    ToDate: string | Date = new Date(); // parent level prop
}
