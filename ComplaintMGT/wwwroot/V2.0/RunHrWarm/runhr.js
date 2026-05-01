console.log("Dynamic RunHr Dashboard Initialized");

var controlEnablementDashboard = function () {

    function formatDate(date) {
        const pad = num => num.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    // Calculate current month's date range: from 1st 12:00 AM to now
    function getCurrentMonthRange() {
        const toDate = new Date(); // Current date & time

        const fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1); // 1st of current month
        fromDate.setHours(0, 0, 0, 0); // Set time to 12:00 AM

        return {
            from4: formatDate(fromDate),
            to4: formatDate(toDate)
        };
    }

    function getCurrentWeekRange() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const diffToMonday = (dayOfWeek + 6) % 7; // Convert Sunday (0) to 6, Monday (1) to 0

        const fromDate = new Date(today);
        fromDate.setDate(today.getDate() - diffToMonday);
        fromDate.setHours(0, 0, 0, 0); // Start of Monday

        return {
            from2: formatDate(fromDate),
            to2: formatDate(today)
        };
    }

    function getPreviousWeekRange() {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const diffToMonday = (dayOfWeek + 6) % 7;

        const lastMonday = new Date(today);
        lastMonday.setDate(today.getDate() - diffToMonday - 7);
        lastMonday.setHours(0, 0, 0, 0);

        const lastSunday = new Date(lastMonday);
        lastSunday.setDate(lastMonday.getDate() + 6);
        lastSunday.setHours(23, 59, 59, 999);

        return {
            from3: formatDate(lastMonday),
            to3: formatDate(lastSunday)
        };
    }

    function gettodayRange() {
        const toDate = new Date(); // Current date & time

        const fromDate = new Date(toDate); // Copy current date
        fromDate.setDate(toDate.getDate()); // 0 days ago
        fromDate.setHours(0, 0, 0, 0); // Set time to 12:00 AM

        return {
            from1: formatDate(fromDate),
            to1: formatDate(toDate)
        };
    }

    function getMonthName(dateStr) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        const date = new Date(dateStr);
        return monthNames[date.getMonth()];
    }

    const { from3, to3 } = getPreviousWeekRange();

    const { from2, to2 } = getCurrentWeekRange();

    const { from1, to1 } = gettodayRange();

    const { from4, to4 } = getCurrentMonthRange();

    // Store chart instances for resize handling
    const chartInstances = [];

    // ============================================
    // DYNAMIC GAUGE CHART CREATION
    // ============================================

    function createGaugeChart(containerId, value, deviceName) {
        var dom = document.getElementById(containerId);
        if (!dom) return null;

        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        var _panelImageURL = '../images/assets/blueGauge.png';
        var _animationDuration = 1000;
        var _animationDurationUpdate = 1000;
        var _animationEasingUpdate = 'quarticInOut';
        var _valOnRadianMax = 200;
        var _outerRadius = 50;
        var _innerRadius = 42.5;
        var _pointerInnerRadius = 10;
        var _insidePanelRadius = 35;

        function renderItem(params, api) {
            var valOnRadian = api.value(1) || 0;
            var deviceName = api.value(2) || '';
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
                                points: makePointerPoints(params, polarEndRadian)
                            },
                            extra: {
                                polarEndRadian: polarEndRadian,
                                transition: 'polarEndRadian',
                                enterFrom: { polarEndRadian: 0 }
                            },
                            during: function (apiDuring) {
                                apiDuring.setShape(
                                    'points',
                                    makePointerPoints(params, apiDuring.getExtra('polarEndRadian'))
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
                    },
                    {
                        type: 'text',
                        style: {
                            text: deviceName,
                            fontSize: 15,
                            fontWeight: 500,
                            x: params.coordSys.cx,
                            y: params.coordSys.cy + _outerRadius + 1,
                            fill: '#666',
                            align: 'center',
                            verticalAlign: 'top'
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

        function makePointerPoints(renderItemParams, polarEndRadian) {
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
            return valOnRadian.toFixed(2);
        }

        var option = {
            animationEasing: _animationEasingUpdate,
            animationDuration: _animationDuration,
            animationDurationUpdate: _animationDurationUpdate,
            animationEasingUpdate: _animationEasingUpdate,
            dataset: {
                source: [[1, value, deviceName]]
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

        myChart.setOption(option);
        chartInstances.push(myChart);

        return myChart;
    }

    // ============================================
    // DYNAMIC RUNHRS SECTION (ROW2) - SINGLE CONTAINER
    // ============================================

    function initializeRunHrs() {
        Promise.all([
            $.ajax({
                type: "GET",
                url: "/EnergyParameter/GetMainMeter_Runhr"
            }),
            $.ajax({
                type: "GET",
                url: "/EnergyParameter/GetSubMeter_Runhr"
            })
        ]).then(function (responses) {
            const mainMeterData = JSON.parse(responses[0] || '[]');
            const subMeterData = JSON.parse(responses[1] || '[]');

            // Combine all devices in single array
            const allDevices = [...mainMeterData, ...subMeterData];
            console.log('Total Devices:', allDevices.length);

            // Get single container
            const ceContainer1 = document.querySelector('.ceContainer1');

            if (!ceContainer1) return;

            ceContainer1.innerHTML = '';

            // Create all gauges in single container (will wrap automatically at 6 per row)
            allDevices.forEach((device, index) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'ceContainer1a';
                wrapper.innerHTML = `<div class="chart-containerCG" id="dynamic-gauge-${index}"></div>`;
                ceContainer1.appendChild(wrapper);
            });

            // Initialize all charts
            setTimeout(() => {
                allDevices.forEach((device, index) => {
                    createGaugeChart(`dynamic-gauge-${index}`, device.Runhr, device.DeviceName);
                });
            }, 100);

        }).catch(function (error) {
            console.error('Error loading RunHrs data:', error);
        });
    }



    // ============================================
    // DYNAMIC HIGH RUNHRS SECTION (ROW4)
    // ============================================

    function initializeHighRunHrs() {
        Promise.all([
            $.ajax({
                type: "GET",
                url: "/EnergyParameter/GetMainMeter_Runhr"
            }),
            $.ajax({
                type: "GET",
                url: "/EnergyParameter/GetSubMeter_Runhr"
            })
        ]).then(function (responses) {

            const mainMeterData = JSON.parse(responses[0] || '[]');
            const subMeterData = JSON.parse(responses[1] || '[]');

            const allDevices = [...mainMeterData, ...subMeterData];

            // Sort all devices descending by Runhr
            const sorted = allDevices.sort((a, b) => b.Runhr - a.Runhr);

            // Take only top HALF of devices
            const half = Math.ceil(sorted.length / 2);
            const highRunHrDevices = sorted.slice(0, half);

            console.log('Total Devices:', sorted.length);
            console.log('High RunHr (Top Half) Devices:', highRunHrDevices.length);

            const ceContainer3 = document.querySelector('.ceContainer3');
            if (!ceContainer3) return;

            ceContainer3.innerHTML = '';

            highRunHrDevices.forEach((device, index) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'ceContainer1a';
                wrapper.innerHTML = `<div class="chart-containerCG" id="dynamic-high-${index}"></div>`;
                ceContainer3.appendChild(wrapper);
            });

            setTimeout(() => {
                highRunHrDevices.forEach((device, index) => {
                    createGaugeChart(`dynamic-high-${index}`, device.Runhr, device.DeviceName);
                });
            }, 100);

        }).catch(function (error) {
            console.error('Error loading High RunHrs data:', error);
        });
    }


    // ============================================
    // DYNAMIC LOW RUNHRS SECTION (ROW5)
    // ============================================

    function initializeLowRunHrs() {
        Promise.all([
            $.ajax({
                type: "GET",
                url: "/EnergyParameter/GetMainMeter_Runhr"
            }),
            $.ajax({
                type: "GET",
                url: "/EnergyParameter/GetSubMeter_Runhr"
            })
        ]).then(function (responses) {
            const mainMeterData = JSON.parse(responses[0] || '[]');
            const subMeterData = JSON.parse(responses[1] || '[]');

            const allDevices = [...mainMeterData, ...subMeterData];

            const sorted = allDevices.sort((a, b) => a.Runhr - b.Runhr); // ascending
            const half = Math.ceil(sorted.length / 2);
            const lowRunHrDevices = sorted.slice(0, half);  // bottom half

            console.log('Total Devices:', sorted.length);
            console.log('Low RunHr (Top Half) Devices:', lowRunHrDevices.length);

            const ceContainer4 = document.querySelector('.ceContainer4');
            if (!ceContainer4) return;

            ceContainer4.innerHTML = '';

            lowRunHrDevices.forEach((device, index) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'ceContainer1a';
                wrapper.innerHTML = `<div class="chart-containerCG" id="dynamic-low-${index}"></div>`;
                ceContainer4.appendChild(wrapper);
            });

            setTimeout(() => {
                lowRunHrDevices.forEach((device, index) => {
                    createGaugeChart(`dynamic-low-${index}`, device.Runhr, device.DeviceName);
                });
            }, 100);

        }).catch(function (error) {
            console.error('Error loading Low RunHrs data:', error);
        });
    }

    // ============================================
    // DYNAMIC BAR CHARTS
    // ============================================

    function initializeAvgRunHrsChart() {
        const monthLabels = [
            
            getMonthName(from4)
        ];

        Promise.all([
            $.ajax({
                type: "GET",
                url: "/EnergyParameter/GetDevice_AvgRunhr?fromDate=" + from1 + "&toDate=" + to1,
            }),
            $.ajax({
                type: "GET",
                url: "/EnergyParameter/GetDevice_AvgRunhr?fromDate=" + from2 + "&toDate=" + to2,
            }),
            $.ajax({
                type: "GET",
                url: "/EnergyParameter/GetDevice_AvgRunhr?fromDate=" + from3 + "&toDate=" + to3,
            }),
            $.ajax({
                type: "GET",
                url: "/EnergyParameter/GetDevice_AvgRunhr?fromDate=" + from4 + "&toDate=" + to4,
            })
        ]).then(function (responses) {
            try {
                let data1 = JSON.parse(responses[0] || '[]');
                let data2 = JSON.parse(responses[1] || '[]');
                let data3 = JSON.parse(responses[2] || '[]');
                let data4 = JSON.parse(responses[3] || '[]');

                const allDevices = new Set();
                [data1, data2, data3, data4].forEach(data => {
                    data.forEach(device => {
                        if (device.DeviceName) {
                            allDevices.add(device.DeviceName);
                        }
                    });
                });
                const deviceNames = Array.from(allDevices);

                console.log('Avg RunHrs Devices:', deviceNames.length);

                const totalDevices = deviceNames.length;
                const stacksNeeded = Math.ceil(totalDevices / 2);

                const series = deviceNames.map((deviceName, index) => {
                    const device1 = data1.find(d => d.DeviceName === deviceName) || { AvgRunhr: 0 };
                    const device2 = data2.find(d => d.DeviceName === deviceName) || { AvgRunhr: 0 };
                    const device3 = data3.find(d => d.DeviceName === deviceName) || { AvgRunhr: 0 };
                    const device4 = data4.find(d => d.DeviceName === deviceName) || { AvgRunhr: 0 };

                    const stackIndex = index === totalDevices - 1 && totalDevices % 2 !== 0
                        ? stacksNeeded - 1
                        : Math.floor(index / 2);

                    return {
                        name: deviceName,
                        type: 'bar',
                        stack: 'stack' + stackIndex,
                        data: [device1.AvgRunhr, device2.AvgRunhr, device3.AvgRunhr, device4.AvgRunhr]
                    };
                });

                const stackInfo = {};
                series.forEach((s, seriesIndex) => {
                    if (!stackInfo[s.stack]) {
                        stackInfo[s.stack] = {
                            devices: [],
                            stackStart: Array(4).fill(null),
                            stackEnd: Array(4).fill(null)
                        };
                    }
                    stackInfo[s.stack].devices.push(seriesIndex);

                    s.data.forEach((value, dataIndex) => {
                        if (value && value !== '-') {
                            const info = stackInfo[s.stack];
                            if (info.stackStart[dataIndex] === null) {
                                info.stackStart[dataIndex] = seriesIndex;
                            }
                            info.stackEnd[dataIndex] = seriesIndex;
                        }
                    });
                });

                series.forEach((s, seriesIndex) => {
                    const info = stackInfo[s.stack];
                    s.data = s.data.map((value, dataIndex) => ({
                        value: value,
                        itemStyle: {
                            borderRadius: [
                                info.stackEnd[dataIndex] === seriesIndex ? 20 : 0,
                                info.stackEnd[dataIndex] === seriesIndex ? 20 : 0,
                                0,
                                0
                            ]
                        }
                    }));
                });

                const option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: deviceNames,
                        bottom: 15,
                        left: 'center',
                        padding: [10, 0, 0, 0]
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '30%',
                        top: '8%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: ['Today', 'Current Week', 'Previous Week', monthLabels]
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: series
                };

                var dom = document.getElementById('control1');
                if (dom) {
                    var myChart = echarts.init(dom);
                    myChart.setOption(option);
                    chartInstances.push(myChart);
                }

            } catch (error) {
                console.error('Error processing Avg RunHrs chart:', error);
            }
        }).catch(function (error) {
            console.error('Error fetching Avg RunHrs data:', error);
        });
    }

    function initializeSumRunHrsChart() {
        const monthLabels = [
            
            getMonthName(from4)
        ];

        Promise.all([
            $.ajax({
                type: "GET",
                url: "/EnergyParameter/GetDevice_SumRunhr?fromDate=" + from1 + "&toDate=" + to1,
            }),
            $.ajax({
                type: "GET",
                url: "/EnergyParameter/GetDevice_SumRunhr?fromDate=" + from2 + "&toDate=" + to2,
            }),
            $.ajax({
                type: "GET",
                url: "/EnergyParameter/GetDevice_SumRunhr?fromDate=" + from3 + "&toDate=" + to3,
            }),
            $.ajax({
                type: "GET",
                url: "/EnergyParameter/GetDevice_SumRunhr?fromDate=" + from4 + "&toDate=" + to4,
            })
        ]).then(function (responses) {
            try {
                let data1 = JSON.parse(responses[0] || '[]');
                let data2 = JSON.parse(responses[1] || '[]');
                let data3 = JSON.parse(responses[2] || '[]');
                let data4 = JSON.parse(responses[3] || '[]');

                const allDevices = new Set();
                [data1, data2, data3, data4].forEach(data => {
                    data.forEach(device => {
                        if (device.DeviceName) {
                            allDevices.add(device.DeviceName);
                        }
                    });
                });
                const deviceNames = Array.from(allDevices);

                console.log('Sum RunHrs Devices:', deviceNames.length);

                const totalDevices = deviceNames.length;
                const stacksNeeded = Math.ceil(totalDevices / 2);

                const series = deviceNames.map((deviceName, index) => {
                    const device1 = data1.find(d => d.DeviceName === deviceName) || { SumRunhr: 0 };
                    const device2 = data2.find(d => d.DeviceName === deviceName) || { SumRunhr: 0 };
                    const device3 = data3.find(d => d.DeviceName === deviceName) || { SumRunhr: 0 };
                    const device4 = data4.find(d => d.DeviceName === deviceName) || { SumRunhr: 0 };

                    const stackIndex = index === totalDevices - 1 && totalDevices % 2 !== 0
                        ? stacksNeeded - 1
                        : Math.floor(index / 2);

                    return {
                        name: deviceName,
                        type: 'bar',
                        stack: 'stack' + stackIndex,
                        data: [device1.SumRunhr, device2.SumRunhr, device3.SumRunhr, device4.SumRunhr]
                    };
                });

                const stackInfo = {};
                series.forEach((s, seriesIndex) => {
                    if (!stackInfo[s.stack]) {
                        stackInfo[s.stack] = {
                            devices: [],
                            stackStart: Array(4).fill(null),
                            stackEnd: Array(4).fill(null)
                        };
                    }
                    stackInfo[s.stack].devices.push(seriesIndex);

                    s.data.forEach((value, dataIndex) => {
                        if (value && value !== '-') {
                            const info = stackInfo[s.stack];
                            if (info.stackStart[dataIndex] === null) {
                                info.stackStart[dataIndex] = seriesIndex;
                            }
                            info.stackEnd[dataIndex] = seriesIndex;
                        }
                    });
                });

                series.forEach((s, seriesIndex) => {
                    const info = stackInfo[s.stack];
                    s.data = s.data.map((value, dataIndex) => ({
                        value: value,
                        itemStyle: {
                            borderRadius: [
                                info.stackEnd[dataIndex] === seriesIndex ? 20 : 0,
                                info.stackEnd[dataIndex] === seriesIndex ? 20 : 0,
                                0,
                                0
                            ]
                        }
                    }));
                });

                const option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: deviceNames,
                        bottom: 15,
                        left: 'center',
                        padding: [10, 0, 0, 0]
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '30%',
                        top: '8%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: ['Today', 'Current Week', 'Previous Week', monthLabels]
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: series
                };

                var dom = document.getElementById('control2');
                if (dom) {
                    var myChart = echarts.init(dom);
                    myChart.setOption(option);
                    chartInstances.push(myChart);
                }

            } catch (error) {
                console.error('Error processing Sum RunHrs chart:', error);
            }
        }).catch(function (error) {
            console.error('Error fetching Sum RunHrs data:', error);
        });
    }

    // ============================================
    // RESIZE HANDLER
    // ============================================

    function handleResize() {
        chartInstances.forEach(chart => {
            if (chart && !chart.isDisposed()) {
                chart.resize();
            }
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    return {
        init: function () {
            console.log("Initializing Dynamic Dashboard...");

            // Initialize all sections
            initializeRunHrs();
            initializeHighRunHrs();
            initializeLowRunHrs();
            initializeAvgRunHrsChart();
            initializeSumRunHrsChart();

            // Setup resize handlers
            window.addEventListener('resize', handleResize);

            const menuBtn = document.querySelector(".menu_button");
            if (menuBtn) {
                menuBtn.addEventListener("click", handleResize);
            }

            console.log("Dashboard Initialized Successfully");
        }
    }
}();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    controlEnablementDashboard.init();
});


    