const joi = require('joi');

module.exports = {
  createTransaction: {
    body: {
      userId: joi.string().required().label('User ID'),
      amount: joi.number().positive().required().label('Amount'),
      description: joi.string().required().label('Description'),
    },
  },

  updateTransaction: {
    body: {
      amount: joi.number().positive().label('Amount'),
      description: joi.string().label('Description'),
    },
    params: {
      transactionId: joi.string().required().label('Transaction ID'),
    },
  },
};