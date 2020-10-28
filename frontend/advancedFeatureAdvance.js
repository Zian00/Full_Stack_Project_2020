const advancedDataQuery = {
    festivalId: null,
    startTime__gt: null,
    endTime__lt: null,
    page: 0,
    pageSize: 5
}



const advancedDataUrl = "https://full-stack-project-2020.herokuapp.com/advanced/data";
// const advancedDataUrl = "http://localhost:3000/advance/data";

/* Advanced feature Advance Result*/
const advancedResultQuery = {
    festivalId: null
}

const advancedResultUrl = `https://full-stack-project-2020.herokuapp.com/advanced/advanceResult`;
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

    var resultTableHtml = data.result.map(({ performanceId, startTimeDate, endTimeDate, popularity }) => `
                     <tr>
                        <th scope="row">${performanceId}</th>
                        <td>${startTimeDate}</td>
                        <td>${endTimeDate}</td>
                        <td>${popularity}</td>
                     </tr>
     `);
    let accumulated_popularity = data.result.reduce((sum, { popularity }) => sum + popularity, 0);
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
    $.get(advancedResultUrl, advancedResultQuery)
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
    registerAdvancedDataPaginationForm();
    registerAdvancedResultInput();
})