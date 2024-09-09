import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const id = params.id;
    const { is_active } = await request.json();

    try {
        const client = await pool.connect();
        const result = await client.query(
            'UPDATE brands SET is_active = $1 WHERE id = $2 RETURNING id, name, is_active',
            [is_active, id]
        );
        client.release();

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating brand:', error);
        return NextResponse.json({ error: 'Error updating brand' }, { status: 500 });
    }
}
