const mongoose = require('mongoose');
const validator = require('validator');

const addBalance = async (req, res) => {
    const userModel = mongoose.model('users');
    const transactionModel = mongoose.model('transactions');

    const { amount, remarks } = req.body;

    if (!amount) throw "Amount is required";
    if (!remarks) throw "Remarks are required";
    if (remarks.length < 5) throw "Remarks must be at least 5 characters long";

    if (!validator.isNumeric(amount.toString())) {
        throw "Amount must be a numeric value";
    }

    await transactionModel.create({
        user_id: req.user.userId,
        amount: amount,
        transaction_type: 'income',
        remarks: remarks
    });

    await userModel.findByIdAndUpdate(
        req.user.userId,
        { $inc: { balance: amount } }
    );
    
    res.status(200).json({
        status: true,
        message: "Create transaction successful", 
    });
}

const addExpense = async (req, res) => {
    const userModel = mongoose.model('users');
    const transactionModel = mongoose.model('transactions');

    const { amount, remarks } = req.body;

    if (!amount) throw "Amount is required";
    if (!remarks) throw "Remarks are required";
    if (remarks.length < 5) throw "Remarks must be at least 5 characters long";
    if (!validator.isNumeric(amount.toString())) {
        throw "Amount must be a numeric value";
    }

    await transactionModel.create({
        user_id: req.user.userId,
        amount: amount,
        transaction_type: 'expense',
        remarks: remarks
    });

    await userModel.findByIdAndUpdate(
        req.user.userId,
        { $inc: { balance: -amount } }
    );

    res.status(200).json({
        status: true,
        message: "Expense transaction successful", 
    });

}

const getTransaction = async (req, res) => {
    const transactionModel = mongoose.model('transactions');
    const transactions = await transactionModel.find({ 
        user_id: req.user.userId,
        ...req.query  // Allow filtering based on query parameters
    }).sort({ createdAt: -1 });

    res.status(200).json({ 
        status: true, 
        message: "Get transaction successful", 
        data: transactions 
    });
}

const deleteTransaction = async (req, res) => {
    const transactionModel = mongoose.model('transactions');
    const userModel = mongoose.model('users');
    const { transactionId } = req.params;

    if(validator.isMongoId(transactionId) === false) {
        throw "Invalid transaction ID";
    }

    const transaction = await transactionModel.findOne({ 
        _id: transactionId,
        user_id: req.user.userId 
    });

    if (transaction.transaction_type === 'income') {
        await userModel.findByIdAndUpdate(
            req.user.userId,
            { $inc: { balance: -transaction.amount } },
            { runValidators: true }
        );
    } else if (transaction.transaction_type === 'expense') {
        await userModel.findByIdAndUpdate(
            req.user.userId,
            { $inc: { balance: transaction.amount } },
            { runValidators: true }
        );
    }

    if (!transaction) throw "Transaction not found";

    await transactionModel.deleteOne({ _id: transactionId });

    res.status(200).json({ 
        status: true, 
        message: "Delete transaction successful" 
    });
}

const updateTransaction = async (req, res) => {
    const transactionModel = mongoose.model('transactions');
    const userModel = mongoose.model('users');
    const { transactionId } = req.params;
    const { amount, remarks, transaction_type } = req.body;

    if(validator.isMongoId(transactionId) === false) {
        throw "Invalid transaction ID";
    }

    const transaction = await transactionModel.findOne({ 
        _id: transactionId,
        user_id: req.user.userId 
    });

    if (!transaction) throw "Transaction not found";

    if (transaction.transaction_type !== transaction_type) {
        throw "Transaction type cannot be changed";
    }

    if (transaction.amount !== amount) {
        const amountDifference = amount - transaction.amount;

        if (transaction.transaction_type === 'income') {
            await userModel.findByIdAndUpdate(
                req.user.userId,
                { $inc: { balance: amountDifference } },
                { runValidators: true }
            );
        } else if (transaction.transaction_type === 'expense') {
            await userModel.findByIdAndUpdate(
                req.user.userId,
                { $inc: { balance: -amountDifference } },
                { runValidators: true }
            );
        }
    }

    await transactionModel.updateOne(
        { _id: transactionId },
        { amount: amount, remarks: remarks },
        { runValidators: true }
    );

    res.status(200).json({
        status: true,
        message: "Update transaction successful", 
    });
}   

module.exports = { addBalance, addExpense , getTransaction, deleteTransaction, updateTransaction };
