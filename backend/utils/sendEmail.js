const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || '',
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'My E-commerce Website'} <${process.env.EMAIL_USER || 'noreply@mywebsite.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`,
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const info = await transporter.sendMail(message);
      console.log(`[My E-commerce Email] Email sent: %s`, info.messageId);
    } else {
      console.log(`[My E-commerce Email Simulation] To: ${options.email} | Subject: ${options.subject}`);
      console.log(`[My E-commerce Email Content]: ${options.message}`);
    }
  } catch (error) {
    console.error(`[My E-commerce Email Error]: ${error.message}`);
    // Non-blocking email error logging so auth flow continues smoothly
  }
};

module.exports = sendEmail;
