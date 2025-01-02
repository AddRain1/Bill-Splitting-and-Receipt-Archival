// helper function to check if given var is a date obj
function _isDate(date){
    return date instanceof Date && !isNaN(date);
}

/**
 * Generates string based on current time in the form YYYYMMDDHHMMSS
 *
 * @param   date Date object
 * @returns string 
 */
function _date_to_string(date){
    if(_isDate(date)){
        const year = date.getUTCFullYear();
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const day = date.getUTCDate().toString().padStart(2, '0');
        const hour = date.getUTCHours().toString().padStart(2, '0');
        const minute = date.getUTCMinutes().toString().padStart(2, '0');
        const second = date.getUTCSeconds().toString().padStart(2, '0');
        const hash = `${year}${month}${day}${hour}${minute}${second}`;
        //2024-07-15::00:00:00 will look like 20240715000000
        return hash;
    }
    else{
        throw new Error(`Invalid date: ${date}`);
    }
}

module.exports = {_isDate, _date_to_string};