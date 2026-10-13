import { NextResponse } from 'next/server';

export async function GET() {
  const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123';

  return NextResponse.json({
    environment: {
      ADMIN_USERNAME_SET: !!process.env.ADMIN_USERNAME,
      ADMIN_PASSWORD_SET: !!process.env.ADMIN_PASSWORD,
    },
    expected: {
      username: expectedUsername,
      passwordLength: expectedPassword.length,
      passwordPreview: expectedPassword.substring(0, 5) + '...',
    },
    hint: 'Try these credentials in the login form',
  });
}
