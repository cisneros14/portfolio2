
import { pool } from '@/lib/db';

async function run() {
  try {
    console.log('Updating leads_sin_web schema...');
    await pool.query(`
      ALTER TABLE leads_sin_web
      MODIFY lead_status ENUM(
        'NUEVO',
        'CONTACTADO',
        'INTERESADO',
        'CLIENTE',
        'RECHAZADO',
        'EN_DESARROLLO',
        'SIN_WHATSAPP'
      ) NOT NULL;
    `);
    console.log('Schema updated successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error updating schema:', error);
    process.exit(1);
  }
}

run();
