
document.querySelector(".calender-button").addEventListener("click", function () {
    const rightBar = document.querySelector(".quick-links");
    rightBar.style.display = "block";
    var box = document.querySelector('.main-box');
    if (rightBar.style.display = "block") {
        rightBar.style.zIndex = '1000';
        box.style.zIndex = '999';
        box.style.opacity = '.2';
    }
});

document.querySelector(".X").addEventListener("click", function () {
    const rightBar = document.querySelector(".quick-links");
    rightBar.style.display = "none";
    var box = document.querySelector('.main-box');
    if (rightBar.style.display = "none") {
        rightBar.style.zIndex = '0';
        box.style.zIndex = '0';
        box.style.opacity = '1';
    }
});

document.getElementById("Relative-tab").addEventListener("click", function () {
    const page1 = document.querySelector(".text-1");
    const page2 = document.querySelector(".text-2");

    page1.style.display = "block";
    page2.style.display = "none";
});

document.getElementById("fixed-tab").addEventListener("click", function () {
    const page1 = document.querySelector(".text-1");
    const page2 = document.querySelector(".text-2");

    page1.style.display = "none";
    page2.style.display = "block";
});


document.querySelector(".filter-button").addEventListener("click", function () {
    const rightBar = document.querySelector(".filter-box");
    rightBar.style.display = "block";
    var box = document.querySelector('.main-box');
    if (rightBar.style.display = "block") {
        rightBar.style.zIndex = '1000';
        box.style.zIndex = '999';
        box.style.opacity = '.2';
    }
});

document.querySelector(".X1").addEventListener("click", function () {
    const rightBar = document.querySelector(".filter-box");
    rightBar.style.display = "none";
    var box = document.querySelector('.main-box');
    {
        rightBar.style.zIndex = '0';
        box.style.zIndex = '0';
        box.style.opacity = '1';
    }
});

document.getElementById("home-tab").addEventListener("click", function () {
    const page1 = document.querySelector(".page1");
    const page2 = document.querySelector(".page2");
    const page3 = document.querySelector(".page3");
    const page4 = document.querySelector(".page4");
    page1.style.display = "block";
    page2.style.display = "none";
    page3.style.display = "none";
    page4.style.display = "none";
});

document.getElementById("profile-tab").addEventListener("click", function () {
    const page1 = document.querySelector(".page1");
    const page2 = document.querySelector(".page2");
    const page3 = document.querySelector(".page3");
    const page4 = document.querySelector(".page4");
    page1.style.display = "none";
    page2.style.display = "block";
    page3.style.display = "none";
    page4.style.display = "none";
});

document.getElementById("contact-tab").addEventListener("click", function () {
    const page1 = document.querySelector(".page1");
    const page2 = document.querySelector(".page2");
    const page3 = document.querySelector(".page3");
    const page4 = document.querySelector(".page4");
    page1.style.display = "none";
    page2.style.display = "none";
    page3.style.display = "block";
    page4.style.display = "none";
});

document.getElementById("ops-tab").addEventListener("click", function () {
    const page1 = document.querySelector(".page1");
    const page2 = document.querySelector(".page2");
    const page3 = document.querySelector(".page3");
    const page4 = document.querySelector(".page4");
    page1.style.display = "none";
    page2.style.display = "none";
    page3.style.display = "none";
    page4.style.display = "block";
});

//mobiscroll.datepicker('#calendar', {
//    controls: ['calendar'],
//    display: 'inline'
//});


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

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
                        _echartsThermalMonitoringLivewithPeakTemperatureChartDashboard(assetLis[i].AssetId)
                        _echartsThermalMonitoring2ChartDashboard();
                        _echartsDailyAvgThermalMonitoringChartDashboard(assetLis[i].AssetId);
                        _echartsThermalProfileChartDashboard(assetLis[i].AssetId);
                        //_echartsThermalMonitoringChartDashboard(assetLis[i].AssetId)

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
                        _echartsThermalMonitoringLivewithPeakTemperatureChartDashboard(assetLis[i].AssetId)
                        _echartsThermalMonitoring2ChartDashboard();
                        _echartsDailyAvgThermalMonitoringChartDashboard(assetLis[i].AssetId);
                        _echartsThermalProfileChartDashboard(assetLis[i].AssetId);
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
var _echartsThermalMonitoringLivewithPeakTemperatureChartDashboard = function (assetid) {

    /*
    var dom = document.getElementById('thermalMonitoringNonLivewithPeakTemperature');
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
    */

    var dom8 = document.getElementById('thermalMonitoringNonLivewithPeakTemperature');
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
        url: "/Thermal/GetColdThermalMonitoringSeries?assetid=" + assetid,
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

}
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
        url: "/Thermal/ConsolidatedThermalMonitoringKitchenAssetWarm",
        data: {},
        success: function (data) {

            myChart.hideLoading();

            var myJSON = JSON.parse(data);
            console.log(myJSON)

            var devices = myJSON.map(o => o.DeviceName)
            devices = [...new Set(devices)]

            var time = myJSON.map(o => o.LogTime)
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
var _echartsDailyAvgThermalMonitoringChartDashboard = function (assetid) {
    var dom = document.getElementById('DailyAvgThermalMonitoring');
    var myChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var app = {};

    $.ajax({
        type: "post",
        url: "/Thermal/GetColdThermalMonitoringSeries?assetid=" + assetid,
        data: {},
        success: function (data) {
            var option;
            var myJSON = JSON.parse(data);

            var devices = myJSON.map(o => o.DeviceName)
            devices = [...new Set(devices)]

            var timeSeries = myJSON.map(o => o.LogTime)
            let seriesData = myJSON.map(o => o.Temperature);

            let energyData = [];

            let graphData = []

            $.ajax({
                type: "post",
                url: "/Thermal/EnergyConsumptionCold",
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

            console.log(devices, timeSeries, graphData)

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
        url: "/Thermal/ThermalMonitoringHeatMapCold?assetid=" + assetid,
        data: {},
        success: function (respData) {

            var myJSON = JSON.parse(respData);

            console.log(myJSON)

            var date = new Date(), y = date.getFullYear(), m = date.getMonth();
            var firstDay = new Date(y, m-2, 1);
            var lastDay = new Date(y, m + 1, 0);

            let data = []
            for (let i = 0; i < myJSON.length; i++) {

                let echartTime = +echarts.time.parse(myJSON[i].TransactionDate)
                data.push([
                    echarts.time.format(echartTime, '{yyyy}-{MM}-{dd}', false),
                    +myJSON[i].Temperature.toFixed(2)
                ]);
            }

            option = {
                tooltip: {},
                visualMap: {
                    min: 0,
                    max: 40,
                    calculable: true,
                    orient: 'horizontal',
                    left: 'center',
                    bottom: '15%'
                },
                grid: {
                    height: '50%',
                    top: '10%'
                },
                calendar: {
                    top: 120,
                    left: 30,
                    right: 30,
                    cellSize: ['auto', 13],
                    itemStyle: {
                        borderWidth: 0.5
                    },
                    yearLabel: { show: true },
                    range: [firstDay, lastDay]
                },
                series: {
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    data: data
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
    });
}


document.addEventListener('DOMContentLoaded', function () {
    GetDashboardAssetLists.init();
});


