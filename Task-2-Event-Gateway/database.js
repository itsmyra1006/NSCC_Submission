// database.js

const { Client } = require('pg');

let dbClient;

async function initializeDatabase() {
    if (dbClient) return dbClient; // Return existing client if already connected

    try {
        // Render provides the DATABASE_URL environment variable
        // for local development, you would need to set this yourself.
        const connectionString = process.env.DATABASE_URL;

        dbClient = new Client({
            connectionString: connectionString,
            ssl: {
                rejectUnauthorized: false // Required for Render's PostgreSQL connections
            }
        });

        await dbClient.connect();
        console.log('✅ Connected to PostgreSQL database.');

        // Create the participants table if it doesn't exist
        await dbClient.query(`
            CREATE TABLE IF NOT EXISTS participants (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                "registrationId" TEXT NOT NULL UNIQUE,
                "uniqueToken" TEXT NOT NULL UNIQUE,
                status TEXT NOT NULL DEFAULT 'Registered',
                "checkInTimestamp" TIMESTAMPTZ
            );
        `);

        console.log('✅ Database table is ready.');
        return dbClient;
    } catch (error) {
        console.error('❌ Error initializing PostgreSQL database:', error);
        process.exit(1);
    }
}

module.exports = { initializeDatabase };