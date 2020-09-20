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
  blizzHostName = "https://us.api.blizzard.com";
  // Get access token using blizz client id and secret
  getAccessToken() {
   const httpHeaders = new HttpHeaders()
     .set("Authorization", `Basic ` + btoa(`${environment.clientId}:${environment.clientSecret}`))
     .set("Content-Type", "application/x-www-form-urlencoded")
     .set("Accept", "*/*");
    var body = new HttpParams().set("grant_type", "client_credentials")
    return this.http.post("https://us.battle.net/oauth/token", body, { 'headers': httpHeaders });
  }

  getGuildRoster(accessToken): Observable<IGuild> {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("Battlenet-Namespace", "profile-us");
    return this.http.get<IGuild>(this.blizzHostName + "/data/wow/guild/sargeras/thought/roster", { 'headers': headers })
  }

  getCharacterRender(accessToken, charName): Observable<ICharacterRender> {
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("Battlenet-Namespace", "profile-us");
    return this.http.get<ICharacterRender>(this.blizzHostName + `/profile/wow/character/sargeras/${charName}/character-media`, {'headers' : headers })
  }
}
