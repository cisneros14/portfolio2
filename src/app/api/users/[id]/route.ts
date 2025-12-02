import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { usu_nombre, usu_correo, usu_password, usu_rol, usu_estado } = body;

   let query =
  'UPDATE tbl_usuarios SET usu_nombre = ?, usu_correo = ?, usu_rol = ?, usu_estado = ?'

const values: (string | number)[] = [
  usu_nombre,
  usu_correo,
  usu_rol,
  usu_estado,
]

if (usu_password) {
  const hashedPassword = await bcrypt.hash(usu_password, 10)
  query += ', usu_password_hash = ?'
  values.push(hashedPassword)
}

query += ' WHERE usu_id = ?'
values.push(id)

await pool.query(query, values)


    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await pool.query('DELETE FROM tbl_usuarios WHERE usu_id = ?', [id]);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
  }
}
