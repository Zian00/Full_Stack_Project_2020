require('dotenv').config();
const { Client } = require('pg');
const moment = require('moment');

// Helper function to generate random performance data
function generatePerformanceData(count = 20) {
	const performances = [];
	const festivalIds = [1234567890, 9876543210]; // Example festival IDs

	for (let i = 0; i < count; i++) {
		// Generate a random date within next 30 days
		const startDate = moment().add(Math.floor(Math.random() * 30), 'days');
		const startTime = startDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
		// Performance duration between 30 mins to 3 hours
		const endTime = moment(startDate)
			.add(30 + Math.floor(Math.random() * 150), 'minutes')
			.format('YYYY-MM-DDTHH:mm:ss.SSSZ');

		performances.push({
			performanceId: 1000000000 + i, // 10-digit performance IDs
			festivalId:
				festivalIds[Math.floor(Math.random() * festivalIds.length)],
			startTime,
			endTime,
			popularity: Math.floor(Math.random() * 100) + 1, // 1-100 popularity score
		});
	}
	return performances;
}

async function seedDatabase() {
	const client = new Client({
		connectionString: process.env.DATABASE_URL,
		ssl:
			process.env.NODE_ENV === 'production'
				? {
						rejectUnauthorized: false,
				  }
				: false,
	});

	try {
		await client.connect();
		console.log('Connected to database');

		// Generate dummy data
		const performances = generatePerformanceData(20);

		// Insert into basic performance table
		for (const perf of performances) {
			await client.query(
				`INSERT INTO performance ("performanceId", "festivalId", "startTime", "endTime")
                 VALUES ($1, $2, $3, $4)`,
				[
					perf.performanceId,
					perf.festivalId,
					perf.startTime,
					perf.endTime,
				]
			);
		}
		console.log('Inserted data into performance table');

		// Insert into performance with popularity table
		for (const perf of performances) {
			await client.query(
				`INSERT INTO "performanceWithPopularity" 
                 ("performanceId", "festivalId", "startTime", "endTime", "popularity")
                 VALUES ($1, $2, $3, $4, $5)`,
				[
					perf.performanceId,
					perf.festivalId,
					perf.startTime,
					perf.endTime,
					perf.popularity,
				]
			);
		}
		console.log('Inserted data into performanceWithPopularity table');

		// Insert into advanced performance table
		for (const perf of performances) {
			await client.query(
				`INSERT INTO "performanceWithPopularityAdvanced" 
                 ("performanceId", "festivalId", "startTimeDate", "endTimeDate", "popularity")
                 VALUES ($1, $2, $3, $4, $5)`,
				[
					perf.performanceId,
					perf.festivalId,
					perf.startTime,
					perf.endTime,
					perf.popularity,
				]
			);
		}
		console.log(
			'Inserted data into performanceWithPopularityAdvanced table'
		);

		console.log('Database seeding completed successfully');
	} catch (err) {
		console.error('Error seeding database:', err);
		throw err;
	} finally {
		await client.end();
	}
}

// Run if called directly
if (require.main === module) {
	seedDatabase()
		.then(() => console.log('Done'))
		.catch((err) => {
			console.error('Failed:', err);
			process.exit(1);
		});
}

module.exports = seedDatabase;
