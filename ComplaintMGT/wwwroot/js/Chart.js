var time = [];
var ac11 = [];
var AC1C = 0;
var seriesArray = [];
var time1 = [];
var time2 = [];
var time3 = [];
var ac111 = [];
var ac112 = [];
var ac113 = [];
var AC1C1 = 0;
var seriesArray1 = [];
var seriesArray2 = [];
var seriesArray3 = [];

var temp = '';
var temp1 = '';
var temp2 = '';
var temp3 = '';





$.ajax({
    type: "POST",
    // contentType: "application/json; charset=utf-8",
    url: '/Deshboard/GetAllTimeForChart',
    data: { DeviceType: 5 },
    //  dataType: "json",
    success: function (data) {

        var myJSON = JSON.parse(data.Time);
        for (i = 0; i < myJSON.length; i++) {
            time1.push(myJSON[i].TTime);

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

            temp1 = { name: device, data: arrOfNum }
            seriesArray1.push(temp1);
            nameArr = '';
            ac111 = [];

        }

        // alert(JSON.stringify(seriesArray));






        //alert(a1.length - 1);
        // alert(JSON.stringify(ac11[2]));
        Highcharts.chart('container1', {

            chart: {
                type: 'areaspline'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {

                categories: time1, //['00:01', '00:12', '00:22', '00:32', '00:42', '00:52', '00:60', '13:23', '13:33', '13:43', '13:53'],
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
            series: seriesArray1
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
        seriesArray1 = [];
        time1 = [];
    }

});

$.ajax({
    type: "POST",
    // contentType: "application/json; charset=utf-8",
    url: '/Deshboard/GetAllTimeForChart',
    data: { DeviceType: 8 },
    //  dataType: "json",
    success: function (data) {

        var myJSON = JSON.parse(data.Time);
        for (i = 0; i < myJSON.length; i++) {
            time3.push(myJSON[i].TTime);

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

            temp3 = { name: device, data: arrOfNum }
            seriesArray3.push(temp3);
            nameArr = '';
            ac113 = [];

        }

        // alert(JSON.stringify(seriesArray));






        //alert(a1.length - 1);
        // alert(JSON.stringify(ac11[2]));
        Highcharts.chart('container2', {

            chart: {
                type: 'areaspline'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {

                categories: time3, //['00:01', '00:12', '00:22', '00:32', '00:42', '00:52', '00:60', '13:23', '13:33', '13:43', '13:53'],
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
            series: seriesArray3
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

    }


});

//--------------------------------------------------////////////////////////////----------------------------------------------

// Data retrieved https://en.wikipedia.org/wiki/List_of_cities_by_average_temperature
