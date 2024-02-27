/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('monitor', table => {
        table.integer('id').primary().unique()
        table.string('name').notNull()
        table.string('telephone')
        table.datetime('birthDate').notNull()
        table.integer('age').notNull()
        table.string('discipline').notNull()
        table.string('class').notNull()
        table.string('course').notNull()
        table.boolean('quotaHolder').notNull()
        table.string('gender').notNull()
        table.string('email').notNull().unique()
        table.string('password').notNull()
        table.string('role').notNull()
        table.string('photo')
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('monitor')
};
