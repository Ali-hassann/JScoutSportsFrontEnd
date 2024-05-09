import { GenericBaseModel } from "src/app/shared/models/base.model";

export class HeadCategoriesRequest extends GenericBaseModel {
    HeadCategoriesId: number = 0;
    Name: string = "";
    MainHeadsName: string = "";
    MainHeadsId: number = 0;
    constructor() {
        super();
    }
}

export class HeadCategorysResponse extends HeadCategoriesRequest {

}