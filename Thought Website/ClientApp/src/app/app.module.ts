import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { PhilosophyComponent } from './philosophy/philosophy.component';
import { VideosComponent } from './videos/videos.component';
import { LogsComponent } from './logs/logs.component';
import { ResourcesComponent } from './resources/resources.component';
import { GuidesComponent } from './guides/guides.component';
import { MPlusComponent } from './mplus/mplus.component';

import * as firebase from 'firebase';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const config = {
  apiKey: "AIzaSyDKUEw0VxLIDEZ0ZY_ewh-l38awbv_GRBw",
  authDomain: "thought-mplus-rankings.firebaseapp.com",
  databaseURL: "https://thought-mplus-rankings.firebaseio.com",
  projectId: "thought-mplus-rankings",
  storageBucket: "thought-mplus-rankings.appspot.com",
  messagingSenderId: "313665645180",
  appId: "1:313665645180:web:9d6645b179092710c1f7f9",
  measurementId: "G-9Z6FZS6FLY"
};
firebase.initializeApp(config);

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    PhilosophyComponent,
    VideosComponent,
    LogsComponent,
    ResourcesComponent,
    GuidesComponent,
    MPlusComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'mplus', component: MPlusComponent },
      { path: 'philosophy', component: PhilosophyComponent },
      { path: 'videos', component: VideosComponent },
      { path: 'logs', component: LogsComponent },
      { path: 'resources', component: ResourcesComponent },
      { path: 'guides', component: GuidesComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
