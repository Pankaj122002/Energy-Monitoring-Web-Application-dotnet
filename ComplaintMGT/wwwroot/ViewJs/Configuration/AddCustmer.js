
$(document).ready(function () {
    $('.form-control-select2').each(function () {
        var $p = $(this).parent();
        $(this).select2({
            dropdownParent: $p
        });
    });
    GetAllAddressType();
    Country();
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


function AddAddressMedia() {
    
    var IsValid = 1;
    var count = 0;
    var AddressLine1 = $("#AddressLine1").val();
    var AddressLine2 = $("#AddressLine2").val();
    var ddlCountryId = $("#CountryId").val();
    var ddlCountry = $("#CountryId option:selected").text();
    var ddlstateId = $("#StateId").val();
    var ddlstate = $("#StateId option:selected").text();
    var ddlcityId = $("#CityId").val();
    var ddlcity = $("#CityId option:selected").text();
    var pinCode = $("#PinCode").val();
    var AddressTypeId = $("#AddressTypeId").val();
    var AddressType = $("#AddressTypeId option:selected").text();
    if (AddressLine1 == '' || AddressLine2 == '' || AddressTypeId == '0' || ddlCountryId == '' || ddlstateId == '' || ddlcityId == '' || pinCode == '')
        IsValid = 0;

    if (IsValid == 1) {
        var IsExist = false;
        $('#tbl_Address > tbody > tr').each(function (i, el) {
            var $tds = $(this).find('td');
            var IsSocialType = $tds.attr('data-SocialType');
            count = $tds.attr('data-count');
            if (IsSocialType == SocialMediaLink)
                IsExist = true;

        });

        if (IsExist == false) {
            count = parseInt(count) + 1;
            var tr = '<tr><td class="c" data-ddlCountryId=' + ddlCountryId + ' data-ddlstateId=' + ddlstateId + ' data-ddlcityId=' + ddlcityId + ' data-AddressTypeId=' + AddressTypeId + ' data-count=' + count + ' data-Id="0">' + count + '</td><td class="a" >' + AddressType + '</td><td>' + AddressLine1 + '</td><td>' + AddressLine2 + '</td><td>' + ddlCountry + '</td><td>' + ddlstate + '</td><td>' + ddlcity + '</td><td>' + pinCode +

                '</td><td><a class="list-icons-item text-danger-600 "  onclick="RemoveRowAddress(this);"> <i class="icon-trash"></i> </a>'
            '</td></tr>';

            $('#tbl_Address > tbody').append(tr);

            $("#AddressTypeId").val('0');
            $("#CityId").val('');
            $("#StateId").val('');
            $("#CountryId").val('');
            $("#AddressLine1").val('');
            $("#AddressLine2").val('');
            $("#PinCode").val('');


        }
        else
            massage('2', 'This adress is already exists');
    }
    else
        massage('2', 'Please Fill All Required Details');

}
function RemoveRowAddress(objthis) {
  
    $(objthis).closest('tr').remove();
}

function Formsubmit() {
    SaveAndUpdateCustomerInfo();
}

function SaveAndUpdateCustomerInfo() {
    var isvalid = 1;
   
   
  

    var FormData1 = {
        CustomerId: $("#CustomerId").val(),
        Name: $("#Name").val(),
        Description: $("#Description").val(),
        Email: $("#Email").val(),
        PhoneNumber: $('#PhoneNumber').val(),
        MobileNumber: $("#MobileNumber").val(),
        ContectPersonName: $('#ContectPersonName').val(),
        IsActive: $("#IsActive").is(':checked')


    };

    
    var address = [];
    $('#tbl_Address > tbody > tr').each(function (i, el) {
        var $tds = $(this).find('td');
        var sAddressId = $tds.attr('data-Id');
        var sCountryId = $tds.attr('data-ddlCountryId');
        var sstateId = $tds.attr('data-ddlstateId');
        var scityId = $tds.attr('data-ddlcityId');
        var sAddressTypeId = $tds.attr('data-AddressTypeId');
        var sAddress1 = $tds.eq(2).text();
        var sAddress2 = $tds.eq(3).text();
        var sPincode = $tds.eq(7).text();
        var data = {};
        
      
        data.CountryId = sCountryId;
        data.StateId = sstateId;
        data.CityId = scityId;
        data.AddressLine1 = sAddress1;
        data.AddressLine2 = sAddress2;
        data.PinCode = sPincode;
        data.AddressTypeId = sAddressTypeId;
        address.push(data);
    });

   
    

    

    if (FormData1.Name == '' || FormData1.Email == '' || FormData1.MobileNumber == '' || FormData1.ContectPersonName == '')
        isvalid = 0;
    if (address.length == 0)
        isvalid = 2
    
    if (isvalid == 1) {
        
        $.ajax({
            type: "POST",
            url: '/Configuration/SaveandupdateCustomer',
            data: { CustomerId: FormData1.CustomerId, Name: FormData1.Name, Description: FormData1.Description, Email: FormData1.Email, PhoneNumber: FormData1.PhoneNumber, MobileNumber: FormData1.MobileNumber, ContectPersonName: FormData1.ContectPersonName, IsActive: FormData1.IsActive, JArrayval: JSON.stringify(address) },
            success: function (reponse) {
                var data = JSON.parse(reponse);
                if (data.Result == 1 || data.Result == 2) {

                    massage('1', data.Msg);

                    $('#modal_form_vertical').modal('toggle');
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
        massage('2', 'Please Fill Requerd!');
    }
    else {
        massage('2', 'Please Fill Required!');
         }

}

function GetAllAddressType() {

    $.ajax({
        type: "post",
        url: "/Configuration/GetAllAddressType",
        data: {},
        datatype: "json",
        traditional: true,
        success: function (data) {
            var myJSON = JSON.parse(data);

            var rowcount = myJSON.length;
            var Resource = "<select id='CountryId'>";

            Resource = Resource + '<option value="0">Select</option>';
            for (var i = 0; i < rowcount; i++) {
                Resource = Resource + '<option value=' + myJSON[i].AddressTypeId + '>' + myJSON[i].Description + '</option>';
            }
            Resource = Resource + '</select>';
            $('#AddressTypeId').html(Resource);
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });

}

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