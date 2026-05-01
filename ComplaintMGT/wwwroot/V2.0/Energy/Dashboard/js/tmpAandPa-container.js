var EnergyConsumptionActualEnergyDashboard = function () {

    var _echartsEnergyConsumptionActual = function (TimeCategory) {
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

        var apiURL = "/Energy/GetEnergyConsumptionActual?fromDate=" + fromDate.toString() + "&toDate=" + toDate.toString();
        $.ajax({
            type: "post",
            //data: { fromDate: fromDate.toString(), toDate: toDate.toString() },
            url: apiURL,
            data: {},
            success: function (data) {
                var myJSON = JSON.parse(data);
                _echartsEnergyConsumptionActual1EnergyDashboard(myJSON[0].KWH?.toFixed(2));
                _echartsEnergyConsumptionActual2EnergyDashboard(myJSON[0].KVAH.toFixed(2));
            }
        });
    };
    var _echartsEnergyConsumptionCumulative = function (TimeCategory) {
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
        var apiURL = "/Energy/GetEnergyConsumptionCumulative?fromDate=" + fromDate.toString() + "&toDate=" + toDate.toString();
        $.ajax({
            type: "post",
            //data: { fromDate: fromDate.toString(), toDate: toDate.toString() },
            url: apiURL,
            data: {},
            success: function (data) {
                var myJSON = JSON.parse(data);
                _echartsEnergyConsumptionCumulative1EnergyDashboard(myJSON[0].KWH.toFixed(2));
                _echartsEnergyConsumptionCumulative2EnergyDashboard(myJSON[0].KVAH.toFixed(2));
            }
        });
    };
    var _echartsEnergyConsumptionAverage = function (TimeCategory) {
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
        var apiURL = "/Energy/GetEnergyConsumptionAvg?fromDate=" + fromDate.toString() + "&toDate=" + toDate.toString();
        $.ajax({
            type: "post",
            //data: { fromDate: fromDate.toString(), toDate: toDate.toString() },
            url: apiURL,
            data: {},
            success: function (data) {
                var myJSON = JSON.parse(data);
                _echartsEnergyConsumptionAverage1EnergyDashboard(myJSON[0].KWH.toFixed(2));
                _echartsEnergyConsumptionAverage2EnergyDashboard(myJSON[0].KVAH.toFixed(2));
            }
        });
    };
    var _echartsEnergyConsumptionActual1EnergyDashboard = function (kwhValue) {

        /* CHART 1 */
        var dom7_a1 = document.getElementById('eca-kwh-chart-container');
        var myChart7_a1 = echarts.init(dom7_a1, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app7_a1 = {};
        var ROOT_PATH = 'https://echarts.apache.org/examples';
        var option7_a1;

        var _panelImageURL = '../../../v2.0/energy/images/custom-gauge-panel.png';
        var _animationDuration = 1000;
        var _animationDurationUpdate = 1000;
        var _animationEasingUpdate = 'quarticInOut';
        //set dynamically max value for ring gauge so that graph look better 
        var _valOnRadianMax = Math.ceil(parseInt(kwhValue) + ((parseInt(kwhValue) * 20) / 100));//200
        var _outerRadius = 50;//100;//200;
        var _innerRadius = 40;//70;//170;
        var _pointerInnerRadius = 10;//20;//40;
        var _insidePanelRadius = 20;//40//140;
        var _currentDataIndex = 0;
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
                            shadowColor: 'rgba(76,107,167,0.4)'
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
                            fontSize: 10,
                            fontWeight: 700,
                            x: params.coordSys.cx,
                            y: params.coordSys.cy,
                            fill: 'rgb(0,50,190)',
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
            return valOnRadian.toFixed(2);//((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
        }
        option7_a1 = {
            animationEasing: _animationEasingUpdate,
            animationDuration: _animationDuration,
            animationDurationUpdate: _animationDurationUpdate,
            animationEasingUpdate: _animationEasingUpdate,
            dataset: {
                source: [[1, kwhValue]]
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
        /*setInterval(function () {
          var nextSource = [[1, Math.round(Math.random7_a1() * _valOnRadianMax)]];
          myChart7_a1.setoption7_a1({
            dataset: {
              source: nextSource
            }
          });
        }, 3000);*/

        if (option7_a1 && typeof option7_a1 === 'object') {
            myChart7_a1.setOption(option7_a1, true);
        }

        window.addEventListener('resize', myChart7_a1.resize);
        window.addEventListener('resize', function () {
            myChart7_a1.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart7_a1.resize();
        });


    }
    var _echartsEnergyConsumptionActual2EnergyDashboard = function (kvahValue) {

        /* CHART 1 */
        var dom7_a1 = document.getElementById('eca-kvah-chart-container');
        var myChart7_a1 = echarts.init(dom7_a1, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app7_a1 = {};
        var ROOT_PATH = 'https://echarts.apache.org/examples';
        var option7_a1;

        var _panelImageURL = '../../../v2.0/energy/images/custom-gauge-panel.png';
        var _animationDuration = 1000;
        var _animationDurationUpdate = 1000;
        var _animationEasingUpdate = 'quarticInOut';
        var _valOnRadianMax = Math.ceil(parseInt(kvahValue) + ((parseInt(kvahValue) * 20) / 100));//200//20;//200
        var _outerRadius = 50;//100;//200;
        var _innerRadius = 40;//70;//170;
        var _pointerInnerRadius = 10;//20;//40;
        var _insidePanelRadius = 20;//40//140;
        var _currentDataIndex = 0;
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
                            shadowColor: 'rgba(76,107,167,0.4)'
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
                            fontSize: 10,
                            fontWeight: 700,
                            x: params.coordSys.cx,
                            y: params.coordSys.cy,
                            fill: 'rgb(0,50,190)',
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
                alert('illegal during val: ' + valOnRadian);
            }
            return valOnRadian.toFixed(2);// ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
        }
        option7_a1 = {
            animationEasing: _animationEasingUpdate,
            animationDuration: _animationDuration,
            animationDurationUpdate: _animationDurationUpdate,
            animationEasingUpdate: _animationEasingUpdate,
            dataset: {
                source: [[1, kvahValue]]
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
        /*setInterval(function () {
          var nextSource = [[1, Math.round(Math.random7_a1() * _valOnRadianMax)]];
          myChart7_a1.setoption7_a1({
            dataset: {
              source: nextSource
            }
          });
        }, 3000);*/

        if (option7_a1 && typeof option7_a1 === 'object') {
            myChart7_a1.setOption(option7_a1);
        }

        window.addEventListener('resize', myChart7_a1.resize);

        if (option7_a1 && typeof option7_a1 === 'object') {
            myChart7_a1.setOption(option7_a1);
        }

        window.addEventListener('resize', function () {
            myChart7_a1.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart7_a1.resize();
        });


    }
    var _echartsEnergyConsumptionCumulative1EnergyDashboard = function (kwhValue) {

        /* CHART 1 */
        var dom7_a1 = document.getElementById('ecc-kwh-chart-container');
        var myChart7_a1 = echarts.init(dom7_a1, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app7_a1 = {};
        var ROOT_PATH = 'https://echarts.apache.org/examples';
        var option7_a1;

        var _panelImageURL = '../../../v2.0/energy/images/custom-gauge-panel.png';
        var _animationDuration = 1000;
        var _animationDurationUpdate = 1000;
        var _animationEasingUpdate = 'quarticInOut';
        var _valOnRadianMax = Math.ceil(parseInt(kwhValue) + ((parseInt(kwhValue) * 20) / 100));//200//20;//200//100000;//200
        var _outerRadius = 50;//100;//200;
        var _innerRadius = 40;//70;//170;
        var _pointerInnerRadius = 10;//20;//40;
        var _insidePanelRadius = 20;//40//140;
        var _currentDataIndex = 0;
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
                            shadowColor: 'rgba(76,107,167,0.4)'
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
                            fontSize: 10,
                            fontWeight: 700,
                            x: params.coordSys.cx,
                            y: params.coordSys.cy,
                            fill: 'rgb(0,50,190)',
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
                alert('illegal during val: ' + valOnRadian);
            }
            return valOnRadian.toFixed(2);//((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
        }
        option7_a1 = {
            animationEasing: _animationEasingUpdate,
            animationDuration: _animationDuration,
            animationDurationUpdate: _animationDurationUpdate,
            animationEasingUpdate: _animationEasingUpdate,
            dataset: {
                source: [[1, kwhValue]]
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
        /*setInterval(function () {
          var nextSource = [[1, Math.round(Math.random7_a1() * _valOnRadianMax)]];
          myChart7_a1.setoption7_a1({
            dataset: {
              source: nextSource
            }
          });
        }, 3000);*/

        if (option7_a1 && typeof option7_a1 === 'object') {
            myChart7_a1.setOption(option7_a1);
        }

        window.addEventListener('resize', myChart7_a1.resize);

        if (option7_a1 && typeof option7_a1 === 'object') {
            myChart7_a1.setOption(option7_a1);
        }

        window.addEventListener('resize', function () {
            myChart7_a1.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart7_a1.resize();
        });


    }
    var _echartsEnergyConsumptionCumulative2EnergyDashboard = function (kvahValue) {

        /* CHART 1 */
        var dom7_a1 = document.getElementById('ecc-kvah-chart-container');
        var myChart7_a1 = echarts.init(dom7_a1, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app7_a1 = {};
        var ROOT_PATH = 'https://echarts.apache.org/examples';
        var option7_a1;

        var _panelImageURL = '../../../v2.0/energy/images/custom-gauge-panel.png';
        var _animationDuration = 1000;
        var _animationDurationUpdate = 1000;
        var _animationEasingUpdate = 'quarticInOut';
        var _valOnRadianMax = Math.ceil(parseInt(kvahValue) + ((parseInt(kvahValue) * 20) / 100));//100000;//200
        var _outerRadius = 50;//100;//200;
        var _innerRadius = 40;//70;//170;
        var _pointerInnerRadius = 10;//20;//40;
        var _insidePanelRadius = 20;//40//140;
        var _currentDataIndex = 0;
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
                            shadowColor: 'rgba(76,107,167,0.4)'
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
                            fontSize: 10,
                            fontWeight: 700,
                            x: params.coordSys.cx,
                            y: params.coordSys.cy,
                            fill: 'rgb(0,50,190)',
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
                alert('illegal during val: ' + valOnRadian);
            }
            return valOnRadian.toFixed(2);// ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
        }
        option7_a1 = {
            animationEasing: _animationEasingUpdate,
            animationDuration: _animationDuration,
            animationDurationUpdate: _animationDurationUpdate,
            animationEasingUpdate: _animationEasingUpdate,
            dataset: {
                source: [[1, kvahValue]]
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
        /*setInterval(function () {
          var nextSource = [[1, Math.round(Math.random7_a1() * _valOnRadianMax)]];
          myChart7_a1.setoption7_a1({
            dataset: {
              source: nextSource
            }
          });
        }, 3000);*/

        if (option7_a1 && typeof option7_a1 === 'object') {
            myChart7_a1.setOption(option7_a1);
        }

        window.addEventListener('resize', myChart7_a1.resize);

        if (option7_a1 && typeof option7_a1 === 'object') {
            myChart7_a1.setOption(option7_a1);
        }

        window.addEventListener('resize', function () {
            myChart7_a1.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart7_a1.resize();
        });


    }
    var _echartsEnergyConsumptionAverage1EnergyDashboard = function (kwhValue) {

        /* CHART 1 */
        var dom7_a1 = document.getElementById('ecavg-kwh-chart-container');
        var myChart7_a1 = echarts.init(dom7_a1, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app7_a1 = {};
        var ROOT_PATH = 'https://echarts.apache.org/examples';
        var option7_a1;

        var _panelImageURL = '../../../v2.0/energy/images/custom-gauge-panel.png';
        var _animationDuration = 1000;
        var _animationDurationUpdate = 1000;
        var _animationEasingUpdate = 'quarticInOut';
        var _valOnRadianMax = Math.ceil(parseInt(kwhValue) + ((parseInt(kwhValue) * 20) / 100));//1;//200
        var _outerRadius = 50;//100;//200;
        var _innerRadius = 40;//70;//170;
        var _pointerInnerRadius = 10;//20;//40;
        var _insidePanelRadius = 20;//40//140;
        var _currentDataIndex = 0;
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
                            shadowColor: 'rgba(76,107,167,0.4)'
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
                            fontSize: 10,
                            fontWeight: 700,
                            x: params.coordSys.cx,
                            y: params.coordSys.cy,
                            fill: 'rgb(0,50,190)',
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
                alert('illegal during val: ' + valOnRadian);
            }
            return valOnRadian.toFixed(2);// ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
        }
        option7_a1 = {
            animationEasing: _animationEasingUpdate,
            animationDuration: _animationDuration,
            animationDurationUpdate: _animationDurationUpdate,
            animationEasingUpdate: _animationEasingUpdate,
            dataset: {
                source: [[1, kwhValue]]
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
        /*setInterval(function () {
          var nextSource = [[1, Math.round(Math.random7_a1() * _valOnRadianMax)]];
          myChart7_a1.setoption7_a1({
            dataset: {
              source: nextSource
            }
          });
        }, 3000);*/

        if (option7_a1 && typeof option7_a1 === 'object') {
            myChart7_a1.setOption(option7_a1);
        }

        window.addEventListener('resize', myChart7_a1.resize);

        if (option7_a1 && typeof option7_a1 === 'object') {
            myChart7_a1.setOption(option7_a1);
        }

        window.addEventListener('resize', function () {
            myChart7_a1.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart7_a1.resize();
        });


    }
    var _echartsEnergyConsumptionAverage2EnergyDashboard = function (kvahValue) {

        /* CHART 1 */
        var dom7_a1 = document.getElementById('ecavg-kvah-chart-container');
        var myChart7_a1 = echarts.init(dom7_a1, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app7_a1 = {};
        var ROOT_PATH = 'https://echarts.apache.org/examples';
        var option7_a1;

        var _panelImageURL = '../../../v2.0/energy/images/custom-gauge-panel.png';
        var _animationDuration = 1000;
        var _animationDurationUpdate = 1000;
        var _animationEasingUpdate = 'quarticInOut';
        var _valOnRadianMax = Math.ceil(parseInt(kvahValue) + ((parseInt(kvahValue) * 20) / 100));//1;//200
        var _outerRadius = 50;//100;//200;
        var _innerRadius = 40;//70;//170;
        var _pointerInnerRadius = 10;//20;//40;
        var _insidePanelRadius = 20;//40//140;
        var _currentDataIndex = 0;
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
                            shadowColor: 'rgba(76,107,167,0.4)'
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
                            fontSize: 10,
                            fontWeight: 700,
                            x: params.coordSys.cx,
                            y: params.coordSys.cy,
                            fill: 'rgb(0,50,190)',
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
                alert('illegal during val: ' + valOnRadian);
            }
            return valOnRadian.toFixed(2);// ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
        }
        option7_a1 = {
            animationEasing: _animationEasingUpdate,
            animationDuration: _animationDuration,
            animationDurationUpdate: _animationDurationUpdate,
            animationEasingUpdate: _animationEasingUpdate,
            dataset: {
                source: [[1, kvahValue]]
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
        /*setInterval(function () {
          var nextSource = [[1, Math.round(Math.random7_a1() * _valOnRadianMax)]];
          myChart7_a1.setoption7_a1({
            dataset: {
              source: nextSource
            }
          });
        }, 3000);*/

        if (option7_a1 && typeof option7_a1 === 'object') {
            myChart7_a1.setOption(option7_a1);
        }

        window.addEventListener('resize', myChart7_a1.resize);

        if (option7_a1 && typeof option7_a1 === 'object') {
            myChart7_a1.setOption(option7_a1);
        }

        window.addEventListener('resize', function () {
            myChart7_a1.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart7_a1.resize();
        });


    }

    return {
        init: function (TimeCategory) {
            _echartsEnergyConsumptionActual(TimeCategory);
            _echartsEnergyConsumptionCumulative(TimeCategory);
            _echartsEnergyConsumptionAverage(TimeCategory);
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    //default value will be Hot, user can select Warm and Cold later from UI
    EnergyConsumptionActualEnergyDashboard.init("Hot");
});
