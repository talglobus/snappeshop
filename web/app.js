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

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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

app.get('/imagesearch', (req, res) => {
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
		res.status(200).send("This endpoint only accepts post requests");
	});
});

app.post('/imagesearch', (req, res) => {
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
		res.status(200).send(responses, options);
	});
});

// app.post('/im', (req, res) => {
// 	console.log(req.body);

// 	var options = {
// 		headers: {
// 			"Content-Type": "application/json",
// 			'x-timestamp': Date.now(),
// 			'x-sent': true
// 		}
// 	};

// 	res.status(200).send("fright");
// });

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
app.get('/images/*', function (req, res) {
	// allowServeFromDir(req, res, 'png');

	var options = {
			root: __dirname,
			dotfiles: 'deny',
			headers: {
				"Content-Type": "image/png",
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		};

	res.sendFile("./images/77b80e47ae5f3eb37123591d.png", options, function (err) {
		if (err) {
			console.log("An error occurred while attempting to serve the whims of the people");
			// console.log(err);
			res.status(err.status).end();
		}
		else {
			console.log("Sent the tears of dreams long dead");
			res.end();
		}
	});
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