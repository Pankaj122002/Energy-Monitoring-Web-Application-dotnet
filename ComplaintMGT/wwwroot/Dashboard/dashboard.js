var p1 = 0,
    p2 = 0,
    p3 = 0,
    p4 = 0,
    p5 = 0,
    p6 = 0,
    p7 = 0,
    p8 = 0,
    p9 = 0,
    p10 = 0,
    p11 = 0,
    p12 = 0,
    p13 = 0,
    p14 = 0,
    p15 = 0,
    p16 = 0,
    p17 = 0,
    p18 = 0;
p19 = 0;
p20 = 0;
p21 = 0;
p22 = 0;
p23 = 0;
p24 = 0;
p25 = 0;
p26 = 0;
p27 = 0;
p28 = 0;
p29 = 0;
p30 = 0;
p31 = 0;
p32 = 0;
p33 = 0;
p34 = 0;
p35 = 0;
p36 = 0;
p37 = 0;
p38 = 0;
p39 = 0;
p40 = 0;
p41 = 0;
p42 = 0;
var Dashboard = function () {
    var GetAllMainMeter = function () {
        $.ajax({
            type: "post",
            url: "/Deshboard/Getallmeterdetailsbymetername?Device=SlaveID1",
            data: {},
            datatype: "json",
            //traditional: true,
            success: function (data) {
                var myJSON = JSON.parse(data);
                if (myJSON.length > 0) {
                    p1 = myJSON[0].p1 != null ? myJSON[0].p1 : 0;
                    p2 = myJSON[0].p2 != null ? myJSON[0].p2 : 0;
                    p3 = myJSON[0].p3 != null ? myJSON[0].p3 : 0;
                    p4 = myJSON[0].p4 != null ? myJSON[0].p4 : 0;
                    p5 = myJSON[0].p5 != null ? myJSON[0].p5 : 0;
                    p6 = myJSON[0].p6 != null ? myJSON[0].p6 : 0;
                    p7 = myJSON[0].p7 != null ? myJSON[0].p7 : 0;
                    p8 = myJSON[0].p8 != null ? myJSON[0].p8 : 0;
                    p9 = myJSON[0].p9 != null ? myJSON[0].p9 : 0;
                    p10 = myJSON[0].p10 != null && myJSON[0].p10 != "" ? myJSON[0].p10 : 0;
                    p11 = myJSON[0].p11 != null ? myJSON[0].p11 : 0;
                    p12 = myJSON[0].p12 != null ? myJSON[0].p12 : 0;
                    //p13 = myJSON[0].p13 != null ? (parseFloat(myJSON[0].p13) / 1000)?.toFixed(2) : 0;
                    //p14 = myJSON[0].p14 != null ? (parseFloat(myJSON[0].p14) / 3600)?.toFixed(2) : 0
                    p13 = myJSON[0].p13 != null ? (parseFloat(myJSON[0].p13))?.toFixed(2) : 0;
                    p14 = myJSON[0].p14 != null ? (parseFloat(myJSON[0].p14))?.toFixed(2) : 0
                    p15 = myJSON[0].p15 != null ? myJSON[0].p15 : 0;
                    p16 = myJSON[0].p16 != null ? myJSON[0].p16 : 0;
                    p17 = myJSON[0].p17 != null ? myJSON[0].p17 : 0;
                    p18 = myJSON[0].p18 != null ? myJSON[0].p18 : 0;
                    p19 = myJSON[0].p19 != null ? myJSON[0].p19 : 0;
                    p20 = myJSON[0].p20 != null ? myJSON[0].p20 : 0;
                    p21 = myJSON[0].p21 != null ? myJSON[0].p21 : 0;
                    p22 = myJSON[0].p22 != null ? myJSON[0].p22 : 0;
                    p23 = myJSON[0].p23 != null ? myJSON[0].p23 : 0;
                    p24 = myJSON[0].p24 != null ? myJSON[0].p24 : 0;
                    p25 = myJSON[0].p25 != null ? myJSON[0].p25 : 0;
                    p26 = myJSON[0].p26 != null ? myJSON[0].p26 : 0;
                    p27 = myJSON[0].p27 != null ? myJSON[0].p27 : 0;
                    p28 = myJSON[0].p28 != null ? myJSON[0].p28 : 0;
                    p29 = myJSON[0].p29 != null ? myJSON[0].p29 : 0;
                    p30 = myJSON[0].p30 != null ? myJSON[0].p30 : 0;
                    p31 = myJSON[0].p31 != null ? myJSON[0].p31 : 0;
                    p32 = myJSON[0].p32 != null ? myJSON[0].p32 : 0;
                    p33 = myJSON[0].p33 != null ? myJSON[0].p33 : 0;
                    p34 = myJSON[0].p34 != null ? myJSON[0].p34 : 0;
                    p35 = myJSON[0].p35 != null ? myJSON[0].p35 : 0;
                    p36 = myJSON[0].p36 != null ? myJSON[0].p36 : 0;
                    p37 = myJSON[0].p37 != null ? myJSON[0].p37 : 0;
                    p38 = myJSON[0].p38 != null ? myJSON[0].p38 : 0;
                    p39 = myJSON[0].p39 != null ? myJSON[0].p39 : 0;
                    p40 = myJSON[0].p40 != null ? myJSON[0].p40 : 0;
                    p41 = myJSON[0].p41 != null ? myJSON[0].p41 : 0;
                    p42 = myJSON[0].p42 != null ? myJSON[0].p42 : 0;
                    p16 = myJSON[0].p16 != null ? ((parseFloat(myJSON[0].p16) / (myJSON[0].p17 != null && myJSON[0].p17 != 0 ? parseFloat(myJSON[0].p17) : 1)) / 3)?.toFixed(2) : 0;

                    $("#p3").empty();
                    $("#p20").empty();
                    $("#p19").empty();
                    $("#p15").empty();
                    $("#p13").empty();
                    $("#p21").empty();
                    $("#p14").empty();
                    $("#p26").empty();
                    $("#p42").empty();
                    $("#p17").empty();
                    $("#p16").empty();
                    $("#p19").empty();
                    $("#p18").empty();

                    $("#p3").append(p3);
                    $("#p20").append(p20);
                    $("#p19").append(p19);
                    $("#p15").append(p15);
                    $("#p13").append(p13);
                    //$("#p13").append(p13);
                    $("#p21").append(p21);
                    $("#p14").append(p14);
                    $("#p26").append(p26);
                    //$("#p42").append(p42);
                    $("#p17").append(p17);
                    $("#p16").append(p16);
                    $("#p18").append(p18);
                    $("#p19").append(p19);

                    $("#p3Tooltip").append(p3);
                    $("#p20Tooltip").append(p20);
                    $("#p19Tooltip").append(p19);
                    $("#p15Tooltip").append(p15);
                    $("#p13Tooltip").append(p13);
                    $("#p21Tooltip").append(p21);
                    $("#p14Tooltip").append(p14);
                    $("#p26Tooltip").append(p26);
                    //$("#p42Tooltip").append(p42);

                    $("#p16Tooltip").append(p16);
                    $("#p17Tooltip").append(p17);
                    $("#p18Tooltip").append(p18);
                    $("#p19Tooltip").append(p19);
                    //if (p3 > 10)
                    //    $("#p3div").addClass("rcorners2");
                    //if (p20 > 30)
                    //    $("#p6div").addClass("rcorners2");
                    //if (p19 > 30)
                    //    $("#p9div").addClass("rcorners2");
                    //if (p15 > 30)
                    //    $("#p12div").addClass("rcorners2");
                    //if (p5 > 240)
                    //    $("#p5div").addClass("rcorners2");
                    //if (p8 > 240)
                    //    $("#p8div").addClass("rcorners2");
                    //if (p11 > 240)
                    //    $("#p11div").addClass("rcorners2");
                }

            }
        });
    }

    var EnergyConsumptiontotal = function () {
        $.ajax({
            type: "post",
            url: "/Deshboard/EnergyConsumptiontotal",
            data: {},
            datatype: "json",
            //traditional: true,
            success: function (data) {
                var myJSON = JSON.parse(data);
                if (myJSON.length > 0) {
                    //$("#tmontht").empty();
                    //$("#tLastWeek").empty();
                    //$("#tCurrentWeek").empty();
                    $("#tyesterday").empty();
                    $("#tToday").empty();
                    $("#tPreviousHR").empty();

                    $("#tPreviousHR").text(myJSON[0].PreviousHR);
                    $("#tToday").text(myJSON[0].Today);
                    $("#tyesterday").text(myJSON[0].yesterday);
                    //$("#tCurrentWeek").append(myJSON[0].CurrentWeek);
                    //$("#tLastWeek").append(myJSON[0].LastWeek);
                    //$("#tmontht").append(myJSON[0].montht);

                    //fill detail modal table

                    $("#modeltyesterday").empty();
                    $("#modeltToday").empty();
                    $("#modeltPreviousHR").empty();
                    $("#modeltmontht").empty();
                    $("#modeltLastWeek").empty();
                    $("#modeltCurrentWeek").empty();

                    $("#modeltPreviousHR").text(myJSON[0].PreviousHR);
                    $("#modeltToday").text(myJSON[0].Today);
                    $("#modeltyesterday").text(myJSON[0].yesterday);
                    $("#modeltCurrentWeek").append(myJSON[0].CurrentWeek);
                    $("#modeltLastWeek").append(myJSON[0].LastWeek);
                    $("#modeltmontht").append(myJSON[0].montht);

                }

            }
        });

    }

    function GetAllTimeofDayENERGYCONSUMPTION() {

        $.ajax({
            type: "post",
            url: "/Deshboard/TimeofDayENERGYCONSUMPTION",
            data: {},
            datatype: "json",
            //traditional: true,
            success: function (data) {
                var myJSON = JSON.parse(data);

                var rowcount = myJSON.length;
                var mainWidnow = myJSON.filter(x => x.IsMainWindow == true);
                var modalHtml = '<div class="row">';
                for (var i = 0; i < mainWidnow.length; i++) {
                    //set html cintent on main dashboard
                    var html = ' <a href="#" style="text-decoration: none;">' +
                        '<div class="graph4t" style="text-decoration: none;">' +
                        '<div class="g-icon"><img src="/Dashboard/assests/Icons/icon-graph.png" alt="" class="graph-icont"></div>' +
                        '<div class="g-textt">' +
                        '<span id="OpsWindow">' + mainWidnow[i].KWHVsKVAH + '</span>' +
                        '<div class="g-stextt">' + mainWidnow[i].SiteOperationWindow + '</div>' +
                        '</div > ' +
                        '</div > ' +
                        '</a > ';
                    $("#todDashboard").append(html);

                    ////set html on modal popup
                    //modalHtml += '<div class="col-md-4">' +
                    //    '<a href="#" style="text-decoration: none;">' +
                    //    '<div class="graph4" style="width:100%">' +
                    //    '<div class="g-icon"><img src="~/Dashboard/assests/Icons/icon-graph.png" alt="" class="graph-icont"></div>' +
                    //    '<div class="g-textt">' +
                    //    '<span id="modelOpsWindow">' + mainWidnow[i].KWHVsKVAH + '</span>' +
                    //    '<div class="g-stextt">' + mainWidnow[i].SiteOperationWindow + '</div>' +
                    //    '</div>' +
                    //    '</div>' +
                    //    '</a>' +
                    //    '</div>';
                }
                //modalHtml += '</div>';


                //var loopCount = (rowcount - mainWidnow.length) / 3 + (rowcount - mainWidnow.length) % 3
                //modalHtml += '<div class="row" style="margin-top:3%;">';
                //for (var i = mainWidnow.length; i < (rowcount - mainWidnow.length); i++) {
                //    modalHtml += '<div class="form-group">' +
                //        '<a href="#" style="text-decoration: none;">' +
                //        '<div class="graph4">' +
                //        '<div class="g-icon"><img src="/Dashboard/assests/Icons/icon-graph.png" alt="" class="graph-icont"></div>' +
                //        '<div class="g-textt">' +
                //        '<span id="modelCrew">' + myJSON[i].KWHVsKVAH + '</span>' +
                //        '<div class="g-stextt">' + myJSON[i].SiteOperationWindow + '</div>' +
                //        '</div>' +
                //        '</div>' +
                //        '</a>' +
                //        '</div> ';
                //}
                //$("#todModalBody").append(modalHtml);
                //for (var i = mainWidnow.length; i < rowcount; i++) {

                //}
                //if (myJSON[i].SiteOperationWindow == 'Ops Window') {
                //    $("#OpsWindow").empty();
                //    $("#OpsWindow").text(myJSON[i].KWHVsKVAH);

                //    $("#modelOpsWindow").empty();
                //    $("#modelOpsWindow").text(myJSON[i].KWHVsKVAH);
                //}
                //else if (myJSON[i].SiteOperationWindow == 'Current Day No Ops') {
                //    $("#NonOps").empty();
                //    $("#NonOps").append(myJSON[i].KWHVsKVAH);
                //    $("#NoOperations").empty();
                //    $("#NoOperations").append(myJSON[i].KWHVsKVAH);

                //    $("#modelNonOps").empty();
                //    $("#modelNonOps").append(myJSON[i].KWHVsKVAH);
                //    $("#modelNoOperations").empty();
                //    $("#modelNoOperations").append(myJSON[i].KWHVsKVAH);
                //}
                //else if (myJSON[i].SiteOperationWindow == 'Store Setup') {
                //    $("#modelCrew").empty();
                //    $("#modelCrew").append(myJSON[i].KWHVsKVAH);
                //}
                //else if (myJSON[i].SiteOperationWindow == 'Pre Lunch') {
                //    $("#modelPreLunch").empty();
                //    $("#modelPreLunch").append(myJSON[i].KWHVsKVAH);
                //}
                //else if (myJSON[i].SiteOperationWindow == 'Peak Lunch') {
                //    $("#modelPeakLunch").empty();
                //    $("#modelPeakLunch").append(myJSON[i].KWHVsKVAH);
                //}
                //else if (myJSON[i].SiteOperationWindow == 'Post Lunch') {
                //    $("#modelPostLunch").empty();
                //    $("#modelPostLunch").append(myJSON[i].KWHVsKVAH);
                //}
                //else if (myJSON[i].SiteOperationWindow == 'Pre Dinner') {
                //    $("#modelPreDinner").empty();
                //    $("#modelPreDinner").append(myJSON[i].KWHVsKVAH);
                //}
                //else if (myJSON[i].SiteOperationWindow == 'Peak Dinner') {
                //    $("#modelPeakDinner").empty();
                //    $("#modelPeakDinner").append(myJSON[i].KWHVsKVAH);
                //}
                //else if (myJSON[i].SiteOperationWindow == 'Store Shutdown') {
                //    $("#modelCrewShutdown").empty();
                //    $("#modelCrewShutdown").append(myJSON[i].KWHVsKVAH);
                //}
                //else if (myJSON[i].SiteOperationWindow == 'Previous Day No Ops') {
                //    $("#modelPreviousDayNoOps").empty();
                //    $("#modelPreviousDayNoOps").append(myJSON[i].KWHVsKVAH);
                //}


            }
        });

    }

    var GetAQIData = function () {
        $.ajax({
            type: "post",
            url: "/Deshboard/GetAllAQIDataDashboard",
            data: {},
            datatype: "json",
            //traditional: true,
            success: function (data) {
                var myJSON = JSON.parse(data);
                if (myJSON.length > 0) {
                    //$("#tmontht").empty();
                    //$("#tLastWeek").empty();
                    //$("#tCurrentWeek").empty();
                    $("#pm25Indore").empty();
                    $("#pm10Indore").empty();
                    $("#CO2Indore").empty();

                    $("#TVOCIndore").empty();
                    $("#TempIndore").empty();
                    $("#RHIndore").empty();
                    $("#AQIIndore").empty();

                    $('#AvgAQI').empty()
                    $('#AvgPM25').empty()

                    $("#pm25Indore").text(myJSON[0].PM25);
                    $("#pm10Indore").text(myJSON[0].PM10);
                    $("#CO2Indore").text(myJSON[0].CO2);

                    $("#TVOCIndore").text(myJSON[0].VOC);
                    $("#TempIndore").text(myJSON[0].Temp);
                    $("#RHIndore").text(myJSON[0].Humidity);
                    $("#AQIIndore").text(myJSON[0].AQI);

                    $("#AvgAQI").append(myJSON[0].AvgAQI);
                    $("#AvgPM25").append(myJSON[0].AvgPM25);

                }

            }
        });

    }

    function GetAllDevice() {

        $.ajax({
            type: "post",
            url: "/Deshboard/GetAllDevice?DType=1",
            data: {},
            datatype: "json",
            //traditional: true,
            success: function (data) {
                var myJSON = JSON.parse(data);

                var rowcount = myJSON.length;
                var Resource = "<select id='Device'>";
                var mainEnergyDeviceNo;
                Resource = Resource + '<option value="0">Select</option>';
                for (var i = 0; i < rowcount; i++) {
                    if (i == 0)
                        mainEnergyDeviceNo = myJSON[i].DeviceNo;
                    Resource = Resource + '<option value=' + myJSON[i].DeviceNo + '>' + myJSON[i].DeviceName + '</option>';
                }
                Resource = Resource + '</select>';
                $('#Device').html(Resource);
                $('#Device').val(mainEnergyDeviceNo);
                $('#Device').trigger('change');
            }
        });

    }

    var GetUPSEnergyDashboard = function () {
        $.ajax({
            type: "post",
            url: "/Deshboard/GetUPSEnergyDashboard",
            data: {},
            datatype: "json",
            //traditional: true,
            success: function (data) {
                var myJSON = JSON.parse(data);
                if (myJSON.length > 0) {

                    let jsonData = myJSON[0];

                    let ReadingDateTime = jsonData.ReadingDateTime
                    let available_battery_backup_time = jsonData.available_battery_backup_time
                    let available_battery_charge_percentage = jsonData.available_battery_charge_percentage
                    let board_temperature = jsonData.board_temperature
                    let humidity = jsonData.humidity
                    let input_voltage = jsonData.input_voltage
                    let output_load = jsonData.output_load
                    let power = jsonData.power
                    let water_level = jsonData.water_level

                    console.log(ReadingDateTime,
                        available_battery_backup_time,
                        available_battery_charge_percentage,
                        board_temperature,
                        humidity,
                        input_voltage,
                        output_load,
                        power,
                        water_level)

                    //[input_voltage]
                    //    , [output_load]
                    //    , [board_temperature]
                    //    , [humidity]
                    //    , [water_level]
                    //    , [power]
                    //    , [available_battery_backup_time]
                    //    , [available_battery_charge_percentage]

                    $("#available_battery_backup_time").empty();
                    $("#available_battery_charge_percentage").empty();
                    $("#board_temperature").empty();
                    $("#humidity").empty();
                    $("#input_voltage").empty();
                    $("#output_load").empty();
                    $("#power").empty();
                    $("#water_level").empty();

                    $("#available_battery_backup_time").text(available_battery_backup_time);
                    $("#available_battery_charge_percentage").text(available_battery_charge_percentage);
                    $("#board_temperature").text(board_temperature);
                    $("#humidity").text(humidity);
                    $("#input_voltage").text(input_voltage);
                    $("#output_load").text(output_load);
                    $("#power").text(power);
                    $("#water_level").text(water_level);
                }

            }
        });

    }

    var GetEVHealthDashboard = function () {
        $.ajax({
            type: "post",
            url: "/Deshboard/GetEVHealthDashboard",
            data: {},
            datatype: "json",
            //traditional: true,
            success: function (data) {
                var myJSON = JSON.parse(data);
                if (myJSON.length > 0) {
                    $("#EVHTerminalVoltage").empty();
                    $("#EVHChargingCurrent").empty();
                    $("#EVHDischargingCurrent").empty();
                    $("#EVHChargeCapacity").empty();
                    $("#EVHStateofCharge").empty();
                    $("#EVHEnergyCapacity").empty();

                    $("#EVHTerminalVoltage").text(myJSON[0].TerminalVoltage);
                    $("#EVHChargingCurrent").text(myJSON[0].ChargingCurrent);
                    $("#EVHDischargingCurrent").text(myJSON[0].DischargingCurrent);
                    $("#EVHChargeCapacity").text(myJSON[0].ChargeCapacity);
                    $("#EVHStateofCharge").text(myJSON[0].StateofCharge);
                    $("#EVHEnergyCapacity").text(myJSON[0].EnergyCapacity);
                }

            }
        });

    }

    return {
        init: function () {
            GetAllMainMeter();
            EnergyConsumptiontotal();
            GetAllTimeofDayENERGYCONSUMPTION();
            GetAQIData();
            GetAllDevice();
            GetUPSEnergyDashboard();
            GetEVHealthDashboard();
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    Dashboard.init();
});

$("#Device").change(function () {
    $('#tbl').html('');
    $.ajax({
        type: "post",
        url: "/Deshboard/Getallmeterdetailsbymetername?Device=" + $("#Device").val(),
        data: {},
        datatype: "json",
        //traditional: true,
        success: function (data) {
            var myJSON = JSON.parse(data);
            var Resource;
            if (myJSON.length > 0) {
                if ('SlaveID1' == $("#Device").val()) {
                    Resource = formatJsonToTableForMainMeter(myJSON)
                    $('#tbl').removeClass('table bg-purple').addClass('table bg-teal');
                }
                else {
                    Resource = formatJsonToTableForOtherMeter(myJSON)
                    $('#tbl').removeClass('table bg-teal').addClass('table bg-purple');
                }
                $('#tbl').html(Resource);
            }
        }
    });

});

$('#btnAddEnergyConsumptionActual').click(function () {
    $('#EnergyConsumptionActualModal').modal('show');
});

$('#btnAddControlEnablement').click(function () {
    $('#ControlEnablementModal').modal('show');
});

$('#btnAddOverrides').click(function () {
    $('#OverridesModal').modal('show');
});

$('#btnSavingsModel').click(function () {
    $('#SavingsModal').modal('show');
});

$('#btnAddTimeofDay').click(function () {
    $('#TimeofDayModal').modal('show');
    $.ajax({
        type: "post",
        url: "/Deshboard/TimeofDayENERGYCONSUMPTION",
        data: {},
        datatype: "json",
        //traditional: true,
        success: function (data) {
            var myJSON = JSON.parse(data);
            var rowcount = myJSON.length;
            var mainWidnow = myJSON.filter(x => x.IsMainWindow == true);
            var modalHtml = '<div class="row">';
            for (var i = 0; i < mainWidnow.length; i++) {
                //set html on modal popup
                modalHtml += '<div class="col-md-4">' +
                    '<a href="#" style="text-decoration: none;">' +
                    '<div class="graph4" style="width:100%">' +
                    '<div class="g-icon"><img src="/Dashboard/assests/Icons/icon-graph.png" alt="" class="graph-icont"></div>' +
                    '<div class="g-textt">' +
                    '<span id="modelOpsWindow">' + mainWidnow[i].KWHVsKVAH + '</span>' +
                    '<div class="g-stextt">' + mainWidnow[i].SiteOperationWindow + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</a>' +
                    '</div>';
            }
            modalHtml += '</div>';

            var loopCount = (rowcount - mainWidnow.length) / 3 + (rowcount - mainWidnow.length) % 3
            modalHtml += '<div class="row">';
            for (var i = mainWidnow.length; i < rowcount; i++) {
                modalHtml += '<div class="form-group">' +
                    '<a href="#" style="text-decoration: none;">' +
                    '<div class="graph4">' +
                    '<div class="g-icon"><img src="/Dashboard/assests/Icons/icon-graph.png" alt="" class="graph-icont"></div>' +
                    '<div class="g-textt">' +
                    '<span id="modelCrew">' + myJSON[i].KWHVsKVAH + '</span>' +
                    '<div class="g-stextt">' + myJSON[i].SiteOperationWindow + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</a>' +
                    '</div> ';
            }
            $("#todModalBody").append(modalHtml);
        }
    });
});

$('#btnElectricalHealthPowerFactor').click(function () {
    $('#ElectricalHealthPowerFactorModel').modal('show');

    if ((p16 != null && p16 != undefined)
        || (p17 != null && p17 != undefined)
        || (p18 != null && p18 != undefined)) {
        var dom = document.getElementById('electricalhealth-powerfactor-container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        const gaugeData = [
            {
                value: p16,
                name: 'PF-R',
                title: {
                    offsetCenter: ['-55%', '80%']
                },
                detail: {
                    offsetCenter: ['-55%', '95%']
                }
            },
            {
                value: p17,
                name: 'PF-Y',
                title: {
                    offsetCenter: ['-5%', '80%']
                },
                detail: {
                    offsetCenter: ['-5%', '95%']
                }
            },
            {
                value: p18,
                name: 'PF-B',
                title: {
                    offsetCenter: ['45%', '80%']
                },
                detail: {
                    offsetCenter: ['45%', '95%']
                }
            }
        ];
        option = {
            series: [
                {
                    type: 'gauge',
                    min: 0,
                    max: 1,
                    anchor: {
                        show: true,
                        showAbove: true,
                        size: 18,
                        itemStyle: {
                            color: '#FAC858'
                        }
                    },
                    pointer: {
                        icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                        width: 8,
                        length: '75%',
                        offsetCenter: [0, '8%']
                    },
                    progress: {
                        show: true,
                        overlap: true,
                        roundCap: true
                    },
                    axisLine: {
                        roundCap: true
                    },
                    data: gaugeData,
                    title: {
                        fontSize: 10
                    },
                    detail: {
                        width: 40,
                        height: 14,
                        fontSize: 12,
                        color: '#fff',
                        backgroundColor: 'inherit',
                        borderRadius: 3,
                        formatter: '{value}'
                    }
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    }
});

$('#btnElectricalHealthCurrent').click(function () {
    $('#ElectricalHealthCurrentModel').modal('show');

    if ((p6 != null && p6 != undefined)
        || (p9 != null && p9 != undefined)
        || (p12 != null && p12 != undefined)) {
        var dom = document.getElementById('electricalhealth-current-container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        const gaugeData = [
            {
                value: p6,
                name: 'Current-R',
                title: {
                    offsetCenter: ['-55%', '80%']
                },
                detail: {
                    offsetCenter: ['-55%', '95%']
                }
            },
            {
                value: p9,
                name: 'Current-Y',
                title: {
                    offsetCenter: ['-5%', '80%']
                },
                detail: {
                    offsetCenter: ['-5%', '95%']
                }
            },
            {
                value: p12,
                name: 'Current-B',
                title: {
                    offsetCenter: ['45%', '80%']
                },
                detail: {
                    offsetCenter: ['45%', '95%']
                }
            }
        ];
        option = {
            series: [
                {
                    type: 'gauge',
                    min: 0,
                    max: 100,
                    anchor: {
                        show: true,
                        showAbove: true,
                        size: 18,
                        itemStyle: {
                            color: '#FAC858'
                        }
                    },
                    pointer: {
                        icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                        width: 8,
                        length: '75%',
                        offsetCenter: [0, '8%']
                    },
                    progress: {
                        show: true,
                        overlap: true,
                        roundCap: true
                    },
                    axisLine: {
                        roundCap: true
                    },
                    data: gaugeData,
                    title: {
                        fontSize: 10
                    },
                    detail: {
                        width: 40,
                        height: 14,
                        fontSize: 12,
                        color: '#fff',
                        backgroundColor: 'inherit',
                        borderRadius: 3,
                        formatter: '{value}'
                    }
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    }
});

$('#btnElectricalHealthVoltage').click(function () {
    $('#ElectricalHealthVoltageModel').modal('show');
    var vol_r = ((parseFloat(p5) / (p6 != null && p6 != 0 ? parseFloat(p6) : 1)))?.toFixed(2);
    var vol_y = ((parseFloat(p8) / (p9 != null && p9 != 0 ? parseFloat(p9) : 1)))?.toFixed(2);
    var vol_b = ((parseFloat(p11) / (p12 != null && p12 != 0 ? parseFloat(p12) : 1)))?.toFixed(2);
    if ((vol_r != null && vol_r != undefined)
        || (vol_y != null && vol_y != undefined)
        || (vol_b != null && vol_b != undefined)) {
        var dom = document.getElementById('electricalhealth-voltage-container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        const gaugeData = [
            {
                value: vol_r,
                name: 'Voltage-R',
                title: {
                    offsetCenter: ['-60%', '85%']
                },
                detail: {
                    offsetCenter: ['-60%', '100%']
                }
            },
            {
                value: vol_y,
                name: 'Voltage-Y',
                title: {
                    offsetCenter: ['0%', '85%']
                },
                detail: {
                    offsetCenter: ['0%', '100%']
                }
            },
            {
                value: vol_b,
                name: 'Voltage-B',
                title: {
                    offsetCenter: ['60%', '85%']
                },
                detail: {
                    offsetCenter: ['60%', '100%']
                }
            },
            {
                value: p36,
                name: 'VR Unbalance',
                title: {
                    offsetCenter: ['-150%', '-70%']
                },
                detail: {
                    offsetCenter: ['-150%', '-55%']
                }
            },
            {
                value: p37,
                name: 'VY Unbalance',
                title: {
                    offsetCenter: ['-150%', '-30%']
                },
                detail: {
                    offsetCenter: ['-150%', '-15%']
                }
            },
            {
                value: p38,
                name: 'VB Unbalance',
                title: {
                    offsetCenter: ['-150%', '10%']
                },
                detail: {
                    offsetCenter: ['-150%', '25%']
                }
            },
            {
                value: p39,
                name: 'AR Unbalance',
                title: {
                    offsetCenter: ['150%', '-70%']
                },
                detail: {
                    offsetCenter: ['150%', '-55%']
                }
            },
            {
                value: p40,
                name: 'AY Unbalance',
                title: {
                    offsetCenter: ['150%', '-30%']
                },
                detail: {
                    offsetCenter: ['150%', '-15%']
                }
            },
            {
                value: p41,
                name: 'AB Unbalance',
                title: {
                    offsetCenter: ['150%', '10%']
                },
                detail: {
                    offsetCenter: ['150%', '25%']
                }
            }

        ];
        option = {
            series: [
                {
                    type: 'gauge',
                    min: 0,
                    max: 300,
                    anchor: {
                        show: true,
                        showAbove: true,
                        size: 15,
                        itemStyle: {
                            color: '#FAC858'
                        }
                    },
                    pointer: {
                        icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                        width: 8,
                        length: '75%',
                        offsetCenter: [0, '8%']
                    },
                    progress: {
                        show: true,
                        overlap: true,
                        roundCap: true
                    },
                    axisLine: {
                        roundCap: true
                    },
                    data: gaugeData,
                    title: {
                        fontSize: 10
                    },
                    detail: {
                        width: 40,
                        height: 14,
                        fontSize: 12,
                        color: '#fff',
                        backgroundColor: 'inherit',
                        borderRadius: 3,
                        formatter: '{value}'
                    }
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    }
});

$('#btnElectricalHealthWattsTotal').click(function () {
    $('#ElectricalHealthWattsTotalModel').modal('show');

    if ((p4 != null && p4 != undefined)
        || (p7 != null && p7 != undefined)
        || (p10 != null && p10 != undefined)) {
        var dom = document.getElementById('electricalhealth-wattstotal-container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        const gaugeData = [
            {
                value: p4,
                name: 'Watts-R',
                title: {
                    offsetCenter: ['-55%', '80%']
                },
                detail: {
                    offsetCenter: ['-55%', '95%']
                }
            },
            {
                value: p7,
                name: 'Watts-Y',
                title: {
                    offsetCenter: ['-5%', '80%']
                },
                detail: {
                    offsetCenter: ['-5%', '95%']
                }
            },
            {
                value: p10,
                name: 'Watts-B',
                title: {
                    offsetCenter: ['45%', '80%']
                },
                detail: {
                    offsetCenter: ['45%', '95%']
                }
            }
        ];
        option = {
            series: [
                {
                    type: 'gauge',
                    min: 0,
                    max: 100,
                    anchor: {
                        show: true,
                        showAbove: true,
                        size: 18,
                        itemStyle: {
                            color: '#FAC858'
                        }
                    },
                    pointer: {
                        icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                        width: 8,
                        length: '75%',
                        offsetCenter: [0, '8%']
                    },
                    progress: {
                        show: true,
                        overlap: true,
                        roundCap: true
                    },
                    axisLine: {
                        roundCap: true
                    },
                    data: gaugeData,
                    title: {
                        fontSize: 10
                    },
                    detail: {
                        width: 40,
                        height: 14,
                        fontSize: 12,
                        color: '#fff',
                        backgroundColor: 'inherit',
                        borderRadius: 3,
                        formatter: '{value}'
                    }
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    }
});

$('#btnElectricalHealthWhReceived').click(function () {
    $('#ElectricalHealthWhReceivedModel').modal('show');

    if ((p20 != null && p20 != undefined)
        || (p21 != null && p21 != undefined)
        || (p22 != null && p22 != undefined)) {
        var dom = document.getElementById('electricalhealth-WhReceived-container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        const gaugeData = [
            {
                value: p20,
                name: 'kWh Received-R',
                title: {
                    offsetCenter: ['-150%', '100%']
                },
                detail: {
                    offsetCenter: ['-150%', '115%']
                }
            },
            {
                value: p21,
                name: 'kWh Received-Y',
                title: {
                    offsetCenter: ['-80%', '100%']
                },
                detail: {
                    offsetCenter: ['-80%', '115%']
                }
            },
            {
                value: p22,
                name: 'kWh Received-B',
                title: {
                    offsetCenter: ['-10%', '100%']
                },
                detail: {
                    offsetCenter: ['-10%', '115%']
                }
            },
            {
                value: 0,
                name: 'kW demand',
                title: {
                    offsetCenter: ['60%', '100%']
                },
                detail: {
                    offsetCenter: ['60%', '115%']
                }
            },
            {
                value: 0,
                name: 'kW Maximum demand',
                title: {
                    offsetCenter: ['130%', '100%']
                },
                detail: {
                    offsetCenter: ['130%', '115%']
                }
            }
        ];
        option = {
            series: [
                {
                    type: 'gauge',
                    min: 0,
                    max: 100,
                    anchor: {
                        show: true,
                        showAbove: true,
                        size: 18,
                        itemStyle: {
                            color: '#FAC858'
                        }
                    },
                    pointer: {
                        icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                        width: 8,
                        length: '75%',
                        offsetCenter: [0, '8%']
                    },
                    progress: {
                        show: true,
                        overlap: true,
                        roundCap: true
                    },
                    axisLine: {
                        roundCap: true
                    },
                    data: gaugeData,
                    title: {
                        fontSize: 10
                    },
                    detail: {
                        width: 40,
                        height: 14,
                        fontSize: 12,
                        color: '#fff',
                        backgroundColor: 'inherit',
                        borderRadius: 3,
                        formatter: '{value}'
                    }
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    }
});

$('#btnElectricalHealthVAHReceived').click(function () {
    $('#ElectricalHealthVAHReceivedModel').modal('show');

    if ((p23 != null && p23 != undefined)
        || (p24 != null && p24 != undefined)
        || (p25 != null && p25 != undefined)) {
        var dom = document.getElementById('electricalhealth-VAHReceived-container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        const gaugeData = [
            {
                value: p23,
                name: 'kVAh Received-R',
                title: {
                    offsetCenter: ['-150%', '80%']
                },
                detail: {
                    offsetCenter: ['-150%', '95%']
                }
            },
            {
                value: p24,
                name: 'kVAh Received-Y',
                title: {
                    offsetCenter: ['-80%', '80%']
                },
                detail: {
                    offsetCenter: ['-80%', '95%']
                }
            },
            {
                value: p25,
                name: 'kVAh Received-B',
                title: {
                    offsetCenter: ['-10%', '80%']
                },
                detail: {
                    offsetCenter: ['-10%', '95%']
                }
            },
            {
                value: 0,
                name: 'kVAh demand',
                title: {
                    offsetCenter: ['60%', '80%']
                },
                detail: {
                    offsetCenter: ['60%', '95%']
                }
            },
            {
                value: 0,
                name: 'kVAh Maximum demand',
                title: {
                    offsetCenter: ['140%', '80%']
                },
                detail: {
                    offsetCenter: ['140%', '95%']
                }
            }
        ];
        option = {
            series: [
                {
                    type: 'gauge',
                    min: 0,
                    max: 100,
                    anchor: {
                        show: true,
                        showAbove: true,
                        size: 18,
                        itemStyle: {
                            color: '#FAC858'
                        }
                    },
                    pointer: {
                        icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                        width: 8,
                        length: '75%',
                        offsetCenter: [0, '8%']
                    },
                    progress: {
                        show: true,
                        overlap: true,
                        roundCap: true
                    },
                    axisLine: {
                        roundCap: true
                    },
                    data: gaugeData,
                    title: {
                        fontSize: 10
                    },
                    detail: {
                        width: 50,
                        height: 14,
                        fontSize: 12,
                        color: '#fff',
                        backgroundColor: 'inherit',
                        borderRadius: 3,
                        formatter: '{value}'
                    }
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    }
});

$('#btnElectricalHealthRunHRS').click(function () {
    $('#ElectricalHealthRunHRSModel').modal('show');

    if ((p33 != null && p33 != undefined)
        || (p34 != null && p34 != undefined)
        || (p35 != null && p35 != undefined)) {
        var dom = document.getElementById('electricalhealth-runhrs-container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        const gaugeData = [
            {
                value: 0,//p33,
                name: 'Run HRS-R',
                title: {
                    offsetCenter: ['-55%', '80%']
                },
                detail: {
                    offsetCenter: ['-55%', '95%']
                }
            },
            {
                value: 0,//p34,
                name: 'Run HRS-Y',
                title: {
                    offsetCenter: ['-5%', '80%']
                },
                detail: {
                    offsetCenter: ['-5%', '95%']
                }
            },
            {
                value: 0,//p35,
                name: 'Run HRS-B',
                title: {
                    offsetCenter: ['45%', '80%']
                },
                detail: {
                    offsetCenter: ['45%', '95%']
                }
            }
        ];
        option = {
            series: [
                {
                    type: 'gauge',
                    min: 0,
                    max: 100,
                    anchor: {
                        show: true,
                        showAbove: true,
                        size: 18,
                        itemStyle: {
                            color: '#FAC858'
                        }
                    },
                    pointer: {
                        icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                        width: 8,
                        length: '75%',
                        offsetCenter: [0, '8%']
                    },
                    progress: {
                        show: true,
                        overlap: true,
                        roundCap: true
                    },
                    axisLine: {
                        roundCap: true
                    },
                    data: gaugeData,
                    title: {
                        fontSize: 10
                    },
                    detail: {
                        width: 40,
                        height: 14,
                        fontSize: 12,
                        color: '#fff',
                        backgroundColor: 'inherit',
                        borderRadius: 3,
                        formatter: '{value}'
                    }
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    }
});
function formatJsonToTableForMainMeter(d) {
    // `d` is the original data object for the row
    return (
        '<table>' +
        '<tr>' +
        '<td>meter:</td>' +
        '<td style="white-space: nowrap;">' +
        d[0].DeviceName +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>avg_pf(p3):</td>' +
        '<td>' +
        d[0].p3 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>pow_r(KW)(p4):</td>' +
        '<td>' +
        d[0].p4 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>volt_r(V)(p5):</td>' +
        '<td>' +
        //d[0].p5 +
        ((parseFloat(d[0].p5) / (d[0].p6 != null && d[0].p6 != 0 ? parseFloat(d[0].p6) : 1)))?.toFixed(2) +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>curr_r(AMP)(p6):</td>' +
        '<td>' +
        d[0].p6 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>pow_y(KW)(p7):</td>' +
        '<td>' +
        d[0].p7 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>volt_y(V)(p8):</td>' +
        '<td>' +
        //d[0].p8 +
        ((parseFloat(d[0].p8) / (d[0].p9 != null && d[0].p9 != 0 ? parseFloat(d[0].p9) : 1)))?.toFixed(2) +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>curr_y(AMP)(p9):</td>' +
        '<td>' +
        d[0].p9 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>pow_b(KW)(p10):</td>' +
        '<td>' +
        d[0].p10 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>volt_b(V)(p11):</td>' +
        '<td>' +
        //d[0].p11 +
        ((parseFloat(d[0].p11) / (d[0].p12 != null && d[0].p12 != 0 ? parseFloat(d[0].p12) : 1)))?.toFixed(2) +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>curr_b(AMP)(p12):</td>' +
        '<td>' +
        d[0].p12 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>cumm_en(KWH)(p13):</td>' +
        '<td>' +
        parseFloat(parseFloat(d[0].p13)).toFixed(2) +
        //parseFloat(parseFloat(d[0].p13) / 1000000).toFixed(2) +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>run_hrs(HR)(p14):</td>' +
        '<td>' +
        parseFloat(parseFloat(d[0].p14)).toFixed(2) +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>total_pow(KW):</td>' +
        '<td>' +
        d[0].p15 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Voltage Average(p16):</td>' +
        '<td>' +
        //d[0].p16 +
        ((parseFloat(d[0].p16) / (d[0].p17 != null && d[0].p17 != 0 ? parseFloat(d[0].p17) : 1)) / 3)?.toFixed(2) +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Avg Current(p17):</td>' +
        '<td>' +
        d[0].p17 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>VAH Recieved(p18):</td>' +
        '<td>' +
        d[0].p18 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>On Hours(p19):</td>' +
        '<td>' +
        d[0].p19 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>KWH Recieved R Phase(p20):</td>' +
        '<td>' +
        d[0].p20 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>KWH Recieved Y Phase(p21):</td>' +
        '<td>' +
        d[0].p21 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>KWH Recieved B Phase(p22):</td>' +
        '<td>' +
        d[0].p22 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>KVAH Recieved R Phase(p23):</td>' +
        '<td>' +
        d[0].p23 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>KVAH Recieved Y Phase(p24):</td>' +
        '<td>' +
        d[0].p24 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>KVAH Recieved B Phase(p25):</td>' +
        '<td>' +
        d[0].p25 +
        '</td>' +
        '</tr>' +
        '</table>'
    );
}
function formatJsonToTableForOtherMeter(d) {
    // `d` is the original data object for the row
    return (
        '<table>' +
        '<tr>' +
        '<td>meter:</td>' +
        '<td style="white-space: nowrap;">' +
        d[0].DeviceName +
        '</td>' +
        '</tr>' +
        //'<tr>' +
        //'<td>total_pow:</td>' +
        //'<td>' +
        //d[0].p15 +
        //'</td>' +
        //'</tr>' +
        '<tr>' +
        '<td>cumm_con(KWH)(p3):</td>' +
        '<td>' +
        /* parseFloat(parseFloat(d[0].p3) / 1000000).toFixed(2) +*/
        parseFloat(parseFloat(d[0].p3)).toFixed(2) +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>pow_r(KW)(p4):</td>' +
        '<td>' +
        d[0].p4 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>pow_y(KW)(p5):</td>' +
        '<td>' +
        d[0].p5 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>pow_b(KW)(p6):</td>' +
        '<td>' +
        d[0].p6 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>run_hrs(HR)(p7):</td>' +
        '<td>' +
        parseFloat(parseFloat(d[0].p7)).toFixed(2) +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>total_pow(KW)(p8):</td>' +
        '<td>' +
        //d[0].ToatalPWR +
        (parseFloat(parseFloat(d[0].ToatalPWR)) * 1000).toFixed(2) +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>pow_fac(p9):</td>' +
        '<td>' +
        d[0].p9 +
        '</td>' +
        '</tr>' +
        '</tr>' +
        '<tr>' +
        '<td>Voltage Average(p10):</td>' +
        '<td>' +
        //d[0].p10 +
        ((((parseFloat(d[0].p10) / (d[0].p14 != null && d[0].p14 != 0 ? parseFloat(d[0].p14) : 1)))) / 3)?.toFixed(2) +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Voltage R Phase(p11):</td>' +
        '<td>' +
        //d[0].p11 +
        ((parseFloat(d[0].p11) / (d[0].p15 != null && d[0].p15 != 0 ? parseFloat(d[0].p15) : 1)))?.toFixed(2) +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Voltage Y Phase(p12):</td>' +
        '<td>' +
        //d[0].p12 +
        ((parseFloat(d[0].p12) / (d[0].p16 != null && d[0].p16 != 0 ? parseFloat(d[0].p16) : 1)))?.toFixed(2) +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Voltage B Phase(p13):</td>' +
        '<td>' +
        //d[0].p13 +
        ((parseFloat(d[0].p13) / (d[0].p17 != null && d[0].p17 != 0 ? parseFloat(d[0].p17) : 1)))?.toFixed(2) +
        '</td>' +
        '</tr>' +

        '<tr>' +
        '<td>Current Average(p14):</td>' +
        '<td>' +
        d[0].p14 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Current R Phase(p15):</td>' +
        '<td>' +
        d[0].p15 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Current Y Phase(p16):</td>' +
        '<td>' +
        d[0].p16 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Current B Phase(p17):</td>' +
        '<td>' +
        d[0].p17 +
        '</td>' +
        '</tr>' +

        '</tr>' +
        '<tr>' +
        '<td>Import Energy (VAH)(p18):</td>' +
        '<td>' +
        d[0].p18 +
        '</td>' +
        '</tr>' +
        '</tr>' +
        '<tr>' +
        '<td>Import Energy EB (WH) R Phase (p19):</td>' +
        '<td>' +
        d[0].p19 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Import Energy EB (WH) Y Phase (p20):</td>' +
        '<td>' +
        d[0].p20 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Import Energy EB (WH) B Phase (p21):</td>' +
        '<td>' +
        d[0].p21 +
        '</td>' +
        '</tr>' +

        '<tr>' +
        '<td>Import Energy EB (VAH) R Phase (p22):</td>' +
        '<td>' +
        d[0].p22 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Import Energy EB (VAH) Y Phase (p23):</td>' +
        '<td>' +
        d[0].p23 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Import Energy EB (VAH) B Phase (p24):</td>' +
        '<td>' +
        d[0].p24 +
        '</td>' +
        '</tr>' +

        //'<tr>' +
        //'<td>pow_b:</td>' +
        //'<td>' +
        //d[0].p10 +
        //'</td>' +
        //'</tr>' +
        //'<tr>' +
        //'<td>volt_b:</td>' +
        //'<td>' +
        //d[0].p11 +
        //'</td>' +
        //'</tr>' +
        //'<tr>' +
        //'<td>curr_b:</td>' +
        //'<td>' +
        //d[0].p12 +
        //'</td>' +
        //'</tr>' +
        //'<tr>' +
        //'<td>cumm_en:</td>' +
        //'<td>' +
        //d[0].p13 +
        //'</td>' +
        //'</tr>' +
        //'<tr>' +
        //'<td>run_hrs:</td>' +
        //'<td>' +
        //d[0].p14 +
        //'</td>' +
        //'</tr>' +


        '</table>'
    );
}
