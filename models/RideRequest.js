import mongoose from 'mongoose';

const rideRequestSchema = new mongoose.Schema({
    riderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null },
    vehicleType: { type: String, enum: ['bike', 'car', 'erickshaw'] },
    pickup: {
        lat: Number,
        lng: Number
    },
    drop: {
        lat: Number,
        lng: Number
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'started', 'completed', 'cancelled'],
        default: 'pending'
    },
    distanceInKm: Number,
    estimatedTime: String,
    estimatedFare: Number,
    routePolyline: String,
    createdAt: { type: Date, default: Date.now }
});

export const RideRequest = mongoose.model('RideRequest', rideRequestSchema);
