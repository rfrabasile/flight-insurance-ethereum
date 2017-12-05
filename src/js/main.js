// The root URL for the RESTful services
var rootURL = "http://localhost:8080/";

var currentFlight;

// Retrieve flight list when application starts
findAll();

// Register listeners
$('#btnSearch').click(function () {
    search($('#searchKey').val());
    return false;
});

// Trigger search when pressing 'Return' on search key input field
$('#searchKey').keypress(function (e) {
    if (e.which == 13) {
        search($('#searchKey').val());
        e.preventDefault();
        return false;
    }
});


$('#btnCreate').click(function () {
    if ($('#from').val() == '' || $('#to').val() == '' || $('#airline').val() == '' || $('#flightNumber').val() == '' ||
        $('#arrivalDate').val() == '' || $('#departureDate').val() == '') {
        alert("Complete the requiered fields");
        return false;
    }
    else {
        if ($('#from').val() == $('#to').val()) {
            alert("From and To fields should be different");
            return false;
        }
        else
            addFlight();
    }


});

$('#btnSch').click(function () {
    $('#flightStatus').val("SCHEDULED");
    changeStatus();

});
$('#btnOnTime').click(function () {
    $('#flightStatus').val("ON_TIME");
    changeStatus();

});
$('#btnDelayed').click(function () {
    $('#flightStatus').val("DELAYED");
    changeStatus();

});


// $('#flightList a').live('click', function () {
//     findById($(this).data('id'));
// });


function search(searchKey) {
    if (searchKey == '')
        findAll();
    else
        findByName(searchKey);
}

function findAll() {
    console.log('findAll');
    $.ajax({
        type: 'GET',
        url: rootURL + '/flights',
        dataType: "json", // data type of response
        success: renderList
    });
}

function addFlight() {
    console.log('addFlight');
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: rootURL + '/flight',
        dataType: "json",
        data: formToJSON(),
        success: function (data, textStatus, jqXHR) {
            $('#flightId').val(data.id);
            console.log('Flight created successfully');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('addFlight error: ' + textStatus + "-" + jqXHR.toString() + "-" + errorThrown);
            //alert('addFlight error: ' + textStatus + "-" + jqXHR.toString() + "-" + errorThrown);
        }
    });
}

function changeStatus() {
    console.log('changeStatus');
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: rootURL + '/changeStatus',
        dataType: "json",
        data: formToJSON(),
        success: function (data, textStatus, jqXHR) {
            //$('#flightId').val(data.id);
            console.log('Insurance payed');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('addFlight error: ' + textStatus + "-" + jqXHR.toString() + "-" + errorThrown);
        }
    });
}


function renderList(data) {
    // JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
    var list = data == null ? [] : (data instanceof Array ? data : [data]);

    $('#flightList li').remove();

    $.each(list, function (index, flight) {
        $('#flightList')
            .append('<tr class="odd gradeX">'

                + '<td class="id" hidden> ' + flight.id + '</td>'
                + '<td class="from">' + flight.from + '</td>'
                + '<td class="to">' + flight.to + '</td>'
                + '<td class="ad">' + flight.arrivalDate + '</td>'
                + '<td class="dd">' + flight.departureDate + '</td>'
                + '<td class="air">' + flight.airline + ' </td>'
                + '<td class="fn">' + flight.flightNumber + '</td>'
                + '<td class="st">' + flight.flightStatus + '</td>'
                + '<td class="from"> <a href="../pages/detail.html" class="btn btn-xs btn-info">Details <span class="glyphicon glyphicon-list"></span></a>' +
                ' <a href="../pages/flightStatus.html" class="btn btn-xs btn-info btn-status">Status <span class="glyphicon glyphicon-plane"></span></a> </td>')
    });
}


$(document).ready(function () {
    $('table tbody tr').click(function () {
        $('.selected').removeClass('selected');
        $(this).addClass("selected");
        var id = $('.id', this).html();
        var from = $('.from', this).html();
        var to = $('.to', this).html();
        var ad = $('.ad', this).html();
        var dd = $('.dd', this).html();
        var air = $('.air', this).html();
        var fn = $('.fn', this).html();
        var st = $('.st', this).html();

        currentFlight = {};
        currentFlight.id = id;
        currentFlight.from = from;
        currentFlight.to = to;
        currentFlight.airline = air;
        currentFlight.arrivalDate = ad;
        currentFlight.departureDate = dd;
        currentFlight.flightNumber = fn;
        currentFlight.flightStatus = st;

        sessionStorage.setItem('currentFlight', id + ',' + from + ',' + to + ',' + ad + ',' + dd + ',' + air + ',' + fn + ',' + st);

    });
});


function initDetails() {
    var flightDetails = sessionStorage.getItem('currentFlight');
    parseData(flightDetails);
}

function parseData(flightRow) {
    var flight = flightRow.split(',');
    flightDetails = {};
    flightDetails.id = flight[0];
    flightDetails.from = flight[1];
    flightDetails.to = flight[2];
    flightDetails.arrivalDate = flight[3];
    flightDetails.departureDate = flight[4];
    flightDetails.airline = flight[5];
    flightDetails.flightNumber = flight[6];
    flightDetails.flightStatus = flight[7];
    renderDetails(flightDetails);
}


function renderDetails(flight) {
    $('#flightId').val(flight.id);
    $('#from').val(flight.from);
    $('#to').val(flight.to);
    $('#airline').val(flight.airline);
    $('#arrivalDate').val(flight.arrivalDate);
    $('#departureDate').val(flight.departureDate);
    $('#flightNumber').val(flight.flightNumber);
    $('#flightStatus').val(flight.flightStatus);

}

// Helper function to serialize all the form fields into a JSON string
function formToJSON() {
    var flightId = $('#flightId').val();
    var flightStatus = $('#flightStatus').val();
    return JSON.stringify({
        "id": flightId == "" ? null : flightId,
        "from": $('#from').val(),
        "to": $('#to').val(),
        "arrivalDate": $('#arrivalDate').val(),
        "departureDate": $('#departureDate').val(),
        "airline": $('#airline').val(),
        "flightNumber": $('#flightNumber').val(),
        "flightStatus": $('#flightStatus').val()
    });
}
  