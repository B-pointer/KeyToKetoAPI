
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.alterTable('food', function(t) {
			t.dropColumn('sugar');
			t.dropColumn('sodium');
			t.string('servingsize').notNullable().alter();
		}),
		knex.schema.alterTable('user', function(t) {
			t.dropColumn('consumed_at');
		})
	]);
};

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.alterTable('food', function(t) {
  			t.float('sugar').notNullable();
  			t.float('sodium').notNullable();
  			t.float('servingsize').notNullable().alter();
		}),
		knex.schema.alterTable('user', function(t) {
			t.timestamp('consumed_at');
		})
	]);
};
