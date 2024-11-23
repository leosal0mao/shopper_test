import { Request, Response } from 'express';
import { initializeDb } from '../database';

export const listRides = (req: Request, res: Response): void => {
    const { customer_id } = req.params;
    const { driver_id } = req.query;

    if (!customer_id) {
        res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Customer ID is required.',
        });
        return;
    }

    const db = initializeDb();
    try {
        const query = driver_id
            ? 'SELECT * FROM rides WHERE customer_id = ? AND driver_id = ? ORDER BY created_at DESC'
            : 'SELECT * FROM rides WHERE customer_id = ? ORDER BY created_at DESC';

        const rides = driver_id
            ? db.prepare(query).all(customer_id, driver_id)
            : db.prepare(query).all(customer_id);

        if (rides.length === 0) {
            res.status(404).json({
                error_code: 'NO_RIDES_FOUND',
                error_description: 'No rides found.',
            });
            return;
        }

        res.json({ customer_id, rides });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch rides.' });
    }
};
