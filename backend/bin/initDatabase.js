require('dotenv').config();
const { Client } = require('pg');

async function initializeDatabase() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? {
            rejectUnauthorized: false
        } : false
    });

    try {
        await client.connect();
        
        // Create basic performance table
        await client.query(`
            DROP TABLE IF EXISTS performance;
            CREATE TABLE performance (
                id SERIAL PRIMARY KEY,
                "performanceId" BIGINT UNIQUE NOT NULL,
                "festivalId" BIGINT NOT NULL,
                "startTime" VARCHAR NOT NULL,
                "endTime" VARCHAR NOT NULL
            );
        `);
        console.log('Created basic performance table');

        // Create performance with popularity table
        await client.query(`
            DROP TABLE IF EXISTS "performanceWithPopularity";
            CREATE TABLE "performanceWithPopularity" (
                id SERIAL PRIMARY KEY,
                "performanceId" BIGINT UNIQUE NOT NULL,
                "festivalId" BIGINT NOT NULL,
                "startTime" VARCHAR NOT NULL,
                "endTime" VARCHAR NOT NULL,
                popularity INT NOT NULL
            );
        `);
        console.log('Created performance with popularity table');

        // Create advanced performance table
        await client.query(`
            DROP TABLE IF EXISTS "performanceWithPopularityAdvanced";
            CREATE TABLE "performanceWithPopularityAdvanced" (
                id SERIAL PRIMARY KEY,
                "performanceId" BIGINT UNIQUE NOT NULL,
                "festivalId" BIGINT NOT NULL,
                "startTimeDate" VARCHAR NOT NULL,
                "endTimeDate" VARCHAR NOT NULL,
                popularity INT NOT NULL
            );
        `);
        console.log('Created advanced performance table');

        console.log('Database initialization completed successfully');
    } catch (err) {
        console.error('Error initializing database:', err);
        throw err;
    } finally {
        await client.end();
    }
}

// Run if called directly
if (require.main === module) {
    initializeDatabase()
        .then(() => console.log('Done'))
        .catch(err => {
            console.error('Failed:', err);
            process.exit(1);
        });
}

module.exports = initializeDatabase; 