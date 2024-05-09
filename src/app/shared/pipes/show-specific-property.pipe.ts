import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'showSpecificProperty'
})

export class ShowSpecificPropertyPipe implements PipeTransform {

    public transform(
        obj: any
        , defaultDisplayProperty: string
        , displayProperty?: string
    ): any {

        if (obj && displayProperty && obj[displayProperty]?.length > 0) {
            return obj[displayProperty];
        }
        else {
            return obj[defaultDisplayProperty];
        }
    }

}
