exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('food').del()
    .then(function () {
      // Inserts seed entries
      return knex('food').insert(require('../data/foods.js'));
    });
};
