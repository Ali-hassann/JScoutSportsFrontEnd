export class BaseResponse {
    constructor() {
        this.Message = "";
        this.Success = false;
    }

    Message: string;
    Success: boolean;
}

export interface IOutletBaseModel {
    OutletId: number;
    OrganizationId: number;
}

export class GenericBaseModel implements IOutletBaseModel {

    constructor() {
        this.OutletId = 0;
        this.OrganizationId = 0;
        this.OutletName = "Outlet Name";
        this.Address = "Address";
    }

    OutletId: number;
    OrganizationId: number;
    OutletName: string;
    Address: string;
}

export class PaginationBase extends GenericBaseModel {
    constructor() {
        super();
        this.PageNumber = 1;
        this.RecordsPerPage = 10;
        this.Status = "";
        this.TotalPages = 0;
        this.TotalRecords = 0;
        this.SearchQuery = "";
        this.IsRecordExist = false;
    }

    public PageNumber: number;
    public RecordsPerPage: number;
    public Status: string;
    public TotalPages: number;
    public TotalRecords: number;
    public SearchQuery: string;
    public IsRecordExist: boolean;
}
export class TabItem {

    constructor() {
        this.TabName = "";
        this.RouterName = "";
        this.Index = -1;
        this.IsClosable = false;
        this.IsActive = false;
    }

    TabName: string;
    RouterName: string;
    Index: number;
    IsClosable: boolean;
    IsActive: boolean;
}