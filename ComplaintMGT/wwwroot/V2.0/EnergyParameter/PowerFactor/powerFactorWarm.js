// ----------- Helper Functions -----------

function formatDate(date) {
    const pad = num => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getCurrentWeekRange(dateAgo) {
    const now = new Date();

    // Move back by dateAgo days
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - dateAgo);

    // Get Monday
    const dayOfWeek = targetDate.getDay(); // 0 (Sun) - 6 (Sat)
    const monday = new Date(targetDate);
    monday.setDate(targetDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    // Get Sunday
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return {
        from: formatDate(monday),
        to: formatDate(sunday > now ? now : sunday)
    };
}


function getPreviousWeekRange(dateAgo) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - dateAgo);
    const dayOfWeek = targetDate.getDay();
    const thisMonday = new Date(targetDate);
    thisMonday.setDate(targetDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const lastSunday = new Date(thisMonday);
    lastSunday.setDate(thisMonday.getDate() - 1);
    lastSunday.setHours(23, 59, 59, 999);

    const lastMonday = new Date(lastSunday);
    lastMonday.setDate(lastSunday.getDate() - 6);
    lastMonday.setHours(0, 0, 0, 0);

    return {
        from: formatDate(lastMonday),
        to: formatDate(lastSunday)
    };
}

function getMonthRange(monthsAgo) {
    const now = new Date();
    const fromDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
    const toDate = monthsAgo === 0
        ? now
        : new Date(now.getFullYear(), now.getMonth() - monthsAgo + 1, 0, 23, 59, 59, 999);

    return {
        from: formatDate(fromDate),
        to: formatDate(toDate)
    };
}

// Get all weeks in a specific month (monthsAgo: 0 = current month, 1 = last month, etc.)
function getMonthWeeks(monthsAgo) {
    const now = new Date();
    const year = now.getFullYear();
    const targetMonth = now.getMonth() - monthsAgo;

    // Adjust year if month goes negative
    const adjustedDate = new Date(year, targetMonth, 1);
    const finalYear = adjustedDate.getFullYear();
    const finalMonth = adjustedDate.getMonth();

    // First day of target month
    const firstDay = new Date(finalYear, finalMonth, 1);
    firstDay.setHours(0, 0, 0, 0);

    // Last day of target month
    const lastDay = new Date(finalYear, finalMonth + 1, 0);
    lastDay.setHours(23, 59, 59, 999);

    // If it's current month, limit to today
    const today = new Date();
    const effectiveLastDay = (monthsAgo === 0 && lastDay > today) ? today : lastDay;

    const weeks = [];
    let weekStart = new Date(firstDay);
    weekStart.setHours(0, 0, 0, 0);

    let weekNumber = 1;

    while (weekStart <= effectiveLastDay) {
        // Week ends 6 days later (7 days total)
        let weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        // If week end goes beyond target month or effective last day, cap it
        if (weekEnd > effectiveLastDay) {
            weekEnd = new Date(effectiveLastDay);
            weekEnd.setHours(23, 59, 59, 999);
        }

        weeks.push({
            weekNumber: weekNumber,
            from: formatDate(weekStart),
            to: formatDate(weekEnd),
            label: `Week ${weekNumber}`
        });

        // Move to next week
        weekStart = new Date(weekEnd);
        weekStart.setDate(weekEnd.getDate() + 1);
        weekStart.setHours(0, 0, 0, 0);

        weekNumber++;
    }

    return weeks;
}

