const express = require('express');
const auth = require('../../middlewares/auth');
const transaction = require('./controllers/transaction');

const transactionRouter = express.Router();

module.exports = transactionRouter;

transactionRouter.use(auth);
transactionRouter.post('/add-balance', transaction.addBalance);
transactionRouter.post('/add-expense', transaction.addExpense);
transactionRouter.get('/', transaction.getTransaction);
transactionRouter.delete('/:transactionId', transaction.deleteTransaction);
transactionRouter.patch('/:transactionId', transaction.updateTransaction);

module.exports = transactionRouter;