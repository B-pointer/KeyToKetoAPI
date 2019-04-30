
exports.up = function(knex, Promise) {
	return knex.schema.alterTable('meal', function(t) {
		t.timestamp('consumed_at');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.alterTable('meal', function(t) {
		t.dropColumn('consumed_at');
	});
};
