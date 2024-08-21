const mysql = require("mysql2/promise");

const checkPayloadWithResponse = (payload, response) => {
    const exempt_properties = ['password'];
    for (const property in payload) {
        if(exempt_properties.includes(property)) continue;
        else if(payload[property] != response[property]) return false;
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


    if(name === 'receipts'){
        // delete expense_rate entries that reference the receipt
        await connection.execute(`DELETE FROM expense_rate WHERE receipt_id IN (SELECT receipt_id FROM receipts)`); 
    
    }

    await connection.execute('DELETE FROM ' + name);
}

module.exports = {checkPayloadWithResponse, clearTable};