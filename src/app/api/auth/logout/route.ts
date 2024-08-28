import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        // Clear the authentication cookie
        cookies().delete('auth_token');
        cookies().delete('adminToken');

        // You might want to perform additional logout operations here
        // For example, invalidating the session on the server side

        return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'An error occurred during logout' }, { status: 500 });
    }
}
