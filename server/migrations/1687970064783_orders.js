/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable("users", {
        id: {
            type: "serial",
            primaryKey: true,
            unique: true
        },
        name: {
            type: "varchar(255)",
        },
        email : {
            type: "varchar(255)",
            notNull: true,
        },
        phone : {
            type: "varchar(255)",
            notNull: true,
        },
    });

    pgm.createTable("orders", {
        id: {
            type: "serial",
            primaryKey: true,
            unique: true
        },
        user_id: {
            type: "integer",
            notNull: true,
        },
        products: {
            type: "integer[]",
            notNull: true,
        },
        date: {
            type: "timestamp",
            notNull: true,
        },
        total: {
            type: "integer",
            notNull: true,
        },
        status: {
            type: "integer",
            notNull: true,
        },
        address: {
            type: "text",
            notNull: true,
        },
    });

};

exports.down = pgm => {
    pgm.dropTable("users");
    pgm.dropTable("orders");
};
