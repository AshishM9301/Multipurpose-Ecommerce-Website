import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import pool from '@/lib/db';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const price = formData.get('price') as string;
        const description = formData.get('description') as string;
        const sellerId = formData.get('seller_id') as string; // You'll need to pass this from the frontend
        const categoryId = formData.get('category_id') as string; // Optional
        const brandId = formData.get('brand_id') as string; // Optional
        const image = formData.get('image') as File | null;

        // Validate the input
        if (!name || !price || !description || !sellerId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Handle image upload
        let imagePath = '';
        if (image) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileName = `${Date.now()}-${image.name}`;
            const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

            // Create the uploads directory if it doesn't exist
            try {
                await mkdir(uploadsDir, { recursive: true });
            } catch (err) {
                if (err.code !== 'EEXIST') throw err;
            }

            const filePath = path.join(uploadsDir, fileName);
            await writeFile(filePath, buffer);
            imagePath = `/uploads/${fileName}`;
        }

        // Add the product to the database
        const client = await pool.connect();
        try {
            const result = await client.query(
                'INSERT INTO products (name, description, price, seller_id, category_id, brand_id, image_path) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [name, description, parseFloat(price), parseInt(sellerId), categoryId ? parseInt(categoryId) : null, brandId ? parseInt(brandId) : null, imagePath]
            );
            const newProduct = result.rows[0];
            return NextResponse.json({ message: 'Product added successfully', product: newProduct }, { status: 201 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error adding product:', error);
        return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
    }
}
