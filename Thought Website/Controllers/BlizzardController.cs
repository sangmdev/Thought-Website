using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using RestSharp.Serialization;
using Thought_Website.Models;

namespace Thought_Website.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlizzardController : ControllerBase
    {
        private const string blizzHostName = "https://us.api.blizzard.com";
        private readonly ClientInfo _clientInfo;
        static readonly HttpClient client = new HttpClient();
        private static AccessTokenResponse accessToken;
        public BlizzardController(ClientInfo clientInfo) {
            _clientInfo = clientInfo;
        }

        // GET: api/Blizzard
        public async Task<AccessTokenResponse> GetAccessTokenAsync()
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "https://na.battle.net/oauth/token");

            byte[] bytes = Encoding.GetEncoding(28591).GetBytes($"{_clientInfo.ClientId}:{_clientInfo.ClientSecret}");
            var auth = Convert.ToBase64String(bytes);
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", auth);
            client.DefaultRequestHeaders.Add("Accept", "*/*");
            var content = new FormUrlEncodedContent(
                new KeyValuePair<string, string>[] {
                    new KeyValuePair<string, string>("grant_type", "client_credentials"),
                 }
            );

            HttpResponseMessage tokenResponse = await client.PostAsync("https://us.battle.net/oauth/token", content);
            tokenResponse.EnsureSuccessStatusCode();

            var jsonContent = await tokenResponse.Content.ReadAsStringAsync();
            AccessTokenResponse token = JsonConvert.DeserializeObject<AccessTokenResponse>(jsonContent);
            accessToken = token;
            return token;
        }

        [HttpGet, Route("guild")]
        public async Task<Guild> GetGuildAsync(string accessToken)
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            HttpResponseMessage response = await client.GetAsync(blizzHostName + "/data/wow/guild/sargeras/thought/roster?namespace=profile-us");
            response.EnsureSuccessStatusCode();

            var jsonContent = await response.Content.ReadAsStringAsync();
            Guild guild = JsonConvert.DeserializeObject<Guild>(jsonContent);
            return guild;
        }

        [HttpGet, Route("characterRender")]
        public async Task<CharacterRender> GetCharacterRenderAsync(string accessToken, string charName)
        {
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            HttpResponseMessage response = await client.GetAsync(blizzHostName + $"/profile/wow/character/sargeras/{charName}/character-media?namespace=profile-us");
            response.EnsureSuccessStatusCode();

            var jsonContent = await response.Content.ReadAsStringAsync();
            CharacterRender charRender = JsonConvert.DeserializeObject<CharacterRender>(jsonContent);
            return charRender;
        }
    }
}
