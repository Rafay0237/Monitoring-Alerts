const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendAlertEmail = async (to, projectName, count) => {

   try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: `🚨 Crash Alert: ${projectName}`,
      text: `Your project "${projectName}" has crashed ${count} times.`,
    });

    console.log("✅ Email sent successfully:");
    console.log("Message ID:", info.messageId);
    return true
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    return false
  }
};

module.exports = sendAlertEmail;
