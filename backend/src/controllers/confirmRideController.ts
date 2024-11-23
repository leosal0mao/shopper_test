import { Request, Response } from 'express';
import { initializeDb } from '../database';

export const confirmRide = (req: Request, res: Response): void => {
    const { customer_id, origin, destination, distance, duration, driver, value } = req.body;

    if (!customer_id || !origin || !destination || !driver || !value) {
        res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Invalid input data.',
        });
        return;
    }

    const db = initializeDb();
    const driverExists = db
        .prepare<Driver>('SELECT * FROM drivers WHERE id = ?')
        .get(driver.id);

    if (!driverExists) {
        res.status(404).json({
            error_code: 'DRIVER_NOT_FOUND',
            error_description: 'Driver not found.',
        });
        return;
    }

    if (distance < driver.min_km) {
        res.status(406).json({
            error_code: 'INVALID_DISTANCE',
            error_description: 'Distance is too short for the driver.',
        });
        return;
    }


    try {
        db.prepare(
            `INSERT INTO rides 
             (customer_id, origin, destination, distance, duration, driver_id, value) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).run(customer_id, origin, destination, distance, duration, driver.id, value);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to confirm ride.' });
    }
};
