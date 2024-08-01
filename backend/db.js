const mysql = require("mysql")

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'R3setNightmare',
    database: 'billy_mock'
});

module.exports = connection;