const advancedDataQuery = {
    festivalId: null,
    startTimeDate__gt: null,
    endTimeDate__lt: null,
    page: 0,
    pageSize: 5
}


const advancedDataPaginationFunction = {
    gotoFirstPage: function () {
        advancedDataQuery["page"] = 0;
    },

    changePage: function (delta) {

        advancedDataQuery["page"] += parseInt(delta);
    },
    changePageSize: function (newPageSize) {
        console.log(newPageSize);
        advancedDataQuery["page"] = 0;
        advancedDataQuery["pageSize"] = parseInt(newPageSize);
    }
}

// const advancedDataUrl = "https://full-stack-project-2020.herokuapp.com/advanced/data";
// const advancedDataUrl = "http://localhost:3000/advance/data";

const advancedDataUrl = `${CONFIG.API_BASE_URL}/advanced/data`;

const advancedResultQuery = {
    festivalId: null
}

// const advancedResultUrl = `https://full-stack-project-2020.herokuapp.com/advanced/basicResult`;
// const advancedResultUrl = `http://localhost:3000/advance/result`;

// --------------------- Advanced Data ----------------------
// printing the data in html
function populateAdvancedDataTable(data) {
    console.log(data);
    const dataTableHtml = data.map(({ performanceId, festivalId, startTimeDate, endTimeDate, popularity }) => `
                    <tr>
                        <th scope="row">${performanceId}</th>
                        <td>${festivalId}</td>
                        <td>${startTimeDate}</td>
                        <td>${endTimeDate}</td>
                        <td>${popularity}</td>
                    </tr>
    `);
    $("#advanced-data-tbody").html(dataTableHtml);
}
// getting arrays from backend
function getAdvancedDataFromBackend(callback) {
    $.get(`${CONFIG.API_BASE_URL}/advanced/data`, advancedDataQuery)
        .done((result) => callback(null, result))
        .fail((message) => callback(message, null));
}

function refreshAdvancedDataTable() {

    getAdvancedDataFromBackend(function (err, data) {
        if (err) return alert(err.responseJSON.error);

        // get the count for data
        dataCount = parseInt(data[0].no_of_rows);
        var totalPg = (Math.ceil(dataCount / advancedDataQuery['pageSize'])) - 1;
        if (advancedDataQuery['page'] == 0) {
            if (dataCount <= advancedDataQuery['pageSize']) {
                $('#advanced-data-previous-page').hide();
                $('#advanced-data-next-page').hide();
            } else {
                // for first page
                $('#advanced-data-previous-page').hide();
                $('#advanced-data-next-page').show();
            }
        } else if (advancedDataQuery['page'] == parseInt(totalPg)) {
            // for last page
            $('#advanced-data-previous-page').show();
            $('#advanced-data-next-page').hide();
        } else {
            // for data fits in pagesize
            $('#advanced-data-previous-page').show();
            $('#advanced-data-next-page').show();
        }
        // if (advancedDataQuery['page'] != 0) {
        //     $('#advanced-data-page-size-select').hide();
        // }
        // else {
        //     $('#advanced-data-page-size-select').show();
        // }
        console.log("total pgs: " + totalPg);
        console.log(advancedDataQuery['page']);
        console.log("total rows: " + dataCount);
        if (err) return alert(err);
        populateAdvancedDataTable(data);
    });
}

function filterAdvancedData(event) {
    $("#advanced-data-filter-form input")
        .not(":input[type=submit]")
        .each((idx, input) => {
            advancedDataQuery[$(input).attr("key")] = $(input).val();
        });

    advancedDataQuery["page"] = 0;
    advancedDataQuery["pageSize"] = 5;
    refreshAdvancedDataTable();
    return false;
}

function registerAdvancedFilterForm() {
    $("#advanced-data-filter-form").submit(filterAdvancedData);
}

function paginateAdvancedData(event) {
    const fn = $(this).attr("fn");
    const value = $(this).attr('value') || $(this).val();
    advancedDataPaginationFunction[fn](value);
    refreshAdvancedDataTable();
}

function registerAdvancedDataPaginationForm() {
    $("#advanced-data-first-page").click(paginateAdvancedData);
    $("#advanced-data-previous-page").click(paginateAdvancedData);
    $("#advanced-data-next-page").click(paginateAdvancedData);
    $("#advanced-data-page-size-select").change(paginateAdvancedData);
}

// --------------------- Advanced Result ----------------------

function populateAdvancedResultTable(data) {
    console.log("Data received:", data);
    console.log("Result array:", data.result);
    
    if (!data.result || data.result.length === 0) {
        console.log("No results found or empty result array");
        $("#advanced-result-tbody").html("<tr><td colspan='3'>No results found</td></tr>");
        return;
    }
    
    // Debug the first result item
    console.log("First result item:", data.result[0]);
    
    var resultTableHtml = data.result.map((item) => {
        console.log("Mapping item:", item);
        return `
            <tr>
                <th scope="row">${item.performanceId}</th>
                <td>${item.startTimeDate}</td>
                <td>${item.endTimeDate}</td>
            </tr>
        `;
    });
    
    console.log("Generated HTML:", resultTableHtml);
    console.log("Target element exists:", $("#advanced-result-tbody").length > 0);
    
    $("#advanced-result-tbody").html(resultTableHtml);
}

function getAdvancedResultFromBackend(callback) {
    $.get(`${CONFIG.API_BASE_URL}/advanced/basicResult`, advancedResultQuery)
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