import { Component, OnInit, NgModule } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { ParagraphsService } from 'app/services/paragraphs.service';
import { FileUploader } from 'ng2-file-upload';
import { FileService } from 'app/services/file.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Paragraphs } from 'app/shared/model/paragraphs';
import { MessagesService } from 'app/services/messages.service';
import { setTimeout } from 'timers';
import { Ng4LoadingSpinnerModule, Ng4LoadingSpinnerService, Ng4LoadingSpinnerComponent } from 'ng4-loading-spinner';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	private API_URL: string = environment.API_URL;
	public message: string = "HI!";
	public messageishidden: boolean = true;
	public filterForm: FormGroup;
	template: string = `<img src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif">`

	public uploader: FileUploader = new FileUploader({
		url: this.API_URL + '/fileupload',
		headers: [{ name: 'Accept', value: 'application/json' }],
		autoUpload: true
	});;

	constructor(
		private _translate: TranslateService,
		private _paragraphService: ParagraphsService,
		private _fileService: FileService,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private fb: FormBuilder,
		private _messagesService: MessagesService,
		private spinnerService: Ng4LoadingSpinnerService
	) {

		this.uploader.onBeforeUploadItem = (item) => {
			console.log("Load file : " + item);
			this.spinnerService.show();
		};

		this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
			this.spinnerService.hide();
			var jsonResponse = JSON.parse(response);
			if (status == 201) {
				this._fileService.getFiles("all");
				this._messagesService.translateToMessagingWithParam("MESSAGE.FILESAVED", jsonResponse.filename);
			}
			else
				alert("Error " + jsonResponse);
		};
	}

	public switchLanguage(language: string) {
		this._translate.use(language);
	}

	ngOnInit() {
		// init translator
		this._translate.addLangs(environment.langs);
		this._translate.setDefaultLang("en");
		// Set language in Browser lang
		let browserLang = this._translate.getBrowserLang();
		let lang = browserLang.match(/en|fr|es/) ? browserLang : 'en';
		this._translate.use(lang);
		// init the message text
		this._messagesService.message.subscribe(m => {
			this.message = m;
			this.messageishidden = false;
			setTimeout(() => this.messageishidden = true, 2000);
		});
		//Display the welcom message
		this._messagesService.translateToMessaging("MESSAGE.WELCOME");
		// init the form
		this.filterForm = this.fb.group({
			filesorparagraph: ['paragraphs'],
			inputfilter: ['patrick', Validators.required]
		})
	}

	public displayParagraphsOrFiles() {
		this.spinnerService.show();
		let toFind = this.filterForm.get('inputfilter').value;
		if (this.filterForm.get('filesorparagraph').value == "paragraphs") {
			this._paragraphService.getParagraphs(toFind);
			this._router.navigate(['paragraphs']);
		} else this.listfiles(toFind);
	}

	public deleteAllFiles() {
		this._messagesService.translate("MESSAGE.CONFIRMDELETE").subscribe(question => {
			if (confirm(question)) {
				this.spinnerService.show();
				this._fileService.delFiles("*").subscribe(
					res => {
						this.spinnerService.hide();
						this._messagesService.translateToMessaging("MESSAGE.ALLFILESDELETED");
					},
					err => {
						this.spinnerService.hide()
						alert("Error with deleting all file : " + JSON.stringify(err));
					}
				);
			}
			else {
				this._messagesService.translateToMessaging("MESSAGE.NOTHINGDELETED");
			}
		});
	}

	public listfiles(toFind?: string) {
		if (toFind == "") toFind = "all";
		this._fileService.getFiles(toFind);
		this._router.navigate(['listfiles']);
		this.spinnerService.hide();
		if (toFind == "all")
			this._messagesService.translateToMessaging("MESSAGE.ALLFILESRETRIEVED");
		else
			this._messagesService.translateToMessagingWithParam("MESSAGE.FILESRETRIEVED", toFind);
	}
}
