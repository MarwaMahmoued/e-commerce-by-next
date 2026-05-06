import nodemailer from 'nodemailer';

export const sendWelcomeEmail = async (userEmail, userName, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });


  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

  const mailOptions = {
    from: `"My Store" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Verify Your Email - My Store 🛍️',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
        <h1 style="color: #2563eb;">Welcome, ${userName}!</h1>
        <p style="font-size: 16px; color: #333;">Thank you for joining our store. We are excited to have you with us.</p>
        <p style="font-size: 14px; color: #666;">Please click the button below to verify your email address and activate your account:</p>
        
        <div style="margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
             Verify My Email
          </a>
        </div>
        
        <p style="font-size: 12px; color: #999;">If you didn't create an account, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #bbb;">&copy; 2026 My Perfect Store. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};