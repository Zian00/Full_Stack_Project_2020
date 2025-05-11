const advancedDataQuery = {
    festivalId: null,
    startTime__gt: null,
    endTime__lt: null,
    page: 0,
    pageSize: 5
}

let advancedResultQuery = {
    festivalId: null
}; // Initialize with required property

// const advancedDataUrl = "https://full-stack-project-2020.herokuapp.com/advanced/data";
// const advancedDataUrl = "http://localhost:3000/advance/data";
// const advancedResultUrl = `https://full-stack-project-2020.herokuapp.com/advanced/advanceResult`;
// const advancedResultUrl = `http://localhost:3000/advance/result`;

function paginateAdvancedData(event) {
    const fn = $(this).attr("fn");
    const value = $(this).attr('value') || $(this).val();
    advancedDataPaginationFunction[fn](value);
}

function registerAdvancedDataPaginationForm() {
    $("#advanced-data-first-page").click(paginateAdvancedData);
    $("#advanced-data-previous-page").click(paginateAdvancedData);
    $("#advanced-data-next-page").click(paginateAdvancedData);
    $("#advanced-data-page-size-select").change(paginateAdvancedData);
}

function populateAdvancedResultTable(data) {
    console.log(data.result);

    // Function to format time string (HHMM) to "HH:MM"
    const formatTimeString = (timeStr) => {
        if (!timeStr || timeStr.length < 4) return timeStr;
        return `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`;
    };

    // Function to create a date string in the format "yyyy/MM/dd HH:mm"
    const createDateTimeString = (timeStr) => {
        if (!timeStr || timeStr.length < 4) return timeStr;
        // Get current date as base (or you might want to use a specific date)
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedTime = formatTimeString(timeStr);
        
        return `${year}/${month}/${day} ${formattedTime}`;
    };

    var resultTableHtml = data.result.map(({ performanceId, startTime, endTime, popularity }) => `
                     <tr>
                        <th scope="row">${performanceId}</th>
                        <td>${createDateTimeString(startTime)}</td>
                        <td>${createDateTimeString(endTime)}</td>
                        <td>${popularity}</td>
                     </tr>
     `);
    let accumulated_popularity = data.result.reduce((sum, { popularity }) => sum + popularity, 0);
    // let accumulated_popularity =0;
    // for(const fest of data.result){
    //     accumulated_popularity += parseInt(fest.popularity);
    // }
    // console.log(accumulated_popularity);
    resultTableHtml += `
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td><b><i>Total Popularity:</i></b> ${accumulated_popularity}</td>
                    </tr>
    `
    $("#advanced-result-tbody").html(resultTableHtml);
}

function getAdvancedResultFromBackend(callback) {
    $.get(`${CONFIG.API_BASE_URL}/advance/result`, advancedResultQuery)
        .done((result) => callback(null, result))
        .fail((message) => callback(message, null));
}

function refreshAdvancedResultTable() {
    getAdvancedResultFromBackend(function (err, data) {
        if (err) return alert(err.responseJSON.error);
        populateAdvancedResultTable(data);
    });
}

function computeAdvancedResult() {
    // Reset the query object with default values
    advancedResultQuery = {
        festivalId: null
    };
    
    $("#advanced-result-input-form input")
        .not(":input[type=submit]")
        .each((_, input) => {
            advancedResultQuery[$(input).attr("key")] = $(input).val();
        });
    refreshAdvancedResultTable();
    return false;
}

function registerAdvancedResultInput() {
    $("#advanced-result-input-form").submit(computeAdvancedResult);
}

$(document).ready(function () {
    registerAdvancedFilterForm();
    registerAdvancedDataPaginationForm();
    registerAdvancedResultInput();
    refreshAdvancedDataTable();
})

function getAdvancedResultFromBackend(callback) {
    $.get(`${CONFIG.API_BASE_URL}/advance/result`, advancedResultQuery)
        .done((result) => callback(null, result))
        .fail((message) => callback(message, null));
}

function refreshAdvancedResultTable() {
    getAdvancedResultFromBackend(function (err, data) {
        if (err) return alert(err.responseJSON.error);
        populateAdvancedResultTable(data);
    });
}

function computeAdvancedResult() {
    // Reset the query object with default values
    advancedResultQuery = {
        festivalId: null
    };
    
    $("#advanced-result-input-form input")
        .not(":input[type=submit]")
        .each((_, input) => {
            advancedResultQuery[$(input).attr("key")] = $(input).val();
        });
    refreshAdvancedResultTable();
    return false;
}

function registerAdvancedResultInput() {
    $("#advanced-result-input-form").submit(computeAdvancedResult);
}

$(document).ready(function () {
    registerAdvancedDataPaginationForm();
    registerAdvancedResultInput();
})