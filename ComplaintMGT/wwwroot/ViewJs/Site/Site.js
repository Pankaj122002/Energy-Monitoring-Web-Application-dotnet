$(document).ready(function () {
    $('#tlb').DataTable().clear().destroy();
    GetDataTableData();

});
function GetDataTableData() {

    $('#tlb tbody').empty();
    ShowLoading('#tlb');
    if ($('#hfTotalrows').val() > 0)
        $('#tlb').DataTable().clear().destroy();
    $.ajax({
        type: "post",
        url: "/Site/GetAllSite",
        data: '{}',
        success: function (response) {

            if (response.Status == 200) {
                var myJSON = JSON.parse(response.data);

                var rowcount = myJSON.length;


                for (var i = 0; i < myJSON.length; i++) {
                    var txtrow = ''
                    var dts = ''
                    if (myJSON[i].IsDSTEnabled) {
                        dts ='</td><td><span class="badge badge-success">Enable</span>'
                    }
                    else {
                        dts = '</td><td><span class="badge badge-danger">Disable</span>'
                    }
                    if (myJSON[i].IsActive)
                        txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].Customer + '</td><td>' + myJSON[i].Name + '</td><td>' + myJSON[i].CountryName + '</td><td>' + myJSON[i].StateName + '</td><td>' + myJSON[i].CityName + '</td><td>' + myJSON[i].AddressLine1 + '</td><td>' + myJSON[i].AddressLine2 + '</td><td>' + myJSON[i].PinCode  + dts +'</td><td><span class="badge badge-success">ACTIVE</span></td><td><a " cid="' + myJSON[i].SiteId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-pencil"></i></a>&nbsp;<a cid="' + myJSON[i].SiteId + '" href="javascript: void (0);" title="Delete" onclick="Delete(this);"><i class="icon-trash text-danger"></i></a></td></tr>';
                    else
                        txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].Customer + '</td><td>' + myJSON[i].Name + '</td><td>' + myJSON[i].CountryName + '</td><td>' + myJSON[i].StateName + '</td><td>' + myJSON[i].CityName + '</td><td>' + myJSON[i].AddressLine1 + '</td><td>' + myJSON[i].AddressLine2 + '</td><td>' + myJSON[i].PinCode  + dts +'</td><td><span class="badge badge-danger">DE-ACTIVE</span></td><td><a " cid="' + myJSON[i].SiteId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-trash"></i></a>&nbsp;<a cid="' + myJSON[i].SiteId + '" href="javascript: void (0);" title="Delete" onclick="Delete(this);"><i class="icon-trash text-danger"></i></a></td></tr>';

                    $('#tlb tbody').append(txtrow);
                }
                // $("#tlbRole tbody").html(txtrow);

                var tabid = $('#tlb');
                $('#hfTotalrows').val(rowcount);
                if ($('#hfTotalrows').val() > 0)
                    setdatatable();
                HideLoading('#tlb');
            }
            else {
                HideLoading('#tlb');
                massage('3', 'Something Went Wrong!');
            }
        },
        error: function (result) {
            HideLoading('#tlb');
            massage('3', 'Something Went Wrong!');
        }
    });
}

function setdatatable() {
    $('#tlb').DataTable({
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

    var ddId = $(obj).attr('cid');

    $('#user_content').load("/Site/AddSite?param=" + ddId);
    $('#modal_form_vertical').modal('toggle');
    
}



function Formsubmit() {
    SaveAndUpdateInfo();
    return false;
}

function SaveAndUpdateInfo() {
    var isvalid = 1;




    var FormData1 = {
        SiteId: $("#SiteId").val(),
        CustomerId: $("#CustomerId").val(),
        CountryId: $("#CountryId").val(),
        StateId: $("#StateId").val(),
        CityId: $('#CityId').val(),
        Name: $("#Name").val(),
        AddressLine1: $('#AddressLine1').val(),
        AddressLine2: $('#AddressLine2').val(),
        PinCode: $('#PinCode').val(),
        IsDSTEnabled: $("#IsDSTEnabled").is(':checked'),
        IsActive: $("#IsActive").is(':checked')


    };









    if (FormData1.AddressLine1 == '' || FormData1.AddressLine2 == '' || FormData1.Name == '' || FormData1.CountryId == '0' || FormData1.CityId == '' || FormData1.StateId == '' || FormData1.CustomerId == '' || FormData1.PinCode == '')
        isvalid = 0;


    if (isvalid == 1) {

        $.ajax({
            type: "POST",
            url: '/Site/SaveandupdateSite',
            data: FormData1,
            success: function (reponse) {
                if (reponse.Status = 200) {
                    var data = reponse.data;
                    if (data.Result == 1 || data.Result == 2) {

                        massage('1', data.Msg);

                        $('#modal_form_vertical').modal('toggle');
                        GetDataTableData();
                    }
                    else
                        massage('2', data.Msg);
                }


            },
            error: function (result) {
                massage('3', 'Something Went Wrong!');
            }
        });
    }
    else {
        massage('2', 'Please Fill Required!');
    }
}

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
                    url: '/Site/DeleteSite',
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