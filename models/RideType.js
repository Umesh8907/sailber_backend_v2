import mongoose from 'mongoose';

const rideTypeSchema = new mongoose.Schema({
    name: { type: String, enum: ['okada', 'car', 'keke'], unique: true },
    capacity: Number,
    avgSpeed: Number,     // in km/h
    baseFare: Number,     // in INR
    farePerKm: Number,
    description: String,
});

export const RideType = mongoose.model('RideType', rideTypeSchema);
