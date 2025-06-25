import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Driver } from './models/Driver.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name';

const seedDrivers = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const locations = [
            [77.5946, 12.9716],  // Bangalore
            [72.8777, 19.0760],  // Mumbai
            [88.3639, 22.5726],  // Kolkata
            [80.2707, 13.0827],  // Chennai
        ];

        const vehicleTypes = ['car', 'bike', 'erickshaw'];

        for (let i = 0; i < 10; i++) {
            const uid = `mock-driver-uid-${i}`;
            const name = `Driver ${i}`;
            const email = `driver${i}@example.com`;
            const location = locations[i % locations.length];
            const vehicleType = vehicleTypes[i % vehicleTypes.length];

            const user = await User.create({
                name,
                email,
                uid,
                role: 'driver'
            });

            await Driver.create({
                name,
                userId: user._id,
                vehicleType,
                vehicleNumber: `TEST${i + 100}`,
                isOnline: true,
                location: {
                    type: 'Point',
                    coordinates: location
                }
            });

            console.log(`✅ Seeded driver: ${name} (${vehicleType})`);
        }

        console.log('🚀 Driver seeding complete!');
        process.exit();
    } catch (err) {
        console.error('❌ Error seeding drivers:', err);
        process.exit(1);
    }
};

seedDrivers();
