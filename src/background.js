'use strict'

import { app, protocol, BrowserWindow, ipcRenderer } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
const { performance } = require('perf_hooks');
const { ipcMain } = require('electron')
// My exports
const lcu = require('./lcu')
const request = require('./request')

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1150,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// In main process.

function createReply(data, id) {
  try{
    data = JSON.parse(data)
  } catch {
    console.log("Data is already JSON")
  }
  data.reply_type = id
  return data
}

function errorHandler(errorCode, event) {
  console.log("ERRORCODE: ", errorCode)
  errorCode = String(errorCode)
  switch (errorCode) {
    case "ECONNREFUSED":
    case "0": {
      // Auth == NULL
      event.reply('asynchronous-reply', { reply_type: "lcu-disonnceted" })
      break
    }
    case "400": {
      // BAD REQUST

      break
    }
    case "403": {
      // AUTH INVALID / AUTH FAILED
      lcu.setAuth(null)
      break
    }
    case "404": {
      // GOOD REQUEST. BAD RESPONSE
      // e.g. checking lobby status when
      // no lobby exists. Just do nothing..
      break
    }
    default: {
      // Unhadled Error..
      event.reply('asynchronous-reply', { reply_type: "lcu-disonnceted" })
      break;
    }
  }

}


// Used to get PUUID for many differet requests.
function getPlayerDataByName(name, auth) {
  name = name.replace(/\s/g, '')
  return new Promise((resolve, reject) => {
    request.requestURL(
      auth,
      `/lol-summoner/v1/summoners?name=${name}`
    ).then(userData => {
      resolve(JSON.parse(userData))
    })
  })
}

ipcMain.on('asynchronous-message', (event, req) => {
  lcu.getLCUAuth().then(auth => {
    switch (req.id) {
      case "current-summoner": {
        request.requestURL(
          auth,
          "/lol-match-history/v1/products/lol/current-summoner/matches?begIndex=0&endIndex=5"
        ).then((data) => {
          event.reply('asynchronous-reply', createReply(data, req.id))
        }).catch(error => errorHandler(error, event))
        break;
      }
      case "lol-lobby-playercard": {
        request.requestURL(
          auth,
          `/lol-summoner/v1/summoners/${req.summonerId}`
        ).then((data) => {
          getPlayerDataByName(JSON.parse(data).displayName,auth).then((player) => {
            event.reply('asynchronous-reply', createReply(player, req.id))
          })
        }).catch(error => errorHandler(error, event))
        break;
      }

      case "get-auth-token": {
        // Used for keepalive / check the status of auth data
        // because it's a fast request.
        request.requestURL(
          auth,
          "/riotclient/auth-token"
        ).catch(error => errorHandler(error, event))
        break;
      }
      case "lol-champ-select": {
        request.requestURL(
          auth,
          "/lol-champ-select/v1/session"
        ).then((data) => {
          event.reply('asynchronous-reply', createReply(data, req.id))
        }).catch(error => errorHandler(error, event))
        break;
      }
      case "lol-summoner-name": {
        getPlayerDataByName(req.user, auth).then(
          data => event.reply('asynchronous-reply', createReply(data, req.id))
        ).catch(error => errorHandler(error, event))
        break;
      }
      case "lol-ranked-stats": {
        getPlayerDataByName(req.user, auth).then(summoner => {
          request.requestURL(
            auth,
            `/lol-ranked/v1/ranked-stats/${summoner.puuid}`
          ).then(
            (rankData) => {
              rankData = createReply(rankData, req.id)
              rankData.username = summoner.displayName
              event.reply('asynchronous-reply', rankData)
            })
        }).catch(error => errorHandler(error, event))
        break;
      }
      case "lol-match-history": {
        getPlayerDataByName(req.user, auth).then(summoner => {
          request.requestURL(
            auth,
            `/lol-match-history/v1/products/lol/${summoner.puuid}/matches?begIndex=${req.begIndex}&endIndex=${req.endIndex}`
          ).then(
            (matchHistory) => {
              event.reply('asynchronous-reply', createReply(matchHistory, req.id))
            })
        }).catch(error => errorHandler(error, event))
        break;
      }
    }
  })
})

/*
ipcMain.on('synchronous-message', (event, id) => {
  console.log(id) // prints "ping"
  event.returnValue = 'pong'
})
*/