const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const jwtManager = require('../../../managers/jwtManager');
const mailerManager = require('../../../managers/mailerManager');

const register = async (req, res) => {
    const UserModel = mongoose.model('users');
    const { name, email, password, confirm_password, balance } = req.body;

    if(!name) throw "Name is required";
    if(!email) throw "Email is required";
    if(!password) throw "Password is required";
    if(!confirm_password) throw "Confirm Password is required";
    if(balance === undefined || balance === null) throw "Balance is required";

    if (password !== confirm_password) {
        throw "Passwords do not match";
    }

    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
        throw "Email already in use";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({ 
        name : name,
        email : email,
        password : hashedPassword,
        balance : balance
    });

    const token = jwtManager(newUser);

    mailerManager(newUser.email, "Welcome to Expense Tracker", "Thank you for registering!");

    res.status(201).json({ message: "User registered successfully", token: token });
}

const login = async (req, res) => {
    const UserModel = mongoose.model('users');
    const { email, password } = req.body;

    if (!email) throw "Email is required";
    if (!password) throw "Password is required";

    const user = await UserModel.findOne({ email: email });
    if (!user) throw "User not found";

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw "Invalid credentials";

    const token = jwtManager(user);

    res.status(200).json({ message: "Login successful", token: token });
}

const forgotPassword = async (req, res) => {
    const UserModel = mongoose.model('users');

    const { email } = req.body;

    if (!email) throw "Email is required";

    const user = await UserModel.findOne({ email: email });
    if (!user) throw "User not found";

    const resetCode = Math.floor(100000 + Math.random() * 900000);

    await UserModel.updateOne({ email: email }, { reset_code: resetCode });

    await mailerManager(email, "Password Reset Code", `Your password reset code is: ${resetCode}`);

    res.status(200).json({
        status: true,
        message: "Password reset instructions have been sent to your email",
    });
}

const resetPassword = async (req, res) => {
    const UserModel = mongoose.model('users');
    const { email, reset_code, new_password, confirm_password } = req.body;

    if (!email) throw "Email is required";
    if (!reset_code) throw "Reset code is required";
    if (!new_password) throw "New password is required";
    if (!confirm_password) throw "Confirm password is required";

    if (new_password !== confirm_password) {
        throw "New password and confirm password do not match";
    }

    const user = await UserModel.findOne({ email: email, reset_code: reset_code });
    if (!user) throw "Invalid reset code or email";

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await UserModel.updateOne({ email: email }, { password: hashedPassword, reset_code: null }, { runValidators: true });

    res.status(200).json({
        status: true,
        message: "Password has been reset successfully",
    });
}

module.exports = { register, login, forgotPassword, resetPassword };
