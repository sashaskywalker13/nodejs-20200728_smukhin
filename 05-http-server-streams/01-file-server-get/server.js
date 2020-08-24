const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const urlPath = path.parse(req.url);

  if (urlPath.dir !== urlPath.root) {
    res.statusCode = 400;
    res.end('Uncorrect URL!');
    return;
  }
  const filepath = path.join(__dirname, 'files', pathname);
  switch (req.method) {
    case 'GET':
      fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
          res.statusCode = 404;
          res.end('file not found');
          return;
        }
        const stream = fs.createReadStream(filepath);
        stream.pipe(res);
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
