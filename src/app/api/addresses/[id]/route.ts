import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { verifyToken } from '../../auth/route';
import { cookies } from 'next/headers';

export async function GET(req: Request, { params }: { params: { id: string } }) {
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
        const result = await pool.query(
            'SELECT * FROM addresses WHERE id = $1 AND user_id = $2',
            [addressId, userId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Address not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching address:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

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
    const { address_line1, address_line2, city, state, postal_code, country } = await req.json();

    try {
        const result = await pool.query(
            `UPDATE addresses 
             SET address_line1 = $1, address_line2 = $2, city = $3, state = $4, postal_code = $5, country = $6
             WHERE id = $7 AND user_id = $8
             RETURNING *`,
            [address_line1, address_line2, city, state, postal_code, country, addressId, userId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Address not found or not authorized to update' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating address:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
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
        // First, check if the address belongs to the user
        const checkResult = await pool.query(
            'SELECT * FROM addresses WHERE id = $1 AND user_id = $2',
            [addressId, userId]
        );

        if (checkResult.rows.length === 0) {
            return NextResponse.json({ error: 'Address not found or not authorized to delete' }, { status: 404 });
        }

        // If the address belongs to the user, delete it
        await pool.query('DELETE FROM addresses WHERE id = $1', [addressId]);

        return NextResponse.json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}