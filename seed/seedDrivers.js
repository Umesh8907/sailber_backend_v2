import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Driver } from '../models/Driver.js';
import { User } from '../models/User.js';

dotenv.config();

const seedDrivers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await Driver.deleteMany({});

        const users = await User.find({ role: 'driver' });
        if (users.length < 1) throw new Error('No driver-role users found');

        const driverLocations = [
            [77.2100, 28.6140], // [lng, lat]
            [77.2110, 28.6150]
        ];

        const vehicleTypes = ['bike', 'car'];

        const drivers = users.map((user, i) => ({
            name: user.name,
            userId: user._id,
            vehicleType: vehicleTypes[i % vehicleTypes.length],
            isOnline: true,
            location: {
                type: 'Point',
                coordinates: driverLocations[i % driverLocations.length]
            },
            averageRating: 5,
            totalRides: 0,
            vehicleNumber: `DL0${i + 1}AB1234`
        }));

        await Driver.insertMany(drivers);
        console.log('✅ Drivers seeded');
    } catch (err) {
        console.error('❌ Error seeding drivers:', err.message);
    } finally {
        mongoose.disconnect();
    }
};

seedDrivers();
