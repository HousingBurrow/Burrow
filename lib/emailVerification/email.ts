/**
 * Email utility functions for sending verification emails
 * Uses dynamic import to handle Turbopack module resolution
 */

/**
 * Send a verification email with a 6-digit code
 */
export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  try {
    // Validate environment variables
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      throw new Error('SMTP credentials not configured. Check your environment variables.');
    }

    // Dynamic import to handle Turbopack
    const nodemailer = (await import('nodemailer')).default;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify connection configuration
    await transporter.verify();

    const mailOptions = {
      from: `"RoommateFinder" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Verify Your Student Email - RoommateFinder',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1890ff;">RoommateFinder</h1>
            <h2 style="color: #333;">Verify Your Student Email</h2>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 15px 0; font-size: 16px; color: #666;">Your verification code is:</p>
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1890ff; background: white; padding: 20px; border-radius: 8px; border: 2px dashed #1890ff;">
              ${code}
            </div>
            <p style="margin: 15px 0 0 0; font-size: 14px; color: #999;">This code expires in 10 minutes</p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107;">
            <p style="margin: 0; font-size: 14px; color: #856404;">
              <strong>Security Note:</strong> If you didn't request this verification code, please ignore this email. 
              Your account security has not been compromised.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 12px; color: #999;">
              This email was sent by RoommateFinder to verify your student email address.
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return false;
  }
}

/**
 * Test the SMTP connection
 */
export async function testEmailConnection(): Promise<boolean> {
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.error('❌ SMTP credentials not configured');
      return false;
    }

    // Dynamic import to handle Turbopack
    const nodemailer = (await import('nodemailer')).default;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.verify();
    console.log('✅ SMTP connection successful');
    return true;
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    return false;
  }
}

/**
 * Generate a random 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}