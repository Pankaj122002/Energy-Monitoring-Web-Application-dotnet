


$(document).ready(function () {
    GetAllDevice();
    GetAllHAVC();
    GetAllKitchen();
    GetAllMainMeter();
    GetAllTimeofDayENERGYCONSUMPTION();
    
    EnergyConsumptiontotal();
    load();
    selectMetersPara();
    GetAlldevi();
    
});

function GetAllHAVC() {

    $.ajax({
        type: "post",
        url: "/Deshboard/GetTopValuetransactionTempSensor?DType=4,7",
        data: {},
        datatype: "json",
        //traditional: true,
        success: function (data) {
            var myJSON = JSON.parse(data);
           // alert(JSON.stringify(myJSON));
            var rowcount = myJSON.length;
            var col = 12 / myJSON.length;
            if (col < 2)
                col = 2;
            else
                col = parseInt(col)
            var Resource = '';
            var style = 'rcorners2';
            for (var i = 0; i < rowcount; i++) {
                if (myJSON[i].Res == 1)
                    style = 'rcorners1'
                else
                    style = 'rcorners2'
                Resource = Resource + '<div class="text-center col-sm-' + col + ' tooltip1"><div style="width:100px">';
                Resource = Resource + '<span class="tooltiptext1">LCL:' + myJSON[i].LCL + ',UCL:' + myJSON[i].UCL + '</span>';
                Resource = Resource + '<div class="' + style + '"><h1>' + myJSON[i].Temp_in_degree + '</h1></div><br><p>' + myJSON[i].Name + '</p>';
               
                Resource = Resource + '</div></div>';
            }
           
            $('#HVAC').html(Resource);
        }
    });

}
function GetAllKitchen() {

    $.ajax({
        type: "post",
        url: "/Deshboard/GetTopValuetransactionTempSensor?DType=5,8",
        data: {},
        datatype: "json",
        //traditional: true,
        success: function (data) {
            var myJSON = JSON.parse(data);

            var rowcount = myJSON.length;
            var col = 12 / myJSON.length;
            if (col < 2)
                col = 2;
            else
                col = parseInt(col)
            var Resource = '';
            var style = 'rcorners2';
            for (var i = 0; i < rowcount; i++) {
                if (myJSON[i].Res == 1)
                    style = 'rcorners1'
                else
                    style = 'rcorners2'
                Resource = Resource + '<div class="text-center col-sm-' + col + ' tooltip1"><div style="width:100px">';
                Resource = Resource + '<span class="tooltiptext1">LCL:' + myJSON[i].LCL + ',UCL:' + myJSON[i].UCL + '</span>';
                Resource = Resource + '<div class="' + style + '"><h1>' + myJSON[i].Temp_in_degree + '</h1></div><br><p>' + myJSON[i].Name + '</p>';

                Resource = Resource + '</div></div>';
            }

            $('#Kitchen').html(Resource);
        }
    });

}
function GetAllMainMeter() {

    $.ajax({
        type: "post",
        url: "/Deshboard/Getallmeterdetailsbymetername?Device=SlaveID1",
        data: {},
        datatype: "json",
        //traditional: true,
        success: function (data) {
            var myJSON = JSON.parse(data);
            if (myJSON.length > 0) {
                $("#p3").empty();
                $("#p6").empty();
                $("#p9").empty();
                $("#p12").empty();
                $("#p5").empty();
                $("#p8").empty();
                $("#p11").empty();

                $("#p3").append(myJSON[0].p3);
                $("#p6").append(myJSON[0].p6);
                $("#p9").append(myJSON[0].p9);
                $("#p12").append(myJSON[0].p12);
                $("#p5").append(myJSON[0].p5);
                $("#p8").append(myJSON[0].p8);
                $("#p11").append(myJSON[0].p11);

                if (myJSON[0].p3>10)
                    $("#p3div").addClass("rcorners2");
                if (myJSON[0].p6 > 30)
                    $("#p6div").addClass("rcorners2");
                if (myJSON[0].p9 > 30)
                    $("#p9div").addClass("rcorners2");
                if (myJSON[0].p12 > 30)
                    $("#p12div").addClass("rcorners2");
                if (myJSON[0].p5 > 240)
                    $("#p5div").addClass("rcorners2");
                if (myJSON[0].p8 > 240)
                    $("#p8div").addClass("rcorners2");
                if (myJSON[0].p11 > 240)
                    $("#p11div").addClass("rcorners2");
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
          
            for (var i = 0; i < rowcount; i++) {
                if (myJSON[i].a4 == 'Ops Window') {
                    $("#OpsWindow").empty();

                    $("#OpsWindow").append(myJSON[i].a3);
                }
                else if (myJSON[i].a4 == 'Store Setup') {
                    $("#Crew").empty();

                    $("#Crew").append(myJSON[i].a3);
                }
                else if (myJSON[i].a4 == 'Pre Lunch') {
                    $("#PreLunch").empty();

                    $("#PreLunch").append(myJSON[i].a3);
                }
                else if (myJSON[i].a4 == 'Peak Lunch') {
                     $("#PeakLunch").empty();

                    $("#PeakLunch").append(myJSON[i].a3);
                }
                else if (myJSON[i].a4 == 'Post Lunch') {
                    $("#PostLunch").empty();

                    $("#PostLunch").append(myJSON[i].a3);
                }
                else if (myJSON[i].a4 == 'Pre Dinner') {
                    $("#PreDinner").empty();

                    $("#PreDinner").append(myJSON[i].a3);
                  
                }
                else if (myJSON[i].a4 == 'Peak Dinner') {
                    $("#PeakDinner").empty();

                    $("#PeakDinner").append(myJSON[i].a3);
                }
                else if (myJSON[i].a4 == 'Store Shutdown') {
                    $("#CrewShutdown").empty();

                    $("#CrewShutdown").append(myJSON[i].a3);
                }
                else if (myJSON[i].a4 == 'Current Day No Ops') {
                    $("#NonOps").empty();

                    $("#NonOps").append(myJSON[i].a3);
                    $("#NoOperations").empty();

                    $("#NoOperations").append(myJSON[i].a3);
                }
                else if (myJSON[i].a4 == 'Previous Day No Ops') {
                    $("#PreviousDayNoOps").empty();

                    $("#PreviousDayNoOps").append(myJSON[i].a3);
                }

            }
           
        }
    });

}


function EnergyConsumptiontotal() {

    $.ajax({
        type: "post",
        url: "/Deshboard/EnergyConsumptiontotal",
        data: {},
        datatype: "json",
        //traditional: true,
        success: function (data) {
            var myJSON = JSON.parse(data);
            if (myJSON.length > 0) {
                $("#tmontht").empty();
                $("#tLastWeek").empty();
                $("#tCurrentWeek").empty();
                $("#tyesterday").empty();
                $("#tToday").empty();
                $("#tPreviousHR").empty();


                $("#tPreviousHR").append(myJSON[0].PreviousHR);
                $("#tToday").append(myJSON[0].Today);
                $("#tyesterday").append(myJSON[0].yesterday);
                $("#tCurrentWeek").append(myJSON[0].CurrentWeek);
                $("#tLastWeek").append(myJSON[0].LastWeek);
                $("#tmontht").append(myJSON[0].montht);

            }

        }
    });

}

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
            if ('SlaveID1' == $("#Device").val()) {
                var Resource = format(myJSON)
                
                $('#tbl').removeClass('table table-dark bg-purple').addClass('table table-dark bg-teal');
            }

            else {
                var Resource = format1(myJSON)
               
                $('#tbl').removeClass('table table-dark bg-teal').addClass('table table-dark bg-purple');
            }
               
            $('#tbl').html(Resource);
        }
    });

});

