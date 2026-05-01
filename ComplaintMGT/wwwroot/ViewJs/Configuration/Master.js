$(document).ready(function () {
    $('#tlbRole').DataTable().clear().destroy();
    GetDataTableData();

});

function Formsubmit() {
    SaveAndUpdateMenuInfo();
}
function GetDataTableData() {

    $('#tlbRole tbody').empty();
    ShowLoading('#tlbRole');
    if ($('#hfTotalrows').val() > 0)
        $('#tlbRole').DataTable().clear().destroy();
    $.ajax({
        type: "post",
        url: "/Configuration/GetAllCountry",
        data: '{}',
        success: function (data) {
          
            var myJSON = JSON.parse(data);

            var rowcount = myJSON.length;


            for (var i = 0; i < myJSON.length; i++) {
                var txtrow = ''
                if (myJSON[i].Active)
                    txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].CountryName + '</td><td><span class="badge badge-success">ACTIVE</span></td><td><a isactive="' + myJSON[i].Active + '" roleName="' + myJSON[i].CountryName + '" cid="' + myJSON[i].CountryId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-pencil"></i></a></td></tr>';
                else
                    txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].CountryName + '</td><td><span class="badge badge-danger">DE-ACTIVE</span></td><td><a isactive="' + myJSON[i].Active + '" roleName="' + myJSON[i].CountryName + '" cid="' + myJSON[i].CountryId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-pencil"></i></a></td></tr>';

                $('#tlbRole tbody').append(txtrow);
            }
            // $("#tlbRole tbody").html(txtrow);

            var tabid = $('#tlbRole');
            $('#hfTotalrows').val(rowcount);
            if ($('#hfTotalrows').val() > 0)
                setdatatable();
            HideLoading('#tlbRole');
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });
}



function SaveAndUpdateCountry() {

    if ($('#txtCountry').val().trim() == '') {
        alert('Country name is required');
        return;
    }
    var isvalid = 1;
    var menuary = [];
    var isActive = $('#cbIsActive').is(':checked');
    var cid = $('#CountryId').val();
   
    $.ajax({
        type: "POST",
        url: '/Configuration/SaveandupdateCountry',
        data: { CountryName: $('#txtCountry').val(), CountryId: cid, IsActive: isActive },
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
        $('#modalTitle').text('Update Country Information');
    }
    else {
        $('#modalTitle').text('Add Country Information');
    }
    // $('#user_content').load("/User/AddRoles");
    $('#modal_form_vertical').modal('toggle');
    //GetAllMenu(rid);

    var RoleName = $(obj).attr('rolename');
    var IsActive = $(obj).attr('isactive');
    $('#txtCountry').val(RoleName);

    $('#CountryId').val(rid);
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

