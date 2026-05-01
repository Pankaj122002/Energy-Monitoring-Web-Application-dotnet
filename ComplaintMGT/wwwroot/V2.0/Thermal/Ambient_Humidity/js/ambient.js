

//Data Functions
var AmbientAlertDashboard = function () {
    var _echartsAlertChartDashboard = function (duration = 0) {

        var alertChart = echarts.init(document.getElementById('ambient-chart-container-alert'),
            null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        alertChart.showLoading();
        var app = {};
        var option;

        $.ajax({
            type: "post",
            url: "/Thermal/AmbientHumidityDashboardAlerts?days=" + duration,
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

    }

    return {
        init: function (duration = 0) {
            _echartsAlertChartDashboard(duration);
        }
    }
}();
var AmbientComplianceDashboard = function () {

    var _echartAmbientDashboardInit = function (duration = 0) {
        var complianceDetailChart = echarts.init(document.getElementById('ambient-compliance-chart-container'),
            null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        complianceDetailChart.showLoading();
        var app = {};
        var option;

        $.ajax({
            type: "post",
            url: "/Thermal/GetAmbientHumidityDashboardCompliance?days=" + duration,
            data: {},
            success: function (data) {

                complianceDetailChart.hideLoading();
                var myJSON = JSON.parse(data)
                var Device = [];
                var Compliance = [];
                var NonCompliance = [];
                var seriesData = [];

                for (i = 0; i < myJSON.length; i++) {
                    Device.push(myJSON[i].Device);
                    Compliance.push(myJSON[i].Compliance);
                    NonCompliance.push(myJSON[i].NonComplience);
                }

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

                option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            // Use axis to trigger tooltip
                            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                        }
                    },
                    legend: {},
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data: Device //['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                    },
                    series: [
                        {
                            name: 'Compliance',
                            type: 'bar',
                            stack: 'total',
                            color: "#91cc75",
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            itemStyle: dataStyle,
                            data: Compliance
                        },
                        {
                            name: 'Non Compliance',
                            type: 'bar',
                            stack: 'total',
                            color: '#ee6666',
                            label: {
                                show: true
                            },
                            emphasis: {
                                focus: 'series'
                            },
                            itemStyle: dataStyle,
                            data: NonCompliance
                        },
                    ]
                };

                if (option && typeof option === 'object') {
                    complianceDetailChart.setOption(option);
                }

            }
        });

    }

    return {
        init: function (duration = 0) {
            _echartAmbientDashboardInit(duration);
        }
    }
}();
var AmbientThermalMonitoringDashboard = function () {
    var _thermalMonitoringTable = function (duration =0) {

        var thermalMonitoringTableDiv = document.getElementById('ambient-thermal-monitoring');
        thermalMonitoringTableDiv.innerHTML = ''

        var table = document.createElement('table');
        table.className = 'table table-bordered';

        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');
        table.appendChild(thead);
        table.appendChild(tbody);

        thead.innerHTML = `<thead><tr><th scope="col"></th><th scope="col">${duration == 0 ? 'Current Day' : duration <= 30 ? 'Current Month' : 'Last 3 Months'}</th></tr></thead>`;

        thermalMonitoringTableDiv.appendChild(table);

        $.ajax({
            type: "post",
            url: "/Thermal/AmbientHumidityMonitoring?days=" + duration,
            data: {},
            success: function (data) {
                var myJSON = JSON.parse(data);

                for (i = 0; i < myJSON.length; i++) {

                    var tr = document.createElement('tr');
                    var td1 = document.createElement('td');
                    var td2 = document.createElement('td');

                    td1.className = 'r-header';
                    td1.innerText = myJSON[i].DeviceName ? myJSON[i].DeviceName : "";

                    td2.innerText = myJSON[i].Temperature ? myJSON[i].Temperature : "";

                    tr.appendChild(td1);
                    tr.appendChild(td2);

                    tbody.appendChild(tr);
                }
            }
        });
    }

    return {
        init: function (duration  = 0) {
            _thermalMonitoringTable(duration);
        }
    }
}();
var AmbientOpsDashboard = function () {
    var _opsDash = function (duration = 0) {

        // Ops 
        var dom3 = document.getElementById('ambient-chart-container-ops');
        var myChart3 = echarts.init(dom3, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option3;


        // Non-Ops
        var dom4 = document.getElementById('ambient-chart-container-nonops');
        var myChart4 = echarts.init(dom4, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option4;

        myChart3.showLoading();
        myChart4.showLoading();

        $.ajax({
            type: "post",
            url: "/Thermal/GetAmbientHumidityMonitoringOpsInfo?days=" + duration,
            data: {},
            success: function (data) {

                var myJSON = JSON.parse(data);

                var opsData = [];
                var nonOpsData = [];

                for (var i = 0; i < myJSON.length; i++) {
                    if (myJSON[i]["OpsType"] == "OPS_SCHEDULE_MAX") {
                        opsData.push({ value: myJSON[i]["Temperature"], name: myJSON[i]["AssetName"] })
                    }

                    if (myJSON[i]["OpsType"] == "OPS_SCHEDULE_MIN") {
                        nonOpsData.push({ value: myJSON[i]["Temperature"], name: myJSON[i]["AssetName"] })
                    }
                }

                option3 = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        left: 'center'
                    },
                    series: [
                        {
                            /*name: 'Access From',*/
                            type: 'pie',
                            radius: ['40%', '80%'],
                            center: ['50%', '100%'],
                            // adjust the start and end angle
                            startAngle: 180,
                            endAngle: 360,
                            data: opsData
                        }
                    ]
                };

                if (option3 && typeof option3 === 'object') {
                    myChart3.hideLoading();
                    myChart3.setOption(option3);
                }

                // Non-ops

                option4 = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        left: 'center'
                    },
                    series: [
                        {
                            /*name: 'Access From',*/
                            type: 'pie',
                            radius: ['40%', '80%'],
                            center: ['50%', '100%'],
                            // adjust the start and end angle
                            startAngle: 180,
                            endAngle: 360,
                            data: nonOpsData
                        }
                    ]
                };

                if (option4 && typeof option4 === 'object') {
                    myChart4.hideLoading();
                    myChart4.setOption(option4);
                }

            }
        });

    }

    return {
        init: function (duration = 0) {
            _opsDash(duration);
        }
    }
}();
var AmbientSeriesData = function () {
    var _seriesData = function (duration = 0) {

        var dom8 = document.getElementById('ambient-chart-container-tempmonitoring');
        var myChart8 = echarts.init(dom8, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        myChart8.showLoading();
        $.ajax({
            type: "post",
            url: "/Thermal/AmbientHumidityMonitoringSeries?days=" + duration,
            data: {},
            success: function (data) {
                let option8;
                var myJSON = JSON.parse(data);

                var devices = myJSON.map(o => o.DeviceName)
                devices = [...new Set(devices)]

                var timeSeries = myJSON.map(o => o.LogTime)
                timeSeries = [...new Set(timeSeries)]

                let graphData = [];

                for (let i = 0; i < devices.length; i++) {
                    graphData.push(
                        {
                            name: devices[i],
                            type: 'line',
                            data: getSeriesData(devices[i], myJSON),
                            //markPoint: {
                            //    data: [
                            //        { type: 'max', name: 'Max' },
                            //        { type: 'min', name: 'Min' }
                            //    ]
                            //},
                            //markLine: {
                            //    data: [{ type: 'average', name: 'Avg' }]
                            //}
                        }
                    )
                }

                console.log(graphData)

                option8 = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: 'bottom'
                    },
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
                            formatter: '{value} g.m-3'
                        }
                    },
                    series: graphData
                };

                if (option8 && typeof option8 === 'object') {
                    myChart8.hideLoading();
                    myChart8.setOption(option8);
                }


            }
        })
    }

    return {
        init: function (duration = 0) {
            _seriesData(duration);
        }
    }
}();

