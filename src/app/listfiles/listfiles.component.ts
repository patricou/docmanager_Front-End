import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FileService } from '../services/file.service';
import { FileDocument } from '../shared/model/filedocument';

@Component({
    selector: 'app-listfiles',
    templateUrl: './listfiles.component.html',
    styleUrls: ['./listfiles.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ListfilesComponent implements OnInit {

    constructor(private _fileService: FileService) { }

    public fileDocuments: FileDocument[] = null;

    ngOnInit() {
        this._fileService.files.subscribe(fileDocuments => {
            this.fileDocuments = fileDocuments;
        })
    }

    public openFile(file: string) {
        this._fileService.openFile(file);
    }

    public deleteFile(fileId: string, fileName: string) {
        if (confirm("Do you really want to delete the file " + fileName + " ?")) {
            this._fileService.delFiles(fileId).subscribe(res => {
                this._fileService.getFiles("all");
                alert("File " + fileName + " deleted succesfully.");
            }),
                err => alert("Error when deleting file " + fileName + " -> " + JSON.stringify(err));
        }
    }
}
