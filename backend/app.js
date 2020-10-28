var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const database = require('./database');
const backend = require('./backend');

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    return res.json({
        message: "Welcome to JiBaBoom - GGSTUDY",
        availableEndpoints: [
             'POST /basic/insert { "data": [ {key1: value1, key2: value2, ...} ] }',
             'POST /advance/insert { "data": [ {key1: value1, key2: value2, ...} ] }',
             'GET /basic/result?para1=value1&para2=value2',
             'GET /advance/result?para1=value1&para2=value2',
        ]
    });
});
/* ----------------------------------------- Basic ---------------------------------------------- */

// reset basic table
app.get('/reset/basic', function (req, res) {
	database.resetBasicTable(function (error, result) {
		if (error) {
			console.log(error);
			return res.json({ error: error });
		}
		return res.json({ success: true });
	});
});

// reset advance table
app.get('/reset/advance', function (req, res) {
	database.resetAdvanceTable(function (error, result) {
		if (error) {
			console.log(error);
			return res.json({ error: error });
		}
		return res.json({ success: true });
	});
});

// basic insert
app.post('/basic/insert', function (req, res, next) {
	const { data } = req.body;
	database.insertPerformances(data, (error, result) => {
		if (error) {
			console.log(error);
			return next(error);
		}
		jsonData = {
			"result": "success"
		};
		console.log(result);
		res.json(jsonData);
	});
});

// basic query data
app.get('/basic/data', function (req, res, next) {
	var { festivalId, startTime__gt, page, pageSize } = req.query;
	console.log("page is " + page);
	database.getPerformances(festivalId, startTime__gt, page, pageSize, (error, result) => {
		if (error) {
			return next(error);
		}
		res.json(result);
	});
})

// basic result
app.get('/basic/result', function (req, res, next) {
	const { festivalId } = req.query
	database.getPerformancesForComputation(festivalId, (error, result) => {
		console.log(festivalId);
		if (error) return next(error);
		const { error: computationError, result: computationResult } = backend.computeBasic(result);
		if (computationError) return next(computationError);
		return res.json({
			result: computationResult
		});
	})
})

/* ----------------------------------------- Advanced ---------------------------------------------- */

// advance insert
app.post('/advance/insert', function (req, res, next) {
	const { data } = req.body;
	database.insertPerformancesWithPopularity(data, (error, result) => {
		if (error) {
			console.log(error);
			return next(error);
		}
		jsonData = {
			"result": "success"
		};
		console.log(result);
		res.json(jsonData);
	});
});

// advance query data
app.get('/advance/data', function (req, res, next) {
	var { festivalId, startTime__gt, endTime__lt, page, pageSize } = req.query;
	console.log("page is " + page);
	database.getPerformancesWithPopularity(festivalId, startTime__gt, endTime__lt, page, pageSize, (error, result) => {
		if (error) {
			return next(error);
		}
		res.json(result);
	});
})

// advance query result
app.get('/advance/result', function (req, res, next) {
	const { festivalId } = req.query
	database.getAdvancedPerformancesForComputation(festivalId, (error, result) => {
		console.log(festivalId);
		if (error) return next(error);
		// if(result.length == 0){
		// 	return res.json({
		// 		result : []
		// 	});
		// }
		const { error: computationError, result: computationResult } = backend.computeAdvance(result);
		console.log(computationResult);
		if (computationError) return next(computationError);
		return res.json({
			result: computationResult
		});
	})
})

/* ----------------------------------------- Advanced Feature---------------------------------------------- */

// reset advanced table
app.get('/reset/advanced', function (req, res) {
	database.resetAdvancedTable(function (error, result) {
		if (error) {
			console.log(error);
			return res.json({ error: error });
		}
		return res.json({ success: true });
	});
});

// advanced insert 
app.post('/advanced/insert', function (req, res, next) {
	const { data } = req.body;
	database.performanceWithPopularityAdvanced(data, (error, result) => {
		if (error) {
			console.log(error);
			return next(error);
		}
		jsonData = {
			"result": "success"
		};
		console.log(result);
		res.json(jsonData);
	});
});

// advanced query data
app.get('/advanced/data', function (req, res, next) {
	var { festivalId, startTimeDate__gt, endTimeDate__lt, page, pageSize } = req.query;
	console.log("page is " + page);
	database.getPerformancesWithPopularityAdvanced(festivalId, startTimeDate__gt, endTimeDate__lt, page, pageSize, (error, result) => {
		if (error) {
			return next(error);
		}
		res.json(result);
	});
})

// advanced basic result
app.get('/advanced/basicResult', function (req, res, next) {
	const { festivalId } = req.query
	database.getPerformancesWithPopularityAdvancedForBasicComputation(festivalId, (error, result) => {
		console.log(festivalId);
		if (error) return next(error);
		const { error: computationError, result: computationResult } = backend.computeAdvancedBasic(result);
		if (computationError) return next(computationError);
		return res.json({
			result: computationResult
		});
	})
})

// advanced advance result
app.get('/advanced/advanceResult', function (req, res, next) {
	const { festivalId } = req.query
	database.getPerformancesWithPopularityAdvancedForAdvanceComputation(festivalId, (error, result) => {
		console.log(festivalId);
		if (error) return next(error);
		// if(result.length == 0){
		// 	return res.json({
		// 		result : []
		// 	});
		// }
		const { error: computationError, result: computationResult } = backend.computeAdvanced(result);
		console.log(computationResult);
		if (computationError) return next(computationError);
		return res.json({
			result: computationResult
		});
	})
})





// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	console.log(err);

	// render the error page
	res.status(err.status || 500);
	res.json({
		error: err.message,
		code: err.status || 500,
	});
});

module.exports = app;
