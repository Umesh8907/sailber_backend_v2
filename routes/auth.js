import express from 'express';
import { createProfile, tokenExchange } from '../controllers/authController.js';

const router = express.Router();

router.post('/exchange', tokenExchange);
router.post('/create-profile', createProfile)

export default router;
