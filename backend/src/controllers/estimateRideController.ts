import { Request, Response } from 'express';
import { Client } from '@googlemaps/google-maps-services-js';
import { initializeDb } from '../database';

export const estimateRide = async (req: Request, res: Response): Promise<void> => {
    const { customer_id, origin, destination } = req.body;

    if (!customer_id || !origin || !destination || origin === destination) {
        res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Invalid input data.',
        });
        return;
    }

    const client = new Client({});
    try {
        const response = await client.directions({
            params: {
                origin,
                destination,
                key: process.env.GOOGLE_API_KEY!,
            },
        });

        const route = response.data.routes[0];
        const distanceKm = route.legs[0].distance.value / 1000; // Convertendo metros para quilômetros
        const duration = route.legs[0].duration.text;

        const db = initializeDb();
        const drivers = db
            .prepare('SELECT * FROM drivers WHERE min_km <= ?')
            .all(distanceKm);

        const options = drivers
            .map((driver: any) => ({
                id: driver.id,
                name: driver.name,
                description: driver.description,
                vehicle: driver.vehicle,
                review: {
                    rating: driver.rating,
                    comment: driver.description,
                },
                value: driver.rate_per_km * distanceKm,
            }))
            .sort((a: any, b: any) => a.value - b.value);

        res.json({
            origin: route.legs[0].start_location,
            destination: route.legs[0].end_location,
            distance: distanceKm,
            duration,
            options,
            routeResponse: route,
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to calculate route.' });
    }
};
