
var RefrigerationDashboard = function () {
  var _echartsRefrigerationChartDashboard = function () {
    var dom3 = document.getElementById('chart-container1_a');
var myChart3 = echarts.init(dom3, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app = {};

var option3;

// This example requires ECharts v5.5.0 or later
option3 = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    left: 'center'
  },
  series: [
    {
      /*name: 'Access From',*/
      type: 'pie',
      radius: ['40%', '100%'],
      center: ['50%', '100%'],
      // adjust the start and end angle
      startAngle: 180,
      endAngle: 360,
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
};

if (option3 && typeof option3 === 'object') {
  myChart3.setOption(option3);
}

window.addEventListener('resize', myChart3.resize);

if (option3 && typeof option3 === 'object') {
  myChart3.setOption(option3);
}

window.addEventListener('resize', function () {
  myChart3.resize();
});

document.querySelector(".menu_button").addEventListener("click", function() {
  myChart3.resize();
});


  }

  return {
      init: function () {
          _echartsRefrigerationChartDashboard();
      }
  }
}();

document.addEventListener('DOMContentLoaded', function () {
  RefrigerationDashboard.init();
});


