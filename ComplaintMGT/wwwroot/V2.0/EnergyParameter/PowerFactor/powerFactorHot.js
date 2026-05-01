// ----------- Helper Functions -----------

function formatDate(date) {
    const pad = num => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}


function getDayRange(dateAgo) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - dateAgo);

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    return {
        from: formatDate(startOfDay),
        to: formatDate(endOfDay)
    };
}

function getTodayRange() {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    return {
        from: formatDate(startOfDay),
        to: formatDate(now)
    };
}


// ----------- Dynamic Color Generation -----------

function generateColor(index) {
    const hue = (index * 137.5) % 360;
    const saturation = 65 + (index % 3) * 10;
    const lightness = 55 + (index % 2) * 5;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function getDeviceColor(deviceName, index) {
    const baseColors = [
        '#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE',
        '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC'
    ];

    if (deviceName === 'Main Meter') {
        return baseColors[0];
    }

    if (index < baseColors.length) {
        return baseColors[index % baseColors.length];
    }

    return generateColor(index);
}

// ----------- Power Factor Color Logic -----------

function getColorFromFlag(colorFlag) {
    const flag = colorFlag ? colorFlag.toLowerCase() : '';
    const colorMap = {
        'green': '#81C784',
        'yellow': '#FFF176',
        'red': '#E57373'
    };
    return colorMap[flag] || '#9E9E9E';
}

function getPowerFactorStatus(colorFlag) {
    const flag = colorFlag ? colorFlag.toLowerCase() : '';
    const statusMap = {
        'green': 'Excellent',
        'yellow': 'Fair',
        'red': 'Poor'
    };
    return statusMap[flag] || 'Unknown';
}

// ----------- Enhanced API Fetcher with Retry Logic -----------

async function fetchWithRetry(url, retries = 3, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const data = await response.json();
            let parsedData = typeof data === 'string' ? JSON.parse(data) : data;
            if (!Array.isArray(parsedData)) parsedData = [parsedData];
            return parsedData;
        } catch (error) {
            console.warn(`Fetch attempt ${i + 1}/${retries} failed for ${url}:`, error.message);
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }
}

// ----------- Render Power Factor Circles -----------

function createPowerFactorCircle(device) {
    const circleBox = document.createElement('div');
    circleBox.className = 'circle-box';
    circleBox.setAttribute('data-label', device.name);
    circleBox.style.cssText = `position: relative; background-color: ${device.color}; color: #222;`;
    if (device.isMainMeter) {
        circleBox.style.border = '3px solid #333';
        circleBox.style.fontWeight = 'bold';
    }

    const pfText = document.createElement('div');
    pfText.style.cssText = 'position: relative; z-index: 1;';
    pfText.textContent = device.powerFactor;

    const tooltip = document.createElement('div');
    tooltip.className = 'voltage-tooltip';

    const tooltipContent = document.createElement('div');
    tooltipContent.className = 'voltage-tooltip-content';

    const rows = [
        { label: 'Status', value: device.status },
        { label: 'Power Factor', value: device.powerFactor }
    ];

    // Add date and time if available
    if (device.createDate) {
        rows.push({ label: 'Date', value: device.date });
        rows.push({ label: 'Time', value: device.time });
    }

    if (device.count !== undefined && device.count !== null) {
        rows.push({ label: 'Count', value: device.count });
    }

    rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'voltage-tooltip-row';
        rowDiv.innerHTML = `
            <span class="voltage-tooltip-label">${row.label}:</span>
            <span class="voltage-tooltip-value">${row.value}</span>
        `;
        tooltipContent.appendChild(rowDiv);
    });

    tooltip.appendChild(tooltipContent);
    circleBox.appendChild(pfText);
    circleBox.appendChild(tooltip);

    return circleBox;
}

function formatDateTime(createDate) {
    if (!createDate) {
        return { date: '-', time: '-' };
    }

    try {
        const dateObj = new Date(createDate);

        // Check if date is valid
        if (isNaN(dateObj.getTime())) {
            return { date: '-', time: '-' };
        }

        // Format date as DD/MM/YYYY
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        // Format time as HH:MM:SS
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');
        const formattedTime = `${hours}:${minutes}:${seconds}`;

        return {
            date: formattedDate,
            time: formattedTime
        };
    } catch (error) {
        console.error('Error formatting date:', error);
        return { date: '-', time: '-' };
    }
}

