/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('products', {
        specifyCategory: {
            type: 'text',
            default: 'none',
            notNull: false,
        },
    });
};

exports.down = pgm => {
    pgm.dropColumns('products', 'specifyCategory');
};
