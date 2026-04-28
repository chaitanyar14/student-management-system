const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDB() {
  try {
    console.log('Connecting to MySQL to initialize database...');
    // Connect without specifying the database first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    console.log('Connected successfully. Reading schema.sql...');
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split statements by semicolon
    const statements = schemaSql.split(';').map(s => s.trim()).filter(s => s.length > 0);

    for (let statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      await connection.query(statement);
    }

    console.log('Database and tables created successfully!');
    await connection.end();
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDB();
