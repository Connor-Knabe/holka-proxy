var fs = require('fs');
var constants = require('constants');
var express = require('express');
var proxy = require('http-proxy-middleware');
var https = require('https');
var app = express();
var http = require('http');

var waiverOptions = {
    target: 'http://localhost:2612', // target host
    changeOrigin: false,               // needed for virtual hosted sites
    pathRewrite: {
        '^/proxy/waiver' : ''
    }
};
var serverOptions = {
    ca: fs.readFileSync("/root/SmileZone/WebApp/config/ssl/smiiles.ca-bundle"),
    key: fs.readFileSync("/root/SmileZone/WebApp/config/ssl/server.key"),
    cert: fs.readFileSync("/root/SmileZone/WebApp/config/ssl/smiiles.crt"),
    secureProtocol: 'TLSv1_2_method',
	secureOptions: constants.SSL_OP_NO_SSLv3

};
app.use(function(req, res, next) {
	if(!req.secure) {
		return res.redirect(['https://', req.get('Host'), req.url].join(''));
 		}
	next();
});
app.use('/proxy/waiver', proxy(waiverOptions));
app.use('/', proxy({target: 'http://localhost:8080', changeOrigin: false}));
http.createServer(app).listen(80);
https.createServer(serverOptions, app).listen(443);
