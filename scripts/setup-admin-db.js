
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

// Helper to load env vars manually
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
          const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
          if (!process.env[key]) {
             process.env[key] = value;
          }
        }
      });
    }
  }
}

async function setupDatabase() {
  let connection;
  try {
    loadEnv();

    console.log('Connecting to database...');

    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
        throw new Error('Missing database credentials in .env or .env.local');
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Connected! Creating tables...');

    const queries = [
      `CREATE TABLE IF NOT EXISTS tbl_cliente (
          cliente_id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(150) NOT NULL,
          empresa VARCHAR(150),
          identificacion VARCHAR(20),
          estado ENUM('activo', 'inactivo', 'lead') DEFAULT 'activo',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS tbl_plataformas (
          plataforma_id INT AUTO_INCREMENT PRIMARY KEY,
          plataforma_nombre VARCHAR(100) NOT NULL UNIQUE,
          plataforma_url VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS tbl_credenciales (
          cred_id INT AUTO_INCREMENT PRIMARY KEY,
          plataforma_id INT NOT NULL,
          cred_correo VARCHAR(150),
          cred_contrasena VARCHAR(255),
          cred_usuario VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (plataforma_id) REFERENCES tbl_plataformas(plataforma_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS tbl_cliente_credenciales (
          cliente_id INT NOT NULL,
          cred_id INT NOT NULL,
          alias VARCHAR(100),
          PRIMARY KEY (cliente_id, cred_id),
          FOREIGN KEY (cliente_id) REFERENCES tbl_cliente(cliente_id) ON DELETE CASCADE,
          FOREIGN KEY (cred_id) REFERENCES tbl_credenciales(cred_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS tbl_numeros (
          numero_id INT AUTO_INCREMENT PRIMARY KEY,
          cliente_id INT NOT NULL,
          numero VARCHAR(20) NOT NULL,
          tipo ENUM('personal', 'empresa', 'whatsapp', 'otro') DEFAULT 'otro',
          FOREIGN KEY (cliente_id) REFERENCES tbl_cliente(cliente_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS tbl_correos (
          correo_id INT AUTO_INCREMENT PRIMARY KEY,
          cliente_id INT NOT NULL,
          correo VARCHAR(150) NOT NULL,
          tipo ENUM('personal', 'empresa', 'facturacion', 'otro') DEFAULT 'otro',
          FOREIGN KEY (cliente_id) REFERENCES tbl_cliente(cliente_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,

      `CREATE TABLE IF NOT EXISTS tbl_notas (
          nota_id INT AUTO_INCREMENT PRIMARY KEY,
          cliente_id INT NOT NULL,
          nota TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (cliente_id) REFERENCES tbl_cliente(cliente_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
    ];

    for (const query of queries) {
      await connection.execute(query);
    }

    console.log('All tables created or already exist.');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
