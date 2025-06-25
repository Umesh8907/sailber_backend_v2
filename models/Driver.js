import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    vehicleType: {
        type: String,
        enum: ['okada', 'car', 'keke'],
        required: true
    },
    vehicleNumber: {
        type: String,
        default: null
    },
    isOnline: {
        type: Boolean,
        default: false
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
    averageRating: {
        type: Number,
        default: 5
    },
    totalRides: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

driverSchema.index({ location: '2dsphere' });

export const Driver = mongoose.model('Driver', driverSchema);
