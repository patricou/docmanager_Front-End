import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ListparagraphsComponent } from './listparagraphs/listparagraphs.component';
import { FileService } from 'app/services/file.service';
import { ParagraphsService } from 'app/services/paragraphs.service';
import { FileUploadModule } from 'ng2-file-upload';
import { HomeComponent } from './home/home.component';
import { AppRouting } from './app.routing';
import { ListfilesComponent } from './listfiles/listfiles.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DocInterceptor } from 'app/shared/docinterceptor';
import { WindowRefService } from 'app/services/window-ref.service';
import { MessagesService } from 'app/services/messages.service';
import { AboutComponent } from './about/about.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { HightlightwordPipe } from './pipe/hightlightword.pipe';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
    declarations: [
        AppComponent,
        ListparagraphsComponent,
        HomeComponent,
        ListfilesComponent,
        AboutComponent,
        HightlightwordPipe
    ],

    imports: [
        BrowserModule,
        Ng4LoadingSpinnerModule,
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
        FileUploadModule,
        AccordionModule.forRoot()
    ],
    providers: [
        ParagraphsService,
        FileService,
        MessagesService,
        WindowRefService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: DocInterceptor,
            multi: true,
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
