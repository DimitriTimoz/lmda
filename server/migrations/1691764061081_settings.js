/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('settings', {
        id: {
            type: 'serial',
            primaryKey: true,
            unique: true,
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
        },
        value: {
            type: 'varchar(255)',
            notNull: true,
        },
        last_update: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('settings');
};
