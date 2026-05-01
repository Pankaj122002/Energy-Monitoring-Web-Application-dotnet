$(document).ready(function () {
    GetAllSite();

});


//function GetAllCustomer() {
   
//    $('#ddlCustomer').html('');
  
//    $.ajax({
//        type: "post",
//        url: "/Configuration/GetAllCoustomer",
//        data: '{}',
//        dataType: "json",
//        success: function (data) {
            
//            var myJSON = data.data;
//            var Resource = "<select id='ddlCustomer'>";
//            Resource = Resource + '<option value="0">select</option>';
//            for (var i = 0; i < myJSON.length; i++) {
//                Resource = Resource + '<option value=' + myJSON[i].CustomerId + '>' + myJSON[i].Name + '</option>';
//            }
//            Resource = Resource + '</select>';
//            $('#ddlCustomer').html(Resource);
//        }
//    });
//}

function GetAllSite() {
    $.ajax({
        type: "POST",
        url: "/Deshboard/GetAllSiteByCustomerId?CustomerId=2",
        data: "{}",
        success: function (Mydata) {
            var data = JSON.parse(Mydata);
            $("#ddlSite").empty();
            var s = '<option value="0">Please Select</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].SiteId + '">' + data[i].Name + '</option>';
            }
            $("#ddlSite").html(s);
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });
}

//$('#ddlCustomer').change(function () {
//    var ddlsource = $('#ddlCustomer').val();
//    $.ajax({
//        type: "POST",
//        url: "/Deshboard/GetAllSiteByCustomerId?CustomerId=" + ddlsource,
//        data: "{}",
//        success: function (Mydata) {
//            var data = JSON.parse(Mydata);
//            $("#ddlSite").empty();
//            var s = '<option value="0">Please Select</option>';
//            for (var i = 0; i < data.length; i++) {
//                s += '<option value="' + data[i].SiteId + '">' + data[i].Name + '</option>';
//            }
//            $("#ddlSite").html(s);
//        },
//        error: function (result) {
//            massage('3', 'Something Went Wrong!');
//        }
//    });
//});

$('#ddlSite').change(function () {
    var ddlsource = $('#ddlSite').val();
    $.ajax({
        type: "POST",
        url: "/Deshboard/GetAllAssetBySiteId",
        data: { SiteId: ddlsource, DeviceType:'4,7'},
        success: function (Mydata) {
            var data = JSON.parse(Mydata);
            $("#ddlAsset").empty();
            var s = '<option value="0">Please Select</option>';
            for (var i = 0; i < data.length; i++) {
                s += '<option value="' + data[i].DeviceIdForExternal + '">' + data[i].AssetName + '</option>';
            }
            $("#ddlAsset").html(s);
        },
        error: function (result) {
            massage('3', 'Something Went Wrong!');
        }
    });
});




var time = [];
var ac11 = [];
var Dtime = [];
var Tempac1 = [];
var temp = '';
var seriesArray = [];

$.ajax({
    type: "POST",
    // contentType: "application/json; charset=utf-8",
    url: '/Deshboard/GetAllTimeForChart',
    data: { DeviceType: '4,7' },
    //  dataType: "json",
    success: function (data) {

        var myJSON = JSON.parse(data.Time);
        for (i = 0; i < myJSON.length; i++) {
            time.push(myJSON[i].TTime);

        }

        var a1 = JSON.parse(data.ac1);
        //debugger;
        for (i = 0; i < a1.length; i++) {

            var device = a1[i].Name;

            var nameArr = a1[i].Temp_in_degree.split(',')
            //for (i = 0; i < nameArr.length; i++) {
            //    ac11.push(parseInt(nameArr[i]));

            //}

            const arrOfNum = nameArr.map(str => Number(str));
            // alert(JSON.stringify(arrOfNum));

            temp = { name: device, data: arrOfNum }
            seriesArray.push(temp);
            nameArr = '';
            ac11 = [];

        }

        // alert(JSON.stringify(seriesArray));






        //alert(a1.length - 1);
        // alert(JSON.stringify(ac11[2]));
        Highcharts.chart('container', {

            chart: {
                type: 'line'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {

                categories: time, //['00:01', '00:12', '00:22', '00:32', '00:42', '00:52', '00:60', '13:23', '13:33', '13:43', '13:53'],
                tickmarkPlacement: 'on',
                title: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)'
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                }
            },
            tooltip: {
                split: true,
                valueSuffix: ' '
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                }
            },
            series: seriesArray
            //series: [{
            //    name: 'AC1',
            //    data: ac11
            //}
            //    , {
            //        name: 'AC2',
            //        data: [34, 12, 34, 44, 10, 30, 10, 34, 12, 34, 44, 10, 30, 10, 34, 12, 34, 44, 10, 30, 10, 44, 10, 30, 10]
            //    }, {
            //        name: 'AC3',
            //        data: [34, 12, 34, 44, 10, 30, 10, 34, 12, 34, 44, 10, 30, 10, 34, 12, 34, 44, 10, 30, 10, 44, 10, 30, 10]
            //    }]

        });
        seriesArray = [];
        time = [];
    }

});

