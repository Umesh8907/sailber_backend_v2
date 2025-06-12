// controllers/rideController.js
import { RideType } from '../models/RideType.js';
import { Driver } from '../models/Driver.js';
import { getRouteInfo } from '../utils/getRouteInfo.js';
import { getDriverETAs } from '../utils/getDriverETAs.js';

export const getNearbyRideTypes = async (req, res) => {
    try {
        const { pickup, drop } = req.body;

        if (!pickup || !drop) {
            return res.status(400).json({ error: 'Pickup and drop locations are required.' });
        }

        // Get distance, time, and polyline between pickup and drop
        const route = await getRouteInfo(pickup, drop);
        const rideTypes = await RideType.find({});
        const results = [];

        for (const type of rideTypes) {
            // Find nearby drivers for this vehicle type
            const drivers = await Driver.find({
                vehicleType: type.name,
                isOnline: true,
                location: {
                    $nearSphere: {
                        $geometry: { type: 'Point', coordinates: [pickup.lng, pickup.lat] },
                        $maxDistance: 5000 // 5km radius
                    }
                }
            });

            // Calculate ETA to pickup for each driver
            const driverList = await getDriverETAs(drivers, pickup);

            const estimatedTime = Math.ceil(route.distanceInKm / type.avgSpeed * 60);
            const estimatedPrice = Math.round(type.baseFare + (type.farePerKm * route.distanceInKm));

            results.push({
                name: type.name,
                capacity: type.capacity,
                baseFare: type.baseFare,
                farePerKm: type.farePerKm,
                avgSpeed: type.avgSpeed,
                estimatedPrice,
                estimatedTime: `${estimatedTime} mins`,
                nearbyDriversAvailable: driverList
            });
        }

        res.json({
            distanceInKm: route.distanceInKm,
            routePolyline: route.polyline,
            nearestRidesAvailable: results
        });

    } catch (err) {
        console.error('❌ Error in getNearbyRideTypes:', err);
        res.status(500).json({ error: 'Failed to fetch nearby ride types' });
    }
};
