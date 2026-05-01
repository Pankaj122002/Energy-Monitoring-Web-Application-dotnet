var EnergyDistributionDashboard = function () {
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

        col = '#000000';
        textStyleCol = '#000000';
    }

    var _echartsEnergyDistributionChartDashboard = function () {
        var dom = document.getElementById('energy-distribution-chart-container');
        var energyDistributionChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        energyDistributionChart.showLoading();
        var app = {};
        var option;
        $.ajax({
            type: "post",
            url: "/Deshboard/GetEnergyDistributionDashboard",
            data: {},
            success: function (data) {
                energyDistributionChart.hideLoading();
                var myJSON = JSON.parse(data)

                var datad = [];
                for (i = 0; i < myJSON.length; i++) {
                    var dat = myJSON[i].energyConsume
                    var met = myJSON[i].DeviceName
                    var arr = { value: dat, name: met }
                    datad.push(arr);
                    dat = '';
                    met = '';
                }

                option = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        //orient: 'vertical',
                        //top: '15%',
                        //left: 'left'
                        left: 'center',
                        type: 'scroll',
                        orient: 'horizontal',
                        height: '100',
                        selectedMode: 'multiple',
                    },
                    series: [
                        {
                            //name: 'Access From',
                            center: ['50%', '60%'],
                            type: 'pie',
                            radius: ['40%', '70%'],
                            avoidLabelOverlap: false,
                            padAngle: 5,
                            itemStyle: {
                                borderRadius: 10
                            },
                            label: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                label: {
                                    show: false,
                                    fontSize: 12,
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data: datad
                        }
                    ]
                };

                if (option && typeof option === 'object') {
                    energyDistributionChart.setOption(option);
                }

                window.addEventListener('resize', energyDistributionChart.resize);
            }
        });
    }

    var _echartsEnergyDistributionPieChartDashboard = function () {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        // Define element
        var energyDistributionChartElement = document.getElementById('energy-distribution-chart-container');

        if (energyDistributionChartElement) {
            // Initialize chart
            var energyDistributionChart = echarts.init(energyDistributionChartElement);
            energyDistributionChart.showLoading();
            $.ajax({
                type: "POST",
                // contentType: "application/json; charset=utf-8",
                url: '/Deshboard/GetEnergyDistributionDashboard',
                data: {},
                //  dataType: "json",
                success: function (data) {
                    energyDistributionChart.hideLoading();
                    var myJSON = JSON.parse(data);

                    var datad = [];
                    var meter = [];

                    for (i = 0; i < myJSON.length; i++) {
                        var dat = myJSON[i].energyConsume?.toFixed(2)
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
                            '#04BFDA', '#CC22EE', '#ED8888', '#FFA84A', '#FB67CA', '#9B88ED', '#67FB6D'
                        ],
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            //orient: 'horizontal',
                            //top: '82%',
                            ////left:'-1%'
                            left: 'center',
                            type: 'scroll',
                            orient: 'horizontal',
                            height: '100',
                            selectedMode: 'multiple',
                        },
                        series: [
                            {
                                //name: 'Access From',
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
                        energyDistributionChart.setOption(option);
                    }
                    energyDistributionChart.resize();
                    window.addEventListener('resize', energyDistributionChart.resize);

                },
                error: function (result) {
                    HideLoading($('#columns_basic'));
                    ShowMessage('0', 'Something Went Wrong!');
                }
            });
        }

        var triggerChartResize = function () {
            energyDistributionChartElement && energyDistributionChart.resize();
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
            //_echartsEnergyDistributionChartDashboard();
            _echartsEnergyDistributionPieChartDashboard();
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    EnergyDistributionDashboard.init();
});