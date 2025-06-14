import express from 'express';
import { getMyBookings, getNearbyRideTypes } from '../controllers/rideController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.get('/my-bookings', authenticateJWT, getMyBookings);

router.post('/ride-types/nearby', getNearbyRideTypes);

export default router;
