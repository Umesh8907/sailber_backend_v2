// utils/getDriverETAs.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function getDriverETAs(drivers, pickup) {
    if (!drivers.length) return [];

    const origins = drivers.map(driver =>
        `${driver.location.coordinates[1]},${driver.location.coordinates[0]}`
    ).join('|');

    const destination = `${pickup.lat},${pickup.lng}`;

    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';
    const params = {
        origins,
        destinations: destination,
        key: GOOGLE_MAPS_API_KEY
    };

    try {
        const response = await axios.get(url, { params });
        const rows = response.data.rows;

        return drivers.map((driver, index) => ({
            name: driver.name,
            latitude: driver.location.coordinates[1],
            longitude: driver.location.coordinates[0],
            estimatedTimeToPickup: rows[index]?.elements[0]?.duration?.text || 'N/A'
        }));
    } catch (err) {
        console.error('❌ Error in getDriverETAs:', err.message);
        return drivers.map(driver => ({
            name: driver.name,
            latitude: driver.location.coordinates[1],
            longitude: driver.location.coordinates[0],
            estimatedTimeToPickup: 'N/A'
        }));
    }
}
