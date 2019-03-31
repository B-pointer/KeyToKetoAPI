
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', function(table) {
  	table.increments('uid').primary();
  	table.string('username').notNullable();
  	table.string('password').notNullable();
  	table.date('birthdate').notNullable();
  	table.integer('weight').notNullable();
  	table.integer('height').notNullable();//should this be int? are we storing only inch precision?
  	table.string('email').notNullable();
  	table.enu('gender', ['Male', 'Female']);
  	table.timestamps();
  	table.unique(['username', 'email']);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user');
};
