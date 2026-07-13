import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3004/api/v1';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Call the backend admin login endpoint
    const res = await fetch(`${BACKEND_API_URL}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': ADMIN_API_KEY,
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: data.message || 'Invalid credentials' },
        { status: res.status }
      );
    }

    // Backend verified credentials, create a session
    await createSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
