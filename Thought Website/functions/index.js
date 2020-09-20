const functions = require('firebase-functions')
const moment = require('moment')
const http = require('http')
const admin = require('firebase-admin')
const axios = require('axios')
admin.initializeApp()

exports.refreshScores = functions.pubsub.schedule('every 1 hours').onRun((context) => {
// exports.refreshScores = functions.https.onRequest(async (req, res) => {
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
