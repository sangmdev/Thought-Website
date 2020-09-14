import { Component, OnInit } from "@angular/core";
import { BlizzApiService } from "../../services/blizz-api.service";
import { IGuildMember } from "../interfaces/IGuildMember";
import { RaiderIoService } from "../../services/raider-io.service";
import { map } from "rxjs/internal/operators/map";
import { switchMap } from "rxjs/internal/operators/switchMap";

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

  guildLeaders = ["Judlas", "Pip"];

  constructor(private readonly blizzApiService: BlizzApiService, private readonly raiderIoService: RaiderIoService) {}

  ngOnInit() {
    this.blizzApiService.getAccessToken().subscribe(
      accessToken => {
        this.accessToken = accessToken;
        this.getOfficerRoster();
      });
  }

  // Get guild roster and filter down to only officers/raid leads.
  getOfficerRoster() {
    this.blizzApiService.getGuildRoster(this.accessToken.access_token).subscribe(
      guild => {
        var officers = guild.members.filter(element => element.rank === 2 || element.rank === 3);
        officers.forEach(member => {
          //this.raiderIoService.getCharacterInformation(member.character.name).pipe(
          //  switchMap((result => {
          //     this.officerRoster.push(result);
          //  })));
        });
      });
  }
}
