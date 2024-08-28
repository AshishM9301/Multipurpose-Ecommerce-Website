import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// This is a mock database. In a real application, you'd use an actual database.
const mockProducts = [
    { id: 1, name: 'Product 1', price: 19.99, description: 'Description for Product 1', stock: 100, imagePath: '/uploads/product1.jpg' },
    { id: 2, name: 'Product 2', price: 29.99, description: 'Description for Product 2', stock: 50, imagePath: '/uploads/product2.jpg' },
    { id: 3, name: 'Product 3', price: 39.99, description: 'Description for Product 3', stock: 75, imagePath: '/uploads/product3.jpg' },
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('seller_id');

    try {
        const client = await pool.connect();
        try {
            let query = 'SELECT * FROM products';
            const values = [];

            if (sellerId) {
                query += ' WHERE seller_id = $1';
                values.push(parseInt(sellerId));
            }

            const result = await client.query(query, values);
            return NextResponse.json(result.rows);
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
