const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: [true, "User ID is required"],
    },
    amount: { 
        type: Number, 
        required: [true, "Amount is required"], 
    },
    transaction_type: { 
        type: String,
        enum: ['income', 'expense'],
        required: [true, "Transaction type is required"] 
    },
    remarks: { 
        type: String, 
        required: [true, "Remarks are required"]
    },
}, { timestamps: true });

const Transaction = mongoose.model('transactions', transactionSchema);

module.exports = Transaction;
