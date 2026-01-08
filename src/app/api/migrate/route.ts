import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    try {
      // 1. Modify has_website to VARCHAR
      // Note: We might need to handle existing data conversion if strict mode is on, 
      // but usually MySQL handles boolean (0/1) to varchar conversion fine ('0'/'1').
      // However, the user wants 'unknown' as default.
      // Let's first change the type.
      await connection.query(`
        ALTER TABLE leads 
        MODIFY COLUMN has_website VARCHAR(50) DEFAULT 'UNKNOWN'
      `);

      // 2. Update existing values (optional but good for consistency)
      // Convert '0' to 'NO' and '1' to 'YES' if they exist as strings now
      await connection.query(`
        UPDATE leads SET has_website = 'NO' WHERE has_website = '0'
      `);
      await connection.query(`
        UPDATE leads SET has_website = 'YES' WHERE has_website = '1'
      `);

      // 3. Modify status ENUM to include ARCHIVED
      await connection.query(`
        ALTER TABLE leads 
        MODIFY COLUMN status ENUM('NEW','QUALIFIED','PROTOTYPE_READY','CONTACTED','NEGOTIATING','CLOSED_WON','CLOSED_LOST','BAD_DATA','ARCHIVED') DEFAULT 'NEW'
      `);

      return NextResponse.json({ message: 'Migration executed successfully' });
    } finally {
      connection.release();
    }
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
