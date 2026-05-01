var dom5 = document.getElementById('chart-container4');
var myChart5 = echarts.init(dom5, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app5 = {};

var option5;

const gaugeData = [
  {
    value: 20,
    name: 'Perfect',
    title: {
      offsetCenter: ['0%', '-50%']
    },
    detail: {
      valueAnimation: true,
      offsetCenter: ['0%', '-35%']
    }
  },
  {
    value: 40,
    name: 'Good',
    title: {
      offsetCenter: ['0%', '-10%']
    },
    detail: {
      valueAnimation: true,
      offsetCenter: ['0%', '5%']
    }
  },
  {
    value: 60,
    name: 'Commonly',
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
          width: 30
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
        fontSize: 10
      },
      detail: {
        width: 48,
        height: 3,
        fontSize: 10,
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

document.querySelector(".menu_button").addEventListener("click", function() {
  myChart5.resize();
});