import { Component, OnInit } from "@angular/core";
import { BlizzApiService } from "../../services/blizz-api.service";
import { IGuildMember } from "../interfaces/IGuildMember";
import { ICharacterRender } from "../interfaces/ICharacterRender";
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
  officerCharacterRenders: ICharacterRender[] = [];
  officersLoaded = false;
  mythicCoreLoaded = false;
  leadersLoaded = false;

  constructor(private readonly blizzApiService: BlizzApiService, private readonly raiderIoService: RaiderIoService) {}

  ngOnInit() {
    this.getLeaderRoster();
    this.getOfficerRoster();
    this.getMythicCoreRoster();
  }

  // Get guild roster and filter down to only officers/raid leads.
  getOfficerRoster() {
    this.blizzApiService.getGuildRoster().subscribe(
      guild => {
        var officers = guild.members.filter(element => element.rank === 2 || element.rank === 3);
        forkJoin(
          officers.map(member => {
            return this.raiderIoService.getCharacterInformation(member.character.name);
          })
        ).subscribe(allResults => { this.officerRoster = allResults; this.getCharacterRendersOfficers(); });
      });
  }

  // Get character information for guild leaders.
  getLeaderRoster() {
    forkJoin(
      this.guildMasters.map(member => {
        return this.raiderIoService.getCharacterInformation(member);
      })
    ).subscribe(allResults => { this.guildMasterRoster = allResults; this.getCharacterRendersGuildLeaders(); });
  }
  
  // Get guild roster and filter down to only mythic core roster.
  getMythicCoreRoster() {
    this.blizzApiService.getGuildRoster().subscribe(
      guild => {
        var mythicCore = guild.members.filter(element => element.rank === 5 || element.rank === 2 || element.rank === 3);
        forkJoin(
          mythicCore.map(member => {
            return this.raiderIoService.getCharacterInformation(member.character.name);
          })
        ).subscribe(allResults => { this.mythicCoreRoster = allResults; this.getCharacterRendersMythicCore(); })
      });
  }

  // Get character renders for mythic core team, store in appropriate character objects.
  getCharacterRendersMythicCore() {
    forkJoin(
      this.mythicCoreRoster.map(member => {
        return this.blizzApiService.getCharacterRender(member.name.toLowerCase())
      })
    ).subscribe(allResults => { this.storeMythicCoreRenders(allResults);})
  }

  // Get character renders for officers, store in appropriate character objects.
  getCharacterRendersOfficers() {
    forkJoin(
      this.officerRoster.map(member => {
        return this.blizzApiService.getCharacterRender(member.name.toLowerCase())})
    ).subscribe(allResults => { this.storeOfficerRenders(allResults); })
  }

  // Get character renders for guild leaders, store in appropriate character objects.
  getCharacterRendersGuildLeaders() {
    forkJoin(
      this.guildMasterRoster.map(member => {
        return this.blizzApiService.getCharacterRender(member.name.toLowerCase())
      })
    ).subscribe(allResults => { this.storeGuildMasterRenders(allResults); })
  }

  //Store guild leaders renders in officer roster object
  storeGuildMasterRenders(allResults: ICharacterRender[]) {
    allResults.forEach(result => {
      this.guildMasterRoster.forEach(leader => {
        if (leader.name === result.character.name) {
          leader.render_url = result.assets[2].value;
        }
      })
    });
    this.leadersLoaded = true;
  }

  //Store officer renders in officer roster object
  storeOfficerRenders(allResults: ICharacterRender[]) {
    allResults.forEach(result => {
      this.officerRoster.forEach(officer => {
        if (officer.name === result.character.name) {
          officer.render_url = result.render_url;
          if (!officer.render_url) {
            officer.render_url = result.assets[2].value;
          }
        }
      })
    });
    this.officersLoaded = true;
  }

  //Store mythicCore renders in officer roster object
  storeMythicCoreRenders(allResults: ICharacterRender[]) {
    allResults.forEach(result => {
      this.mythicCoreRoster.forEach(character => {
        if (character.name === result.character.name) {
          character.render_url = result.render_url;
          if (!character.render_url) {
            character.render_url = result.assets[2].value;
          }
        }
      })
    });
    this.mythicCoreLoaded = true;
  }
}
