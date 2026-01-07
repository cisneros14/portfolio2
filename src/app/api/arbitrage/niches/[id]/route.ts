import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, avg_ticket_value } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    await pool.query(
      'UPDATE niches SET name = ?, description = ?, avg_ticket_value = ? WHERE id = ?',
      [name, description, avg_ticket_value || null, id]
    );

    return NextResponse.json({ message: 'Niche updated successfully' });
  } catch (error) {
    console.error('Error updating niche:', error);
    return NextResponse.json({ error: 'Error updating niche' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query('DELETE FROM niches WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Niche deleted successfully' });
  } catch (error) {
    console.error('Error deleting niche:', error);
    return NextResponse.json({ error: 'Error deleting niche' }, { status: 500 });
  }
}
