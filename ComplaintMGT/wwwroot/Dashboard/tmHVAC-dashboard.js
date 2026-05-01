var tmHVACDashboard = function () {
    var _echartstmHVACChartDashboard = function (containerId, active, dataValue, deviceName, index) {

        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        var divContent = (active == true ? '<div class="carousel-item active">' : '<div class="carousel-item">')
        divContent += '<div class="chart-container has-fixed-size" id="' + containerId + '"></div>' +
            '<div class="carousel-caption d-none d-md-block">' +
            '<h3 style="color: #06aff2;font-size: 12px;margin-bottom: -14%;font-weight: bold;">' + deviceName + '</h3>' +
            '</div></div>';
        $("#carouselTMHVAC .carousel-inner").append(divContent);

        var divIndicator = (active == true ? '<li data-target="#carouselTMHVAC" data-slide-to="' + index + '" class="active"></li>' : '<li data-target="#carouselTMHVAC" data-slide-to="' + index + '"></li>')
        $("#carouselTMHVAC .carousel-indicators").append(divIndicator);

        var dom = document.getElementById(containerId);
        var tmHVACChart = echarts.init(dom);

        var app = {};

        var option;

        option = {
            series: [
                {
                    type: 'gauge',
                    center: ['50%', '60%'],
                    startAngle: 200,
                    endAngle: -20,
                    min: 0,
                    max: 50,
                    splitNumber: 10,
                    itemStyle: {
                        color: '#FFAB91'
                    },
                    progress: {
                        show: true,
                        width: 20
                    },
                    pointer: {
                        show: false
                    },
                    axisLine: {
                        lineStyle: {
                            width: 30
                        }
                    },
                    axisTick: {
                        distance: -45,
                        splitNumber: 5,
                        lineStyle: {
                            width: 2,
                            color: '#999'
                        }
                    },
                    splitLine: {
                        distance: -52,
                        length: 14,
                        lineStyle: {
                            width: 3,
                            color: '#999'
                        }
                    },
                    axisLabel: {
                        distance: 0,
                        color: '#999',
                        fontSize: 12
                    },
                    anchor: {
                        show: false
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        valueAnimation: true,
                        width: '20%',
                        lineHeight: 40,
                        borderRadius: 8,
                        offsetCenter: [0, '-15%'],
                        fontSize: 12,
                        fontWeight: 'bolder',
                        formatter: '{value} C',
                        color: 'inherit'
                    },
                    data: [
                        {
                            value: dataValue
                        }
                    ]
                },
                {
                    type: 'gauge',
                    center: ['50%', '60%'],
                    startAngle: 200,
                    endAngle: -20,
                    min: 0,
                    max: 50,
                    itemStyle: {
                        color: '#FD7347'
                    },
                    progress: {
                        show: true,
                        width: 8
                    },
                    pointer: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
                    detail: {
                        show: false,
                        valueAnimation: true,
                        /*  width: '20%',*/
                        lineHeight: 40,
                        borderRadius: 8,
                        offsetCenter: [0, '60%'],
                        fontSize: 12,
                        //fontWeight: 'bolder',
                        formatter: deviceName
                    },
                    data: [
                        {
                            value: dataValue
                        }
                    ]
                }
            ]
        };

        if (option && typeof option === 'object') {
            tmHVACChart.setOption(option, true);
        }
        tmHVACChart.resize();
        window.addEventListener('resize', tmHVACChart.resize);

    }

    var getAllHVACDeviceTemperature = function () {
        $.ajax({
            type: "post",
            url: "/Deshboard/GetTopValuetransactionTempSensor?DType=4,7",
            data: {},
            datatype: "json",
            //traditional: true,
            success: function (data) {
                var myJSON = JSON.parse(data);
                var rowcount = myJSON.length;
                for (var i = 0; i < rowcount; i++) {
                    var active = i == 0 ? true : false;
                    var chartIndex = (i + 1).toString();
                    _echartstmHVACChartDashboard("tmHVAC" + chartIndex + "-chart-container", active, myJSON[i].Temp_in_degree, myJSON[i].Name, i);
                }
            }
        });
    }

    return {
        init: function () {
            getAllHVACDeviceTemperature();
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    tmHVACDashboard.init();
});








