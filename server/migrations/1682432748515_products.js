/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('products', {
        id: {
            type: 'serial',
            primaryKey: true,
            unique: true,
        },
        name: {
            type: 'varchar(255)',
            notNull: true,
        },
        description: {
            type: 'text',
            notNull: true,
        },
        prices: {
            type: 'integer[]',
            notNull: true,
        },
        size: { 
            type: 'varchar(255)',
            notNull: true,
        },
        kind: {
            type: 'varchar(255)',
            notNull: true,
        },
        state: {
            type: 'integer',
            notNull: true,
        },
        photos: {
            type: 'varchar(255)[]',
            notNull: true,
        },
        date: {
            type: 'timestamp',
            notNull: true,
        },
  });
};
  exports.down = (pgm) => {
    pgm.dropTable('products');
  };
  