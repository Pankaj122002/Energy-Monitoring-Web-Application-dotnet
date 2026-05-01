$(document).ready(function () {
   // GetAllCustomer();
    GetAllSite();

});
function GetAllCustomer() {

    $('#ddlCustomer').html('');

    $.ajax({
        type: "post",
        url: "/Configuration/GetAllCoustomer",
        data: '{}',
        dataType: "json",
        success: function (data) {

            var myJSON = data.data;
            var Resource = "<select id='ddlCustomer'>";
            Resource = Resource + '<option value="0">select</option>';
            for (var i = 0; i < myJSON.length; i++) {
                Resource = Resource + '<option value=' + myJSON[i].CustomerId + '>' + myJSON[i].Name + '</option>';
            }
            Resource = Resource + '</select>';
            $('#ddlCustomer').html(Resource);
        }
    });
}
function GetAllSite() {

    $.ajax({
        type: "POST",
        url: "/Deshboard/GetAllSiteByCustomerId?CustomerId=2",
        data: "{}",
        success: function (Mydata) {
            var data = JSON.parse(Mydata);
            $("#ddlSite").empty();
            var s = '<option value="0">Please Select</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].SiteId + '">' + data[i].Name + '</option>';
            }
            $("#ddlSite").html(s);
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });
}


//$('#ddlCustomer').change(function () {
//    var ddlsource = $('#ddlCustomer').val();
//    $.ajax({
//        type: "POST",
//        url: "/Deshboard/GetAllSiteByCustomerId?CustomerId=" + ddlsource,
//        data: "{}",
//        success: function (Mydata) {
//            var data = JSON.parse(Mydata);
//            $("#ddlSite").empty();
//            var s = '<option value="0">Please Select</option>';
//            for (var i = 0; i < data.length; i++) {
//                s += '<option value="' + data[i].SiteId + '">' + data[i].Name + '</option>';
//            }
//            $("#ddlSite").html(s);
//        },
//        error: function (result) {
//            massage('3', 'Something Went Wrong!');
//        }
//    });
//});

$('#ddlSite').change(function () {
    var ddlsource = $('#ddlSite').val();
    $.ajax({
        type: "POST",
        url: "/Deshboard/GetAllAssetBySiteId",
        data: { SiteId: ddlsource, DeviceType: '4,7' },
        success: function (Mydata) {
            var data = JSON.parse(Mydata);
            $("#ddlAsset").empty();
            var s = '<option value="0">All Asset</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].DeviceIdForExternal + '">' + data[i].AssetName + '</option>';
            }
            $("#ddlAsset").html(s);
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });
});


function GetFile(FType) {
    ShowLoading('.row');
    var FName = "";
    var Fromdate = $('#txtFDate').val();
    var Todate = $('#txtTDate').val();
    var AssetName = $('#ddlAsset').find('option:selected').text();
    var DeviceId = $('#ddlAsset').find('option:selected').val();
    $.ajax({
        type: "POST",
        url: "/Report/ExportGeHVACData",
        data: { FromDate: Fromdate, Todate: Todate, DeviceId: DeviceId, FType: FType, FName: FName ,DeviceType: '4,7'},
        xhrFields: {
            responseType: 'blob' // to avoid binary data being mangled on charset conversion
        },
        success: function (response) {
            HideLoading('.row');
            var ctype = '';
            if (FType == 'Excel')
                ctype = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            else
                ctype = 'application/pdf';

            var filename = "HVAC Report";//
            var blob = new Blob([response], { type: ctype });
            var DownloadUrl = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = DownloadUrl;
            if (FType == 'Excel')
                a.download = filename + ".xlsx";
            else
                a.download = filename + ".pdf";
            document.body.appendChild(a);
            a.click();
        },
        error: function (result) {
            HideLoading('.row');
        }
    });

}

var dt;
function GetDataTableData() {
    var Fromdate = $('#txtFDate').val();
    var Todate = $('#txtTDate').val();
    var AssetName = $('#ddlAsset').find('option:selected').text();
    var DeviceId = $('#ddlAsset').find('option:selected').val();
    dt = $('#example').DataTable({
        processing: true,
        destroy: true,
        responsive: true,
        serverSide: true,
        searchable: true,
        lengthMenu: [[10, 20, 50, 100, 500, 10000], [10, 20, 50, 100, 500, 10000]],
        language: {
            infoEmpty: "No records available",
            searchPlaceholder: "Search Records"
        },
        dom: 'Blfrtip',
        buttons: {
            buttons: [
                
                {
                    extend: 'colvis',
                    text: '<i class="icon-three-bars"></i>',
                    className: 'btn bg-blue btn-icon dropdown-toggle'
                }
            ]
        },
        initComplete: function () {
            $(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
        },
        ajax: {
            url: "/Report/GetAllUserData/",
            // contentType: "application/json",
            type: 'POST',
            data: function (d) {
                return { requestModel: d, FDate: Fromdate, TDate: Todate, DeviceId: DeviceId, DeviceType: '5,8' };
            },
            dataType: "json",
            dataSrc: function (json) {
                json.draw = json.draw;
                json.recordsTotal = json.recordsTotal;
                json.recordsFiltered = json.recordsFiltered;
                json.data = json.data;
                var return_data = json;
                return return_data.data;
            }
        },
        columns: [

            {
                sortable: false,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: "Country", sortable: false },
            { data: "State", sortable: false },
            { data: "City", sortable: false },
            { data: "Zone", sortable: false },
            { data: "SiteName", sortable: false },
            { data: "Asset", sortable: false },
            { data: "TDAte", sortable: false },
            { data: "TTime", sortable: false },
            { data: "Temp_in_degree", sortable: true }
            
            
        ]
    });

}