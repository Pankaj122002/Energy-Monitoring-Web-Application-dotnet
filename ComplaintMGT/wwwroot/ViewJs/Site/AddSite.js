



$(document).ready(function () {
    $('.form-control-select2').each(function () {
        var $p = $(this).parent();
        $(this).select2({
            dropdownParent: $p
        });
    });
   
    checkboxUI();
   
});

$("#CountryId").change(function () {

    var ddlsource = $("#CountryId").val();
    $.ajax({
        type: "GET",
        url: "/Configuration/GetStateByCountry?CountryId=" + ddlsource,
        data: "{}",
        success: function (Mydata) {
            var data = JSON.parse(Mydata);
            $("#StateId").empty();
            var s = '<option value="">Please Select</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].StateId + '">' + data[i].StateName + '</option>';
            }
            $("#StateId").html(s);
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });
});
$('#StateId').change(function () {
    var ddlsource = $('#StateId').val();
    $.ajax({
        type: "GET",
        url: "/Configuration/GetCityByStateId?StateId=" + ddlsource,
        data: "{}",
        success: function (Mydata) {
            var data = JSON.parse(Mydata);
            $("#CityId").empty();
            var s = '<option value="">Please Select</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].CityId + '">' + data[i].CityName + '</option>';
            }
            $("#CityId").html(s);
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });
});
