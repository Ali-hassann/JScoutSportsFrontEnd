import { Injectable } from '@angular/core';
import { Validators, ValidatorFn, FormGroup } from '@angular/forms';
import { VALIDATION_TYPE } from '../enums/validation-type.enum';

@Injectable({
    providedIn: 'root'
})

export class DomainValidatorsService {

    constructor() { }

    assignFormValuesToObject(form: FormGroup, object?: any) {
        if (form && form.controls) {
            if (!object) {
                object = {};
            }
            Object.assign(object, form.value);
        }
    }

    assignObjectValuesToForm(form: FormGroup, sourceObject: any) {
        if (form && form.controls && sourceObject) {
            let objectProperties = Object.getOwnPropertyNames(sourceObject);
            if (objectProperties && objectProperties.length > 0) {
                objectProperties.forEach((propertyName) => {
                    if (propertyName && form.controls[propertyName]) {
                        form.controls[propertyName].setValue(sourceObject[propertyName])
                    }
                });
            }
        }
    }

    public mapSourceObjToDestination(source: any, destination: any) {
        if (source && destination) {
            let objectProperties = Object.getOwnPropertyNames(source);
            let destinationProperties = Object.getOwnPropertyNames(destination);
            objectProperties?.forEach((propertyName) => {
                if (propertyName && destinationProperties.includes(propertyName)) {
                    destination[propertyName] = source[propertyName]
                }
            });
        }
    }

    getValidator(validatorType: VALIDATION_TYPE): ValidatorFn | any {
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

    // getFormValues(destinationObject,sourceObject:FormGroup) {
    //     Object.assign(destinationObject, sourceObject.value);
    //   }
}