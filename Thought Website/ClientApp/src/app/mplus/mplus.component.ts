import { Component, OnInit, OnChanges, ViewChild } from "@angular/core";
import { RaiderIoService } from "../../services/raider-io.service";
import { MythicPlusDatabase } from "../../services/mythic-plus-database.service"
import { ICharacterData } from "../interfaces/ICharacterData";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";

@Component({
  selector: "app-home",
  templateUrl: "./mplus.component.html",
  styleUrls: ["./mplus.component.css"]

})
export class MPlusComponent implements OnInit {
  ioScore: number;
  searchCharName: string = '';
  selectedChar: ICharacterData;
  allScores: ICharacterData[];
  dbSearchCompleted = false;
  addCharName: string;
  displayedColumns: string[] = ['rank', 'class', 'name', 'score', 'tier', ];
  scoresInTier: ICharacterData[];
  searchName = new FormControl();
  options: string[];
  filteredOptions: Observable<string[]>;

  constructor(private readonly raiderIoService: RaiderIoService, readonly MPlusService: MythicPlusDatabase, private _snackBar: MatSnackBar) {}

  ngOnInit() {
    this.getAllScoresFromDb();
    this.getOptionsFromDb();
  }

  async getScoreFromDb() {
    try{
      const foundScore = await this.MPlusService.getSavedScore(this.searchCharName.trim())
      if(foundScore || foundScore === 0){
        this.getScoresInTier()
      } else {
        throw Error('Character not found')
      }
    }catch(e){
      this.openErrorSnackBar(e.message, 'Dismiss')
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
      this.openSuccessSnackBar(`Successfully added character ${this.addCharName}`, 'Dismiss')
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

  openSuccessSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      panelClass: ['mat-toolbar', 'mat-primary']
    });
  }

  async getOptionsFromDb(){
    this.MPlusService.getTrackedChars().then((res) => {
      this.options = res;
      this.filteredOptions = this.searchName.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
