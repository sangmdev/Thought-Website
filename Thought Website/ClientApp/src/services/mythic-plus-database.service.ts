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

  async getTrackedChars(){
    const allScores = []
    const ref = firebase.database().ref('characters').orderByChild('name')
    await ref.on('value', function (snapshot) {
      snapshot.forEach(character => {
        allScores.push(character.key)
      })
    }.bind(this));
    return allScores
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
          const score = character.val().score
          const char_class = kebabCase(character.val().char_class)
          const spec = character.val().spec
          const {tier, stars, bracket, totalStars} = this.getTierAndStars(score)
          allScores.unshift({ rank, name: character.key, score, tier, char_class, spec, stars, bracket, totalStars})
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
    const starCount = { 3500: 14, 3250: 13, 3000:12 , 2750:11, 2500:10, 2250:9, 2000:8, 1750: 7, 1500:6, 1250:5, 1000: 4, 750:3, 500:3, 250:3, 0:3 }
    let roundedScore = Math.floor(score / 250) * 250
    roundedScore = roundedScore > 3500 ? 3500 : roundedScore
    const totalStars = starCount[roundedScore]
    const stars = totalStars % 3
    const tier = 5 - Math.floor((totalStars / 3))
    const bracket = roundedScore === 3500 ? '3500+' : roundedScore < 1000 ? '0-1000' : `${roundedScore}-${roundedScore + 250}`
    return {tier, stars, bracket, totalStars}
  }
}
