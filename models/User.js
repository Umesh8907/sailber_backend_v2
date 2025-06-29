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
    addressName: {
        type: String,
        default: null,
        required: false
    },
    addressType: {
        type: String,
        enum: ['home', 'office','work', 'other'],
        default: 'home'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
    },

}, {
    timestamps: true
});

export const User = mongoose.model('User', userSchema);
