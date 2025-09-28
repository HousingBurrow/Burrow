import { NextResponse } from 'next/server';
import { sendVerificationEmail, generateVerificationCode } from '@/lib/emailVerification/email';
import { createVerificationCode } from '@/lib/queries/verifications';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    console.log('📧 Verification request for:', email);

    // Validate email
    if (!email || !email.includes('@')) {
      console.log('❌ Invalid email format');
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Validate it's a student email (adjust domains as needed)
    const validDomains = ['gatech.edu', 'gmail.com']; // Add your allowed domains
    const domain = email.split('@')[1];
    
    if (!validDomains.some(d => domain.endsWith(d))) {
      console.log('❌ Invalid domain:', domain);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please use a valid student email address' 
        },
        { status: 400 }
      );
    }

    // Generate verification code
    const code = generateVerificationCode();
    console.log('🔢 Generated code:', code);

    // Save to database
    console.log('💾 Saving to database...');
    const dbResult = await createVerificationCode(email, code);
    
    if (dbResult.isError) {
      console.log('❌ Database error:', dbResult.message);
      return NextResponse.json(
        { success: false, error: dbResult.message },
        { status: 429 } // Too Many Requests
      );
    }

    console.log('✅ Saved to database');

    // Send email
    console.log('📨 Sending email...');
    const emailSent = await sendVerificationEmail(email, code);

    if (!emailSent) {
      console.log('❌ Failed to send email');
      return NextResponse.json(
        { success: false, error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    console.log('✅ Email sent successfully');
    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
    });
  } catch (error) {
    console.error('❌ Send verification error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}