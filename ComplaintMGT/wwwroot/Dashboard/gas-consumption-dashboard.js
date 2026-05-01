var GasConsumptionDashboard = function () {
    var _echartsGasConsumptionChartDashboard = function () {
        var dom = document.getElementById('gas-consumption-chart-container');
        var gasconsumptionChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        gasconsumptionChart.showLoading();
        $.ajax({
            type: "post",
            url: "/Deshboard/GetGasConsumption",
            data: {},
            success: function (data) {
                gasconsumptionChart.hideLoading();
                var myJSON = JSON.parse(data)
                option = {
                    series: [
                        {
                            type: 'gauge',
                            startAngle: 180,
                            endAngle: 0,
                            center: ['50%', '60%'],
                            radius: '90%',
                            min: 0,
                            max: 20,
                            splitNumber: 5,
                            axisLine: {
                                lineStyle: {
                                    width: 6,
                                    color: [
                                        [.25, '#FF6E76'],
                                        [.5, '#FDDD60'],
                                        [.75, '#58D9F9'],
                                        [1, '#7CFFB2']
                                    ]
                                }
                            },
                            pointer: {
                                icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                                length: '6%',
                                width: 10,
                                offsetCenter: [0, '-60%'],
                                itemStyle: {
                                    color: 'auto'
                                }
                            },
                            axisTick: {
                                length: 6,
                                lineStyle: {
                                    color: 'auto',
                                    width: 2
                                }
                            },
                            splitLine: {
                                length: 10,
                                lineStyle: {
                                    color: 'auto',
                                    width: 5
                                }
                            },
                            axisLabel: {
                                color: '#464646',
                                fontSize: 12,
                                distance: -30,
                                rotate: 'tangential',
                                formatter: function (value) {
                                    if (value == 4) {
                                        return '0-5';
                                    } else if (value == 8) {
                                        return '5-10';
                                    } else if (value == 12) {
                                        return '10-15';
                                    } else if (value == 16) {
                                        return '15-19.2';
                                    }
                                    return '';
                                }
                            },
                            title: {
                                offsetCenter: [0, '-10%'],
                                fontSize: 20
                            },
                            detail: {
                                fontSize: 12,
                                offsetCenter: [0, '-35%'],
                                valueAnimation: true,
                                formatter: function (value) {
                                    //return Math.round(value * 100) + '';
                                    return value;
                                },
                                color: 'inherit'
                            },
                            data: [
                                {
                                    value: myJSON[0]?.gasConsume,
                                    //name: 'Grade Rating'
                                }
                            ]
                        }
                    ]
                };

                if (option && typeof option === 'object') {
                    gasconsumptionChart.setOption(option);
                }
                gasconsumptionChart.resize();
                window.addEventListener('resize', gasconsumptionChart.resize);


            }
        });
    };

    return {
        init: function () {
            _echartsGasConsumptionChartDashboard();
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    GasConsumptionDashboard.init();
});

$('#btnAddGasConsumption').click(function () {
    $('#TimeofDayGasConsumptionModal').modal('show');
    $.ajax({
        type: "post",
        url: "/Deshboard/GetGasConsumptionTimeOfDay",
        data: {},
        datatype: "json",
        //traditional: true,
        success: function (data) {
            var myJSON = JSON.parse(data);
            if (myJSON.length > 0) {
                //fill detail modal table
                $("#modelGCOpsWindow").empty();
                $("#modelGCNonOps").empty();
                $("#modelGCPreviousDayNoOps").empty();
                $("#modelGCCrew").empty();
                $("#modelGCPreLunch").empty();
                $("#modelGCPeakLunch").empty();
                $("#modelGCPostLunch").empty();

                $("#modelGCPreDinner").empty();
                $("#modelGCPeakDinner").empty();
                $("#modelGCCrewShutdown").empty();
                $("#modelGCNoOperations").empty();

                $("#modelGCOpsWindow").text(myJSON.find(x => x.SiteOperationWindow == "Ops Window").Value);
                $("#modelGCNonOps").text(myJSON.find(x => x.SiteOperationWindow == "Current Day No Ops").Value);
                $("#modelGCPreviousDayNoOps").text(myJSON.find(x => x.SiteOperationWindow == "Previous Day No Ops").Value);
                $("#modelGCCrew").append(myJSON.find(x => x.SiteOperationWindow == "Store Setup").Value);
                $("#modelGCPreLunch").append(myJSON.find(x => x.SiteOperationWindow == "Pre Lunch").Value);
                $("#modelGCPeakLunch").append(myJSON.find(x => x.SiteOperationWindow == "Peak Lunch").Value);
                $("#modelGCPostLunch").append(myJSON.find(x => x.SiteOperationWindow == "Post Lunch").Value);

                $("#modelGCPreDinner").append(myJSON.find(x => x.SiteOperationWindow == "Pre Dinner").Value);
                $("#modelGCPeakDinner").append(myJSON.find(x => x.SiteOperationWindow == "Peak Dinner").Value);
                $("#modelGCCrewShutdown").append(myJSON.find(x => x.SiteOperationWindow == "Store Shutdown").Value);
                $("#modelGCNoOperations").append(myJSON.find(x => x.SiteOperationWindow == "Peak Dinner").Value);
            }

        }
    });
})