console.log("HELLO");
var controlEnablementDashboard = function () {

    var _echartsCG1ChartDashboard = function () {

        var dom = document.getElementById('cg1');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        var ROOT_PATH = 'https://echarts.apache.org/examples';
        var option;

        var _panelImageURL = '../images/assets/blueGauge.png';//'http://bbk-dev.syncotics.com/assets/images/gauge_orange.png';
        var _animationDuration = 1000;
        var _animationDurationUpdate = 1000;
        var _animationEasingUpdate = 'quarticInOut';
        var _valOnRadianMax = 200;
        var _outerRadius = 50;
        var _innerRadius = 42.5;
        var _pointerInnerRadius = 10;
        var _insidePanelRadius = 35;
        var _currentDataIndex = 0;
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
                            shadowColor: 'rgba(23, 196, 221, 0.4)'
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
                            fontSize: 13,
                            fontWeight: 700,
                            x: params.coordSys.cx,
                            y: params.coordSys.cy,
                            fill: 'rgb(23, 196, 221)',
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
            return ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
        }
        option = {
            animationEasing: _animationEasingUpdate,
            animationDuration: _animationDuration,
            animationDurationUpdate: _animationDurationUpdate,
            animationEasingUpdate: _animationEasingUpdate,
            dataset: {
                source: [[1, 156]]
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
        setInterval(function () {
            var nextSource = [[1, Math.round(Math.random() * _valOnRadianMax)]];
            myChart.setOption({
                dataset: {
                    source: nextSource
                }
            });
        }, 3000);

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

    var _echartsCG2ChartDashboard = function () {

        var dom = document.getElementById('cg2');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        var ROOT_PATH = 'https://echarts.apache.org/examples';
        var option;

        var _panelImageURL = '../images/assets/darkBlueGauge.png';//'http://bbk-dev.syncotics.com/assets/images/gauge_orange.png';
        var _animationDuration = 1000;
        var _animationDurationUpdate = 1000;
        var _animationEasingUpdate = 'quarticInOut';
        var _valOnRadianMax = 200;
        var _outerRadius = 50;
        var _innerRadius = 42.5;
        var _pointerInnerRadius = 10;
        var _insidePanelRadius = 35;
        var _currentDataIndex = 0;
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
                            shadowColor: 'rgba(18, 97, 140, 0.4)'
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
                            fontSize: 13,
                            fontWeight: 700,
                            x: params.coordSys.cx,
                            y: params.coordSys.cy,
                            fill: 'rgb(18, 97, 140)',
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
            return ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
        }
        option = {
            animationEasing: _animationEasingUpdate,
            animationDuration: _animationDuration,
            animationDurationUpdate: _animationDurationUpdate,
            animationEasingUpdate: _animationEasingUpdate,
            dataset: {
                source: [[1, 156]]
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
        setInterval(function () {
            var nextSource = [[1, Math.round(Math.random() * _valOnRadianMax)]];
            myChart.setOption({
                dataset: {
                    source: nextSource
                }
            });
        }, 3000);

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

    var _echartsCG3ChartDashboard = function () {

        var dom5 = document.getElementById('alarms-container4');
        var myChart5 = echarts.init(dom5, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app5 = {};

        var option5;

        const gaugeData = [
            {
                value: 20,
                name: 'Critical',
                title: {
                    offsetCenter: ['0%', '-50%']
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '-40%']
                }
            },
            {
                value: 40,
                name: 'Major',
                title: {
                    offsetCenter: ['0%', '-18%']
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '-8%']
                }
            },
            {
                value: 70,
                name: 'Minor',
                title: {
                    offsetCenter: ['0%', '5%']
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '15%']
                }
            },
            {
                value: 60,
                name: 'Warning',
                title: {
                    offsetCenter: ['0%', '30%']
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '45%']
                }
            }
        ];
        option5 = {
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
                            width: 15
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
                        fontSize: 8
                    },
                    detail: {
                        width: 40,
                        height: 2,
                        fontSize: 8,
                        color: 'inherit',
                        borderColor: 'inherit',
                        borderRadius: 20,
                        borderWidth: 1,
                        formatter: '{value}%'
                    }
                }
            ]
        };
        setInterval(function () {
            gaugeData[0].value = +(Math.random5() * 100).toFixed(2);
            gaugeData[1].value = +(Math.random5() * 100).toFixed(2);
            gaugeData[2].value = +(Math.random5() * 100).toFixed(2);
            gaugeData[2].value = +(Math.random5() * 100).toFixed(2);
            myChart5.setOption({
                series: [
                    {
                        data: gaugeData,
                        pointer: {
                            show: false
                        }
                    }
                ]
            });
        }, 2000);

        if (option5 && typeof option5 === 'object') {
            myChart5.setOption(option5);
        }

        window.addEventListener('resize', myChart5.resize);

        if (option5 && typeof option5 === 'object') {
            myChart5.setOption(option5);
        }

        window.addEventListener('resize', function () {
            myChart5.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart5.resize();
        });


    }
    var _echartsCG4ChartDashboard = function () {

        var dom = document.getElementById('cg4');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        var ROOT_PATH = 'https://echarts.apache.org/examples';
        var option;

        var _panelImageURL = '../images/assets/darkPinkGauge.png';//'http://bbk-dev.syncotics.com/assets/images/gauge_orange.png';
        var _animationDuration = 1000;
        var _animationDurationUpdate = 1000;
        var _animationEasingUpdate = 'quarticInOut';
        var _valOnRadianMax = 200;
        var _outerRadius = 50;
        var _innerRadius = 42.5;
        var _pointerInnerRadius = 10;
        var _insidePanelRadius = 35;
        var _currentDataIndex = 0;
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
                            shadowColor: 'rgba(165, 54, 112, 0.4)'
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
                            fontSize: 13,
                            fontWeight: 700,
                            x: params.coordSys.cx,
                            y: params.coordSys.cy,
                            fill: 'rgb(165, 54, 112)',
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
            return ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
        }
        option = {
            animationEasing: _animationEasingUpdate,
            animationDuration: _animationDuration,
            animationDurationUpdate: _animationDurationUpdate,
            animationEasingUpdate: _animationEasingUpdate,
            dataset: {
                source: [[1, 156]]
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
        setInterval(function () {
            var nextSource = [[1, Math.round(Math.random() * _valOnRadianMax)]];
            myChart.setOption({
                dataset: {
                    source: nextSource
                }
            });
        }, 3000);

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

    var _echartsControl1ChartDashboard = function () {
        console.log("HELLO _echartsControl1ChartDashboard");
        var dom = document.getElementById('control1');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        var series = [
            {
                data: [0, 0, 0, 0, 70, 110, 130],
                type: 'bar',
                stack: 'a',
                name: 'a'
            },
            {
                data: [0, 40, 64, '-', 0, '-', 0],
                type: 'bar',
                stack: 'a',
                name: 'b'
            },
            {
                data: [30, '-', 0, 20, 10, '-', 0],
                type: 'bar',
                stack: 'a',
                name: 'c'
            },
            {
                data: [0, '-', 0, 20, 10, '-', 0],
                type: 'bar',
                stack: 'b',
                name: 'd'
            },
            {
                data: [10, 20, 95, 0, '-', 50, 10],
                type: 'bar',
                stack: 'b',
                name: 'e'
            }
        ];
        const stackInfo = {};
        for (let i = 0; i < series[0].data.length; ++i) {
            for (let j = 0; j < series.length; ++j) {
                const stackName = series[j].stack;
                if (!stackName) {
                    continue;
                }
                if (!stackInfo[stackName]) {
                    stackInfo[stackName] = {
                        stackStart: [],
                        stackEnd: []
                    };
                }
                const info = stackInfo[stackName];
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
            const info = stackInfo[series[i].stack];
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
        option = {
            xAxis: {
                type: 'category',
                data: ['September', 'October', 'November', 'December']
            },
            yAxis: {
                type: 'value'
            },
            series: series
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

    var _echartsControl2ChartDashboard = function () {
        var dom = document.getElementById('control2');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        var series = [
            {
                data: [0, 0, 0, 0, 70, 110, 130],
                type: 'bar',
                stack: 'a',
                name: 'a'
            },
            {
                data: [0, 40, 64, '-', 0, '-', 0],
                type: 'bar',
                stack: 'a',
                name: 'b'
            },
            {
                data: [30, '-', 0, 67, 10, '-', 0],
                type: 'bar',
                stack: 'a',
                name: 'c'
            },
            {
                data: [0, '-', 0, 49, 10, '-', 0],
                type: 'bar',
                stack: 'b',
                name: 'd'
            },
            {
                data: [10, 59, 35, 0, '-', 50, 10],
                type: 'bar',
                stack: 'b',
                name: 'e'
            }
        ];
        const stackInfo = {};
        for (let i = 0; i < series[0].data.length; ++i) {
            for (let j = 0; j < series.length; ++j) {
                const stackName = series[j].stack;
                if (!stackName) {
                    continue;
                }
                if (!stackInfo[stackName]) {
                    stackInfo[stackName] = {
                        stackStart: [],
                        stackEnd: []
                    };
                }
                const info = stackInfo[stackName];
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
            const info = stackInfo[series[i].stack];
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
        option = {
            xAxis: {
                type: 'category',
                data: ['September', 'October', 'November', 'December']
            },
            yAxis: {
                type: 'value'
            },
            series: series
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






    return {
        init: function () {
            console.log("HELLO init");

            // _echartsCG1ChartDashboard();
            console.log("HELLO init 1");
            // _echartsCG2ChartDashboard();
            console.log("HELLO init 2");
            _echartsCG3ChartDashboard();
            console.log("HELLO init 3");
            // _echartsCG4ChartDashboard();
            console.log("HELLO init 4");
            _echartsControl1ChartDashboard();
            console.log("HELLO init 5");
            _echartsControl2ChartDashboard();
            console.log("HELLO init 6");
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    console.log("HELLO DOMContentLoaded");
    controlEnablementDashboard.init();
});
