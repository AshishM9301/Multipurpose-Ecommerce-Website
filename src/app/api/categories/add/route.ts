import { pool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const { name } = await request.json();

    if (!name) {
        return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    try {
        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO categories (name) VALUES ($1) RETURNING id, name',
            [name]
        );
        client.release();
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error adding category:', error);
        return NextResponse.json({ error: 'Error adding category' }, { status: 500 });
    }
}