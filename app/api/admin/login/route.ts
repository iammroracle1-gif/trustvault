import { NextRequest, NextResponse } from 'next/server';

// In production, use bcrypt to hash passwords and store in database
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'admin123', // Change in production!
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    console.log('Login attempt:', { username, hasPassword: !!password });

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password required' },
        { status: 400 }
      );
    }

    // Trim whitespace from inputs
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    console.log('Checking credentials:', {
      provided: trimmedUsername,
      expected: ADMIN_CREDENTIALS.username,
      match: trimmedUsername === ADMIN_CREDENTIALS.username,
    });

    // Validate credentials
    if (
      trimmedUsername === ADMIN_CREDENTIALS.username &&
      trimmedPassword === ADMIN_CREDENTIALS.password
    ) {
      // In production, use JWT or session tokens
      const token = Buffer.from(`${trimmedUsername}:${Date.now()}`).toString('base64');

      return NextResponse.json({
        success: true,
        token,
        user: {
          username: trimmedUsername,
          role: 'admin',
        },
      });
    }

    console.log('Invalid credentials provided');
    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
