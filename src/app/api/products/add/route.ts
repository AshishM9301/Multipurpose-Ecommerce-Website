import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const price = parseFloat(formData.get('price') as string);
        const description = formData.get('description') as string;
        const stock_quantity = parseInt(formData.get('stock_quantity') as string, 10);
        const seller_id = parseInt(formData.get('seller_id') as string, 10);
        const category_id = parseInt(formData.get('category_id') as string, 10);
        const brand_id = parseInt(formData.get('brand_id') as string, 10);

        // Handle image upload
        const image = formData.get('image') as File;
        let imagePath = '';

        if (image) {
            const buffer = await image.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            const fileName = `${Date.now()}-${image.name}`;
            imagePath = `/uploads/${fileName}`;

            // Ensure the uploads directory exists
            const fs = require('fs').promises;
            await fs.mkdir('./public/uploads', { recursive: true });

            // Write the file
            await fs.writeFile(`./public${imagePath}`, bytes);
        }

        if (!name || isNaN(price) || !description || isNaN(stock_quantity) || isNaN(seller_id) || isNaN(category_id) || isNaN(brand_id)) {
            return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const insertProductQuery = `
                INSERT INTO products (name, price, description, stock_quantity, seller_id, category_id, brand_id, image_path)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING id
            `;
            const result = await client.query(insertProductQuery, [name, price, description, stock_quantity, seller_id, category_id, brand_id, imagePath]);

            const productId = result.rows[0].id;

            await client.query('COMMIT');

            return NextResponse.json({ message: 'Product added successfully', productId }, { status: 201 });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error adding product:', error);
            return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
