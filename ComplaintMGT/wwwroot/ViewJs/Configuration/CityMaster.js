$(document).ready(function () {
    $('#tlbSate').DataTable().clear().destroy();
    GetDataTableData();
    GetSate();
});

function Formsubmit() {
    SaveAndUpdateMenuInfo();
}
function GetDataTableData() {

    $('#tlbSate tbody').empty();
    ShowLoading('#tlbSate');
    if ($('#hfTotalrows').val() > 0)
        $('#tlbSate').DataTable().clear().destroy();
    $.ajax({
        type: "post",
        url: "/Configuration/GetAllCity",
        data: '{}',
        success: function (data) {

            var myJSON = JSON.parse(data);

            var rowcount = myJSON.length;


            for (var i = 0; i < myJSON.length; i++) {
                var txtrow = ''
                if (myJSON[i].Active)
                    txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].CityName + '</td><td>' + myJSON[i].StateName + '</td><td><span class="badge badge-success">ACTIVE</span></td><td><a isactive="' + myJSON[i].Active + '" StateName="' + myJSON[i].StateId + '" CityName="' + myJSON[i].CityName + '" cid="' + myJSON[i].CityId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-pencil"></i></a></td></tr>';
                else
                    txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].CityName + '</td><td>' + myJSON[i].StateName + '</td><td><span class="badge badge-danger">DE-ACTIVE</span></td><td><a isactive="' + myJSON[i].Active + '" StateName="' + myJSON[i].StateId + '" CityName="' + myJSON[i].CityName + '" cid="' + myJSON[i].CityId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-pencil"></i></a></td></tr>';

                $('#tlbSate tbody').append(txtrow);
            }
            // $("#tlbRole tbody").html(txtrow);

            var tabid = $('#tlbSate');
            $('#hfTotalrows').val(rowcount);
            if ($('#hfTotalrows').val() > 0)
                setdatatable();
            HideLoading('#tlbSate');
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });
}



function SaveAndUpdateCity() {

    if ($('#txtCity').val().trim() == '') {
        alert('City name is required');
        return;
    }
    else if ($('#ddlState').find(":selected").attr('value') == '') {
        alert('State is required');
        return;
    }
    var isvalid = 1;
    var menuary = [];
    var isActive = $('#cbIsActive').is(':checked');
    var cid = $('#CityId').val();

    $.ajax({
        type: "POST",
        url: '/Configuration/SaveandupdateCity',
        data: { CityId: cid, CityName: $('#txtCity').val(), StateId: $('#ddlState').find(":selected").attr('value'), IsActive: isActive },
        success: function (reponse) {
            var data = JSON.parse(reponse);
            if (data.Result == 1 || data.Result == 2) {

                massage('1', data.Msg);
                GetDataTableData();
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
function setdatatable() {
    $('#tlbSate').DataTable({
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

        $('#modalTitle').text('Update City Information');
    }
    else {
        $('#modalTitle').text('Add City Information');
    }
    // $('#user_content').load("/User/AddRoles");
    $('#modal_form_vertical').modal('toggle');

   
    var State = $(obj).attr('StateName');
    var City = $(obj).attr('CityName');
    var IsActive = $(obj).attr('isactive');
    $('#txtCity').val(City);
    $('#ddlState').val(State);

    $('#CityId').val(rid);
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

function GetSate() {
    $.ajax({
        type: "post",
        url: "/Configuration/GetAllState",
        data: {},
        datatype: "json",
        traditional: true,
        success: function (data) {
           // alert(data);
            var d = JSON.parse(data);
            var Resource = "<select id='ddlState'>";
            Resource = Resource + '<option value="">Select State</option>';
            for (var i = 0; i < d.length; i++) {
                Resource = Resource + '<option value=' + d[i].StateId + '>' + d[i].StateName + '</option>';
            }
            Resource = Resource + '</select>';
            $('#ddlState').html(Resource);
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });
}
