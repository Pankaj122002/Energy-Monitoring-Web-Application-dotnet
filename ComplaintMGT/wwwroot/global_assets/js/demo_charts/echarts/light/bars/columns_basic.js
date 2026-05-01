///* ------------------------------------------------------------------------------
// *
// *  # Echarts - Basic column example
// *
// *  Demo JS code for basic column chart [light theme]
// *
// * ---------------------------------------------------------------------------- */


//// Setup module
//// ------------------------------

//var EchartsColumnsBasicLight = function() {


//    //
//    // Setup module components
//    //

//    // Basic column chart
//    var _columnsBasicLightExample = function() {
//        if (typeof echarts == 'undefined') {
//            console.warn('Warning - echarts.min.js is not loaded.');
//            return;
//        }

//        // Define element
//        var columns_basic_element = document.getElementById('columns_basic');


//        //
//        // Charts configuration
//        //

//        if (columns_basic_element) {

//            // Initialize chart
//            var columns_basic = echarts.init(columns_basic_element);


//            //
//            // Chart config
//            //

//            // Options
//            columns_basic.setOption({

//                // Define colors
//                color: ['#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80'],

//                // Global text styles
//                textStyle: {
//                    fontFamily: 'Roboto, Arial, Verdana, sans-serif',
//                    fontSize: 13
//                },

//                // Chart animation duration
//                animationDuration: 750,

//                // Setup grid
//                grid: {
//                    left: 0,
//                    right: 40,
//                    top: 35,
//                    bottom: 0,
//                    containLabel: true
//                },

//                // Add legend
//                legend: {
//                    data: ['Energy trend', 'Precipitation'],
//                    itemHeight: 8,
//                    itemGap: 20,
//                    textStyle: {
//                        padding: [0, 5]
//                    }
//                },

//                // Add tooltip
//                tooltip: {
//                    trigger: 'axis',
//                    backgroundColor: 'rgba(0,0,0,0.75)',
//                    padding: [10, 15],
//                    textStyle: {
//                        fontSize: 13,
//                        fontFamily: 'Roboto, sans-serif'
//                    }
//                },

//                // Horizontal axis
//                xAxis: [{
//                    type: 'category',
//                    data: ['Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat', 'Sun'],
//                    axisLabel: {
//                        color: '#333'
//                    },
//                    axisLine: {
//                        lineStyle: {
//                            color: '#999'
//                        }
//                    },
//                    splitLine: {
//                        show: true,
//                        lineStyle: {
//                            color: '#eee',
//                            type: 'dashed'
//                        }
//                    }
//                }],

//                // Vertical axis
//                yAxis: [{
//                    type: 'value',
//                    axisLabel: {
//                        color: '#333'
//                    },
//                    axisLine: {
//                        lineStyle: {
//                            color: '#999'
//                        }
//                    },
//                    splitLine: {
//                        lineStyle: {
//                            color: ['#eee']
//                        }
//                    },
//                    splitArea: {
//                        show: true,
//                        areaStyle: {
//                            color: ['rgba(250,250,250,0.1)', 'rgba(0,0,0,0.01)']
//                        }
//                    }
//                }],

//                // Add series
//                series: [
//                    {
//                        name: 'Energy trend',
//                        type: 'bar',
//                        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6],
//                        itemStyle: {
//                            normal: {
//                                label: {
//                                    show: true,
//                                    position: 'top',
//                                    textStyle: {
//                                        fontWeight: 500
//                                    }
//                                }
//                            }
//                        }
//                    }
//                ]
//            });
//        }


//        //
//        // Resize charts
//        //

//        // Resize function
//        var triggerChartResize = function() {
//            columns_basic_element && columns_basic.resize();
//        };

//        // On sidebar width change
//        var sidebarToggle = document.querySelector('.sidebar-control');
//        sidebarToggle && sidebarToggle.addEventListener('click', triggerChartResize);

