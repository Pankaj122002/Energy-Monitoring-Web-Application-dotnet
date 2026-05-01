////document.addEventListener("DOMContentLoaded", function () {
////    $.jGrowl('You have entered an invalid username or password', {
////        header: 'Error',
////        position: 'top-left',
////        progressBar: true,
////        theme: 'alert-styled-left alert-arrow-left  bg-warning'
////    });
////});

function massage(type,msg) {
    if (type == 1) {
        $.jGrowl(msg, {
            header: 'Success',
            position: 'top-right',
           
            theme: 'alert-styled-left alert-arrow-left  bg-success'
        });
    }
    else if (type == 2) {
        $.jGrowl(msg, {
            header: 'Warning',
            position: 'top-right',
            
            theme: 'alert-styled-left alert-arrow-left  bg-warning'
        });
    }
    else if (type == 3) {
        $.jGrowl(msg, {
            header: 'Error',
            position: 'top-right',
           
            theme: 'alert-styled-left alert-arrow-left  bg-danger'
        });
    }
}


function ShowLoading(con) {
    //e.preventDefault();
    var $target = con, block = $(con).closest('.card');

    // Block card
    $(block).block({
        message: '<i class="icon-spinner4 spinner"></i>',
        overlayCSS: {
            backgroundColor: '#1B2024',
            opacity: 0.85,
            cursor: 'wait'
        },
        css: {
            border: 0,
            padding: 0,
            backgroundColor: 'none',
            color: '#fff'
        }
    });



}
function HideLoading(con) {
    // For demo purposes
    var $target = con,
        block = $(con).closest('.card');
    $(block).unblock();

}



function checkboxUI(){
      // Initialize multiple switches
                var elems = Array.prototype.slice.call(document.querySelectorAll('.form-check-input-switchery'));
                elems.forEach(function (html) {
                    var switchery = new Switchery(html);
                });
}

