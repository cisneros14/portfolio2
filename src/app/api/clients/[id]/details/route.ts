
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

/**
 * Handle details for a specific client: numbers, emails, notes, credentials
 * Expects { id: string } in params
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cliente_id } = await params;

    const [numeros] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM tbl_numeros WHERE cliente_id = ?',
      [cliente_id]
    );
    const [correos] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM tbl_correos WHERE cliente_id = ?',
      [cliente_id]
    );
    const [notas] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM tbl_notas WHERE cliente_id = ? ORDER BY created_at DESC',
      [cliente_id]
    );
    const [credenciales] = await pool.query<RowDataPacket[]>(
      `SELECT c.*, p.plataforma_nombre
       FROM tbl_credenciales c 
       JOIN tbl_plataformas p ON c.plataforma_id = p.plataforma_id 
       WHERE c.cliente_id = ?
       ORDER BY c.created_at DESC`,
      [cliente_id]
    );

    return NextResponse.json({
      numeros,
      correos,
      notas,
      credenciales
    });
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Database Error: ' + error.message }, { status: 500 });
  }
}

/**
 * Add a detail to a client
 * Body type: { type: 'numero' | 'correo' | 'nota' | 'credencial', data: any }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cliente_id } = await params;
    const { type, data } = await request.json();

    let query = '';
    let values: any[] = [];

    switch (type) {
      case 'numero':
        if (!data?.numero) return NextResponse.json({ error: 'Número es requerido' }, { status: 400 });
        query = 'INSERT INTO tbl_numeros (cliente_id, numero, tipo) VALUES (?, ?, ?)';
        values = [cliente_id, data.numero, data.tipo || 'otro'];
        break;
      case 'correo':
        if (!data?.correo) return NextResponse.json({ error: 'Correo es requerido' }, { status: 400 });
        query = 'INSERT INTO tbl_correos (cliente_id, correo, tipo) VALUES (?, ?, ?)';
        values = [cliente_id, data.correo, data.tipo || 'otro'];
        break;
      case 'nota':
        if (!data?.nota) return NextResponse.json({ error: 'Nota es requerida' }, { status: 400 });
        query = 'INSERT INTO tbl_notas (cliente_id, nota) VALUES (?, ?)';
        values = [cliente_id, data.nota];
        break;
      case 'credencial':
        if (!data?.plataforma_id) return NextResponse.json({ error: 'Plataforma es requerida' }, { status: 400 });
        query = 'INSERT INTO tbl_credenciales (cliente_id, plataforma_id, cred_correo, cred_usuario, cred_contrasena) VALUES (?, ?, ?, ?, ?)';
        values = [cliente_id, data.plataforma_id, data.cred_correo || null, data.cred_usuario || null, data.cred_contrasena || null];
        break;
      default:
        return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
    }

    const [result] = await pool.execute<ResultSetHeader>(query, values);
    return NextResponse.json({ success: true, id: result.insertId || null });
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Database Error: ' + error.message }, { status: 500 });
  }
}

/**
 * Delete a detail from a client
 * Query params: ?type=...&id=...
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: cliente_id } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ error: 'Tipo e ID son requeridos' }, { status: 400 });
    }

    let query = '';
    let values: any[] = [];

    switch (type) {
      case 'numero':
        query = 'DELETE FROM tbl_numeros WHERE numero_id = ? AND cliente_id = ?';
        values = [id, cliente_id];
        break;
      case 'correo':
        query = 'DELETE FROM tbl_correos WHERE correo_id = ? AND cliente_id = ?';
        values = [id, cliente_id];
        break;
      case 'nota':
        query = 'DELETE FROM tbl_notas WHERE nota_id = ? AND cliente_id = ?';
        values = [id, cliente_id];
        break;
      case 'credencial':
        // For credentials, we delete the credential record itself as it is now owned by the client
        query = 'DELETE FROM tbl_credenciales WHERE cred_id = ? AND cliente_id = ?';
        values = [id, cliente_id];
        break;
      default:
        return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });
    }

    await pool.execute(query, values);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Database Error: ' + error.message }, { status: 500 });
  }
}