// Helper Functions

var HotDashboardInit = function () {
    AmbientAlertDashboard.init(0);
    AmbientComplianceDashboard.init(0);
    AmbientThermalMonitoringDashboard.init(0);
    AmbientOpsDashboard.init(0);
    AmbientSeriesData.init(0);
}

var WarmDashboardInit = function () {
    AmbientAlertDashboard.init(30);
    AmbientComplianceDashboard.init(30);
    AmbientThermalMonitoringDashboard.init(30);
    AmbientOpsDashboard.init(30);
    AmbientSeriesData.init(30);
}

var ColdDashboardInit = function () {
    AmbientAlertDashboard.init(90);
    AmbientComplianceDashboard.init(90);
    AmbientThermalMonitoringDashboard.init(90);
    AmbientOpsDashboard.init(90);
    AmbientSeriesData.init(90);
}

var getSeriesData = function (deviceName, masterData) {


    var timeSeries = masterData.map(o => o.LogTime)
    timeSeries = [...new Set(timeSeries)]

    let _data = []

    for (let i = 0; i < timeSeries.length; i++) {

        let seriesData = masterData.filter(o => o.DeviceName == deviceName && o.LogTime == timeSeries[i]);

        if (seriesData && seriesData[0]) {
            _data.push(seriesData[0].Temperature)
        } else {
            if (i == 0)
                _data.push(0)
            else
                _data.push(_data[i - 1]);
        }
    }

    for (let i = 0; i < _data.length; i++) {

        if (i == (_data.length - 1) && _data[i] == 0)
            _data[i] = _data[i - 1];

        else if (_data[i] == 0)
            _data[i] = _data[i + 1];
    }

    return _data;

}




//Main Function
var Ambient = function () {

    HotDashboardInit();

    //Actions 
    let hotButtonAction = document.getElementById("hotDataAction");
    let warmButtonAction = document.getElementById("warmDataAction");
    let coldButtonAction = document.getElementById("coldDataAction");

    hotButtonAction.addEventListener('click', () => {

        hotButtonAction.classList.add('active');
        warmButtonAction.classList.remove('active');
        coldButtonAction.classList.remove('active');

        HotDashboardInit();
    });

    warmButtonAction.addEventListener('click', () => {

        warmButtonAction.classList.add('active');
        hotButtonAction.classList.remove('active');
        coldButtonAction.classList.remove('active');

        WarmDashboardInit();
    });

    coldButtonAction.addEventListener('click', () => {

        coldButtonAction.classList.add('active');
        hotButtonAction.classList.remove('active');
        warmButtonAction.classList.remove('active');

        ColdDashboardInit();
    });

}();