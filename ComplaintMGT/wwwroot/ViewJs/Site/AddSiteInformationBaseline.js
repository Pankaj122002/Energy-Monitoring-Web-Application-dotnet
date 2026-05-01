
function Formsubmit() {
    SaveAndUpdateInfo();
    return false;
}

function SaveAndUpdateInfo() {
    var isvalid = 1;




    var FormData1 = {
        SiteInformationBaselineId: $("#SiteInformationBaselineId").val(),
        SiteId: $("#SiteId").val(),
        BaselineStartTime: $("#BaselineStartTime").val(),
        BaselineEndTime: $("#BaselineEndTime").val(),
        BaselineSignOffTime: $('#BaselineSignOffTime').val(),
        BaselineSignOffGivenBy: $('#BaselineSignOffGivenBy').val(),
        BaselineSignOffFlag: $('#BaselineSignOffFlag').val(),
        IsActive: $("#IsActive").is(':checked'),
    };









    if (FormData1.SiteId == '0' || FormData1.BaselineEndTime == '' || FormData1.BaselineStartTime == '' || FormData1.BaselineSignOffTime == '' || FormData1.BaselineSignOffGivenBy == '')
        isvalid = 0;


    if (isvalid == 1) {

        $.ajax({
            type: "POST",
            url: '/Site/SaveandupdateSiteInformationBaseline',
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
                    url: '/Site/DeleteSiteInformationBaseline',
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