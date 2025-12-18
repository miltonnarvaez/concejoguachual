const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'concejo_guachucal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// Probar conexión
pool.getConnection()
  .then(connection => {
    console.log('✅ Conectado a MySQL');
    console.log(`   Base de datos: ${process.env.DB_NAME || 'concejo_guachucal'}`);
    connection.release();
  })
  .catch(err => {
    console.error('❌ Error conectando a la base de datos MySQL:');
    console.error(`   Código: ${err.code || 'DESCONOCIDO'}`);
    console.error(`   Mensaje: ${err.message || 'Sin mensaje'}`);
    console.error('\n📋 Soluciones posibles:');
    console.error('   1. Verifica que MySQL esté instalado y corriendo');
    console.error('   2. Verifica las credenciales en server/.env');
    console.error('   3. Verifica que la base de datos "' + (process.env.DB_NAME || 'concejo_guachucal') + '" exista');
    console.error('   4. Ejecuta: mysql -u root -p < database/schema.sql');
    console.error('\n⚠️  El servidor continuará, pero las funciones de base de datos no estarán disponibles.');
  });

module.exports = pool;
















