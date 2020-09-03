import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class LogsDatabaseService {

  constructor() { }

  async addLog(raidName, difficulty, logDate, logUrl) {
    try {
      firebase.database().ref('logs/' + raidName + '/' + logDate).set({
        difficulty: [difficulty],
        logDate: [logDate],
        logUrl: [logUrl]
      });
    } catch (e) {
      if (e.status === 400) {
        throw new Error(`Log could not be added.`)
      }
      throw e
    }
  }

  // Get all logs from database
  async getAllLogs() {
    const allLogs = []
    const ref = firebase.database().ref('logs/')
    await ref.on('value', function (snapshot) {
      snapshot.forEach(logs => {
        logs.forEach(log => {
          allLogs.push({ raidName: logs.key, difficulty: log.val().difficulty, logDate: log.val().logDate, logUrl: log.val().logUrl })
        })
      })
    });
    return allLogs;
  }
}
