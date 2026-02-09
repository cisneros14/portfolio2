
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const estado = searchParams.get('estado');

    let query = 'SELECT * FROM tbl_cliente WHERE 1=1';
    const params = [];

    if (q) {
      query += ' AND (cliente_nombre LIKE ? OR cliente_empresa LIKE ? OR cliente_identificacion LIKE ?)';
      const likeQ = `%${q}%`;
      params.push(likeQ, likeQ, likeQ);
    }

    if (estado && estado !== 'ALL') {
      query += ' AND cliente_estado = ?';
      params.push(estado);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Database Error: ' + error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let connection;
  try {
    const body = await request.json();
    const { nombre, empresa, identificacion, estado, numeros, correos, notas, credenciales } = body;

    if (!nombre) {
      return NextResponse.json({ error: 'Nombre es requerido' }, { status: 400 });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 1. Insert Client
    const [result] = await connection.execute<ResultSetHeader>(
      'INSERT INTO tbl_cliente (cliente_nombre, cliente_empresa, cliente_identificacion, cliente_estado) VALUES (?, ?, ?, ?)',
      [nombre, empresa || null, identificacion || null, estado || 'activo']
    );
    const cliente_id = result.insertId;

    // 2. Insert Numeros
    if (Array.isArray(numeros) && numeros.length > 0) {
      for (const n of numeros) {
        if (n.numero) {
           await connection.execute(
            'INSERT INTO tbl_numeros (cliente_id, numero, tipo) VALUES (?, ?, ?)',
            [cliente_id, n.numero, n.tipo || 'otro']
           );
        }
      }
    }

    // 3. Insert Correos
    if (Array.isArray(correos) && correos.length > 0) {
      for (const c of correos) {
        if (c.correo) {
           await connection.execute(
            'INSERT INTO tbl_correos (cliente_id, correo, tipo) VALUES (?, ?, ?)',
            [cliente_id, c.correo, c.tipo || 'otro']
           );
        }
      }
    }

    // 4. Insert Notas
    if (Array.isArray(notas) && notas.length > 0) {
        for (const n of notas) {
            if (n.nota) {
                await connection.execute(
                    'INSERT INTO tbl_notas (cliente_id, nota) VALUES (?, ?)',
                    [cliente_id, n.nota]
                );
            }
        }
    }

    // 5. Insert Credenciales (Client Specific)
    if (Array.isArray(credenciales) && credenciales.length > 0) {
        for (const c of credenciales) {
            if (c.plataforma_id) {
                await connection.execute(
                    'INSERT INTO tbl_credenciales (cliente_id, plataforma_id, cred_correo, cred_contrasena, cred_usuario) VALUES (?, ?, ?, ?, ?)',
                    [cliente_id, c.plataforma_id, c.cred_correo || null, c.cred_contrasena || null, c.cred_usuario || null]
                );
            }
        }
    }

    await connection.commit();
    return NextResponse.json({ success: true, id: cliente_id });
  } catch (error: any) {
    if (connection) await connection.rollback();
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Database Error: ' + error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function PUT(request: Request) {
  try {
    const { cliente_id, nombre, empresa, identificacion, estado } = await request.json();

    if (!cliente_id || !nombre) {
      return NextResponse.json({ error: 'ID y Nombre son requeridos' }, { status: 400 });
    }

    await pool.execute(
      'UPDATE tbl_cliente SET cliente_nombre = ?, cliente_empresa = ?, cliente_identificacion = ?, cliente_estado = ? WHERE cliente_id = ?',
      [nombre, empresa || null, identificacion || null, estado || 'activo', cliente_id]
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

    await pool.execute('DELETE FROM tbl_cliente WHERE cliente_id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ error: 'Database Error: ' + error.message }, { status: 500 });
  }
}
