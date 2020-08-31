import * as moment from 'moment';
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { ICharacterGuildData } from '../app/interfaces/ICharacterGuildData';
import { IRaiderIoCharacterGuildData } from '../app/interfaces/IRaiderIoCharacterGuildData';


import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class RaiderIoService {
  constructor(private readonly http: HttpClient) { }

  getCharacterData(charName): Observable<any> {
    return this.http.get(`https://raider.io/api/v1/characters/profile?region=us&realm=sargeras&name=${charName}&fields=mythic_plus_scores_by_season%3Acurrent`);
  }

  async getCharacterGuildData(charName){
    let data: IRaiderIoCharacterGuildData
    data = await this.http.get<IRaiderIoCharacterGuildData>(`https://raider.io/api/v1/characters/profile?region=us&realm=sargeras&name=${charName}&fields=guild%2Cmythic_plus_scores_by_season%3Acurrent`).toPromise()
    return data

  }

  getScore(charName){
    this.getCharacterData(charName).subscribe(
      results => {
        return results.mythic_plus_scores_by_season[0].scores.all;
      });
  }

  refreshScores(){
    //Gets scores from raider.io for each character that has an entry in the db and updates their score in the db
    const currentDate = moment().format('L')
    const ref = firebase.database().ref('characters');
    ref.once('value', function(snapshot) {
      snapshot.forEach(character => {
        const name = character.key
        var lastScores = character.val().lastScores
        console.log(lastScores, currentDate)
        if(!lastScores.find(score => score.date === currentDate)){
          console.log('pushed a new score')
          lastScores.push({score:character.val().score, date: currentDate})
        }
        this.getCharacterData(name).subscribe(
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