function renderPowerFactorCircles(data, isError = false) {
    const grid1 = document.getElementById('powerfactor-grid-1');
    const grid2 = document.getElementById('powerfactor-grid-2');

    if (!grid1 || !grid2) {
        console.error('Grid elements not found');
        return;
    }

    grid1.innerHTML = '';
    grid2.innerHTML = '';

    if (isError) {
        grid1.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #f44336; font-weight: bold;">Data fetching issue</div>';
        return;
    }

    if (!data || data.length === 0) {
        console.warn('No power factor data available');
        grid1.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #000;">No data available</div>';
        return;
    }

    // Sort data to ensure Main Meter comes first
    const sortedData = data.sort((a, b) => {
        const aIsMain = a.DeviceName === 'Main Meter' || a.IsMainMeter === 1 ||
            a.DeviceName?.toLowerCase() === 'main meter';
        const bIsMain = b.DeviceName === 'Main Meter' || b.IsMainMeter === 1 ||
            b.DeviceName?.toLowerCase() === 'main meter';

        if (aIsMain && !bIsMain) return -1;
        if (!aIsMain && bIsMain) return 1;
        return 0;
    });

    const allDevices = sortedData.map(device => {
        const powerFactor = device.Powerfactor !== undefined ? device.Powerfactor :
            (device.Total_Powerfactor !== undefined ? device.Total_Powerfactor : '-');

        const colorFlag = device.ColourFlag || device.ColorFlag || '';

        const isMainMeter = device.DeviceName === 'Main Meter' || device.IsMainMeter === 1 ||
            device.DeviceName?.toLowerCase() === 'main meter';

        // Extract and format CreateDate
        const createDate = device.CreateDate || device.createDate || device.Timestamp || device.DateTime;
        const { date, time } = formatDateTime(createDate);

        return {
            powerFactor: typeof powerFactor === 'number' ? powerFactor.toFixed(2) : powerFactor,
            name: device.DeviceName || 'Device',
            color: getColorFromFlag(colorFlag),
            colorFlag: colorFlag,
            status: getPowerFactorStatus(colorFlag),
            isMainMeter: isMainMeter,
            createDate: createDate,
            date: date,
            time: time
        };
    });

    const grid1Devices = allDevices.slice(0, 7);
    const grid2Devices = allDevices.slice(7);

    grid1Devices.forEach(device => grid1.appendChild(createPowerFactorCircle(device)));

    if (grid2Devices.length > 0) {
        grid2Devices.forEach(device => grid2.appendChild(createPowerFactorCircle(device)));
    }
}

// ----------- Render High/Low Power Factor Summary -----------

function renderPowerFactorSummary(data, summaryId, noDataId, colorFlag, isError = false) {
    const summaryContainer = document.getElementById(summaryId);
    const noDataMsg = document.getElementById(noDataId);

    if (!summaryContainer) return;

    summaryContainer.innerHTML = '';

    if (isError) {
        summaryContainer.style.display = 'block';
        summaryContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #f44336; font-weight: bold;">Data fetching issue</div>';
        if (noDataMsg) noDataMsg.style.display = 'none';
        return;
    }

    // Filter devices by color flag AND valid power factor values
    const filteredDevices = data.filter(device => {
        const flag = (device.ColourFlag || device.ColorFlag || '').toLowerCase();
        const avgPF = device.AvgPowerfactor || device.Powerfactor;

        // Check if color flag matches
        const colorMatches = flag === colorFlag;

        // Check if power factor value exists and is valid
        const hasValidPF = avgPF !== null &&
            avgPF !== undefined &&
            avgPF !== '' &&
            avgPF !== '-' &&
            !isNaN(avgPF);

        return colorMatches && hasValidPF;
    });

    if (filteredDevices.length === 0) {
        summaryContainer.style.display = 'none';
        if (noDataMsg) {
            noDataMsg.style.display = 'block';
            noDataMsg.style.color = '#000';
            noDataMsg.textContent = 'No data available';
        }
        return;
    }

    summaryContainer.style.display = 'flex';
    if (noDataMsg) noDataMsg.style.display = 'none';

    filteredDevices.forEach(device => {
        const avgPF = device.AvgPowerfactor || device.Powerfactor;

        // Extract and format CreateDate for tooltip
        const createDate = device.CreateDate || device.createDate || device.Timestamp || device.DateTime;
        const { date, time } = formatDateTime(createDate);

        const circle = createPowerFactorCircle({
            powerFactor: typeof avgPF === 'number' ? avgPF.toFixed(2) : avgPF,
            name: device.DeviceName || 'Device',
            color: getColorFromFlag(device.ColourFlag || device.ColorFlag),
            status: getPowerFactorStatus(device.ColourFlag || device.ColorFlag),
            isMainMeter: device.DeviceName === 'Main Meter' || device.DeviceName === 'main meter',
            count: device.Count,
            createDate: createDate,
            date: date,
            time: time
        });

        summaryContainer.appendChild(circle);
    });
}

function renderHighPowerFactorSummary(data, isError = false) {
    renderPowerFactorSummary(data, 'high-pf-summary', 'no-high-pf-message', 'green', isError);
}

function renderLowPowerFactorSummary(data, isError = false) {
    renderPowerFactorSummary(data, 'low-pf-summary', 'no-low-pf-message', 'red', isError);
}

// ----------- Fetch and Render Initial Data -----------

