const express = require('express');

const config = require('./config/config.js');

const app = express();

app.post('/login', (req, res) => {
	return res.send({
		"uid":"12312341293r2d938r"
	});
});

app.listen(config.server.port);
