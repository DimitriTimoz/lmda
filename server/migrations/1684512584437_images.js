/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('images', {
        id: 'id',
        author: {
            type: 'varchar(255)',
            notNull: true,
        },
        filename: {
            type: 'varchar(255)',
            notNull: true,
        },
        linked: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('images');
};
