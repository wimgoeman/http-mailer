const fs = require('fs');
const {promisify} = require('util');
const readFile = promisify(fs.readFile);
const nodemailer = require('nodemailer');

exports.initTransport = async function(path) {
	let transportFile = await readFile(path, 'utf8');
	console.log(transportFile);
	let transport = nodemailer.createTransport(JSON.parse(transportFile));
	await transport.verify();
	return transport;
}

