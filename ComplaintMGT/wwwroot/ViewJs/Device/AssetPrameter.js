$(document).ready(function () {
    $('#tlbRole').DataTable().clear().destroy();
    GetDataTableData();
    GetAssetType();
});

function Formsubmit() {
    SaveAndUpdateInfo();
    return false;
}
function GetDataTableData() {

    $('#tlbRole tbody').empty();
    ShowLoading('#tlbRole');
    if ($('#hfTotalrows').val() > 0)
        $('#tlbRole').DataTable().clear().destroy();
    $.ajax({
        type: "post",
        url: "/Device/GetAllAssetPrameters",
        data: '{}',
        success: function (response) {

            if (response.Status == 200) {
                var myJSON = JSON.parse(response.data);

                var rowcount = myJSON.length;


                for (var i = 0; i < myJSON.length; i++) {
                    var txtrow = ''
                    if (myJSON[i].IsActive)
                        txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].AssetType + '</td><td>' + myJSON[i].ParameterName + '</td><td>' + myJSON[i].MeasurementUnit + '</td><td>' + myJSON[i].Description + '</td><td><span class="badge badge-success">ACTIVE</span></td><td><a AssetTypeId="' + myJSON[i].AssetTypeId + '" ParameterName="' + myJSON[i].ParameterName + '" MeasurementUnit="' + myJSON[i].MeasurementUnit + '" IsActive="' + myJSON[i].IsActive + '" Description="' + myJSON[i].Description + '" cid="' + myJSON[i].AssetPrametersId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-pencil"></i></a>&nbsp;<a cid="' + myJSON[i].AssetPrametersId + '" href="javascript: void (0);" title="Delete" onclick="Delete(this);"><i class="icon-trash text-danger"></i></a></td></tr>';
                    else
                        txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].AssetType + '</td><td>' + myJSON[i].ParameterName + '</td><td>' + myJSON[i].MeasurementUnit + '</td><td>' + myJSON[i].Description + '</td><td><span class="badge badge-danger">DE-ACTIVE</span></td><td><a AssetTypeId="' + myJSON[i].AssetTypeId + '" ParameterName="' + myJSON[i].ParameterName + '" MeasurementUnit="' + myJSON[i].MeasurementUnit + '" IsActive="' + myJSON[i].IsActive + '" Description="' + myJSON[i].Description + '" cid="' + myJSON[i].AssetPrametersId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-pencil"></i></a>&nbsp;<a cid="' + myJSON[i].AssetPrametersId + '" href="javascript: void (0);" title="Delete" onclick="Delete(this);"><i class="icon-trash text-danger"></i></a></td></tr>';

                    $('#tlbRole tbody').append(txtrow);
                }
                // $("#tlbRole tbody").html(txtrow);

                var tabid = $('#tlbRole');
                $('#hfTotalrows').val(rowcount);
                if ($('#hfTotalrows').val() > 0)
                    setdatatable();
                HideLoading('#tlbRole');
            }
            else {
                HideLoading('#tlbRole');
                massage('3', 'Something Went Wrong!');
            }
        },
        error: function (result) {
            HideLoading('#tlbRole');
            massage('3', 'Something Went Wrong!');
        }
    });
}



