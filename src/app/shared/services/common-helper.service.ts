import { Compiler, Injectable, Injector, NgModuleFactory, Type } from '@angular/core';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { VALIDATION_TYPE } from '../enums/validation-type.enum';

@Injectable({
    providedIn: 'root'
})
export class CommonHelperService {

    constructor(
        private compiler: Compiler,
        private injector: Injector
    ) { }

    loadModule(path: any) {
        // this.toast.loading("Loading please wait ......", { duration: 1000 });
        (path() as Promise<NgModuleFactory<any> | Type<any>>)
            .then(elementModuleOrFactory => {
                if (elementModuleOrFactory instanceof NgModuleFactory) {
                    // if ViewEngine        
                    return elementModuleOrFactory;
                } else {
                    try {
                        // if Ivy
                        if (elementModuleOrFactory)
                            return this.compiler.compileModuleAsync(elementModuleOrFactory);
                        else
                            return null;
                    } catch (err) {
                        throw err;
                    }
                }
            })
            .then(moduleFactory => {
                try {
                    if (moduleFactory) {
                        const elementModuleRef = moduleFactory.create(this.injector);
                        const moduleInstance = elementModuleRef.instance;
                    }

                    // do something with the module...
                } catch (err) {
                    throw err;
                }
            });
    }

    public static mapSourceObjToDestination(
        source: any
        , destination: any
    ): any {

        if (source && destination) {

            let objectProperties = Object.getOwnPropertyNames(source);
            let destinationProperties = Object.getOwnPropertyNames(destination);

            objectProperties
                ?.forEach((propertyName) => {

                    if (propertyName && destinationProperties?.includes(propertyName)) {
                        destination[propertyName] = source[propertyName];
                    }
                });
        }
    }

    public static assignFormValuesToObject(
        form: FormGroup
        , object?: any
    ): any {

        if (form?.controls) {

            if (!object) {
                object = {};
            }

            return Object.assign(object, form.value);
        }
    }

    public static assignObjectValuesToForm(
        form: FormGroup
        , sourceObject: any
    ): void {
        if (form?.controls && sourceObject) {

            let objectProperties = Object.getOwnPropertyNames(sourceObject);

            objectProperties
                ?.forEach((propertyName) => {

                    if (propertyName && form.controls[propertyName]) {

                        form.controls[propertyName].setValue(sourceObject[propertyName]);
                    }
                });
        }
    }

    public static getValidator(validatorType: VALIDATION_TYPE): ValidatorFn | any {

        if (validatorType) {
            switch (validatorType) {
                case VALIDATION_TYPE.EMAIL:
                    return Validators.email;
                case VALIDATION_TYPE.PASSWORD:
                    return Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}/);
                case VALIDATION_TYPE.ONLYINT:
                    return Validators.pattern(new RegExp('^(\\s*|\\d+)$'));
                case VALIDATION_TYPE.FLOAT:
                    return Validators.pattern(new RegExp('[0-9.]*$'));
                case VALIDATION_TYPE.ONLYCHAR:
                    return Validators.pattern(new RegExp('^[A-Za-z ]+$'));
                case VALIDATION_TYPE.ONLYNAME:
                    return Validators.pattern(new RegExp('^[a-zA-Z0-9-_ ]*$'));
                case VALIDATION_TYPE.ONLYCHARWITHOUTSPACES:
                    return Validators.pattern(new RegExp('^[A-Za-z]+$'));
                case VALIDATION_TYPE.PHONE:
                    return Validators.pattern('^[0-9+]*$');
                case VALIDATION_TYPE.ALPHANUMARIC:
                    return Validators.pattern(new RegExp('^[a-zA-Z\s[0-9-( )]+$'));
                case VALIDATION_TYPE.USERNAME:
                    return Validators.pattern('^[A-Za-z0-9.@+]*$');
                default:
                    break;
            }
        }
        return null;
    }

    public static getSumofArrayPropert(object: any[], propertyName?: string) {
        let AllSum = 0;
        if (object?.length > 0) {
            for (let i = 0; i < (object).length; i++) {
                const item = (object)[i];
                if (propertyName) {
                    if (item[propertyName] && parseFloat(item[propertyName])) {
                        AllSum += parseFloat(item[propertyName]);
                    }
                } else {
                    if (item && parseFloat(item)) {
                        AllSum += parseFloat(item);
                    }
                }
            }
        }
        return AllSum;
    }

    public getSum(array: any[], propertyName?: string) {
        let AllSum = 0;
        for (let i = 0; i < (<Array<any>>array).length; i++) {
            const item = (<Array<any>>array)[i];
            if (propertyName) {
                if (item[propertyName] && parseFloat(item[propertyName]) && parseFloat(item[propertyName]) > 0) {
                    AllSum += parseFloat(item[propertyName]);
                }
            } else {
                if (item && parseFloat(item)) {
                    AllSum += parseFloat(item);
                }

            }
        }
        return AllSum;
    }

    public static focusOnInput(id: string) {
        setTimeout(() => {
            document.getElementById(id)?.focus();
        }, 300);
    }
    public static convertEnumObjectToList<T>(enumTypeToConvert: { [s: string]: T } | ArrayLike<T>): T[] {

        return Object.values<T>(enumTypeToConvert);
    }
}
