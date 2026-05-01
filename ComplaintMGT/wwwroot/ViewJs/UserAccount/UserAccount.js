
$(document).ready(function () {
    GetDataTableData();
   
    
});



var dt;
function GetDataTableData() {
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
        },
        initComplete: function () {
            $(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
        },
        ajax: {
            url: "/User/GetAllUserData/",
            // contentType: "application/json",
            type: 'POST',
            data: function (d) {
                return { requestModel: d };
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
            { data: "CustomarName", sortable: true },
            { data: "FullName", sortable: true },
            { data: "UserName", sortable: true },
            { data: "RoleName", sortable: true },
            { data: "EmailId", sortable: true },
            { data: "Mobile", sortable: true },
            { data: "LastLogin", sortable: false },
            {
                sortable: false,
                "render": function (data, type, row, meta) {
                    return '<img src = "/Images/UserImage/' + row.ImgUrl +'" alt = "" class="img-preview rounded" >';
                }
            },
            {
                sortable: true,
                "render": function (data, type, row, meta) {

                    if (row.IsActive == 'Active')
                        return '<span class="badge badge-success">ACTIVE</span>';
                    else
                        return '<span class="badge badge-danger">DE-ACTIVE</span>';

                }
            },
            {
                sortable: false,
                "render": function (data, type, row, meta) {

                    var singleSentShowURL = '/User/GetUserDataById';
                    singleSentShowURL = singleSentShowURL + "?param=" + row.UserId;
                    return "<a cid='" + row.UserId + "' href='javascript:void(0);' title='edit' loginid='" + row.EmailId + "' onclick='CallFunc(this);'><i class='icon-pencil'></i></a>";
                }
            }
        ]
    });
    
}
function GetAllRoles() {
    $('#ddlRole').html('');

    $.ajax({
        type: "post",
        url: "/User/GetAllRoles",
        data: {},
        datatype: "json",
        traditional: true,
        success: function (response) {
            var data = JSON.parse(response);
            var Resource = "<select id='ddlRole'>";
            Resource = Resource + '<option value="">Select</option>';
            for (var i = 0; i < data.length; i++) {
                Resource = Resource + '<option value=' + data[i].fnRoleId + '>' + data[i].ftRoleName + '</option>';
            }
            Resource = Resource + '</select>';
            $('#ddlRole').html(Resource);
        }
    });
}
function Formsubmit() {
    SaveAndUpdateMenuInfo();
    return false;
}
function SaveAndUpdateMenuInfo() {
    //debugger;
    var isvalid = 1;
    if ($("#FullName").val().trim() == '') { isvalid = 0; }
    if ($("#Email").val().trim() == '' || $("#CountryId").val().trim() == '' || $("#StateId").val().trim() == '' || $("#CityId").val().trim() == '' || $("#ZoneId").val().trim() == '')
    { isvalid = 0; }
    if ($("#ddlRole").val() == '')
    { isvalid = 0; }
    if ($("#ddlRole").val() == '' || $("#Address").val() == '')
    { isvalid = 0; }
    if ($("#Password").val().trim() == '' || $("#UserName").val().trim() == '' || $("#Email").val().trim() == '')
    { isvalid = 0; }

    if (isvalid == 1) {
        var FormData = {
            UserId: $("#UserId").val(),
            FullName: $("#FullName").val(),
            EmailId: $("#Email").val(),
            Pwd: $('#Password').val(),
            Mobile: $('#Mobile').val(),
            RoleId: $('#ddlRole').val(),
            IsActive: $("#IsActive").is(':checked'),
            CustCode: $("#ddlCustomer").val(),
            UserName: $("#UserName").val(),
            Address: $("#Address").val(),
            filename: $("#filename").val(),
        };

        var menuary = [];
        

       
                var sData = {
                    Countryid: $("#CountryId").val(),
                    Stateid: $("#StateId").val(),
                    Cityid: $("#CityId").val(),
                    ZoneId: $("#ZoneId").val()
                };
                menuary.push(sData);
      
        $.ajax({
            type: "POST",
            url: '/User/SaveandupdateUser',
            data: { jobj: JSON.stringify(FormData), JArrayval: JSON.stringify(menuary) },
            success: function (reponse) {
                var data = JSON.parse(reponse);
                if (data.Result == 1 || data.Result == 2) {
                    $('#modal_form_vertical').modal('toggle');
                    $('#FullName').val('');
                    $('#ddlCustomer').val('');
                    $('#Email').val('');
                    $('#Mobile').val('');
                    $('#ddlRole').val('');
                    $('#filename').val('');
                    $('#UserName').val('');
                    $('#Password').val('demo@123');
                    $('#UserId').val('0');
                    $('#IsActive').attr('checked', 'checked');
                    massage('1', data.Msg);
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
}

function GetUserInfo(cid) {
    $.ajax({
        type: "post",
        url: "/User/GetUserDataById",
        data: { UserId: cid },
        datatype: "json",
        traditional: true,
        success: function (data) {

            $('#FullName').val(data.FullName);
            $('#Address').val(data.Address);
            $('#ddlCustomer').val(data.CustCode);
            $('#Email').val(data.EmailId);
            $('#Mobile').val(data.Mobile);
            $('#ddlRole').val(data.RoleId);
            $('#Password').val(data.Pwd);
            $('#UserId').val(data.UserId);
            $('#UserName').val(data.UserName);
            $('#filename').val(data.ImgUrl);
            $('#CountryId').trigger("change")
            $('#CountryId').val(data.Countryid);
           
            if (data.IsActive == 'Active')
                $('#IsActive').attr('checked', 'checked');
            else
                $('#IsActive').removeAttr('checked');
            $('#UserName').attr('readonly', 'readonly');
        }
    });
}
function GetAllCustomer() {
    // var selected_val = $('#ddlCircle').find(":selected").attr('value');
    $('#ddlCustomer').html('');
   
    $.ajax({
        type: "post",
        url: "/Configuration/GetAllCoustomer",
        data: '{}',
        dataType: "json",
        success: function (data) {
          
            var myJSON = data.data;
            var Resource = "<select id='ddlCustomer'>";
            Resource = Resource + '<option value="">select</option>';
            for (var i = 0; i < myJSON.length; i++) {
                Resource = Resource + '<option value=' + myJSON[i].CustomerId + '>' + myJSON[i].Name + '</option>';
            }
            Resource = Resource + '</select>';
            $('#ddlCustomer').html(Resource);
        }
    });
}

function CallFunc(obj) {

    var ddId = $(obj).attr('cid');
    $('#user_content').load("/User/AddUser?param=" + ddId);
    if (ddId > 0) {
       // GetUserInfo(ddId);
        $('#modalTitle').text('Update User Information');
    }
    else {
        $('#modalTitle').text('Add User Information');
        //$('#FullName').val('');
        //$('#ddlCustomer').val('');
        //$('#Email').val('');
        //$('#Mobile').val('');
        //$('#ddlRole').val('');
        //$('#filename').val('');
        //$('#UserName').val('');
        //$('#Password').val('demo@123');
        //$('#UserId').val('0');
        $('#IsActive').attr('checked', 'checked');
       
    }
    var loginid = $(obj).attr('loginid');
   
    
    $('#modal_form_vertical').modal('toggle');
}
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};




