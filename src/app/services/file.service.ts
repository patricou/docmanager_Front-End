import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { observableToBeFn } from 'rxjs/testing/TestScheduler';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FileDocument } from '../shared/model/filedocument';
import { listenerCount } from 'cluster';
import { environment } from '../../environments/environment';
import { WindowRefService } from 'app/services/window-ref.service';
import { MessagesService } from 'app/services/messages.service';

@Injectable()
export class FileService {

	private API_URL: string = environment.API_URL;

	public files: BehaviorSubject<FileDocument[]> = new BehaviorSubject(null);

	// Native Window
	private nativeWindow: any;

	constructor(private _http: HttpClient, private winRef: WindowRefService, private _messagesService: MessagesService) {
		this.nativeWindow = winRef.getNativeWindow();
	}

	// GET  files
	getFiles(toFind?: string): void {
		let headers = new HttpHeaders({
			'Author': 'Zeus'
		});
		this._http.get<FileDocument[]>(this.API_URL + "files" + "/" + toFind, {
			headers: headers,
			observe: 'response'
		}).subscribe(f => {
			this.files.next(f.body);
			//this._messagesService.message.next("All files with '" + toFind + "' have been retrieved !");
		},
			err => alert("Error when retrieving files containing " + toFind + " -> " + JSON.stringify(err)))
	}
	//delete all Files stored in the DB
	public delFiles(fileId: string): Observable<any> {
		return this._http.delete(
			this.API_URL + "delfile",
			{
				params: new HttpParams().set("fileid", fileId),
				responseType: 'text',
				observe: 'response'
			});
	}
	// GET file    
	private getFile(fileName: string): Observable<any> {
		let headers = new HttpHeaders({
			'Author': 'Zeus'
		});
		return this._http.get(this.API_URL + "file", {
			params: new HttpParams().set("filename", fileName),
			headers: headers,
			observe: 'response',
			responseType: 'blob'
		});
	}

	private getFileBlobUrl(fileName: string): Observable<any> {
		return this.getFile(fileName).map(res => {
			let ct: string = res.headers.get('Content-Type');
			console.log("Content-Type :" + ct);
			let blob = new Blob([res.body], { type: ct + ";charset=utf-8" });
			return blob;
		});
	}
	// Open window when click on associate button
	public openFile(fileName: string): void {
		this.getFileBlobUrl(fileName).subscribe(blob => {
			console.log('blob type : ' + blob.type + " // blob.size : " + blob.size);
			//IE11 & Edge
			if (navigator.msSaveBlob) {
				navigator.msSaveBlob(blob, fileName);
			} else {
				let natw = this.nativeWindow;
				//In FF link must be added to DOM to be clicked
				let link = natw.document.createElement('a');
				let objectUrl = natw.URL.createObjectURL(blob);
				link.href = objectUrl;
				// this method allow to give a name to the file
				link.setAttribute('download', fileName);
				natw.document.body.appendChild(link);
				link.click();
				this._messagesService.translateToMessagingWithParam("MESSAGE.FILEDOWNLOADED", fileName);
				// remove the 				
				setTimeout(function () {
					console.log('Object revoked');
					natw.document.body.removeChild(link);
					natw.URL.revokeObjectURL(objectUrl);
				}, 5000);
			}
			//this.nativeWindow.open(objectUrl);
		},
			err =>
				alert("Error when opening the file : " + JSON.stringify(err))
		);
	}
}
