const mysql = require("mysql2/promise");

const checkPayloadWithResponse = (payload, response) => {
    for (const property in payload) {
        console.log('for the property '+ property);
        console.log(payload[property]);
        console.log(response[property]);
        if(payload[property] != response[property]) return false;
    }
    return true;
}

const clearTable = async(name) => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    await connection.execute('DELETE FROM ' + name);
}

module.exports = {checkPayloadWithResponse, clearTable};