import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!pool) {
            console.error('Database pool is not initialized');
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1 AND (role = $2 OR role = $3)', [email, 'admin', 'super_admin']);
        const admin = result.rows[0];

        if (!admin) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const response_data = { userId: admin.id, email: admin.email, role: admin.role }

        const token = jwt.sign(
            response_data,
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1h' }
        );

        const response = NextResponse.json({ message: 'Admin logged in successfully', data: response_data, redirectUrl: admin.role === 'super_admin' ? '/admin/dashboard' : '/admin/dashboard' });
        response.cookies.set('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600, // 1 hour
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}