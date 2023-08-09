/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    // insert paid status
    pgm.addColumn('orders', {
        paid: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
    });

    pgm.addColumn('orders', {
        payment_intent_id: {
            type: 'text',
            notNull: true,
            default: '',
        },
    });
};

exports.down = pgm => {
    pgm.dropColumn('orders', 'paid');
    pgm.dropColumn('orders', 'payment_intent_id');
};