function SaveAndUpdateInfo() {
   // alert($('#AssetTypeId').val());
    if ($('#AssetTypeId').val() == null || $('#AssetTypeId').val() == '0' || $('#ParameterName').val().trim() == '' || $('#MeasurementUnit').val().trim() == '' || $('#Description').val().trim() == '') {
        massage('2','Please Fill Required!');
        return;
    }
    var isvalid = 1;
    var menuary = [];
    var isActive = $('#cbIsActive').is(':checked');
    var cid = $('#AssetPrametersId').val();

    $.ajax({
        type: "POST",
        url: '/Device/SaveandupdateAssetPrameters',
        data: { Description: $('#Description').val(), AssetPrametersId: cid, IsActive: isActive, ParameterName: $('#ParameterName').val(), MeasurementUnit: $('#MeasurementUnit').val(), AssetTypeId: $('#AssetTypeId').val() },
        success: function (reponse) {

            if (reponse.Status == 200) {
                var data = reponse.data;
                if (data.Result == 1 || data.Result == 2) {

                    massage('1', data.Msg);
                    GetDataTableData();
                    $('#modal_form_vertical').modal('toggle');
                }
                else
                    massage('2', data.Msg);
            }
            else {
                massage('3', 'Something Went Wrong!');
            }
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });
}
function setdatatable() {
    $('#tlbRole').DataTable({
        destroy: true,
        "responsive": true,
        "order": [[0, "asc"]],
        lengthMenu: [
            [10, 25, 50, 500, 1000, 5000],
            ['10 rows', '25 rows', '50 rows', '500 rows', '1000 rows', '5000 rows']
        ],
        language: {
            infoEmpty: "No records available",
        },
        dom: 'Blfrtip',
        buttons: {
            buttons: [
                {
                    extend: 'copyHtml5',
                    className: 'btn btn-light',
                    text: '<i class="icon-copy3 mr-2"></i> Copy'
                },
                {
                    extend: 'csvHtml5',
                    className: 'btn btn-light',
                    text: '<i class="icon-file-spreadsheet mr-2"></i> CSV',
                    fieldSeparator: '\t',
                    extension: '.csv'
                },
                {
                    extend: 'colvis',
                    text: '<i class="icon-three-bars"></i>',
                    className: 'btn bg-blue btn-icon dropdown-toggle'
                }
            ]
        }

    });
}

function CallFunc(obj) {


    var rid = $(obj).attr('cid');

    if (rid > 0) {
        $('#modalTitle').text('Update Asset Prameter Information');
    }
    else {
        $('#modalTitle').text('Add Asset Prameter Information');
    }
    // $('#user_content').load("/User/AddRoles");
    $('#modal_form_vertical').modal('toggle');
    //GetAllMenu(rid);

    var Description = $(obj).attr('Description');
    var AssetTypeId = $(obj).attr('AssetTypeId');
    var ParameterName = $(obj).attr('ParameterName');
    var MeasurementUnit = $(obj).attr('MeasurementUnit');
    var IsActive = $(obj).attr('IsActive');
    $('#Description').val(Description);
    $('#AssetTypeId').val(AssetTypeId);
    $('#ParameterName').val(ParameterName);
    $('#MeasurementUnit').val(MeasurementUnit);

    $('#AssetPrametersId').val(rid);
    if (IsActive == "true")
        $('#cbIsActive').attr('checked', 'checked');
    else
        $('#cbIsActive').removeAttr('checked');


}
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function Delete(obj) {
    swal({
        title: "Are you sure?",
        text: "you want to delete this Record?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                var rid = $(obj).attr('cid');
                $.ajax({
                    type: "Delete",
                    url: '/Device/DeleteAssetPrameters',
                    data: { Id: rid },
                    success: function (reponse) {
                        //debugger;
                        if (reponse.Status == 200) {
                            var data = JSON.parse(reponse.data);
                            if (data.Result == 1 || data.Result == 2) {

                                massage('1', data.Msg);
                                GetDataTableData();

                            }
                            else
                                massage('2', data.Msg);
                        }
                        else {
                            massage('3', 'Something Went Wrong!');
                        }
                    },
                    error: function (result) {
                        massage('3', 'Something Went Wrong!');
                    }
                });

            }
        });
}

function GetAssetType() {
    $.ajax({
        type: "post",
        url: "/Device/GetAllAssetType",
        data: {},
        datatype: "json",
        traditional: true,
        success: function (response) {
            if (response.Status == 200) {
               
                var d = JSON.parse(response.data);
                var Resource = "<select id='AssetTypeId'>";
                  Resource = Resource + '<option value="0">Select Asset Type</option>';
                for (var i = 0; i < d.length; i++) {
                    Resource = Resource + '<option value=' + d[i].AssetTypeId + '>' + d[i].Description + '</option>';
                }
                Resource = Resource + '</select>';
                $('#AssetTypeId').html(Resource);
            }
            
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });
}