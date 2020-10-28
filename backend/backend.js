/*
Name of problem: Activity Selection

Interesting Method:
    1. Correctly select the set of performances for computation
    2. Sort the performances by increasing order of their finishing time.
    3. Maintain a list of selected performance
    4. Iterate through each of the sorted performance
        a. If it doesn't clash with any selected performance, add it to the list
        b. Otherwise skip that performance.

Brute Force:
    1. Generate ALL possible ways to select the performances
    2.Eliminate invalid options
    3.Select the option which contains the most number of performances.
*/
const moment = require('moment');

// -------------------------- Basic Result -------------------------------
function computeBasic(festivalObj) {
    try {
        return { error: null, result: activitySelection(festivalObj) };
    }
    catch (error) {
        return { error, result: null };
    }
}

function activitySelection(festivalObj) {
    const festivalSorted = festivalObj.sort((p1, p2) => p1.endTime > p2.endTime);
    let prevEndTime = 0;

    const resultingFestivals = [];

    for (const performance of festivalSorted) {
        if (performance.startTime >= prevEndTime) {
            prevEndTime = performance.endTime;
            resultingFestivals.push(performance);
        }
    }
    let mappedFestivals = resultingFestivals.map(festival => ({
        performanceId: parseInt(festival.performanceId),
        startTime: festival.startTime,
        endTime: festival.endTime
    }));
    return mappedFestivals;
}

// -------------------------- Advance Result -------------------------------
function computeAdvance(festivalArray) {
    try {
        return { error: null, result: weightedActivitySelection(festivalArray) };
    }
    catch (error) {
        return { error, result: null };
    }
}


function binarySearch(festivalArray, start_index) {
    let mini = 0;
    let maxi = start_index - 1;

    while (mini <= maxi) {
        let mid = Math.floor((mini + maxi) / 2);
        if (festivalArray[mid].endTime <= festivalArray[start_index].startTime) {
            if (festivalArray[mid + 1].endTime <= festivalArray[start_index].startTime) {
                mini = mid + 1;
            }
            else {
                return mid;
            }
        }
        else {
            maxi = mid - 1;
        }
    }
    return -1;
}

function weightedActivitySelection(festivalArray) {
    let festivals = festivalArray.sort((p1, p2) => p1.endTime > p2.endTime);
    let n = festivals.length;
    let accum_popularity = festivals.map(festival => 0);
    let selectedPerformances = festivals.map(festival => []);

    accum_popularity[0] = festivals[0].popularity;
    selectedPerformances[0] = [festivals[0]];
    for (let i = 1; i < n; i++) {
        let inclPopularity = festivals[i].popularity;
        let inclPerformance = [festivals[i]];
        let l = binarySearch(festivals, i);
        if (l != -1) {
            inclPopularity += accum_popularity[l];
            inclPerformance = [...selectedPerformances[l], festivals[i]];
        }

        accum_popularity[i] = Math.max(inclPopularity, accum_popularity[i - 1]);

        if (accum_popularity[i] === inclPopularity) {
            selectedPerformances[i] = inclPerformance;
        } else {
            selectedPerformances[i] = selectedPerformances[i - 1];
        }
    }

    // console.log(accum_popularity[n-1]);
    // console.log(selectedPerformances[n-1]);
    let selectedPerformancesResult = selectedPerformances[n - 1];
    let mappedFestivals = selectedPerformancesResult.map(festival => ({
        performanceId: parseInt(festival.performanceId),
        startTime: festival.startTime,
        endTime: festival.endTime,
        popularity: festival.popularity
    }));
    // return {selectedPerformances : selectedPerformances[n-1], accum_popularity: accum_popularity[n-1]};
    console.log(mappedFestivals);
    return mappedFestivals;
}

// -------------------------- Advanced Feature Result -------------------------------

function computeAdvancedBasic(festivalObj) {
    try {
        return { error: null, result: activitySelectionAdvanced(festivalObj) };
    }
    catch (error) {
        return { error, result: null };
    }
}

