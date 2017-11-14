import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Paragraphs } from '../shared/model/paragraphs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { PlatformLocation } from '@angular/common';

const EventSource: any = window['EventSource'];

@Injectable()
export class ParagraphsService {

	public listParagraphs: BehaviorSubject<Paragraphs[]> = new BehaviorSubject(null);

	constructor(private _http: HttpClient, private _zone: NgZone, private pl: PlatformLocation) {
	};

	getParagraphs(toFind: String) {
		let paragraphsArray: Paragraphs[] = new Array();
		this.listParagraphs.next(paragraphsArray);

		const eventSource = new EventSource('http://localhost:8080/api/paragraph/' + toFind);
		eventSource.onmessage = event => {
			this._zone.run(() => {
				let para: Paragraphs = JSON.parse(event.data);
				paragraphsArray.push(para);
				this.listParagraphs.next(paragraphsArray);
			}
			)
		};
		eventSource.onerror = function (event) {
			if (event.eventPhase == EventSource.CLOSED) {
				eventSource.close();
				console.log("Event Source Closed");
				if (paragraphsArray.length == 0)
					alert("Nothing to display");
			} else
				alert(console.log("Error while received message for paragraph: " + JSON.stringify(event)))
		};
	}
}
