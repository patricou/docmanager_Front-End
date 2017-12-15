import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Paragraphs } from '../shared/model/paragraphs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { PlatformLocation } from '@angular/common';
import { environment } from '../../environments/environment';
import { MessagesService } from 'app/services/messages.service';
import { FormGroup } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { toBase64String } from '@angular/compiler/src/output/source_map';

// use EventSourcePolyFill to be abble to run EventSource in ie
declare const EventSourcePolyfill: any;

@Injectable()
export class ParagraphsService {

    private API_URL: string = environment.API_URL;

    public listParagraphs: BehaviorSubject<Paragraphs[]> = new BehaviorSubject(null);
    // use in listparagraphComponents to highlight the text
    public toFind: BehaviorSubject<string> = new BehaviorSubject(null);

    constructor(
        private _zone: NgZone,
        private _pl: PlatformLocation,
        private _messagesService: MessagesService,
        private spinnerService: Ng4LoadingSpinnerService) {
    };

    getParagraphs(toFind: string) {
        this.toFind.next(toFind);
        const paragraphsArray: Paragraphs[] = new Array();
        this.listParagraphs.next(paragraphsArray);

        const eventSource = new EventSourcePolyfill(this.API_URL + '/paragraph/' + toFind);

        eventSource.onmessage = event => {
            this._zone.run(() => {
                let paragraphs: Paragraphs = JSON.parse(event.data);
                // this._messagesService.message.next(toFind + " found  in file : '" + paragraphs["fromFile"] + "'");
                paragraphsArray.push(paragraphs);
                this.listParagraphs.next(paragraphsArray);
            })
        };

        eventSource.onerror = event => {
            eventSource.close();
            this.spinnerService.hide();
            if (paragraphsArray.length === 0) {
                this._messagesService.translateToMessaging("MESSAGE.NOTHINGTODISPLAY");
            } else {
                this._messagesService.translateToMessagingWithParam("MESSAGE.ALLPARAWITHWORD", toFind);
            }
        }
    }
}
