import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const envVars = {
    POSTGRES_URL: !!process.env.POSTGRES_URL,
    POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
    POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
    DATABASE_URL: !!process.env.DATABASE_URL,
    POSTGRES_HOST: !!process.env.POSTGRES_HOST,
    POSTGRES_USER: !!process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: !!process.env.POSTGRES_PASSWORD,
    POSTGRES_DATABASE: !!process.env.POSTGRES_DATABASE,
  };

  // Show first 20 chars of the URL if it exists (for verification)
  const urlPreview = process.env.POSTGRES_URL 
    ? process.env.POSTGRES_URL.substring(0, 30) + '...'
    : 'NOT SET';

  return NextResponse.json({
    message: 'Environment Variables Status',
    variables: envVars,
    postgres_url_preview: urlPreview,
    vercel_env: process.env.VERCEL_ENV || 'NOT SET',
    node_env: process.env.NODE_ENV || 'NOT SET',
  });
}
