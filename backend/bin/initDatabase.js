require('dotenv').config();
const { Client } = require('pg');
const moment = require('moment');

// Helper function to generate random performance data
function generatePerformanceData(count = 50) {
    const performances = [];
    const festivalIds = [1234567890, 9876543210]; // Example festival IDs
    
    for (let i = 0; i < count; i++) {
        // Generate a random date within next 30 days
        const startDate = moment().add(Math.floor(Math.random() * 30), 'days');
        const startTime = startDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
        // Performance duration between 30 mins to 3 hours
        const endTime = moment(startDate).add(30 + Math.floor(Math.random() * 150), 'minutes')
            .format('YYYY-MM-DDTHH:mm:ss.SSSZ');

        performances.push({
            performanceId: 1000000000 + i, // 10-digit performance IDs
            festivalId: festivalIds[Math.floor(Math.random() * festivalIds.length)],
            startTime,
            endTime,
            popularity: Math.floor(Math.random() * 100) + 1 // 1-100 popularity score
        });
    }
    return performances;
}

async function initializeDatabase() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? {
            rejectUnauthorized: false
        } : false
    });

    try {
        await client.connect();
        console.log('Connected to database');
        
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

        // Generate and insert dummy data
        const performances = generatePerformanceData(50);
        
        // Insert into basic performance table
        for (const perf of performances) {
            await client.query(
                `INSERT INTO performance ("performanceId", "festivalId", "startTime", "endTime")
                 VALUES ($1, $2, $3, $4)`,
                [perf.performanceId, perf.festivalId, perf.startTime, perf.endTime]
            );
        }
        console.log('Inserted data into performance table');

        // Insert into performance with popularity table
        for (const perf of performances) {
            await client.query(
                `INSERT INTO "performanceWithPopularity" 
                 ("performanceId", "festivalId", "startTime", "endTime", "popularity")
                 VALUES ($1, $2, $3, $4, $5)`,
                [perf.performanceId, perf.festivalId, perf.startTime, perf.endTime, perf.popularity]
            );
        }
        console.log('Inserted data into performanceWithPopularity table');

        // Insert into advanced performance table
        for (const perf of performances) {
            await client.query(
                `INSERT INTO "performanceWithPopularityAdvanced" 
                 ("performanceId", "festivalId", "startTimeDate", "endTimeDate", "popularity")
                 VALUES ($1, $2, $3, $4, $5)`,
                [perf.performanceId, perf.festivalId, perf.startTime, perf.endTime, perf.popularity]
            );
        }
        console.log('Inserted data into performanceWithPopularityAdvanced table');

        console.log('Database initialization and seeding completed successfully');
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