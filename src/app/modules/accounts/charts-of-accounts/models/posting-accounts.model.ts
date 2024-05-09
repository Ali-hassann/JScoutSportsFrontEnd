import { GenericBaseModel } from "src/app/shared/models/base.model";
import { SubCategoriesResponse } from "./sub-category.model";

export class PostingAccountsResponse
    extends SubCategoriesResponse {

    PostingAccountsId: number = 0;
    PostingAccountsName: string = "";
    IsActive: boolean = false;
    OpeningCredit: number = 0;
    OpeningDebit: number = 0;
    OpeningDate: any;
}

export class PostingAccountsRequest
    extends GenericBaseModel {

    PostingAccountsId: number = 0;
    Name: string = "";
    IsActive: boolean = false;
    SubCategoriesId: number = 0;
    OpeningCredit: number = 0;
    OpeningDebit: number = 0;
    OpeningDate: any;
}
