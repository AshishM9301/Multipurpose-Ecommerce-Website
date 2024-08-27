const { pool } = require('./db');

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
      ADD COLUMN phone VARCHAR(20),

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
        category_id INTEGER,
        brand_id INTEGER
      );

      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
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
    `);
    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    client.release();
  }
}

module.exports = { initializeDatabase };