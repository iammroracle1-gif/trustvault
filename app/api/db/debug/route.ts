import { NextResponse } from 'next/server';

export async function GET() {
  // List all environment variables related to database (without showing full values for security)
  const envVars = {
    POSTGRES_URL: process.env.POSTGRES_URL ? 'SET' : 'NOT SET',
    POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? 'SET' : 'NOT SET',
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ? 'SET' : 'NOT SET',
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    POSTGRES_HOST: process.env.POSTGRES_HOST ? 'SET' : 'NOT SET',
    POSTGRES_USER: process.env.POSTGRES_USER ? 'SET' : 'NOT SET',
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ? 'SET' : 'NOT SET',
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE ? 'SET' : 'NOT SET',
  };

  return NextResponse.json({
    environmentVariables: envVars,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  });
}