function format(d) {
    // `d` is the original data object for the row
    return (
        '<table>' +
        '<tr>' +
        '<td>meter:</td>' +
        '<td>' +
        d[0].DeviceName +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>total_pow(KW):</td>' +
        '<td>' +
        d[0].ToatalPWR +
        '</td>' +
        '</tr>' +
         '<tr>' +
        '<td>avg_pf:</td>' +
        '<td>' +
        d[0].p3 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>pow_r(KW):</td>' +
        '<td>' +
        d[0].p4 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>volt_r(V):</td>' +
        '<td>' +
        d[0].p5 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>curr_r(AMP):</td>' +
        '<td>' +
        d[0].p6 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>pow_y(KW):</td>' +
        '<td>' +
        d[0].p7 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>volt_y(V):</td>' +
        '<td>' +
        d[0].p8 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>curr_y(AMP):</td>' +
        '<td>' +
        d[0].p9 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>pow_b(KW):</td>' +
        '<td>' +
        d[0].p10 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>volt_b(V):</td>' +
        '<td>' +
        d[0].p11 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>curr_b(AMP):</td>' +
        '<td>' +
        d[0].p12 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>cumm_en(KWH):</td>' +
        '<td>' +
        parseFloat(parseFloat(d[0].p13)/1000).toFixed(2) +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>run_hrs(HR):</td>' +
        '<td>' +
        parseFloat(parseFloat(d[0].p14)).toFixed(2) +
        '</td>' +
        '</tr>' +

       
        '</table>'
    );
}
function format1(d) {
    // `d` is the original data object for the row
    return (
        '<table>' +
        '<tr>' +
        '<td>meter:</td>' +
        '<td>' +
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
        '<td>cumm_con(KWH):</td>' +
        '<td>' +
        parseFloat(parseFloat(d[0].p3)/1000).toFixed(2) +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>pow_r(KW):</td>' +
        '<td>' +
        d[0].p4 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>pow_y(KW):</td>' +
        '<td>' +
        d[0].p5 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>pow_b(KW):</td>' +
        '<td>' +
        d[0].p6 +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>run_hrs(HR):</td>' +
        '<td>' +
        parseFloat(parseFloat(d[0].p7)).toFixed(2) +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>total_pow(KW):</td>' +
        '<td>' +
        d[0].ToatalPWR +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>pow_fac:</td>' +
        '<td>' +
        d[0].p9 +
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

            Resource = Resource + '<option value="0">Select</option>';
            for (var i = 0; i < rowcount; i++) {
                Resource = Resource + '<option value=' + myJSON[i].DeviceNo + '>' + myJSON[i].DeviceName + '</option>';
            }
            Resource = Resource + '</select>';
            $('#Device,#devi').html(Resource);
        }
    });

}
function GetAlldevi() {

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
            Resource = "<option value='ALL'> All</option>";
            
            for (var i = 0; i < rowcount; i++) {
                Resource = Resource + '<option value=' + myJSON[i].DeviceNo + '>' + myJSON[i].DeviceName + '</option>';
            }
            Resource = Resource + '</select>';
            $('#devi').html(Resource);
        }
    });

}


