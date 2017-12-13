import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable()
export class MessagesService implements OnInit {

    public message: BehaviorSubject<string> = new BehaviorSubject("");

    constructor(private _translate: TranslateService) {
    }
    ngOnInit() {
        this.translate("MESSAGE.WELCOME").subscribe(message => this.message.next(message));
    }

    public translateToMessaging(value: string) {
        this._translate.get(value).subscribe((res: string) => {
            this.message.next(res);
        }
        );
    }

    public translateToMessagingWithParam(value: string, param: string) {
        this._translate.get(value, { param: param }).subscribe((res: string) => {
            this.message.next(res);
        }
        );
    }

    public translate(value: string): Observable<string> {
        return this._translate.get(value);
    }

    public translateWithParam(value: string, param: string): Observable<string> {
        return this._translate.get(value, { param: param });
    }
}
