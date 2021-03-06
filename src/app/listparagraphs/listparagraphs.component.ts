import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Paragraphs } from 'app/shared/model/paragraphs';
import { ParagraphsService } from '../services/paragraphs.service';
import { FileService } from '../services/file.service';
import { HightlightwordPipe } from '../pipe/hightlightword.pipe';

@Component({
	selector: 'app-listparagraphs',
	templateUrl: './listparagraphs.component.html',
	styleUrls: ['./listparagraphs.component.css'],
	providers: [HightlightwordPipe]
})
export class ListparagraphsComponent implements OnInit {

	public paragraphs: Paragraphs[] = null;
	public toFind: string;
	constructor(private _paragraphsService: ParagraphsService, private _fileService: FileService) {
	}

	ngOnInit() {

		this._paragraphsService.listParagraphs.subscribe(paragraphs => {
			this.paragraphs = paragraphs;
		})
		this._paragraphsService.toFind.subscribe(toFind => this.toFind = toFind);
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
