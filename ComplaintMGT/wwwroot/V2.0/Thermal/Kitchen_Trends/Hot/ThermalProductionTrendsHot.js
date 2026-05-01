var ThermalTrendsDashboard = function () {
    var _echartsThermalMonitoringLiveChartDashboard = function () {

        var dom = document.getElementById('thermalMonitoringLive1');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        function randomData() {
            now = new Date(+now + oneDay);
            value = value + Math.random() * 21 - 10;
            return {
                name: now.toString(),
                value: [
                    [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                    Math.round(value)
                ]
            };
        }
        function randomData1() {
            now1 = new Date(+now1 + oneDay);
            value1 = value1 + Math.random() * 21 - 10;
            return {
                name: now1.toString(),
                value: [
                    [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
                    Math.round(value1)
                ]
            };
        }
        let data = [];
        let data1 = [];
        let now = new Date(1997, 9, 3);
        let now1 = new Date(1997, 5, 3);
        let oneDay = 24 * 3600 * 1000;
        let value = Math.random() * 1000;
        let value1 = Math.random() * 1500;
        for (var i = 0; i < 1000; i++) {
            data.push(randomData());
            data1.push(randomData1());
        }
        option = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    params = params[0];
                    var date = new Date(params.name);
                    return (
                        date.getDate() +
                        '/' +
                        (date.getMonth() + 1) +
                        '/' +
                        date.getFullYear() +
                        ' : ' +
                        params.value[1]
                    );
                },
                axisPointer: {
                    animation: false
                }
            },
            xAxis: {
                type: 'time',
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: false
                }
            },
            series: [
                {
                    name: 'Fake Data C',
                    type: 'line',
                    showSymbol: false,
                    data: data
                },
                {
                    name: 'Fake Data D',
                    type: 'line',
                    showSymbol: false,
                    data: data1
                }
            ]
        };
        setInterval(function () {
            for (var i = 0; i < 5; i++) {
                data.shift();
                data.push(randomData());
                data1.shift();
                data1.push(randomData1());
            }
            myChart.setOption({
                series: [
                    {
                        data: data
                    },
                    {
                        data: data1
                    }
                ]
            });
        }, 1000);

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', function () {
            myChart.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart.resize();
        });


    }

    var _echartsThermalMonitoringLivewithPeakTemperatureChartDashboard = function () {
        var dom = document.getElementById('thermalMonitoringLivewithPeakTemperature');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {},
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: { readOnly: false },
                    magicType: { type: ['line', 'bar'] },
                    restore: {},
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} °C'
                }
            },
            series: [
                {
                    name: 'Highest',
                    type: 'line',
                    data: [10, 11, 13, 11, 12, 12, 9],
                    markPoint: {
                        data: [
                            { type: 'max', name: 'Max' },
                            { type: 'min', name: 'Min' }
                        ]
                    },
                    markLine: {
                        data: [{ type: 'average', name: 'Avg' }]
                    }
                },
                {
                    name: 'Lowest',
                    type: 'line',
                    data: [1, -2, 2, 5, 3, 2, 0],
                    markPoint: {
                        data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: 'Avg' },
                            [
                                {
                                    symbol: 'none',
                                    x: '90%',
                                    yAxis: 'max'
                                },
                                {
                                    symbol: 'circle',
                                    label: {
                                        position: 'start',
                                        formatter: 'Max'
                                    },
                                    type: 'max',
                                    name: '最高点'
                                }
                            ]
                        ]
                    }
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', function () {
            myChart.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart.resize();
        });


    }

    var _echartsThermalMonitoring2ChartDashboard = function () {
        var dom = document.getElementById('thermalMonitoring2');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        option = {
            color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data: ['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Line 1',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgb(128, 255, 165)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(1, 191, 236)'
                            }
                        ])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: [140, 232, 101, 264, 90, 340, 250]
                },
                {
                    name: 'Line 2',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgb(0, 221, 255)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(77, 119, 255)'
                            }
                        ])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: [120, 282, 111, 234, 220, 340, 310]
                },
                {
                    name: 'Line 3',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgb(55, 162, 255)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(116, 21, 219)'
                            }
                        ])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: [320, 132, 201, 334, 190, 130, 220]
                },
                {
                    name: 'Line 4',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgb(255, 0, 135)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(135, 0, 157)'
                            }
                        ])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: [220, 402, 231, 134, 190, 230, 120]
                },
                {
                    name: 'Line 5',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    label: {
                        show: true,
                        position: 'top'
                    },
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgb(255, 191, 0)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(224, 62, 76)'
                            }
                        ])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: [220, 302, 181, 234, 210, 290, 150]
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', function () {
            myChart.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart.resize();
        });

    }

    var _echartsHrlyAvgThermalMonitoringChartDashboard = function () {
        var dom = document.getElementById('hrlyAvgThermalMonitoring');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            toolbox: {
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            legend: {
                data: ['Evaporation', 'Precipitation', 'Temperature']
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: 'Precipitation',
                    min: 0,
                    max: 250,
                    interval: 50,
                    axisLabel: {
                        formatter: '{value} ml'
                    }
                },
                {
                    type: 'value',
                    name: 'Temperature',
                    min: 0,
                    max: 25,
                    interval: 5,
                    axisLabel: {
                        formatter: '{value} °C'
                    }
                }
            ],
            series: [
                {
                    name: 'Evaporation',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value) {
                            return value + ' ml';
                        }
                    },
                    data: [
                        2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
                    ]
                },
                {
                    name: 'Precipitation',
                    type: 'bar',
                    tooltip: {
                        valueFormatter: function (value) {
                            return value + ' ml';
                        }
                    },
                    data: [
                        2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
                    ]
                },
                {
                    name: 'Temperature',
                    type: 'line',
                    yAxisIndex: 1,
                    tooltip: {
                        valueFormatter: function (value) {
                            return value + ' °C';
                        }
                    },
                    data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', function () {
            myChart.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart.resize();
        });

    }

    var _echartsThermalProfileChartDashboard = function () {
        var dom = document.getElementById('thermalProfile');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        function getVirtualData(year) {
            const date = +echarts.time.parse(year + '-01-01');
            const end = +echarts.time.parse(+year + 1 + '-01-01');
            const dayTime = 3600 * 24 * 1000;
            const data = [];
            for (let time = date; time < end; time += dayTime) {
                data.push([
                    echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
                    Math.floor(Math.random() * 10000)
                ]);
            }
            return data;
        }
        option = {
            tooltip: {},
            visualMap: {
                min: 0,
                max: 10000,
                type: 'piecewise',
                orient: 'horizontal',
                left: 'center',
                top: 65
            },
            calendar: {
                top: 120,
                left: 30,
                right: 30,
                cellSize: ['auto', 13],
                range: '2016',
                itemStyle: {
                    borderWidth: 0.5
                },
                yearLabel: { show: false }
            },
            series: {
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: getVirtualData('2016')
            }
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', function () {
            myChart.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart.resize();
        });

    }

    return {
        init: function () {
            //_echartsThermalMonitoringLiveChartDashboard();
            //_echartsThermalMonitoringLivewithPeakTemperatureChartDashboard();
            //_echartsThermalMonitoring2ChartDashboard();
            //_echartsHrlyAvgThermalMonitoringChartDashboard();
            //_echartsThermalProfileChartDashboard();
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    ThermalTrendsDashboard.init();
});





