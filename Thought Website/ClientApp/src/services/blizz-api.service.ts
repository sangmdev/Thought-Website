import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from "../environments/environment";
import { IGuild } from "../app/interfaces/IGuild";
import { map, catchError } from "rxjs/operators";
import { Observable } from "rxjs/internal/Observable";
import { ICharacterRender } from "../app/interfaces/ICharacterRender";

@Injectable({
  providedIn: "root"
})
export class BlizzApiService {
  constructor(private http: HttpClient) { }
  baseUrl: string = document.getElementsByTagName("base")[0].href;

  getAccessToken() {
    return this.http.get<string>(`${this.baseUrl}api/Blizzard`);
  }

  getGuildRoster(accessToken): Observable<IGuild> {
    return this.http.get<IGuild>(`${this.baseUrl}api/Blizzard/guild?accessToken=${accessToken}`)
  }

  getCharacterRender(accessToken, charName): Observable<ICharacterRender> {
    return this.http.get<ICharacterRender>(`${this.baseUrl}api/Blizzard/characterRender?accessToken=${accessToken}&&charName=${charName}`)
  }
}
