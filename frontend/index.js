const basicDataQuery = {
    festivalId: null,
    startTime__gt: null,
    page: 0,
    pageSize: 5,
}


const basicDataPaginationFunction = {
    gotoFirstPage: function () {
        basicDataQuery["page"] = 0;
    },

    changePage: function (delta) {

        basicDataQuery["page"] += parseInt(delta);
    },
    changePageSize: function (newPageSize) {
        console.log(newPageSize);
        basicDataQuery['page']= 0;
        basicDataQuery["pageSize"] = parseInt(newPageSize);
    }
}

const basicDataUrl = "https://full-stack-project-2020.herokuapp.com/basic/data";
// const basicDataUrl = "http://localhost:3000/basic/data";

const basicResultQuery = {
    festivalId: null
}

const basicResultUrl = `https://full-stack-project-2020.herokuapp.com/basic/result`;
// const basicResultUrl = `http://localhost:3000/basic/result`;

// printing the data in html
function populateDataBasicTable(data) {
    console.log(data);
    const dataTableHtml = data.map(({ performanceId, festivalId, startTime, endTime }) => `
                    <tr>
                        <th scope="row">${performanceId}</th>
                        <td>${festivalId}</td>
                        <td>${startTime}</td>
                        <td>${endTime}</td>
                    </tr>
    `);
    $("#basic-data-tbody").html(dataTableHtml);
}
// getting arrays from backend
function getBasicDataFromBackend(callback) {
    $.get(basicDataUrl, basicDataQuery)
        .done((result) => callback(null, result))
        .fail((message) => callback(message, null));
}

function refreshBasicDataTable() {

    getBasicDataFromBackend(function (err, data) {
        if (err) return alert(err.responseJSON.error);

        dataCount = parseInt(data[0].no_of_rows);
        var totalPg = (Math.ceil(dataCount / basicDataQuery['pageSize'])) - 1;
        if (basicDataQuery['page'] == 0) {
            if (dataCount <= basicDataQuery['pageSize']) {
                $('#basic-data-previous-page').hide();
                $('#basic-data-next-page').hide();
            } else {
                // for first page
                $('#basic-data-previous-page').hide();
                $('#basic-data-next-page').show();
            }
        } else if (basicDataQuery['page'] == parseInt(totalPg)) {
            // for last page
            $('#basic-data-previous-page').show();
            $('#basic-data-next-page').hide();
        } else {
            // for data fits in pagesize
            $('#basic-data-previous-page').show();
            $('#basic-data-next-page').show();
        }
        // if (basicDataQuery['page'] != 0) {
        //     $('#basic-data-page-size-select').hide();
        // }
        // else {
        //     $('#basic-data-page-size-select').show();
        // }
        console.log("total pgs: " + totalPg);
        console.log(basicDataQuery['page']);
        console.log("total rows: " + dataCount);
        if (err) return alert(err);
        populateDataBasicTable(data);
    });
}

function filterBasicData(event) {
    $("#basic-data-filter-form input")
        .not(":input[type=submit]")
        .each((idx, input) => {
            basicDataQuery[$(input).attr("key")] = $(input).val();
        });

    basicDataQuery["page"] = 0;
    basicDataQuery["pageSize"] = 5;
    refreshBasicDataTable();
    return false;
}

function registerBasicFilterForm() {
    $("#basic-data-filter-form").submit(filterBasicData);
}

function paginateBasicData(event) {
    const fn = $(this).attr("fn");
    const value = $(this).attr('value') || $(this).val();
    basicDataPaginationFunction[fn](value);
    refreshBasicDataTable();
}

function registerBasicDataPaginationForm() {
    $("#basic-data-first-page").click(paginateBasicData);
    $("#basic-data-previous-page").click(paginateBasicData);
    $("#basic-data-next-page").click(paginateBasicData);
    $("#basic-data-page-size-select").change(paginateBasicData);
}
// --------------------- Basic Result ----------------------
function populateBasicResultTable(data) {
    console.log(data.result);

    const resultTableHtml = data.result.map(({ performanceId, startTime, endTime }) => `
                     <tr>
                        <th scope="row">${performanceId}</th>
                        <td>${startTime}</td>
                        <td>${endTime}</td>
                     </tr>
     `);
    $("#basic-result-tbody").html(resultTableHtml);
}

function getBasicResultFromBackend(callback) {
    $.get(basicResultUrl, basicResultQuery)
        .done((result) => callback(null, result))
        .fail((message) => callback(message, null));
}

function refreshBasicResultTable() {
    getBasicResultFromBackend(function (err, data) {
        if (err) return alert(err.responseJSON.error);
        populateBasicResultTable(data);
    });
}

function computeBasicResult() {
    $("#basic-result-input-form input")
        .not(":input[type=submit]")
        .each((_, input) => {
            basicResultQuery[$(input).attr("key")] = $(input).val();
        });
    refreshBasicResultTable();
    return false;
}

function registerBasicResultInput() {
    $("#basic-result-input-form").submit(computeBasicResult);
}

$(document).ready(function () {
    registerBasicFilterForm();
    registerBasicDataPaginationForm();
    registerBasicResultInput();
    refreshBasicDataTable();
})
