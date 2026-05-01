/*EmployeeGuestConfort Graph Start*/
/*Alert Graph Start*/
var EmpGuestDashboard = function () {
    var _echartsEmpGuestChartDashboardExt = function () {
        var dom = document.getElementById('employee-guestconfort-chart-container');
        var employeeGuestConfortChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        var option;
        employeeGuestConfortChart.showLoading();
        $.ajax({
            type: "post",
            url: "/Deshboard/DeshEmployeeGuestConfort",
            data: {},
            success: function (data) {
                employeeGuestConfortChart.hideLoading();
                var myJSON = JSON.parse(data)
                var guestComfort = parseFloat(myJSON[0].guestComfort);
                var employeeComfort = parseFloat(myJSON[0].employeeComfort);

                const gaugeData = [
                    {
                        value: employeeComfort,
                        name: 'Employee',
                        title: {
                            offsetCenter: ['-55%', '90%']
                        },
                        detail: {
                            offsetCenter: ['-55%', '115%']
                        }
                    },
                    {
                        value: guestComfort,
                        name: 'Guest',
                        title: {
                            offsetCenter: ['50%', '90%']
                        },
                        detail: {
                            offsetCenter: ['50%', '115%']
                        }
                    },
                ];
                option = {
                    series: [
                        {
                            type: 'gauge',
                            min: 0,
                            max: 100,
                            axisLabel: {
                                show: false
                                //distance: 100
                            },
                            anchor: {
                                show: true,
                                showAbove: true,
                                size: 18,
                                itemStyle: {
                                    color: '#FAC858'
                                }
                            },
                            pointer: {
                                icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                                width: 8,
                                length: '65%',
                                offsetCenter: [0, '8%']
                            },
                            progress: {
                                show: true,
                                overlap: true,
                                roundCap: true
                            },
                            axisLine: {
                                roundCap: true
                            },
                            data: gaugeData,
                            title: {
                                fontSize: 10
                            },
                            detail: {
                                width: 40,
                                height: 14,
                                fontSize: 12,
                                color: '#fff',
                                backgroundColor: 'inherit',
                                borderRadius: 3,
                                formatter: '{value}%'
                            }
                        }
                    ]
                };

                if (option && typeof option === 'object') {
                    employeeGuestConfortChart.setOption(option);
                }
                employeeGuestConfortChart.resize();
                window.addEventListener('resize', employeeGuestConfortChart.resize);
            }
        });
    };

    return {
        init: function () {
            _echartsEmpGuestChartDashboardExt();
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    EmpGuestDashboard.init();
});

/*EmployeeGuestConfort Graph End*/

$('#btnAddEmpGuestConfort').click(function () {
    $('#EmployeeGuestConfortModel').modal('show');

    //////////////////

    var dom = document.getElementById('employee-guest-confort-chart-container');
    var empGuestDetailChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });
    var app = {};
    var option;
    empGuestDetailChart.showLoading();
    $.ajax({
        type: "post",
        url: "/Deshboard/GetEmployeeGuestConfortDetailDashboard",
        data: {},
        success: function (dataSummary) {
            empGuestDetailChart.hideLoading();
            var myJSON = JSON.parse(dataSummary)
            var Device = [];
            var FirValue = [];
            var secValue = [];
            var thirdValue = [];
            var seriesData = [];

            for (i = 0; i < myJSON.length; i++) {
                Device.push(myJSON[i].deviceName);
                FirValue.push(myJSON[i].OverCooling);
                secValue.push(myJSON[i].UnderCooling);
                thirdValue.push(myJSON[i].Compliance);
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
                        name: 'Over Cooling',
                        type: 'bar',
                        stack: 'total',
                        color: "#5470c6",
                        label: {
                            show: true
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        itemStyle: dataStyle,
                        data: FirValue
                    },
                    {
                        name: 'Under Cooling',
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
                        data: secValue
                    },
                    {
                        name: 'Compliance',
                        type: 'bar',
                        stack: 'total',
                        color: '#91cc75',
                        label: {
                            show: true
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        itemStyle: dataStyle,
                        data: thirdValue
                    }
                ]
            };

            if (option && typeof option === 'object') {
                empGuestDetailChart.setOption(option);
            }
            empGuestDetailChart.resize();
            window.addEventListener('resize', empGuestDetailChart.resize);
        }
    });

    /////////////////

})