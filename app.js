var fs = require('fs');
var constants = require('constants');
var express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

var https = require('https');
var app = express();
var http = require('http');
var helmet = require('helmet');
var login = require('./login.js');

var waiverOptions = {
    target: 'http://localhost:2612',
    changeOrigin: false,
    pathRewrite: {
        '^/proxy/waiver': ''
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

var fpaOptions = {
	target: 'http://localhost:2336',
	changeOrigin: false,
	pathRewrite: {
		'^/proxy/fpa':''
	},
	xfwd:true
};

var membershipCalc = {
	target: 'http://localhost:5000',
	changeOrigin: false,
	pathRewrite: {
		'^/proxy/membership-calc':''
	},
	xfwd:true
};
/*var serverOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/'+login.site+'/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/'+login.site+'/fullchain.pem'),
    secureProtocol: 'TLSv1_2_method',
    secureOptions: constants.SSL_OP_NO_SSLv3
};*/
app.use(helmet());
/*app.use(function (req, res, next) {
    res.set('Content-Security-Policy', '');
    if (!req.secure) {
//        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    next();
});*/
//app.use('/proxy/waiver', createProxyMiddleware(waiverOptions));
//app.use('/proxy/hnsa', createProxyMiddleware(hnsaOptions));
//app.use('/proxy/hsb', createProxyMiddleware(hsbOptions));
//app.use('/proxy/atb', createProxyMiddleware(atbOptions));
app.use('/proxy/fpa', createProxyMiddleware(fpaOptions));
app.use('/proxy/membership-calc', createProxyMiddleware(membershipCalc));
app.use('/public', express.static('public'))

app.get('/', function (req, res) {
    res.send('Hello World');
});

http.createServer(app).listen(3000);
//https.createServer(serverOptions, app).listen(443);
