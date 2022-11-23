const https = require('https');

const badStatusCodes = [400, 403, 404];

exports.requestURL = async (auth, path, postData = null) => new Promise((resolve, reject) => {
  if (auth == null) {
    reject(new Error('NULLAUTH'));
  }

  const options = {
    hostname: '127.0.0.1',
    port: auth.port,
    path,
    method: (postData == null ? 'GET' : 'POST'),
    rejectUnauthorized: false,
    agent: false,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${'riot:'}${auth.password}`).toString('base64')}`,
    },
  };

  console.log(options.method, `${auth.protocol}://${options.hostname}:${options.port}${options.path}`);

  let body = '';

  const req = https.request(options, (res) => {
    // Error code handling
    if (badStatusCodes.indexOf(res.statusCode) > -1) {
      reject(res.statusCode);
    }

    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      resolve(body);
    });
  });

  req.on('error', (error) => {
    reject(error.code);
  });

  if (postData != null) {
    console.log('POSTDATA: ', postData);
    req.write(postData);
  }

  req.end();
});
