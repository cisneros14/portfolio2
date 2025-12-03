import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        m.msj_id,
        m.msj_mensaje,
        m.msj_creado_en,
        l.lead_id,
        l.lead_nombre,
        l.lead_identificacion,
        l.lead_correo,
        l.lead_celular
      FROM tbl_mensaje_lead m
      JOIN tbl_leads l ON m.msj_lead_id = l.lead_id
      ORDER BY m.msj_creado_en DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Error fetching messages' }, { status: 500 });
  }
}
