var EchartsPieDonutLight = function () {
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

        //col = '#fff';
        //textStyleCol = '#222';
        col = '#000000';
        textStyleCol = '#000000';
    }

    //
    // Setup module components
    //

    // Basic donut chart
    var _scatterPieDonutLightExample = function () {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        // Define element
        var relatimeChartElement = document.getElementById('realtime-chart-container');


        //
        // Charts configuration
        //

        if (relatimeChartElement) {

            // Initialize chart
            var relatimeViewChart = echarts.init(relatimeChartElement);

            $.ajax({
                type: "POST",
                // contentType: "application/json; charset=utf-8",
                url: '/Deshboard/GetTopValueMeter',
                data: {},
                //  dataType: "json",
                success: function (data) {
                    var myJSON = JSON.parse(data);

                    var datad = [];
                    var meter = [];

                    for (i = 0; i < myJSON.length; i++) {
                        var dat = myJSON[i].P
                        var met = myJSON[i].DeviceName
                        meter.push(myJSON[i].DeviceName);
                        var arr = { value: dat, name: met }
                        datad.push(arr);
                        dat = '';
                        met = '';
                    }

                    //
                    // Chart config
                    //

                    // Options
                    relatimeViewChart.setOption({

                        // Colors
                        color: [
                            '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                            '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                            '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                            '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                        ],

                        // Global text styles
                        textStyle: {
                            fontFamily: 'Roboto, Arial, Verdana, sans-serif',
                            fontSize: 13
                        },

                        // Add title
                        title: {
                            //text: 'Real Time View',
                            subtext: '',
                            left: 'center',
                            textStyle: {
                                fontSize: 17,
                                fontWeight: 500,
                                color: col
                            },
                            subtextStyle: {
                                fontSize: 12
                            }
                        },

                        // Add tooltip
                        tooltip: {
                            trigger: 'item',
                            //backgroundColor: 'rgba(0,0,0,0.75)',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            padding: [10, 15],
                            textStyle: {
                                color: textStyleCol,
                                fontSize: 13,
                                fontFamily: 'Roboto, sans-serif'
                            },
                            // formatter: "{a} <br/>{b}: {c} ({d}%)"
                            formatter: "{a} <br/>{b}: {c} "
                        },

                        // Add legend
                        legend: {
                            orient: 'horizontal',
                            top: 'bottom',
                            left: 0,
                            data: meter, //['Main-Energy-Meter', 'DG Energy Meter 1', 'HVAC 1', 'Light Meter', 'Kitchen Meter 1', 'Kitchen Meter 2', 'Refrigration'],
                            itemHeight: 8,
                            itemWidth: 8,
                            textStyle: {
                                color: col
                            }
                        },

                        // Add series
                        series: [{
                            name: '(KW)',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            center: ['60[%', '57.5%'],
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    borderColor: '#fff'
                                }
                            },
                            data: datad
                            //data: [
                            //    { value: 335, name: 'Main-Energy-Meter'},
                            //    { value: 310, name: 'DG Energy Meter 1'},
                            //    { value: 234, name: 'HVAC 1'},
                            //    { value: 135, name: 'Light Meter'},
                            //    { value: 1548, name: 'Kitchen Meter 1'},
                            //    { value: 1548, name: 'Kitchen Meter 2'},
                            //    { value: 1548, name: 'Refrigration'},

                            //]
                        }]
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
            relatimeChartElement && relatimeViewChart.resize();
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

    var _setRealTimeViewChart = function () {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        // Define element
        var relatimeChartElement = document.getElementById('realtime-chart-container');

        if (relatimeChartElement) {

            // Initialize chart
            var relatimeViewChart = echarts.init(relatimeChartElement);

            $.ajax({
                type: "POST",
                // contentType: "application/json; charset=utf-8",
                url: '/Deshboard/GetTopValueMeter',
                data: {},
                //  dataType: "json",
                success: function (data) {
                    var myJSON = JSON.parse(data);

                    var datad = [];
                    var meter = [];

                    for (i = 0; i < myJSON.length; i++) {
                        var dat = myJSON[i].P
                        var met = myJSON[i].DeviceName
                        meter.push(myJSON[i].DeviceName);
                        var arr = { value: dat, name: met }
                        datad.push(arr);
                        dat = '';
                        met = '';
                    }

                    var app = {};

                    var option;

                    option = {
                        color: [
                            '#04BFDA', '#67FB6D', '#ED8888', '#FFA84A', '#FB67CA', '#9B88ED','#67FB6D'
                        ],
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            //orient: 'horizontal',
                            //top: '70%',
                            left: 'center',
                            type: 'scroll',
                            orient: 'horizontal',
                            height: '100',
                            selectedMode: 'multiple',
                        },
                        series: [
                            {
                                //name: 'Access From',
                                /*center: ['200', '100'],*/
                                center: ['50%', '60%'],
                                type: 'pie',
                                radius: '50%',
                                data: datad,
                                emphasis: {
                                    itemStyle: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };

                    if (option && typeof option === 'object') {
                        relatimeViewChart.setOption(option);
                    }
                    relatimeViewChart.resize();
                    window.addEventListener('resize', relatimeViewChart.resize);

                },
                error: function (result) {
                    HideLoading($('#columns_basic'));
                    ShowMessage('0', 'Something Went Wrong!');
                }
            });
        }
        var triggerChartResize = function () {
            relatimeChartElement && relatimeViewChart.resize();
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

    return {
        init: function () {
            //_scatterPieDonutLightExample();
            _setRealTimeViewChart();
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    EchartsPieDonutLight.init();
});