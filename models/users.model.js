const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Name is required"],
    },
    email: { 
        type: String, 
        required: [true, "Email is required"], 
        unique: true 
    },
    password: { 
        type: String, 
        required: [true, "Password is required"] 
    },
    balance: { 
        type: Number, 
        default: 0,
        required: [true, "Balance is required"]
    },
    reset_code: { 
        type: Number 
    },
}, { timestamps: true });

const User = mongoose.model('users', userSchema);

module.exports = User;
