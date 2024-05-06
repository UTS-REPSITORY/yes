const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const transactionsControllers = require('./transactions-controller');
const transactionsValidator = require('./transactions-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/transactions', route);

  // Get list of transactions
  route.get('/', authenticationMiddleware, transactionsControllers.getTransactions);

  // Create transaction
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(transactionsValidator.createTransaction),
    transactionsControllers.createTransaction
  );

  // Get transaction detail
  route.get('/:transactionId', authenticationMiddleware, transactionsControllers.getTransaction);

  // Update transaction
  route.put(
    '/:transactionId',
    authenticationMiddleware,
    celebrate(transactionsValidator.updateTransaction),
    transactionsControllers.updateTransaction
  );

  // Delete transaction
  route.delete('/:transactionId', authenticationMiddleware, transactionsControllers.deleteTransaction);
};