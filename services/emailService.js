// services/emailService.js
import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || 'connect@radcred.com',
        pass: process.env.SMTP_PASS || 'Connect@0205',
      }
    });

    this.fromEmail = process.env.EMAIL_FROM || 'connect@radcred.com';
  }

  /**
   * Send email to user when lead is SOLD (Result 1)
   */
  async sendSoldEmail(leadData) {
    try {
      const mailOptions = {
        from: `"RadCred" <${this.fromEmail}>`,
        to: leadData.email,
        subject: 'Congratulations - You Found a Match!',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .email-box { background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .logo-section { background: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 3px solid #2563eb; }
              .content { padding: 40px 30px; }
              .congrats { color: #059669; font-size: 24px; font-weight: bold; margin: 0 0 20px 0; }
              .footer { background: #1f2937; color: #9ca3af; padding: 25px; text-align: center; font-size: 12px; }
              .footer a { color: #60a5fa; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="email-box">
                <!-- Logo Section -->
                <div class="logo-section">
                  <a href="https://radcred.com/" target="_blank">
                    <img src="https://radcred.com/media/2022/11/RadCred-Logo-Small-Size.png" alt="RadCred Logo" width="300" style="max-width: 100%; height: auto;" />
                  </a>
                </div>
                
                <!-- Main Content -->
                <div class="content">
                  <p style="font-size: 18px; margin: 0 0 25px 0;">Hi <strong>${leadData.firstName} ${leadData.lastName}</strong>,</p>
                  
                  <p class="congrats">🎉 Congratulations!</p>
                  
                  <p>Your application has been successfully matched with a lender. You're all set to move forward with your loan.</p>
                  
                  <p>If you need additional funds down the road, visit <a href="https://radcred.com/" style="color: #2563eb; text-decoration: none; font-weight: 600;">RadCred</a> for fast, fair loans.</p>
                  
                  <p style="margin-top: 30px;">
                    Best of luck,<br>
                    <strong>RadCred Team</strong>
                  </p>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                  <p style="margin: 0 0 10px 0;">
                    <a href="https://radcred.com/">RadCred.com</a> | 
                    <a href="https://radcred.com/privacy-policy/">Privacy Policy</a> | 
                    <a href="https://radcred.com/terms-of-use/">Terms of Use</a>
                  </p>
                  <p style="margin: 0;">© ${new Date().getFullYear()} RadCred. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Sold confirmation email sent to:', leadData.email);
      return { success: true, messageId: result.messageId };

    } catch (error) {
      console.error('❌ Error sending sold email:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send email to user when lead is REJECTED (Result 2)
   */
  async sendRejectedEmail(leadData, offerUrl) {
    try {
      const mailOptions = {
        from: `"RadCred" <${this.fromEmail}>`,
        to: leadData.email,
        subject: 'We Found a Match! Your Top Loan Option is Ready',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .email-box { background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
              .logo-section { background: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 3px solid #2563eb; }
              .content { padding: 40px 30px; }
              .highlight { color: #2563eb; font-size: 20px; font-weight: bold; margin: 20px 0; }
              .btn { display: inline-block; background: #2563eb; color: #ffffff !important; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 25px 0; }
              .btn:hover { background: #1d4ed8; }
              .cta-section { text-align: center; margin: 30px 0; }
              .footer { background: #1f2937; color: #9ca3af; padding: 25px; text-align: center; font-size: 12px; }
              .footer a { color: #60a5fa; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="email-box">
                <!-- Logo Section -->
                <div class="logo-section">
                  <a href="https://radcred.com/" target="_blank">
                    <img src="https://radcred.com/media/2022/11/RadCred-Logo-Small-Size.png" alt="RadCred Logo" width="300" style="max-width: 100%; height: 100;" />
                  </a>
                </div>
                
                <!-- Main Content -->
                <div class="content">
                  <p style="font-size: 18px; margin: 0 0 25px 0;">Hi <strong>${leadData.firstName} ${leadData.lastName}</strong>,</p>
                  
                  <p class="highlight">Great news! We've found a perfect match.</p>
                  
                  <p>Based on your application, we identified the lender offering the best terms for you. Your personalized loan offer is ready for review.</p>
                  
                  <p>Click below to see your top match and complete your application:</p>
                  
                  <div class="cta-section">
                    <a href="${offerUrl}" class="btn" target="_blank">View Your Loan Offer →</a>
                  </div>
                  
                  <p><strong>This lender is ready to move fast and get you the cash you need.</strong></p>
                  
                  <p style="color: #6b7280; font-size: 14px;">Need help? Reply to this email or contact us.</p>
                  
                  <p style="margin-top: 30px;">
                    Cheers,<br>
                    <strong>RadCred Team</strong>
                  </p>
                </div>
                
                <!-- Footer -->
                <div class="footer">
                  <p style="margin: 0 0 10px 0;">
                    <a href="https://radcred.com/">RadCred.com</a> | 
                    <a href="https://radcred.com/privacy-policy/">Privacy Policy</a> | 
                    <a href="https://radcred.com/terms-of-use/">Terms of Use</a>
                  </p>
                  <p style="margin: 0;">© ${new Date().getFullYear()} RadCred. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Rejected offer email sent to:', leadData.email);
      return { success: true, messageId: result.messageId };

    } catch (error) {
      console.error('❌ Error sending rejected email:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send email for SOLD lead (Result 1)
   */
  async sendSoldLeadEmails(leadData) {
    console.log('📧 Sending SOLD lead email...');
    return await this.sendSoldEmail(leadData);
  }

  /**
   * Send email for REJECTED lead (Result 2)
   */
  async sendRejectedLeadEmail(leadData, offerUrl) {
    console.log('📧 Sending REJECTED lead email...');
    return await this.sendRejectedEmail(leadData, offerUrl);
  }
}

export default new EmailService();
