var CarbonDashboard = function () {
    var _echartsCarbonChartDashboard = function () {
        var dom = document.getElementById('carbon-footprint-chart-container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        option = {
            color: ['#201F2A', '#848A9C', '#ADB1BE', '#DCDCE3'],
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '30%',
                orient: 'vertical',
                right: 'right'
            },
            series: [
                {
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    padAngle: 5,
                    itemStyle: {
                        borderRadius: 10
                    },
                    label: {
                        show: false,
                        position: 'center',

                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 12,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 1048, name: 'February' },
                        { value: 735, name: 'So Far This Month' },
                        { value: 580, name: 'Predicted This Month' },
                        { value: 484, name: 'Change in Emissions' },
                    ]
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);

    }

    return {
        init: function () {
            _echartsCarbonChartDashboard();
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    CarbonDashboard.init();
});
