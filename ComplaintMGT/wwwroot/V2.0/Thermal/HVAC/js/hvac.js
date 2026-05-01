// Data Functions
var HVACAlertDashboard = function () {
    var _echartsAlertChartDashboard = function (duration = 0) {
        var alertChart = echarts.init(document.getElementById('hvac-chart-container-alert'), null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        alertChart.showLoading();
        var option;

        $.ajax({
            type: "POST",
            url: "/Thermal/GetHVACDashboardAlerts?days=" + duration,
            data: {},
            timeout: 60000,
            success: function (data) {
                alertChart.hideLoading();

                try {
                    var myJSON = (typeof data === "string") ? JSON.parse(data) : data;
                    console.log("Parsed Data Type:", typeof myJSON);
                    console.log("First Element:", myJSON[0]);
                    if (!myJSON || myJSON.length === 0) {
                        console.warn("Alert API returned no data for duration: " + duration);
                        var Notifications = 0;
                        var Deviations = 0;
                        var Alerts = 0;
                    } else {
                        var Notifications = parseInt(myJSON[0].Notifications || 0);
                        var Deviations = parseInt(myJSON[0].Deviations || 0);
                        var Alerts = parseInt(myJSON[0].Alerts || 0);
                    }

                    const gaugeData = [
                        {
                            value: Notifications,
                            name: 'Notifications',
                            title: { offsetCenter: ['0%', '-30%'] },
                            detail: { valueAnimation: true, offsetCenter: ['0%', '-15%'] }
                        },
                        {
                            value: Deviations,
                            name: 'Deviations',
                            title: { offsetCenter: ['0%', '0%'] },
                            detail: { valueAnimation: true, offsetCenter: ['0%', '15%'] }
                        },
                        {
                            value: Alerts,
                            name: 'Alerts',
                            color: '#ff0000',
                            title: { offsetCenter: ['0%', '30%'] },
                            detail: { valueAnimation: true, offsetCenter: ['0%', '45%'] }
                        }
                    ];

                    option = {
                        color: ['#04BFDA', '#DAC504', '#ee6666'],
                        series: [
                            {
                                type: 'gauge',
                                startAngle: 90,
                                endAngle: -270,
                                min: 0,
                                max: 10, // Consider making this dynamic based on max value
                                pointer: { show: false },
                                progress: {
                                    show: true,
                                    overlap: false,
                                    roundCap: true,
                                    clip: false,
                                    itemStyle: { borderWidth: 1, borderColor: '#464646' }
                                },
                                axisLine: { lineStyle: { width: 20 } },
                                splitLine: { show: false, distance: 0, length: 10 },
                                axisTick: { show: true },
                                axisLabel: { show: false, distance: 190 },
                                data: gaugeData,
                                title: { fontSize: 10 },
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

                } catch (e) {
                    console.error("JSON Parsing error or Data structure mismatch:", e);
                    // Optional: Show "Error" on the chart
                    alertChart.setOption({
                        title: { text: "Data Error", left: "center", top: "center" }
                    });
                }

                alertChart.resize();
                window.addEventListener('resize', alertChart.resize);
            },
            error: function (xhr, status, error) {
                alertChart.hideLoading();
                console.error("API Error: ", status, error);
                console.log("Response: ", xhr.responseText);
            }
        });
    };

    return {
        init: function (duration = 0) {
            _echartsAlertChartDashboard(duration);
        }
    };
}();

var HVACComplianceDashboard = function () {
    var _echartHVACDashboardInit = function (duration = 0) {
        var complianceDetailChart = echarts.init(document.getElementById('hvac-compliance-chart-container'), null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        complianceDetailChart.showLoading();
        var option;

        $.ajax({
            type: "post",
            url: "/Thermal/GetHVACDashboardCompliance?days=" + duration,
            data: {},
            success: function (data) {
                complianceDetailChart.hideLoading();

                var myJSON = JSON.parse(data);
                var Device = [];
                var Compliance = [];
                var NonCompliance = [];

                for (var i = 0; i < myJSON.length; i++) {
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
                            type: 'shadow'
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
                        data: Device
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
                        }
                    ]
                };

                if (option && typeof option === 'object') {
                    complianceDetailChart.setOption(option);
                }
            }
        });
    };

    return {
        init: function (duration = 0) {
            _echartHVACDashboardInit(duration);
        }
    };
}();

var HVACThermalMonitoringDashboard = function () {
    var _thermalMonitoringTable = function (duration = 0) {
        var thermalMonitoringTableDiv = document.getElementById('hvac-thermal-monitoring');
        thermalMonitoringTableDiv.innerHTML = '';

        var table = document.createElement('table');
        table.className = 'table table-bordered';

        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');
        table.appendChild(thead);
        table.appendChild(tbody);

        thead.innerHTML = '<thead><tr><th scope="col"></th><th scope="col">' +
            (duration == 0 ? 'Current Day' : duration <= 30 ? 'Current Month' : 'Last 3 Months') +
            '</th></tr></thead>';

        thermalMonitoringTableDiv.appendChild(table);

        $.ajax({
            type: "post",
            url: "/Thermal/GetHVACDashboardThermalMonitoriting?days=" + duration,
            data: {},
            success: function (data) {
                var myJSON = JSON.parse(data);

                for (var i = 0; i < myJSON.length; i++) {
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
    };

    return {
        init: function (duration = 0) {
            _thermalMonitoringTable(duration);
        }
    };
}();

var HVACOpsDashboard = function () {
    var _opsDash = function (duration = 0) {
        // Ops 
        var dom3 = document.getElementById('hvac-chart-container-ops');
        var myChart3 = echarts.init(dom3, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var option3;

        // Non-Ops
        var dom4 = document.getElementById('hvac-chart-container-nonops');
        var myChart4 = echarts.init(dom4, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var option4;

        myChart3.showLoading();
        myChart4.showLoading();

        $.ajax({
            type: "post",
            url: "/Thermal/GetHVACOpsThermalMonitoring?days=" + duration,
            data: {},
            success: function (data) {
                var myJSON = JSON.parse(data);

                var opsData = [];
                var nonOpsData = [];

                for (var i = 0; i < myJSON.length; i++) {
                    if (myJSON[i]["OpsType"] == "OPS_SCHEDULE_MAX") {
                        opsData.push({
                            value: myJSON[i]["Temperature"],
                            name: myJSON[i]["AssetName"]
                        });
                    }

                    if (myJSON[i]["OpsType"] == "OPS_SCHEDULE_MIN") {
                        nonOpsData.push({
                            value: myJSON[i]["Temperature"],
                            name: myJSON[i]["AssetName"]
                        });
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
                            /* name: 'Access From', */
                            type: 'pie',
                            radius: ['40%', '80%'],
                            center: ['50%', '100%'],
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
                            /* name: 'Access From', */
                            type: 'pie',
                            radius: ['40%', '80%'],
                            center: ['50%', '100%'],
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
    };

    return {
        init: function (duration = 0) {
            _opsDash(duration);
        }
    };
}();

var HVACSeriesData = function () {
    var _seriesData = function (duration = 0) {
        var dom8 = document.getElementById('hvac-chart-container-tempmonitoring');
        var myChart8 = echarts.init(dom8, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        myChart8.showLoading();

        $.ajax({
            type: "post",
            url: "/Thermal/GetHVACThermalMonitoringSeries?days=" + duration,
            data: {},
            success: function (data) {
                var option8;
                var myJSON = JSON.parse(data);

                var devices = myJSON.map(function (o) { return o.DeviceName; });
                devices = [...new Set(devices)];

                var timeSeries = myJSON.map(function (o) { return o.LogTime; });
                timeSeries = [...new Set(timeSeries)];

                var graphData = [];

                for (var i = 0; i < devices.length; i++) {
                    graphData.push({
                        name: devices[i],
                        type: 'line',
                        data: getSeriesData(devices[i], myJSON)
                    });
                }

                console.log(graphData);

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
                            formatter: '{value} °C'
                        }
                    },
                    series: graphData
                };

                if (option8 && typeof option8 === 'object') {
                    myChart8.hideLoading();
                    myChart8.setOption(option8);
                }
            }
        });
    };

    return {
        init: function (duration = 0) {
            _seriesData(duration);
        }
    };
}();

// Helper Functions

var HotDashboardInit = function () {
    HVACAlertDashboard.init(0);
    HVACComplianceDashboard.init(0);
    HVACThermalMonitoringDashboard.init(0);
    HVACOpsDashboard.init(0);
    HVACSeriesData.init(0);
};

var WarmDashboardInit = function () {
    HVACAlertDashboard.init(30);
    HVACComplianceDashboard.init(30);
    HVACThermalMonitoringDashboard.init(30);
    HVACOpsDashboard.init(30);
    HVACSeriesData.init(30);
};

var ColdDashboardInit = function () {
    HVACAlertDashboard.init(90);
    HVACComplianceDashboard.init(90);
    HVACThermalMonitoringDashboard.init(90);
    HVACOpsDashboard.init(90);
    HVACSeriesData.init(90);
};

var getSeriesData = function (deviceName, masterData) {
    // 1. Get unique timestamps
    var timeSeries = masterData.map(function (o) { return o.LogTime; });
    timeSeries = [...new Set(timeSeries)];

    // 2. Create a fast lookup map for this device
    // Key = LogTime, Value = Temperature
    var deviceDataMap = {};
    for (var k = 0; k < masterData.length; k++) {
        if (masterData[k].DeviceName === deviceName) {
            deviceDataMap[masterData[k].LogTime] = masterData[k].Temperature;
        }
    }

    var _data = [];

    // 3. Build the array using the map (No looping through masterData repeatedly)
    for (var i = 0; i < timeSeries.length; i++) {
        var timeKey = timeSeries[i];

        if (deviceDataMap.hasOwnProperty(timeKey)) {
            _data.push(deviceDataMap[timeKey]);
        } else {
            // Gap filling logic
            if (i === 0) {
                _data.push(0);
            } else {
                _data.push(_data[i - 1]); // Carry forward previous value
            }
        }
    }

    // 4. Edge case: Zero handling (forward and backward fill)
    for (var i = 0; i < _data.length; i++) {
        // If current is 0, try to take previous
        if (_data[i] === 0 && i > 0) {
            _data[i] = _data[i - 1];
        }
    }
    // Backward pass (if the very first item was 0 and we filled it with 0)
    for (var i = _data.length - 1; i >= 0; i--) {
        if (_data[i] === 0 && i < _data.length - 1) {
            _data[i] = _data[i + 1];
        }
    }

    return _data;
};

//// Main Function
//var HVAC = function () {
//    HotDashboardInit();

//    // Actions 
//    var hotButtonAction = document.getElementById("hotDataAction");
//    var warmButtonAction = document.getElementById("warmDataAction");
//    var coldButtonAction = document.getElementById("coldDataAction");

//    hotButtonAction.addEventListener('click', function () {
//        hotButtonAction.classList.add('active');
//        warmButtonAction.classList.remove('active');
//        coldButtonAction.classList.remove('active');

//        HotDashboardInit();
//    });

//    warmButtonAction.addEventListener('click', function () {
//        warmButtonAction.classList.add('active');
//        hotButtonAction.classList.remove('active');
//        coldButtonAction.classList.remove('active');

//        WarmDashboardInit();
//    });

//    coldButtonAction.addEventListener('click', function () {
//        coldButtonAction.classList.add('active');
//        hotButtonAction.classList.remove('active');
//        warmButtonAction.classList.remove('active');

//        ColdDashboardInit();
//    });
//}();


// Helper to activate the correct tab
function activateTab(tab) {
    document.getElementById('hotDataAction').classList.remove('active');
    document.getElementById('warmDataAction').classList.remove('active');
    document.getElementById('coldDataAction').classList.remove('active');
    document.getElementById(tab + 'DataAction').classList.add('active');

    // Load dashboard for selected tab
    if (tab === 'hot') {
        HotDashboardInit();
    } else if (tab === 'warm') {
        WarmDashboardInit();
    } else if (tab === 'cold') {
        ColdDashboardInit();
    }
}

// On page load, always default to 'hot' tab
document.addEventListener('DOMContentLoaded', function () {
    activateTab('hot');
});

// On tab click, activate the selected tab
['hot', 'warm', 'cold'].forEach(function (tab) {
    document.getElementById(tab + 'DataAction').addEventListener('click', function () {
        activateTab(tab);
    });
});