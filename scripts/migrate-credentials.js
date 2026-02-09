const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function migrate() {
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

    try {
        console.log('Adding cliente_id column to tbl_credenciales...');
        
        // Check if column exists
        const [columns] = await connection.execute(
            "SHOW COLUMNS FROM tbl_credenciales LIKE 'cliente_id'"
        );

        if (columns.length === 0) {
            await connection.execute(`
                ALTER TABLE tbl_credenciales 
                ADD COLUMN cliente_id INT NULL AFTER plataforma_id,
                ADD CONSTRAINT fk_cred_cliente FOREIGN KEY (cliente_id) REFERENCES tbl_cliente(cliente_id) ON DELETE CASCADE
            `);
            console.log('Column added successfully.');
        } else {
            console.log('Column cliente_id already exists.');
        }

    } catch (e) {
        console.error('Migration failed:', e.message);
    } finally {
        await connection.end();
    }
}

migrate();
