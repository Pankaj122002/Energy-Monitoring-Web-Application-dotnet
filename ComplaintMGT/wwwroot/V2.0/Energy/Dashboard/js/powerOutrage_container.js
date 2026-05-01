var OutrageDashboard = function () {

    var _echartGetAllOutrageData = function (TimeCategory) {
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

        var apiURL = "/Energy/GetPowerOutage_EnergyDashboard?fromDate=" + fromDate.toString() + "&toDate=" + toDate.toString();
        $.ajax({
            type: "post",
            //data: { fromDate: fromDate.toString(), toDate: toDate.toString() },
            url: apiURL,
            data: {},
            success: function (data) {
                var myJSON = JSON.parse(data);
                _echartsCountOutrageChartDashboard(parseInt(myJSON[0].countOutage));
                _echartsTotalOutrageChartDashboard(myJSON[0].totalOutage);
            }
        });
    }
    var _echartsCountOutrageChartDashboard = function (countOutage) {
        var dom = document.getElementById('power-outrage-count-chart-container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        var ROOT_PATH = 'https://echarts.apache.org/examples';
        var option;

        //var _panelImageURL = 'http://bbk-dev.syncotics.com/assets/images/gauge_orange.png';
        var _panelImageURL = '../../../v2.0/energy/images/blue_gauge.png';
        var _animationDuration = 1000;
        var _animationDurationUpdate = 1000;
        var _animationEasingUpdate = 'quarticInOut';
        //CHANGE DIMENSION OF GAUGE FROM HERE
        var _valOnRadianMax = Math.ceil(parseInt(countOutage) + ((parseInt(countOutage) * 20) / 100)); //150;//200
        var _outerRadius = 120;//100;//200;
        var _innerRadius = 90;//70;//170;
        var _pointerInnerRadius = 20;//20;//40;
        var _insidePanelRadius = 40;//40//140;
        var _currentDataIndex = 0;

        var currentValue = countOutage;// (countOutage * _valOnRadianMax) / 100;
        //TO here
        function renderItem(params, api) {
            var valOnRadian = api.value(1);
            var coords = api.coord([api.value(0), valOnRadian]);
            var polarEndRadian = coords[3];
            var imageStyle = {
                image: _panelImageURL,
                x: params.coordSys.cx - _outerRadius,
                y: params.coordSys.cy - _outerRadius,
                width: _outerRadius * 2,
                height: _outerRadius * 2
            };
            return {
                type: 'group',
                children: [
                    {
                        type: 'image',
                        style: imageStyle,
                        clipPath: {
                            type: 'sector',
                            shape: {
                                cx: params.coordSys.cx,
                                cy: params.coordSys.cy,
                                r: _outerRadius,
                                r0: _innerRadius,
                                startAngle: 0,
                                endAngle: -polarEndRadian,
                                transition: 'endAngle',
                                enterFrom: { endAngle: 0 }
                            }
                        }
                    },
                    {
                        type: 'image',
                        style: imageStyle,
                        clipPath: {
                            type: 'polygon',
                            shape: {
                                points: makePionterPoints(params, polarEndRadian)
                            },
                            extra: {
                                polarEndRadian: polarEndRadian,
                                transition: 'polarEndRadian',
                                enterFrom: { polarEndRadian: 0 }
                            },
                            during: function (apiDuring) {
                                apiDuring.setShape(
                                    'points',
                                    makePionterPoints(params, apiDuring.getExtra('polarEndRadian'))
                                );
                            }
                        }
                    },
                    {
                        type: 'circle',
                        shape: {
                            cx: params.coordSys.cx,
                            cy: params.coordSys.cy,
                            r: _insidePanelRadius
                        },
                        style: {
                            fill: '#fff',
                            shadowBlur: 25,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowColor: 'rgba(128, 223, 255, 0.4)'
                        }
                    },
                    {
                        type: 'text',
                        extra: {
                            valOnRadian: valOnRadian,
                            transition: 'valOnRadian',
                            enterFrom: { valOnRadian: 0 }
                        },
                        style: {
                            text: makeText(valOnRadian),
                            fontSize: 20,
                            fontWeight: 700,
                            x: params.coordSys.cx,
                            y: params.coordSys.cy,
                            fill: 'rgb(13,202,240)',
                            align: 'center',
                            verticalAlign: 'middle',
                            enterFrom: { opacity: 0 }
                        },
                        during: function (apiDuring) {
                            apiDuring.setStyle(
                                'text',
                                makeText(apiDuring.getExtra('valOnRadian'))
                            );
                        }
                    }
                ]
            };
        }
        function convertToPolarPoint(renderItemParams, radius, radian) {
            return [
                Math.cos(radian) * radius + renderItemParams.coordSys.cx,
                -Math.sin(radian) * radius + renderItemParams.coordSys.cy
            ];
        }
        function makePionterPoints(renderItemParams, polarEndRadian) {
            return [
                convertToPolarPoint(renderItemParams, _outerRadius, polarEndRadian),
                convertToPolarPoint(
                    renderItemParams,
                    _outerRadius,
                    polarEndRadian + Math.PI * 0.03
                ),
                convertToPolarPoint(renderItemParams, _pointerInnerRadius, polarEndRadian)
            ];
        }
        function makeText(valOnRadian) {
            // Validate additive animation calc.
            if (valOnRadian < -10) {
                console.log('illegal during val: ' + valOnRadian);
            }
            return valOnRadian;//((valOnRadian / _valOnRadianMax) * 100).toFixed(0);
        }
        option = {
            animationEasing: _animationEasingUpdate,
            animationDuration: _animationDuration,
            animationDurationUpdate: _animationDurationUpdate,
            animationEasingUpdate: _animationEasingUpdate,
            dataset: {
                source: [[1, currentValue]]
            },
            tooltip: {},
            angleAxis: {
                type: 'value',
                startAngle: 0,
                show: false,
                min: 0,
                max: _valOnRadianMax
            },
            radiusAxis: {
                type: 'value',
                show: false
            },
            polar: {},
            series: [
                {
                    type: 'custom',
                    coordinateSystem: 'polar',
                    renderItem: renderItem
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    }

    var _echartsTotalOutrageChartDashboard = function (totalOutage) {
        var dom = document.getElementById('power-outrage-total-chart-container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        var ROOT_PATH = 'https://echarts.apache.org/examples';
        var option;

        var _panelImageURL = '../../../v2.0/energy/images/orange_gauge.png';//'http://bbk-dev.syncotics.com/assets/images/gauge_orange.png';
        var _animationDuration = 1000;
        var _animationDurationUpdate = 1000;
        var _animationEasingUpdate = 'quarticInOut';
        //CHANGE DIMENSION OF GAUGE FROM HERE
        var _valOnRadianMax = Math.ceil(parseInt(totalOutage) + ((parseInt(totalOutage) * 20) / 100));//150;//200
        var _outerRadius = 120;//100;//200;
        var _innerRadius = 90;//70;//170;
        var _pointerInnerRadius = 20;//20;//40;
        var _insidePanelRadius = 40;//40//140;
        var _currentDataIndex = 0;

        var currentValue = totalOutage;// (totalOutage * _valOnRadianMax) / 100;
        //TO here
        function renderItem(params, api) {
            var valOnRadian = api.value(1);
            var coords = api.coord([api.value(0), valOnRadian]);
            var polarEndRadian = coords[3];
            var imageStyle = {
                image: _panelImageURL,
                x: params.coordSys.cx - _outerRadius,
                y: params.coordSys.cy - _outerRadius,
                width: _outerRadius * 2,
                height: _outerRadius * 2
            };
            return {
                type: 'group',
                children: [
                    {
                        type: 'image',
                        style: imageStyle,
                        clipPath: {
                            type: 'sector',
                            shape: {
                                cx: params.coordSys.cx,
                                cy: params.coordSys.cy,
                                r: _outerRadius,
                                r0: _innerRadius,
                                startAngle: 0,
                                endAngle: -polarEndRadian,
                                transition: 'endAngle',
                                enterFrom: { endAngle: 0 }
                            }
                        }
                    },
                    {
                        type: 'image',
                        style: imageStyle,
                        clipPath: {
                            type: 'polygon',
                            shape: {
                                points: makePionterPoints(params, polarEndRadian)
                            },
                            extra: {
                                polarEndRadian: polarEndRadian,
                                transition: 'polarEndRadian',
                                enterFrom: { polarEndRadian: 0 }
                            },
                            during: function (apiDuring) {
                                apiDuring.setShape(
                                    'points',
                                    makePionterPoints(params, apiDuring.getExtra('polarEndRadian'))
                                );
                            }
                        }
                    },
                    {
                        type: 'circle',
                        shape: {
                            cx: params.coordSys.cx,
                            cy: params.coordSys.cy,
                            r: _insidePanelRadius
                        },
                        style: {
                            fill: '#fff',
                            shadowBlur: 25,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowColor: 'rgba(255, 204, 128, 0.4)'
                        }
                    },
                    {
                        type: 'text',
                        extra: {
                            valOnRadian: valOnRadian,
                            transition: 'valOnRadian',
                            enterFrom: { valOnRadian: 0 }
                        },
                        style: {
                            text: makeText(valOnRadian),
                            fontSize: 20,
                            fontWeight: 700,
                            x: params.coordSys.cx,
                            y: params.coordSys.cy,
                            fill: 'rgb(253,126,20)',
                            align: 'center',
                            verticalAlign: 'middle',
                            enterFrom: { opacity: 0 }
                        },
                        during: function (apiDuring) {
                            apiDuring.setStyle(
                                'text',
                                makeText(apiDuring.getExtra('valOnRadian'))
                            );
                        }
                    }
                ]
            };
        }
        function convertToPolarPoint(renderItemParams, radius, radian) {
            return [
                Math.cos(radian) * radius + renderItemParams.coordSys.cx,
                -Math.sin(radian) * radius + renderItemParams.coordSys.cy
            ];
        }
        function makePionterPoints(renderItemParams, polarEndRadian) {
            return [
                convertToPolarPoint(renderItemParams, _outerRadius, polarEndRadian),
                convertToPolarPoint(
                    renderItemParams,
                    _outerRadius,
                    polarEndRadian + Math.PI * 0.03
                ),
                convertToPolarPoint(renderItemParams, _pointerInnerRadius, polarEndRadian)
            ];
        }
        function makeText(valOnRadian) {
            // Validate additive animation calc.
            if (valOnRadian < -10) {
                console.log('illegal during val: ' + valOnRadian);
            }
            return valOnRadian.toFixed(2);// ((valOnRadian / _valOnRadianMax) * 100).toFixed(0);
        }
        option = {
            animationEasing: _animationEasingUpdate,
            animationDuration: _animationDuration,
            animationDurationUpdate: _animationDurationUpdate,
            animationEasingUpdate: _animationEasingUpdate,
            dataset: {
                source: [[1, currentValue]]
            },
            tooltip: {},
            angleAxis: {
                type: 'value',
                startAngle: 0,
                show: false,
                min: 0,
                max: _valOnRadianMax
            },
            radiusAxis: {
                type: 'value',
                show: false
            },
            polar: {},
            series: [
                {
                    type: 'custom',
                    coordinateSystem: 'polar',
                    renderItem: renderItem
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    }

    var _echartsOutrageChart2Dashboard = function (TimeCategory) {
        var dom = document.getElementById('energy-usage-index-chart-container');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        var ROOT_PATH = 'https://echarts.apache.org/examples';
        var option;

        var _panelImageURL = '../../../v2.0/energy/images/green_gauge.png';//'http://bbk-dev.syncotics.com/assets/images/gauge_orange.png';
        var _animationDuration = 1000;
        var _animationDurationUpdate = 1000;
        var _animationEasingUpdate = 'quarticInOut';
        //CHANGE DIMENSION OF GAUGE FROM HERE
        var _valOnRadianMax = Math.ceil(parseInt(96) + ((parseInt(96) * 20) / 100));// 150;//200
        var _outerRadius = 120;//100;//200;
        var _innerRadius = 90;//70;//170;
        var _pointerInnerRadius = 20;//20;//40;
        var _insidePanelRadius = 40;//40//140;
        var _currentDataIndex = 0;
        var currentValue = 96;// (96 * _valOnRadianMax) / 100;
        //TO here
        function renderItem(params, api) {
            var valOnRadian = api.value(1);
            var coords = api.coord([api.value(0), valOnRadian]);
            var polarEndRadian = coords[3];
            var imageStyle = {
                image: _panelImageURL,
                x: params.coordSys.cx - _outerRadius,
                y: params.coordSys.cy - _outerRadius,
                width: _outerRadius * 2,
                height: _outerRadius * 2
            };
            return {
                type: 'group',
                children: [
                    {
                        type: 'image',
                        style: imageStyle,
                        clipPath: {
                            type: 'sector',
                            shape: {
                                cx: params.coordSys.cx,
                                cy: params.coordSys.cy,
                                r: _outerRadius,
                                r0: _innerRadius,
                                startAngle: 0,
                                endAngle: -polarEndRadian,
                                transition: 'endAngle',
                                enterFrom: { endAngle: 0 }
                            }
                        }
                    },
                    {
                        type: 'image',
                        style: imageStyle,
                        clipPath: {
                            type: 'polygon',
                            shape: {
                                points: makePionterPoints(params, polarEndRadian)
                            },
                            extra: {
                                polarEndRadian: polarEndRadian,
                                transition: 'polarEndRadian',
                                enterFrom: { polarEndRadian: 0 }
                            },
                            during: function (apiDuring) {
                                apiDuring.setShape(
                                    'points',
                                    makePionterPoints(params, apiDuring.getExtra('polarEndRadian'))
                                );
                            }
                        }
                    },
                    {
                        type: 'circle',
                        shape: {
                            cx: params.coordSys.cx,
                            cy: params.coordSys.cy,
                            r: _insidePanelRadius
                        },
                        style: {
                            fill: '#fff',
                            shadowBlur: 25,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            shadowColor: 'rgba(92, 214, 92, 0.4)'
                        }
                    },
                    {
                        type: 'text',
                        extra: {
                            valOnRadian: valOnRadian,
                            transition: 'valOnRadian',
                            enterFrom: { valOnRadian: 0 }
                        },
                        style: {
                            text: makeText(valOnRadian),
                            fontSize: 20,
                            fontWeight: 700,
                            x: params.coordSys.cx,
                            y: params.coordSys.cy,
                            fill: 'rgb(32, 201, 151)',
                            align: 'center',
                            verticalAlign: 'middle',
                            enterFrom: { opacity: 0 }
                        },
                        during: function (apiDuring) {
                            apiDuring.setStyle(
                                'text',
                                makeText(apiDuring.getExtra('valOnRadian'))
                            );
                        }
                    }
                ]
            };
        }
        function convertToPolarPoint(renderItemParams, radius, radian) {
            return [
                Math.cos(radian) * radius + renderItemParams.coordSys.cx,
                -Math.sin(radian) * radius + renderItemParams.coordSys.cy
            ];
        }
        function makePionterPoints(renderItemParams, polarEndRadian) {
            return [
                convertToPolarPoint(renderItemParams, _outerRadius, polarEndRadian),
                convertToPolarPoint(
                    renderItemParams,
                    _outerRadius,
                    polarEndRadian + Math.PI * 0.03
                ),
                convertToPolarPoint(renderItemParams, _pointerInnerRadius, polarEndRadian)
            ];
        }
        function makeText(valOnRadian) {
            // Validate additive animation calc.
            if (valOnRadian < -10) {
                //alert('illegal during val: ' + valOnRadian);
            }
            return valOnRadian.toFixed(2);// ((valOnRadian / _valOnRadianMax) * 100).toFixed(0);
        }
        option = {
            animationEasing: _animationEasingUpdate,
            animationDuration: _animationDuration,
            animationDurationUpdate: _animationDurationUpdate,
            animationEasingUpdate: _animationEasingUpdate,
            dataset: {
                source: [[1, currentValue]]
            },
            tooltip: {},
            angleAxis: {
                type: 'value',
                startAngle: 0,
                show: false,
                min: 0,
                max: _valOnRadianMax
            },
            radiusAxis: {
                type: 'value',
                show: false
            },
            polar: {},
            series: [
                {
                    type: 'custom',
                    coordinateSystem: 'polar',
                    renderItem: renderItem
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    }

    return {
        init: function (TimeCategory) {
            _echartGetAllOutrageData(TimeCategory);
            _echartsOutrageChart2Dashboard(TimeCategory);
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    OutrageDashboard.init("Hot");
});

