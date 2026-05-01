
$(document).ready(function () {
    $('.form-control-select2').each(function () {
        var $p = $(this).parent();
        $(this).select2({
            dropdownParent: $p
        });
    });
   
    checkboxUI();
  
});

$("#file-input-x").change(function () {

    var isvalid = 1;
    var data = new FormData();

    var fileUpload = $("#file-input-x").get(0);

    var files = fileUpload.files;

    for (var i = 0; i < files.length; i++) {
        data.append(files[i].name, files[i]);
    }
    data.append("FolderName", JSON.stringify('UserImage'))
    if (isvalid == 1) {
        $.ajax({
            type: "POST",
            //  dataType: 'json',
            url: '/Master/UploadFile',
            contentType: false,
            processData: false,
            data: data,
            success: function (data) {

                if (data.Result == 1 || data.Result == 2) {
                    $('#filename').val(data.Code);
                    massage('1', data.Msg);


                }
                else
                    massage('2', data.Msg);

            },
            error: function (result) {
                massage('3', 'Something Went Wrong!');
            }
        });
    }
    else if (isvalid == 2) {
        massage('2', 'Please Select Image');
    }
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

$('#CityId').change(function () {
    var ddlsource = $('#CityId').val();
    $.ajax({
        type: "GET",
        url: "/Configuration/GetZoneByCityId?CityId=" + ddlsource,
        data: "{}",
        success: function (Mydata) {
            var data = JSON.parse(Mydata);
            $("#ZoneId").empty();
            var s = '<option value="">Please Select</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].ZoneId + '">' + data[i].ZoneName + '</option>';
            }
            $("#ZoneId").html(s);
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });
});

function Country() {

    $.ajax({
        type: "post",
        url: "/Configuration/GetAllCountry",
        data: {},
        datatype: "json",
        traditional: true,
        success: function (data) {
            var myJSON = JSON.parse(data);

            var rowcount = myJSON.length;
            var Resource = "<select id='CountryId'>";

            Resource = Resource + '<option value="0">Select</option>';
            for (var i = 0; i < rowcount; i++) {
                Resource = Resource + '<option value=' + myJSON[i].CountryId + '>' + myJSON[i].CountryName + '</option>';
            }
            Resource = Resource + '</select>';
            $('#CountryId').html(Resource);
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });

}
