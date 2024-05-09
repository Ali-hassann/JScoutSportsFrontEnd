import { Injectable } from "@angular/core";
import * as moment from "moment-timezone";

@Injectable({
    providedIn: 'root'
})
export class DateHelperService {

    public static currentDateFormat = "MM/DD/yy";
    public static currentDateTimeFormat = "YYYY-MM-DDTHH:mm:ss.sssZ";
    public static datePickerFormat = "d-M-y";
    public static fullDateFormat = "LLLL";

    public static getServerDateFormat(date?: Date | string, returnFormat: string = this.currentDateFormat): Date | string | any {

        if (date) {
            if (returnFormat) {
                return moment(date).tz('Asia/Karachi').format(returnFormat);
            }
            else {
                return moment(date).tz('Asia/Karachi').format(this.currentDateFormat);
            }
        }
        else {
            if (returnFormat) {
                return moment(new Date()).tz('Asia/Karachi').format(returnFormat);
            }
            else {
                return moment(new Date()).tz('Asia/Karachi').format(this.currentDateFormat);
            }
        }
    }

    public static getServerDateTimeFormat(date?: Date | string, returnFormat?: string): Date | string | any {

        if (date) {
            if (returnFormat) {
                return moment(date).tz('Asia/Karachi').format(returnFormat);
            }
            else {
                return moment(date).tz('Asia/Karachi').format(this.currentDateTimeFormat);
            }
        }
        else {
            if (returnFormat) {
                return moment(new Date()).tz('Asia/Karachi').format(returnFormat);
            }
            else {
                return moment(new Date()).tz('Asia/Karachi').format(this.currentDateTimeFormat);
            }
        }
    }

    public static getDatePickerFormat(date: Date | string): Date | string {

        return moment(date).tz('Asia/Karachi').toDate();
    }
}