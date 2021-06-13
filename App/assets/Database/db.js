const knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: "./DbEditor.sqlite",
    },
    useNullAsDefault : true,
});
module.exports = knex;