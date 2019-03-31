const config = require('./config/config.js');

module.exports = {
	client: 'mysql',
	connection: config.database,
	pool: {
		min: 2,
		max: 10
	}
};
