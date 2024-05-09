import { GenericBaseModel } from "src/app/shared/models/base.model";

export class AccountHeadsFilterRequest extends GenericBaseModel {
    HeadCategoriesId: number = 0;
    SubCategoriesId: number = 0;
    PostingAccountsId: number = 0;
}

export class UiChartsOfAccount {
    ActiveTabIndex: number = 0;
}

export class TreeStructure {
    label: string = '';
    expanded: boolean = true;
    children: TreeStructure[] = [];
}