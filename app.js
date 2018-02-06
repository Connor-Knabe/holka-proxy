var fs = require('fs');
var constants = require('constants');
var express = require('express');
var proxy = require('http-proxy-middleware');
var https = require('https');
var app = express();
var http = require('http');
require('./certbotrenew.js')();
var waiverOptions = {
    target: 'http://localhost:2612',
    changeOrigin: false,
    pathRewrite: {
        '^/proxy/waiver': ''
    }
};

var fbookWebhookOptions = {
    target: 'http://localhost:1333',
    changeOrigin: false,
    pathRewrite: {
        '^/proxy/fbook': ''
    }
};

var gekkoWebhookOptions = {
    target: 'http://localhost:3000',
    changeOrigin: false,
    pathRewrite: {
        '^/proxy/gekko': ''
    },
    auth: 'test:test'
};

var serverOptions = {
    // ca: fs.readFileSync('/root/SmileZone/WebApp/config/ssl/smiiles.ca-bundle'),
    key: fs.readFileSync('/etc/letsencrypt/live/smiil.es/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/smiil.es/fullchain.pem'),
    secureProtocol: 'TLSv1_2_method',
    secureOptions: constants.SSL_OP_NO_SSLv3
};
app.use(function (req, res, next) {
    if (!req.secure) {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    next();
});
app.use('/proxy/waiver', proxy(waiverOptions));
app.use('/proxy/fbook', proxy(fbookWebhookOptions));
app.use('/', proxy({ target: 'http://localhost:8080', changeOrigin: false }));
http.createServer(app).listen(80);
https.createServer(serverOptions, app).listen(443);
