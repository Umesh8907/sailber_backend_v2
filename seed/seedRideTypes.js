import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { RideType } from '../models/RideType.js';

dotenv.config();

const rideTypes = [
    { name: 'bike', capacity: 1, avgSpeed: 40, baseFare: 30, farePerKm: 2 },
    { name: 'car', capacity: 4, avgSpeed: 30, baseFare: 50, farePerKm: 8 },
    { name: 'erickshaw', capacity: 3, avgSpeed: 25, baseFare: 40, farePerKm: 5 }
];

const seedRideTypes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await RideType.deleteMany({});
        await RideType.insertMany(rideTypes);
        console.log('✅ Ride types seeded');
    } catch (err) {
        console.error('❌ Error seeding ride types:', err.message);
    } finally {
        mongoose.disconnect();
    }
};

seedRideTypes();