async function initializePowerFactorData() {
    const grid1 = document.getElementById('powerfactor-grid-1');
    let mainCirclesError = false;
    let highLowPFError = false;

    try {
        const dateRange = getDayRange(0);

        let mainCirclesData = [];
        let highLowPFData = [];

        // Fetch main circles data
        try {
            mainCirclesData = await fetchWithRetry('/EnergyParameter/GetAllMeters_LastUpdated_Powerfactor');
        } catch (error) {
            console.error('Error fetching Realtime circles data:', error);
            mainCirclesError = true;
        }

        // Fetch high/low PF data
        try {
            highLowPFData = await fetchWithRetry(`/EnergyParameter/GetAllmeter_AvgPowerfactor?fromDate=${encodeURIComponent(dateRange.from)}&toDate=${encodeURIComponent(dateRange.to)}`);
        } catch (error) {
            console.error('Error fetching high/low PF data:', error);
            highLowPFError = true;
        }

        renderPowerFactorCircles(mainCirclesData, mainCirclesError);
        renderHighPowerFactorSummary(highLowPFData, highLowPFError);
        renderLowPowerFactorSummary(highLowPFData, highLowPFError);

    } catch (error) {
        console.error('Error fetching power factor data:', error);
        if (grid1) {
            grid1.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #f44336; font-weight: bold;">Data fetching issue</div>';
        }
    }
}

initializePowerFactorData();



// ----------- Average Power Factor Bar Chart (Hourly for Today) -----------

let barChartData = [];
let selectedDeviceNames = new Set();
let deviceColorMap = new Map();


function processBarChartData(data) {
    if (!data || data.length === 0) return [];

    return data.map((row) => {
        // Parse ReadingDate from API
        const readingDate = row.ReadingDate ? new Date(row.ReadingDate) : null;
        const formattedDate = readingDate
            ? readingDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'N/A';

        // Format hour: 00:00 = Hour 1, 01:00 = Hour 2, ... 23:00 = Hour 24
        const hour = row.ReadingHour !== undefined ? row.ReadingHour : 0;
        const hourDisplay = hour + 1; // Add 1: 0→1, 1→2, 2→3, ... 23→24

        return {
            date: formattedDate,
            readingDate: row.ReadingDate,
            readingHour: hour,
            hourDisplay: hourDisplay, // For display purposes
            avgPowerFactor: row.AvgPowerfactor ? parseFloat(row.AvgPowerfactor).toFixed(2) : '0.00',
            deviceName: row.DeviceName || 'Unknown',
            deviceId: row.DeviceID || '',
            colourFlag: row.ColourFlag || ''
        };
    });
}

function createBarChartOption(filteredData) {
    if (!filteredData || filteredData.length === 0) {
        return {
            title: {
                text: 'No data available', left: 'center', top: 'center', textStyle: { color: '#000', fontSize: 16 }
            },
            xAxis: { show: false },
            yAxis: { show: false }
        };
    }

    // 1. Extract unique hours for X-Axis (Sorted)
    const uniqueHours = [...new Set(filteredData.map(item => item.hourDisplay))].sort((a, b) => a - b);

    // 2. Group data by Device
    const deviceGroups = {};
    filteredData.forEach(row => {
        if (!deviceGroups[row.deviceName]) {
            deviceGroups[row.deviceName] = [];
        }
        deviceGroups[row.deviceName].push(row);
    });

    // 3. Create a Series for each Device
    const seriesList = Object.keys(deviceGroups).map(deviceName => {
        const deviceRows = deviceGroups[deviceName];
        const deviceColor = deviceColorMap.get(deviceName) || '#9E9E9E';

        // Map data to match the uniqueHours X-Axis alignment
        const alignedData = uniqueHours.map(hourDisplay => {
            const foundRow = deviceRows.find(r => r.hourDisplay === hourDisplay);
            return foundRow ? {
                value: parseFloat(foundRow.avgPowerFactor),
                rowData: foundRow
            } : null;
        });

        return {
            name: deviceName,
            type: 'bar',
            barGap: '10%', // Space between bars in the same hour group
            itemStyle: {
                borderRadius: [4, 4, 0, 0],
                color: deviceColor
            },
            data: alignedData
        };
    });

    // Add Threshold Lines
    const thresholdLines = [
        {
            name: '≥ 0.98 (Excellent)',
            type: 'line',
            itemStyle: {
                color: 'rgba(102, 187, 106, 0.8)'
            },
            lineStyle: {
                color: 'rgba(102, 187, 106, 0.8)'
            },
            markLine: {
                silent: true,
                symbol: 'none',
                label: { show: false },
                lineStyle: { type: 'dashed', color: 'rgba(102, 187, 106, 0.8)', width: 1.5 },
                data: [{ yAxis: 0.98 }]
            }
        },
        {
            name: '≥ 0.95 (Good)',
            type: 'line',
            itemStyle: {
                color: 'rgba(255, 167, 38, 0.8)'
            },
            lineStyle: {
                color: 'rgba(255, 167, 38, 0.8)'
            },
            markLine: {
                silent: true,
                symbol: 'none',
                label: { show: false },
                lineStyle: { type: 'dashed', color: 'rgba(255, 167, 38, 0.8)', width: 1.5 },
                data: [{ yAxis: 0.95 }]
            }
        }
    ];

    return {
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                if (!params.data || !params.data.rowData) return '';

                const rowData = params.data.rowData;
                const color = getColorFromFlag(rowData.colourFlag);

                let html = `
            <div style="background: rgba(0,0,0,0.9); border-radius: 8px; padding: 12px; min-width: 200px;">
                <div style="color: #66BB6A; font-weight: bold; margin-bottom: 12px; font-size: 14px; text-align: center; border-bottom: 2px solid #66BB6A; padding-bottom: 8px;">
                    Hour ${rowData.hourDisplay} - ${rowData.deviceName}
                </div>
                <div style="margin-bottom: 0; padding: 6px; background: rgba(255,255,255,0.05); border-radius: 4px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="color: #FFD54F;"><strong>Date:</strong></span>
                        <span style="color: #fff; font-weight: bold;">${rowData.date}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="color: #FFD54F;"><strong>Hour:</strong></span>
                        <span style="color: #fff; font-weight: bold;">${rowData.hourDisplay}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #FFD54F;"><strong>Power Factor:</strong></span>
                        <span style="color: ${color}; font-weight: bold; font-size: 16px;">${rowData.avgPowerFactor}</span>
                    </div>
                    ${rowData.deviceId ? `<div style="color: #999; font-size: 10px; margin-top: 4px;">${rowData.deviceId}</div>` : ''}
                </div>
            </div>`;

                return html;
            },
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            confine: true,
            extraCssText: 'box-shadow: 0 0 10px rgba(0,0,0,0.5);'
        },
        legend: {
            data: ['≥ 0.98 (Excellent)', '≥ 0.95 (Good)'],
            top: 10,
            right: 20,
            type: 'scroll'
        },
        grid: {
            left: 50,
            right: 30,
            top: 60,
            bottom: 0,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: uniqueHours,
            axisLabel: {
                rotate: 0,
                interval: 0,
                fontSize: 11,
                color: '#666',
                fontWeight: 'bold'
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 1.2
        },
        series: [...seriesList, ...thresholdLines]
    };
}

