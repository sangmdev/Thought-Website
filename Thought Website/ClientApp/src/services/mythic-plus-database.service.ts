
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
    await ref.on('value', function(snapshot) {
      score = snapshot.val().score
    })
    return score
  }

  async getAllSavedScores(){
    const allScores = []
    const ref = firebase.database().ref('characters')
    await ref.on('value', function (snapshot) {
      snapshot.forEach(character => {
        allScores.push({ name: character.key, score: character.val().score })
      })
    });
    return allScores
  }

  async addCharacter(charName){
    try{
      const data = await this.raiderIoService.getCharacterGuildData(charName)
      const score = data.mythic_plus_scores_by_season[0].scores.all
      const entries = await this.getAllSavedScores()

      const characterTracked = entries.find(entry => {
        const found = entry.name === charName
        return found
      })

      if(data.guild.name !== 'Thought' || data.guild.realm !== 'Sargeras'){
        throw new Error('Character not in Thought')
      }else if(characterTracked){
        throw new Error('Character is already tracked')
      }else{
        firebase.database().ref('characters/' + charName).set({
          lastScores: [score],
          score,
        });
      }
      return data
    } catch(e){
      console.log(`The error is: ${e.message}`)
    }
  }
}
