// Carga las variables del archivo .env en process.env
require('dotenv').config();

// Usamos la versión con promesas para poder usar async/await
const mysql = require('mysql2/promise');

// Un "pool" mantiene varias conexiones abiertas y las reutiliza.
// Es más eficiente que abrir y cerrar una conexión en cada petición.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // si todas están ocupadas, espera en cola
  connectionLimit: 10,      // máximo de conexiones simultáneas
  decimalNumbers: true      // devuelve DECIMAL como número (150.5) y no como texto ("150.50")
});

module.exports = pool;