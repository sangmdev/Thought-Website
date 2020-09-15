import * as moment from "moment";
import { Injectable } from "@angular/core";
import { RaiderIoService } from "./raider-io.service";
import * as firebase from "firebase/app";

@Injectable({
  providedIn: "root"
})

export class MythicPlusDatabase{

  constructor(private readonly raiderIoService: RaiderIoService){

  }

  //gets a score for the selected char from the db
  async getSavedScore(cn){
    try{
      if(!cn || cn.length < 1) throw new Error('Enter a character name')
      const charName = cn.toLowerCase()
      let score
      const ref = firebase.database().ref('characters/' + charName);
      await ref.on('value', function(snapshot) {
        if(!snapshot.val()) throw new Error('Character not tracked')
        score = snapshot.val().score
      })
      return score
    } catch(e) {
      throw e
    }

  }

  async getAllSavedScores(){
    const allScores = []
    const tierMap = {2500: 1, 2000: 2, 1500: 3, 1000: 4, 500: 5, 0: 6}
    const ref = firebase.database().ref('characters').orderByChild('score')
    await ref.on('value', function (snapshot) {
      let index = 0
      snapshot.forEach(character => {
        const found = allScores.find(score => score.name == character.key) ? true : false
        if(!found){
          const rank = snapshot.numChildren() - index
          const score = character.val().score
          const roundedScore = Math.floor(score / 500) * 500
          const tier = tierMap[roundedScore] ? tierMap[roundedScore] : 1
          allScores.unshift({ rank, name: character.key, score, tier})
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
