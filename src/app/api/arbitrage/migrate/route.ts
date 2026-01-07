import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    // Check if column exists first to avoid error
    const [columns]: any = await pool.query(
      "SHOW COLUMNS FROM leads LIKE 'google_id'"
    );

    if (columns.length === 0) {
      await pool.query(
        'ALTER TABLE leads ADD COLUMN google_id VARCHAR(255) UNIQUE'
      );
      return NextResponse.json({ message: 'Migration successful: google_id added' });
    } else {
      return NextResponse.json({ message: 'Migration skipped: google_id already exists' });
    }

  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
