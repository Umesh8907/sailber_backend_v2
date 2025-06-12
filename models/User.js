import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['rider', 'driver'],
        default: 'rider'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profilePicture: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

export const User = mongoose.model('User', userSchema);
