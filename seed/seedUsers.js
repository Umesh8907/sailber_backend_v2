import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('password123', 10);

        const users = [
            {
                name: 'Driver A',
                phone: '+911234567890',
                email: 'drivera@example.com',
                role: 'driver',
                passwordHash,
                isVerified: true
            },
            {
                name: 'Driver B',
                phone: '+911234567891',
                email: 'driverb@example.com',
                role: 'driver',
                passwordHash,
                isVerified: true
            },
            {
                name: 'Rider A',
                phone: '+911234567892',
                email: 'ridera@example.com',
                role: 'rider',
                passwordHash,
                isVerified: true
            }
        ];

        const insertedUsers = await User.insertMany(users);
        console.log('✅ Users seeded');
        return insertedUsers;
    } catch (err) {
        console.error('❌ Error seeding users:', err.message);
    } finally {
        mongoose.disconnect();
    }
};

seedUsers();
