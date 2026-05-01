/* ------------------------------------------------------------------------------
 *
 *  # Echarts - Floating bars example
 *
 *  Demo JS code for floating bars chart [light theme]
 *
 * ---------------------------------------------------------------------------- */


// Setup module
// ------------------------------

var EchartsBarsFloatingLight = function() {


    //
    // Setup module components
    //

    // Floating bar chart
    var _barsFloatingLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        // Define element
        var bars_float_element = document.getElementById('bars_float');


        //
        // Charts configuration
        //

        if (bars_float_element) {

            // Initialize chart
            var bars_float = echarts.init(bars_float_element);

            $.ajax({
                type: "POST",
                // contentType: "application/json; charset=utf-8",
                url: '/Deshboard/GetAllOverallComplianceofStore',
                data: {},
                //  dataType: "json",
                success: function (data) {
                    var myJSON = JSON.parse(data);

                    var Device = [];
                    var FirValue = [];
                    var LasValue = [];

                    for (i = 0; i < myJSON.length; i++) {
                        //var dat = myJSON[i].P
                        //var met = myJSON[i].DeviceName
                        //meter.push(myJSON[i].DeviceName);
                        //var arr = { value: dat, name: met }
                        //datad.push(arr);
                        //dat = '';
                        //met = '';

                        Device.push(myJSON[i].device);
                        FirValue.push(myJSON[i].FirValue);
                        LasValue.push(myJSON[i].SecValue);

                       
                    }

                   // alert(JSON.stringify(myJSON));
            //
            // Chart config
            //

            // Variables
            var placeHoledStyle = {
                normal: {
                    barBorderColor: 'transparent',
                    color: 'transparent'
                }
            };
            var dataStyle = { 
                normal: {
                    barBorderRadius: 3,
                    label: {
                        show: true,
                        position: 'insideLeft',
                        formatter: '{c}%',
                        textStyle: {
                            padding: 5
                        }
                    }
                }
            };
               
            // Options
            bars_float.setOption({

                // Global text styles
                textStyle: {
                    fontFamily: 'Roboto, Arial, Verdana, sans-serif',
                    fontSize: 13
                },

                // Chart animation duration
                animationDuration: 750,

                // Setup grid
                grid: {
                    left: 5,
                    right: 10,
                    top: 35,
                    bottom: 0,
                    containLabel: true
                },

                // Add legend
                legend: {
                    data: ['Overall Compliance of Store'],
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
                    },
                    axisPointer: {
                        type: 'shadow',
                        shadowStyle: {
                            color: 'rgba(0,0,0,0.025)'
                        }
                    },
                    formatter: '<div class="mb-1">{b}</div>{a0}: {c0}%<br/>{a2}: {c2}%<br/>{a4}: {c4}%<br/>{a6}: {c6}%'
                },

                // Horizontal axis
                xAxis: [{
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
                        show: true,
                        lineStyle: {
                            color: '#eee',
                            type: 'dashed'
                        }
                    }
                }],

                // Vertical axis
                yAxis: [{
                    type: 'category',
                    data: Device,//['Deviation', 'No of Overrides', 'Override Hrs', 'HVAC', 'Kitchen Assets-Refrigertaion', 'Kitchen Assets- Non - Refrigertaion'],
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
                            color: '#eee'
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(250,250,250,0.1)', 'rgba(0,0,0,0.015)']
                        }
                    }
                }],

                // Add series
                series: [
                    {
                        name: 'Overall Compliance of Store',
                        type: 'bar',
                        stack: 'Total',
                        itemStyle: dataStyle,
                        data: FirValue//[38, 50, 33, 72, 67, 34]
                    },
                    {
                        name: 'Overall Compliance of Store',
                        type: 'bar',
                        stack: 'Total',
                        itemStyle: placeHoledStyle,
                        data: LasValue//[62, 50, 67, 28, 33, 66]
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
        var triggerChartResize = function() {
            bars_float_element && bars_float.resize();
        };

        // On sidebar width change
        var sidebarToggle = document.querySelector('.sidebar-control');
        sidebarToggle && sidebarToggle.addEventListener('click', triggerChartResize);

        // On window resize
        var resizeCharts;
        window.addEventListener('resize', function() {
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
        init: function() {
            _barsFloatingLightExample();
        }
    }
}();

var EchartsBarsFloatingLight2 = function () {


    //
    // Setup module components
    //

    // Floating bar chart
    var _barsFloatingLightExample = function () {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        // Define element
        var bars_float_element = document.getElementById('bars_float2');


        //
        // Charts configuration
        //

        if (bars_float_element) {

            // Initialize chart
            var bars_float = echarts.init(bars_float_element);

            $.ajax({
                type: "POST",
                // contentType: "application/json; charset=utf-8",
                url: '/Deshboard/GetAllDeviationOverallComplianceofStore',
                data: {},
                //  dataType: "json",
                success: function (data) {
                    var myJSON = JSON.parse(data);

                    //var Device = [];
                    var FirValue = [];
                    var LasValue = [];

                    for (i = 0; i < myJSON.length; i++) {
                        //var dat = myJSON[i].P
                        //var met = myJSON[i].DeviceName
                        //meter.push(myJSON[i].DeviceName);
                        //var arr = { value: dat, name: met }
                        //datad.push(arr);
                        //dat = '';
                        //met = '';

                       // Device.push(myJSON[i].device);
                        FirValue.push(myJSON[i].FirValue);
                        LasValue.push(myJSON[i].SecValue);


                    }

                   // alert(JSON.stringify(myJSON));
                    //
                    // Chart config
                    //

                    // Variables
                    var placeHoledStyle = {
                        normal: {
                            barBorderColor: 'transparent',
                            color: 'transparent'
                        }
                    };
                    var dataStyle = {
                        normal: {
                            barBorderRadius: 3,
                            label: {
                                show: true,
                                position: 'insideLeft',
                                formatter: '{c}%',
                                textStyle: {
                                    padding: 5
                                }
                            }
                        }
                    };

                    // Options
                    bars_float.setOption({

                        // Global text styles
                        textStyle: {
                            fontFamily: 'Roboto, Arial, Verdana, sans-serif',
                            fontSize: 13
                        },

                        // Chart animation duration
                        animationDuration: 750,

                        // Setup grid
                        grid: {
                            left: 5,
                            right: 10,
                            top: 35,
                            bottom: 0,
                            containLabel: true
                        },

                        // Add legend
                        legend: {
                            data: ['Overall Compliance of Store'],
                            itemHeight: 12,
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
                            },
                            axisPointer: {
                                type: 'shadow',
                                shadowStyle: {
                                    color: 'rgba(0,0,0,0.025)'
                                }
                            },
                            formatter: '<div class="mb-1">{b}</div>{a0}: {c0}%<br/>{a2}: {c2}%<br/>{a4}: {c4}%<br/>{a6}: {c6}%'
                        },

                        // Horizontal axis
                        xAxis: [{
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
                                show: true,
                                lineStyle: {
                                    color: '#eee',
                                    type: 'dashed'
                                }
                            }
                        }],

                        // Vertical axis
                        yAxis: [{
                            type: 'category',
                            data: ['Deviation'],
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
                                    color: '#eee'
                                }
                            },
                            splitArea: {
                                show: true,
                                areaStyle: {
                                    color: ['rgba(250,250,250,0.1)', 'rgba(0,0,0,0.015)']
                                }
                            }
                        }],

                        // Add series
                        series: [
                            {
                                name: 'Overall Compliance of Store',
                                type: 'bar',
                                stack: 'Total',
                                itemStyle: dataStyle,
                                data: FirValue//[38, 50, 33, 72, 67, 34]
                            },
                            {
                                name: 'Overall Compliance of Store',
                                type: 'bar',
                                stack: 'Total',
                                itemStyle: placeHoledStyle,
                                data: LasValue//[62, 50, 67, 28, 33, 66]
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
            bars_float_element && bars_float.resize();
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
            _barsFloatingLightExample();
        }
    }
}();

// Initialize module
// ------------------------------

document.addEventListener('DOMContentLoaded', function() {
    EchartsBarsFloatingLight.init();
    EchartsBarsFloatingLight2.init();
});
