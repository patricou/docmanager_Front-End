import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Paragraphs } from 'app/shared/model/paragraphs';
import { ParagraphsService } from '../services/paragraphs.service';
import { FileService } from '../services/file.service';

@Component({
	selector: 'app-listparagraphs',
	templateUrl: './listparagraphs.component.html',
	styleUrls: ['./listparagraphs.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ListparagraphsComponent implements OnInit {

	public paragraphs: Paragraphs[] = null;
	@Input()
	public col46: boolean;
	public classApplied = {
		"col-lg-4": this.col46,
		"col-lg-6": !this.col46
	};

	constructor(private _paragraphsService: ParagraphsService, private _fileService: FileService) {
	}

	ngOnInit() {
		this._paragraphsService.listParagraphs.subscribe(paragraphs => {
			this.paragraphs = paragraphs;
		})
	}

	openFile(file: string) {
		this._fileService.openFile(file);
	}

	deleteFile(fileName: string) {
		this._fileService.delFiles(fileName).subscribe(res =>
			alert("Result : " + JSON.stringify(res.body)),
			err => alert("Error : " + JSON.stringify(err))
		)
	}

}
