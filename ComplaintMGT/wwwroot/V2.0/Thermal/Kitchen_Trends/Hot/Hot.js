var seriesIntervale = null;
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
var KitchenAssetSeriesDataHotByAssetId = function (assetid) {
    var dom8 = document.getElementById('thermalMonitoringLivewithPeakTemperature_hot');
    //dom8.innerHTML = '';
    console.log(assetid);

    var myChart8 = echarts.init(dom8, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var app = {};

    myChart8.showLoading();
    $.ajax({
        type: "post",
        url: "/Thermal/GetHotThermalMonitoringSeries?assetid=" + assetid,
        data: {},
        success: function (data) {
            let option8;
            var myJSON = JSON.parse(data);

            var devices = myJSON.map(o => o.DeviceName)
            devices = [...new Set(devices)]

            var timeSeries = myJSON.map(o => o.LogTime)
            let seriesData = myJSON.map(o => o.Temperature);

            let graphData = [{
                name: devices[0],
                type: 'line',
                data: seriesData,
                markPoint: {
                    data: [
                        { type: 'max', name: 'Max' },
                        { type: 'min', name: 'Min' }
                    ]
                },
                //markLine: {
                //    data: [{ name: 'dfgkjv', yAxis: 9 }, { name: 'dfgkjv', yAxis: 6 }],
                //}
            }]

            console.log(devices, timeSeries, graphData)

            option8 = {
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
                    data: timeSeries
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} °C'
                    }
                },
                series: graphData
            };

            $.ajax({
                type: "post",
                url: "/Thermal/ThermalMonitoringAssetRules?assetid=" + assetid,
                data: {},
                success: function (data) {

                    let myJson = JSON.parse(data);
                    let ucl = myJson[0].UCL;
                    let lcl = myJson[0].LCL;

                    console.log(lcl, ucl)
                    myChart8.setOption({
                        series: [
                            {
                                markLine: {
                                    data: [{ name: 'LCL', yAxis: lcl }, { name: 'UCL', yAxis: ucl }]
                                }
                            }
                        ]
                    });


                }
            });

            if (option8 && typeof option8 === 'object') {
                myChart8.hideLoading();
                myChart8.setOption(option8);
            }


        }
    })
};
var GetDashboardAssetLists = function () {

    var AssetLists = function () {

        $.ajax({
            type: "post",
            url: "/Thermal/GetKitchenThermalAssets",
            data: {},
            success: function (data) {

                var assetLis = JSON.parse(data);
                console.log(assetLis)

                var asstNavOuter = document.getElementById("flowBoxes");

                for (let i = 0; i < assetLis.length; i++) {

                    let aNav = document.createElement("div");
                    aNav.id = `kitchen-${assetLis[i].AssetId}`;
                    aNav.innerText = assetLis[i].Name;
                    aNav.style = "white-space: nowrap; cursor: pointer"

                    if (i == 0) {
                        aNav.className = "right active";
                        KitchenAssetSeriesDataHotByAssetId(assetLis[i].AssetId)
                        _echartsHrlyAvgThermalMonitoringChartDashboard(assetLis[i].AssetId)
                        _echartsThermalProfileChartDashboard(assetLis[i].AssetId)
                        _echartsThermalMonitoringChartDashboard(assetLis[i].AssetId)

                    }
                    else if (i + 1 == assetLis.length)
                        aNav.className = "left";
                    else
                        aNav.className = "left right";

                    aNav.onclick = function () {

                        aNav.classList.add('active');
                        for (let j = 0; j < assetLis.length; j++) {
                            let _nav = document.getElementById(`kitchen-${assetLis[j].AssetId}`)
                            if (j != i)
                                _nav.classList.remove('active')
                        }
                        KitchenAssetSeriesDataHotByAssetId(assetLis[i].AssetId);
                        _echartsHrlyAvgThermalMonitoringChartDashboard(assetLis[i].AssetId)
                        _echartsThermalProfileChartDashboard(assetLis[i].AssetId)
                        _echartsThermalMonitoringChartDashboard(assetLis[i].AssetId)
                    };

                    asstNavOuter.appendChild(aNav);
                }

            }
        });

    }



    return {
        init: function () {
            AssetLists();
        }
    }
}();
var _echartsThermalMonitoring2ChartDashboard = function () {
    var dom = document.getElementById('thermalMonitoring2');
    var myChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var app = {};

    myChart.showLoading();
    $.ajax({
        type: "post",
        url: "/Thermal/ConsolidatedThermalMonitoringKitchenAssetHot",
        data: {},
        success: function (data) {

            myChart.hideLoading();

            var myJSON = JSON.parse(data);
            console.log(myJSON)

            var devices = myJSON.map(o => o.DeviceName)
            devices = [...new Set(devices)]

            var time = myJSON.map(o => ('0' + o.TransactionHour).slice(-2) + ":00 " + "Hrs")
            time = [...new Set(time)]

            var seriesData = [];

            var legendColor = []

            for (let i = 0; i < devices.length; i++) {

                let _color = getRandomColor();
                legendColor.push(_color);

                let _seriedData = myJSON.filter(o => o.DeviceName === devices[i]).map(o => o.Temperature);

                let _data = {
                    name: devices[i],
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
                                color: _color
                            },
                            {
                                offset: 1,
                                color: getRandomColor()
                            }
                        ])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: _seriedData
                }

                seriesData.push(_data);

            }

            var option;

            option = {
                color: legendColor,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {},
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
                        data: time
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: seriesData
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
    });

}

