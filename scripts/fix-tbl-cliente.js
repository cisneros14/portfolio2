
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const envPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) process.env[key] = value;
        }
      });
    }
  }
}

async function fixTable() {
  let connection;
  try {
    loadEnv();
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Altering tbl_cliente...');
    
    // Add cliente_identificacion if not exists
    const [cols] = await connection.execute('DESCRIBE tbl_cliente');
    const hasIdentificacion = cols.some(c => c.Field === 'cliente_identificacion');
    
    if (!hasIdentificacion) {
        await connection.execute('ALTER TABLE tbl_cliente ADD COLUMN cliente_identificacion VARCHAR(20) AFTER cliente_empresa');
        console.log('Added cliente_identificacion');
    }

    // Update cliente_estado to include 'lead'
    await connection.execute("ALTER TABLE tbl_cliente MODIFY COLUMN cliente_estado ENUM('activo', 'inactivo', 'lead') DEFAULT 'activo'");
    console.log('Updated cliente_estado enum');

    console.log('Table tbl_cliente fixed.');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) await connection.end();
  }
}

fixTable();
