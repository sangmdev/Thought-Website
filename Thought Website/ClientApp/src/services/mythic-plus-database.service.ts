import * as moment from "moment";
import { Injectable } from "@angular/core";
import { RaiderIoService } from "./raider-io.service";
import * as firebase from "firebase/app";
import {kebabCase} from "lodash"

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
          const char_class = kebabCase(character.val().char_class)
          const spec = character.val().spec
          const roundedScore = Math.floor(score / 500) * 500
          // let tier = 5 - Math.floor((score - 500) / 750)
          // let stars = 0
          // if(score > 500){
          //   stars = Math.floor(((score - 500) % 750) / 250)
          // } else {
          //   tier = 5
          // }
          const {tier, stars} = this.getTierAndStars(score)
          allScores.unshift({ rank, name: character.key, score, tier, char_class, spec, stars})
        }
        index += 1
      })
    }.bind(this));
    return allScores
  }

  async addCharacter(cn){
    try{
      const charName = cn.toLowerCase()
      const data = await this.raiderIoService.getCharacterGuildData(charName)
      const char_class = data.class
      const spec = data.active_spec_name
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
          char_class,
          spec,
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

  getTierAndStars(score){
    const starCount = { 3500: 13, 3250: 12, 3000:11 , 2750:10, 2500:9, 2250:8, 2000:7, 1750: 6, 1500:5, 1250:4, 1000: 3, 750:2, 500:1, 250:1, 0:1 }
    const roundedScore = Math.floor(score / 250) * 250
    const totalStars = starCount[roundedScore] + 2 
    const stars = totalStars % 3
    const tier = 5 - Math.floor((totalStars / 3))
    console.log(tier, stars)
    return {tier, stars}
  }
}
