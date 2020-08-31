import { Component, OnInit } from '@angular/core';
import { RaiderIoService } from '../../services/raider-io.service';
import { MythicPlusDatabase } from '../../services/mythic-plus-database.service'
import { ICharacterData } from '../interfaces/ICharacterData';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash'
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './mplus.component.html',
  styleUrls: ['./mplus.component.css']

})
export class MPlusComponent implements OnInit {

  ioScore: number;
  charName: string;
  dbScore: number;
  allScores: ICharacterData[];
  sortedScores: ICharacterData[];
  dbSearchCompleted = false;
  addCharName: string;
  displayedColumns: string[] = ['rank', 'name', 'score'];

  constructor(private readonly raiderIoService: RaiderIoService, readonly MPlusService: MythicPlusDatabase, private _snackBar: MatSnackBar) {

  }

  async getScoreFromDb() {
    this.dbScore = await this.MPlusService.getSavedScore(this.charName)
    this.dbSearchCompleted = true
  }

  async getAllScoresFromDb() {
    this.allScores = await this.MPlusService.getAllSavedScores()
  }

  fetchScores() {
    this.raiderIoService.refreshScores()
  }

  async addCharacter(){
    await this.MPlusService.addCharacter(this.addCharName)
    .then(() => {
      this.openSucessSnackBar(`Successfully added character ${this.addCharName}`, 'Dismiss')
    })
    .catch(err => {
      this.openErrorSnackBar(err.message, 'Dismiss')
    })
    this.getAllScoresFromDb()
  }

  openErrorSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      panelClass: ['error-snackbar']
    });
  }

  openSucessSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      panelClass: ['success-snackbar']
    });
  }



  ngOnInit() {
    this.getAllScoresFromDb()
  }
}
