var dom = document.getElementById('avg-health-index-chart-container');
var avgHealthIndexChart = echarts.init(dom, null, {
    renderer: 'canvas',
    useDirtyRect: false
});
var app = {};

var option;

option = {
    series: [
        {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 60,
            splitNumber: 12,
            itemStyle: {
                color: '#FFAB91'
            },
            progress: {
                show: true,
                width: 10
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
                distance: 0,
                color: '#999',
                fontSize: 10
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
                formatter: '{value} °C',
                color: 'inherit'
            },
            data: [
                {
                    value: 34
                }
            ]
        },
        {
            type: 'gauge',
            center: ['50%', '60%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 60,
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
                show: false
            },
            data: [
                {
                    value: 34
                }
            ]
        }
    ]
};
setInterval(function () {
    const random = 34;
    avgHealthIndexChart.setOption({
        series: [
            {
                data: [
                    {
                        value: random
                    }
                ]
            },
            {
                data: [
                    {
                        value: random
                    }
                ]
            }
        ]
    });
}, 2000);

if (option && typeof option === 'object') {
    avgHealthIndexChart.setOption(option);
}
avgHealthIndexChart.resize();
window.addEventListener('resize', avgHealthIndexChart.resize);
