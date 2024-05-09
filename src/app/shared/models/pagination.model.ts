import { IOutletBaseModel, PaginationBase } from "./base.model";

export class PaginationRequest extends PaginationBase
    implements IOutletBaseModel {
}

export class PaginationResponse
    extends PaginationBase {
    Data: any;
}
