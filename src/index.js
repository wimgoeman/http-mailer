const express = require('express');
const {initTransport} = require('./transport');


let path = process.env.MAILER_SETTINGS_PATH;
let username = process.env.MAILER_USERNAME;
let password = process.env.MAILER_PASSWORD;
let authEnabled = process.env.MAILER_AUTH;
authEnabled = authEnabled.toUpperCase() === 'TRUE';
console.log(`=== http-mailer starting ===`);
console.log(`Settings path: ${path}`);
console.log(`Username: ${username}`);
console.log(`Password: ${password}`);
console.log(`Authentication enabled: ${authEnabled}`);

async function bootstrap() {
	const transport = await initTransport(path);
	const server = express();
	server.use(express.json({strict: false}));
	server.post('/mail', async (req, res) => {
		if (authEnabled) {
			let auth = req.get('authorization');
			if  (!auth) {
				res.set('WWW-Authenticate', 'Basic realm="Authorization Required"');
				res.status(401).json({err: 'Authorization Required'});
				return;
			}

			var credentials = new Buffer(auth.split(' ').pop(), 'base64').toString('ascii').split(':');
		    if (credentials[0] !== username || credentials[1] !== password) {
				res.status(403).json({err: 'Access denied'});
				return;
		    }
		}

		if (!req.body || !req.body.message) {
			res.status(400).json({err: 'Bad request'});
			return;
		}

		try {
			await transport.sendMail(req.body.message);
			console.log(`Mail sent: ${req.body.message.from} --> ${req.body.message.to}`);
		} catch (err) {
			console.error('Failed to send mail!');
			console.log(err);
			res.status(500).json({err: 'Failed to send mail'});
		}
		res.status(200).json({});
	});

	server.listen(8025, () => console.log('HTTP service listening on port 8025'));
}

try {
	bootstrap();
} catch (err) {
	console.error('Error during bootstrap!');
	console.log(err);
}
