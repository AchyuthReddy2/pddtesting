const OTP_TTL_MS = Number(process.env.OTP_TTL_MS || 10 * 60 * 1000);

const otpByEmail = new Map();

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function saveOtp(email, otp) {
  otpByEmail.set(email, {
    otp,
    expiresAt: Date.now() + OTP_TTL_MS,
  });
}

function verifyOtp(email, otp) {
  const item = otpByEmail.get(email);
  if (!item) return false;
  if (Date.now() > item.expiresAt) {
    otpByEmail.delete(email);
    return false;
  }
  const ok = String(item.otp) === String(otp).trim();
  if (ok) otpByEmail.delete(email);
  return ok;
}

module.exports = { generateOtp, saveOtp, verifyOtp };
