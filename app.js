// var express = require('express');
// var proxyMiddle = require('proxy-middleware');

// var app = express();
// var port = process.env.PORT || 80;
// // proxy middleware options
//
// var options = {
//         target: 'google.com', // target host
//         changeOrigin: true,               // needed for virtual hosted sites
//         ws: true ,                        // proxy websockets,
//         secure:true,
//         router: {
//             '/smile' : 'http://localhost:1337',
//             '/waiver'     : 'http://localhost:2612'
//         },
//         ssl : {
//             ca: fs.readFileSync("/root/SmileZone/WebApp/config/ssl/smiiles.ca-bundle"),
//             key: fs.readFileSync("/root/SmileZone/WebApp/config/ssl/server.key"),
//             cert: fs.readFileSync("/root/SmileZone/WebApp/config/ssl/smiiles.crt"),
//             secureProtocol: 'TLSv1_2_method',
//         	secureOptions: constants.SSL_OP_NO_SSLv3
//         }
//     };
//
// app.use('/',proxyMiddle(options));
//
// https.createServer(options.ssl).listen(443);
// // app.listen(80);
//
//
// //
// // app.use(function(req, res, next) {
// //     if(!req.secure) {
// //         return res.redirect(['https://', req.get('Host'), req.url].join(''));
// //     }
// //     next();
// // });

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
