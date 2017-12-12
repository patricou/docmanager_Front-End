import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Paragraphs } from '../shared/model/paragraphs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { PlatformLocation } from '@angular/common';

// use EventSourcePolyFill to be abble to run EventSource in ie
declare const EventSourcePolyfill: any;

@Injectable()
export class ParagraphsService {

    public listParagraphs: BehaviorSubject<Paragraphs[]> = new BehaviorSubject(null);

    constructor(private _http: HttpClient, private _zone: NgZone, private pl: PlatformLocation) {
    };

    getParagraphs(toFind: String) {
        const paragraphsArray: Paragraphs[] = new Array();
        this.listParagraphs.next(paragraphsArray);

        const eventSource = new EventSourcePolyfill('http://localhost:8080/api/paragraph/' + toFind);

        eventSource.onmessage = event => {
            this._zone.run(() => {
                let para: Paragraphs = JSON.parse(event.data);
                paragraphsArray.push(para);
                this.listParagraphs.next(paragraphsArray);
            })
        };

        eventSource.onerror = function (event) {
            eventSource.close();
            if (paragraphsArray.length === 0) {
                alert("Nothing to display");
            } else {
                setTimeout(function () {
                    alert("All has been retrieved")
                }, 400);
            }
        }
    }
}