var _echartsHrlyAvgThermalMonitoringChartDashboard = function (assetid) {
    var dom = document.getElementById('hrlyAvgThermalMonitoring');
    var myChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var app = {};



    $.ajax({
        type: "post",
        url: "/Thermal/GetHotThermalMonitoringSeries?assetid=" + assetid,
        data: {},
        success: function (data) {

            let energyData = [];
            var option;
            var myJSON = JSON.parse(data);

            var devices = myJSON.map(o => o.DeviceName)
            devices = [...new Set(devices)]

            var timeSeries = myJSON.map(o => o.LogTime)
            let seriesData = myJSON.map(o => o.Temperature);

            let graphData = []


            $.ajax({
                type: "post",
                url: "/Thermal/EnergyConsumptionHot",
                data: {},
                success: function (resp) {

                    let jsonObj = JSON.parse(resp);
                    energyData = jsonObj.map(o => +o.KWH)
                    console.log(energyData);

                   myChart.setOption({
                        series: [
                            {
                                name: 'Temperature',
                                 type: 'line',
                                //yAxisIndex: 1,
                                tooltip: {
                                    valueFormatter: function (value) {
                                        return value + ' °C';
                                    }
                                },
                                data: seriesData
                            },
                            {
                                name: 'Energy Consumption',
                                type: 'bar',
                                tooltip: {
                                    valueFormatter: function (value) {
                                        return value + ' kwh';
                                    }
                                },
                                data: energyData
                            },
                        ]
                    });

                }
            })


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

                },
                xAxis: [
                    {
                        type: 'category',
                        data: timeSeries,
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [

                    {
                        type: 'value',
                        name: 'Temperature',
                        interval: 5,
                        axisLabel: {
                            formatter: '{value} °C'
                        }
                    }
                ],
                series: graphData

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
    })





}
var _echartsThermalProfileChartDashboard = function (assetid) {
    var dom = document.getElementById('thermalProfile');
    var myChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var app = {};

    var option;


    $.ajax({
        type: "post",
        url: "/Thermal/ThermalMonitoringHeatMapHot?assetid=" + assetid,
        data: {},
        success: function (respData) {

            var myJSON = JSON.parse(respData);

            var _hours = myJSON.map(o => ('0' + o.TransactionHour).slice(-2) + ':00 Hrs');

            const hours = [...new Set(_hours)]

            const days = [
                'Today'
            ];

            const _chartData = myJSON.map((o, i) => ([0, i, +o.Temperature.toFixed(2)]))
            const chartData = _chartData.map(function (item) {
                return [item[1], item[0], item[2] || '-'];
            });


            option = {
                tooltip: {
                    position: 'top'
                },
                grid: {
                    height: '50%',
                    top: '10%'
                },
                visualMap: {
                    inRange: {
                        color: ['#5291FF', '#bf444c']
                    },
                },
                xAxis: {
                    type: 'category',
                    data: hours,
                    splitArea: {
                        show: true
                    }
                },
                yAxis: {
                    type: 'category',
                    data: days,
                    splitArea: {
                        show: true
                    }
                },
                visualMap: {
                    min: -10,
                    max: 10,
                    calculable: true,
                    orient: 'horizontal',
                    left: 'center',
                    bottom: '15%'
                },
                series: [
                    {
                        name: 'Punch Card',
                        type: 'heatmap',
                        data: chartData,
                        label: {
                            show: true
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
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
    });







}
var _echartsThermalMonitoringChartDashboard = function (assetid) {

    if (seriesIntervale) {
        console.log(seriesIntervale)
        clearInterval(seriesIntervale)
    }

    var dom = document.getElementById('thermalMonitoringLive1');
    var myChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var app = {};

    var option;

    let seriesData = [];
    let timeSeries = [];

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
            data: timeSeries
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} °C'
            }
        },
        series: [{
            name: "loading",
            type: 'line',
            data: seriesData
        }]

    };

    seriesIntervale = setInterval(function () {

        $.ajax({
            type: "post",
            url: "/Thermal/GetHotThermalMonitoringSeries?assetid=" + assetid,
            data: {},
            success: function (response) {

                var myJSON = JSON.parse(response);

                var devices = myJSON.map(o => o.DeviceName)
                devices = [...new Set(devices)]

                let _respData = [];
                let _timeData = [];

                _timeData = myJSON.map(o => o.LogTime)
                _respData = myJSON.map(o => o.Temperature);

             
                myChart.setOption({
                    xAxis: {
                        data: _timeData
                    },
                    series: [
                        {
                            name: devices[0],
                            type: 'line',
                            data: _respData
                        }
                    ]
                });

            }
        });

    }, 2000);

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

document.addEventListener('DOMContentLoaded', function () {
    GetDashboardAssetLists.init();
    _echartsThermalMonitoring2ChartDashboard();
});








