import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { ORDER_STATUS } from '../type';
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {

        const cookieStore = cookies();
        const authToken = cookieStore.get('auth_token');
        if (authToken) {
            const token = authToken?.value
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string; email: string; role: string };



                const user_id = decoded.userId

                const { total_amount, products } = await request.json();
                let status = ORDER_STATUS.INITIATED



                if (!user_id || isNaN(total_amount) || !Array.isArray(products)) {
                    return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
                }


                const client = await pool.connect();
                try {
                    await client.query('BEGIN');

                    const selectProductQuery = `
                SELECT * FROM products WHERE id = $1
            `

                    products.forEach(async element => {
                        try {
                            const res = await client.query(selectProductQuery, [element.id])
                            if (!res.rows[0]) {
                                status = ORDER_STATUS.PRODUCT_NOT_FOUND
                            }
                            else if (res.rows[0].price !== element.price) {
                                status = ORDER_STATUS.PRICE_MISMATCH
                            }
                            else if (Math.sign(res.rows[0].stock_quantity - element.quantity) < 0) {
                                status = ORDER_STATUS.OUT_OF_STOCK
                            }

                        } catch (error) {
                            status = ORDER_STATUS.FAILED
                        }
                    });


                    console.log('status--->', status)


                    const insertOrderQuery = `
                INSERT INTO orders (customer_id, total_amount, status)
                VALUES ($1, $2, $3)
                RETURNING id
            `;
                    const result = await client.query(insertOrderQuery, [user_id, total_amount, status]);

                    const orderId = result.rows[0].id;

                    const insertOrderItemQuery = `
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES ($1, $2, $3, $4)
                RETURNING id
            `;

                    products.forEach(async element => {
                        await client.query(insertOrderItemQuery, [orderId, element.id, element.quantity, element.price])
                    });

                    await client.query('COMMIT');

                    return NextResponse.json({ message: 'Order added successfully', orderId }, { status: 201 });
                } catch (error) {
                    await client.query('ROLLBACK');
                    console.error('Error adding product:', error);
                    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
                } finally {
                    client.release();
                }
            }
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
