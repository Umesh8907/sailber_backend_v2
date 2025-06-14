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

        const route = await getRouteInfo(pickup, drop);
        const rideTypes = await RideType.find({});
        const results = [];

        console.log('📍 Pickup Coordinates:', pickup);

        for (const type of rideTypes) {
            const drivers = await Driver.find({
                vehicleType: type.name,
                isOnline: true,
                location: {
                    $nearSphere: {
                        $geometry: { type: 'Point', coordinates: [pickup.lng, pickup.lat] },
                        $maxDistance: 10000
                    }
                }
            });

            // Calculate ETA to pickup for each driver
            const driverList = await getDriverETAs(drivers, pickup);

            if (driverList.length === 0) continue;

            // ✅ Add vehicleType to each driver
            const driverListWithVehicleType = driverList.map(driver => ({
                ...driver,
                vehicleType: type.name
            }));

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
                nearbyDriversAvailable: driverListWithVehicleType
            });
        }

        if (results.length === 0) {
            return res.status(200).json({
                message: 'No nearby rides available at the moment.',
                distanceInKm: route.distanceInKm,
                routePolyline: route.polyline,
                nearestRidesAvailable: []
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


export const getMyBookings = async (req, res) => {
    // try {
    //     const userId = req.user.uid;

    //     // Fetch bookings for the user
    //     const bookings = await RideType.find({ userId });

    //     if (!bookings || bookings.length === 0) {
    //         return res.status(404).json({ message: 'No bookings found for this user.' });
    //     }

    //     res.json(bookings);
    // } catch (err) {
    //     console.error('❌ Error in getMyBookings:', err);
    //     res.status(500).json({ error: 'Failed to fetch bookings' });
    // }
      res.json({
        message: `Welcome ${req.user.role}`,
        userId: req.user.uid,
      });
}
