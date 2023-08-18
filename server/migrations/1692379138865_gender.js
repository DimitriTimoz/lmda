/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumns('users', {
        gender: {
            type: 'varchar(10)',
            notNull: true,
            default: 'M.'   
        }
    });
};

exports.down = pgm => {
    pgm.dropColumns('users', ["gender"]);

};
