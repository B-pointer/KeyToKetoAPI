
exports.up = function(knex, Promise) {
	return knex.schema.alterTable('user', function(t) {
		t.timestamp('consumed_at');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.alterTable('user', function(t) {
		t.dropColumn('consumed_at');
	});
};
