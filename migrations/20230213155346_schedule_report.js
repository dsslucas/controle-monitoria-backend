/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('schedule_report', table => {
        table.integer('idMonitor').references('id').inTable('monitor').notNull()
        table.integer('idStudent').references('id').inTable('user').notNull()
        table.integer('idSchedule').references('id').inTable('schedule').notNull()
        table.datetime('timestamp').notNull()
        table.string('description').notNull()
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('schedule_report')
};
