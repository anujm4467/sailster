const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const proxy = require('express-http-proxy');

const DIST_DIR = path.resolve('./app');

const port = process.env.PORT || 4000;
const API_HOST = 'http://localhost:3000';
const CDN_HOST = 'http://localhost:3000';

console.log(`${__dirname}docs/app`);
console.log(`${__dirname}docs/api`);

// Express
const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const app = express();

const multiparty = require('multiparty');

const sendFile = (filepath, destination, authorizationHeader) => {
  const form = new FormData();

  form.append('file', fs.createReadStream(filepath));

  return new Promise((resolve, reject) => {

    form
      .submit(
        {
          host: 'localhost',
          port: '3000',
          path: `/fba/upload/${destination}`,
          headers: { ...form.getHeaders(), authorization: authorizationHeader }
        },
        (err, res) => {

          fs.unlink(filepath, () => console.log(`deleted uploaded file ${filepath}`));

          if (err) {
            reject(err);
          } else {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(destination);
            } else {
              reject({ statusCode: res.statusCode, message: `failed to upload file ${destination}` });
            }
          }
        });
  })
}

const handleUpload = (req, res) => {
  const destination = req.originalUrl.substring(12);
  const form = new multiparty.Form({ maxFields: 1 });
  const authorizationHeader = req.headers['authorization'];

  if(!authorizationHeader) {
    res.status(401).send('you must be authorized to upload files');
    return;
  }

  let receivedFile;

  form.on('file', (_filekey, file) => {
    receivedFile = file;
  });

  form.on('close', () => {
    // close is emitted when form is parsed
    sendFile(
      receivedFile.path,
      destination,
      authorizationHeader,
    )
      .then((url) => res.send(url))
      .catch(err => {
        res.status(err.statusCode || 500).send(err.message);
      });
  });

  form.on('error', (error) => {
    res.status(500).send(error.message);
  });

  form.parse(req);
}

app
  .use(compression())
  .use(bodyParser.json())
  // HANDLE FILE UPLOAD MANUALLY
  .post('/cdn/upload/*', handleUpload)
  // PROXY API CALLS
  .use('/api', proxy(API_HOST))
  // PROXY CDN CALLS
  .use('/cdn/*', proxy(CDN_HOST, {
    proxyReqPathResolver: (req) => {
      const redirect = req.originalUrl.substring(4);
      return `/fba${redirect}`;
    }
  }))
  // DOCUMENTATION
  .use('/docs/app', express.static(`${DIST_DIR}/../docs/app`))
  .use('/docs/api', express.static(`${DIST_DIR}/../docs/api`))
  // Static content
  .use(express.static(DIST_DIR))
  // for everything else serve index.html
  .use((_req, res) => {
    console.log(`wtf req.path = ${_req.path}`)
    res.sendFile(DIST_DIR + '/index.html');
  })
  // Start server
  .listen(port, () => {
    console.info('Port: ' + port);
    console.info('DIST_DIR: ' + DIST_DIR);
  });
