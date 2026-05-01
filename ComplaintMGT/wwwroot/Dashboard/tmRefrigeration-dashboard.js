var tmRefrigerationDashboard = function () {
    var _echartstmRefrigerationChartDashboard = function (containerId, active, dataValue, deviceName, index) {
        //dataValue = dataValue + "°C";
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        var divContent = (active == true ? '<div class="carousel-item active">' : '<div class="carousel-item">')
        divContent += '<div class="chart-container has-fixed-size" id="' + containerId + '"></div>' +
            '<div class="carousel-caption d-none d-md-block">' +
            '<h3 style="color: #06aff2;font-size: 12px;margin-bottom: -14%;font-weight: bold;">' + deviceName + '</h3>' +
            '</div></div>';
        $("#carouselTMRefrigeration .carousel-inner").append(divContent);

        var divIndicator = (active == true ? '<li data-target="#carouselTMRefrigeration" data-slide-to="' + index + '" class="active"></li>' : '<li data-target="#carouselTMRefrigeration" data-slide-to="' + index + '"></li>')
        $("#carouselTMRefrigeration .carousel-indicators").append(divIndicator);

        var dom = document.getElementById(containerId);
        var tmRefrigerationChart = echarts.init(dom);

        var app = {};

        var option;

        option = {
            series: [
                {
                    type: 'gauge',
                    center: ['50%', '60%'],
                    startAngle: 200,
                    endAngle: -20,
                    min: -50,
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
                        distance: -10,
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
                    min: -50,
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
            tmRefrigerationChart.setOption(option, true);
        }
        tmRefrigerationChart.resize();
        window.addEventListener('resize', tmRefrigerationChart.resize);

    }

    var _echartstmhuRefrigerationChartDashboard = function (containerId, active, dataValue, dataValueHumidity, deviceName, index) {
        //dataValue = dataValue + "°C";
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        var divContent = (active == true ? '<div class="carousel-item active">' : '<div class="carousel-item">')
        divContent += '<div class="chart-container has-fixed-size" id="' + containerId + '"></div>' +
            '<div class="carousel-caption d-none d-md-block">' +
            '<h3 style="color: #06aff2;font-size: 12px;margin-bottom: -22px; margin-top: 12px;font-weight: bold;">' + deviceName + '</h3>' +
            '</div></div>';
        $("#carouselTMRefrigeration .carousel-inner").append(divContent);

        var divIndicator = (active == true ? '<li data-target="#carouselTMRefrigeration" data-slide-to="' + index + '" class="active"></li>' : '<li data-target="#carouselTMRefrigeration" data-slide-to="' + index + '"></li>')
        $("#carouselTMRefrigeration .carousel-indicators").append(divIndicator);

        var dom = document.getElementById(containerId);
        var tmRefrigerationChart = echarts.init(dom);

        var app = {};


        const gaugeData = [
            {
                value: dataValue,
                name: 'Temperature',
                title: {
                    offsetCenter: ['0%', '-30%']
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '-10%']
                }
            },
            {
                value: dataValueHumidity,
                name: 'Humidity',
                title: {
                    offsetCenter: ['0%', '20%']
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '40%']
                }
            }
        ];
        option = {
            series: [
                {
                    type: 'gauge',
                    startAngle: 90,
                    endAngle: -270,
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
                        show: false
                    },
                    axisLabel: {
                        show: false,
                        distance: 50
                    },
                    data: gaugeData,
                    title: {
                        fontSize: 12
                    },
                    detail: {
                        width: 25,
                        height: 12,
                        fontSize: 12,
                        color: 'inherit',
                        borderColor: 'inherit',
                        borderRadius: 20,
                        borderWidth: 1,
                        formatter: '{value}'
                    }
                }
            ]
        };
       

        if (option && typeof option === 'object') {
            tmRefrigerationChart.setOption(option, true);
        }
        tmRefrigerationChart.resize();
        window.addEventListener('resize', tmRefrigerationChart.resize);

    }

    var getKitchenAssetsTemperature = function () {
        var label = document.getElementById("chart_label_humidity");
        label.innerText = "Thermal Monitoring - Kitchen Assets(Refrigeration)";
        let url = "/Deshboard/GetTopValuetransactionTempSensor?DType=5";

        $.ajax({
            type: "post",
            url: url,
            data: {},
            datatype: "json",
            success: function (data) {
                var myJSON = JSON.parse(data);
                var rowcount = myJSON.length;
                for (var i = 0; i < rowcount; i++) {
                    var active = i == 0 ? true : false;
                    var chartIndex = (i + 1).toString();
                    _echartstmRefrigerationChartDashboard(
                        "tmRefrigeration" + chartIndex + "-chart-container",
                        active,
                        myJSON[i].Temp_in_degree,
                        myJSON[i].Name,
                        i
                    );
                }
            }
        });
    }

    var getTemperatureAndHumidity = function () {
        var label = document.getElementById("chart_label_one");
        label.innerText = "Temperature & Humidity";
        let url = "/Deshboard/GetTopValuetransactionTempHumidSensor?DType=15,17";

        $.ajax({
            type: "post",
            url: url,
            data: {},
            datatype: "json",
            success: function (data) {
                var myJSON = JSON.parse(data);
                var rowcount = myJSON.length;
                for (var i = 0; i < rowcount; i++) {
                    var active = i == 0 ? true : false;
                    var chartIndex = (i + 1).toString();
                    _echartstmhuRefrigerationChartDashboard(
                        "tmRefrigeration" + chartIndex + "-chart-container",
                        active,
                        myJSON[i].Temp_in_degree,
                        myJSON[i].Humidity,
                        myJSON[i].Name,
                        i
                    );
                }
            }
        });
    }

    return {
        init: function () {
                getKitchenAssetsTemperature();
                getTemperatureAndHumidity();
            
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    tmRefrigerationDashboard.init();
});





