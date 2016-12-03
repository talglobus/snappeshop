var crypto = require('crypto');

function randomID(len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}

module.exports = (dataURI) => {
	dataURI = "data:image/png;base64," + dataURI;	// Not sure if this format is correct
	let filePath = "./images/" + randomID(24) + ".png";
	imageDataURI.outputFile(dataURI, filePath)
    .then(res => {
    	console.log(res);	// This is what to do with the new file of name "res";
    });
}