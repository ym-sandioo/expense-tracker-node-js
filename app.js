const express = require('express');
const errorHandler = require('./handlers/errorHandler');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./modules/users/users.routes');
const transactionRouter = require('./modules/transcactions/transactions.route');

dotenv.config();

mongoose.connect(process.env.mongodb_connection, {}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);  
});

const app = express();

require('./models/users.model');
require('./models/transactions.model');

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/transactions", transactionRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});