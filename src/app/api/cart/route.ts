import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { verifyToken } from '@/app/api/auth/route';

export async function GET(req: Request) {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userId = await verifyToken(token);
        if (!userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const result = await pool.query('SELECT * FROM cart_items WHERE user_id = $1', [userId]);
        return NextResponse.json({ cartItems: result.rows });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userId = await verifyToken(token);
        if (!userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { cartItems } = await req.json();

        // Clear existing cart items
        await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);

        // Insert new cart items
        for (const item of cartItems) {
            await pool.query(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)',
                [userId, item.id, item.quantity]
            );
        }

        return NextResponse.json({ message: 'Cart updated successfully' });
    } catch (error) {
        console.error('Error updating cart:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
