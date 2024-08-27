import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { verifyToken } from '../../../auth/route';
import { cookies } from 'next/headers';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token');
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyToken(token.value);

    if (!userId) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const addressId = parseInt(params.id);

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Check if the address belongs to the user
            const checkResult = await client.query(
                'SELECT id FROM addresses WHERE id = $1 AND user_id = $2',
                [addressId, userId]
            );

            if (checkResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Address not found or not authorized' }, { status: 404 });
            }

            // Update the user's primary address
            await client.query(
                'UPDATE users SET primary_address_id = $1 WHERE id = $2',
                [addressId, userId]
            );

            await client.query('COMMIT');

            return NextResponse.json({ message: 'Primary address updated successfully' });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error updating primary address:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
