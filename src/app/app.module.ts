import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ListparagraphsComponent } from './listparagraphs/listparagraphs.component';
import { FileService } from 'app/services/file.service';
import { WindowRefService } from 'app/services/window-ref.service';
import { ParagraphsService } from 'app/services/paragraphs.service';
import { FileUploadModule } from 'ng2-file-upload';
import { HomeComponent } from './home/home.component';
import { AppRouting } from './app.routing';
import { ListfilesComponent } from './listfiles/listfiles.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
        ListparagraphsComponent,
        HomeComponent,
        ListfilesComponent
    ],
    imports: [
        BrowserModule,
        AppRouting,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        FileUploadModule
    ],
    providers: [
        ParagraphsService,
        FileService,
        WindowRefService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }