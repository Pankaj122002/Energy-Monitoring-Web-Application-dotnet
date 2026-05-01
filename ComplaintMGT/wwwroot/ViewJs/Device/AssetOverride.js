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
        url: "/Device/GetAllAssetOverride",
        data: '{}',
        success: function (response) {

            if (response.Status == 200) {
                var myJSON = JSON.parse(response.data);

                var rowcount = myJSON.length;


                for (var i = 0; i < myJSON.length; i++) {
                    var txtrow = ''
                    if (myJSON[i].IsActive)
                        txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].Customer + '</td><td>' + myJSON[i].Site + '</td><td>' + myJSON[i].Asset + '</td><td>' + myJSON[i].StartDateTime + '</td><td>' + myJSON[i].EndADateTime + '</td><td><span class="badge badge-success">ACTIVE</span></td><td><a " cid="' + myJSON[i].AssetOverrideId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-pencil"></i></a>&nbsp;<a cid="' + myJSON[i].AssetOverrideId + '" href="javascript: void (0);" title="Delete" onclick="Delete(this);"><i class="icon-trash text-danger"></i></a></td></tr>';
                    else
                        txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].Customer + '</td><td>' + myJSON[i].Site + '</td><td>' + myJSON[i].Asset + '</td><td>' + myJSON[i].StartDateTime + '</td><td>' + myJSON[i].EndADateTime + '</td><td><span class="badge badge-danger">DE-ACTIVE</span></td><td><a " cid="' + myJSON[i].AssetOverrideId + '" href="javascript: void (0);" title="edit" onclick="CallFunc(this);"><i class="icon-trash"></i></a>&nbsp;<a cid="' + myJSON[i].AssetOverrideId + '" href="javascript: void (0);" title="Delete" onclick="Delete(this);"><i class="icon-trash text-danger"></i></a></td></tr>';

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
    $('#user_content').load("/Device/AddAssetOverride?param=" + ddId);
    $('#modal_form_vertical').modal('toggle');

}