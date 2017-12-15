import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Pipe({
    name: 'hightlightword'
})
export class HightlightwordPipe implements PipeTransform {

    constructor(public sanitizer: DomSanitizer) {
    }

    transform(value: string, args: string): any {
        if (args && value) {
            let startIndex = value.toLowerCase().indexOf(args.toLowerCase());
            if (startIndex != -1) {
                let endLength = args.length;
                let matchingString = value.substr(startIndex, endLength);
                return value.replace(matchingString, "<b class='bg-warning'>" + matchingString + "</b>");
            }

        }
        return value;
    }
}
