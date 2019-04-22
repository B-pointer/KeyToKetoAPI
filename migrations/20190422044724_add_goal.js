
exports.up = function(knex, Promise) {
	return knex.schema.alterTable('user', function(t) {
		t.integer('calorie_goal');
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.alterTable('user', function(t) {
		t.dropColumn('calorie_goal');
	});
};
