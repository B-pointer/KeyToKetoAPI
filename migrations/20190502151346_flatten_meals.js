
exports.up = function(knex, Promise) {
  	return Promise.all([
  		knex('food').truncate(),
  		knex('meal').truncate(),
		knex.schema.alterTable('food', function(t) {
			t.dropColumn('uid');
			t.dropTimestamps();
		}),
		knex.schema.alterTable('meal', function(t) {
			//t.dropForeign('fid');
			t.dropColumn('fid');
			t.string('name').notNullable();
			t.float('calories').notNullable();
  			t.float('carbohydrates').notNullable();
  			t.float('proteins').notNullable();
  			t.float('fats').notNullable();
		})
	]);
};

exports.down = function(knex, Promise) {
  
};
