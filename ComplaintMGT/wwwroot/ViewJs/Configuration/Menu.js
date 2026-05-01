$(document).ready(function () {
    $('#tlbConfiguration').DataTable().clear().destroy();
    
    GetDataTableData();

});


function Formsubmit() {
    SaveAndUpdateMenuInfo();
}



function GetDataTableData() {
    
    $('#tlbConfiguration tbody').empty();
    ShowLoading('#tlbConfiguration');
    if ($('#hfTotalrows').val() > 0)
        $('#tlbConfiguration').DataTable().clear().destroy();
    $.ajax({
        type: "post",
        url: "/Configuration/GetAllMenuM",
        data: '{}',
        success: function (data) {
            
            var myJSON = JSON.parse(data);

            var rowcount = myJSON.length;


            for (var i = 0; i < myJSON.length; i++) {
                var txtrow = ''
                if (myJSON[i].fbIsActive)
                    txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].ParentName + '</td><td>' + myJSON[i].ftMenuName + '</td><td>' + myJSON[i].fnOrderId + '</td><td><i class="' + myJSON[i].ftMCssIcon + ' mr-2"></i></td><td><span class="badge badge-success">ACTIVE</span></td><td><a isactive="' + myJSON[i].fbIsActive + '" roleName="' + myJSON[i].ftMenuName + '" cid="' + myJSON[i].fnMenuId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-pencil"></i></a></td></tr>';
                else
                    txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].ParentName + '</td><td>' + myJSON[i].ftMenuName + '</td><td>' + myJSON[i].fnOrderId + '</td><td><i class="' + myJSON[i].ftMCssIcon + ' mr-2"></i></td><td><span class="badge badge-danger">DE-ACTIVE</span></td><td><a isactive="' + myJSON[i].fbIsActive + '" roleName="' + myJSON[i].ftMenuName + '" cid="' + myJSON[i].fnMenuId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-pencil"></i></a></td></tr>';

                $('#tlbConfiguration tbody').append(txtrow);
            }
            // $("#tlbRole tbody").html(txtrow);

            var tabid = $('#tlbConfiguration');
            $('#hfTotalrows').val(rowcount);
            if ($('#hfTotalrows').val() > 0)
                setdatatable();
            HideLoading('#tlbConfiguration');
        }
    });
}



function SaveAndUpdateMenuInfo() {

    if ($('#MenuName').val().trim() == '' || $('#Order').val().trim() == '' || $('#Icon').val().trim() == '' ) {
        massage(3,'Please fill all required fields');
        return;
    }
  
    var ModuleId = 1;
    var fromData = {
        MenuId: $('#MenuId').val(),
        ParentId: $('#ParentId').val(),
        MenuName: $('#MenuName').val(),
        Order: $('#Order').val(),
        Icon: $('#Icon').val(),
        ModuleId: ModuleId,
        IsActive: $('#IsActive').is(':checked')

    }
    var isActive = $('#IsActive').is(':checked');
    var rid = $('#MenuId').val();
    

   
    $.ajax({
        type: "POST",
        url: '/Configuration/AddOrUpdateMenu',
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
        url: "/Configuration/GetAllMenuMP/",
        data: {},
        datatype: "json",
        //traditional: true,
        success: function (data) {
            var myJSON = JSON.parse(data);

            var rowcount = myJSON.length;
            var Resource = "<select id='ParentId'>";
           
            Resource = Resource + '<option value="0">Select</option>';
            for (var i = 0; i < rowcount; i++) {
                Resource = Resource + '<option value=' + myJSON[i].Value + '>' + myJSON[i].Text + '</option>';
            }
            Resource = Resource + '</select>';
            $('#ParentId').html(Resource);
        }
    });

}

function CallFunc(obj) {

    GetAllMenuP();
    var rid = $(obj).attr('cid');

    if (rid > 0) {
        $('#modalTitle').text('Update Menu Information');
        GetMenuById(rid);
    }
    else {
        $('#modalTitle').text('Add Menu Information');
    }
    
    $('#modal_form_vertical').modal('toggle');
   


}

function GetMenuById(rid) {
    $.ajax({
        type: "post",
        url: "/Configuration/GetMenuById?Id=" + rid,
        data: '{}',
        success: function (response) {
            var data = JSON.parse(response);
            $('#MenuId').val(data.MenuId);
            $('#ParentId').val(data.ParentId);
            $('#MenuName').val(data.MenuName);
            $('#Order').val(data.Order);
            $('#Icon').val(data.Icon);
        }
    });
}
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};
