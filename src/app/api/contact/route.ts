import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, cedula, phone, message } = body;

    if (!cedula || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Check if lead exists
    const [existingLeads]: any = await pool.query(
      'SELECT lead_id FROM tbl_leads WHERE lead_identificacion = ?',
      [cedula]
    );

    let leadId;

    if (existingLeads.length > 0) {
      // Lead exists
      leadId = existingLeads[0].lead_id;
    } else {
      // Create new lead
      const [result]: any = await pool.query(
        'INSERT INTO tbl_leads (lead_nombre, lead_identificacion, lead_celular, lead_correo, lead_estado, lead_calificacion) VALUES (?, ?, ?, ?, 1, "frio")',
        [name, cedula, phone, email]
      );
      leadId = result.insertId;
    }

    // 2. Insert message
    await pool.query(
      'INSERT INTO tbl_mensaje_lead (msj_lead_id, msj_mensaje) VALUES (?, ?)',
      [leadId, message]
    );

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Error sending message' }, { status: 500 });
  }
}
