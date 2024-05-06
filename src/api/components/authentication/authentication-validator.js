const joi = require('joi');

// Simpan informasi percobaan login yang gagal
let failedLoginAttempts = {};

// Fungsi untuk memeriksa batasan limit dan reset percobaan login
const checkLoginLimit = (email) => {
  const attemptInfo = failedLoginAttempts[email];
  if (attemptInfo) {
    const { attempts, lastAttempt } = attemptInfo;
    const now = Date.now();
    // Cek jika sudah lebih dari 5 percobaan dan masih dalam jangka waktu 30 menit
    if (attempts >= 5 && now - lastAttempt < 30 * 60 * 1000) {
      return true; // Limit tercapai
    }
    // Reset percobaan jika sudah lebih dari 30 menit
    if (now - lastAttempt >= 30 * 60 * 1000) {
      failedLoginAttempts[email] = { attempts: 0, lastAttempt: null }; // Reset percobaan
    }
  }
  return false; // Limit belum tercapai
};

module.exports = {
  login: {
    body: {
      email: joi.string().email().required().label('Email'),
      password: joi.string().required().label('Password'),
    },
  },
  validateLogin: (req, res, next) => {
    const { email } = req.body;

    // Cek jika limit tercapai
    if (checkLoginLimit(email)) {
      const attemptInfo = failedLoginAttempts[email];
      return res.status(403).json({
        statusCode: 403,
        error: 'INVALID_CREDENTIALS_ERROR',
        description: 'Invalid credentials',
        message: 'Too many failed login attempts. Please try again later.',
        validation_errors: {
          timestamp: new Date().toISOString(),
          attemptCount: attemptInfo.attempts, // Mengembalikan jumlah upaya terakhir
        },
      });
    }

    // Validasi menggunakan Joi
    const schema = {
      email: joi.string().email().required().label('Email'),
      password: joi.string().required().label('Password'),
    };

    const result = joi.validate(req.body, schema);

    if (result.error) {
      // Tambahkan informasi percobaan yang gagal jika validasi gagal
      if (!failedLoginAttempts[email]) {
        failedLoginAttempts[email] = { attempts: 1, lastAttempt: Date.now() };
      } else {
        failedLoginAttempts[email].attempts++;
        failedLoginAttempts[email].lastAttempt = Date.now();
      }

      return res.status(403).json({
        statusCode: 403,
        error: 'INVALID_CREDENTIALS_ERROR',
        description: 'Invalid credentials',
        message: 'Wrong email or password.',
        validation_errors: {
          timestamp: new Date().toISOString(),
          attemptCount: failedLoginAttempts[email].attempts, // Mengembalikan jumlah upaya terakhir
        },
      });
    }

    next();
  },
  handleLoginAttempt: (email, success) => {
    if (!failedLoginAttempts[email]) {
      failedLoginAttempts[email] = { attempts: 0, lastAttempt: null };
    }
    if (success) {
      delete failedLoginAttempts[email]; // Reset jika berhasil login
    } else {
      failedLoginAttempts[email].attempts++;
      failedLoginAttempts[email].lastAttempt = Date.now();
    }
  },
};