const express = require('express');
const config = require('./config/config.js');
const auth = require('./controller/auth.js');
const knex = require('./controller/db.js');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/login', (req, res) => {
	if (!req.body.username || !req.body.password) {
		return res.json({
			success: false,
			message: 'Must submit username and password'
		});
	}
	
	knex('user').where({username: req.body.username}).select('uid', 'password')
	var token = auth.signToken({uid:1234});
	res.json({
		success: true,
		token: token
	});
});

app.get('/profile', auth.checkToken, (req, res) => {
	res.json({
		success: true,
		message: 'Profile data here'
	});
});

app.listen(config.listen, () => {
	console.log('Express listening on ' + config.listen);
});
