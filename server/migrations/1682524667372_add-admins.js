/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('admins', {
        id: 'id',
        email: { type: 'varchar(255)', notNull: true, unique: true},
        password: { type: 'varchar(255)', notNull: true },
        date: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
    });
};

exports.down = pgm => {
    pgm.dropTable('admins');
};
