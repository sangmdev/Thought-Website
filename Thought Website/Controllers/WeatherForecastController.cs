using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Thought_Website.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BlizzardApiController : ControllerBase
    {
    //    private static getAccessToken()
    //    {
    //        const httpHeaders = new HttpHeaders()
    //          .set("Authorization", `Basic ` +btoa(`${ environment.clientId}:${ environment.clientSecret}`))
    // .set("Content-Type", "application/x-www-form-urlencoded")
    // .set("Accept", "*/*");
    //        var body = new HttpParams().set("grant_type", "client_credentials")
    //return this.http.post("https://us.battle.net/oauth/token", body, { 'headers': httpHeaders });
    //    }

    //        [HttpGet]
    //        private static getGuildRoster(accessToken) : Observable<IGuild> {
    //    const headers = new HttpHeaders()
    //      .set("Content-Type", "application/json")
    //      .set("Authorization", `Bearer ${accessToken}`)
    //      .set("Battlenet-Namespace", "profile-us");
    //    return this.http.get<IGuild>(this.blizzHostName + "/data/wow/guild/sargeras/thought/roster", { 'headers': headers })
    //  }

    //[HttpGet]
    //private static getCharacterRender(accessToken, charName): Observable<ICharacterRender> {
    //    const headers = new HttpHeaders()
    //      .set("Content-Type", "application/json")
    //      .set("Authorization", `Bearer ${ accessToken}`)
    //      .set("Battlenet-Namespace", "profile-us");
    //    return this.http.get<ICharacterRender>(this.blizzHostName + `/ profile / wow / character / sargeras /${ charName}/ character - media`, { 'headers' : headers })
    //  }
    }
}
