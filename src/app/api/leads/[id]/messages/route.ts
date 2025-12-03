import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM tbl_mensaje_lead WHERE msj_lead_id = ? ORDER BY msj_creado_en DESC',
      [id]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching lead messages:', error);
    return NextResponse.json({ error: 'Error fetching lead messages' }, { status: 500 });
  }
}
