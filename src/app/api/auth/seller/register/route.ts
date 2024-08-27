import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
    try {
        const { firstName, lastName, email, password, companyName, phoneNumber } = await req.json();

        const client = await pool.connect();
        try {
            // Check if the email is already registered
            const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Start a transaction
            await client.query('BEGIN');

            // Insert the new user
            const insertUserResult = await client.query(
                'INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [firstName, lastName, email, hashedPassword, 'seller']
            );

            const userId = insertUserResult.rows[0].id;

            // Insert seller-specific information
            await client.query(
                'INSERT INTO sellers (user_id, company_name, phone_number) VALUES ($1, $2, $3)',
                [userId, companyName, phoneNumber]
            );

            // Commit the transaction
            await client.query('COMMIT');

            return NextResponse.json({ message: 'Seller registered successfully' }, { status: 201 });
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 });
    }
}
