import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    // Debug: Check which environment variables are available
    const envDebug = {
      POSTGRES_URL: process.env.POSTGRES_URL ? 'SET' : 'NOT SET',
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? 'SET' : 'NOT SET',
      POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ? 'SET' : 'NOT SET',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    };

    // Check if database is configured - check multiple env vars for different providers
    if (!process.env.POSTGRES_URL && 
        !process.env.POSTGRES_PRISMA_URL && 
        !process.env.POSTGRES_URL_NON_POOLING) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured. Add Vercel Postgres in your Vercel dashboard.',
        debug: envDebug,
      }, { status: 500 });
    }

    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        wallet_id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        wallet_address VARCHAR(255) UNIQUE NOT NULL,
        balance DECIMAL(18, 2) DEFAULT 0.00,
        withdrawal_restricted BOOLEAN DEFAULT false,
        restriction_reason TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        total_transactions INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active'
      )
    `;

    // Create transactions table
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(wallet_id),
        type VARCHAR(50),
        amount DECIMAL(18, 2),
        note TEXT,
        old_balance DECIMAL(18, 2),
        new_balance DECIMAL(18, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        admin_id VARCHAR(255)
      )
    `;

    // Create admin sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP
      )
    `;

    // Create indexes for performance
    await sql`CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully',
      tables: ['users', 'transactions', 'admin_sessions'],
    });
  } catch (error: any) {
    console.error('Database initialization error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
