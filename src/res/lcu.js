const fs = require('fs');
const os = require('os');
const { exec } = require('child_process');

let auth = null;

exports.getAuthFromProcess = async () => {
  // https://github.com/matsjla/league-connect/blob/master/src/authentication.ts
  const portRegex = /--app-port=([0-9]+)/;
  const passwordRegex = /--remoting-auth-token=([\w-_]+)/;
  const pidRegex = /--app-pid=([0-9]+)/;
  return new Promise((resolve, reject) => {
    exec(
      // eslint-disable-next-line max-len
      'Get-CimInstance Win32_Process -Filter "name = \'LeagueClientUx.exe\'" | Select-Object -Property CommandLine | ft -HideTableHeaders | out-string -Width 4096',
      { shell: 'powershell.exe' },
      (error, stdout) => {
        try {
          const pid = stdout.match(pidRegex)[1];
          const password = stdout.match(passwordRegex)[1];
          const port = stdout.match(portRegex)[1];

          resolve({
            name: 'riot',
            protocol: 'https',
            pid,
            port,
            password,
          });
        } catch (e) {
          // Attempt to restore from file..
          fs.readFile(`${os.tmpdir()}/lcuAuth`, 'utf8', (err, data) => {
            try {
              resolve(JSON.parse(data));
            } catch {
              // eslint-disable-next-line prefer-promise-reject-errors
              reject(null);
            }
          });
        }
      },
    );
  });
};

exports.setAuth = function setAuth(val) {
  auth = val;
};

exports.getLCUAuth = async () => {
  if (auth) {
    return auth;
  }
  try {
    auth = await this.getAuthFromProcess();

    // Save auth incase of failure
    fs.writeFileSync(`${os.tmpdir()}/lcuAuth`, JSON.stringify(auth));

    return auth;
  } catch (e) {
    console.log('ERR: Game is not running..');
    return null;
  }
};
