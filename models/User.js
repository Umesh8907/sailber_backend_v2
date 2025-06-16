import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false,
        unique: true
    },
    email: {
        type: String,
        required: false,
        unique: true
    },

    role: {
        type: String,
        enum: ['rider', 'driver'],
        default: 'rider'
    },

    profilePicture: {
        type: String,
        default: null
    }
    ,

    emergencyContact: {

        type: String,
        required: false,
        default: null,

    },
    primaryAddress: {
        type: String,
        default: null,
        required: false
    },

}, {
    timestamps: true
});

export const User = mongoose.model('User', userSchema);
