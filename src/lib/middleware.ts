import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function checkUserRole(request: NextRequest, roles: string[]) {
    const cookieStore = cookies();
    const authToken: string | undefined = cookieStore.get('auth_token')?.value;

    console.log(authToken);

    if (!authToken) {
        return NextResponse.json({ error: "API doesn't exist" }, { status: 403 });
    }

    try {
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET || 'fallback_secret') as { role: string };
        if (!roles.includes(decoded.role)) {
            return NextResponse.json({ error: "API doesn't exist" }, { status: 403 });
        }
    } catch (error) {
        return NextResponse.json({ error: "API doesn't exist" }, { status: 403 });
    }

    return null;
}
