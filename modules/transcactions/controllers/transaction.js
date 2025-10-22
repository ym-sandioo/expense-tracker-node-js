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

const gettransaction = async (req, res) => {
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

module.exports = { addBalance, addExpense , gettransaction };
