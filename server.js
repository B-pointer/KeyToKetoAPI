const express = require('express');
const config = require('./config/config.js');
const auth = require('./controller/auth.js');
const knex = require('./controller/db.js');

const app = express();

app.post('/login', (req, res) => {
	var token = auth.signToken({uid:1234});
	res.json({
		success: true,
		token: token
	});
});

app.get('/profile', auth.checkToken, (req, res) => {
	res.json({
		success: true,
		message: "Profile data here"
	});
});

app.listen(config.server.port);
