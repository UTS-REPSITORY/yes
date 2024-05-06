const { Transaction } = require('../../../models');

/**
 * Get a list of transactions
 * @returns {Promise}
 */
async function getTransactions() {
  return Transaction.find({});
}

/**
 * Get transaction detail
 * @param {string} transactionId - Transaction ID
 * @returns {Promise}
 */
async function getTransaction(transactionId) {
  return Transaction.findById(transactionId);
}

/**
 * Create new transaction
 * @param {string} userId - User ID
 * @param {number} amount - Transaction amount
 * @param {string} description - Transaction description
 * @returns {Promise}
 */
async function createTransaction(userId, amount, description) {
  return Transaction.create({
    userId,
    amount,
    description,
  });
}

/**
 * Update existing transaction
 * @param {string} transactionId - Transaction ID
 * @param {number} amount - Transaction amount
 * @param {string} description - Transaction description
 * @returns {Promise}
 */
async function updateTransaction(transactionId, amount, description) {
  return Transaction.updateOne(
    {
      _id: transactionId,
    },
    {
      $set: {
        amount,
        description,
      },
    }
  );
}

/**
 * Delete a transaction
 * @param {string} transactionId - Transaction ID
 * @returns {Promise}
 */
async function deleteTransaction(transactionId) {
  return Transaction.deleteOne({ _id: transactionId });
}

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};