function activitySelectionAdvanced(festivalObj) {
    let festivalObject = festivalObj.map(fest => ({
        performanceId: parseInt(fest.performanceId),
        startTimeDate: moment(fest.startTimeDate),
        endTimeDate: moment(fest.endTimeDate)
    }));
    const festivalSorted = festivalObject.sort((p1, p2) => p1.endTimeDate.isAfter(p2.endTimeDate));
    // console.log(festivalSorted);
    let prevEndTime = 0;

    const resultingFestivals = [];

    for (const performance of festivalSorted) {
        if (performance.startTimeDate.isSameOrAfter(prevEndTime)) {
            prevEndTime = performance.endTimeDate;
            resultingFestivals.push(performance);
        }
    }
    // console.log(resultingFestivals);
    let mappedFestivals = resultingFestivals.map(festival => ({
        performanceId: parseInt(festival.performanceId),
        startTimeDate: festival.startTimeDate.format('YYYY/MM/DD HH:mm'),
        endTimeDate: festival.endTimeDate.format('YYYY/MM/DD HH:mm')
    }));
    // console.log(mappedFestivals);
    return mappedFestivals;
}


function computeAdvanced(festivalArray) {
    try {
        return { error: null, result: weightedActivitySelectionAdvanced(festivalArray) };
    }
    catch (error) {
        return { error, result: null };
    }
}


function binarySearchAdvanced(festivalArray, start_index) {
    let mini = 0;
    let maxi = start_index - 1;

    while (mini <= maxi) {
        let mid = Math.floor((mini + maxi) / 2);
        if (festivalArray[mid].endTimeDate.isSameOrBefore(festivalArray[start_index].startTimeDate)) {
            if (festivalArray[mid + 1].endTimeDate.isSameOrBefore(festivalArray[start_index].startTimeDate)) {
                mini = mid + 1;
            }
            else {
                return mid;
            }
        }
        else {
            maxi = mid - 1;
        }
    }
    return -1;
}

function weightedActivitySelectionAdvanced(festivalArray) {
    let festivalArr = festivalArray.map(festival => ({
        performanceId: parseInt(festival.performanceId),
        startTimeDate: moment(festival.startTimeDate),
        endTimeDate: moment(festival.endTimeDate),
        popularity: festival.popularity
    }));
    let festivals = festivalArr.sort((p1, p2) => p1.endTimeDate.isAfter(p2.endTimeDate));
    let n = festivals.length;
    let accum_popularity = festivals.map(festival => 0);
    let selectedPerformances = festivals.map(festival => []);

    accum_popularity[0] = festivals[0].popularity;
    selectedPerformances[0] = [festivals[0]];
    for (let i = 1; i < n; i++) {
        let inclPopularity = festivals[i].popularity;
        let inclPerformance = [festivals[i]];
        let l = binarySearchAdvanced(festivals, i);
        if (l != -1) {
            inclPopularity += accum_popularity[l];
            inclPerformance = [...selectedPerformances[l], festivals[i]];
        }

        accum_popularity[i] = Math.max(inclPopularity, accum_popularity[i - 1]);

        if (accum_popularity[i] === inclPopularity) {
            selectedPerformances[i] = inclPerformance;
        } else {
            selectedPerformances[i] = selectedPerformances[i - 1];
        }
    }

    // console.log(accum_popularity[n-1]);
    // console.log(selectedPerformances[n-1]);
    let selectedPerformancesResult = selectedPerformances[n - 1];
    let mappedFestivals = selectedPerformancesResult.map(festival => ({
        performanceId: parseInt(festival.performanceId),
        startTimeDate: festival.startTimeDate.format('YYYY/MM/DD HH:mm'),
        endTimeDate: festival.endTimeDate.format('YYYY/MM/DD HH:mm'),
        popularity: festival.popularity
    }));
    // return {selectedPerformances : selectedPerformances[n-1], accum_popularity: accum_popularity[n-1]};
    console.log(mappedFestivals);
    return mappedFestivals;
}





module.exports = {
    computeBasic,
    computeAdvance,
    computeAdvancedBasic,
    computeAdvanced
}