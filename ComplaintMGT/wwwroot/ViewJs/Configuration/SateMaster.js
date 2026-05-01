$(document).ready(function () {
    $('#tlbSate').DataTable().clear().destroy();
    GetDataTableData();
    GetCountry();
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
        url: "/Configuration/GetAllState",
        data: '{}',
        success: function (data) {

            var myJSON = JSON.parse(data);

            var rowcount = myJSON.length;


            for (var i = 0; i < myJSON.length; i++) {
                var txtrow = ''
                if (myJSON[i].Active)
                    txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].StateName + '</td><td>' + myJSON[i].CountryName + '</td><td><span class="badge badge-success">ACTIVE</span></td><td><a isactive="' + myJSON[i].Active + '" CountryName="' + myJSON[i].CountryId + '" StateName="' + myJSON[i].StateName + '" cid="' + myJSON[i].StateId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-pencil"></i></a></td></tr>';
                else
                    txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].StateName + '</td><td>' + myJSON[i].CountryName + '</td><td><span class="badge badge-danger">DE-ACTIVE</span></td><td><a isactive="' + myJSON[i].Active + '" CountryName="' + myJSON[i].CountryId + '" StateName="' + myJSON[i].StateName + '" cid="' + myJSON[i].StateId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-pencil"></i></a></td></tr>';

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



function SaveAndUpdateSate() {

    if ($('#txtState').val().trim() == '') {
        alert('State name is required');
        return;
    }
    else if ($('#ddlCountry').find(":selected").attr('value') == '') {
        alert('Country is required');
        return;
    }
    var isvalid = 1;
    var menuary = [];
    var isActive = $('#cbIsActive').is(':checked');
    var cid = $('#stateId').val();

    $.ajax({
        type: "POST",
        url: '/Configuration/SaveandupdateState',
        data: { StateId: cid, StateName: $('#txtState').val(), CountryId: $('#ddlCountry').find(":selected").attr('value'), IsActive: isActive },
        success: function (reponse) {
            var data = JSON.parse(reponse);
            if (data.Result == 1 || data.Result == 2) {

                massage('1', data.Msg);

                $('#modal_form_vertical').modal('toggle');
                GetDataTableData();
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
        
        $('#modalTitle').text('Update State Information');
    }
    else {
        $('#modalTitle').text('Add State Information');
    }
    // $('#user_content').load("/User/AddRoles");
    $('#modal_form_vertical').modal('toggle');
    
  
   
    var Country = $(obj).attr('CountryName');
    var StateName = $(obj).attr('StateName');
    var IsActive = $(obj).attr('isactive');
    $('#txtState').val(StateName);
    $('#ddlCountry').val(Country);

    $('#stateId').val(rid);
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

function GetCountry() {
    $.ajax({
        type: "post",
        url: "/Configuration/GetAllCountry",
        data: {},
        datatype: "json",
        traditional: true,
        success: function (data) {
           
            var d = JSON.parse(data);
            var Resource = "<select id='ddlCountry'>";
            Resource = Resource + '<option value="">Select Country</option>';
            for (var i = 0; i < d.length; i++) {
                Resource = Resource + '<option value=' + d[i].CountryId + '>' + d[i].CountryName + '</option>';
            }
            Resource = Resource + '</select>';
            $('#ddlCountry').html(Resource);
        }
    });
}
