import { Component, OnInit } from '@angular/core';
import { BlizzApiService } from '../../services/blizz-api.service';
import { IGuildMember } from '../interfaces/IGuildMember';

@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.css']
})

export class RosterComponent implements OnInit {
  accessToken: any;
  members: any;
  displayedColumns = ['name', 'class', 'race']
  leadershipRoster: IGuildMember[];
  classNames = [
    'none',
    'Warrior',
    'Paladin' ,
    'Hunter',
    'Rogue',
    'Priest',
    'Death Knight',
    'Shaman',
    'Mage',
    'Warlock',
    'Monk',
    'Druid',
    'Demon Hunter'
  ]

  constructor(private readonly blizzApiService : BlizzApiService) { }

  ngOnInit() {
    this.blizzApiService.getAccessToken().subscribe(
      accessToken => {
        this.accessToken = accessToken;
      });
  }

  getLeadershipRoster() {
    this.blizzApiService.getGuildRoster(this.accessToken.access_token).subscribe(
      guild => {
        console.log(guild);
        this.leadershipRoster = guild.members.filter(element => element.rank <= 3 && element.rank != 1)
        });
  }
}
