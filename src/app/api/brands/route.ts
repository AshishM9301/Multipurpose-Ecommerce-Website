import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM brands ORDER BY name');
        client.release();
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching brands:', error);
        return NextResponse.json({ error: 'Error fetching brands' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const { name } = await request.json();

    if (!name) {
        return NextResponse.json({ error: 'Brand name is required' }, { status: 400 });
    }

    try {
        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO brands (name, is_active) VALUES ($1, true) RETURNING id, name, is_active',
            [name]
        );
        client.release();
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error adding brand:', error);
        return NextResponse.json({ error: 'Error adding brand' }, { status: 500 });
    }
}