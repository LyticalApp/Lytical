const fs = require('fs');

let auth = null;

exports.getLeagueDirectory = async () => {


    //https://github.com/matsjla/league-connect/blob/master/src/authentication.ts
    const portRegex = /--app-port=([0-9]+)/
    const passwordRegex = /--remoting-auth-token=([\w-_]+)/
    const pidRegex = /--app-pid=([0-9]+)/

    const { exec } = require('child_process')
    return new Promise(function (resolve, reject) {
        exec('Get-CimInstance Win32_Process -Filter "name = \'LeagueClientUx.exe\'" | Select-Object -Property CommandLine | ft -HideTableHeaders | out-string -Width 4096',
            { 'shell': 'powershell.exe' }, (error, stdout) => {
                if (error) {
                    reject(error)
                }
                try {

                    const pid = stdout.match(pidRegex)[1]
                    const password = stdout.match(passwordRegex)[1]
                    const port = stdout.match(portRegex)[1]

                    resolve({
                        "name": "riot",
                        "protocol": "https",
                        "pid": pid,
                        "port": port,
                        "password": password,
                    })

                } catch (e) {
                    reject()
                }
            })
    })
}

exports.setAuth = function (d) {
    auth = d
}

exports.getLCUAuth = async () => {
    if (auth) {
        return auth
    }
    try {
        auth = await this.getLeagueDirectory()
        return auth
    } catch (e) {
        console.log("ERR: Game is not running..")
        return null
    }
}
