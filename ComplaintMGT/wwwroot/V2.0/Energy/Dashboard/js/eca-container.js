/* CHART 1 */
var EnergyConsumptionBarGraphDashboard = function () {
    var _echartsEnergyConsumptionBarChartActualDashboard = function (TimeCategory) {
        var dom_ecaA = document.getElementById('eca-kwh-kvah-chart-container');
        var myChart_ecaA = echarts.init(dom_ecaA, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        myChart_ecaA.showLoading();

        $.ajax({
            type: "post",
            url: "/Energy/GetEnergyConsumptionActual_Dashboard?TimeCategory=" + TimeCategory,
            data: {},
            success: function (data) {
                myChart_ecaA.hideLoading();
                var myJSON = JSON.parse(data)
                //var Notifications = parseInt(myJSON[0].Notifications);
                //var Deviations = parseInt(myJSON[0].Deviations);
                //var Alerts = parseInt(myJSON[0].Alerts);

                var option_ecaA;
                var series = [];
                var optionData = [];
                if (TimeCategory == 'Hot') {
                    optionData = ['Previous Hour', 'Today'];

                    series = [
                        {
                            data: [myJSON[0].PreviousHRKWH, myJSON[0].TodayKWH], //[Previous Hour KWH,Today KWH]
                            type: 'bar',
                            stack: 'a',
                            name: 'KWH',
                            label: {
                                show: true
                            }
                        },
                        {
                            data: [myJSON[0].PreviousHRKVAH, myJSON[0].TodayKVAH], //[Previous Hour KVAH,Today KVAH]
                            type: 'bar',
                            stack: 'b',
                            name: 'KVAH',
                            label: {
                                show: true
                            }
                        },
                    ];
                }
                else if (TimeCategory == 'Warm') {
                    optionData = ['Yesterday', 'Curr Week', 'Prev Week', 'Curr Month'];

                    series = [
                        {
                            data: [myJSON[0].YesterdayKWH, myJSON[0].CurrentWeekKWH, myJSON[0].PreviousWeekKWH, myJSON[0].CurrentMonthKWH], //[Previous Hour KWH,Today KWH]
                            type: 'bar',
                            stack: 'a',
                            name: 'KWH',
                            label: {
                                show: true
                            }
                        },
                        {
                            data: [myJSON[0].YesterdayKVAH, myJSON[0].CurrentWeekKVAH, myJSON[0].PreviousWeekKVAH, myJSON[0].CurrentMonthKVAH], //[Previous Hour KVAH,Today KVAH]
                            type: 'bar',
                            stack: 'b',
                            name: 'KVAH',
                            label: {
                                show: true
                            }
                        },
                    ];
                }
                else if (TimeCategory == 'Cold') {
                    //Month	    Year	KWH	    KVAH
                    //December	2023	0.00	0.00
                    //January	2024	0.00	0.00
                    //February	2024	4500.50	4746.81
                    //March	    2024	4665.27	5115.62

                    //optionData = ['Current Month', 'Previous Month', 'Last 3 Month'];
                    var KWHArray = [];
                    var KVAHArray = [];
                    for (var i = 0; i < myJSON.length; i++) {
                        optionData.push(myJSON[i]?.Month);
                        KWHArray.push(myJSON[i]?.KWH);
                        KVAHArray.push(myJSON[i]?.KVAH)
                    }


                    series = [
                        {
                            data: KWHArray,
                            type: 'bar',
                            stack: 'a',
                            name: 'KWH',
                            label: {
                                show: true
                            }
                        },
                        {
                            data: KVAHArray,
                            type: 'bar',
                            stack: 'b',
                            name: 'KVAH',
                            label: {
                                show: true
                            }
                        },
                    ];
                }


                //var series = seriesData;
                const stackInfo_eceA = {};
                for (let i = 0; i < series[0].data.length; ++i) {
                    for (let j = 0; j < series.length; ++j) {
                        const stackName = series[j].stack;
                        if (!stackName) {
                            continue;
                        }
                        if (!stackInfo_eceA[stackName]) {
                            stackInfo_eceA[stackName] = {
                                stackStart: [],
                                stackEnd: []
                            };
                        }
                        const info = stackInfo_eceA[stackName];
                        const data = series[j].data[i];
                        if (data && data !== '-') {
                            if (info.stackStart[i] == null) {
                                info.stackStart[i] = j;
                            }
                            info.stackEnd[i] = j;
                        }
                    }
                }
                for (let i = 0; i < series.length; ++i) {
                    const data = series[i].data;
                    const info = stackInfo_eceA[series[i].stack];
                    for (let j = 0; j < series[i].data.length; ++j) {
                        // const isStart = info.stackStart[j] === i;
                        const isEnd = info.stackEnd[j] === i;
                        const topBorder = isEnd ? 20 : 0;
                        const bottomBorder = 0;
                        data[j] = {
                            value: data[j],
                            itemStyle: {
                                borderRadius: [topBorder, topBorder, bottomBorder, bottomBorder]
                            }
                        };
                    }
                }
                option_ecaA = {
                    xAxis: {
                        type: 'category',
                        data: optionData,
                        //axisLabel: {
                        //    renderMode: 'html',
                        //    interval: 0,
                        //    formatter: function (value, idx) {
                        //        if (TimeCategory == 'Hot')
                        //            return value;
                        //        else if (TimeCategory == 'Warm') {
                        //            var labelArray = value.toString().split(' ');
                        //            return labelArray[0] + '<br/>' + labelArray[1]
                        //        }
                        //    }
                        //}
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: series,
                    legend: {
                        data: optionData
                    },
                };

                if (option_ecaA && typeof option_ecaA === 'object') {
                    myChart_ecaA.setOption(option_ecaA);
                }

                window.addEventListener('resize', myChart_ecaA.resize);

                if (option_ecaA && typeof option_ecaA === 'object') {
                    myChart_ecaA.setOption(option_ecaA);
                }
                window.addEventListener('resize', function () {
                    myChart_ecaA.resize();
                });
                document.querySelector(".menu_button").addEventListener("click", function () {
                    myChart_ecaA.resize();
                });

            }
        });
    }
    var _echartsEnergyConsumptionBarChartAverageDashboard = function (TimeCategory) {
        var dom_ecaA = document.getElementById('ecavg-kwh-kvah-chart-container');
        var myChart_ecaA = echarts.init(dom_ecaA, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        myChart_ecaA.showLoading();

        $.ajax({
            type: "post",
            url: "/Energy/GetEnergyConsumptionAverage_Dashboard?TimeCategory=" + TimeCategory,
            data: {},
            success: function (data) {
                myChart_ecaA.hideLoading();
                var myJSON = JSON.parse(data)

                var option_ecaA;
                var series;
                var optionData = [];

                if (TimeCategory == 'Hot') {
                    optionData = ['Previous Hour', 'Today'];

                    series = [
                        {
                            data: [myJSON[0].PreviousHRKWH, myJSON[0].TodayKWH], //[Previous Hour KWH,Today KWH]
                            type: 'bar',
                            stack: 'a',
                            name: 'KWH',
                            label: {
                                show: true
                            }
                        },
                        {
                            data: [myJSON[0].PreviousHRKVAH, myJSON[0].TodayKVAH], //[Previous Hour KVAH,Today KVAH]
                            type: 'bar',
                            stack: 'b',
                            name: 'KVAH',
                            label: {
                                show: true
                            }
                        },
                    ];
                }
                else if (TimeCategory == 'Warm') {
                    optionData = ['Yesterday', 'Curr Week', 'Prev Week', 'Curr Month'];

                    series = [
                        {
                            data: [myJSON[0].YesterdayKWH, myJSON[0].CurrentWeekKWH, myJSON[0].PreviousWeekKWH, myJSON[0].CurrentMonthKWH], //[Previous Hour KWH,Today KWH]
                            type: 'bar',
                            stack: 'a',
                            name: 'KWH',
                            label: {
                                show: true
                            }
                        },
                        {
                            data: [myJSON[0].YesterdayKVAH, myJSON[0].CurrentWeekKVAH, myJSON[0].PreviousWeekKVAH, myJSON[0].CurrentMonthKVAH], //[Previous Hour KVAH,Today KVAH]
                            type: 'bar',
                            stack: 'b',
                            name: 'KVAH',
                            label: {
                                show: true
                            }
                        },
                    ];
                }
                else if (TimeCategory == 'Cold') {
                    var KWHArray = [];
                    var KVAHArray = [];
                    for (var i = 0; i < myJSON.length; i++) {
                        optionData.push(myJSON[i]?.Month);
                        KWHArray.push(myJSON[i]?.KWH);
                        KVAHArray.push(myJSON[i]?.KVAH)
                    }


                    series = [
                        {
                            data: KWHArray,
                            type: 'bar',
                            stack: 'a',
                            name: 'KWH',
                            label: {
                                show: true
                            }
                        },
                        {
                            data: KVAHArray,
                            type: 'bar',
                            stack: 'b',
                            name: 'KVAH',
                            label: {
                                show: true
                            }
                        },
                    ];
                    //optionData = ['Current Month', 'Previous Month', 'Last 3 Month'];

                    //series = [
                    //    {
                    //        data: [myJSON[0].CurrentMonthKWH, myJSON[0].PreviousMonthKWH, myJSON[0].Last3MonthKWH],
                    //        type: 'bar',
                    //        stack: 'a',
                    //        name: 'a'
                    //    },
                    //    {
                    //        data: [myJSON[0].CurrentMonthKVAH, myJSON[0].PreviousMonthKVAH, myJSON[0].Last3MonthKVAH],
                    //        type: 'bar',
                    //        stack: 'b',
                    //        name: 'b'
                    //    },
                    //];
                }

                const stackInfo_eceA = {};
                for (let i = 0; i < series[0].data.length; ++i) {
                    for (let j = 0; j < series.length; ++j) {
                        const stackName = series[j].stack;
                        if (!stackName) {
                            continue;
                        }
                        if (!stackInfo_eceA[stackName]) {
                            stackInfo_eceA[stackName] = {
                                stackStart: [],
                                stackEnd: []
                            };
                        }
                        const info = stackInfo_eceA[stackName];
                        const data = series[j].data[i];
                        if (data && data !== '-') {
                            if (info.stackStart[i] == null) {
                                info.stackStart[i] = j;
                            }
                            info.stackEnd[i] = j;
                        }
                    }
                }
                for (let i = 0; i < series.length; ++i) {
                    const data = series[i].data;
                    const info = stackInfo_eceA[series[i].stack];
                    for (let j = 0; j < series[i].data.length; ++j) {
                        // const isStart = info.stackStart[j] === i;
                        const isEnd = info.stackEnd[j] === i;
                        const topBorder = isEnd ? 20 : 0;
                        const bottomBorder = 0;
                        data[j] = {
                            value: data[j],
                            itemStyle: {
                                borderRadius: [topBorder, topBorder, bottomBorder, bottomBorder]
                            }
                        };
                    }
                }
                option_ecaA = {
                    xAxis: {
                        type: 'category',
                        data: optionData
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: series
                };

                if (option_ecaA && typeof option_ecaA === 'object') {
                    myChart_ecaA.setOption(option_ecaA);
                }

                window.addEventListener('resize', myChart_ecaA.resize);

                if (option_ecaA && typeof option_ecaA === 'object') {
                    myChart_ecaA.setOption(option_ecaA);
                }

                window.addEventListener('resize', function () {
                    myChart_ecaA.resize();
                });
                document.querySelector(".menu_button").addEventListener("click", function () {
                    myChart_ecaA.resize();
                });
            }
        });
    }
    var _EnergyConsumptionTimeOfDayDashboard = function (TimeCategory) {
        $.ajax({
            type: "post",
            url: "/Energy/GetEnergyConsumption_TimeOfDay_Dashboard?TimeCategory=" + TimeCategory,
            data: {},
            success: function (data) {
                var myJSON = JSON.parse(data)
                console.log(myJSON, 'myJSON')
                var opsWindow = myJSON.find(x => x.SiteOperationWindow == 'Ops Schedule');
                if (opsWindow)
                    $('#eca_OpsSchedule').text(opsWindow.KWH + "/" + opsWindow.KVAH)

                var nonOpsWindow = myJSON.find(x => x.SiteOperationWindow == 'No Ops Schedule');
                if (nonOpsWindow)
                    $('#eca_NonOpsSchedule').text(nonOpsWindow.KWH + "/" + nonOpsWindow.KVAH)

                var maxKWH = 0, minKWH;
                var maxKVAH = 0, minKVAH;
                var maxKWHText, minKWHText;
                var index = 0;
                for (var i = 0; i < myJSON.length; i++) {
                    if (myJSON[i].SiteOperationWindow == 'Ops Schedule'
                        || myJSON[i].SiteOperationWindow == 'Pre Shutdown No Ops'
                        || myJSON[i].SiteOperationWindow == 'Post Shutdown No Ops Schedule') {
                        continue;
                    }
                    if (index == 0) {
                        minKWH = myJSON[i].KWH;
                        minKVAH = parseFloat(myJSON[i].KVAH);
                        minKWHText = myJSON[i].SiteOperationWindow;
                    }
                    else if (parseFloat(myJSON[i].KWH) < minKWH) {
                        minKWH = parseFloat(myJSON[i].KWH);
                        minKVAH = parseFloat(myJSON[i].KVAH);
                        minKWHText = myJSON[i].SiteOperationWindow;
                    }
                    if (parseFloat(myJSON[i].KWH) > maxKWH) {
                        maxKWH = parseFloat(myJSON[i].KWH);
                        maxKVAH = parseFloat(myJSON[i].KVAH);
                        maxKWHText = myJSON[i].SiteOperationWindow;
                    }
                    index++;
                }

                $('#eca_PeakKWHValue').text(maxKWH + "/" + maxKVAH);
                $('#eca_PeakKWHText').text(maxKWHText);
                $('#Least_PeakKWHValue').text(minKWH + "/" + minKVAH);
                $('#eca_LeastKWHText').text(minKWHText);
            }
        });
    }
    return {
        init: function (TimeCategory) {
            _echartsEnergyConsumptionBarChartActualDashboard(TimeCategory);
            _echartsEnergyConsumptionBarChartAverageDashboard(TimeCategory);
            _EnergyConsumptionTimeOfDayDashboard(TimeCategory);
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    EnergyConsumptionBarGraphDashboard.init("Hot");
});

