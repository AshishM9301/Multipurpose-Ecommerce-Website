import { NextResponse } from 'next/server';
import { verifyToken } from '../auth/route';
import { pool } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = await verifyToken(token.value);

    console.log(userId);

    if (!userId) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    try {
        const client = await pool.connect();
        try {
            const userResult = await client.query(
                'SELECT first_name, last_name, email, phone, primary_address_id FROM users WHERE id = $1',
                [userId]
            );

            if (userResult.rows.length === 0) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const userData = userResult.rows[0];

            let shippingAddress = null;
            if (userData.primary_address_id) {
                const addressResult = await client.query(
                    'SELECT address_line1, address_line2, city, state, postal_code, country FROM addresses WHERE id = $1',
                    [userData.primary_address_id]
                );
                if (addressResult.rows.length > 0) {
                    shippingAddress = addressResult.rows[0];
                }
            }

            return NextResponse.json({
                firstName: userData.first_name,
                lastName: userData.last_name,
                email: userData.email,
                phone: userData.phone,
                shippingAddress
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}