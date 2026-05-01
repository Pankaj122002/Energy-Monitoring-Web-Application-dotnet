const setLabel = (lbl, val, id) => {
    const label = $(`#slider-${lbl}-label${id}`);
    label.text(val);
    const slider = $(`#slider-div${id} .${lbl}-slider-handle`);
    const rect = slider[0].getBoundingClientRect();
    label.offset({
        top: rect.top - 30,
        left: rect.left
    });
}

const setLabels = (values, id) => {
    setLabel("min", values[0], id);
    setLabel("max", values[1], id);
}



$('#ex21').slider().on('slide', function (ev) {
    setLabels(ev.value, 1);
});
setLabels($('#ex21').attr("data-value").split(","), 1);

$('#ex22').slider().on('slide', function (ev) {
    setLabels(ev.value, 2);
});
setLabels($('#ex22').attr("data-value").split(","), 2);

$('#ex23').slider().on('slide', function (ev) {
    setLabels(ev.value, 3);
});
setLabels($('#ex23').attr("data-value").split(","), 3);

$('#ex24').slider().on('slide', function (ev) {
    setLabels(ev.value, 4);
});
setLabels($('#ex24').attr("data-value").split(","), 4);

$('#ex25').slider().on('slide', function (ev) {
    setLabels(ev.value, 5);
});
setLabels($('#ex25').attr("data-value").split(","), 5);

$('#ex26').slider().on('slide', function (ev) {
    setLabels(ev.value, 6);
});
setLabels($('#ex26').attr("data-value").split(","), 6);

$('#ex27').slider().on('slide', function (ev) {
    setLabels(ev.value, 7);
});
setLabels($('#ex27').attr("data-value").split(","), 7);
