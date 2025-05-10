require('dotenv').config();
const { Client } = require('pg')

// Use environment variable for connection string with a fallback for development
const CONNECTION_STRING = process.env.DATABASE_URL;

function connect() {
    if (!CONNECTION_STRING) {
        throw new Error('Database connection string is not configured. Please set DATABASE_URL environment variable.');
    }
    
    const client = new Client({
        connectionString: CONNECTION_STRING,
        ssl: process.env.NODE_ENV === 'production' ? {
            rejectUnauthorized: false
        } : false
    });
    
    client.connect();
    return client;
}

// reset Basic Table
function resetBasicTable(callback) {
    const client = connect();
    const query = `
        DROP TABLE IF EXISTS performance;
        CREATE TABLE performance (
            id SERIAL PRIMARY KEY,
            "performanceId" BIGINT UNIQUE NOT NULL,
            "festivalId" BIGINT NOT NULL,
            "startTime" VARCHAR NOT NULL,
            "endTime" VARCHAR NOT NULL
        )
    `;
    client.query(query, (err, res) => {
        console.log(err, res);
        callback(err,res);
        client.end();
    })
}

// insert Basic Table info
function insertPerformances(performances, callback) {
    let i = 1;
    const template = performances.map(performance => `($${i++}, $${i++}, $${i++}, $${i++})`).join(',');
    if (template == "") {
        callback(null, []);
        return;
    }
    const values = performances.reduce((reduced, performance) => [...reduced, performance.performanceId, performance.festivalId, performance.startTime, performance.endTime], [])
    const query = `INSERT INTO performance ("performanceId", "festivalId", "startTime", "endTime") VALUES ${template};`;
    // console.log(values, query)
    const client = connect();
    client.query(query, values, (err, result) => {
        callback(err, result);
        client.end();
    });
}

// get data in Performance Table
function getPerformances(festivalId, startTime__gt, page = 0, pageSize = 5, callback) {
    let whereClause;
    let i = 1;
    const values = [];
    if (!festivalId && !startTime__gt) whereClause = '';
    else {
        whereClause = 'WHERE ';
        if (festivalId) {
            whereClause += `"festivalId" = $${i++}`;
            values.push(parseInt(festivalId));
        }
        if (startTime__gt) {
            whereClause += (festivalId) ? ` AND "startTime" >= $${i++}` : ` "startTime" >= $${i++}`
            values.push(startTime__gt);
        }
    }

    let limitOffsetClause = `LIMIT $${i++} OFFSET $${i++}`;
    values.push(parseInt(pageSize)); // limit = page size
    values.push(parseInt(page) * parseInt(pageSize)); // offset = page * pagesize
    const query = `SELECT *, COUNT(*) OVER() AS no_of_rows FROM performance ${whereClause} ${limitOffsetClause}`;
    console.log(query, values);
    const client = connect();
    client.query(query, values, function (err, result) {
        client.end();
        if (err) return callback(err, result);
        const { rows } = result;
        if (rows.length == 0) return callback({
            "message": "No result.",
            "status": 404
        });
        callback(err, rows);
    })
}

// get data in Performance Table for computation
function getPerformancesForComputation(festivalId, callback) {
    console.log(typeof festivalId);
    if (festivalId == '') return callback({
        "message": "Empty input entered",
        "status": 400
    });
    else if (!festivalId) return callback({
        "message": "Missing field",
        "status": 400
    })
    else if (isNaN(festivalId)) return callback({
        "message": "input entered is not number",
        "status": 400
    });
    else if(festivalId.length !=10) return callback({
        "message": "input entered is not 10 digits",
        "status": 400
    })
    const client = connect();
    client.query(`SELECT "performanceId", "startTime", "endTime" FROM performance WHERE "festivalId"=$1`, [festivalId], (err, result) => {
        client.end();
        if (err) return callback(err, result);
        const { rows } = result;
        if (rows.length == 0) return callback({
            "message" : "No Result",
             "status" : 404 
         })
        // if (rows.length == 0) return callback(null, []);
        callback(err, rows)
    });
}

/*--------------------------------------- Advanced --------------------------------------------------------*/

// reset Advance Table
function resetAdvanceTable(callback) {
    const client = connect();
    const query = `
        DROP TABLE IF EXISTS "performanceWithPopularity";
        CREATE TABLE "performanceWithPopularity" (
            id SERIAL PRIMARY KEY,
            "performanceId" BIGINT UNIQUE NOT NULL,
            "festivalId" BIGINT NOT NULL,
            "startTime" VARCHAR NOT NULL,
            "endTime" VARCHAR NOT NULL,
            popularity INT NOT NULL
        )
    `;
    client.query(query, (err, res) => {
        callback(err, res);
        console.log(err, res);
        client.end();
    })
}

