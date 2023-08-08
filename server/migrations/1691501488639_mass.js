/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    // Add mass column to all products
    pgm.addColumn('products', {
        mass: {
            type: 'integer',
            notNull: true,
            default: 0,
        },
    });

};

exports.down = pgm => {
    pgm.dropColumn('products', 'mass');
};
