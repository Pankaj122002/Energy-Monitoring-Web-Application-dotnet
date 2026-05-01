$(document).ready(function () {
    $('#tlbRole').DataTable().clear().destroy();
    $('#tblMenumaster').DataTable().clear().destroy();
    GetDataTableData();

});

function Formsubmit() {
    SaveAndUpdateMenuInfo();
}

function CheckAll() {
    $('input[type=checkbox]').prop("checked", true);
}
function GetDataTableData() {

    $('#tlbRole tbody').empty();
    ShowLoading('#tlbRole');
    if ($('#hfTotalrows').val() > 0)
        $('#tlbRole').DataTable().clear().destroy();
    $.ajax({
        type: "post",
        url: "/User/GetAllRoles",
        data: '{}',
        success: function (data) {

            var myJSON = JSON.parse(data);

            var rowcount = myJSON.length;


            for (var i = 0; i < myJSON.length; i++) {
                var txtrow = ''
                if (myJSON[i].fbIsActive)
                    txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].ftRoleName + '</td><td>' + myJSON[i].CompanyName + '</td><td>' + myJSON[i].CCode + '</td><td><span class="badge badge-success">ACTIVE</span></td><td><a isactive="' + myJSON[i].fbIsActive + '" roleName="' + myJSON[i].ftRoleName + '" cid="' + myJSON[i].fnRoleId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-pencil"></i></a></td></tr>';
                else
                    txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].ftRoleName + '</td><td>' + myJSON[i].CompanyName + '</td><td>' + myJSON[i].CCode + '</td><td><span class="badge badge-danger">DE-ACTIVE</span></td><td><a isactive="' + myJSON[i].fbIsActive + '" roleName="' + myJSON[i].ftRoleName + '" cid="' + myJSON[i].fnRoleId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-pencil"></i></a></td></tr>';

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


function GetAllMenu(rid) {
    ShowLoading('#tblMenumaster');
    $('#tblMenumaster > tbody').empty();
    $.ajax({
        type: "post",
        url: "/User/GetAllMenuMaster",
        data: { roleId: rid },
        success: function (data) {
            var myJSON = JSON.parse(data);
            var myJSON1 = JSON.parse(myJSON.data1);
            var myJSON2 = JSON.parse(myJSON.data2);


            for (var i = 0; i < myJSON1.length; i++) {
                var sutd = '';
                var subHtm = '';
                for (var j = 0; j < myJSON2.length; j++) {
                    if (myJSON2[j].PMenuId == myJSON1[i].fnMenuId) {
                        if (myJSON2[j].IsEnable == 1) {

                            sutd += '<td>'
                            sutd += '         <div class="form-check form-check-switchery ">';
                            sutd += '              <label class="form-check-label">';
                            sutd += '              <input type="checkbox" checked="checked" class="form-check-input-switchery" submenuid="' + myJSON2[j].fnSubMenuId + '" data-fouc>' + myJSON2[j].ftSubMenuName;
                            sutd += '        </div>';
                            sutd += '</td>';

                           
                        }
                        else {
                            sutd += '<td>'
                            sutd += '         <div class="form-check form-check-switchery ">';
                            sutd += '              <label class="form-check-label">';
                            sutd += '              <input type="checkbox" class="form-check-input-switchery" submenuid="' + myJSON2[j].fnSubMenuId + '" data-fouc>' + myJSON2[j].ftSubMenuName;
                            sutd += '        </div>';
                            sutd += '</td>'

                        }
                    }
                }
                subHtm = '<table class="submenutable"><tr>' + sutd + '</tr></table>';
                // subHtm = '';
                var txtrow = '<tr><td>' + myJSON1[i].ftMenuName + '</td><td>' + subHtm + '</td></tr>';

                $('#tblMenumaster > tbody').append(txtrow);
                sutd = '';
                subHtm = '';
                checkboxUI();
                HideLoading('#tblMenumaster');
            }
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });
}
function SaveAndUpdateMenuInfo() {

    if ($('#txtRoleName').val().trim() == '') {
        alert('Role name is required');
        return;
    }
    if ($('#txtRoleName').val().trim().toLowerCase() == 'superadmin') {
        alert('superadmin already in use');
        return;
    }
    var isvalid = 1;
    var menuary = [];
    var isActive = $('#cbIsActive').is(':checked');
    var rid = $('#RoleId').val();
    var table = $(".submenutable tbody");

    $(".submenutable tbody tr").each(function () {
        $(this).find('td').each(function (key, val) {
            var ids = $(this).find('input[type=checkbox]').attr('submenuid');
            var isChecked = $(this).find('input[type=checkbox]').is(':checked');
            var sData = {
                fnSubMenuId: ids,
                fbIsAllow: isChecked
            };
            menuary.push(sData);
        });
    });
    $.ajax({
        type: "POST",
        url: '/User/SaveandupdateMenu',
        data: { roleName: $('#txtRoleName').val(), JArrayval: JSON.stringify(menuary), roleId: rid, IsActive: isActive },
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
        $('#modalTitle').text('Update Roles Information');
    }
    else {
        $('#modalTitle').text('Add Roles Information');
    }
   // $('#user_content').load("/User/AddRoles");
    $('#modal_form_vertical').modal('toggle');
    GetAllMenu(rid);

    var RoleName = $(obj).attr('rolename');
    var IsActive = $(obj).attr('isactive');
    $('#txtRoleName').val(RoleName);

    $('#RoleId').val(rid);
    if (IsActive=="true")
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
