
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
    // console.log('Host:', process.env.DB_HOST); // Hidden for security in logs
    // console.log('User:', process.env.DB_USER);
    // console.log('Database:', process.env.DB_NAME);

    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
        throw new Error('Missing database credentials in .env or .env.local');
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Connected! Creating table tbl_ideas_post...');

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tbl_ideas_post (
        post_id INT AUTO_INCREMENT PRIMARY KEY,
        post_idea TEXT NOT NULL,
        post_publicado BOOLEAN DEFAULT FALSE,
        post_fecha_publicacion DATETIME,
        post_contenido_generado TEXT,
        post_imagen_url TEXT,
        post_meta_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createTableQuery);

    console.log('Table tbl_ideas_post created or already exists.');
    
    // Check columns to ensure they match our needs (in case table existed)
    const [columns] = await connection.execute('DESCRIBE tbl_ideas_post');
    console.log('Table structure:', columns.map(c => c.Field).join(', '));

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
