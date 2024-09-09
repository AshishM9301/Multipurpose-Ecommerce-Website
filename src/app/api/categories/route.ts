import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: NextRequest, response: NextResponse) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    try {
        const client = await pool.connect();
        try {
            let queryParams: any[] = [limit, offset];
            let whereClause = '';

            if (search) {
                whereClause = 'WHERE name ILIKE $3';
                queryParams.push(`%${search}%`);
            }

            const query = `
                SELECT id, name, slug
                FROM categories
                ${whereClause}
                ORDER BY name ASC
                LIMIT $1 OFFSET $2
            `;

            const result = await client.query(query, queryParams);

            let countQuery = 'SELECT COUNT(*) FROM categories';
            if (whereClause) {
                countQuery += ' ' + whereClause;
            }
            const countResult = await client.query(countQuery, search ? [`%${search}%`] : []);
            const totalCategories = parseInt(countResult.rows[0].count, 10);

            return NextResponse.json({
                categories: result.rows,
                totalPages: Math.ceil(totalCategories / limit),
                currentPage: page,
                totalCategories: totalCategories
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}