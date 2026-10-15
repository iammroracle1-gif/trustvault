import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request: NextRequest) {
  try {
    // Check if database is available
    const hasPostgres = !!(process.env.POSTGRES_URL || 
                           process.env.POSTGRES_PRISMA_URL || 
                           process.env.POSTGRES_URL_NON_POOLING);

    if (!hasPostgres) {
      return NextResponse.json({
        success: false,
        error: 'No Postgres environment variables found',
        variables: {
          POSTGRES_URL: !!process.env.POSTGRES_URL,
          POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
          POSTGRES_URL_NON_POOLING: !!process.env.POSTGRES_URL_NON_POOLING,
        }
      });
    }

    // Try to query the users table
    const result = await sql`
      SELECT 
        wallet_id, 
        email, 
        status,
        created_at 
      FROM users 
      LIMIT 5
    `;

    return NextResponse.json({
      success: true,
      database: 'connected',
      userCount: result.rows.length,
      sampleUsers: result.rows,
      message: 'Database is working correctly'
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      message: 'Database connection or query failed'
    }, { status: 500 });
  }
}
