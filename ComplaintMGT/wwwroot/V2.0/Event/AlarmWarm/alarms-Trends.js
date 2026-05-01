var alarmsTrends = function () {
  var _echartsLiveAlarmsTrend = function () {

    var dom = document.getElementById('liveAlarmsTrend');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var app = {};
    
    var option;
    
    function randomData() {
      now = new Date(+now + oneDay);
      value = value + Math.random() * 21 - 10;
      return {
        name: now.toString(),
        value: [
          [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
          Math.round(value)
        ]
      };
    }
    function randomData1() {
      now1 = new Date(+now1 + oneDay);
      value1 = value1 + Math.random() * 21 - 10;
      return {
        name: now1.toString(),
        value: [
          [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
          Math.round(value1)
        ]
      };
    }
    let data = [];
    let data1 = [];
    let now = new Date(1997, 9, 3);
    let now1 = new Date(1997, 5, 3);
    let oneDay = 24 * 3600 * 1000;
    let value = Math.random() * 1000;
    let value1 = Math.random() * 1500;
    for (var i = 0; i < 1000; i++) {
      data.push(randomData());
      data1.push(randomData1());
    }
    option = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          params = params[0];
          var date = new Date(params.name);
          return (
            date.getDate() +
            '/' +
            (date.getMonth() + 1) +
            '/' +
            date.getFullYear() +
            ' : ' +
            params.value[1]
          );
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: 'Fake Data C',
          type: 'line',
          showSymbol: false,
          data: data
        },
            {
          name: 'Fake Data D',
          type: 'line',
          showSymbol: false,
          data: data1
        }
      ]
    };
    setInterval(function () {
      for (var i = 0; i < 5; i++) {
        data.shift();
        data.push(randomData());
        data1.shift();
        data1.push(randomData1());
      }
      myChart.setOption({
        series: [
          {
            data: data
          },
                {
            data: data1
          }
        ]
      });
    }, 1000);
    
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

  var _echartsThermalTemperaturevsAlarms = function () {
    var dom = document.getElementById('thermalTemperaturevsAlarms');
var myChart = echarts.init(dom, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app = {};

var option;

const colors = ['#5470C6', '#EE6666'];
option = {
  color: colors,
  tooltip: {
    trigger: 'none',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {},
  grid: {
    top: 70,
    bottom: 50
  },
  xAxis: [
    {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        onZero: false,
        lineStyle: {
          color: colors[1]
        }
      },
      axisPointer: {
        label: {
          formatter: function (params) {
            return (
              'Precipitation  ' +
              params.value +
              (params.seriesData.length ? '：' + params.seriesData[0].data : '')
            );
          }
        }
      },
      // prettier-ignore
      data: ['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12']
    },
    {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        onZero: false,
        lineStyle: {
          color: colors[0]
        }
      },
      axisPointer: {
        label: {
          formatter: function (params) {
            return (
              'Precipitation  ' +
              params.value +
              (params.seriesData.length ? '：' + params.seriesData[0].data : '')
            );
          }
        }
      },
      // prettier-ignore
      data: ['2015-1', '2015-2', '2015-3', '2015-4', '2015-5', '2015-6', '2015-7', '2015-8', '2015-9', '2015-10', '2015-11', '2015-12']
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: 'Precipitation(2015)',
      type: 'line',
      xAxisIndex: 1,
      smooth: true,
      emphasis: {
        focus: 'series'
      },
      data: [
        2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
      ]
    },
    {
      name: 'Precipitation(2016)',
      type: 'line',
      smooth: true,
      emphasis: {
        focus: 'series'
      },
      data: [
        3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7
      ]
    }
  ]
};

if (option && typeof option === 'object') {
  myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);

document.addEventListener('DOMContentLoaded', function () {
  alarmsTrends.init();
  });
  
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

  var _echartsTrendvsAlarmsdistribution = function () {

    var dom = document.getElementById('trendvsAlarmsdistribution');
var myChart = echarts.init(dom, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app = {};

var option;

setTimeout(function () {
  option = {
    legend: {},
    tooltip: {
      trigger: 'axis',
      showContent: false
    },
    dataset: {
      source: [
        ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
        ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
        ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
        ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
        ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
      ]
    },
    xAxis: { type: 'category' },
    yAxis: { gridIndex: 0 },
    grid: { top: '55%' },
    series: [
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' }
      },
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' }
      },
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' }
      },
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' }
      },
      {
        type: 'pie',
        id: 'pie',
        radius: '30%',
        center: ['50%', '25%'],
        emphasis: {
          focus: 'self'
        },
        label: {
          formatter: '{b}: {@2012} ({d}%)'
        },
        encode: {
          itemName: 'product',
          value: '2012',
          tooltip: '2012'
        }
      }
    ]
  };
  myChart.on('updateAxisPointer', function (event) {
    const xAxisInfo = event.axesInfo[0];
    if (xAxisInfo) {
      const dimension = xAxisInfo.value + 1;
      myChart.setOption({
        series: {
          id: 'pie',
          label: {
            formatter: '{b}: {@[' + dimension + ']} ({d}%)'
          },
          encode: {
            value: dimension,
            tooltip: dimension
          }
        }
      });
    }
  });
  myChart.setOption(option);
});

if (option && typeof option === 'object') {
  myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);

document.addEventListener('DOMContentLoaded', function () {
  alarmsTrends.init();
  });
  
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
      _echartsLiveAlarmsTrend();
      _echartsThermalTemperaturevsAlarms();
      _echartsTrendvsAlarmsdistribution();
    }
}
}();

document.addEventListener('DOMContentLoaded', function () {
alarmsTrends.init();
});

if (option && typeof option === 'object') {
  myChart.setOption(option);
}

window.addEventListener('resize', function () {
  myChart.resize();
});

document.querySelector(".menu_button").addEventListener("click", function() {
  myChart.resize();
});
