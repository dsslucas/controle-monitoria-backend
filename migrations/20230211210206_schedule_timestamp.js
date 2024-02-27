/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('schedule_timestamp', table => {
        table.integer('idSchedule').references('id').inTable('schedule')
        table.string('day').notNull()
        table.string('hour').notNull()
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('schedule_timestamp')
};