import express from 'express';
import { estimateRide } from './controllers/estimateRideController';
import { confirmRide } from './controllers/confirmRideController';
import { listRides } from './controllers/listRidesController';


const router = express.Router();

router.post('/ride/estimate', estimateRide);
router.patch('/ride/confirm', confirmRide);
router.get('/ride/:customer_id', listRides);

export default router;
