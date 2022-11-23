import {
  app, protocol, Menu, BrowserWindow,
} from 'electron';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
// eslint-disable-next-line import/no-extraneous-dependencies
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';

const Store = require('electron-store');

const store = new Store();

const isDevelopment = process.env.NODE_ENV !== 'production';
const { ipcMain } = require('electron');

// My exports
const lcu = require('./res/lcu');
const request = require('./res/request');

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

let win;
const puuidStore = {};
const asyncReply = 'asynchronous-reply';

const MATCH_HISTORY_V1 = '/lol-match-history/v1/products/lol/';
const RANKED_STATS_V1 = '/lol-ranked/v1/ranked-stats/';

async function createWindow() {
  // Create the browser window.
  const options = {
    show: false,
    width: 1200,
    height: 650,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: './public/favicon.ico',
  };
  Object.assign(options, store.get('winBounds'));
  win = new BrowserWindow(options);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
  win.on('close', () => {
    store.set('winBounds', win.getBounds());
    win.destroy();
  });
}

Menu.setApplicationMenu(null);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this e occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS3_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }

  createWindow();
  // eslint-disable-next-line global-require
  if (require('electron-squirrel-startup')) return;
  // eslint-disable-next-line global-require
  require('update-electron-app')();
  win.once('ready-to-show', win.show);
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// In main process.

function createReply(dataD, id) {
  let reply = {};
  try {
    reply = JSON.parse(dataD);
  } catch {
    reply = dataD;
  }
  reply.reply_type = id;
  return reply;
}

function errorHandler(errorCode, e, req) {
  console.log('ERRORCODE: ', errorCode);
  switch (String(errorCode)) {
    case '400':
    case '404': {
      // GOOD REQUEST. BAD RESPONSE
      // e.g. checking lobby status when
      // no lobby exists. Just do nothing..
      e.reply(asyncReply, { reply_type: 'lcu-reconnected' });
      break;
    }
    case 'ECONNREFUSED':
    case '403':
    case '0':
    default: {
      if (req.id === 'liveclientdata-playerlist') {
        // Allow polling for live game can refuse connection
        break;
      }
      // Unhadled Error..
      lcu.setAuth(null);
      e.reply(asyncReply, { reply_type: 'lcu-disonnceted' });
      break;
    }
  }
}

// Used to get PUUID for many differet requests.
async function getSummonerByName(name, auth) {
  const summonerName = encodeURI(name.replace(/\s/g, ''));
  if (puuidStore[name]) {
    return new Promise((resolve) => {
      resolve(puuidStore[name]);
    });
  }
  return new Promise((resolve, reject) => {
    request.requestURL(
      auth,
      `/lol-summoner/v1/summoners?name=${summonerName}`,
    ).then((summoner) => {
      puuidStore[name] = JSON.parse(summoner);
      resolve(puuidStore[name]);
    }).catch((error) => { reject(error); });
  });
}

async function getSummonerById(id, auth) {
  if (puuidStore[id]) {
    return new Promise((resolve) => {
      resolve(puuidStore[id]);
    });
  }
  return new Promise((resolve, reject) => {
    request.requestURL(
      auth,
      `/lol-summoner/v1/summoners/${id}`,
    ).then((summoner) => {
      puuidStore[id] = JSON.parse(summoner);
      resolve(puuidStore[id]);
    }).catch((error) => { reject(error); });
  });
}

const clearProfile = (e) => {
  e.reply(asyncReply, createReply({}, 'clear-profile'));
};

const reqURL = async (auth, url) => JSON.parse(
  await request.requestURL(auth, url),
);

async function getSummonerCurrent(auth) {
  if (puuidStore['summoner.current']) {
    return new Promise((resolve) => {
      resolve(puuidStore['summoner.current']);
    });
  }
  return new Promise((resolve, reject) => {
    request.requestURL(
      auth,
      '/lol-summoner/v1/current-summoner',
    ).then((summoner) => {
      puuidStore['summoner.current'] = JSON.parse(summoner);
      resolve(puuidStore['summoner.current']);
    }).catch((error) => { reject(error); });
  });
}

