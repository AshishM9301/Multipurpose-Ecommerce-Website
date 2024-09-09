import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: NextRequest, response: NextResponse) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const sellerId = searchParams.get('seller_id');
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'DESC';
    const search = searchParams.get('search');
    const isActive = searchParams.get('is_enabled');
    const category = searchParams.get('category');
    const offset = (page - 1) * limit;

    try {
        const client = await pool.connect();
        try {
            let queryParams: any[] = [];
            let whereClause = '';
            let paramCounter = 1;

            if (search) {
                whereClause = 'WHERE (p.name ILIKE $1 OR p.description ILIKE $1)';
                queryParams.push(`%${search}%`);
                paramCounter++;
            }

            if (sellerId) {
                whereClause += whereClause ? ' AND ' : 'WHERE ';
                whereClause += `p.seller_id = $${paramCounter}`;
                queryParams.push(parseInt(sellerId, 10));
                paramCounter++;
            }

            if (isActive !== null) {
                whereClause += whereClause ? ' AND ' : 'WHERE ';
                whereClause += `p.is_enabled = $${paramCounter}`;
                queryParams.push(isActive === 'true');
                paramCounter++;
            }

            if (category) {
                whereClause += whereClause ? ' AND ' : 'WHERE ';
                whereClause += `c.slug = $${paramCounter}`;
                queryParams.push(category);
                paramCounter++;
            }

            queryParams.push(limit, offset);

            const query = `
                SELECT p.id, p.name, p.price, p.image_path, p.stock_quantity, p.category_id, p.brand_id, p.description, p.created_at, p.is_enabled,
                       u.first_name as seller_first_name, u.last_name as seller_last_name,
                       c.name as category_name, c.slug as category_slug
                FROM products p
                JOIN users u ON p.seller_id = u.id
                JOIN categories c ON p.category_id = c.id
                ${whereClause}
                ORDER BY ${sortBy} ${sortOrder}
                LIMIT $${paramCounter} OFFSET $${paramCounter + 1}
            `;

            const result = await client.query(query, queryParams);

            let countQuery = 'SELECT COUNT(*) FROM products p JOIN categories c ON p.category_id = c.id';
            if (whereClause) {
                countQuery += ' ' + whereClause;
            }
            const countResult = await client.query(countQuery, queryParams.slice(0, -2));
            const totalProducts = parseInt(countResult.rows[0].count, 10);

            return NextResponse.json({
                products: result.rows,
                totalPages: Math.ceil(totalProducts / limit),
                currentPage: page,
                totalProducts: totalProducts
            });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
