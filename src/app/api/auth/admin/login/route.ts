import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        const client = await pool.connect();
        try {
            // Check if the user exists and is an admin, super_admin, or seller
            const result = await client.query(
                'SELECT * FROM users WHERE email = $1 AND role IN ($2, $3, $4)',
                [email, 'admin', 'super_admin', 'seller']
            );

            if (result.rows.length === 0) {
                return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
            }

            const user = result.rows[0];

            // Check if the password is correct
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
            }

            // Generate a JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET!,
                { expiresIn: '1h' }
            );

            // Set the token in a secure, HTTP-only cookie
            const response = NextResponse.json({
                message: 'Login successful',
                role: user.role,
                token: token // Include the token in the response
            });
            response.cookies.set('adminToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600, // 1 hour
                path: '/',
            });

            return response;
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'An error occurred during login' }, { status: 500 });
    }
}
