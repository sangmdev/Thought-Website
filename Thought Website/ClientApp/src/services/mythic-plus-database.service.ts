
import { Injectable } from "@angular/core";
import {RaiderIoService} from './raider-io.service'
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})

export class MythicPlusDatabase{

  constructor(private readonly raiderIoService: RaiderIoService){

  }

  //gets a score for the selected char from the db
  async getSavedScore(charName){
    let score
    const ref = firebase.database().ref('characters/' + charName);
    await ref.once('value', function(snapshot) {
      score = snapshot.val().score
    })
    return score
  }

  getAllSavedScores(){
    const allScores = [];
    const ref = firebase.database().ref('characters');
    ref.once('value', function (snapshot) {
      snapshot.forEach(character => {
        allScores.push({ name: character.key, score: character.val().score })
      })
    });
    return allScores
  }

  async addCharacter(charName){
    const data = await this.raiderIoService.getCharacterGuildData(charName)
      .then(data => {
        console.log({data})
      }
    ).catch( err => {
      console.log(err)
    })
    console.log({data})
    return data
  }
}
