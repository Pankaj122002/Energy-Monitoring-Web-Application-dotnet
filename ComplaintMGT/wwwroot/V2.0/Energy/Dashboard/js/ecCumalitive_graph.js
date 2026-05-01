var ecCumulativeDashboard = function () {
    var _echartsecCumulativeChartDashboard = function () {
        var dom = document.getElementById('ecc-kwh-kvah-chart-container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        var ROOT_PATH = 'https://echarts.apache.org/examples';
        var option;

        $.ajax({
            type: "post",
            url: "/Energy/GetEnergyConsumptionCumulative_Dashboard",
            data: {},
            success: function (data) {


                //var jsonData = [
                //    ["Value", "Energy", "Month"],
                //    [112, "KWH", "Jan"],
                //    [50, "KVAH", "Jan"],
                //    [300, "KWH", "Feb"],
                //    [700, "KVAH", "Feb"],
                //    [1800, "KWH", "Mar"],
                //    [1314, "KVAH", "Mar"]
                //];

                var myJSON = JSON.parse(data)
                var jsonData = [["Value", "Energy", "Month"]];
                for (var i = 0; i < myJSON.length; i++) {
                    jsonData.push([myJSON[i].KWH, 'KWH', myJSON[i].Month]);//add record for kwh
                    jsonData.push([myJSON[i].KVAH, 'KVAH', myJSON[i].Month]);//add record for kvah
                }

                run(jsonData);
            }
        });



        /*$.get(
          ROOT_PATH + '/data/asset/data/life-expectancy-table.json',
          function (_rawData) {
            run(_rawData);
          }
        );*/

        function run(_rawData) {
            // var countries = ['KWH', 'Canada', 'China', 'Cuba', 'Finland', 'KVAH', 'Germany', 'Iceland', 'India', 'Japan', 'North Korea', 'South Korea', 'New Zealand', 'Norway', 'Poland', 'Russia', 'Turkey', 'United Kingdom', 'United States'];
            const countries = [
                'KWH',
                'KVAH',
            ];
            const datasetWithFilters = [];
            const seriesList = [];
            echarts.util.each(countries, function (Energy) {
                var datasetId = 'dataset_' + Energy;
                datasetWithFilters.push({
                    id: datasetId,
                    fromDatasetId: 'dataset_raw',
                    transform: {
                        type: 'filter',
                        config: {
                            and: [
                                //{ dimension: 'Month', gte: 1 },
                                { dimension: 'Energy', '=': Energy }
                            ]
                        }
                    }
                });
                seriesList.push({
                    type: 'line',
                    datasetId: datasetId,
                    showSymbol: false,
                    name: Energy,
                    endLabel: {
                        show: true,
                        formatter: function (params) {
                            return params.value[1] + ': ' + params.value[0];
                        }
                    },
                    labelLayout: {
                        moveOverlap: 'shiftY'
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    encode: {
                        x: 'Month',
                        y: 'Value',
                        label: ['Energy', 'Value'],
                        itemName: 'Month',
                        tooltip: ['Value']
                    }
                });
            });
            option = {
                animationDuration: 10000,
                dataset: [
                    {
                        id: 'dataset_raw',
                        source: _rawData
                    },
                    ...datasetWithFilters
                ],
                tooltip: {
                    order: 'valueDesc',
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    nameLocation: 'middle'
                },
                yAxis: {
                    name: 'Value'
                },
                grid: {
                    right: 140
                },
                series: seriesList
            };
            myChart.setOption(option);
        }

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
            _echartsecCumulativeChartDashboard();
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    ecCumulativeDashboard.init();
});