//        // On window resize
//        var resizeCharts;
//        window.addEventListener('resize', function() {
//            clearTimeout(resizeCharts);
//            resizeCharts = setTimeout(function () {
//                triggerChartResize();
//            }, 200);
//        });
//    };


//    //
//    // Return objects assigned to module
//    //

//    return {
//        init: function() {
//            _columnsBasicLightExample();
//        }
//    }
//}();


//// Initialize module
//// ------------------------------

//document.addEventListener('DOMContentLoaded', function() {
//    EchartsColumnsBasicLight.init();
//});





/* ------------------------------------------------------------------------------
 *
 *  # Echarts - Basic column example
 *
 *  Demo JS code for basic column chart [light theme]
 *
 * ---------------------------------------------------------------------------- */


// Setup module
// ------------------------------

var EchartsColumnsBasicLight = function () {

    var col = "";
    var textStyleCol = "";
    if (sessionStorage.getItem("Mode") == 'dark') {
        col = '#000000';
        textStyleCol = '#000000';
    }
    else if (sessionStorage.getItem("Mode") == 'light') {

        col = '#fff';
        textStyleCol = '#222';
    }
    else {

        col = '#fff';
        textStyleCol = '#222';
    }


    //
    // Setup module components
    //

    // Basic column chart
    var _columnsBasicLightExample = function () {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        // Define element
        var columns_basic_element = document.getElementById('columns_basic');


        //
        // Charts configuration
        //

        if (columns_basic_element) {

            // Initialize chart
            var columns_basic = echarts.init(columns_basic_element);

            $.ajax({
                type: "POST",
                // contentType: "application/json; charset=utf-8",
                url: '/Deshboard/GetEnergyMeterRealtimeBARCHART',
                data: {},
                //  dataType: "json",
                success: function (data) {
                    var myJSON = JSON.parse(data);

                    var datad = [];
                    var KWH = [];
                    var KVAH = [];

                    for (i = 0; i < myJSON.length; i++) {
                        //var dat = myJSON[i].P
                        //var met = myJSON[i].DeviceName
                        //meter.push(myJSON[i].DeviceName);
                        //var arr = { value: dat, name: met }
                        //datad.push(arr);
                        //dat = '';
                        //met = '';

                        datad.push(myJSON[i].Hour);
                        KWH.push(myJSON[i].KWH);
                        KVAH.push(myJSON[i].KVAH);
                    }
                    //
                    // Chart config
                    //

                    // Options
                    columns_basic.setOption({

                        // Define colors
                        color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80'],

                        // Global text styles
                        textStyle: {
                            fontFamily: 'Roboto, Arial, Verdana, sans-serif',
                            fontSize: 13
                        },

                        // Chart animation duration
                        animationDuration: 750,

                        // Setup grid
                        grid: {
                            left: 0,
                            right: 40,
                            top: 35,
                            bottom: 0,
                            containLabel: true
                        },

                        // Add legend
                        legend: {
                            data: ['KWH', 'KVAH'],
                            itemHeight: 8,
                            itemGap: 20,
                            textStyle: {
                                padding: [0, 5]
                            }
                        },

                        // Add tooltip
                        tooltip: {
                            trigger: 'axis',
                            backgroundColor: 'rgba(0,0,0,0.75)',
                            padding: [10, 15],
                            textStyle: {
                                fontSize: 13,
                                fontFamily: 'Roboto, sans-serif'
                            }
                        },

                        // Horizontal axis
                        xAxis: [{
                            type: 'category',
                            data: datad, //['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                            axisLabel: {
                                color: '#333'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#999'
                                }
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#eee',
                                    type: 'dashed'
                                }
                            }
                        }],

                        // Vertical axis
                        yAxis: [{
                            type: 'value',
                            axisLabel: {
                                color: '#333'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#999'
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: ['#eee']
                                }
                            },
                            splitArea: {
                                show: true,
                                areaStyle: {
                                    color: ['rgba(250,250,250,0.1)', 'rgba(0,0,0,0.01)']
                                }
                            }
                        }],

                        // Add series
                        series: [
                            {
                                name: 'KWH',
                                type: 'bar',
                                data: KWH, //[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            position: 'top',
                                            textStyle: {
                                                fontWeight: 500
                                            }
                                        }
                                    }
                                },
                                markLine: {
                                    data: [{ type: 'average', name: 'Average' }]
                                }
                            },
                            {
                                name: 'KVAH',
                                type: 'bar',
                                data: KVAH,//[2.6, 5.9, 9.0, 26.4, 58.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            position: 'top',
                                            textStyle: {
                                                fontWeight: 500
                                            }
                                        }
                                    }
                                },
                                markLine: {
                                    data: [{ type: 'average', name: 'Average' }]
                                }
                            }
                        ]
                    });
                },
                error: function (result) {
                    HideLoading($('#columns_basic'));
                    ShowMessage('0', 'Something Went Wrong!');
                }
            });
        }



        //
        // Resize charts
        //

        // Resize function
        var triggerChartResize = function () {
            columns_basic_element && columns_basic.resize();
        };

        // On sidebar width change
        var sidebarToggle = document.querySelector('.sidebar-control');
        sidebarToggle && sidebarToggle.addEventListener('click', triggerChartResize);

        // On window resize
        var resizeCharts;
        window.addEventListener('resize', function () {
            clearTimeout(resizeCharts);
            resizeCharts = setTimeout(function () {
                triggerChartResize();
            }, 200);
        });
    };


    //
    // Return objects assigned to module
    //

    return {
        init: function () {
            _columnsBasicLightExample();
        }
    }
}();

