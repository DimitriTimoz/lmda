/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('orders', {
        exp_number: {
            type: 'integer',
            notNull: false,
        },
    });
};

exports.down = pgm => {
    pgm.dropColumns('orders', 'exp_number');
};