function renderBarChartFilters(deviceNames) {
    const container = document.getElementById('meter-filter-checkboxes');
    if (!container) return;

    container.innerHTML = '';

    const sortedDevices = deviceNames.sort((a, b) => {
        if (a === 'Main Meter') return -1;
        if (b === 'Main Meter') return 1;
        return a.localeCompare(b);
    });

    sortedDevices.forEach(deviceName => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = deviceName;

        if (deviceName === 'Main Meter') {
            checkbox.checked = true;
            selectedDeviceNames.add(deviceName);
        } else {
            checkbox.checked = false;
        }

        checkbox.addEventListener('change', function () {
            if (this.checked) {
                selectedDeviceNames.add(deviceName);
            } else {
                selectedDeviceNames.delete(deviceName);
            }
            updateBarChart();
        });

        const deviceColor = deviceColorMap.get(deviceName) || '#9E9E9E';
        label.style.cssText = `border-left: 4px solid ${deviceColor}; padding-left: 8px;`;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${deviceName}`));
        container.appendChild(label);
    });
}

function updateBarChart() {
    const filteredData = barChartData.filter(row => selectedDeviceNames.has(row.deviceName));

    const chart = echarts.getInstanceByDom(document.getElementById('chart-avg-powerfactor'));
    if (chart) {
        const option = createBarChartOption(filteredData);
        chart.setOption(option, true);
    }
}

async function initializeBarChart() {
    const chartElement = document.getElementById('chart-avg-powerfactor');
    if (!chartElement) {
        console.error('Bar chart element not found');
        return;
    }

    const chartAvgPF = echarts.init(chartElement);
    const dateRange = getDayRange(0);

    try {
        const endpoint = `/EnergyParameter/GetAllmeter_HourlyAvgPowerfactor_hot?fromDate=${encodeURIComponent(dateRange.from)}&toDate=${encodeURIComponent(dateRange.to)}`;

        const data = await fetchWithRetry(endpoint);

        console.log('Today Hourly raw data:', data);

        const processedData = processBarChartData(data);

        console.log('Processed hourly data:', processedData);

        if (processedData.length === 0) {
            chartAvgPF.setOption({
                title: {
                    text: 'No data available',
                    left: 'center',
                    top: 'center',
                    textStyle: {
                        color: '#000',
                        fontSize: 16
                    }
                }
            });
            return;
        }

        barChartData = processedData;

        // Extract unique device names and assign colors
        const allDeviceNames = [...new Set(processedData.map(row => row.deviceName))];

        // Sort to ensure Main Meter is first
        const sortedDeviceNames = allDeviceNames.sort((a, b) => {
            if (a === 'Main Meter') return -1;
            if (b === 'Main Meter') return 1;
            return a.localeCompare(b);
        });

        sortedDeviceNames.forEach((deviceName, idx) => {
            deviceColorMap.set(deviceName, getDeviceColor(deviceName, idx));
        });

        renderBarChartFilters(sortedDeviceNames);
        updateBarChart();

    } catch (error) {
        console.error('Error initializing bar chart:', error);
        chartAvgPF.setOption({
            title: {
                text: 'Data fetching issue',
                left: 'center',
                top: 'center',
                textStyle: { color: '#f44336', fontWeight: 'bold' }
            }
        });
    }

    window.addEventListener('resize', () => chartAvgPF.resize());
}

// ----------- ACTUAL POWER FACTOR LINE CHARTS - HOT PAGE -----------

let hourlyLineChartData = [];
let todayLineChartData = [];
let selectedHourlyDeviceNames = new Set();
let selectedTodayDeviceNames = new Set();
let selectedHour = null;

// ----------- Helper function to get today's hours -----------
function getDayHours(dateAgo) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - dateAgo);
    const currentHour = targetDate.getHours();
    const hours = [];

    for (let i = 0; i <= currentHour; i++) {
        hours.push({
            value: i,
            label: `${i.toString().padStart(2, '0')}:00`
        });
    }

    return hours;
}

// ----------- HOURLY LINE CHART (with Hour Filter) -----------

function createHourlyLineChartOption(filteredData, selectedHour) {
    if (selectedHour === null || selectedHour === undefined || selectedHour === '') {
        return {
            title: {
                text: 'Please select an hour',
                left: 'center',
                top: 'center',
                textStyle: { color: '#666', fontSize: 16 }
            },
            xAxis: { show: false },
            yAxis: { show: false }
        };
    }

    if (!filteredData || filteredData.length === 0) {
        return {
            title: {
                text: 'No data available',
                left: 'center',
                top: 'center',
                textStyle: { color: '#666', fontSize: 16 }
            },
            xAxis: { show: false },
            yAxis: { show: false }
        };
    }

    const sortedData = filteredData.slice().sort((a, b) => {
        const timeA = new Date(a.CreateDate || a.Timestamp || a.DateTime);
        const timeB = new Date(b.CreateDate || b.Timestamp || b.DateTime);
        return timeA - timeB;
    });

    const timelineData = sortedData.map(d => {
        const time = new Date(d.CreateDate || d.Timestamp || d.DateTime);
        return {
            timeStr: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            timestamp: time.getTime(),
            data: d
        };
    });

    const xAxisData = timelineData.map(t => t.timeStr);

    const deviceGroups = {};
    sortedData.forEach(d => {
        const deviceName = d.DeviceName;
        if (!deviceGroups[deviceName]) {
            deviceGroups[deviceName] = [];
        }
        deviceGroups[deviceName].push(d);
    });

    const series = [];
    const deviceNames = Object.keys(deviceGroups);

    deviceNames.forEach((deviceName) => {
        const deviceData = deviceGroups[deviceName];

        deviceData.sort((a, b) => {
            const timeA = new Date(a.CreateDate || a.Timestamp || a.DateTime);
            const timeB = new Date(b.CreateDate || b.Timestamp || b.DateTime);
            return timeA - timeB;
        });

        const dataPoints = timelineData.map(timePoint => {
            const match = deviceData.find(d => {
                const dTime = new Date(d.CreateDate || d.Timestamp || d.DateTime);
                return dTime.getTime() === timePoint.timestamp && d.DeviceName === deviceName;
            });

            if (match) {
                return {
                    value: parseFloat(match.Powerfactor || 0),
                    itemStyle: {
                        color: getColorFromFlag(match.ColourFlag)
                    }
                };
            }
            return null;
        });

        // Use the color from deviceColorMap for consistency
        const lineColor = deviceColorMap.get(deviceName) || '#9E9E9E';

        series.push({
            name: deviceName,
            type: 'line',
            data: dataPoints,
            smooth: true,
            showSymbol: false,
            symbolSize: 4,
            connectNulls: true,
            lineStyle: {
                width: 2,
                color: lineColor
            },
            itemStyle: {
                borderWidth: 2
            }
        });
    });

    // Add threshold lines
    series.push(
        // Green threshold line (>= 0.98)
        {
            name: '≥ 0.98 (Excellent)',
            type: 'line',
            itemStyle: {
                color: 'rgba(102, 187, 106, 0.8)'
            },
            lineStyle: {
                color: 'rgba(102, 187, 106, 0.8)'
            },
            markLine: {
                silent: true,
                symbol: 'none',
                label: {
                    show: false
                },
                lineStyle: {
                    type: 'dashed',
                    color: 'rgba(102, 187, 106, 0.8)',
                    width: 1.5
                },
                data: [{ yAxis: 0.98 }]
            },
            z: 1
        },
        // Yellow threshold line (>= 0.95)
        {
            name: '≥ 0.95 (Good)',
            type: 'line',
            itemStyle: {
                color: 'rgba(255, 167, 38, 0.8)'
            },
            lineStyle: {
                color: 'rgba(255, 167, 38, 0.8)'
            },
            markLine: {
                silent: true,
                symbol: 'none',
                label: {
                    show: false
                },
                lineStyle: {
                    type: 'dashed',
                    color: 'rgba(255, 167, 38, 0.8)',
                    width: 1.5
                },
                data: [{ yAxis: 0.95 }]
            },
            z: 1
        }
    );

    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'line' },
            formatter: function (params) {
                if (!params || params.length === 0) return '';
                let html = `<div style="background: rgba(0,0,0,0.9); border-radius: 8px; padding: 12px; min-width: 200px;">`;
                html += `<div style="color: #FFD54F; font-weight: bold; margin-bottom: 8px; text-align: center;">${params[0].name}</div>`;
                params.forEach(param => {
                    if (param.value !== null && param.value !== undefined) {
                        const value = typeof param.value === 'object' ? param.value.value : param.value;
                        if (value !== null) {
                            const color = param.data && param.data.itemStyle ? param.data.itemStyle.color : param.color;
                            html += `<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span style="color: ${color};"><strong>${param.seriesName}</strong></span>
                                <span style="color: #fff; font-weight: bold; margin-left: 20px;">${value.toFixed(2)}</span>
                            </div>`;
                        }
                    }
                });
                html += `</div>`;
                return html;
            },
            backgroundColor: 'transparent',
            borderColor: 'transparent'
        },
        legend: {
            data: ['≥ 0.98 (Excellent)', '≥ 0.95 (Good)'],
            top: 10,
            right: 20,
            type: 'scroll'
        },
        grid: { left: 60, right: 40, top: 40, bottom: 40 },
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: {
                show: false,
                color: '#666',
                fontSize: 11
            },
            axisLine: { show: true, lineStyle: { color: '#ddd' } },
            axisTick: { show: true },
            boundaryGap: false
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 1.2,
            axisLabel: { fontSize: 12, color: '#666' },
            splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
        },
        series: series,
        animation: false
    };
}

function renderHourlyDeviceFilters(deviceNames) {
    const container = document.getElementById('hourly-meter-filter-checkboxes');
    if (!container) return;

    container.innerHTML = '';

    const sortedDevices = deviceNames.sort((a, b) => {
        if (a === 'Main Meter') return -1;
        if (b === 'Main Meter') return 1;
        return a.localeCompare(b);
    });

    sortedDevices.forEach((deviceName) => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = deviceName;

        if (deviceName === 'Main Meter') {
            checkbox.checked = true;
            selectedHourlyDeviceNames.add(deviceName);
        } else {
            checkbox.checked = false;
        }

        checkbox.addEventListener('change', function () {
            if (this.checked) {
                selectedHourlyDeviceNames.add(deviceName);
            } else {
                selectedHourlyDeviceNames.delete(deviceName);
            }
            updateHourlyLineChart();
        });

        // Use deviceColorMap for consistency
        const deviceColor = deviceColorMap.get(deviceName) || '#9E9E9E';
        label.style.cssText = `border-left: 4px solid ${deviceColor}; padding-left: 8px;`;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${deviceName}`));
        container.appendChild(label);
    });
}

