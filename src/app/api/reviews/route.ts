import { NextRequest, NextResponse } from 'next/server'
import type { NextApiRequest, NextApiResponse } from 'next'
import { pool } from '@/lib/db'
import { checkUserRole } from '@/lib/middleware'

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    const { productId, userId, name, email, reviewText, rating } = req.body;

    try {
        const client = await pool.connect();
        const result = await client.query(
            'INSERT INTO reviews (product_id, user_id, name, email, review_text, rating) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [productId, userId || null, name, email, reviewText, rating]
        );
        client.release();
        return res.status(201).json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: 'Error submitting review' });
    }
}

export async function GET(req: NextRequest) {
    const roleCheck = await checkUserRole(req, ['seller', 'admin', 'super_admin']);
    if (roleCheck) return roleCheck;

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    try {
        const client = await pool.connect();
        const result = await client.query(
            'SELECT * FROM reviews WHERE product_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
            [productId, limit, offset]
        );
        const totalCountResult = await client.query('SELECT COUNT(*) FROM reviews WHERE product_id = $1', [productId]);
        const totalCount = parseInt(totalCountResult.rows[0].count, 10);
        client.release();
        return NextResponse.json({
            reviews: result.rows,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error fetching reviews' }, { status: 500 });
    }
}