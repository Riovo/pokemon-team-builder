const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    teams: [
        {
            name: { type: String, required: true }, // Team name
            members: [
                {
                    id: { type: Number, required: true },
                    name: { type: String, required: true },
                    types: { type: [String], required: true },
                    image: { type: String, required: true },
                    stats: { type: Object, required: true }, // Store all stats as an object
                },
            ],
        },
    ],
});

// Pre-save middleware to hash the password before saving
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
