const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error('SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM');
  }
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
}

async function sendOtpEmail(email, otp) {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const mailer = getTransporter();
  await mailer.sendMail({
    from,
    to: email,
    subject: 'VillageConnect OTP',
    text: `Your VillageConnect OTP is ${otp}. It will expire in 10 minutes.`,
    html: `<p>Your <b>VillageConnect OTP</b> is <b style="font-size:18px">${otp}</b>.</p><p>This OTP expires in 10 minutes.</p>`,
  });
}

module.exports = { sendOtpEmail };