var EchartsColumnsBasicLight2 = function () {

    var col = "";
    var textStyleCol = "";
    if (sessionStorage.getItem("Mode") == 'dark') {
        col = '#000000';
        textStyleCol = '#000000';
    }
    else if (sessionStorage.getItem("Mode") == 'light') {

        col = '#fff';
        textStyleCol = '#222';
    }
    else {

        col = '#fff';
        textStyleCol = '#222';
    }


    //
    // Setup module components
    //

    // Basic column chart
    var _columnsBasicLightExample = function () {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        // Define element
        var columns_basic_element = document.getElementById('columns_basic2');


        //
        // Charts configuration
        //

        if (columns_basic_element) {

            // Initialize chart
            var columns_basic = echarts.init(columns_basic_element);

            $.ajax({
                type: "POST",
                // contentType: "application/json; charset=utf-8",
                url: '/Deshboard/GetEnergyMeterRealtimeBARCHART',
                data: {},
                //  dataType: "json",
                success: function (data) {
                    var myJSON = JSON.parse(data);

                    var datad = [];
                    var KWH = [];
                    var KVAH = [];

                    for (i = 0; i < myJSON.length; i++) {
                        //var dat = myJSON[i].P
                        //var met = myJSON[i].DeviceName
                        //meter.push(myJSON[i].DeviceName);
                        //var arr = { value: dat, name: met }
                        //datad.push(arr);
                        //dat = '';
                        //met = '';

                        datad.push(myJSON[i].Hour);
                        KWH.push(myJSON[i].KWH);
                        KVAH.push(myJSON[i].KVAH);
                    }
                    //
                    // Chart config
                    //

                    // Options
                    columns_basic.setOption({

                        // Define colors
                        color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80'],

                        // Global text styles
                        textStyle: {
                            fontFamily: 'Roboto, Arial, Verdana, sans-serif',
                            fontSize: 13
                        },

                        // Chart animation duration
                        animationDuration: 750,

                        // Setup grid
                        grid: {
                            left: 0,
                            right: 40,
                            top: 35,
                            bottom: 0,
                            containLabel: true
                        },

                        // Add legend
                        legend: {
                            data: ['KWH', 'KVAH'],
                            itemHeight: 8,
                            itemGap: 20,
                            textStyle: {
                                padding: [0, 5]
                            }
                        },

                        // Add tooltip
                        tooltip: {
                            trigger: 'axis',
                            backgroundColor: 'rgba(0,0,0,0.75)',
                            padding: [10, 15],
                            textStyle: {
                                fontSize: 13,
                                fontFamily: 'Roboto, sans-serif'
                            }
                        },

                        // Horizontal axis
                        xAxis: [{
                            type: 'category',
                            data: datad, //['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                            axisLabel: {
                                color: '#333'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#999'
                                }
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#eee',
                                    type: 'dashed'
                                }
                            }
                        }],

                        // Vertical axis
                        yAxis: [{
                            type: 'value',
                            axisLabel: {
                                color: '#333'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#999'
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: ['#eee']
                                }
                            },
                            splitArea: {
                                show: true,
                                areaStyle: {
                                    color: ['rgba(250,250,250,0.1)', 'rgba(0,0,0,0.01)']
                                }
                            }
                        }],

                        // Add series
                        series: [
                            {
                                name: 'KWH',
                                type: 'bar',
                                data: KWH, //[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            position: 'top',
                                            textStyle: {
                                                fontWeight: 500
                                            }
                                        }
                                    }
                                },
                                markLine: {
                                    data: [{ type: 'average', name: 'Average' }]
                                }
                            },
                            {
                                name: 'KVAH',
                                type: 'bar',
                                data: KVAH,//[2.6, 5.9, 9.0, 26.4, 58.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            position: 'top',
                                            textStyle: {
                                                fontWeight: 500
                                            }
                                        }
                                    }
                                },
                                markLine: {
                                    data: [{ type: 'average', name: 'Average' }]
                                }
                            }
                        ]
                    });
                },
                error: function (result) {
                    HideLoading($('#columns_basic2'));
                    ShowMessage('0', 'Something Went Wrong!');
                }
            });
        }



        //
        // Resize charts
        //

        // Resize function
        var triggerChartResize = function () {
            columns_basic_element && columns_basic.resize();
        };

        // On sidebar width change
        var sidebarToggle = document.querySelector('.sidebar-control');
        sidebarToggle && sidebarToggle.addEventListener('click', triggerChartResize);

        // On window resize
        var resizeCharts;
        window.addEventListener('resize', function () {
            clearTimeout(resizeCharts);
            resizeCharts = setTimeout(function () {
                triggerChartResize();
            }, 200);
        });
    };


    //
    // Return objects assigned to module
    //

    return {
        init: function () {
            _columnsBasicLightExample();
        }
    }
}();
var EchartsColumnsBasicLight3 = function () {

    var col = "";
    var textStyleCol = "";
    if (sessionStorage.getItem("Mode") == 'dark') {
        col = '#000000';
        textStyleCol = '#000000';
    }
    else if (sessionStorage.getItem("Mode") == 'light') {

        col = '#fff';
        textStyleCol = '#222';
    }
    else {

        col = '#fff';
        textStyleCol = '#222';
    }


    //
    // Setup module components
    //

    // Basic column chart
    var _columnsBasicLightExample = function () {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        // Define element
        var columns_basic_element = document.getElementById('columns_basic2');


        //
        // Charts configuration
        //

        if (columns_basic_element) {

            // Initialize chart
            var columns_basic = echarts.init(columns_basic_element);

            $.ajax({
                type: "POST",
                // contentType: "application/json; charset=utf-8",
                url: '/Deshboard/GetEnergyMeterByDateBARCHART',
                data: { FromDate: $("#txtFDate").val(), Todate: $("#txtTDate").val() },
                //  dataType: "json",
                success: function (data) {
                    var myJSON = JSON.parse(data);

                    var datad = [];
                    var KWH = [];
                    var KVAH = [];

                    for (i = 0; i < myJSON.length; i++) {
                        //var dat = myJSON[i].P
                        //var met = myJSON[i].DeviceName
                        //meter.push(myJSON[i].DeviceName);
                        //var arr = { value: dat, name: met }
                        //datad.push(arr);
                        //dat = '';
                        //met = '';

                        datad.push(myJSON[i].datet);
                        KWH.push(myJSON[i].KWH);
                        KVAH.push(myJSON[i].KVAH);
                    }
                    //
                    // Chart config
                    //

                    // Options
                    columns_basic.setOption({

                        // Define colors
                        color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80'],

                        // Global text styles
                        textStyle: {
                            fontFamily: 'Roboto, Arial, Verdana, sans-serif',
                            fontSize: 13
                        },

                        // Chart animation duration
                        animationDuration: 750,

                        // Setup grid
                        grid: {
                            left: 0,
                            right: 40,
                            top: 35,
                            bottom: 0,
                            containLabel: true
                        },

                        // Add legend
                        legend: {
                            data: ['KWH', 'KVAH'],
                            itemHeight: 8,
                            itemGap: 20,
                            textStyle: {
                                padding: [0, 5]
                            }
                        },

                        // Add tooltip
                        tooltip: {
                            trigger: 'axis',
                            backgroundColor: 'rgba(0,0,0,0.75)',
                            padding: [10, 15],
                            textStyle: {
                                fontSize: 13,
                                fontFamily: 'Roboto, sans-serif'
                            }
                        },

                        // Horizontal axis
                        xAxis: [{
                            type: 'category',
                            data: datad, //['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                            axisLabel: {
                                color: '#333'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#999'
                                }
                            },
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: '#eee',
                                    type: 'dashed'
                                }
                            }
                        }],

                        // Vertical axis
                        yAxis: [{
                            type: 'value',
                            axisLabel: {
                                color: '#333'
                            },
                            axisLine: {
                                lineStyle: {
                                    color: '#999'
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: ['#eee']
                                }
                            },
                            splitArea: {
                                show: true,
                                areaStyle: {
                                    color: ['rgba(250,250,250,0.1)', 'rgba(0,0,0,0.01)']
                                }
                            }
                        }],

                        // Add series
                        series: [
                            {
                                name: 'KWH',
                                type: 'bar',
                                data: KWH, //[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            position: 'top',
                                            textStyle: {
                                                fontWeight: 500
                                            }
                                        }
                                    }
                                },
                                markLine: {
                                    data: [{ type: 'average', name: 'Average' }]
                                }
                            },
                            {
                                name: 'KVAH',
                                type: 'bar',
                                data: KVAH,//[2.6, 5.9, 9.0, 26.4, 58.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            position: 'top',
                                            textStyle: {
                                                fontWeight: 500
                                            }
                                        }
                                    }
                                },
                                markLine: {
                                    data: [{ type: 'average', name: 'Average' }]
                                }
                            }
                        ]
                    });
                },
                error: function (result) {
                    HideLoading($('#columns_basic2'));
                    ShowMessage('0', 'Something Went Wrong!');
                }
            });
        }



        //
        // Resize charts
        //

        // Resize function
        var triggerChartResize = function () {
            columns_basic_element && columns_basic.resize();
        };

        // On sidebar width change
        var sidebarToggle = document.querySelector('.sidebar-control');
        sidebarToggle && sidebarToggle.addEventListener('click', triggerChartResize);

        // On window resize
        var resizeCharts;
        window.addEventListener('resize', function () {
            clearTimeout(resizeCharts);
            resizeCharts = setTimeout(function () {
                triggerChartResize();
            }, 200);
        });
    };


    //
    // Return objects assigned to module
    //

    return {
        init: function () {
            _columnsBasicLightExample();
        }
    }
}();
// Initialize module
// ------------------------------

document.addEventListener('DOMContentLoaded', function () {
    EchartsColumnsBasicLight.init();
    EchartsColumnsBasicLight2.init();
});