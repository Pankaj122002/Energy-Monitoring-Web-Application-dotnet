$(document).ready(function () {
    $('#example').DataTable().clear().destroy();
    GetDataTableData();


});

function GetDataTableData() {

    $('#example tbody').empty();
    ShowLoading('#example');
    if ($('#hfTotalrows').val() > 0)
        $('#example').DataTable().clear().destroy();
    $.ajax({
        type: "post",
        url: "/Report/RealHVACReportdate?DevicveType=5,8",
        //data: { DevicveType: '4' },
        success: function (response) {

            if (response.Status == 200) {
                var myJSON = JSON.parse(response.data);

                var rowcount = myJSON.length;


                for (var i = 0; i < myJSON.length; i++) {
                    var txtrow = ''

                    txtrow = '<tr><td>' + (i + 1) + '</td><td>' + myJSON[i].Country + '</td><td>' + myJSON[i].State + '</td><td>' + myJSON[i].City + '</td><td>' + myJSON[i].Zone + '</td><td>' + myJSON[i].SiteName + '</td><td>' + myJSON[i].Asset + '</td><td>' + myJSON[i].TDAte + '</td><td>' + myJSON[i].TTime + '</td><td>' + myJSON[i].Temp_in_degree + '</td></tr>';

                    $('#example tbody').append(txtrow);
                }
                // $("#tlbRole tbody").html(txtrow);

                var tabid = $('#example');
                $('#hfTotalrows').val(rowcount);
                if ($('#hfTotalrows').val() > 0)
                    setdatatable();
                HideLoading('#example');
            }
            else {
                HideLoading('#example');
                massage('3', 'Something Went Wrong!');
            }
        },
        error: function (result) {
            HideLoading('#example');
            massage('3', 'Something Went Wrong!');
        }
    });
}

function setdatatable() {
    $('#example').DataTable({
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
                ,
                {
                    extend: 'csvHtml5',
                    className: 'btn btn-light',
                    text: '<i class="icon-file-spreadsheet mr-2"></i> EXCEL',
                    fieldSeparator: '\t',
                    extension: '.xls'
                },
                {
                    extend: 'pdfHtml5',
                    className: 'btn btn-light',
                    orientation: 'landscape',
                    text: '<i class="icon-file-pdf mr-2"></i> PDF',
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