$("#btnSearch").click(function () {
    
    var Fromdate = $('#txtFDate').val();
    var Todate = $('#txtTDate').val();
    var AssetName = $('#ddlAsset').find('option:selected').text();
    var DeviceId = $('#ddlAsset').find('option:selected').val();
    if (Fromdate != '' || Todate != '' || DeviceId != '0' || $('#ddlCustomer').find('option:selected').val().trim() != '0' || $('#ddlSite').find('option:selected').val().trim() != '0') {
        if (Fromdate < Todate) {
            $.ajax({
                type: "POST",
                // contentType: "application/json; charset=utf-8",
                url: '/Deshboard/GetAlltransactionTempSensorByDateTime',
                data: { FromDate: Fromdate, Todate: Todate, DeviceId: DeviceId },
                //  dataType: "json",
                success: function (data) {
                    Dtime = [];
                    Tempac1 = [];
                    var myJSON = JSON.parse(data);
                    for (i = 0; i < myJSON.length; i++) {
                        Dtime.push(myJSON[i].Tdate);
                        Tempac1.push(parseInt(myJSON[i].Temp_in_degree));
                    }
                    //alert(Dtime);
                    Highcharts.chart('container', {

                        chart: {
                            type: 'line'
                        },
                        title: {
                            text: ''
                        },
                        subtitle: {
                            text: ''
                        },
                        xAxis: {

                            categories: Dtime, //['00:01', '00:12', '00:22', '00:32', '00:42', '00:52', '00:60', '13:23', '13:33', '13:43', '13:53'],
                            tickmarkPlacement: 'on',
                            title: {
                                enabled: false
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Temperature (°C)'
                            },
                            labels: {
                                formatter: function () {
                                    return this.value;
                                }
                            }
                        },
                        tooltip: {
                            split: true,
                            valueSuffix: ' '
                        },
                        plotOptions: {
                            area: {
                                stacking: 'normal',
                                lineColor: '#666666',
                                lineWidth: 1,
                                marker: {
                                    lineWidth: 1,
                                    lineColor: '#666666'
                                }
                            }
                        },
                        series: [{
                            name: AssetName,
                            data: Tempac1
                        }
                            //    , {
                            //    name: 'AC2',
                            //    data: [34, 12, 34, 44, 10, 30, 10, 34, 12, 34, 44, 10, 30, 10, 34, 12, 34, 44, 10, 30, 10, 44, 10, 30, 10]
                            //}, {
                            //    name: 'AC3',
                            //    data: [34, 12, 34, 44, 10, 30, 10, 34, 12, 34, 44, 10, 30, 10, 34, 12, 34, 44, 10, 30, 10, 44, 10, 30, 10]
                            //    }
                        ]
                    });
                }

            });
            Dtime = [];
            AssetName = '';
            Tempac1 = [];
        }
        else {
            massage('2', 'Please select To Date greater than From Date');
        }

    }
    else {
        massage('2', 'Please select all required field');
    }


});

$('#btnReset').click(function () {

    $.ajax({
        type: "POST",
        // contentType: "application/json; charset=utf-8",
        url: '/Deshboard/GetAllTimeForChart',
        data: { DeviceType: 4 },
        //  dataType: "json",
        success: function (data) {

            var myJSON = JSON.parse(data.Time);
            for (i = 0; i < myJSON.length; i++) {
                time.push(myJSON[i].TTime);

            }

            var a1 = JSON.parse(data.ac1);
            //debugger;
            for (i = 0; i < a1.length; i++) {

                var device = a1[i].Name;

                var nameArr = a1[i].Temp_in_degree.split(',')
                //for (i = 0; i < nameArr.length; i++) {
                //    ac11.push(parseInt(nameArr[i]));

                //}

                const arrOfNum = nameArr.map(str => Number(str));
                // alert(JSON.stringify(arrOfNum));

                temp = { name: device, data: arrOfNum }
                seriesArray.push(temp);
                nameArr = '';
                ac11 = [];

            }

            // alert(JSON.stringify(seriesArray));






            //alert(a1.length - 1);
            // alert(JSON.stringify(ac11[2]));
            Highcharts.chart('container', {

                chart: {
                    type: 'area'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {

                    categories: time, //['00:01', '00:12', '00:22', '00:32', '00:42', '00:52', '00:60', '13:23', '13:33', '13:43', '13:53'],
                    tickmarkPlacement: 'on',
                    title: {
                        enabled: false
                    }
                },
                yAxis: {
                    title: {
                        text: 'Temperature (°C)'
                    },
                    labels: {
                        formatter: function () {
                            return this.value;
                        }
                    }
                },
                tooltip: {
                    split: true,
                    valueSuffix: ' '
                },
                plotOptions: {
                    area: {
                        stacking: 'normal',
                        lineColor: '#666666',
                        lineWidth: 1,
                        marker: {
                            lineWidth: 1,
                            lineColor: '#666666'
                        }
                    }
                },
                series: seriesArray
                //series: [{
                //    name: 'AC1',
                //    data: ac11
                //}
                //    , {
                //        name: 'AC2',
                //        data: [34, 12, 34, 44, 10, 30, 10, 34, 12, 34, 44, 10, 30, 10, 34, 12, 34, 44, 10, 30, 10, 44, 10, 30, 10]
                //    }, {
                //        name: 'AC3',
                //        data: [34, 12, 34, 44, 10, 30, 10, 34, 12, 34, 44, 10, 30, 10, 34, 12, 34, 44, 10, 30, 10, 44, 10, 30, 10]
                //    }]

            });
            seriesArray = [];
            time = [];
        }
    });

})
