/*Alert Graph Start*/
var AlertDashboard = function () {
    var _echartsAlertChartDashboard = function () {
        var alertChart = echarts.init(document.getElementById('alert-chart-container'),
            null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        alertChart.showLoading();
        var app = {};
        var option;
        $.ajax({
            type: "post",
            url: "/Deshboard/DeshAlerts",
            data: {},
            success: function (data) {
                alertChart.hideLoading();
                var myJSON = JSON.parse(data)
                var Notifications = parseInt(myJSON[0].Notifications);
                var Deviations = parseInt(myJSON[0].Deviations);
                var Alerts = parseInt(myJSON[0].Alerts);
                option = {
                    backgroundColor: 'white',
                    title: {
                        text: '',
                        left: 'center',
                        top: 20,
                        textStyle: {
                            color: '#000'
                        }
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    visualMap: {
                        show: false,
                        min: 0,
                        max: 600,
                        inRange: {
                            colorLightness: [0, 10]
                        }
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '50%'],
                            data: [
                                { value: Notifications, name: 'Notifications' },
                                { value: Deviations, name: 'Deviations' },
                                { value: Alerts, name: 'Alerts' },
                            ].sort(function (a, b) {
                                return a.value - b.value;
                            }),
                            roseType: 'radius',
                            label: {
                                color: 'rgba(255, 255, 255, 0.3)'
                            },
                            labelLine: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                },
                                smooth: 0.2,
                                length: 10,
                                length2: 20
                            },
                            itemStyle: {
                                color: '#c23531',
                                shadowBlur: 200,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            animationType: 'scale',
                            animationEasing: 'elasticOut',
                            animationDelay: function (idx) {
                                return Math.random() * 200;
                            }
                        }
                    ]
                };


                if (option && typeof option === 'object') {
                    alertChart.setOption(option);
                }

                window.addEventListener('resize', alertChart.resize);
            }
        });
    }

    var _echartsAlertChartDashboardExt = function () {
        var alertChart = echarts.init(document.getElementById('alert-chart-container'),
            null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        alertChart.showLoading();
        var app = {};
        var option;
        $.ajax({
            type: "post",
            url: "/Deshboard/DeshAlerts",
            data: {},
            success: function (data) {
                alertChart.hideLoading();
                var myJSON = JSON.parse(data)
                var Notifications = parseInt(myJSON[0].Notifications);
                var Deviations = parseInt(myJSON[0].Deviations);
                var Alerts = parseInt(myJSON[0].Alerts);

                const gaugeData = [
                    {
                        value: Notifications,
                        name: 'Notifications',
                        title: {
                            offsetCenter: ['0%', '-30%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['0%', '-15%']
                        }
                    },
                    {
                        value: Deviations,
                        name: 'Deviations',
                        title: {
                            offsetCenter: ['0%', '0%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['0%', '15%']
                        }
                    },
                    {
                        value: Alerts,
                        name: 'Alerts',
                        color: '#ff0000',
                        title: {
                            offsetCenter: ['0%', '30%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['0%', '45%']
                        }
                    }
                ];
                option = {
                    color: [
                        '#04BFDA', '#DAC504', '#ee6666'
                    ],
                    series: [
                        {
                            type: 'gauge',
                           /* center: ['40%', '50%'],*/
                            startAngle: 90,
                            endAngle: -270,
                            min: 0,
                            max: 10,
                            pointer: {
                                show: false
                            },
                            progress: {

                                show: true,
                                overlap: false,
                                roundCap: true,
                                clip: false,
                                itemStyle: {
                                    borderWidth: 1,
                                    borderColor: '#464646'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    width: 20
                                }
                            },
                            splitLine: {
                                show: false,
                                distance: 0,
                                length: 10
                            },
                            axisTick: {
                                show: true
                            },
                            axisLabel: {
                                show: false,
                                distance: 190,
                            },
                            data: gaugeData,
                            title: {
                                fontSize: 10
                            },
                            detail: {
                                width: 20,
                                height: 6,
                                fontSize: 10,
                                color: 'inherit',
                                borderColor: 'inherit',
                                borderRadius: 10,
                                borderWidth: 1,
                                formatter: '{value}'
                            }
                        }
                    ]
                };


                if (option && typeof option === 'object') {
                    alertChart.setOption(option);
                }
                //alertChart.resize;
                alertChart.resize();
                window.addEventListener('resize', alertChart.resize);
            }
        });
    };

    return {
        init: function () {
            //_echartsAlertChartDashboard();
            _echartsAlertChartDashboardExt();
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    AlertDashboard.init();
});
/*Alert Graph End*/