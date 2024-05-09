import { GenericBaseModel } from "src/app/shared/models/base.model";

export class SubCategoriesResponse
    extends GenericBaseModel {

    SubCategoriesId: number=0;
    MainHeadsId: number=0;
    HeadCategoriesId: number=0;
    MainHeadsName: string="";
    HeadCategoriesName: string="";
    SubCategoriesName: string="";
    Name: string="";
}

export class SubCategoriesRequest
    extends GenericBaseModel {

    SubCategoriesId: number=0;
    Name: string="";
    HeadCategoriesId: number=0;
}
