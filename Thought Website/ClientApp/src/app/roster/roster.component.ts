import { Component, OnInit } from "@angular/core";
import { BlizzApiService } from "../../services/blizz-api.service";
import { IGuildMember } from "../interfaces/IGuildMember";
import { RaiderIoService } from "../../services/raider-io.service";
import { forkJoin } from "rxjs";
import { environment } from "../../environments/environment";

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
  isLoaded = false;

  constructor(private readonly blizzApiService: BlizzApiService, private readonly raiderIoService: RaiderIoService) {}

  ngOnInit() {
    this.blizzApiService.getAccessToken(environment.clientId, environment.clientSecret).subscribe(
      accessToken => {
        this.accessToken = accessToken;
        this.isLoaded = true;
      });
  }

  // Get guild roster and filter down to only officers/raid leads.
  //getOfficerRoster() {
  //  this.blizzApiService.getGuildRoster(this.accessToken.access_token).subscribe(
  //    guild => {
  //      var officers = guild.members.filter(element => element.rank === 2 || element.rank === 3);
  //      forkJoin(
  //        officers.map(member => {
  //          return this.raiderIoService.getCharacterInformation(member.character.name);
  //        })
  //      ).subscribe(allResults => { this.officerRoster = allResults; this.getCharacterRendersOfficers() });
  //    });
  //}

  //// Get character information for guild leaders.
  //getLeaderRoster() {
  //  forkJoin(
  //    this.guildMasters.map(member => {
  //      return this.raiderIoService.getCharacterInformation(member);
  //    })
  //  ).subscribe(allResults => { this.guildMasterRoster = allResults; this.getCharacterRendersGuildLeaders();});
  //}

  //// Get guild roster and filter down to only mythic core roster.
  //getMythicCoreRoster() {
  //  this.blizzApiService.getGuildRoster(this.accessToken.access_token).subscribe(
  //    guild => {
  //      var mythicCore = guild.members.filter(element => element.rank === 5 || element.rank === 2 || element.rank === 3);
  //      forkJoin(
  //        mythicCore.map(member => {
  //          return this.raiderIoService.getCharacterInformation(member.character.name);
  //        })
  //      ).subscribe(allResults => { this.mythicCoreRoster = allResults; this.getCharacterRendersMythicCore(); });
  //    });
  //}

  //// Get character renders for mythic core team, store in appropriate character objects.
  //getCharacterRendersMythicCore() {
  //  this.mythicCoreRoster.forEach(member => {
  //    this.blizzApiService.getCharacterRender(this.accessToken.access_token, member.name.toLowerCase()).subscribe(
  //      result => { member.render_url = result.render_url });
  //  });
  //}
  //// Get character renders for officers, store in appropriate character objects.
  //getCharacterRendersOfficers() {
  //  this.officerRoster.forEach(member => {
  //    this.blizzApiService.getCharacterRender(this.accessToken.access_token, member.name.toLowerCase()).subscribe(
  //      result => { member.render_url = result.render_url });
  //  });
  //}

  //// Get character renders for guild leaders, store in appropriate character objects.
  //getCharacterRendersGuildLeaders() {
  //  this.guildMasterRoster.forEach(member => {
  //    this.blizzApiService.getCharacterRender(this.accessToken.access_token, member.name.toLowerCase()).subscribe(
  //      result => { member.render_url = result.render_url });
  //  });
  //}
}
