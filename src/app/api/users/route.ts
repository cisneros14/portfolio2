import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT usu_id, usu_nombre, usu_correo, usu_rol, usu_estado, usu_creado_en FROM tbl_usuarios ORDER BY usu_creado_en DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { usu_nombre, usu_correo, usu_password, usu_rol, usu_estado } = body;

    if (!usu_nombre || !usu_correo || !usu_password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(usu_password, 10);

    const [result]: any = await pool.query(
      'INSERT INTO tbl_usuarios (usu_nombre, usu_correo, usu_password_hash, usu_rol, usu_estado) VALUES (?, ?, ?, ?, ?)',
      [usu_nombre, usu_correo, hashedPassword, usu_rol || 2, usu_estado || 'activo']
    );

    return NextResponse.json({ message: 'User created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}