function renderHourFilter() {
    const container = document.getElementById('hourly-hour-filter');
    if (!container) return;

    const hours = getDayHours(19);

    const selectInput = document.createElement('select');
    selectInput.id = 'selected-hour-input';
    selectInput.style.cssText = 'padding: 8px 12px; margin: 0 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; min-width: 120px; cursor: pointer;';

    // Get current hour as default
    const currentHour = new Date().getHours();

    hours.forEach(hour => {
        const option = document.createElement('option');
        option.value = hour.value;
        option.textContent = hour.label;

        // Set current hour as selected by default
        if (hour.value === currentHour) {
            option.selected = true;
            selectedHour = currentHour;
        }

        selectInput.appendChild(option);
    });

    selectInput.addEventListener('change', function () {
        selectedHour = parseInt(this.value);
        updateHourlyLineChart();
    });

    const label = document.createElement('label');
    label.textContent = 'Filter by Hour: ';
    label.style.fontWeight = 'bold';
    label.appendChild(selectInput);

    container.innerHTML = '';
    container.appendChild(label);
}

function updateHourlyLineChart() {
    let filteredData = hourlyLineChartData.filter(row => selectedHourlyDeviceNames.has(row.DeviceName));

    if (selectedHour !== '' && selectedHour !== null && selectedHour !== undefined) {
        filteredData = filteredData.filter(row => {
            const rowDate = new Date(row.CreateDate || row.Timestamp || row.DateTime);
            return rowDate.getHours() === selectedHour;
        });
    }

    const chart = echarts.getInstanceByDom(document.getElementById('chart-prev2'));
    if (chart) {
        const option = createHourlyLineChartOption(filteredData, selectedHour);
        chart.setOption(option, true);
    }
}

