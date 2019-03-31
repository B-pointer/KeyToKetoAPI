
exports.up = function(knex, Promise) {
  return knex.schema.createTable('meal', function(table) {
  	table.increments('mid').primary();
  	table.integer('uid');
  	table.integer('fid');
  	table.float('servings').notNullable();
  	table.timestamps();
  	table.foreign(['uid', 'fid']).references(['user.uid', 'food.fid']);
  	table.index('uid');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('meal');
};
