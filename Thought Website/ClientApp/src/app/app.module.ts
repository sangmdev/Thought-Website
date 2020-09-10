import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { PhilosophyComponent } from './philosophy/philosophy.component';
import { VideosComponent } from './videos/videos.component';
import { LogsComponent } from './logs/logs.component';
import { ResourcesComponent } from './resources/resources.component';
import { GuidesComponent } from './guides/guides.component';
import { MPlusComponent } from './mplus/mplus.component';
import { RosterComponent } from './roster/roster.component';

import * as firebase from 'firebase';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormatDatePipe } from './pipes/format-date.pipe';

const config = {
  apiKey: "AIzaSyDBcA2NdaZ-s-tVi0zyQi1YPjW4T0IP83c",
  authDomain: "thought-website.firebaseapp.com",
  databaseURL: "https://thought-website.firebaseio.com",
  projectId: "thought-website",
  storageBucket: "thought-website.appspot.com",
  messagingSenderId: "612934409899",
  appId: "1:612934409899:web:6d04470f778d0a97c461ee",
  measurementId: "G-VNF1HPKTJW"
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
    MPlusComponent,
    RosterComponent,
    FormatDatePipe
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
      { path: 'roster', component: RosterComponent }
    ]),
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatTableModule,
    MatSelectModule,
    MatPaginatorModule,
    MatInputModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
