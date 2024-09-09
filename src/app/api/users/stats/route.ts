import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const query = `
        SELECT 
           u.id,
          u.first_name,
          u.last_name,
          u.email,
          u.role,
          COALESCE(p.products_count, 0) as products_count,
          COALESCE(s.sales_count, 0) as sales_count,
          COALESCE(o.orders_count, 0) as orders_count,
          COALESCE(o.total_spent, 0) as total_spent,
          COALESCE(s.total_earned, 0) as total_earned
        FROM users u
        LEFT JOIN (
          SELECT seller_id, COUNT(*) as products_count
          FROM products
          GROUP BY seller_id
        ) p ON u.id = p.seller_id
        LEFT JOIN (
          SELECT seller_user_id, COUNT(*) as sales_count, SUM(total_amount) as total_earned
          FROM orders
          GROUP BY seller_user_id
        ) s ON u.id = s.seller_user_id
        LEFT JOIN (
          SELECT customer_id, COUNT(*) as orders_count, SUM(total_amount) as total_spent
          FROM orders
          GROUP BY customer_id
        ) o ON u.id = o.customer_id
        ORDER BY u.id
      `;

      const result = await client.query(query);
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