async function initializeHourlyLineChart() {
    const chartElement = document.getElementById('chart-prev2');
    if (!chartElement) {
        console.error('Hourly line chart element not found');
        return;
    }

    const chartHourly = echarts.init(chartElement);
    const dateRange = getDayRange(0);

    try {
        const data = await fetchWithRetry(`/EnergyParameter/GetAllMeters_ActualPowerfactor?fromDate=${encodeURIComponent(dateRange.from)}&toDate=${encodeURIComponent(dateRange.to)}`);

        hourlyLineChartData = data;
        const deviceNames = [...new Set(data.map(d => d.DeviceName))];

        // Sort device names to ensure Main Meter is first
        const sortedDeviceNames = deviceNames.sort((a, b) => {
            if (a === 'Main Meter') return -1;
            if (b === 'Main Meter') return 1;
            return a.localeCompare(b);
        });

        // Assign colors to devices using getDeviceColor
        sortedDeviceNames.forEach((deviceName, idx) => {
            if (!deviceColorMap.has(deviceName)) {
                deviceColorMap.set(deviceName, getDeviceColor(deviceName, idx));
            }
        });

        // Set default to current hour
        selectedHour = new Date().getHours();

        // Set default to Main Meter
        if (deviceNames.includes('Main Meter')) {
            selectedHourlyDeviceNames.add('Main Meter');
        }

        renderHourlyDeviceFilters(sortedDeviceNames);
        renderHourFilter();
        updateHourlyLineChart();

    } catch (error) {
        console.error('Error fetching hourly line chart data:', error);
        chartHourly.setOption({
            title: { text: 'Data fetching issue', left: 'center', top: 'center', textStyle: { color: '#f44336', fontWeight: 'bold' } }
        });
    }

    window.addEventListener('resize', () => chartHourly.resize());
}

