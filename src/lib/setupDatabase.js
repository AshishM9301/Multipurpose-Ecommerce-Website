import { pool } from './db'; // Ensure the correct path and file extension

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS addresses (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        address_line1 VARCHAR(255) NOT NULL,
        address_line2 VARCHAR(255),
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL
      );

      -- Add primary_address_id column to users table
      ALTER TABLE users
      ADD COLUMN primary_address_id INTEGER;

      -- Add foreign key constraint for primary_address_id
      ALTER TABLE users
      ADD CONSTRAINT fk_primary_address
      FOREIGN KEY (primary_address_id) 
      REFERENCES addresses(id)
      ON DELETE SET NULL;

      -- Add details in users table
      ALTER TABLE users
      ADD COLUMN first_name VARCHAR(255) NOT NULL,
      ADD COLUMN last_name VARCHAR(255) NOT NULL,
      ADD COLUMN phone VARCHAR(20);

      CREATE TABLE IF NOT EXISTS sellers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        company_name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        seller_id INTEGER REFERENCES users(id),
        category_id INTEGER REFERENCES categories(id),
        brand_id INTEGER REFERENCES brands(id)
      );

      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS brands (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES users(id),
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      );

      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        user_id INTEGER,
        name VARCHAR(255),
        email VARCHAR(255),
        review_text TEXT,
        rating INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        UNIQUE(user_id, product_id)
      );

      -- Add image_path column to products table
      ALTER TABLE products
      ADD COLUMN image_path VARCHAR(255);

      -- Add is_active column to categories table
      ALTER TABLE categories
      ADD COLUMN is_active BOOLEAN DEFAULT TRUE;  

      -- Add is_active column to brands table
      ALTER TABLE brands
      ADD COLUMN is_active BOOLEAN DEFAULT TRUE;  

      -- Add stock_quantity column to products table
      ALTER TABLE products
      ADD COLUMN stock_quantity INTEGER DEFAULT 0;

      -- Add missing columns if they don't exist
      DO $$
      BEGIN

      END $$;

      -- Add new columns if they don't exist
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'rating') THEN
          ALTER TABLE products ADD COLUMN rating DECIMAL(3, 2);
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'review_count') THEN
          ALTER TABLE products ADD COLUMN review_count INTEGER DEFAULT 0;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'discount_percentage') THEN
          ALTER TABLE products ADD COLUMN discount_percentage DECIMAL(5, 2) DEFAULT 0;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'original_price') THEN
          ALTER TABLE products ADD COLUMN original_price DECIMAL(10, 2);
        END IF;
      END $$;

      -- Add is_active column to products table
      ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    `);
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    client.release();
  }
}

module.exports = { initializeDatabase };


