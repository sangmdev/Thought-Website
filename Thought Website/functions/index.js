const functions = require('firebase-functions')
const express = require('express');
const cors = require('cors')({origin: true});

const moment = require('moment')
const http = require('http')
const admin = require('firebase-admin')
const axios = require('axios')
var querystring = require('querystring');
admin.initializeApp(functions.config().firebase)
const app = express();
app.use(cors);
blizzHostName = "https://us.api.blizzard.com"

exports.refreshScores = functions.pubsub.schedule('every 1 hours').onRun((context) => {
  const currentDate = moment().format('L')
  const result = []
  const ref = admin.database().ref('characters')
   ref.once('value',  snapshot => {
     snapshot.forEach(character => {
      const name = character.key
      var lastScores = character.val().lastScores
      if(!lastScores.find(score => score.date === currentDate)){
        lastScores.push({score:character.val().score, date: currentDate})
      }
      const url = `http://raider.io/api/v1/characters/profile?region=us&realm=sargeras&name=${name}&fields=mythic_plus_scores_by_season%3Acurrent`
      const res = axios.get(url)
        .then(res => {
          const score = res.data.mythic_plus_scores_by_season[0].scores.all
          const char_class = res.data.class
          const spec = res.data.active_spec_name
          const newEntry = {score, lastScores, char_class, spec}
          admin.database().ref('characters/' + name).set(newEntry)
          functions.logger.log(`Set chracters/${name} with ${JSON.stringify(newEntry)}`)
        })
        .catch(err => {
          functions.logger.error(`Error updating ${name} : ${err.message}`)
        })
    })
  })
  return null
})

getAccessToken = async () => {
  const auth = {username: functions.config().blizzapi.clientid, password: functions.config().blizzapi.clientsecret}
  let result = ''
  const headers = {
    "Content-Type" : "application/x-www-form-urlencoded",
    "Accept": "*/*",
  }
  const body = querystring.stringify({'grant_type':'client_credentials'})
  return axios.post("https://us.battle.net/oauth/token", body, {headers, auth})
    .then( response => {
      return response.data.access_token
    })
    .catch(error => {
      return error
    })
}

exports.getGuildRoster = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*")
  res.set("Access-Control-Allow-Methods", "GET")
  res.set("Access-Control-Allow-Headers", "Content-Type")
  if (req.method == 'OPTIONS') {
    res.status(204).send('');
  }
  const url = blizzHostName + "/data/wow/guild/sargeras/thought/roster"
  var accessToken = await getAccessToken()
  if(!accessToken) throw new functions.https.HttpsError('No access token found')
  const headers = {
    "Authorization" : `Bearer ${accessToken}`,
    "Content-Type" : "application/json",
    "Battlenet-Namespace" : "profile-us",
  }
  let response_data
  axios.get(url, {headers})
    .then(response => {
      response_data = response.data
      functions.logger.log(`Successfully retrived data`)

    })
    .catch(err => {
      response_data = err
    })
    .finally(() => {
      res.json(response_data)
      res.end();
    })
})

exports.getCharacterRender = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*")
  res.set("Access-Control-Allow-Methods", "GET")
  res.set("Access-Control-Allow-Headers", "Content-Type")
  if (req.method == 'OPTIONS') {
    res.status(204).send('');
  }
  var accessToken = await getAccessToken()
  if(!accessToken) throw new functions.https.HttpsError('No access token found')

  const charName = req.query.charName
  const url = blizzHostName + `/profile/wow/character/sargeras/${charName}/character-media`
  const headers = {
    'Authorization' : `Bearer ${accessToken}`,
    "Content-Type" : "application/json",
    "Battlenet-Namespace" : "profile-us"
  }
  let response_data
  axios.get(url, {headers})
    .then(response => {
      response_data = response.data
    })
    .catch(err => {
      response_data = err
    })
    .finally(() => {
      res.json(response_data)
    })
})
