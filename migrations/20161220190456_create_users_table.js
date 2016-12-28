exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
      table.increments('id').unsigned().primary();
      table.string('login').notNull();
      table.string('password').notNull();
      table.string('email').notNull();
      table.integer('rating').notNull();
      table.integer('singlerating').notNull();
      table.integer('status');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};