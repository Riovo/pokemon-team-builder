const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pokemon'
    }]
});

// Disable password hashing middleware
userSchema.pre('save', async function(next) {
    console.log("Pre-save middleware is disabled");
    next(); // Proceed without hashing
});

// Check if the provided password matches
userSchema.methods.matchPassword = async function(enteredPassword) {
    return enteredPassword === this.password; // Direct comparison without hashing
};

const User = mongoose.model('User', userSchema);

module.exports = User;
