import { MESSAGE_TYPE, POPUP_BUTTON } from "./pop-up-message.model";

export class PopUpMessageData {
    type?: MESSAGE_TYPE;
    message?: string;
    header?: string;
    actions?: POPUP_BUTTON;
    okBtnText?: string;
    cancelBtnText?: string;
}

export class UploadPopUpData {
    message?: string;
    extentions?: string;
    header?: string;
    actions?: POPUP_BUTTON;
    okBtnText?: string;
    cancelokBtnText?: string;
    otherData?: any;
}