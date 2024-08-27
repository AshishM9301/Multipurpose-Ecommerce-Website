import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { verifyToken } from '../auth/route';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyToken(token.value);

    if (!userId) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    try {
        const addressesResult = await pool.query('SELECT * FROM addresses WHERE user_id = $1', [userId]);
        const userResult = await pool.query('SELECT primary_address_id FROM users WHERE id = $1', [userId]);

        return NextResponse.json({
            addresses: addressesResult.rows,
            primaryAddressId: userResult.rows[0]?.primary_address_id || null
        });
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {

    // Get the token from the cookie
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyToken(token.value);

    if (!userId) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { address_line1, address_line2, city, state, postal_code, country, isDefault } = await req.json();

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const insertResult = await client.query(
                'INSERT INTO addresses (user_id, address_line1, address_line2, city, state, postal_code, country) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
                [userId, address_line1, address_line2, city, state, postal_code, country]
            );

            const newAddressId = insertResult.rows[0].id;

            if (isDefault) {
                await client.query(
                    'UPDATE users SET primary_address_id = $1 WHERE id = $2',
                    [newAddressId, userId]
                );
            }

            await client.query('COMMIT');

            return NextResponse.json({ message: 'Address added successfully', id: newAddressId });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error adding address:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}