const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

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

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Cek jika limit tercapai
    if (checkLoginLimit(email)) {
      const attemptInfo = failedLoginAttempts[email];
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Too many failed login attempts. Please try again later.',
        {
          validation_errors: {
            timestamp: new Date().toISOString(),
            attemptCount: attemptInfo.attempts, // Mengembalikan jumlah upaya terakhir
          },
        }
      );
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // Tambahkan informasi percobaan yang gagal jika login gagal
      if (!failedLoginAttempts[email]) {
        failedLoginAttempts[email] = { attempts: 1, lastAttempt: Date.now() };
      } else {
        failedLoginAttempts[email].attempts++;
        failedLoginAttempts[email].lastAttempt = Date.now();
      }

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password',
        {
          validation_errors: {
            timestamp: new Date().toISOString(),
            attemptCount: failedLoginAttempts[email].attempts, // Mengembalikan jumlah upaya terakhir
          },
        }
      );
    }

    // Reset percobaan jika login berhasil
    if (failedLoginAttempts[email]) {
      failedLoginAttempts[email] = { attempts: 0, lastAttempt: null };
    }

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};