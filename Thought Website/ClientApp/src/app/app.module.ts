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

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    PhilosophyComponent,
    VideosComponent,
    LogsComponent,
    ResourcesComponent,
    GuidesComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
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
