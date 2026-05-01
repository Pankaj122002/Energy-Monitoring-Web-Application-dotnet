var EnergyConsumptionActualEnergyDashboard = function () {
  var _echartsEnergyConsumptionActual1EnergyDashboard = function () {

    /* CHART 1 */
var dom7_a1 = document.getElementById('chart-container7_a1');
var myChart7_a1 = echarts.init(dom7_a1, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app7_a1 = {};
var ROOT_PATH = 'https://echarts.apache.org/examples';
var option7_a1;

var _panelImageURL = ROOT_PATH + '/data/asset/img/custom-gauge-panel.png';
var _animationDuration = 1000;
var _animationDurationUpdate = 1000;
var _animationEasingUpdate = 'quarticInOut';
var _valOnRadianMax = 100;//200
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
  return ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
}
option7_a1 = {
  animationEasing: _animationEasingUpdate,
  animationDuration: _animationDuration,
  animationDurationUpdate: _animationDurationUpdate,
  animationEasingUpdate: _animationEasingUpdate,
  dataset: {
    source: [[1, 64]]
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

document.querySelector(".menu_button").addEventListener("click", function() {
  myChart7_a1.resize();
});


  }
  var _echartsEnergyConsumptionActual2EnergyDashboard = function () {

    /* CHART 1 */
var dom7_a1 = document.getElementById('chart-container7_a2');
var myChart7_a1 = echarts.init(dom7_a1, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app7_a1 = {};
var ROOT_PATH = 'https://echarts.apache.org/examples';
var option7_a1;

var _panelImageURL = ROOT_PATH + '/data/asset/img/custom-gauge-panel.png';
var _animationDuration = 1000;
var _animationDurationUpdate = 1000;
var _animationEasingUpdate = 'quarticInOut';
var _valOnRadianMax = 100;//200
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
  return ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
}
option7_a1 = {
  animationEasing: _animationEasingUpdate,
  animationDuration: _animationDuration,
  animationDurationUpdate: _animationDurationUpdate,
  animationEasingUpdate: _animationEasingUpdate,
  dataset: {
    source: [[1, 96]]
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

document.querySelector(".menu_button").addEventListener("click", function() {
  myChart7_a1.resize();
});


  }
  var _echartsEnergyConsumptionCumulative1EnergyDashboard = function () {

    /* CHART 1 */
var dom7_a1 = document.getElementById('chart-container7_a3');
var myChart7_a1 = echarts.init(dom7_a1, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app7_a1 = {};
var ROOT_PATH = 'https://echarts.apache.org/examples';
var option7_a1;

var _panelImageURL = ROOT_PATH + '/data/asset/img/custom-gauge-panel.png';
var _animationDuration = 1000;
var _animationDurationUpdate = 1000;
var _animationEasingUpdate = 'quarticInOut';
var _valOnRadianMax = 100;//200
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
  return ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
}
option7_a1 = {
  animationEasing: _animationEasingUpdate,
  animationDuration: _animationDuration,
  animationDurationUpdate: _animationDurationUpdate,
  animationEasingUpdate: _animationEasingUpdate,
  dataset: {
    source: [[1, 96]]
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

document.querySelector(".menu_button").addEventListener("click", function() {
  myChart7_a1.resize();
});


  }
  var _echartsEnergyConsumptionCumulative2EnergyDashboard = function () {

    /* CHART 1 */
var dom7_a1 = document.getElementById('chart-container7_a4');
var myChart7_a1 = echarts.init(dom7_a1, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app7_a1 = {};
var ROOT_PATH = 'https://echarts.apache.org/examples';
var option7_a1;

var _panelImageURL = ROOT_PATH + '/data/asset/img/custom-gauge-panel.png';
var _animationDuration = 1000;
var _animationDurationUpdate = 1000;
var _animationEasingUpdate = 'quarticInOut';
var _valOnRadianMax = 100;//200
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
  return ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
}
option7_a1 = {
  animationEasing: _animationEasingUpdate,
  animationDuration: _animationDuration,
  animationDurationUpdate: _animationDurationUpdate,
  animationEasingUpdate: _animationEasingUpdate,
  dataset: {
    source: [[1, 96]]
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

document.querySelector(".menu_button").addEventListener("click", function() {
  myChart7_a1.resize();
});


  }
  var _echartsEnergyConsumptionAverage1EnergyDashboard = function () {

    /* CHART 1 */
var dom7_a1 = document.getElementById('chart-container7_a5');
var myChart7_a1 = echarts.init(dom7_a1, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app7_a1 = {};
var ROOT_PATH = 'https://echarts.apache.org/examples';
var option7_a1;

var _panelImageURL = ROOT_PATH + '/data/asset/img/custom-gauge-panel.png';
var _animationDuration = 1000;
var _animationDurationUpdate = 1000;
var _animationEasingUpdate = 'quarticInOut';
var _valOnRadianMax = 100;//200
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
  return ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
}
option7_a1 = {
  animationEasing: _animationEasingUpdate,
  animationDuration: _animationDuration,
  animationDurationUpdate: _animationDurationUpdate,
  animationEasingUpdate: _animationEasingUpdate,
  dataset: {
    source: [[1, 96]]
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

document.querySelector(".menu_button").addEventListener("click", function() {
  myChart7_a1.resize();
});


  }
  var _echartsEnergyConsumptionAverage2EnergyDashboard = function () {

    /* CHART 1 */
var dom7_a1 = document.getElementById('chart-container7_a6');
var myChart7_a1 = echarts.init(dom7_a1, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app7_a1 = {};
var ROOT_PATH = 'https://echarts.apache.org/examples';
var option7_a1;

var _panelImageURL = ROOT_PATH + '/data/asset/img/custom-gauge-panel.png';
var _animationDuration = 1000;
var _animationDurationUpdate = 1000;
var _animationEasingUpdate = 'quarticInOut';
var _valOnRadianMax = 100;//200
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
  return ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
}
option7_a1 = {
  animationEasing: _animationEasingUpdate,
  animationDuration: _animationDuration,
  animationDurationUpdate: _animationDurationUpdate,
  animationEasingUpdate: _animationEasingUpdate,
  dataset: {
    source: [[1, 96]]
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

document.querySelector(".menu_button").addEventListener("click", function() {
  myChart7_a1.resize();
});


  }
  
  return {
      init: function () {
          _echartsEnergyConsumptionActual1EnergyDashboard();
          _echartsEnergyConsumptionActual2EnergyDashboard();
          _echartsEnergyConsumptionCumulative1EnergyDashboard();
          _echartsEnergyConsumptionCumulative2EnergyDashboard();
          _echartsEnergyConsumptionAverage1EnergyDashboard();
          _echartsEnergyConsumptionAverage2EnergyDashboard();
      }
  }
}();

document.addEventListener('DOMContentLoaded', function () {
  EnergyConsumptionActualEnergyDashboard.init();
});

















/*CHART 3*/

/*var dom7_b1 = document.getElementById('chart-container7_b1');
var myChart7_b1 = echarts.init(dom7_b1, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app7_b1 = {};
var ROOT_PATH = 'https://echarts.apache.org/examples';
var option7_b1;

var _panelImageURL = ROOT_PATH + '/data/asset/img/custom-gauge-panel.png';
var _animationDuration = 1000;
var _animationDurationUpdate = 1000;
var _animationEasingUpdate = 'quarticInOut';
var _valOnRadianMax = 200;
var _outerRadius = 110;
var _innerRadius = 80;
var _pointerInnerRadius = 40;
var _insidePanelRadius = 50;
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
          fontSize: 20,
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
  return ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + '%';
}
option7_b1 = {
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
  var nextSource = [[1, Math.round(Math.random7_b1() * _valOnRadianMax)]];
  myChart7_b1.setoption7_b1({
    dataset: {
      source: nextSource
    }
  });
}, 3000);

if (option7_b1 && typeof option7_b1 === 'object') {
  myChart7_b1.setOption(option7_b1);
}

window.addEventListener('resize', myChart7_b1.resize);

if (option7_b1 && typeof option7_b1 === 'object') {
  myChart7_b1.setOption(option7_b1);
}

window.addEventListener('resize', function () {
  myChart7_b1.resize();
});

document.querySelector(".menu_button").addEventListener("click", function() {
  myChart7_b1.resize();
});*/



