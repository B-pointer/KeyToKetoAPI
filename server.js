require('systemd');
require('autoquit');
const config = require('./config/config.js');
const knex = require('./controller/db.js')(config);
const auth = require('./controller/auth.js')(config, knex);
const bodyParser = require('body-parser');
const app = require('express')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

require('./controller/routes.js')(config, knex, auth, app);

const server = require('http').createServer(app);
if (config.autoquit)
	server.autoQuit({timeOut: config.autoquit});
server.listen(config.listen);