// insert Advance Table info
function insertPerformancesWithPopularity(performancesWithPopularity, callback) {
    let i = 1;
    const template = performancesWithPopularity.map(performanceWithPopularity => `($${i++}, $${i++}, $${i++}, $${i++}, $${i++})`).join(',');
    if (template == "") {
        callback(null, []);
        return;
    }
    const values = performancesWithPopularity.reduce((reduced, performanceWithPopularity) => [...reduced, performanceWithPopularity.performanceId, performanceWithPopularity.festivalId, performanceWithPopularity.startTime, performanceWithPopularity.endTime, performanceWithPopularity.popularity], [])
    const query = `INSERT INTO "performanceWithPopularity" ("performanceId", "festivalId", "startTime", "endTime", popularity) VALUES ${template};`;
    // console.log(values, query)
    const client = connect();
    client.query(query, values, (err, result) => {
        callback(err, result);
        client.end();
    });
}

// get data in performancesWithPopularity Table
function getPerformancesWithPopularity(festivalId, startTime__gt, endTime__lt, page = 0, pageSize = 5, callback) {
    let whereClause;
    let i = 1;
    const values = [];
    if (!festivalId && !startTime__gt && !endTime__lt) whereClause = '';
    else {
        whereClause = 'WHERE ';
        if (festivalId) {
            whereClause += `"festivalId" = $${i++}`;
            values.push(parseInt(festivalId));
        }
        if (startTime__gt) {
            whereClause += (festivalId) ? ` AND "startTime" >= $${i++}` : `"startTime" >= $${i++}`
            values.push(startTime__gt);
        }
        if (endTime__lt) {
            whereClause += (festivalId || startTime__gt) ? ` AND "endTime" < $${i++}` : `"endTime" < $${i++}`
            values.push(endTime__lt);
        }
    }

    let limitOffsetClause = `LIMIT $${i++} OFFSET $${i++}`;
    values.push(parseInt(pageSize)); // limit = page size
    values.push(parseInt(page) * parseInt(pageSize)); // offset = page * pagesize
    const query = `SELECT *, COUNT(*) OVER() AS no_of_rows FROM "performanceWithPopularity" ${whereClause} ${limitOffsetClause}`;
    console.log(query, values);
    const client = connect();
    client.query(query, values, function (err, result) {
        client.end();
        if (err) return callback(err, result);
        const { rows } = result;
        if (rows.length == 0) return callback({
            "message" : "No Result",
             "status" : 404 
         })
        // if (rows.length == 0) return callback(null, []);
        callback(err, rows);
    })
}

// get advanced data in PerformancesWithPopularity Table for computation
function getAdvancedPerformancesForComputation(festivalId, callback) {
    if (festivalId == '') return callback({
        "message": "Empty input entered",
        "status": 404
    });
    else if (!festivalId) return callback({
        "message": "Missing field",
        "status": 400
    });
    else if (isNaN(festivalId)) return callback({
        "message": "input entered is not number",
        "status": 404
    });
    else if (festivalId.length != 10) return callback({
        "message": "Input entered is not 10 digits",
        "status": 400
    });
    const client = connect();
    client.query(`SELECT "performanceId", "startTime", "endTime", popularity FROM "performanceWithPopularity" WHERE "festivalId"=$1`, [festivalId], (err, result) => {
        client.end();
        if (err) return callback(err, result);
        const { rows } = result;
        if (rows.length == 0) return callback({
           "message" : "No Result",
            "status" : 404 
        })
        // if (rows.length == 0) return callback(null,[])
        callback(err, rows)
    });
}

/*--------------------------------------- Advanced Feature --------------------------------------------------------*/
function resetAdvancedTable(callback) {
    const client = connect();
    const query = `
        DROP TABLE IF EXISTS "performanceWithPopularityAdvanced";
        CREATE TABLE "performanceWithPopularityAdvanced" (
            id SERIAL PRIMARY KEY,
            "performanceId" BIGINT UNIQUE NOT NULL,
            "festivalId" BIGINT NOT NULL,
            "startTimeDate" VARCHAR NOT NULL,
            "endTimeDate" VARCHAR NOT NULL,
            popularity INT NOT NULL
        )
    `;
    client.query(query, (err, res) => {
        callback(err, res);
        console.log(err, res);
        client.end();
    })
};

// insert Advanced Table info
function performanceWithPopularityAdvanced(performancesWithPopularity, callback) {
    let i = 1;
    const template = performancesWithPopularity.map(performanceWithPopularity => `($${i++}, $${i++}, $${i++}, $${i++}, $${i++})`).join(',');
    if (template == "") {
        callback(null, []);
        return;
    }
    const values = performancesWithPopularity.reduce((reduced, performanceWithPopularityAdvanced) => [...reduced, performanceWithPopularityAdvanced.performanceId, performanceWithPopularityAdvanced.festivalId, performanceWithPopularityAdvanced.startTimeDate, performanceWithPopularityAdvanced.endTimeDate, performanceWithPopularityAdvanced.popularity], [])
    const query = `INSERT INTO "performanceWithPopularityAdvanced" ("performanceId", "festivalId", "startTimeDate", "endTimeDate", popularity) VALUES ${template};`;
    // console.log(values, query)
    const client = connect();
    client.query(query, values, (err, result) => {
        callback(err, result);
        client.end();
    });
}

