import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../environments/environment";
import { IGuild } from "../app/interfaces/IGuild";
import { map, catchError } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";
import { ICharacterRender } from "../app/interfaces/ICharacterRender";
import * as firebase from "firebase/app";
import axios from 'axios'


@Injectable({
  providedIn: "root"
})
export class BlizzApiService {
  constructor(private http: HttpClient) { }

  getGuildRoster(): Observable<IGuild>{
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Battlenet-Namespace", "profile-us");
    return this.http.get<IGuild>('https://us-central1-thought-website.cloudfunctions.net/getGuildRoster', { 'headers': headers })
  }

  getCharacterRender(charName): Observable<ICharacterRender> {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Battlenet-Namespace", "profile-us");
    return this.http.get<ICharacterRender>(`https://us-central1-thought-website.cloudfunctions.net/getCharacterRender?charName=${charName}`, {'headers' : headers })
  }
}
