const mysql = require('mysql2/promise');
require('dotenv').config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,  
//   user: process.env.DB_USER,  
//   password: process.env.DB_PASSWORD,  
//   database: process.env.DB_NAME,  
//   port: process.env.DB_PORT || 3306,  
// });

const db = mysql.createConnection({
  host: process.env.MYSQLHOST || 'mysql.railway.internal',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'BsaIjRsAfwedshNlakAdRlCZujjAHcnP',
  database: process.env.MYSQLDATABASE || 'railway',
  port: process.env.MYSQLPORT || 3306,
});

module.exports = pool;
