const functions = require('firebase-functions')
const moment = require('moment')
const http = require('http')
const admin = require('firebase-admin')
const axios = require('axios')
admin.initializeApp()

// Take the text parameter passed to this HTTP endpoint and insert it into
// Cloud Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Cloud Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection('messages').add({original: original});
  // Send back a message that we've succesfully written the message
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Cloud Firestore.
      const original = snap.data().original;

      // Access the parameter `{documentId}` with `context.params`
      functions.logger.log('Uppercasing', context.params.documentId, original);

      const uppercase = original.toUpperCase();

      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to Cloud Firestore.
      // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
      return snap.ref.set({uppercase}, {merge: true});
    });

exports.updateScores = functions.https.onRequest(async (req, res) => {
    const allScores = []
    const tierMap = {2500: 1, 2000: 2, 1500: 3, 1000: 4, 500: 5, 0: 6}
    const ref = admin.database().ref('characters').orderByChild('score')
    await ref.on('value', function (snapshot) {
      let index = 0
      snapshot.forEach(character => {
        const found = allScores.find(score => score.name == character.key) ? true : false
        if(!found){
          const rank = snapshot.numChildren() - index
          const score = character.val().score
          const roundedScore = Math.floor(score / 500) * 500
          const tier = tierMap[roundedScore] ? tierMap[roundedScore] : 1
          allScores.unshift({ rank, name: character.key, score, tier})
        }
        index += 1
      })
    });
    const result = allScores

    res.json({result})
})

exports.refreshScores = functions.https.onRequest(async (req, res) => {
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
          const newEntry = {score, lastScores}
          admin.database().ref('characters/' + name).set(newEntry)
          console.log(`Set chracters/${name} with ${JSON.stringify(newEntry)}`)
        })
        .catch(err => {
          console.log(`Error updating ${name} : ${err.message}`)
        })
    })
  })
  res.status(200).send('OK')
})
