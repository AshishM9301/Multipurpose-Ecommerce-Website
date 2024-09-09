import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const id = params.id;

    try {
        // Fetch the product details
        const productResult = await pool.query(`
        SELECT 
          p.id, 
          p.name, 
          p.description, 
          p.price, 
          p.image_path, 
          p.rating, 
          p.review_count, 
          p.discount_percentage, 
          p.original_price,
          c.name AS category_name,
          b.name AS brand_name,
          s.company_name AS seller_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN sellers s ON p.seller_id = s.user_id
        WHERE p.id = $1
      `, [id]);

        if (productResult.rows.length === 0) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const product = productResult.rows[0];

        // Fetch similar products (here we're just getting products from the same category)
        const similarProductsResult = await pool.query(`
        SELECT 
          id, 
          name, 
          price, 
          image_path, 
          rating, 
          review_count
        FROM products
        WHERE category_id = (SELECT category_id FROM products WHERE id = $1)
          AND id != $1
        LIMIT 4
      `, [id]);

        const similarProducts = similarProductsResult.rows;

        return NextResponse.json({
            product: {
                id: product.id,
                name: product.name,
                description: product.description,
                price: parseFloat(product.price),
                images: [product.image_path], // Assuming single image for now
                rating: parseFloat(product.rating),
                reviewCount: product.review_count,
                discountPercentage: parseFloat(product.discount_percentage),
                originalPrice: parseFloat(product.original_price),
                category: product.category_name,
                brand: product.brand_name,
                seller: product.seller_name
            },
            similarProducts: similarProducts.map(p => ({
                id: p.id,
                name: p.name,
                price: parseFloat(p.price),
                images: [p.image_path], // Assuming single image for now
                rating: parseFloat(p.rating),
                reviewCount: p.review_count
            }))
        });

    } catch (error) {
        console.error('Error fetching product details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const productId = params.id;

    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const price = parseFloat(formData.get('price') as string);
        const description = formData.get('description') as string;
        const stock_quantity = parseInt(formData.get('stock_quantity') as string, 10);
        const category_id = parseInt(formData.get('category_id') as string, 10);
        const brand_id = parseInt(formData.get('brand_id') as string, 10);

        // Handle image upload here if needed
        // const image = formData.get('image') as File;

        if (!name || isNaN(price) || !description || isNaN(stock_quantity) || isNaN(category_id) || isNaN(brand_id)) {
            return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const updateProductQuery = `
        UPDATE products 
        SET name = $1, price = $2, description = $3, stock_quantity = $4, category_id = $5, brand_id = $6
        WHERE id = $7
        RETURNING id
      `;
            const result = await client.query(updateProductQuery, [name, price, description, stock_quantity, category_id, brand_id, productId]);

            if (result.rowCount === 0) {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Product not found' }, { status: 404 });
            }

            // Handle image update here if needed

            await client.query('COMMIT');

            return NextResponse.json({ message: 'Product updated successfully', productId }, { status: 200 });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error updating product:', error);
            return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const productId = params.id;

    try {
        const { is_enabled } = await request.json();

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const updateProductQuery = `
                UPDATE products 
                SET is_enabled = $1
                WHERE id = $2
                RETURNING id
            `;
            const result = await client.query(updateProductQuery, [is_enabled, productId]);

            if (result.rowCount === 0) {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Product not found' }, { status: 404 });
            }

            await client.query('COMMIT');

            return NextResponse.json({ message: 'Product updated successfully', productId }, { status: 200 });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error updating product:', error);
            return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const productId = params.id;

    try {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const deleteProductQuery = 'DELETE FROM products WHERE id = $1 RETURNING id';
            const result = await client.query(deleteProductQuery, [productId]);

            if (result.rowCount === 0) {
                await client.query('ROLLBACK');
                return NextResponse.json({ error: 'Product not found' }, { status: 404 });
            }

            await client.query('COMMIT');

            return NextResponse.json({ message: 'Product deleted successfully', productId }, { status: 200 });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error deleting product:', error);
            return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
