
exports.up = function(knex, Promise) {
  return knex.schema.createTable('food', function(table) {
  	table.increments('fid').primary();
  	table.integer('uid');//might be null, foreign key?
  	table.string('name').notNullable();
  	table.float('servingsize').notNullable();
  	table.enu('servingtype', ['volume', 'mass']);
  	table.float('calories').notNullable();
  	table.float('carbohydrates').notNullable();
  	table.float('proteins').notNullable();
  	table.float('fats').notNullable();
  	table.float('sugar').notNullable();//do we need this in addition to carbs?
  	table.float('sodium').notNullable();
  	table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('food');
};
