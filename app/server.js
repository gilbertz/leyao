#!/usr/bin/env node

var express = require('express');
var app = express();

app.use(require('compression')());

// var proxy = require('http-proxy').createProxyServer();
// proxy.on('error', function (err, req, res) {
//   res.writeHead(502, {
//     'Content-Type': 'text/plain'
//   });
//   res.end('The remote API server is down.');
// });

// app.use('/auth/', function (req, res) {
//   proxy.web(req, res, {target: 'http://127.0.0.1:3000/auth/'});
// });
// app.use('/api/', function (req, res) {
//   proxy.web(req, res, {target: 'http://127.0.0.1:3000/franky/api/v2/'});
// });


['bower_components','images','scripts','styles','views'].forEach(function (dir) {
  app.use('/' + dir, express.static('./' + dir));
});

app.use('/', function (req, res, next) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  res.sendFile('./index.html', {root: __dirname});
});

exports.app = app;
exports.listen = function (port, address) {
  port = port || process.env.PORT || process.env.VMC_APP_PORT || 9001;
  address = address || '127.0.0.1'
  var server = require('http').createServer(app);
  server.listen(port, address, function () {
    console.log('[leyao] Server listening on http://%s:%s/',
                server.address().address,
                server.address().port);
  });
};

if (!module.parent) {
  exports.listen(parseInt(process.argv[2]), process.argv[3]);
}