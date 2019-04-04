module.exports = function (config) {
	return require('knex')({
  		client: 'mysql',
  		connection: config.database
	});
};
