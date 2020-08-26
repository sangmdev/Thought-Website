import { Component, OnInit } from '@angular/core';
import { RaiderIoService } from './raider-io.service';
import { ICharacterData } from '../interfaces/ICharacterData';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-home',
  templateUrl: './mplus.component.html',
})
export class MPlusComponent implements OnInit {

  ioScore: number;
  charName: string;
  dbScore: number;
  allScores: ICharacterData[];
  dbSearchCompleted = false;

  constructor(private readonly raiderIoService: RaiderIoService) {

  }

  //gets a score for the selected char from raider io
  getScore() {
    this.raiderIoService.getCharacterScore(this.charName).subscribe(
      results => {
        this.ioScore = results.mythic_plus_scores_by_season[0].scores.all;
      });
  }

  //gets a score for the selected char from the db
  getScoreFromDb() {
    this.dbScore = null;
    const ref = firebase.database().ref('characters/' + this.charName);
    ref.once('value', function (snapshot) {
      this.dbScore = snapshot.val().score;
    }.bind(this));
    this.dbSearchCompleted = true;
  }

  getAllScoresFromDb() {
    const allScores = [];
    const ref = firebase.database().ref('characters');
    ref.once('value', function (snapshot) {
      snapshot.forEach(character => {
        allScores.push({ name: character.key, score: character.val().score })
      })
    });
    this.allScores = allScores
  }

  fetchScores() {
    //Gets scores from raider.io for each character that has an entry in the db and updates their score in the db
    const ref = firebase.database().ref('characters');
    ref.once('value', function (snapshot) {
      snapshot.forEach(character => {
        const name = character.key
        const lastScores = character.val().lastScores
        lastScores.push(character.val().score)
        this.raiderIoService.getCharacterScore(name).subscribe(
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

  ngOnInit() {
    this.getAllScoresFromDb()
  }

}
