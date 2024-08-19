const mysql = require("mysql2/promise")

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

/* connection.connect(function(err) {
    if(err) throw err;
    connection.query('SELECT * FROM users', function(err, result) {
        if(err) throw err;
        console.log(result);
    })
}); */

module.exports = connection;