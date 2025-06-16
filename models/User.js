import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
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
