require('dotenv').config();
const { Client } = require('pg');
const moment = require('moment');

// Helper function to generate random performance data
function generatePerformanceData(count = 50) {
    const performances = [];
    const festivalIds = ["1100000001", "1100000002", "1100000003"]; // Example festival IDs
    
    for (let i = 0; i < count; i++) {
        // Generate a random date within next 30 days
        const startDate = moment().add(Math.floor(Math.random() * 30), 'days');
        const endDate = moment(startDate).add(30 + Math.floor(Math.random() * 150), 'minutes');

        // Format times in HHMM format
        const starttime = startDate.format('HHmm');
        const endtime = endDate.format('HHmm');

        // Format for advanced table (YYYY/MM/DD HH:mm)
        const startTimeDate = startDate.format('YYYY/MM/DD HH:mm');
        const endTimeDate = endDate.format('YYYY/MM/DD HH:mm');

        performances.push({
            performanceid: (1000000000 + i).toString(), // 10-digit performance ID as string
            festivalid: festivalIds[Math.floor(Math.random() * festivalIds.length)],
            starttime,
            endtime,
            startTimeDate,
            endTimeDate,
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
                [perf.performanceid, perf.festivalid, perf.starttime, perf.endtime]
            );
        }
        console.log('Inserted data into performance table');

        // Insert into performance with popularity table
        for (const perf of performances) {
            await client.query(
                `INSERT INTO "performanceWithPopularity" 
                 ("performanceId", "festivalId", "startTime", "endTime", "popularity")
                 VALUES ($1, $2, $3, $4, $5)`,
                [perf.performanceid, perf.festivalid, perf.starttime, perf.endtime, perf.popularity]
            );
        }
        console.log('Inserted data into performanceWithPopularity table');

        // Insert into advanced performance table
        for (const perf of performances) {
            await client.query(
                `INSERT INTO "performanceWithPopularityAdvanced" 
                 ("performanceId", "festivalId", "startTimeDate", "endTimeDate", "popularity")
                 VALUES ($1, $2, $3, $4, $5)`,
                [perf.performanceid, perf.festivalid, perf.startTimeDate, perf.endTimeDate, perf.popularity]
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