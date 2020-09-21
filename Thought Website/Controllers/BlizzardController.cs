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
using RestSharp;
using Thought_Website.Models;

namespace Thought_Website.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlizzardController : ControllerBase
    {
        private const string blizzHostName = "https://us.api.blizzard.com";
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ClientInfo _clientInfo;
        public BlizzardController(IHttpClientFactory httpClientFactory, ClientInfo clientInfo) {
            _httpClientFactory = httpClientFactory;
            _clientInfo = clientInfo;
        }

        // GET: api/Blizzard
        public async Task GetAccessTokenAsync()
        {
            var request = new HttpRequestMessage(HttpMethod.Post, "https://na.battle.net/oauth/token");
            var client = _httpClientFactory.CreateClient();

            byte[] bytes = Encoding.GetEncoding(28591).GetBytes($"{_clientInfo.ClientId}:{_clientInfo.ClientSecret}");
            var auth = Convert.ToBase64String(bytes);
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", auth);

            MultipartFormDataContent form = new MultipartFormDataContent();
            string body = "grant_type=client_credentials";
            request.Content = new StringContent(body,
                                                    Encoding.UTF8,
                                                    "application/x-www-form-urlencoded");//CONTENT-TYPE header  
            request.Headers.Add("Accept", "*/*");
            List<KeyValuePair<string, string>> postData = new List<KeyValuePair<string, string>>();

            postData.Add(new KeyValuePair<string, string>("grant_type", "client_credentials"));
            request.Content = new FormUrlEncodedContent(postData);

            var test = System.Net.Dns.GetHostName();
            HttpResponseMessage tokenResponse = client.PostAsync("https://na.battle.net/oauth/token", new FormUrlEncodedContent(postData)).Result;

            HttpResponseMessage response = await client.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                Console.Write(response);
            }
            else
            {
                Console.Write(response);
            }

            //var client = new RestClient("https://na.battle.net/oauth/token");
            //var request = new RestRequest(Method.POST);
            //request.AddHeader("cache-control", "no-cache");
            //request.AddHeader("content-type", "application/x-www-form-urlencoded");
            //request.AddParameter("application/x-www-form-urlencoded", $"grant_type=client_credentials&client_id={clientId}&client_secret={clientSecret}", ParameterType.RequestBody);
            //IRestResponse response = client.Execute(request);
        }

        [HttpGet("guild")]
        public IEnumerable<Member> GetGuild(string accessToken)
        {
            var client = new RestClient(blizzHostName);
            var request = new RestRequest(Method.GET);
            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("Authorization", $"Bearer {accessToken}");
            request.AddHeader("Battlenet-Namespace", "profile-us");
            IRestResponse response = client.Execute(request);

            return JsonConvert.DeserializeObject<IEnumerable<Member>>(response.Content);
        }
    }
}
