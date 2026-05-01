var dom4 = document.getElementById('hvac-chart-container');
var myChart4 = echarts.init(dom4, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app = {};

var option4;

// This example requires ECharts v5.5.0 or later
option4 = {
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
      radius: ['40%', '80%'],
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

if (option4 && typeof option4 === 'object') {
  myChart4.setOption(option4);
}

window.addEventListener('resize', myChart4.resize);

if (option4 && typeof option4 === 'object') {
  myChart4.setOption(option4);
}

window.addEventListener('resize', function () {
  myChart4.resize();
});

document.querySelector(".menu_button").addEventListener("click", function() {
  myChart4.resize();
});









var dom5 = document.getElementById('chart-container5');
var myChart5 = echarts.init(dom5, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app = {};

var option5;

// This example requires ECharts v5.5.0 or later
option5 = {
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
      radius: ['40%', '70%'],
      center: ['50%', '70%'],
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

document.querySelector(".menu_button").addEventListener("click", function() {
  myChart5.resize();
});


