/**
 * Created by tal on 10/2/16.
 */
var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var dirPrefix = "./web";
var specialServePrefix = "./images";

const search = require('./search.js');

const PORT = process.env.PORT || 8080;

app.get('/', function (req, res) {
	const FILE = dirPrefix + "/index.html";

	res.statusCode = 200;

	var options = {
		root: __dirname,
		dotfiles: 'deny',
		headers: {
			"Content-Type": "text/html",
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};
    
    console.log(req.url);

	res.sendFile(FILE, options, function (err) {
		if (err) {
			// console.log(err);
			res.status(err.status).end();
		}
		else {
			console.log('Sent:', FILE);
			res.end();
		}
	});

	console.log("main");
});

app.get('/imagesearch/:dataURI', (req, res) => {
	res.statusCode = 200;
//
	var options = {
		headers: {
			"Content-Type": "application/json",
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	};
	var dataURI = req.params.dataURI;

	search(dataURI, (responses) => {
		res.send(responses, options);
	});
});

//app.get('/logo.png', function(req, res) {
//
//	const FILE = path.join(__dirname + "/logo.png");
//
//	res.statusCode = 200;
//
//	var options = {
//		root: __dirname,
//		dotfiles: 'deny',
//		headers: {
//			"Content-Type": "image/png",
//			'x-timestamp': Date.now(),
//			'x-sent': true
//		}
//	};
//
//	res.sendFile(FILE, options, function (err) {
//		if (err) {
//			console.log("An error occurred while attempting to serve " + FILE);
//			// console.log(err);
//			res.status(err.status).end();
//		}
//		else {
//			console.log('Sent:' + FILE);
//			res.end();
//		}
//	});
//});
//
app.get('/retrieve/*', function (req, res) {
	allowServeFromDir(req, res, 'png');
});

// app.get('/js/*', function (req, res) {
// 	allowServeFromDir(req, res, 'js');
// });

// app.get('/css/*', function (req, res) {
// 	allowServeFromDir(req, res, 'css');
// });

// app.get('/fonts/*', function (req, res) {
// 	allowServeFromDir(req, res, 'font');
// });

//app.get('/welcome/*', function(req, res) {
//	var phone = req.url.split('/')[2];
//	console.log("New Alert User: " + phone);
//	sendSMS(phone, "Welcome to the BreezyRide alert system. We'll now let you know when you could be traveling more safely, quickly or efficiently.");
//});
//
//app.get('/icon/*', function(req, res) {
//	allowServeFromDir(req, res, '');
//});
//
//app.get('/favicon.ico', function(req, res) {
//	allowServeFromDir(req, res, '')
//});

app.listen(PORT, function () {
	console.log('Example app listening on port ' + PORT + '!');
});

function allowServeFromDir(req, res, type) {
	var headerMIME = "text/html";     // This is a dangerous case, as it leaves html default
	if (type == 'png') {
		headerMIME = "image/png";
	} else if (type == 'js') {
		headerMIME = "application/javascript";
	} else if (type == 'css') {
		headerMIME = "text/css";
	} else if (type == 'font') {
		headerMIME = "application/font-woff";
	} else if (type == '') {
		headerMIME = "";
	}

    console.log(req.url);
	const FILE = specialServePrefix + req.url;

	res.statusCode = 200;

	if (headerMIME) {
		var options = {
			root: __dirname,
			dotfiles: 'deny',
			headers: {
				"Content-Type": headerMIME,
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		};
	} else {
		var options = {
			root: __dirname,
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		};
	}




	res.sendFile(FILE, options, function (err) {
		if (err) {
			console.log("An error occurred while attempting to serve " + FILE);
			// console.log(err);
			res.status(err.status).end();
		}
		else {
			console.log('Sent:' + FILE);
			res.end();
		}
	});
}

function doIfFile(file, cb) {
	fs.stat(file, function fsStat(err, stats) {
		if (err) {
			if (err.code === 'ENOENT') {
				return cb(null, false);
			} else {
				return cb(err);
			}
		}
		return cb(null, stats.isFile());
	});
}