$(document).ready(function () {
    $('#tlbConfiguration').DataTable().clear().destroy();

    GetDataTableData();

});


function Formsubmit() {
    SaveAndUpdateSubMenuInfo();
}



function GetDataTableData() {

    $('#tlbConfiguration tbody').empty();
    ShowLoading('#tlbConfiguration');
    if ($('#hfTotalrows').val() > 0)
        $('#tlbConfiguration').DataTable().clear().destroy();
    $.ajax({
        type: "post",
        url: "/Configuration/GetAllSubMenuM",
        data: '{}',
        success: function (data) {

            var myJSON = JSON.parse(data);

            var rowcount = myJSON.length;


            for (var i = 0; i < myJSON.length; i++) {
                var txtrow = ''
                if (myJSON[i].fbIsActive)
                    txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].Menu + '</td><td>' + myJSON[i].ftSubMenuName + '</td><td>' + myJSON[i].fnOrderId + '</td><td>' + myJSON[i].ftControllerName + '</td><td>' + myJSON[i].ftActionName + '</td><td><i class="' + myJSON[i].ftSCssIcon + ' mr-2"></i></td><td><span class="badge badge-success">ACTIVE</span></td><td><a cid="' + myJSON[i].fnSubMenuId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-pencil"></i></a></td></tr>';
                else
                    txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].Menu + '</td><td>' + myJSON[i].ftSubMenuName + '</td><td>' + myJSON[i].fnOrderId + '</td><td>' + myJSON[i].ftControllerName + '</td><td>' + myJSON[i].ftActionName + '</td><td><i class="' + myJSON[i].ftSCssIcon + ' mr-2"></i></td><td><span class="badge badge-danger">DE-ACTIVE</span></td><td><a cid="' + myJSON[i].fnSubMenuId +'" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-pencil"></i></a></td></tr>';

                $('#tlbConfiguration tbody').append(txtrow);
            }
            // $("#tlbRole tbody").html(txtrow);

            var tabid = $('#tlbConfiguration');
            $('#hfTotalrows').val(rowcount);
            if ($('#hfTotalrows').val() > 0)
                setdatatable();
            HideLoading('#tlbConfiguration');
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });
}



function SaveAndUpdateSubMenuInfo() {

    if ($('#ftSubMenuName').val().trim() == '' || $('#fnOrderId').val().trim() == '' || $('#ftControllerName').val().trim() == '' || $('#ftActionName').val().trim() == '' || $('#ftSCssIcon').val().trim() == '') {
        massage(3, 'Please fill all required fields');
        return;
    }

   
    var fromData = {
        fnSubMenuId: $('#fnSubMenuId').val(),
        fnMenuId: $('#fnMenuId').val(),
        ftSubMenuName: $('#ftSubMenuName').val(),
        fnOrderId: $('#fnOrderId').val(),
        ftControllerName: $('#ftControllerName').val(),
        ftActionName: $('#ftActionName').val(),
        ftSCssIcon: $('#ftSCssIcon').val(),
        fbIsActive: $('#fbIsActive').is(':checked')

    }
    var isActive = $('#fbIsActive').is(':checked');
    var rid = $('#fnSubMenuId').val();



    $.ajax({
        type: "POST",
        url: '/Configuration/AddOrUpdateSubMenu',
        data: fromData,
        success: function (data) {

            if (data.Result == 1 || data.Result == 2) {
                GetDataTableData();
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
    $('#tlbConfiguration').DataTable({
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
function GetAllMenuP() {

    $.ajax({
        type: "post",
        url: "/Configuration/GetAllMenuM",
        data: {},
        datatype: "json",
        //traditional: true,
        success: function (data) {
            var myJSON = JSON.parse(data);

            var rowcount = myJSON.length;
            var Resource = "<select id='fnMenuId'>";

            Resource = Resource + '<option value="0">Select</option>';
            for (var i = 0; i < rowcount; i++) {
                Resource = Resource + '<option value=' + myJSON[i].fnMenuId + '>' + myJSON[i].ftMenuName + '</option>';
            }
            Resource = Resource + '</select>';
            $('#fnMenuId').html(Resource);
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });

}

function CallFunc(obj) {

    GetAllMenuP();
    var rid = $(obj).attr('cid');

    if (rid > 0) {
        $('#modalTitle').text('Update Sub Menu Information');
        GetSubMenuById(rid);
    }
    else {
        $('#modalTitle').text('Add Sub Menu Information');
    }

    $('#modal_form_vertical').modal('toggle');



}

function GetSubMenuById(rid) {
    $.ajax({
        type: "post",
        url: "/Configuration/GetSubMenuById?Id=" + rid,
        data: '{}',
        success: function (response) {
            var data = JSON.parse(response);
            $('#fnSubMenuId').val(data.fnSubMenuId);
            $('#fnMenuId').val(data.fnMenuId);
            $('#ftSubMenuName').val(data.ftSubMenuName);
            $('#fnOrderId').val(data.fnOrderId);
            $('#ftControllerName').val(data.ftControllerName);
            $('#ftActionName').val(data.ftActionName);
            $('#ftSCssIcon').val(data.ftSCssIcon);
        }
    });
}
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
