/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('schedule', table => {
        table.increments('id').primary()
        table.integer('idStudent').references('id').inTable('user')
        table.integer('idMonitor').references('id').inTable('monitor').notNull()
        table.string('local').notNull()
        table.string('additionalInfo').notNull()
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('schedule')
};
