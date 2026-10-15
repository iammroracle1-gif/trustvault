import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/database';
import { sendTransactionEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, walletAddress } = body;

    if (!email || !walletAddress) {
      return NextResponse.json({
        success: false,
        error: 'Email and wallet address are required',
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format',
      }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'Email already registered',
      }, { status: 409 });
    }

    // Generate wallet ID
    const walletId = `wallet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create user in database
    let user;
    try {
      user = await createUser({
        walletId,
        email,
        walletAddress,
      });
    } catch (dbError: any) {
      console.error('Database creation error:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Database connection failed. Please contact support.',
        details: dbError.message,
      }, { status: 500 });
    }

    if (!user) {
      console.error('User creation returned null');
      return NextResponse.json({
        success: false,
        error: 'Failed to create user in database. Please try again or contact support.',
      }, { status: 500 });
    }

    // Send welcome email
    try {
      await sendTransactionEmail({
        to: email,
        type: 'security',
        data: {
          title: 'Welcome to Trust Vault',
          message: 'Your wallet has been created successfully!',
          walletAddress: walletAddress,
        },
      });
    } catch (emailError) {
      console.log('Welcome email failed (non-critical):', emailError);
    }

    return NextResponse.json({
      success: true,
      data: {
        walletId: user.wallet_id,
        email: user.email,
        walletAddress: user.wallet_address,
      },
    });
  } catch (error: any) {
    console.error('User registration error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to register user',
    }, { status: 500 });
  }
}
