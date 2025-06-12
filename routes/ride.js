import express from 'express';
import { getNearbyRideTypes } from '../controllers/rideController.js';

const router = express.Router();

router.post('/ride-types/nearby', getNearbyRideTypes);

export default router;
