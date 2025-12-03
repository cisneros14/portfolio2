import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM tbl_leads ORDER BY lead_creado_en DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Error fetching leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lead_nombre, lead_identificacion, lead_celular, lead_correo, lead_estado, lead_calificacion } = body;

    if (!lead_nombre) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [result]: any = await pool.query(
      'INSERT INTO tbl_leads (lead_nombre, lead_identificacion, lead_celular, lead_correo, lead_estado, lead_calificacion) VALUES (?, ?, ?, ?, ?, ?)',
      [lead_nombre, lead_identificacion, lead_celular, lead_correo, lead_estado !== undefined ? lead_estado : 1, lead_calificacion || 'frio']
    );

    return NextResponse.json({ message: 'Lead created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json({ error: 'Error creating lead' }, { status: 500 });
  }
}
