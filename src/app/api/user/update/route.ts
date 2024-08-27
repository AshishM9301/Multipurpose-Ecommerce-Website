import { NextResponse } from 'next/server';
import { verifyToken } from '../../auth/route';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyToken(token.value);

    if (!userId) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { firstName, lastName, email, phone } = await req.json();

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const updateQuery = `
                UPDATE users 
                SET first_name = $1, last_name = $2, email = $3, phone = $4
                WHERE id = $5
            `;
            await client.query(updateQuery, [firstName, lastName, email, phone, userId]);

            await client.query('COMMIT');

            return NextResponse.json({ message: 'Profile updated successfully' });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error updating user data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}