// get data in performancesWithPopularity Table
function getPerformancesWithPopularityAdvanced(festivalId, startTimeDate__gt, endTimeDate__lt, page = 0, pageSize = 5, callback) {
    let whereClause;
    let i = 1;
    const values = [];
    if (!festivalId && !startTimeDate__gt && !endTimeDate__lt) whereClause = '';
    else {
        whereClause = 'WHERE ';
        if (festivalId) {
            whereClause += `"festivalId" = $${i++}`;
            values.push(parseInt(festivalId));
        }
        if (startTimeDate__gt) {
            whereClause += (festivalId) ? ` AND "startTimeDate" >= $${i++}` : `"startTimeDate" >= $${i++}`
            values.push(startTimeDate__gt);
        }
        if (endTimeDate__lt) {
            whereClause += (festivalId || startTimeDate__gt) ? ` AND "endTimeDate" < $${i++}` : `"endTimeDate" < $${i++}`
            values.push(endTimeDate__lt);
        }
    }

    let limitOffsetClause = `LIMIT $${i++} OFFSET $${i++}`;
    values.push(parseInt(pageSize)); // limit = page size
    values.push(parseInt(page) * parseInt(pageSize)); // offset = page * pagesize
    const query = `SELECT *, COUNT(*) OVER() AS no_of_rows FROM "performanceWithPopularityAdvanced" ${whereClause} ${limitOffsetClause}`;
    console.log(query, values);
    const client = connect();
    client.query(query, values, function (err, result) {
        client.end();
        if (err) return callback(err, result);
        const { rows } = result;
        if (rows.length == 0) return callback({
            "message" : "No Result",
             "status" : 404 
         })
        // if (rows.length == 0) return callback(null, []);
        callback(err, rows);
    })
}

// get data in performanceWithPopularityAdvanced Table for basic computation
function getPerformancesWithPopularityAdvancedForBasicComputation(festivalId, callback) {
    console.log(typeof festivalId);
    if (festivalId == '') return callback({
        "message": "Empty input entered",
        "status": 400
    });
    else if (!festivalId) return callback({
        "message": "Missing field",
        "status": 400
    })
    else if (isNaN(festivalId)) return callback({
        "message": "input entered is not number",
        "status": 400
    });
    else if(festivalId.length !=10) return callback({
        "message": "input entered is not 10 digits",
        "status": 400
    })
    const client = connect();
    client.query(`SELECT "performanceId", "startTimeDate", "endTimeDate" FROM "performanceWithPopularityAdvanced" WHERE "festivalId"=$1`, [festivalId], (err, result) => {
        client.end();
        if (err) return callback(err, result);
        const { rows } = result;
        if (rows.length == 0) return callback({
            "message" : "No Result",
             "status" : 404 
         })
        // if (rows.length == 0) return callback(null, []);
        callback(err, rows)
    });
}

// get data in performanceWithPopularityAdvanced Table for advance computation
function getPerformancesWithPopularityAdvancedForAdvanceComputation(festivalId, callback) {
    console.log(typeof festivalId);
    if (festivalId == '') return callback({
        "message": "Empty input entered",
        "status": 400
    });
    else if (!festivalId) return callback({
        "message": "Missing field",
        "status": 400
    })
    else if (isNaN(festivalId)) return callback({
        "message": "input entered is not number",
        "status": 400
    });
    else if(festivalId.length !=10) return callback({
        "message": "input entered is not 10 digits",
        "status": 400
    })
    const client = connect();
    client.query(`SELECT "performanceId", "startTimeDate", "endTimeDate", "popularity" FROM "performanceWithPopularityAdvanced" WHERE "festivalId"=$1`, [festivalId], (err, result) => {
        client.end();
        if (err) return callback(err, result);
        const { rows } = result;
        if (rows.length == 0) return callback({
            "message" : "No Result",
             "status" : 404 
         })
        // if (rows.length == 0) return callback(null, []);
        callback(err, rows)
    });
}


module.exports = {
    resetBasicTable,
    insertPerformances,
    getPerformances,
    getPerformancesForComputation,
    resetAdvanceTable,
    insertPerformancesWithPopularity,
    getPerformancesWithPopularity,
    getAdvancedPerformancesForComputation,
    resetAdvancedTable,
    performanceWithPopularityAdvanced,
    getPerformancesWithPopularityAdvanced,
    getPerformancesWithPopularityAdvancedForBasicComputation,
    getPerformancesWithPopularityAdvancedForAdvanceComputation
}