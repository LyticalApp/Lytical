const fs = require('fs');

let auth = null;

exports.getLeagueDirectory = async () => {
    const { exec } = require('child_process')
    return new Promise(function (resolve, reject) {
        exec('Get-CimInstance Win32_Process -Filter "name = \'LeagueClient.exe\'" | Select-Object -Property CommandLine | ft -HideTableHeaders',
            { 'shell': 'powershell.exe' }, (error, stdout) => {
                if (error) {
                    reject(error)
                }
                let parts = stdout.split('"').filter(v => v != '');
                if (parts.length > 0) {
                    // Get Path of the LeagueClientUx.exe process
                    // example C:/Riot Games/League of Legends/
                    resolve(parts[1].replace("LeagueClient.exe", ""))
                } else {
                    // didn't get a path
                    reject()
                }
            })
    })
}

// Expose auth setter for errors aka lcu needs to reauthenticate
exports.setAuth = function(d){
    auth = d
}

exports.getLCUAuth = async () => {
    if(auth != null){
        //We're already authenticated
        return auth
    }

    let path = null;

    try {
        path = await this.getLeagueDirectory()
    } catch(e){
        console.log("ERR: Game is not running..")
        return null
    }
    
    try {
        //example LeagueClient:3272:55961:x15zkwb3fgovhgzklv4Hqg:https
        let data = fs.readFileSync(path + "lockfile", 'utf8').split(":")
        auth = {
            "name": data[0],
            "pid": data[1],
            "port": data[2],
            "password": data[3],
            "protocol": data[4]
        }
        return auth
    } catch (err) {
        console.log(err)
    }
    return null
}
