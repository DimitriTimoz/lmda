/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('products', {
        ordered: {
            type: 'boolean',
            default: false,
            notNull: true
        },
    })

};

exports.down = pgm => {
    pgm.dropColumns('products', ['ordered'])
};
