// sendGridHelper.js

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, text, callback) {
  const msg = {
    to,
    from: 'youremail@example.com', // Change this to your own verified email address
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent');
    callback(null, 'success');
  } catch (error) {
    console.error('Error sending email:', error);
    callback(error, null);
  }
}

module.exports = sendEmail;
