var helpDeskDashboard = function () {

  var _echartsNewTicketsvsClosedChartDashboard = function () {
    var dom = document.getElementById('ntvc');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var app = {};

    var option;

    option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {},
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} °C'
        }
      },
      series: [
        {
          name: 'Highest',
          type: 'line',
          data: [10, 11, 13, 11, 12, 12, 9],
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' }
            ]
          },
          markLine: {
            data: [{ type: 'average', name: 'Avg' }]
          }
        },
        {
          name: 'Lowest',
          type: 'line',
          data: [1, -2, 2, 5, 3, 2, 0],
          markPoint: {
            data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }]
          },
          markLine: {
            data: [
              { type: 'average', name: 'Avg' },
              [
                {
                  symbol: 'none',
                  x: '90%',
                  yAxis: 'max'
                },
                {
                  symbol: 'circle',
                  label: {
                    position: 'start',
                    formatter: 'Max'
                  },
                  type: 'max',
                  name: '最高点'
                }
              ]
            ]
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
    
    document.querySelector(".menu_button").addEventListener("click", function() {
      myChart.resize();
    });

  }

  var _echartsTicket1ChartDashboard = function () {

    var dom = document.getElementById('ticketA');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var app = {};
    var ROOT_PATH = 'https://echarts.apache.org/examples';
    var option;
    
    var _panelImageURL = '../images/assets/blue_gauge.png';//'http://bbk-dev.syncotics.com/assets/images/gauge_orange.png';
    var _animationDuration = 1000;
    var _animationDurationUpdate = 1000;
    var _animationEasingUpdate = 'quarticInOut';
    //CHANGE DIMENSION OF GAUGE FROM HERE
    var _valOnRadianMax = 150;//200
    var _outerRadius = 72;//100;//200;
    var _innerRadius = 54;//70;//170;
    var _pointerInnerRadius = 12;//20;//40;
    var _insidePanelRadius = 24;//40//140;
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
              shadowColor: 'rgba(67, 200, 209, 0.4)'
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
              fill: 'rgb(67, 200, 209)',
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
    
    document.querySelector(".menu_button").addEventListener("click", function() {
      myChart.resize();
    });

  }

  var _echartsTicket2ChartDashboard = function () {

    var dom = document.getElementById('ticketB');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var app = {};
    var ROOT_PATH = 'https://echarts.apache.org/examples';
    var option;
    
    var _panelImageURL = '../images/assets/lightPinkGauge.png';//'http://bbk-dev.syncotics.com/assets/images/gauge_orange.png';
    var _animationDuration = 1000;
    var _animationDurationUpdate = 1000;
    var _animationEasingUpdate = 'quarticInOut';
    //CHANGE DIMENSION OF GAUGE FROM HERE
    var _valOnRadianMax = 150;//200
    var _outerRadius = 72;//100;//200;
    var _innerRadius = 54;//70;//170;
    var _pointerInnerRadius = 12;//20;//40;
    var _insidePanelRadius = 24;//40//140;
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
              shadowColor: 'rgba(251, 112, 205, 0.4)'
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
              fill: 'rgb(251, 112, 205)',
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
    
    document.querySelector(".menu_button").addEventListener("click", function() {
      myChart.resize();
    });

  }

  var _echartsTicket3ChartDashboard = function () {

    var dom = document.getElementById('ticketC');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var app = {};
    var ROOT_PATH = 'https://echarts.apache.org/examples';
    var option;
    
    var _panelImageURL = '../images/assets/orangeGauge.png';//'http://bbk-dev.syncotics.com/assets/images/gauge_orange.png';
    var _animationDuration = 1000;
    var _animationDurationUpdate = 1000;
    var _animationEasingUpdate = 'quarticInOut';
    //CHANGE DIMENSION OF GAUGE FROM HERE
    var _valOnRadianMax = 150;//200
    var _outerRadius = 72;//100;//200;
    var _innerRadius = 54;//70;//170;
    var _pointerInnerRadius = 12;//20;//40;
    var _insidePanelRadius = 24;//40//140;
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
              shadowColor: 'rgba(255, 170, 79, 0.4)'
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
              fill: 'rgb(255, 170, 79)',
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
    
    document.querySelector(".menu_button").addEventListener("click", function() {
      myChart.resize();
    });

  }

  var _echartsTicket4ChartDashboard = function () {

    var dom = document.getElementById('ticketD');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var app = {};
    var ROOT_PATH = 'https://echarts.apache.org/examples';
    var option;
    
    var _panelImageURL = '../images/assets/darkBluegauge.png';//'http://bbk-dev.syncotics.com/assets/images/gauge_orange.png';
    var _animationDuration = 1000;
    var _animationDurationUpdate = 1000;
    var _animationEasingUpdate = 'quarticInOut';
    //CHANGE DIMENSION OF GAUGE FROM HERE
    var _valOnRadianMax = 150;//200
    var _outerRadius = 72;//100;//200;
    var _innerRadius = 54;//70;//170;
    var _pointerInnerRadius = 12;//20;//40;
    var _insidePanelRadius = 24;//40//140;
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
              shadowColor: 'rgba(67, 200, 209, 0.4)'
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
              fill: 'rgb(67, 200, 209)',
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
    
    document.querySelector(".menu_button").addEventListener("click", function() {
      myChart.resize();
    });

  }

  var _echartsTicket5ChartDashboard = function () {

    var dom = document.getElementById('ticketE');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var app = {};
    var ROOT_PATH = 'https://echarts.apache.org/examples';
    var option;
    
    var _panelImageURL = '../images/assets/darkPinkgauge.png';//'http://bbk-dev.syncotics.com/assets/images/gauge_orange.png';
    var _animationDuration = 1000;
    var _animationDurationUpdate = 1000;
    var _animationEasingUpdate = 'quarticInOut';
    //CHANGE DIMENSION OF GAUGE FROM HERE
    var _valOnRadianMax = 150;//200
    var _outerRadius = 72;//100;//200;
    var _innerRadius = 54;//70;//170;
    var _pointerInnerRadius = 12;//20;//40;
    var _insidePanelRadius = 24;//40//140;
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
              shadowColor: 'rgba(169, 63, 118, 0.4)'
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
              fill: 'rgb(169, 63, 118)',
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
    
    document.querySelector(".menu_button").addEventListener("click", function() {
      myChart.resize();
    });

  }



  return {
    init: function () {

      _echartsNewTicketsvsClosedChartDashboard();
      _echartsTicket1ChartDashboard();
      _echartsTicket2ChartDashboard();
      _echartsTicket3ChartDashboard();
      _echartsTicket4ChartDashboard();
      _echartsTicket5ChartDashboard();
      
    }
  }

  }();

  document.addEventListener('DOMContentLoaded', function () {
    helpDeskDashboard.init();
    });









