import { PaginationRequest } from "src/app/shared/models/pagination.model";

export class VoucherListRequest
    extends PaginationRequest {

    FromDate: Date | string = "";
    ToDate: Date | string = "";
    VoucherTypeId: number = 0;
    PostingStatus: number = 0;
    CreatedBy: string = "";
}

export class VoucherMasterList {
    VouchersMasterId: number = 0;
    ReferenceNo: string = "";
    VoucherTypeId: number = 0;
    VoucherTypeName: string = "";
    VoucherDate: Date | string = new Date();
    Remarks: string = "";
    TotalAmount: number = 0;
    OutletId: number = 0;
    VoucherStatus: number = 0;
    VoucherStatusName: string = "";
    CreatedBy: string = "";
    Selected: boolean = false;
    IsCashVoucher: boolean = true;
    SerialIndex: number = 0;
    SerialNumber: string = "";
}

export class VouchersDetailRequest {
    VouchersDetailId: number = 0;
    PostingAccountsId: number = 0;
    PostingAccountsName: string = "";
    Narration: string = "";
    DebitAmount: number = 0;
    CreditAmount: number = 0;
    VouchersMasterId: number = 0;
    TransactionType: string = "";
    ChequeNo: string = "";
    ChequeStatus: boolean = false;
    ChequeDate?: Date | string = "";
}

export class VouchersMasterRequest
    extends VoucherMasterList {

    InvoiceNo?: number = 0;
    InvoiceType?: number = 0;
    FiscalYear: number = 0;
    ProjectsId?: number = 0;
    VouchersDetailRequest: VouchersDetailRequest[] = [];
    VoucherImagesRequest: VoucherImagesRequest[] = [];
}

export class VoucherImagesRequest {
    public VoucherImagesId: number = 0;
    public VouchersMasterId: number = 0;
    public Imagepath: string = "";
    public IsDeleted: boolean = false;
}