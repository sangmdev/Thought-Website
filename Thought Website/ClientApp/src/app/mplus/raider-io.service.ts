
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
  providedIn: 'root'
})
export class RaiderIoService {
  constructor(private readonly http: HttpClient) { }

  getCharacterScore(charName): Observable<any> {
    return this.http.get(`https://raider.io/api/v1/characters/profile?region=us&realm=sargeras&name=${charName}&fields=mythic_plus_scores_by_season%3Acurrent`);
  }
}
