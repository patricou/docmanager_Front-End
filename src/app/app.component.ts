import { Component, OnInit, NgModule } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { ParagraphsService } from 'app/services/paragraphs.service';
import { FileUploader } from 'ng2-file-upload';
import { FileService } from 'app/services/file.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

// const URL = '/api/';
const URL = 'http://localhost:8080/api/file';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

	public filterForm: FormGroup;

	public uploader: FileUploader = new FileUploader({
		url: URL,
		headers: [{ name: 'Accept', value: 'application/json' }],
		autoUpload: true
	});

	constructor(private _translate: TranslateService,
		private _paragraphService: ParagraphsService,
		private _fileService: FileService,
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private fb: FormBuilder) {
		this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
			alert("FIle " + response + " load succesfully / load Status : " + status + " / header : " + JSON.stringify(headers));// the url will be in the response			
		};
	}

	public switchLanguage(language: string) {
		this._translate.use(language);
	}

	ngOnInit() {
		// init the form
		this.filterForm = this.fb.group({
			filesorparagraph: ['paragraphs'],
			inputfilter: ['patrick', Validators.required]
		})
		// init translator
		this._translate.addLangs(environment.langs);
		this._translate.setDefaultLang('en');
	}

	public displayParagraphsOrFiles() {
		let toFind = this.filterForm.get('inputfilter').value;
		if (this.filterForm.get('filesorparagraph').value == "paragraphs") {
			this._paragraphService.getParagraphs(toFind);
			this._router.navigate(['paragraphs']);
		} else this.listfiles(toFind);
	}

	public deleteAllFiles() {
		if (confirm("Do you really want to delete all data ?")) {
			this._fileService.delFiles("*").subscribe(res =>
				alert("Result : " + JSON.stringify(res.body)),
				err => alert("Error with deleting all file : " + JSON.stringify(err))
			);
			alert("All has been deleted");
		}
		else {
			alert("Nothing deleted");
		}
	}

	public listfiles(toFind?: string) {
		if (toFind == "") toFind = "all";
		this._fileService.getFiles(toFind);
		this._router.navigate(['listfiles']);
	}
}
