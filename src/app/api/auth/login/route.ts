import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 });
    }

    // Query user
    const [rows]: any = await pool.query(
      'SELECT * FROM tbl_usuarios WHERE usu_correo = ? AND usu_estado = "activo"',
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const user = rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.usu_password_hash);

    if (!isValid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // Create JWT
    const secret = new TextEncoder().encode(JWT_SECRET);
    const token = await new SignJWT({ 
      id: user.usu_id, 
      email: user.usu_correo, 
      role: user.usu_rol 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    // Set cookie
    const response = NextResponse.json({ message: 'Login exitoso' });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
