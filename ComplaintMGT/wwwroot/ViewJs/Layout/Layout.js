document.addEventListener('DOMContentLoaded', function () {
    var MyData = JSON.parse(localStorage.ajeeviHealthApp || null) || { menu: [], submenu: [] };
    if (MyData.menu.length > 0) {

        CreateMenu(MyData);
        App.initNavigations();
    }
    else {

        getMenu();

    }

    
    //GetCompanyDetails();
});

function GetCompanyDetails() {

    $.ajax({
        type: "post",
        url: "/CompanyMaster/GetLoggedCompanyDetails",
        data: '{}',
        success: function (data) {

            $('#userEmail').text(data.UserId);
            $('#userName').text(data.UserName);

        }
    });
}

function getMenu() {
    $.ajax({
        type: "post",
        url: "/Account/GetAllMenu",
        data: {},
        success: function (data) {

            var stData = JSON.stringify(data)
            localStorage.ajeeviHealthApp = stData;

            var MyData = JSON.parse(localStorage.ajeeviHealthApp || null) || { menu: [], submenu: [] };
            CreateMenu(MyData);
            App.initNavigations();
        }
    });
}

function CreateMenu(data) {
    var myJSON = data.menu;
    var JSONSubmenu = data.submenu;
    var txthtm = '';
    for (var i = 0; i < myJSON.length; i++) {
        if (myJSON[i].fnParentId == 0) {
            txthtm += '<li class="nav-item nav-item-submenu"><a href="#" class="nav-link nav-itemktm"><i class="' + myJSON[i].ftMCssIcon + '"></i> <span>' + myJSON[i].ftMenuName + '</span></a>';
            for (var j = 0; j < myJSON.length; j++) {

                if (myJSON[j].fnParentId == 0 && myJSON[i].fnMenuId == myJSON[j].fnMenuId) {
                    var subhtm = '';
                    subhtm += '';
                    subhtm += '<ul class="nav nav-group-sub">';
                    for (var k = 0; k < JSONSubmenu.length; k++) {
                        if (myJSON[j].fnMenuId == JSONSubmenu[k].fnMenuId && JSONSubmenu[k].fbIsAllow == true) {
                            subhtm += '<li class="nav-item"><a href="/' + JSONSubmenu[k].ftControllerName + '/' + JSONSubmenu[k].ftActionName + '" class="nav-link"><i class="' + JSONSubmenu[k].ftSCssIcon + '"></i> ' + JSONSubmenu[k].ftSubMenuName + '</a></li>';
                        }
                    }
                    subhtm += '</ul>';
                    txthtm += subhtm;
                }

                if (myJSON[j].fnParentId != 0) {
                    if (myJSON[j].fnParentId == myJSON[i].fnMenuId) {
                        var subhtm = '<ul class="nav nav-group-sub" data-submenu-title="' + myJSON[j].ftMenuName + '">';
                        subhtm += '<li class="nav-item nav-item-submenu"><a href="#" class="nav-link nav-itemktm"><i class="' + myJSON[j].ftMCssIcon + '"></i> ' + myJSON[j].ftMenuName + '</a>';
                        subhtm += '<ul class="nav nav-group-sub">';
                        for (var k = 0; k < JSONSubmenu.length; k++) {
                            if (myJSON[j].fnMenuId == JSONSubmenu[k].fnMenuId && JSONSubmenu[k].fbIsAllow == true) {

                                subhtm += '<li class="nav-item"><a  href="/' + JSONSubmenu[k].ftControllerName + '/' + JSONSubmenu[k].ftActionName + '" class="nav-link"><i class="' + JSONSubmenu[k].ftSCssIcon + '"></i> ' + JSONSubmenu[k].ftSubMenuName + '</a></li>';


                            }
                        }
                        subhtm += '</ul></li></ul>';
                        txthtm += subhtm;
                    }
                }
            }

            txthtm += '</li>';
        }
    }
    $('#mMenu').append(txthtm);

}

//document.querySelector('#lgBtn').onclick = function (e) {

//    var swalInit = swal.mixin({
//        buttonsStyling: false,
//        customClass: {
//            confirmButton: 'btn btn-primary',
//            cancelButton: 'btn btn-light',
//            denyButton: 'btn btn-light',
//            input: 'form-control'
//        }
//    });

//    swalInit.fire({
//        title: 'Are you sure?',
//        text: "Want To Logout!",
//        icon: 'warning',
//        showCancelButton: true,
//        confirmButtonText: 'Yes, I am sure!',
//        cancelButtonText: "No, cancel it!",
//        buttonsStyling: false,
//        customClass: {
//            confirmButton: 'btn btn-success',
//            cancelButton: 'btn btn-danger'
//        }
//    }).then(function (result) {
//        if (result.value) {
//            localStorage.clear();
//            swalInit.fire({
//                title: "Logout Successfully!",
//                timer: 1000,
//                showCancelButton: false,
//                showConfirmButton: false
//            });
//            window.location.href = '/Account/Logout';
//        }
    
//    });
//};

