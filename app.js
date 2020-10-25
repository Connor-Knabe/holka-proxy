var fs = require('fs');
var constants = require('constants');
var express = require('express');
var proxy = require('http-proxy-middleware');
var https = require('https');
var app = express();
var http = require('http');
var helmet = require('helmet');
var waiverOptions = {
    target: 'http://localhost:2612',
    changeOrigin: false,
    pathRewrite: {
        '^/proxy/waiver': ''
    },
	xfwd:true
};

var fbookWebhookOptions = {
    target: 'http://localhost:1333',
    changeOrigin: false,
    pathRewrite: {
        '^/proxy/fbook': ''
    },
	xfwd:true
};

var hnsaOptions = {
    target: 'http://localhost:2334',
    changeOrigin: false,
    pathRewrite: {
        '^/proxy/hnsa': ''
    },
	xfwd:true
};

var hsbOptions = {
    target: 'http://localhost:3333',
    changeOrigin: false,
    pathRewrite: {
        '^/proxy/hsb': ''
    },
	xfwd:true
};

var atbOptions = {
	target: 'http://localhost:2350',
	changeOrigin: false,
	pathRewrite: {
		'^/proxy/atb':''
	},
	xfwd:true
};

var serverOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/smiil.es/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/smiil.es/fullchain.pem'),
    secureProtocol: 'TLSv1_2_method',
    secureOptions: constants.SSL_OP_NO_SSLv3
};
app.use(helmet());
app.use(function (req, res, next) {
    if (!req.secure) {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    next();
});
app.use('/proxy/waiver', proxy(waiverOptions));
app.use('/proxy/fbook', proxy(fbookWebhookOptions));
app.use('/proxy/hnsa', proxy(hnsaOptions));
app.use('/proxy/hsb', proxy(hsbOptions));
app.use('/proxy/atb', proxy(atbOptions));
app.use('/', proxy({ target: 'http://localhost:8080', changeOrigin: false }));
http.createServer(app).listen(80);
https.createServer(serverOptions, app).listen(443);
