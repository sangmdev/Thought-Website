
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";

import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class RaiderIoService {
  constructor(private readonly http: HttpClient) { }

  getCharacterData(charName): Observable<any> {
    return this.http.get(`https://raider.io/api/v1/characters/profile?region=us&realm=sargeras&name=${charName}&fields=mythic_plus_scores_by_season%3Acurrent`);
  }

  getScore(charName){
    this.getCharacterData(charName).subscribe(
      results => {
        return results.mythic_plus_scores_by_season[0].scores.all;
      });
  }

  refreshScores(){
    //Gets scores from raider.io for each character that has an entry in the db and updates their score in the db
    const ref = firebase.database().ref('characters');
    ref.once('value', function(snapshot) {
      snapshot.forEach(character => {
        const name = character.key
        const lastScores = character.val().lastScores
        lastScores.push(character.val().score)
        this.getCharacterScore(name).subscribe(
          results => {
            const score = results.mythic_plus_scores_by_season[0].scores.all;
            firebase.database().ref('characters/' + name).set({
              score,
              lastScores
            });
          });
      });
    }.bind(this));
  }
}