ipcMain.on('asynchronous-message', (e, req) => {
  console.log('NEW REQUEST: ', req);

  // ipc required requests for debug/versioning
  switch (req.id) {
    case 'openDevTools': {
      win.webContents.openDevTools();
      return;
    }
    case 'getVersion': {
      e.reply(asyncReply, { reply_type: 'appVersion', version: app.getVersion() });
      return;
    }
    case 'scaleUp': {
      win.webContents.setZoomFactor(win.webContents.getZoomFactor() + 0.1);
      return;
    }
    case 'scaleDown': {
      win.webContents.setZoomFactor(win.webContents.getZoomFactor() - 0.1);
      return;
    }
    case 'getRunLevel': {
      e.reply(asyncReply, { reply_type: 'runLevel', isAdmin: lcu.getRunLevel() });
      return;
    }
    default: {
      break;
    }
  }

  // LCU related Requests
  // eslint-disable-next-line func-names
  lcu.getLCUAuth().then(async (auth) => {
    try {
      switch (req.id) {
        case 'liveclientdata-playerlist': {
          const config = {
            protocol: 'https',
            port: 2999,
          };
          e.reply(
            asyncReply,
            createReply(await request.requestURL(config, '/liveclientdata/playerlist'), req.id),
          );
          break;
        }
        case 'lol-lobby-playercard': {
          const summoner = await getSummonerById(req.summonerId, auth);
          const response = await reqURL(auth, `${RANKED_STATS_V1}${summoner.puuid}`);
          response.matchHistory = await reqURL(
            auth,
            `${MATCH_HISTORY_V1}${summoner.puuid}/matches?begIndex=0&endIndex=9`,
          );
          response.username = summoner.displayName;
          response.teamId = req.teamId;
          response.position = req.pos.toUpperCase();
          e.reply(asyncReply, createReply(response, req.id));
          break;
        }
        case 'lol-match-playercard': {
          const summoner = await getSummonerByName(req.summonerName, auth);
          const response = await reqURL(auth, `${RANKED_STATS_V1}${summoner.puuid}`);

          response.matchHistory = await reqURL(
            auth,
            `${MATCH_HISTORY_V1}${summoner.puuid}/matches?begIndex=0&endIndex=9`,
          );

          response.username = summoner.displayName;
          response.teamId = req.teamId;
          response.championId = req.championId;
          response.position = req.position.toUpperCase();
          e.reply(asyncReply, createReply(response, req.id));
          break;
        }
        case 'lol-champ-select': {
          e.reply(asyncReply, createReply(await reqURL(auth, '/lol-champ-select/v1/session'), req.id));
          break;
        }
        case 'lol-match-history-current': {
          e.reply(
            asyncReply,
            createReply(await reqURL(
              auth,
              `${MATCH_HISTORY_V1}current-summoner/matches?begIndex=${req.begIndex}&endIndex=${req.endIndex}`,
            ), req.id),
          );
          break;
        }
        case 'lol-match-history': {
          const summoner = await getSummonerByName(req.user, auth);
          e.reply(
            asyncReply,
            createReply(await reqURL(
              auth,
              `${MATCH_HISTORY_V1}${summoner.puuid}/matches?begIndex=${req.begIndex}&endIndex=${req.endIndex}`,
            ), req.id),
          );
          break;
        }
        case 'lol-match-details': {
          e.reply(asyncReply, createReply(await reqURL(auth, `/lol-match-history/v1/games/${req.gameId}`), req.id));
          break;
        }
        case 'lol-ranked-stats-current': {
          clearProfile(e);
          const summoner = await getSummonerCurrent(auth);
          const response = await reqURL(auth, '/lol-ranked/v1/current-ranked-stats');
          response.summonerData = summoner;
          response.username = summoner.displayName;
          e.reply(asyncReply, createReply(response, req.id));
          break;
        }
        case 'lol-ranked-stats': {
          const summoner = await getSummonerByName(req.user, auth);
          const response = await reqURL(auth, `${RANKED_STATS_V1}${summoner.puuid}`);
          response.summonerData = summoner;
          response.username = summoner.displayName;
          e.reply(asyncReply, createReply(response, req.id));
          break;
        }
        case 'lol-ranked-stats-match-details': {
          const summoner = await getSummonerByName(req.user, auth);
          const response = await reqURL(auth, `${RANKED_STATS_V1}${summoner.puuid}`);
          response.summonerData = summoner;
          response.username = summoner.displayName;
          response.index = req.index;
          response.gameId = req.gameId;
          e.reply(asyncReply, createReply(response, req.id));
          break;
        }
        case 'lol-full-ranked-history-current': {
          const summoner = await getSummonerCurrent(auth);
          const matchHistory = await reqURL(
            auth,
            `${MATCH_HISTORY_V1}${summoner.puuid}/matches?begIndex=0&endIndex=200`,
          );
          e.reply(asyncReply, createReply(matchHistory, req.id));
          break;
        }
        case 'lol-full-ranked-history': {
          const summoner = await getSummonerByName(req.user, auth);
          const matchHistory = await request.requestURL(
            auth,
            `${MATCH_HISTORY_V1}${summoner.puuid}/matches?begIndex=0&endIndex=200`,
          );
          e.reply(
            asyncReply,
            createReply(matchHistory, req.id),
          );
          break;
        }
        default: {
          e.reply(asyncReply, createReply(null, req.id));
        }
      }
    } catch (error) {
      errorHandler(error, e, req);
    }
  });
});
