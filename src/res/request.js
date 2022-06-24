const https = require('https')

const badStatusCodes = [400,403,404]

exports.requestURL = async (auth, path, postData = null) => {
    return new Promise(function (resolve, reject) {

        if(auth == null){
            reject("0")
        }

        const options = {
            hostname: "127.0.0.1",
            port: auth.port,
            path: path,
            method: (postData == null ? "GET" : "POST"),
            rejectUnauthorized: false,
            agent: false,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from("riot" + ":" + auth.password).toString('base64')
            }
        }

        console.log(options.method, `${auth.protocol}://${options.hostname}:${options.port}${options.path}`)

        var body = '';

        const req = https.request(options, (res) => {
            // Error code handling
            if (badStatusCodes.indexOf(res.statusCode) > -1){
                reject(res.statusCode)
            }

            res.on('data', function (chunk) {
                body = body + chunk;
            });

            res.on('end', function () {
                resolve(body)
            })

        });

        req.on('error', error => {
            reject(error.code)
        });

        if(postData != null){
            console.log("POSTDATA: ",postData)
            req.write(postData)
        }

        req.end();
    })
}