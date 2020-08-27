import { Component, OnInit } from '@angular/core';
import { RaiderIoService } from '../../services/raider-io.service';
import { MythicPlusDatabase } from '../../services/mythic-plus-database.service'
import { ICharacterData } from '../interfaces/ICharacterData';
import * as firebase from 'firebase';

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

  constructor(private readonly raiderIoService: RaiderIoService, readonly MPlusService: MythicPlusDatabase) {

  }

  getScoreFromDb() {
    this.dbScore = this.MPlusService.getSavedScore(this.charName)
    this.dbSearchCompleted = true
  }

  getAllScoresFromDb() {
    this.allScores = this.MPlusService.getAllSavedScores()
  }

  fetchScores() {
    this.raiderIoService.refreshScores()
  }

  ngOnInit() {
    this.getAllScoresFromDb()
  }
}
