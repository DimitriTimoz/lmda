/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('orders', {
        delivery: {
            type: 'jsonb',
            notNull: true,
        }
    });

};

exports.down = pgm => {
    pgm.dropColumns('orders', ['delivery']);
};
