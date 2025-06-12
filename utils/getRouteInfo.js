// utils/getRouteInfo.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function getRouteInfo(pickup, drop) {
    const url = 'https://maps.googleapis.com/maps/api/directions/json';
    const params = {
        origin: `${pickup.lat},${pickup.lng}`,
        destination: `${drop.lat},${drop.lng}`,
        key: GOOGLE_MAPS_API_KEY
    };

    try {
        const response = await axios.get(url, { params });
        const route = response.data.routes[0];
        const leg = route.legs[0];

        return {
            distanceInKm: leg.distance.value / 1000, // meters to km
            estimatedTimeInMinutes: leg.duration.value / 60, // seconds to minutes
            polyline: route.overview_polyline.points
        };
    } catch (err) {
        console.error('❌ Error in getRouteInfo:', err.message);
        throw new Error('Failed to fetch route info from Google Directions API');
    }
}
