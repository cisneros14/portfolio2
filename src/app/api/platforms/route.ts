
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tbl_plataformas ORDER BY plataforma_nombre ASC');
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Database Error: ' + error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { plataforma_nombre, plataforma_url } = await request.json();

    if (!plataforma_nombre) {
      return NextResponse.json({ error: 'Nombre de plataforma es requerido' }, { status: 400 });
    }

    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO tbl_plataformas (plataforma_nombre, plataforma_url) VALUES (?, ?)',
      [plataforma_nombre, plataforma_url]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error: any) {
    console.error('Database Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'El nombre de la plataforma ya existe' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Database Error: ' + error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { plataforma_id, plataforma_nombre, plataforma_url } = await request.json();

    if (!plataforma_id || !plataforma_nombre) {
      return NextResponse.json({ error: 'ID y Nombre son requeridos' }, { status: 400 });
    }

    await pool.execute(
      'UPDATE tbl_plataformas SET plataforma_nombre = ?, plataforma_url = ? WHERE plataforma_id = ?',
      [plataforma_nombre, plataforma_url, plataforma_id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Database Error: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    await pool.execute('DELETE FROM tbl_plataformas WHERE plataforma_id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Database Error: ' + error.message }, { status: 500 });
  }
}
