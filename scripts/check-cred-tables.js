const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function checkSchema() {
    let config = {};
    try {
        const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
        envFile.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) config[key.trim()] = value.trim();
        });
    } catch (e) {
        console.error("Error reading .env.local:", e);
        return;
    }

    const connection = await mysql.createConnection({
        host: config.DB_HOST,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_NAME
    });

    const tables = ['tbl_credenciales', 'tbl_cliente_credencial', 'tbl_plataforma'];
    
    for (const table of tables) {
        console.log(`\n--- ${table} structure ---`);
        try {
            const [rows] = await connection.execute(`DESCRIBE ${table}`);
            console.table(rows);
        } catch (e) {
            console.error(`Error describing ${table}:`, e.message);
        }
    }

    await connection.end();
}

checkSchema();
