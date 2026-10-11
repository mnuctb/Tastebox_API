const mysql = require("mysql2/promise");
const config = require("../env/config");

const pool = mysql.createPool({ ...config.database, dateStrings: true });

module.exports = pool;