function getMonthName(monthsAgo) {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
    return targetDate.toLocaleString('default', { month: 'short', year: 'numeric' });
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

function renderPowerFactorSummary(data, summaryId, noDataId, colorFlag) {
    const summaryContainer = document.getElementById(summaryId);
    const noDataMsg = document.getElementById(noDataId);

    if (!summaryContainer) return;

    summaryContainer.innerHTML = '';

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
        if (noDataMsg) noDataMsg.style.display = 'block';
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

function renderHighPowerFactorSummary(data) {
    renderPowerFactorSummary(data, 'high-pf-summary', 'no-high-pf-message', 'green');
}

function renderLowPowerFactorSummary(data) {
    renderPowerFactorSummary(data, 'low-pf-summary', 'no-low-pf-message', 'red');
}

 //----------- Update Headers -----------
function updateHighLowPowerChartHeaders() {
    const monthName = getMonthName(0);

    const sections = [
        { selector: '.voltage-summary-section:nth-of-type(2) .voltage-summary-div h3', text: `High Power Factor (≥ 0.98)- ${monthName}` },
        { selector: '.voltage-summary-section:nth-of-type(3) .voltage-summary-div h3', text: `Low Power Factor (< 0.95)- ${monthName}` }
    ];



    sections.forEach(({ selector, text }) => {
        const element = document.querySelector(selector);
        if (element && monthName) {
            const iconHtml = element.querySelector('img')?.outerHTML || '';
            element.innerHTML = `${iconHtml} ${text}`;
        }
    });
}

 

// ----------- Fetch and Render Initial Data -----------

async function initializePowerFactorData() {
    const grid1 = document.getElementById('powerfactor-grid-1');
    let mainCirclesError = false;
    let highLowPFError = false;

    try {
        let mainCirclesData = [];
        let highLowPFData = [];
        const dateRange = getMonthRange(0);

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
        updateHighLowPowerChartHeaders();

    } catch (error) {
        console.error('Error fetching power factor data:', error);
        if (grid1) {
            grid1.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #f44336;">Error loading data. Please refresh.</div>';
        }
    }
}

initializePowerFactorData();





// ----------- Average Power Factor Bar Chart (Week-wise for Specific Month) -----------

let barChartData = [];
let selectedDeviceNames = new Set();
let deviceColorMap = new Map();


function processBarChartData(data, weekLabel) {
    if (!data || data.length === 0) return [];

    return data.map((row) => {
        // Parse ReadingDate from API
        const readingDate = row.ReadingDate ? new Date(row.ReadingDate) : null;
        const formattedDate = readingDate
            ? readingDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'N/A';

        return {
            week: weekLabel,
            date: formattedDate,
            readingDate: row.ReadingDate,
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
            title: { text: 'No data available', left: 'center', top: 'center', textStyle: { color: '#666', fontSize: 16 } },
            xAxis: { show: false },
            yAxis: { show: false }
        };
    }

    const seriesData = [];
    const xAxisLabels = [];
    const weekBoundaries = [];
    let maxPF = 0;
    let currentIndex = 0;
    const barMetadata = [];

    filteredData.forEach((weekData, weekIndex) => {
        weekBoundaries.push({
            start: currentIndex,
            end: currentIndex + weekData.rows.length - 1,
            week: weekData.week
        });

        weekData.rows.forEach((row) => {
            const pfValue = parseFloat(row.avgPowerFactor);
            if (pfValue > maxPF) maxPF = pfValue;

            const deviceColor = deviceColorMap.get(row.deviceName) || '#9E9E9E';

            seriesData.push({
                value: pfValue,
                itemStyle: {
                    borderRadius: [8, 8, 0, 0],
                    color: deviceColor
                },
                rowData: row
            });

            barMetadata.push({
                week: weekData.week,
                deviceName: row.deviceName,
                allWeekData: weekData.rows
            });

            xAxisLabels.push('');
            currentIndex++;
        });

        // Add spacing between week groups (except after last week)
        if (weekIndex < filteredData.length - 1) {
            seriesData.push({ value: null, itemStyle: { opacity: 0 } });
            xAxisLabels.push('');
            barMetadata.push(null);
            currentIndex++;
        }
    });

    return {
        tooltip: {
            trigger: 'item', // Changed from 'axis' to 'item' so it triggers strictly on the specific bar
            formatter: function (params) {
                // With trigger: 'item', params is the direct data object (not an array)
                const dataPoint = params.data;

                // Safety check
                if (!dataPoint || !dataPoint.rowData) return '';

                const row = dataPoint.rowData;

                // Use your existing color helper
                const color = getColorFromFlag(row.colourFlag);

                // Build HTML for just this SINGLE day
                let html = `
            <div style="background: rgba(0,0,0,0.9); border-radius: 8px; padding: 12px; min-width: 200px;">
                <div style="color: #66BB6A; font-weight: bold; margin-bottom: 12px; font-size: 14px; text-align: center; border-bottom: 2px solid #66BB6A; padding-bottom: 8px;">
                    ${row.week} - ${row.deviceName}
                </div>
                <div style="margin-bottom: 0; padding: 6px; background: rgba(255,255,255,0.05); border-radius: 4px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="color: #FFD54F;"><strong>Date:</strong></span>
                        <span style="color: #fff; font-weight: bold;">${row.date}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #FFD54F;"><strong>Power Factor:</strong></span>
                        <span style="color: ${color}; font-weight: bold; font-size: 16px;">${row.avgPowerFactor}</span>
                    </div>
                    ${row.deviceId ? `<div style="color: #999; font-size: 10px; margin-top: 4px;">${row.deviceId}</div>` : ''}
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
        grid: { left: 60, right: 40, top: 40, bottom: 40 },
        xAxis: {
            type: 'category',
            data: xAxisLabels,
            axisLabel: {
                color: '#666',
                fontSize: 13,
                fontWeight: 'bold',
                interval: 0,
                formatter: function (value, index) {
                    for (const boundary of weekBoundaries) {
                        const centerIndex = Math.floor((boundary.start + boundary.end) / 2);
                        if (index === centerIndex) return boundary.week;
                    }
                    return '';
                }
            },
            axisLine: { lineStyle: { color: '#ddd' } },
            axisTick: { show: false }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 1.2,
            splitLine: { lineStyle: { type: 'dashed', color: '#eee' } },
            axisLabel: { color: '#666', fontSize: 12 }
        },
        series: [{
            data: seriesData,
            type: 'bar',
            barWidth: '70%',
            label: { show: false },
            z: 2
        },
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
        ]
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
    const filteredData = barChartData.map(weekData => ({
        week: weekData.week,
        rows: weekData.rows.filter(row => selectedDeviceNames.has(row.deviceName))
    })).filter(weekData => weekData.rows.length > 0);

    const chart = echarts.getInstanceByDom(document.getElementById('chart-avg-powerfactor'));
    if (chart) {
        const option = createBarChartOption(filteredData);
        chart.setOption(option, true);
    }
}

// Update chart title with month name
function updateBarChartHeader(monthsAgo) {
    const monthName = getMonthName(monthsAgo);
    const headerElement = document.querySelector('.avg-voltage-section .card-header');
    if (headerElement && monthName) {
        const iconHtml = headerElement.querySelector('.icon-box')?.outerHTML || '';
        const titleText = `Average Power Factor (Daily) - ${monthName}`;
        headerElement.innerHTML = `${iconHtml} ${titleText}`;
    }
}

async function initializeBarChart(monthsAgo = 0) {
    const chartElement = document.getElementById('chart-avg-powerfactor');
    if (!chartElement) {
        console.error('Bar chart element not found');
        return;
    }

    const chartAvgPF = echarts.init(chartElement);

    // Get all weeks in the specified month
    const weeks = getMonthWeeks(monthsAgo);

    console.log(`Weeks in ${getMonthName(monthsAgo)}:`, weeks);

    const allWeeklyData = new Array(weeks.length);
    const allDeviceNames = new Set();
    let completedRequests = 0;

    try {
        weeks.forEach((week, index) => {
            const endpoint = `/EnergyParameter/GetAllmeter_DailyAvgPowerfactor_warm?fromDate=${encodeURIComponent(week.from)}&toDate=${encodeURIComponent(week.to)}`;

            fetchWithRetry(endpoint)
                .then(data => {
                    console.log(`${week.label} raw data:`, data);

                    const weekRows = processBarChartData(data, week.label);
                    weekRows.forEach(row => allDeviceNames.add(row.deviceName));

                    allWeeklyData[index] = {
                        week: week.label,
                        rows: weekRows
                    };

                    console.log(`${week.label} processed ${weekRows.length} rows:`, allWeeklyData[index]);

                    completedRequests++;

                    // Once all week APIs have responded, render chart
                    if (completedRequests === weeks.length) {
                        const validData = allWeeklyData.filter(w => w && w.rows.length > 0);

                        if (validData.length > 0) {
                            console.log('Combined weekly data for chart:', validData);

                            barChartData = validData;

                            const deviceArray = Array.from(allDeviceNames);
                            deviceArray.forEach((deviceName, idx) => {
                                deviceColorMap.set(deviceName, getDeviceColor(deviceName, idx));
                            });

                            renderBarChartFilters(deviceArray);
                            updateBarChart();
                            updateBarChartHeader(monthsAgo);
                        } else {
                            chartAvgPF.setOption({
                                title: {
                                    text: 'No data available',
                                    left: 'center',
                                    top: 'center',
                                    textStyle: {
                                        color: '#999',
                                        fontSize: 16
                                    }
                                }
                            });
                        }
                    }
                })
                .catch(error => {
                    console.error(`Error fetching ${week.label} data:`, error);
                    completedRequests++;

                    if (completedRequests === weeks.length) {
                        const validData = allWeeklyData.filter(w => w && w.rows.length > 0);

                        if (validData.length > 0) {
                            barChartData = validData;

                            const deviceArray = Array.from(allDeviceNames);
                            deviceArray.forEach((deviceName, idx) => {
                                deviceColorMap.set(deviceName, getDeviceColor(deviceName, idx));
                            });

                            renderBarChartFilters(deviceArray);
                            updateBarChart();
                            updateBarChartHeader(monthsAgo);
                        } else {
                            chartAvgPF.setOption({
                                title: {
                                    text: 'Error loading data',
                                    left: 'center',
                                    top: 'center',
                                    textStyle: {
                                        color: '#f44336',
                                        fontSize: 16
                                    }
                                }
                            });
                        }
                    }
                });
        });

    } catch (error) {
        console.error('Error initializing bar chart:', error);
        chartAvgPF.setOption({
            title: { text: 'Error loading data', left: 'center', top: 'center', textStyle: { color: '#f44336' } }
        });
    }

    window.addEventListener('resize', () => chartAvgPF.resize());
}

// ----------- Actual Power Factor Line Chart -----------

let lineChartData = [];
let selectedLineDeviceNames = new Set();
let selectedDate = '';
let lineChartDateRange = { from: '', to: '' };

function createLineChartOption(filteredData) {
    if (!selectedDate) {
        return {
            title: {
                text: 'Please select a date',
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
                text: 'No data available for selected date',
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

    deviceNames.forEach((deviceName, deviceIndex) => {
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

        const lineColor = deviceColorMap.get(deviceName) || getDeviceColor(deviceName, deviceIndex);

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
        grid: { left: 60, right: 40, top: 40, bottom: 20 },
        xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: {
                show: false,
                color: '#666',
                fontSize: 11,
                interval: 'auto',
                rotate: 45
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

function renderLineChartFilters(deviceNames) {
    const container = document.getElementById('line-meter-filter-checkboxes');
    if (!container) return;

    container.innerHTML = '';

    const sortedDevices = deviceNames.sort((a, b) => {
        if (a === 'Main Meter') return -1;
        if (b === 'Main Meter') return 1;
        return a.localeCompare(b);
    });

    sortedDevices.forEach((deviceName, index) => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = deviceName;

        if (deviceName === 'Main Meter') {
            checkbox.checked = true;
            selectedLineDeviceNames.add(deviceName);
        } else {
            checkbox.checked = false;
        }

        checkbox.addEventListener('change', function () {
            if (this.checked) {
                selectedLineDeviceNames.add(deviceName);
            } else {
                selectedLineDeviceNames.delete(deviceName);
            }
            updateLineChart();
        });

        const deviceColor = deviceColorMap.get(deviceName) || getDeviceColor(deviceName, index);
        label.style.cssText = `border-left: 4px solid ${deviceColor}; padding-left: 8px;`;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${deviceName}`));
        container.appendChild(label);
    });
}

function renderDateFilter() {
    const container = document.getElementById('line-date-filter');
    if (!container) return;

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.id = 'selected-date-input';
    dateInput.style.cssText = 'padding: 8px; margin: 0 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;';

    if (lineChartDateRange.from && lineChartDateRange.to) {
        const fromDateStr = lineChartDateRange.from.split(' ')[0];
        const toDateStr = lineChartDateRange.to.split(' ')[0];

        dateInput.min = fromDateStr;
        dateInput.max = toDateStr;
        dateInput.value = fromDateStr;
        selectedDate = fromDateStr;
    }

    dateInput.addEventListener('change', function () {
        selectedDate = this.value;
        updateLineChart();
    });

    const label = document.createElement('label');
    label.textContent = 'Filter by Date: ';
    label.style.fontWeight = 'bold';
    label.appendChild(dateInput);

    container.innerHTML = '';
    container.appendChild(label);
}

function updateLineChartFooter() {
    const footerElement = document.querySelector('.second-chart .legend-footer');
    if (footerElement && lineChartDateRange.monthName) {
        footerElement.textContent = `${lineChartDateRange.monthName} - Real-time Data`;
    }
}

function updateLineChart() {
    let filteredData = lineChartData.filter(row => selectedLineDeviceNames.has(row.DeviceName));

    if (selectedDate) {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const startTimestamp = startOfDay.getTime();
        const endTimestamp = endOfDay.getTime();

        filteredData = filteredData.filter(row => {
            const rowDate = new Date(row.CreateDate || row.Timestamp || row.DateTime);
            const rowTimestamp = rowDate.getTime();
            return rowTimestamp >= startTimestamp && rowTimestamp <= endTimestamp;
        });
    }

    const chart = echarts.getInstanceByDom(document.getElementById('chart-actual-powerfactor'));
    if (chart) {
        const option = createLineChartOption(filteredData);
        chart.setOption(option, true);
    }
}

async function initializeLineChart() {
    const chartElement = document.getElementById('chart-actual-powerfactor');
    if (!chartElement) {
        console.error('Line chart element not found');
        return;
    }

    const chartActualPF = echarts.init(chartElement);
    const dateRange = getMonthRange(0);

    lineChartDateRange = {
        from: dateRange.from,
        to: dateRange.to,
        monthName: getMonthName(0)
    };

    try {
        const data = await fetchWithRetry(`/EnergyParameter/GetAllMeters_ActualPowerfactor?fromDate=${encodeURIComponent(dateRange.from)}&toDate=${encodeURIComponent(dateRange.to)}`);

        lineChartData = data;
        const deviceNames = [...new Set(data.map(d => d.DeviceName))];

        renderLineChartFilters(deviceNames);
        renderDateFilter();
        updateLineChartFooter();
        updateLineChart();

    } catch (error) {
        console.error('Error fetching line chart data:', error);
        chartActualPF.setOption({
            title: { text: 'Error loading data', left: 'center', top: 'center', textStyle: { color: '#f44336' } }
        });
    }

    window.addEventListener('resize', () => chartActualPF.resize());
}

// ----------- Initialize All Components -----------

document.addEventListener('DOMContentLoaded', function () {
    Promise.all([
        initializeBarChart(),
        initializeLineChart()
    ]).catch(error => {
        console.error('Error during initialization:', error);
    });
});