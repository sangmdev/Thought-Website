import { Component, OnInit } from "@angular/core";
import { LogsDatabaseService } from "../../services/logs-database.service";
import { ILogData } from "../interfaces/ILogData";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-logs",
  templateUrl: "./logs.component.html",
  styleUrls: ["./logs.component.css"]
})
export class LogsComponent implements OnInit {
  logDate: number;
  logUrl: string;
  raidName: string;
  difficulty: string;
  allLogs: ILogData[];
  displayedColumns: string[] = ["raidName", "logDate", "logUrl"];

  constructor(private readonly logsDatabaseService: LogsDatabaseService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getAllLogs();
  }

  async addLog() {
    await this.logsDatabaseService.addLog(this.raidName, this.difficulty, this.convert(this.logDate), this.logUrl).
      then(() => {
        this.openSuccessSnackBar(`Successfully added log.`, "Dismiss");
      })
      .catch(err => {
        this.openErrorSnackBar(`err.message`, "Dismiss")
      });
    this.getAllLogs();
  }

  async getAllLogs() {
    this.allLogs = [];
    this.allLogs = await this.logsDatabaseService.getAllLogs();
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [mnth, day, date.getFullYear()].join("");
  }

  openErrorSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      panelClass: ["error-snackbar"]
    });
  }

  openSuccessSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
      panelClass: ["success-snackbar"]
    });
  }
}
