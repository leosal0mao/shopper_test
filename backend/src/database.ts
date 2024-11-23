import Database from 'better-sqlite3';

export const initializeDb = () => {
    const db = new Database('./database.sqlite');

    db.exec(`
        CREATE TABLE IF NOT EXISTS drivers (
            id INTEGER PRIMARY KEY,
            name TEXT,
            description TEXT,
            vehicle TEXT,
            rating INTEGER,
            rate_per_km REAL,
            min_km INTEGER
        );

        CREATE TABLE IF NOT EXISTS rides (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id TEXT,
            origin TEXT,
            destination TEXT,
            distance REAL,
            duration TEXT,
            driver_id INTEGER,
            value REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);

    return db;
};
