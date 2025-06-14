import express from 'express';
import { tokenExchange } from '../controllers/authController';


const router = express.Router();

router.post('/exchange', tokenExchange);

export default router;
