import * as moment from 'moment';
import { Injectable } from "@angular/core";
import {RaiderIoService} from './raider-io.service';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})

export class MythicPlusDatabase{

  constructor(private readonly raiderIoService: RaiderIoService){

  }

  //gets a score for the selected char from the db
  async getSavedScore(cn){
    const charName = cn.toLowerCase()
    let score
    const ref = firebase.database().ref('characters/' + charName);
    await ref.on('value', function(snapshot) {
      score = snapshot.val().score
    })
    return score
  }

  async getAllSavedScores(){
    const allScores = []
    const ref = firebase.database().ref('characters').orderByChild('score')
    await ref.on('value', function (snapshot) {
      let index = 0
      snapshot.forEach(character => {
        const found = allScores.find(score => score.name == character.key) ? true : false
        if(!found){
          const rank = snapshot.numChildren() - index
          allScores.unshift({ rank, name: character.key, score: character.val().score })
        }
        index += 1
      })
    });
    return allScores
  }

  async addCharacter(cn){
    try{
      const charName = cn.toLowerCase()
      const data = await this.raiderIoService.getCharacterGuildData(charName)
      const score = data.mythic_plus_scores_by_season[0].scores.all
      const entries = await this.getAllSavedScores()

      const characterTracked = entries.find(entry => {
        const found = entry.name === charName
        return found
      })

      if(data.guild.name !== 'Thought' || data.guild.realm !== 'Sargeras'){
        throw new Error('Sorry, this character is not in Thought.')
      }else if(characterTracked){
        throw new Error('Sorry, this character is already being tracked.')
      }else{
        firebase.database().ref('characters/' + charName).set({
          lastScores: [{score, date: moment().format('L')}],
          score,
        });
      }
      return data
    } catch(e){
      if(e.status === 400){
        throw new Error(`Character ${cn}-Sargeras not found.`)
      }
      throw e
    }
  }
}