function load() {
    setTimeout("window.open(self.location, '_self');", 300000);
}

$("#devi").change(function () {
    $('#selectMetersPara').html('');
    var Resource = "";
    if ('1001' == $("#devi").val()) {
       
        Resource = '<option value="p15">total_pow(KW)</option><option value="p4">pow_r(KW)</option><option value="p7">pow_y(KW)</option><option value="p10">pow_b(KW)</option><option value="p5">volt_r(V)</option><option value="p8">volt_y(V)</option><option value="p11">volt_b(V)</option><option value="p6">curr_r(AMP)</option><option value="p9">curr_y(AMP)</option><option value="p12">curr_b(AMP)</option><option value="p3">avg_pf</option><option value="cast(cast([p13] as decimal(10,2))/1000 as decimal(10,2))">cumm_en(KWH)</option><option value="p14">run_hrs(HR)</option>';

       
    }

    else {
        Resource = '<option value="p8">total_pow(KW)</option><option value="p9">pow_fac</option><option value="p4">_r(KW)</option><option value="p5">_y(KW)</option><option value="p6">_b(KW)</option><option value="cast(cast([p3] as decimal(10,2))/1000 as decimal(10,2))">cum_consp(KWH)</option><option value="p7">run_hrs(HR)</option>';


    }
    $('#selectMetersPara').html(Resource);
    
});

function selectMetersPara() {
    $('#selectMetersPara').html('');
    var Resource = "";
  

    Resource ='<option value="p15">total_pow(KW)</option><option value="p4">pow_r(KW)</option><option value="p7">pow_y(KW)</option><option value="p10">pow_b(KW)</option><option value="p5">volt_r(V)</option><option value="p8">volt_y(V)</option><option value="p11">volt_b(V)</option><option value="p6">curr_r(AMP)</option><option value="p9">curr_y(AMP)</option><option value="p12">curr_b(AMP)</option><option value="p3">avg_pf</option><option value="cast(cast([p13] as decimal(10,2))/1000 as decimal(10,2))">cumm_en(KWH)</option><option value="p14">run_hrs(HR)</option>';


    $('#selectMetersPara').html(Resource);

};