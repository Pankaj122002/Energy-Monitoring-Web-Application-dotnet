

$(document).ready(function () {
    setDataTable();
});




function CallFunc(obj) {
    var ddId = $(obj).attr('cid');
    $('#user_content').load("/Configuration/AddCutomer");
    $('#modal_form_vertical').modal('toggle');
   
    if (ddId != 0) {
        setVale(ddId);
    }
}

function setDataTable() {
    
    dt = $('#example1').DataTable({
        processing: true,
        serverSide: false,
        destroy: true,
        responsive: true,
        searchable: true,
        lengthMenu: [[10, 20, 50, 100, 500, 10000], [10, 20, 50, 100, 500, 10000]],
        language: {
            infoEmpty: "No records available",
            searchPlaceholder: "Search Records",
            search: ""
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
                    text: '<i class="icon-file-spreadsheet mr-2"></i> Excel',
                    fieldSeparator: '\t',
                    extension: '.xls'
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
            url: "/Configuration/GetAllCoustomer",
            type: 'POST',
            data: {},
            dataType: "json",
            dataSrc: function (json) {
              
                return json.data;
            }
        },
        columns: [
            {
                "className": 'details-control',
                "orderable": false,
                "data": null,

                "defaultContent": ''
            },
            {
                sortable: false,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },

            { data: "Name", sortable: true },
            { data: "Email", sortable: true },
            { data: "PhoneNumber", sortable: true },
            { data: "MobileNumber", sortable: true },
            { data: "ContectPersonName", sortable: true },
           
            {
                sortable: false,
                "render": function (data, type, row, meta) {
                    var shiftstr = '';
                    if (row.IsActive == true) {
                        shiftstr = '<span class="badge badge-success">ACTIVE</span>';
                    }
                    else if (row.IsActive == false) {
                        shiftstr = '<span class="badge badge-danger">DE-ACTIVE</span>';
                    }
                    
                    return shiftstr;
                }
            },
            {
                sortable: false,
                "render": function (data, type, row, meta) {

                    return "<a cid='" + row.CustomerId + "' href='javascript:void(0);' title='edit' onclick='CallFunc(this);' ><i class='icon-pencil'></i></a>&nbsp;&nbsp;&nbsp;<a  href='javascript:void(0);' title='delete' onclick='deletesplDetails(" + row.CustomerId + ")' ><i class='icon-bin'></i></a>";

                }
            }

        ],
    });
   
}

function format(item) {
    var InnerGrid = '<div class="table-scrollable"><table class="table display product-overview mb-30"><thead class="bg-primary"><tr><th>Sr. No.</th> <th>Address Type</th><th>Address Line 1</th><th>Address Line 1 </th><th> City </th><th> State </th><th> Country </th><th> PinCode </th></tr></thead><tbody>';
    $.each(item, function (i, info) {
        var Icount = i + 1;
        var dateval = info.Date;
        InnerGrid += '<tr>' +
            '<td>' + Icount + '</td>' +
            '<td>' + info.Description + '</td>' +
            '<td>' + info.AddressLine1 + '</td>' +
            '<td>' + info.AddressLine2 + '</td>' +
            '<td>' + info.CityName + '</td>' +
            '<td>' + info.StateName + '</td>' +
            '<td>' + info.CountryName + '</td>' +
            '<td>' + info.PinCode + '</td>' +
           
            '</tr>';
    });

    InnerGrid += '</tbody></table></div>';
    return InnerGrid;
}

$('#example1 tbody').on('click', 'td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = $('#example1').DataTable().row(tr);
    var ddId = tr.find('td:eq(8)').find("a").attr('cid');
    if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass('shown');
    }
    else {
        // Open this row
        var iccData;
        $.ajax({
            url: "/Configuration/GetAddressByCoustomerId",
            type: "POST",
            dataType: "json",
            data: { CoustomerId: ddId },
            success: function (data) {
                var myJSON = JSON.parse(data);
                row.child(format(myJSON)).show();
                tr.addClass('shown');
            }
        });
    }
});





function setVale(id) {
    $.ajax({
        type: "post",
        url: "/Configuration/GetCoustomerByCoustomerId",
        data: { CoustomerId: id },
        datatype: "json",
        traditional: true,
        success: function (data) {
            $("#CustomerId").val(data.CustomerId);
            $("#Name").val(data.Name);
            $("#Description").val(data.Description);
            $("#Email").val(data.Email);
            $('#PhoneNumber').val(data.PhoneNumber);
            $("#MobileNumber").val(data.MobileNumber);
            $('#ContectPersonName').val(data.ContectPersonName);
            if (data.IsActive == "true")
                $('#IsActive').attr('checked', 'checked');
            else
                $('#IsActive').removeAttr('checked');
            AddressTableBind(data.JArrayval);

        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });
}

function AddressTableBind(data) {
    var d = JSON.parse(data);
   
    var count = 0;
    for (var i = 0; i < d.length; i++) {
        count = parseInt(count) + 1;
        var tr = '<tr><td class="c" data-ddlCountryId=' + d[i].CountryId + ' data-ddlstateId=' + d[i].StateId + ' data-ddlcityId=' + d[i].CityId + ' data-AddressTypeId=' + d[i].AddressTypeId + ' data-count=' + count + ' data-Id=' + d[i].AddressId + '>' + count + '</td><td class="a" >' + d[i].Description + '</td><td>' + d[i].AddressLine1 + '</td><td>' + d[i].AddressLine2 + '</td><td>' + d[i].CountryName + '</td><td>' + d[i].StateName + '</td><td>' + d[i].CityName + '</td><td>' + d[i].PinCode +

            '</td><td><a class="list-icons-item text-danger-600 "  onclick="RemoveRowAddress(this);"> <i class="icon-trash"></i> </a>'
        '</td></tr>';

        $('#tbl_Address > tbody').append(tr);
    }
}

function deletesplDetails(cid) {
    swal({
        title: "Are you sure?",
        text: "you want to delete this Record?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
             
                $.ajax({
                    type: "POST",
                    url: '/Configuration/DeleteCoustomer',
                    data: { CoustomerId: cid },
                    success: function (reponse) {
                        var data = JSON.parse(reponse);
                        if (data.Result == 1 || data.Result == 2) {

                            massage('1', data.Msg);
                            setDataTable();

                        }
                        else
                            massage('2', data.Msg);

                    },
                    error: function (result) {
                        massage('3', 'Something Went Wrong!');
                    }
                });

            }
        });
}







