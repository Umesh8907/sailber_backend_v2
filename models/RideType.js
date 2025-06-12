import mongoose from 'mongoose';

const rideTypeSchema = new mongoose.Schema({
    name: { type: String, enum: ['bike', 'car', 'erickshaw'], unique: true },
    capacity: Number,
    avgSpeed: Number,     // in km/h
    baseFare: Number,     // in INR
    farePerKm: Number     // in INR/km
});

export const RideType = mongoose.model('RideType', rideTypeSchema);
