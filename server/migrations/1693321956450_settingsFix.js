/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.dropTable('settings');
    pgm.createTable('settings', {
        id: {
            type: 'serial',
            primaryKey: true,
            unique: true,
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
            unique: true,
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

exports.down = pgm => {};
