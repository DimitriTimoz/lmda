/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('products', {
        specifyCategory: {
            type: 'text',
            default: "",
            notNull: true
        }
    })

};

exports.down = pgm => {
    pgm.dropColumns('products', ['ordered', 'shipped'])
};