// ----------- TODAY LINE CHART (Full Today Data) -----------

function createTodayLineChartOption(filteredData) {
    if (!filteredData || filteredData.length === 0) {
        return {
            title: {
                text: 'No data available',
                left: 'center',
                top: 'center',
                textStyle: { color: '#666', fontSize: 16 }
            },
            xAxis: { show: false },
            yAxis: { show: false }
        };
    }

    const sortedData = filteredData.slice().sort((a, b) => {
        const timeA = new Date(a.CreateDate || a.Timestamp || a.DateTime);
        const timeB = new Date(b.CreateDate || b.Timestamp || a.DateTime);
        return timeA - timeB;
    });

    const timelineData = sortedData.map(d => {
        const time = new Date(d.CreateDate || d.Timestamp || d.DateTime);
        return {
            timeStr: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: time.getTime(),
            data: d
        };
    });

    const xAxisData = timelineData.map(t => t.timeStr);

    const deviceGroups = {};
    sortedData.forEach(d => {
        const deviceName = d.DeviceName;
        if (!deviceGroups[deviceName]) {
            deviceGroups[deviceName] = [];
        }
        deviceGroups[deviceName].push(d);
    });

    const series = [];
    const deviceNames = Object.keys(deviceGroups);

    deviceNames.forEach((deviceName) => {
        const deviceData = deviceGroups[deviceName];

        deviceData.sort((a, b) => {
            const timeA = new Date(a.CreateDate || a.Timestamp || a.DateTime);
            const timeB = new Date(b.CreateDate || b.Timestamp || b.DateTime);
            return timeA - timeB;
        });

        const dataPoints = timelineData.map(timePoint => {
            const match = deviceData.find(d => {
                const dTime = new Date(d.CreateDate || d.Timestamp || d.DateTime);
                return dTime.getTime() === timePoint.timestamp && d.DeviceName === deviceName;
            });

            if (match) {
                return {
                    value: parseFloat(match.Powerfactor || 0),
                    itemStyle: {
                        color: getColorFromFlag(match.ColourFlag)
                    }
                };
            }
            return null;
        });

        // Use deviceColorMap for consistency
        const lineColor = deviceColorMap.get(deviceName) || '#9E9E9E';

        series.push({
            name: deviceName,
            type: 'line',
            data: dataPoints,
            smooth: true,
            showSymbol: false,
            symbolSize: 4,
            connectNulls: true,
            lineStyle: {
                width: 2,
                color: lineColor
            },
            itemStyle: {
                borderWidth: 2
            }
        });
    });

    // Add threshold lines
    series.push(
        // Green threshold line (>= 0.98)
        {
            name: '≥ 0.98 (Excellent)',
            type: 'line',
            itemStyle: {
                color: 'rgba(102, 187, 106, 0.8)'
            },
            lineStyle: {
                color: 'rgba(102, 187, 106, 0.8)'
            },
            markLine: {
                silent: true,
                symbol: 'none',
                label: {
                    show: false
                },
                lineStyle: {
                    type: 'dashed',
                    color: 'rgba(102, 187, 106, 0.8)',
                    width: 1.5
                },
                data: [{ yAxis: 0.98 }]
            },
            z: 1
        },
        // Yellow threshold line (>= 0.95)
        {
            name: '≥ 0.95 (Good)',
            type: 'line',
            itemStyle: {
                color: 'rgba(255, 167, 38, 0.8)'
            },
            lineStyle: {
                color: 'rgba(255, 167, 38, 0.8)'
            },
            markLine: {
                silent: true,
                symbol: 'none',
                label: {
                    show: false
                },
                lineStyle: {
                    type: 'dashed',
                    color: 'rgba(255, 167, 38, 0.8)',
                    width: 1.5
                },
                data: [{ yAxis: 0.95 }]
            },
            z: 1
        }
    );

    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'line' },
            formatter: function (params) {
                if (!params || params.length === 0) return '';
                let html = `<div style="background: rgba(0,0,0,0.9); border-radius: 8px; padding: 12px; min-width: 200px;">`;
                html += `<div style="color: #FFD54F; font-weight: bold; margin-bottom: 8px; text-align: center;">${params[0].name}</div>`;
                params.forEach(param => {
                    if (param.value !== null && param.value !== undefined) {
                        const value = typeof param.value === 'object' ? param.value.value : param.value;
                        if (value !== null) {
                            const color = param.data && param.data.itemStyle ? param.data.itemStyle.color : param.color;
                            html += `<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                <span style="color: ${color};"><strong>${param.seriesName}</strong></span>
                                <span style="color: #fff; font-weight: bold; margin-left: 20px;">${value.toFixed(2)}</span>
                            </div>`;
                        }
                    }
                });
                html += `</div>`;
                return html;
            },
            backgroundColor: 'transparent',
            borderColor: 'transparent'
        },
        legend: {
            data: ['≥ 0.98 (Excellent)', '≥ 0.95 (Good)'],
            top: 10,
            right: 20,
            type: 'scroll'
        },
        grid: { left: 60, right: 40, top: 40, bottom: 40 },
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: {
                show: false,
                color: '#666',
                fontSize: 11
            },
            axisLine: { show: true, lineStyle: { color: '#ddd' } },
            axisTick: { show: true },
            boundaryGap: false
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 1.2,
            axisLabel: { fontSize: 12, color: '#666' },
            splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
        },
        series: series,
        animation: false
    };
}

