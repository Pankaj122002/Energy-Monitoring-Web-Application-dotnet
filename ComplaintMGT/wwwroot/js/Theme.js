$(document).ready(function () {


    if (sessionStorage.getItem("Mode") == 'dark') {
        $("#LightSun").hide();
        $("#DarkMoon").show();
        $('.navbar').removeClass('navbar navbar-expand-md navbar-dark').addClass('navbar navbar-expand-md navbar-light');
        $('.navbar-brand').removeClass('navbar-brand bg-dark').addClass('navbar-brand bg-light');
        $('.sidebar').removeClass('sidebar sidebar-dark  sidebar-main sidebar-expand-md').addClass('sidebar sidebar-light  sidebar-main sidebar-expand-md');
        $('#txtSearch').removeClass('form-control bg-grey text-white border-transparent rounded-pill wmin-lg-600').addClass('form-control bg-light text-dark border-transparent rounded-pill wmin-lg-600');
        $('head').find('link#one').remove();
    }
    else {
        $("#LightSun").show();
        $("#DarkMoon").hide();
        $('.navbar').removeClass('navbar navbar-expand-md navbar-light').addClass('navbar navbar-expand-md navbar-dark');
        $('.navbar-brand').removeClass('navbar-brand bg-light').addClass('navbar-brand bg-dark');
        $('.sidebar').removeClass('sidebar sidebar-light  sidebar-main sidebar-expand-md').addClass('sidebar sidebar-dark  sidebar-main sidebar-expand-md');
        $('#txtSearch').removeClass('form-control bg-light text-dark border-transparent rounded-pill wmin-lg-600').addClass('form-control bg-grey text-white border-transparent rounded-pill wmin-lg-600');
        $('head').append('<link id="one" rel="stylesheet" href="/assets/css/Dark.css" type="text/css" />');
    }

    $("#OptionDark").click(function () {
        //$('#LightSun').css('display', 'none');
        //$('#DarkMoon').css('display', 'block');

        if ($('#DarkMoon').css("display") == "none") {


            sessionStorage.setItem("Mode", "dark");
            location.reload(true);
        } else {

            sessionStorage.setItem("Mode", "light");
            location.reload(true);
        }
    })

    $('#open').click(function () {
        var value = $('#open').attr('data-myval');
        if (value == 1) {
            $("#enlarge").hide();
            $("#shrink").show();
            var values = $('#open').attr('data-myval', 2);
            console.log(values);
            $('body').fullScreenHelper('request');
            return false;
        }
        else {
            $("#enlarge").show();
            $("#shrink").hide();
            var values = $('#open').attr('data-myval', 1);
            $.fullScreenHelper('exit');
            return false;
        }
    });

    

});


//if (typeof FullScreenHelper === "undefined") {
//    document.write("<p>FullScreenHelper is not loaded</p>");
//} else if ($.fullScreenHelper("supported")) {
//    document.write("<p>Fullscreen is supported</p>");
//} else {
//    document.write("<p>Your browser don't support fullscreen</p>");
//}

//Use .bind or .on
$(document).on("fullscreenchange", function () {
    if ($.fullScreenHelper("state")) {
        console.log("In fullscreen", $(":fullscreen"));
    } else {
        console.log("Not in fullscreen");
    }
});