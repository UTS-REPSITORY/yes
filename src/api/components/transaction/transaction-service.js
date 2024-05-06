const transactionsRepository = require('./transactions-repository');

/**
 * Get list of transactions
 * @returns {Array}
 */
async function getTransactions() {
  const transactions = await transactionsRepository.getTransactions();

  const results = [];
  for (let i = 0; i < transactions.length; i += 1) {
    const transaction = transactions[i];
    results.push({
      id: transaction.id,
      userId: transaction.userId,
      amount: transaction.amount,
      description: transaction.description,
    });
  }

  return results;
}

/**
 * Get transaction detail
 * @param {string} transactionId - Transaction ID
 * @returns {Object}
 */
async function getTransaction(transactionId) {
  const transaction = await transactionsRepository.getTransaction(transactionId);

  // Transaction not found
  if (!transaction) {
    return null;
  }

  return {
    id: transaction.id,
    userId: transaction.userId,
    amount: transaction.amount,
    description: transaction.description,
  };
}

/**
 * Create new transaction
 * @param {string} userId - User ID
 * @param {number} amount - Transaction amount
 * @param {string} description - Transaction description
 * @returns {boolean}
 */
async function createTransaction(userId, amount, description) {
  try {
    await transactionsRepository.createTransaction(userId, amount, description);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing transaction
 * @param {string} transactionId - Transaction ID
 * @param {number} amount - Transaction amount
 * @param {string} description - Transaction description
 * @returns {boolean}
 */
async function updateTransaction(transactionId, amount, description) {
  const transaction = await transactionsRepository.getTransaction(transactionId);

  // Transaction not found
  if (!transaction) {
    return null;
  }

  try {
    await transactionsRepository.updateTransaction(transactionId, amount, description);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete transaction
 * @param {string} transactionId - Transaction ID
 * @returns {boolean}
 */
async function deleteTransaction(transactionId) {
  const transaction = await transactionsRepository.getTransaction(transactionId);

  // Transaction not found
  if (!transaction) {
    return null;
  }

  try {
    await transactionsRepository.deleteTransaction(transactionId);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};