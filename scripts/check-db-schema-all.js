
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

async function checkTables() {
  let connection;
  try {
    loadEnv();
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const tables = ['tbl_plataformas', 'tbl_credenciales', 'tbl_cliente_credenciales', 'tbl_numeros', 'tbl_correos', 'tbl_notas'];
    for(const table of tables) {
        console.log(`--- ${table} structure ---`);
        try {
            const [columns] = await connection.execute(`DESCRIBE ${table}`);
            console.table(columns);
        } catch (e) {
            console.log(`${table} does not exist or error: ${e.message}`);
        }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) await connection.end();
  }
}

checkTables();
