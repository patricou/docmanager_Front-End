import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { ListparagraphsComponent } from 'app/listparagraphs/listparagraphs.component';
import { Route, RouterModule } from '@angular/router';
import { ListfilesComponent } from './listfiles/listfiles.component';
import { AboutComponent } from 'app/about/about.component';

const APP_ROUTE: Route[] = [
    { path: 'paragraphs', component: ListparagraphsComponent },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'listfiles', component: ListfilesComponent },
    { path: '**', redirectTo: 'home' }
]

export const AppRouting = RouterModule.forRoot(APP_ROUTE);