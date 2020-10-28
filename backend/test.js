console.log('test')
festivalArray = [
    {
        "id": 8,
        "performanceid": "1000000008",
        "festivalid": "1100000003",
        "starttime": "1000",
        "endtime": "1100",
        "popularity": 3,
        "no_of_rows": "5"
    },
    {
        "id": 9,
        "performanceid": "1000000009",
        "festivalid": "1100000003",
        "starttime": "1100",
        "endtime": "1200",
        "popularity": 1,
        "no_of_rows": "5"
    },
    {
        "id": 10,
        "performanceid": "1000000010",
        "festivalid": "1100000003",
        "starttime": "1200",
        "endtime": "1300",
        "popularity": 1,
        "no_of_rows": "5"
    },
    {
        "id": 11,
        "performanceid": "1000000011",
        "festivalid": "1100000003",
        "starttime": "1030",
        "endtime": "1230",
        "popularity": 1,
        "no_of_rows": "5"
    },
    {
        "id": 12,
        "performanceid": "1000000012",
        "festivalid": "1100000003",
        "starttime": "1130",
        "endtime": "1300",
        "popularity": 3,
        "no_of_rows": "5"
    }
]

function binarySearch(festivalArray, start_index) {
    let mini = 0;
    let maxi = start_index - 1;

    while (mini <= maxi) {
        let mid = Math.floor((mini + maxi) / 2);
        if (festivalArray[mid].endtime <= festivalArray[start_index].starttime) {
            if (festivalArray[mid + 1].endtime <= festivalArray[start_index].starttime) {
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
    let festivals = festivalArray.sort((p1, p2) => p1.endtime > p2.endtime);
    let n = festivals.length;
    let accum_popularity = festivals.map(festival => 0);
    let selectedPerformances = festivals.map(festival => []); // 1.
    
    accum_popularity[0] = festivals[0].popularity;
    selectedPerformances[0] = [festivals[0]];
    for (let i = 1; i < n; i++) {
        let inclPopularity = festivals[i].popularity;
        let inclPerformance = [festivals[i]]; // 2.
        let l = binarySearch(festivals, i);
        if (l != -1) {
            inclPopularity += accum_popularity[l];
            inclPerformance = [...selectedPerformances[l], festivals[i]]; // 3.
            // console.log('qw '+ selectedPerformances[l]);
        }

        accum_popularity[i] = Math.max(inclPopularity, accum_popularity[i - 1]);

        // 4.
        if (accum_popularity[i] === inclPopularity) {
            selectedPerformances[i] = inclPerformance;
        } else {
            // console.log(`98: ` + selectedPerformances[i - 1]);
            selectedPerformances[i] = selectedPerformances[i - 1];
        }
        // console.log(selectedPerformances[i - 1]);
    }

    console.log(accum_popularity[n-1]);

    // 5.
    console.log(selectedPerformances[n-1]);
    return { selectedPerformances: selectedPerformances[n - 1], accumulated_popularity: accum_popularity[n - 1] }
}


weightedActivitySelection(festivalArray);