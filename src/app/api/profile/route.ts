import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

async function getUserIdFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.id as number;
  } catch {
    return null;
  }
}

export async function GET() {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [rows]: any = await pool.query(
      'SELECT usu_id, usu_nombre, usu_correo, usu_rol FROM tbl_usuarios WHERE usu_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { usu_nombre, usu_correo, currentPassword, newPassword } = body;

    // 1. Update Basic Info (if no password change)
    if (!currentPassword && !newPassword) {
      await pool.query(
        'UPDATE tbl_usuarios SET usu_nombre = ?, usu_correo = ? WHERE usu_id = ?',
        [usu_nombre, usu_correo, userId]
      );
      return NextResponse.json({ message: 'Perfil actualizado correctamente' });
    }

    // 2. Update Password (and info)
    if (currentPassword && newPassword) {
      // Fetch current hash
      const [rows]: any = await pool.query(
        'SELECT usu_password_hash FROM tbl_usuarios WHERE usu_id = ?',
        [userId]
      );

      if (rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const user = rows[0];
      const isValid = await bcrypt.compare(currentPassword, user.usu_password_hash);

      if (!isValid) {
        return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await pool.query(
        'UPDATE tbl_usuarios SET usu_nombre = ?, usu_correo = ?, usu_password_hash = ? WHERE usu_id = ?',
        [usu_nombre, usu_correo, hashedPassword, userId]
      );

      return NextResponse.json({ message: 'Contraseña actualizada correctamente' });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
