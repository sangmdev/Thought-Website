import { Component, OnInit } from "@angular/core";
import { BlizzApiService } from "../../services/blizz-api.service";
import { IGuildMember } from "../interfaces/IGuildMember";
import { RaiderIoService } from "../../services/raider-io.service";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-roster",
  templateUrl: "./roster.component.html",
  styleUrls: ["./roster.component.css"]
})
export class RosterComponent implements OnInit {
  accessToken: any;
  members: any;
  displayedColumns = ["name", "class", "race"];
  officerRoster: IGuildMember[] = [];
  guildMasterRoster: IGuildMember[] = [];
  guildMasters = ["Judlas", "Pìp"];
  mythicCoreRoster: IGuildMember[] = [];

  constructor(private readonly blizzApiService: BlizzApiService, private readonly raiderIoService: RaiderIoService) {}

  ngOnInit() {
    this.blizzApiService.getAccessToken().subscribe(
      accessToken => {
        this.accessToken = accessToken;
        this.getOfficerRoster();
        this.getLeaderRoster();
        this.getMythicCoreRoster();
      });
  }

  // Get guild roster and filter down to only officers/raid leads.
  getOfficerRoster() {
    this.blizzApiService.getGuildRoster(this.accessToken.access_token).subscribe(
      guild => {
        var officers = guild.members.filter(element => element.rank === 2 || element.rank === 3);
        forkJoin(
          officers.map(member => {
            return this.raiderIoService.getCharacterInformation(member.character.name);
          })
        ).subscribe(allResults => { this.officerRoster = allResults });
      });
  }

  // Get character information for guild leaders.
  getLeaderRoster() {
    forkJoin(
      this.guildMasters.map(member => {
        return this.raiderIoService.getCharacterInformation(member);
      })
    ).subscribe(allResults => { this.guildMasterRoster = allResults});
  }

  // Get guild roster and filter down to only mythic core roster.
  getMythicCoreRoster() {
    this.blizzApiService.getGuildRoster(this.accessToken.access_token).subscribe(
      guild => {
        var officers = guild.members.filter(element => element.rank === 5);
        forkJoin(
          officers.map(member => {
            return this.raiderIoService.getCharacterInformation(member.character.name);
          })
        ).subscribe(allResults => { this.mythicCoreRoster = allResults });
      });

  }
}
