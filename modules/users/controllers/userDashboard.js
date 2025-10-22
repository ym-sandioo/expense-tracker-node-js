const mongoose = require('mongoose');

const userDashboard = async (req, res) => {
    const userModel = mongoose.model('users');
    const transactionModel = mongoose.model('transactions');

    const user = await userModel.findOne({ _id: req.user.userId }).select('-password -__v');

    const transactions = await transactionModel.find({ user_id: req.user.userId }).sort({ createdAt: -1 }).limit(5);

    res.status(200).json({ 
        status: true,
        message: "User dashboard data fetched successfully",
        user: user,
        transactions: transactions
    });
}

module.exports = userDashboard;
