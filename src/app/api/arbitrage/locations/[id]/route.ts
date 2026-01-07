import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { city, country, language_code, currency_symbol } = body;

    if (!city || !country) {
      return NextResponse.json({ error: 'City and Country are required' }, { status: 400 });
    }

    await pool.query(
      'UPDATE target_locations SET city = ?, country = ?, language_code = ?, currency_symbol = ? WHERE id = ?',
      [city, country, language_code, currency_symbol, id]
    );

    return NextResponse.json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating location:', error);
    return NextResponse.json({ error: 'Error updating location' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query('DELETE FROM target_locations WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    return NextResponse.json({ error: 'Error deleting location' }, { status: 500 });
  }
}
