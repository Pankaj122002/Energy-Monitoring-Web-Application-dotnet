$(document).ready(function () {

    $.ajax({
        url: '/Home/GetCurrentUserInfo',
        success: function (result) {
            document.getElementById('dvUserName').innerHTML = result.UserName;
            document.getElementById('spnUserName').innerHTML = result.UserName;
            document.getElementById('dvRoleName').innerHTML = result.RoleName;

        },
        error: function (xhr, status, error) {
            alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
        }
    });

});
function ConfirmOnLogout() {
    if (confirm("Are you sure want to logout?") == true)
        return true;
    else
        return false;
}
function logoutapp() {
    var MyData = { menu: [], submenu: [] };
    localStorage.saveData = JSON.stringify(MyData);
    window.location.href = '/Account/Logout';
}

$(".icon-arrow-left52").click(function () {
    window.history.back();
});
function OpenChangePassword(obj) {

    $('#Password_content').load("/Account/ChangePassword");
    $('#modal_form_ChangePassword').modal('toggle');



}
function LayoutFormsubmit() {
    SaveChangePassword();
    return false;
}
function SaveChangePassword() {
    var isvalid = 1;
    var FormData = {
        CurrentPwd: $("#txtCurrentPassword").val(),
        NewPwd: $("#txtNewpassword").val(),
        Repeat_password: $("#txtrepeat_password").val()
    };


    if (FormData.CurrentPwd == '' || FormData.NewPwd == '' || FormData.Repeat_password == '')
        isvalid = 0;

    if (isvalid == 1)
        $.ajax({
            type: "POST",
            // contentType: "application/json; charset=utf-8",
            url: '/Account/SaveChangePassword',
            data: { jobj: JSON.stringify(FormData) },
            //  dataType: "json",
            success: function (data) {
                var myjson = JSON.parse(data);
                if (myjson.Result == 1) {

                    ShowLayoutCustomMessage('1', myjson.Msg, '');

                    $('#modal_form_ChangePassword').modal('toggle');
                }
                else
                    ShowLayoutCustomMessage('0', myjson.Msg, '');

            },
            error: function (result) {
                ShowLayoutCustomMessage('0', 'Please Enter All Required Details', '');
            }
        });

}