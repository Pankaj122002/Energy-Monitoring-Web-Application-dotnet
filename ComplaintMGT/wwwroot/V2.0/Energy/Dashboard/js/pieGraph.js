var EC_EnergyDistributionGraphDashboard = function () {
    var _echartsPieChartDashboard = function (TimeCategory) {

        var dom = document.getElementById('energy-distribution-chart-container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        var option;
        var currentdate = new Date();
        if (TimeCategory == "Hot") { //current day 
            var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate();
            var fromDate = datetime + " 00:00:00.000";
            var toDate = datetime + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds() + ".000"
        }
        else if (TimeCategory == "Warm") { //current month
            var datetime = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-" + currentdate.getDate();
            var fromDate = currentdate.getFullYear() + "-" + (currentdate.getMonth() + 1) + "-01" + " 00:00:00.000";
            var toDate = datetime + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds() + ".000"
        }
        else if (TimeCategory == "Cold") { //last 3 month excluding current month 
            var d = new Date();
            d.setMonth(d.getMonth() - 3);
            var fromDate = d.getFullYear() + "-" + (d.getMonth() + 1) + "-01" + " 00:00:00.000";
            currentdate.setMonth(currentdate.getMonth() - 1)
            var datetime = new Date(currentdate.getFullYear(), (currentdate.getMonth() + 1), 0);
            var toDate = datetime.getFullYear() + "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate() + " 11:59:59.000";
        }
        var apiURL = "/Energy/GetEnergyDistribution_EnergyDashboard?fromDate=" + fromDate.toString() + "&toDate=" + toDate.toString();
        $.ajax({
            type: "post",
            //data: { fromDate: fromDate.toString(), toDate: toDate.toString() },
            url: apiURL,
            data: {},
            success: function (data) {
                var myJSON = JSON.parse(data);
                var jsonData = [];
                for (var i = 0; i < myJSON.length; i++) {
                    jsonData.push({ 'name': myJSON[i].DeviceName, 'value': myJSON[i].energyConsume.toFixed(2) })
                }

                option = {
                    color: [
                        '#04BFDA', '#CC22EE', '#ED8888', '#FFA84A', '#FB67CA', '#9B88ED', '#67FB6D'
                    ],
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        //orient: 'horizontal',
                        //bottom: 'bottom'
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
                            radius: '60%',
                            data: jsonData,
                            //[
                            //    { value: 1048, name: 'HVAC' },
                            //    { value: 735, name: 'Lighting' },
                            //    { value: 580, name: 'Others' },
                            //    { value: 484, name: 'Kitchen' }
                            //]
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

    return {
        init: function (TimeCategory) {
            _echartsPieChartDashboard(TimeCategory);
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    EC_EnergyDistributionGraphDashboard.init("Hot");
});
