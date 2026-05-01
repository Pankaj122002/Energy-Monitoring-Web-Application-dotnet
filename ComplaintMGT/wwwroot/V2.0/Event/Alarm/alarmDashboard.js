var alarmsDashboard = function () {

    // Function to get date string in 'YYYY-MM-DD HH:mm' format
    function formatDate(date) {
        const pad = num => num.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }


    // Calculate last 7 days range from 12:00 AM to now
    function gettodayRange() {
        const toDate = new Date(); // Current date & time

        const fromDate = new Date(toDate); // Copy current date
        fromDate.setDate(toDate.getDate()); // 0 days ago
        fromDate.setHours(0, 0, 0, 0); // Set time to 12:00 AM

        return {
            from: formatDate(fromDate),
            to: formatDate(toDate)
        };
    }

    function getLastHourRange() {
        const toDate = new Date();
        const fromDate = new Date(toDate);
        fromDate.setHours(toDate.getHours() - 1);
        return {
            from1: formatDate(fromDate),
            to1: formatDate(toDate)
        };
    }

    const { from1, to1 } = getLastHourRange();

    const { from, to } = gettodayRange();

    

    // ECharts logic remains unchanged
    var _echartsalarmsA1ChartDashboard = function () {
        var dom3 = document.getElementById('alarms-container1');
        var myChart = echarts.init(dom3, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        myChart.showLoading();
        $.ajax({
            type: "GET",
            url: "/deshboard/GetAlertCountByDateTime_Hot?from=" + from + "&to=" + to,
            data: {},
            success: function (data) {
                myChart.hideLoading();
                let jsonObject = JSON.parse(data);
                let alertCount = jsonObject[0].AlertCount;
                let element = document.querySelector('.a1T2');
                element.textContent = alertCount;

                var option3 = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        left: 'center'
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: ['40%', '80%'],
                            center: ['50%', '100%'],
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
                    myChart.setOption(option3);
                }

                window.addEventListener('resize', myChart.resize);
            }
        });

        window.addEventListener('resize', function () {
            myChart.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart.resize();
        });
    }



    var _echartsalarmsA2ChartDashboard = function () {
        var dom3 = document.getElementById('alarms-container2');
        var myChart = echarts.init(dom3, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        myChart.showLoading();

        $.ajax({
            type: "GET",
            url: "/deshboard/GetAlertCountByDateTime_Hot?from=" + from + "&to=" + to,
            data: {},
            success: function (data) {
                myChart.hideLoading();
                let thermalarray = [];
                let jsonObject = JSON.parse(data);
                let alertCount = jsonObject[0].AlertCount;
                thermalarray.push({ value: alertCount, name: "Thermal" });

                var option3 = {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        left: 'center'
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: ['40%', '80%'],
                            center: ['50%', '100%'],
                            startAngle: 180,
                            endAngle: 360,
                            data: thermalarray
                        }
                    ]
                };

                if (option3 && typeof option3 === 'object') {
                    myChart.setOption(option3);
                }

                window.addEventListener('resize', myChart.resize);
            }
        });

        window.addEventListener('resize', function () {
            myChart.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart.resize();
        });
    }


    var _echartsalarmsA3ChartDashboard = function () {
        var dom3 = document.getElementById('alarms-container3');
        var myChart = echarts.init(dom3, null, {
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

        if (option3 && typeof option3 === 'object') {
            myChart.setOption(option3);
        }

        window.addEventListener('resize', myChart.resize);

        if (option3 && typeof option3 === 'object') {
            myChart.setOption(option3);
        }

        window.addEventListener('resize', function () {
            myChart.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart.resize();
        });


    }

    var _echartsalarmsB1ChartDashboard = function () {

        var dom5 = document.getElementById('alarms-container4');
        var myChart = echarts.init(dom5, null, {
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
            gaugeData[0].value = +(Math.random() * 100).toFixed(2);
            gaugeData[1].value = +(Math.random() * 100).toFixed(2);
            gaugeData[2].value = +(Math.random() * 100).toFixed(2);
            myChart.setOption({
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
            myChart.setOption(option5);
        }

        window.addEventListener('resize', myChart.resize);

        if (option5 && typeof option5 === 'object') {
            myChart.setOption(option5);
        }

        window.addEventListener('resize', function () {
            myChart.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart.resize();
        });


    }



    var _echartsEnergyAlarmsA1ChartDashboard = function () {

        var dom = document.getElementById('energy_AlarmsA1');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        var series = [
            {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                stack: 'a',
                name: 'a'
            },
            {
                data: [10, 46, 64, '-', 0, '-', 0],
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
                data: [30, '-', 0, 20, 10, '-', 0],
                type: 'bar',
                stack: 'b',
                name: 'd'
            },
            {
                data: [10, 20, 150, 0, '-', 50, 10],
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
                data: ['Mon', 'Tue']
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

    var _echartsEnergyAlarmsA2ChartDashboard = function () {

        var dom = document.getElementById('energyAlarmsA2');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        var series = [
            {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                stack: 'a',
                name: 'a'
            },
            {
                data: [10, 46, 64, '-', 0, '-', 0],
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
                data: [30, '-', 0, 20, 10, '-', 0],
                type: 'bar',
                stack: 'b',
                name: 'd'
            },
            {
                data: [10, 20, 150, 0, '-', 50, 10],
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
                data: ['Mon', 'Tue']
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
   

    var _echartsThermalAlarmsChartDashboard = function () {
        var dom = document.getElementById('thermal_Alarms');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        
        myChart.showLoading();
        

        // Fetch data for both time ranges
        Promise.all([
            $.ajax({
                type: "GET",
                url: "/deshboard/GetAlertCountByDateTime_Hot?from=" + from1 + "&to=" + to1
            }),
            $.ajax({
                type: "GET",
                url: "/deshboard/GetAlertCountByDateTime_Hot?from=" + from + "&to=" + to
            })
        ]).then(function (responses) {
            myChart.hideLoading();
            var thermalArray = [];

            // Parse the responses
            let data1 = JSON.parse(responses[0]);
            let data2 = JSON.parse(responses[1]);

            let alertCount1 = data1[0].AlertCount;
            let alertCount2 = data2[0].AlertCount;

            thermalArray.push(alertCount1);
            thermalArray.push(alertCount2);

            // Prepare series data
            var series = [
                {
                    data: thermalArray,
                    type: 'bar',
                    name: 'Thermal Alarms',
                    stack: 'b'
                }
            ];

            // Add rounded bar styling
            const stackInfo = {};
            for (let i = 0; i < series[0].data.length; ++i) {
                for (let j = 0; j < series.length; ++j) {
                    const stackName = series[j].stack;
                    if (!stackName) continue;
                    if (!stackInfo[stackName]) {
                        stackInfo[stackName] = { stackStart: [], stackEnd: [] };
                    }
                    const info = stackInfo[stackName];
                    const data = series[j].data[i];
                    if (data && data !== '-') {
                        if (info.stackStart[i] == null) info.stackStart[i] = j;
                        info.stackEnd[i] = j;
                    }
                }
            }

            for (let i = 0; i < series.length; ++i) {
                const data = series[i].data;
                const info = stackInfo[series[i].stack];
                for (let j = 0; j < data.length; ++j) {
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
            
            // Set chart options
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        let result = params[0].name + '<br/>';
                        params.forEach(param => {
                            result += param.marker + ' ' + param.seriesName + ': ' +
                                param.value.toLocaleString() + '<br/>';
                        });
                        return result;
                    }
                },
                grid: {
                    left: '0px',  // More space for y-axis labels
                    right: '20px',
                    top: '30px',
                    bottom: '50px',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: ['Last Hour', 'Today']
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: function (value) {
                            // Format large numbers with 'K' suffix
                            if (value >= 1000) {
                                return (value / 1000).toFixed(1) + 'K';
                            }
                            return value;
                        },
                        fontSize: 12
                    }
                },
                series: series
            };

            // Render the chart
            if (option && typeof option === 'object') {
                myChart.setOption(option);
            }

            window.addEventListener('resize', function () {
                myChart.resize();
            });

            document.querySelector(".menu_button").addEventListener("click", function () {
                myChart.resize();
            });
        }).catch(function (error) {
            myChart.hideLoading();
            console.error("Error fetching data: ", error);
        });
    };




    

    var _echartsElectricalAlarmsChartDashboard = function () {

        var dom = document.getElementById('electrical_Alarms');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        var series = [
            {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                stack: 'a',
                name: 'a'
            },
            {
                data: [10, 46, 64, '-', 0, '-', 0],
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
                data: [30, '-', 0, 20, 10, '-', 0],
                type: 'bar',
                stack: 'b',
                name: 'd'
            },
            {
                data: [10, 20, 150, 0, '-', 50, 10],
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
                data: ['Mon', 'Tue']
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

    var _echartsOpsSchedule1ChartDashboard = function () {
        var dom5 = document.getElementById('opsSchedule1');
        var myChart = echarts.init(dom5, null, {
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
            gaugeData[0].value = +(Math.random() * 100).toFixed(2);
            gaugeData[1].value = +(Math.random() * 100).toFixed(2);
            gaugeData[2].value = +(Math.random() * 100).toFixed(2);
            myChart.setOption({
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
            myChart.setOption(option5);
        }

        window.addEventListener('resize', myChart.resize);

        if (option5 && typeof option5 === 'object') {
            myChart.setOption(option5);
        }

        window.addEventListener('resize', function () {
            myChart.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart.resize();
        });

    }


    var _echartsOpsSchedule2ChartDashboard = function () {
        var dom5 = document.getElementById('opsSchedule2');

        // Validate DOM element exists
        if (!dom5) {
            console.error("DOM element 'opsSchedule2' not found");
            return;
        }

        var myChart = echarts.init(dom5, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        myChart.showLoading();

        $.ajax({
            type: "GET",
            url: "/deshboard/GetAlertCount_OpsNonOpsPercentage?from=" + from + "&to=" + to,
            success: function (data) {
                myChart.hideLoading();
                try {
                    let jsonObject = JSON.parse(data);
                    let opsPercentage = jsonObject[0].OpsPercentage || 0;
                    let nonOpsPercentage = jsonObject[0].NonOpsPercentage || 0;

                    const gaugeData = [
                        {
                            value: opsPercentage,
                            name: 'Ops',
                            title: {
                                offsetCenter: ['0%', '-55%']
                            },
                            detail: {
                                valueAnimation: true,
                                offsetCenter: ['0%', '-25%']
                            },
                            itemStyle: {
                                color: '#5470c6'
                            }
                        },
                        {
                            value: nonOpsPercentage,
                            name: 'Non-Ops',
                            title: {
                                offsetCenter: ['0%', '15%']
                            },
                            detail: {
                                valueAnimation: true,
                                offsetCenter: ['0%', '45%']
                            },
                            itemStyle: {
                                color: '#91cc75'
                            }
                        }
                    ];

                    const option5 = {
                        trigger: 'item', formatter: '{b}: {c}%',        
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
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                axisLabel: {
                                    show: false
                                },
                                data: gaugeData,
                                title: {
                                    fontSize: 10
                                },
                                detail: {
                                    width: 50,
                                    height: 14,
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

                    if (option5 && typeof option5 === 'object') {
                        myChart.setOption(option5);
                    }

                    window.addEventListener('resize', function () {
                        myChart.resize();
                    });

                    const menuBtn = document.querySelector(".menu_button");
                    if (menuBtn) {
                        menuBtn.addEventListener("click", function () {
                            myChart.resize();
                        });
                    }
                } catch (error) {
                    console.error("Error processing chart data:", error);
                }
            },
            error: function (xhr, status, error) {
                myChart.hideLoading();
                console.error("AJAX error fetching OpsNonOpsPercentage data:", {
                    url: "/deshboard/GetAlertCount_OpsNonOpsPercentage?fromDate=" + from + "&toDate=" + to,
                    status: status,
                    error: error,
                    response: xhr.responseText
                });
            }
        });
    };


    var _echartsOpsSchedule3ChartDashboard = function () {
        var dom5 = document.getElementById('opsSchedule3');
        var myChart = echarts.init(dom5, null, {
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
            gaugeData[0].value = +(Math.random() * 100).toFixed(2);
            gaugeData[1].value = +(Math.random() * 100).toFixed(2);
            gaugeData[2].value = +(Math.random() * 100).toFixed(2);
            myChart.setOption({
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
            myChart.setOption(option5);
        }

        window.addEventListener('resize', myChart.resize);

        if (option5 && typeof option5 === 'object') {
            myChart.setOption(option5);
        }

        window.addEventListener('resize', function () {
            myChart.resize();
        });

        document.querySelector(".menu_button").addEventListener("click", function () {
            myChart.resize();
        });

    }


    var _echartsOpsScheduleWiseDistributionofAlarmsChartDashboard = function () {
        var dom = document.getElementById('OpsScheduleWiseDistribution');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        myChart.showLoading();

        // Create toggle button
        var toggleBtn = document.createElement('button');
        toggleBtn.innerHTML = 'Stop Animation';
        toggleBtn.style.cssText = 'position: absolute; top: 10px; right: 10px; z-index: 1000; padding: 8px 16px; background: #5470c6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;';
        dom.parentElement.style.position = 'relative';
        dom.parentElement.appendChild(toggleBtn);

        var animationInterval = null;
        var isAnimating = true;

        $.ajax({
            type: "GET",
            url: "/Deshboard/GetOperationsWiseAlerts_Hot?fromDate=" + from + "&toDate=" + to,
            success: function (data) {
                myChart.hideLoading();
                let jsonObject = JSON.parse(data);

                // Dynamically extract categories and compliance counts
                const categories = jsonObject.map(item => item.SiteOperationWindow);
                const complianceCounts = jsonObject.map(item => item.AlertCount);

                // Dynamic color generation function
                function generateColors(count) {
                    const baseColors = [
                        '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
                        '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#d4ec59'
                    ];

                    if (count <= baseColors.length) {
                        return baseColors.slice(0, count);
                    }

                    // Generate additional colors dynamically using HSL
                    const colors = [...baseColors];
                    const remaining = count - baseColors.length;

                    for (let i = 0; i < remaining; i++) {
                        const hue = (i * 360 / remaining) % 360;
                        const saturation = 60 + (i % 3) * 10;
                        const lightness = 55 + (i % 4) * 5;
                        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
                    }

                    return colors;
                }

                const colors = generateColors(categories.length);

                // Create category data for scatter plot
                let categoryData = categories.map((name, index) => ({
                    id: name,
                    dataGroupId: name,
                    data: [[complianceCounts[index], complianceCounts[index]]],
                    color: colors[index % colors.length]
                }));


                var scatterOption = {
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            return params.seriesName + '<br/>' +
                                'Value: ' + params.value[0].toLocaleString();
                        }
                    },
                    legend: {
                        data: categories,
                        type: 'scroll',
                        bottom: 10,
                        left: 'center',
                        orient: 'horizontal'
                    },
                    grid: {
                        left: '50px',
                        right: '50px',
                        top: '50px',
                        bottom: '80px'
                    },
                    xAxis: {
                        scale: true,
                        show: false
                    },
                    yAxis: {
                        scale: true,
                        axisLabel: {
                            formatter: function (value) {
                                if (value >= 1000) {
                                    return (value / 1000).toFixed(1) + 'K';
                                }
                                return value;
                            }
                        }
                    },
                    series: categoryData.map(category => ({
                        type: 'scatter',
                        name: category.id,
                        id: category.id,
                        dataGroupId: category.dataGroupId,
                        symbolSize: 15,
                        itemStyle: {
                            color: category.color
                        },
                        universalTransition: {
                            enabled: true,
                            delay: () => Math.random() * 400
                        },
                        data: category.data
                    }))
                };

                var barOption = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        },
                        formatter: function (params) {
                            let result = '';
                            params.forEach(param => {
                                if (param.value) {
                                    result += param.marker + ' ' + param.seriesName + ': ' +
                                        param.value.toLocaleString() + '<br/>';
                                }
                            });
                            return result;
                        }
                    },
                    legend: {
                        data: categories,
                        type: 'scroll',
                        bottom: 10,
                        left: 'center',
                        orient: 'horizontal'
                    },
                    grid: {
                        left: '50px',
                        right: '50px',
                        top: '50px',
                        bottom: '80px'
                    },
                    xAxis: {
                        type: 'category',
                        data: categories,
                        show: false  // Hide x-axis labels since we're using legends
                    },
                    yAxis: {
                        type: 'value',

                        axisLabel: {
                            formatter: function (value) {
                                if (value >= 1000) {
                                    return (value / 1000).toFixed(1) + 'K';
                                }
                                return value;
                            }
                        }
                    },
                    series: categoryData.map((category, index) => ({
                        type: 'bar',
                        name: category.id,
                        id: category.id,

                        data: categories.map((cat, idx) => idx === index ? complianceCounts[index] : null),
                        itemStyle: {
                            color: category.color
                        },
                        universalTransition: {
                            enabled: true,
                            seriesKey: categories,
                            delay: () => Math.random() * 400
                        }
                    }))
                };

                let currentOption = barOption;
                myChart.setOption(currentOption, true);

                // Toggle animation function
                function startAnimation() {
                    animationInterval = setInterval(function () {
                        currentOption = currentOption === scatterOption ? barOption : scatterOption;
                        myChart.setOption(currentOption, true);
                    }, 3000);
                }

                function stopAnimation() {
                    if (animationInterval) {
                        clearInterval(animationInterval);
                        animationInterval = null;
                    }
                }

                // Start animation initially
                startAnimation();

                // Toggle button click handler
                toggleBtn.addEventListener('click', function () {
                    isAnimating = !isAnimating;
                    if (isAnimating) {
                        toggleBtn.innerHTML = 'Stop Animation';
                        toggleBtn.style.background = '#5470c6';
                        startAnimation();
                    } else {
                        toggleBtn.innerHTML = 'Start Animation';
                        toggleBtn.style.background = '#91cc75';
                        stopAnimation();
                    }
                });

                // Responsive fix: resize chart on window resize or menu click
                function resizeChart() {
                    setTimeout(() => {
                        myChart.resize();
                    }, 200);
                }

                window.addEventListener('resize', resizeChart);

                const menuBtn = document.querySelector(".menu_button");
                if (menuBtn) {
                    menuBtn.addEventListener("click", resizeChart);
                }
            },
            error: function (err) {
                myChart.hideLoading();
                console.error("Error fetching data:", err);
            }
        });
    };







    return {
        init: function () {
            _echartsalarmsA1ChartDashboard();
            _echartsalarmsA2ChartDashboard();
            _echartsalarmsA3ChartDashboard();
            _echartsalarmsB1ChartDashboard();
            _echartsEnergyAlarmsA1ChartDashboard();
            _echartsEnergyAlarmsA2ChartDashboard();
            _echartsThermalAlarmsChartDashboard();
            _echartsElectricalAlarmsChartDashboard();
            _echartsOpsSchedule1ChartDashboard();
            _echartsOpsSchedule2ChartDashboard();
            _echartsOpsSchedule3ChartDashboard();
            _echartsOpsScheduleWiseDistributionofAlarmsChartDashboard();
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    alarmsDashboard.init();
});