import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const [rows]: any = await pool.query('SELECT * FROM tbl_leads WHERE lead_id = ?', [id]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ error: 'Error fetching lead' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { lead_nombre, lead_identificacion, lead_celular, lead_correo, lead_estado, lead_calificacion } = body;

    await pool.query(
      'UPDATE tbl_leads SET lead_nombre = ?, lead_identificacion = ?, lead_celular = ?, lead_correo = ?, lead_estado = ?, lead_calificacion = ? WHERE lead_id = ?',
      [lead_nombre, lead_identificacion, lead_celular, lead_correo, lead_estado, lead_calificacion, id]
    );

    return NextResponse.json({ message: 'Lead updated successfully' });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Error updating lead' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await pool.query('DELETE FROM tbl_leads WHERE lead_id = ?', [id]);
    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Error deleting lead' }, { status: 500 });
  }
}
