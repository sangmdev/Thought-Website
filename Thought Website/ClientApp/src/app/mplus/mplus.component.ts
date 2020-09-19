import { Component, OnInit } from "@angular/core";
import { RaiderIoService } from "../../services/raider-io.service";
import { MythicPlusDatabase } from "../../services/mythic-plus-database.service"
import { ICharacterData } from "../interfaces/ICharacterData";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-home",
  templateUrl: "./mplus.component.html",
  styleUrls: ["./mplus.component.css"]

})
export class MPlusComponent implements OnInit {

  ioScore: number;
  searchCharName: string;
  selectedChar: ICharacterData;
  allScores: ICharacterData[];
  dbSearchCompleted = false;
  addCharName: string;
  displayedColumns: string[] = ['rank', 'class', 'name', 'score', 'tier', ];
  topTen: ICharacterData[];
  scoresInTier: ICharacterData[];

  constructor(private readonly raiderIoService: RaiderIoService, readonly MPlusService: MythicPlusDatabase, private _snackBar: MatSnackBar) {

  }

  async getScoreFromDb() {
      const foundChar = await this.MPlusService.getSavedScore(this.searchCharName.trim())
      if(foundChar){
        this.getScoresInTier()
      } else {
        this.openErrorSnackBar('Character not found', 'Dismiss')
      }
      this.dbSearchCompleted = true
  }

  async getAllScoresFromDb() {
    this.allScores = await this.MPlusService.getAllSavedScores()
  }

  fetchScores() {
    this.raiderIoService.refreshScores()
  }

  getScoresInTier(){
    this.selectedChar = this.allScores.find(score => score.name.toLowerCase() === this.searchCharName.toLowerCase().trim())
    this.scoresInTier = this.allScores.filter(score => {
      const starDiff = score.totalStars - this.selectedChar.totalStars
      return Math.abs(starDiff) <= 1
    })
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
      panelClass: ['mat-toolbar', 'mat-warn']
    });
  }

  openSucessSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      panelClass: ['mat-toolbar', 'mat-primary']
    });
  }



  ngOnInit() {
    this.getAllScoresFromDb()
  }
}
