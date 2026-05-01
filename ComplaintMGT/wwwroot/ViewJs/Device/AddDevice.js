



$(document).ready(function () {
    $('.form-control-select2').each(function () {
        var $p = $(this).parent();
        $(this).select2({
            dropdownParent: $p
        });
    });

    checkboxUI();

});
