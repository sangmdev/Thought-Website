import { Component, OnInit } from '@angular/core';
import { RaiderIoService } from '../../services/raider-io.service';
import { MythicPlusDatabase } from '../../services/mythic-plus-database.service'
import { ICharacterData } from '../interfaces/ICharacterData';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  addCharName: string;

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
    await this.MPlusService.addCharacter(this.addCharName).catch(err => {
      this.openSnackBar(err.message, 'Dismiss')
    })
  }

  openSnackBar(message: string, action: string) {
  this._snackBar.open(message, action, {
    duration: 2000,
    panelClass: ['mat-toolbar', 'mat-warn']
  });
}

  ngOnInit() {
    this.getAllScoresFromDb()
  }
}
