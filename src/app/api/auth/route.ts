import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { pool } from '@/lib/db';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');

  if (!token) {
    return NextResponse.json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'fallback_secret') as { userId: string; email: string; role: string };
    return NextResponse.json({ isAuthenticated: true, user: decoded });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false });
  }
}


export async function verifyToken(token: string): Promise<number | null> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET! || 'fallback_secret', (err: any, decoded: any) => {
      if (err) return reject(err);
      resolve((decoded as any).userId);
    });
  });
}



export async function getUserRole(userId: string): Promise<string> {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT role FROM users WHERE id = $1', [userId]);
    if (result.rows.length > 0) {
      return result.rows[0].role;
    } else {
      throw new Error('User not found');
    }
  } finally {
    client.release();
  }
}