function renderTodayDeviceFilters(deviceNames) {
    const container = document.getElementById('today-meter-filter-checkboxes');
    if (!container) return;

    container.innerHTML = '';

    const sortedDevices = deviceNames.sort((a, b) => {
        if (a === 'Main Meter') return -1;
        if (b === 'Main Meter') return 1;
        return a.localeCompare(b);
    });

    sortedDevices.forEach((deviceName) => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = deviceName;

        if (deviceName === 'Main Meter') {
            checkbox.checked = true;
            selectedTodayDeviceNames.add(deviceName);
        } else {
            checkbox.checked = false;
        }

        checkbox.addEventListener('change', function () {
            if (this.checked) {
                selectedTodayDeviceNames.add(deviceName);
            } else {
                selectedTodayDeviceNames.delete(deviceName);
            }
            updateTodayLineChart();
        });

        // Use deviceColorMap for consistency
        const deviceColor = deviceColorMap.get(deviceName) || '#9E9E9E';
        label.style.cssText = `border-left: 4px solid ${deviceColor}; padding-left: 8px;`;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${deviceName}`));
        container.appendChild(label);
    });
}

function updateTodayLineChart() {
    const filteredData = todayLineChartData.filter(row => selectedTodayDeviceNames.has(row.DeviceName));

    const chart = echarts.getInstanceByDom(document.getElementById('chart-today2'));
    if (chart) {
        const option = createTodayLineChartOption(filteredData);
        chart.setOption(option, true);
    }
}

async function initializeTodayLineChart() {
    const chartElement = document.getElementById('chart-today2');
    if (!chartElement) {
        console.error('Today line chart element not found');
        return;
    }

    const chartToday = echarts.init(chartElement);
    const dateRange = getDayRange(0);

    try {
        const data = await fetchWithRetry(`/EnergyParameter/GetAllMeters_ActualPowerfactor?fromDate=${encodeURIComponent(dateRange.from)}&toDate=${encodeURIComponent(dateRange.to)}`);

        todayLineChartData = data;
        const deviceNames = [...new Set(data.map(d => d.DeviceName))];

        // Sort device names to ensure Main Meter is first
        const sortedDeviceNames = deviceNames.sort((a, b) => {
            if (a === 'Main Meter') return -1;
            if (b === 'Main Meter') return 1;
            return a.localeCompare(b);
        });

        // Assign colors to devices using getDeviceColor
        sortedDeviceNames.forEach((deviceName, idx) => {
            if (!deviceColorMap.has(deviceName)) {
                deviceColorMap.set(deviceName, getDeviceColor(deviceName, idx));
            }
        });

        renderTodayDeviceFilters(sortedDeviceNames);
        updateTodayLineChart();

    } catch (error) {
        console.error('Error fetching today line chart data:', error);
        chartToday.setOption({
            title: { text: 'Data fetching issue', left: 'center', top: 'center', textStyle: { color: '#f44336', fontWeight: 'bold' } }
        });
    }

    window.addEventListener('resize', () => chartToday.resize());
}

// ----------- Initialize Both Line Charts -----------

document.addEventListener('DOMContentLoaded', function () {
    Promise.all([
        initializeBarChart(),
        initializeHourlyLineChart(),
        initializeTodayLineChart()
    ]).catch(error => {
        console.error('Error during initialization:', error);
    });
});