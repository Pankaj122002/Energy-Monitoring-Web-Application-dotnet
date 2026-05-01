$(document).ready(function () {
    $('#tlbRole').DataTable().clear().destroy();
    GetDataTableData();
    GetSite();
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
        url: "/Site/GetAllSiteOperatingRules",
        data: '{}',
        success: function (response) {

            if (response.Status == 200) {
                var myJSON = JSON.parse(response.data);

                var rowcount = myJSON.length;


                for (var i = 0; i < myJSON.length; i++) {
                    var txtrow = ''
                    if (myJSON[i].IsActive)
                        txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].Name + '</td><td>' + myJSON[i].Rules + '</td><td><span class="badge badge-success">ACTIVE</span></td><td><a IsActive="' + myJSON[i].IsActive + '" Rules="' + myJSON[i].Rules + '" SiteId="' + myJSON[i].SiteId + '" cid="' + myJSON[i].OperatingParameterId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-pencil"></i></a>&nbsp;<a cid="' + myJSON[i].OperatingParameterId + '" href="javascript: void (0);" title="Delete" onclick="Delete(this);"><i class="icon-trash text-danger"></i></a></td></tr>';
                    else
                        txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].Name + '</td><td>' + myJSON[i].Rules + '</td><td><span class="badge badge-danger">DE-ACTIVE</span></td><td><a IsActive="' + myJSON[i].IsActive + '" Rules="' + myJSON[i].Rules + '" SiteId="' + myJSON[i].SiteId + '" cid="' + myJSON[i].OperatingParameterId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-trash"></i></a>&nbsp;<a cid="' + myJSON[i].OperatingParameterId + '" href="javascript: void (0);" title="Delete" onclick="Delete(this);"><i class="icon-trash text-danger"></i></a></td></tr>';

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



function SaveAndUpdate() {

    if ($('#SiteId').val().trim() == '' || $('#Rules').val().trim() == '') {
        massage('2','Address Type is required');
        return;
    }
    var isvalid = 1;
    var menuary = [];
    var isActive = $('#cbIsActive').is(':checked');
    var cid = $('#OperatingParameterId').val();

    $.ajax({
        type: "POST",
        url: '/Site/AddOrUpdateSiteOperatingRules',
        data: { Rules: $('#Rules').val(),SiteId: $('#SiteId').val(), OperatingParameterId: cid, IsActive: isActive },
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
        $('#modalTitle').text('Update Site Operating Rules Information');
    }
    else {
        $('#modalTitle').text('Add Site Operating Rules Information');
    }
    // $('#user_content').load("/User/AddRoles");
    $('#modal_form_vertical').modal('toggle');
    //GetAllMenu(rid);

    var SiteId = $(obj).attr('SiteId');
    var Rules = $(obj).attr('Rules');
    var IsActive = $(obj).attr('IsActive');
    $('#SiteId').val(SiteId);
    $('#Rules').val(Rules);

    $('#OperatingParameterId').val(rid);
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
                    url: '/Site/DeleteSiteOperatingRules',
                    data: { Id: rid },
                    success: function (reponse) {
                        
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

function GetSite() {
    $.ajax({
        type: "post",
        url: "/Site/GetAllSite",
        data: {},
        datatype: "json",
        traditional: true,
        success: function (data) {
            if (data.Status == 200) {
               
                var d = JSON.parse(data.data);
                var Resource = "<select id='SiteId'>";
                Resource = Resource + '<option value="">Select Site</option>';
                for (var i = 0; i < d.length; i++) {
                    Resource = Resource + '<option value=' + d[i].SiteId + '>' + d[i].Name + '</option>';
                }
                Resource = Resource + '</select>';
                $('#SiteId').html(Resource);
            }
            // alert(data);
            
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });
}
