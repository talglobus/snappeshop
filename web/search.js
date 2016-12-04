const crypto = require('crypto');
const jackrabbit = require('jackrabbit');
const imageDataURI = require('image-data-uri');

const ID_APPEND = 'T';

var rabbit = jackrabbit("amqp://mdyelefh:FUT71qDv9s22hi-F2ERasLIh_vYOg2Tw@zebra.rmq.cloudamqp.com/mdyelefh");
var exchange = rabbit.default();
var task = exchange.queue({ name: 'task_queue', durable: true });
var completed = exchange.queue({ name: 'completed_queue', durable: true });

completed.consume(onResults);

var results = {};

function onResults(data, ack) {
	results[ID_APPEND + data.id] = data.return;
	console.log('New Data: ' + data.name + '!');
	ack();
}

function randomID(len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}

function waitForID(id, cb) {	// This function delays until results appear, and "cb"s them
	setTimeout(() => {
		if (results[ID_APPEND + id] === undefined) {
			waitForID(id);
		} else {
			cb(results[ID_APPEND + id]);
		}
	}, 5);
}

module.exports = (dataURI, bigCB) => {
	dataURI = "data:image/png;base64," + dataURI;	// Not sure if this format is correct
	// let key = randomID(24);
	key = "77b80e47ae5f3eb37123591d";
	let filePath = "./images/" + key + ".png";
	imageDataURI.outputFile(dataURI, filePath)
    .then(res => {
    	exchange.publish({ id: key, url: filePath}, { key: 'task_queue' });
		exchange.on('drain', () => {
			console.log("Query " + key + " sent");
			waitForID(key, (results) => {
				bigCB(results);
			});
		});
    });
}