//var from2 = '2025-11-01 00:00:29.900';
//var to2 = '2025-11-02 00:00:29.900';
//var from1 = '2025-11-01 11:00:29.900';
//var to1 = '2025-11-01 12:00:29.900';

function formatDate(date) {
    const pad = num => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function gettodayRange() {
    const toDate = new Date(); // Current date & time

    const fromDate = new Date(toDate); // Copy current date
    fromDate.setDate(toDate.getDate()); // 0 days ago
    fromDate.setHours(0, 0, 0, 0); // Set time to 12:00 AM

    return {
        from2: formatDate(fromDate),
        to2: formatDate(toDate)
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
const { from2, to2 } = gettodayRange();

//var from2 = '2025-11-03 00:00:29.900';
//var to2 = '2025-11-03 23:59:29.900';

//var from1 = '2025-11-03 11:00:00.900';
//var to1 = '2025-11-03 12:00:00.900';

// ----------- Voltage Color Logic -----------
function getVoltageColor(voltage) {
    const voltageValue = parseFloat(voltage);

    if (voltageValue < 220) {
        return '#FFF176'; // Light yellow for low voltage
    } else if (voltageValue >= 220 && voltageValue <= 240) {
        return '#81C784'; // Light green for normal voltage
    } else {
        return '#E57373'; // Light red for high voltage
    }
}

// ----------- Render All Voltage Circles -----------
function renderVoltageCircles(mainMeterData, subMeterData) {
    const grid1 = document.getElementById('voltage-grid-1');
    const grid2 = document.getElementById('voltage-grid-2');

    if (!grid1 || !grid2) {
        console.error('Grid elements not found');
        return;
    }

    grid1.innerHTML = '';
    grid2.innerHTML = '';

    const allDevices = [];

    console.log('Main Meter Data:', mainMeterData);
    console.log('Sub Meter Data:', subMeterData);

    // Add main meter first
    if (mainMeterData && mainMeterData.length > 0) {
        const main = mainMeterData[0];
        const voltage = main.Voltage !== undefined ? main.Voltage : (main.Total_voltage !== undefined ? main.Total_voltage : '-');

        allDevices.push({
            voltage: typeof voltage === 'number' ? voltage.toFixed(2) : voltage,
            name: main.DeviceName || 'Main Meter',
            r_voltage: main.R_Voltage !== undefined ? parseFloat(main.R_Voltage).toFixed(2) : '-',
            y_voltage: main.Y_Voltage !== undefined ? parseFloat(main.Y_Voltage).toFixed(2) : '-',
            b_voltage: main.B_Voltage !== undefined ? parseFloat(main.B_Voltage).toFixed(2) : '-',
            color: getVoltageColor(voltage),
            isMainMeter: true
        });
    }

    // Add submeters
    if (subMeterData && subMeterData.length > 0) {
        subMeterData.forEach(device => {
            console.log('Sub meter object:', device);

            const voltage = device.Voltage !== undefined ? device.Voltage : (device.Total_voltage !== undefined ? device.Total_voltage : '-');

            allDevices.push({
                voltage: typeof voltage === 'number' ? voltage.toFixed(2) : voltage,
                name: device.DeviceName || '',
                r_voltage: device.R_Voltage !== undefined ? parseFloat(device.R_Voltage).toFixed(2) : '-',
                y_voltage: device.Y_Voltage !== undefined ? parseFloat(device.Y_Voltage).toFixed(2) : '-',
                b_voltage: device.B_Voltage !== undefined ? parseFloat(device.B_Voltage).toFixed(2) : '-',
                color: getVoltageColor(voltage),
                isMainMeter: false
            });
        });
    }

    console.log('All Devices:', allDevices);

    // Split into two grids: max 7 per grid
    const grid1Devices = allDevices.slice(0, 7);
    const grid2Devices = allDevices.slice(7);

    // Populate grid 1
    grid1Devices.forEach((device, index) => {
        const circleBox = createCircleElement(device);
        grid1.appendChild(circleBox);
    });

    // Populate grid 2
    if (grid2Devices.length > 0) {
        grid2Devices.forEach(device => {
            const circleBox = createCircleElement(device);
            grid2.appendChild(circleBox);
        });
    }
}

// Helper function to create circle element with tooltip
function createCircleElement(device) {
    const circleBox = document.createElement('div');
    circleBox.className = 'circle-box';
    circleBox.setAttribute('data-label', device.name);
    circleBox.style.position = 'relative';

    // Create voltage value text
    const voltageText = document.createElement('div');
    voltageText.style.position = 'relative';
    voltageText.style.zIndex = '1';
    voltageText.textContent = device.voltage;

    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'voltage-tooltip';

    const tooltipContent = document.createElement('div');
    tooltipContent.className = 'voltage-tooltip-content';

    // R Voltage
    const rRow = document.createElement('div');
    rRow.className = 'voltage-tooltip-row';
    rRow.innerHTML = `
        <span class="voltage-tooltip-label">R Phase</span>
        <span class="voltage-tooltip-value">${device.r_voltage} V</span>
    `;

    // Y Voltage
    const yRow = document.createElement('div');
    yRow.className = 'voltage-tooltip-row';
    yRow.innerHTML = `
        <span class="voltage-tooltip-label">Y Phase</span>
        <span class="voltage-tooltip-value">${device.y_voltage} V</span>
    `;

    // B Voltage
    const bRow = document.createElement('div');
    bRow.className = 'voltage-tooltip-row';
    bRow.innerHTML = `
        <span class="voltage-tooltip-label">B Phase</span>
        <span class="voltage-tooltip-value">${device.b_voltage} V</span>
    `;

    tooltipContent.appendChild(rRow);
    tooltipContent.appendChild(yRow);
    tooltipContent.appendChild(bRow);
    tooltip.appendChild(tooltipContent);

    circleBox.appendChild(voltageText);
    circleBox.appendChild(tooltip);

    // Apply styling
    circleBox.style.backgroundColor = device.color;

    circleBox.style.color = '#222';

    if (device.isMainMeter) {
        circleBox.style.border = '3px solid #333';
        circleBox.style.fontWeight = 'bold';
    }

    return circleBox;
}

// Updated renderHighVoltageCircles - uses separate API data
function renderHighVoltageCircles(mainMeterHighVoltage, subMeterHighVoltage) {
    const highVoltageGrid = document.getElementById('high-voltage-grid');
    const noHighVoltageMsg = document.getElementById('no-high-voltage-message');

    if (!highVoltageGrid) {
        console.error('High voltage grid element not found');
        return;
    }

    highVoltageGrid.innerHTML = '';

    const highVoltageDevices = [];

    console.log('Main Meter High Voltage Data:', mainMeterHighVoltage);
    console.log('Sub Meter High Voltage Data:', subMeterHighVoltage);

    // Add main meter high voltage
    if (mainMeterHighVoltage && mainMeterHighVoltage.length > 0) {
        mainMeterHighVoltage.forEach(device => {
            const voltage = device.AvgHighVoltage !== undefined ? device.AvgHighVoltage : (device.VolAvgHighVoltagetage !== undefined ? device.AvgHighVoltage : '-');

            highVoltageDevices.push({
                voltage: typeof voltage === 'number' ? voltage.toFixed(2) : voltage,
                name: device.DeviceName || 'Main Meter',
                count: device.HighVoltageCount !== undefined ? device.HighVoltageCount : '-',
                isMainMeter: true
            });
        });
    }

    // Add sub meter high voltage
    if (subMeterHighVoltage && subMeterHighVoltage.length > 0) {
        subMeterHighVoltage.forEach(device => {
            const voltage = device.AvgHighVoltage !== undefined ? device.AvgHighVoltage : (device.AvgHighVoltage !== undefined ? device.AvgHighVoltage : '-');

            highVoltageDevices.push({
                voltage: typeof voltage === 'number' ? voltage.toFixed(2) : voltage,
                name: device.DeviceName || '',
                count: device.HighVoltageCount !== undefined ? device.HighVoltageCount : '-',
                isMainMeter: false
            });
        });
    }

    console.log('High Voltage Devices:', highVoltageDevices);

    if (highVoltageDevices.length === 0) {
        highVoltageGrid.style.display = 'none';
        if (noHighVoltageMsg) noHighVoltageMsg.style.display = 'block';
        return;
    }

    highVoltageGrid.style.display = 'flex';
    if (noHighVoltageMsg) noHighVoltageMsg.style.display = 'none';

    highVoltageDevices.forEach((device) => {
        const circleBox = document.createElement('div');
        circleBox.className = 'circle-box';
        circleBox.setAttribute('data-label', device.name);
        circleBox.style.position = 'relative';

        const voltageText = document.createElement('div');
        voltageText.style.position = 'relative';
        voltageText.style.zIndex = '1';
        voltageText.textContent = device.voltage;

        const tooltip = document.createElement('div');
        tooltip.className = 'voltage-tooltip';

        const tooltipContent = document.createElement('div');
        tooltipContent.className = 'voltage-tooltip-content';

        const countRow = document.createElement('div');
        countRow.className = 'voltage-tooltip-row';
        countRow.innerHTML = `
            <span class="voltage-tooltip-label">HighVoltageCount:</span>
            <span class="voltage-tooltip-value">${device.count}</span>
        `;

        tooltipContent.appendChild(countRow);
        tooltip.appendChild(tooltipContent);

        circleBox.appendChild(voltageText);
        circleBox.appendChild(tooltip);

        circleBox.style.backgroundColor = '#E57373';
        circleBox.style.color = '#333';

        if (device.isMainMeter) {
            circleBox.style.border = '3px solid #333';
            circleBox.style.fontWeight = 'bold';
        }

        highVoltageGrid.appendChild(circleBox);
    });
}

// Updated renderLowVoltageCircles - uses separate API data
function renderLowVoltageCircles(mainMeterLowVoltage, subMeterLowVoltage) {
    const lowVoltageGrid = document.getElementById('low-voltage-grid');
    const noLowVoltageMsg = document.getElementById('no-low-voltage-message');

    if (!lowVoltageGrid) {
        console.error('Low voltage grid element not found');
        return;
    }

    lowVoltageGrid.innerHTML = '';

    const lowVoltageDevices = [];

    console.log('Main Meter Low Voltage Data:', mainMeterLowVoltage);
    console.log('Sub Meter Low Voltage Data:', subMeterLowVoltage);

    // Add main meter low voltage
    if (mainMeterLowVoltage && mainMeterLowVoltage.length > 0) {
        mainMeterLowVoltage.forEach(device => {
            const voltage = device.AvgLowVoltage !== undefined ? device.AvgLowVoltage : (device.AvgLowVoltage !== undefined ? device.AvgLowVoltage : '-');

            lowVoltageDevices.push({
                voltage: typeof voltage === 'number' ? voltage.toFixed(2) : voltage,
                name: device.DeviceName || 'Main Meter',
                count: device.LowVoltageCount !== undefined ? device.LowVoltageCount : '-',
                isMainMeter: true
            });
        });
    }

    // Add sub meter low voltage
    if (subMeterLowVoltage && subMeterLowVoltage.length > 0) {
        subMeterLowVoltage.forEach(device => {
            const voltage = device.AvgLowVoltage !== undefined ? device.AvgLowVoltage : (device.AvgLowVoltage !== undefined ? device.AvgLowVoltage : '-');

            lowVoltageDevices.push({
                voltage: typeof voltage === 'number' ? voltage.toFixed(2) : voltage,
                name: device.DeviceName || '',
                count: device.LowVoltageCount !== undefined ? device.LowVoltageCount : '-',
                isMainMeter: false
            });
        });
    }

    console.log('Low Voltage Devices:', lowVoltageDevices);

    if (lowVoltageDevices.length === 0) {
        lowVoltageGrid.style.display = 'none';
        if (noLowVoltageMsg) noLowVoltageMsg.style.display = 'block';
        return;
    }

    lowVoltageGrid.style.display = 'flex';
    if (noLowVoltageMsg) noLowVoltageMsg.style.display = 'none';

    lowVoltageDevices.forEach((device) => {
        const circleBox = document.createElement('div');
        circleBox.className = 'circle-box';
        circleBox.setAttribute('data-label', device.name);
        circleBox.style.position = 'relative';

        const voltageText = document.createElement('div');
        voltageText.style.position = 'relative';
        voltageText.style.zIndex = '1';
        voltageText.textContent = device.voltage;

        const tooltip = document.createElement('div');
        tooltip.className = 'voltage-tooltip';

        const tooltipContent = document.createElement('div');
        tooltipContent.className = 'voltage-tooltip-content';

        const countRow = document.createElement('div');
        countRow.className = 'voltage-tooltip-row';
        countRow.innerHTML = `
            <span class="voltage-tooltip-label">LowVoltageCount:</span>
            <span class="voltage-tooltip-value">${device.count}</span>
        `;

        tooltipContent.appendChild(countRow);
        tooltip.appendChild(tooltipContent);

        circleBox.appendChild(voltageText);
        circleBox.appendChild(tooltip);

        circleBox.style.backgroundColor = '#FFF176';
        circleBox.style.color = '#222';

        if (device.isMainMeter) {
            circleBox.style.border = '3px solid #333';
            circleBox.style.fontWeight = 'bold';
        }

        lowVoltageGrid.appendChild(circleBox);
    });
}

// ----------- Fetch and Render Data from 6 APIs -----------
Promise.all([
    fetch(`/EnergyParameter/GetMainMeter_Voltage`)
        .then(response => {
            console.log('Main Meter response status:', response.status);
            return response.json();
        }),
    fetch(`/EnergyParameter/GetSubMeter_Voltage`)
        .then(response => {
            console.log('Sub Meter response status:', response.status);
            return response.json();
        }),
    fetch(`/EnergyParameter/GetMainMeter_HighVoltage?fromDate=` + from2 + `&toDate=` + to2)
        .then(response => {
            console.log('Main Meter High Voltage response status:', response.status);
            return response.json();
        }),
    fetch('/EnergyParameter/GetSubMeter_HighVoltage?fromDate=' + from2 + '&toDate=' + to2)
        .then(response => {
            console.log('Sub Meter High Voltage response status:', response.status);
            return response.json();
        }),
    fetch('/EnergyParameter/GetMainMeter_LowVoltage?fromDate=' + from2 + '&toDate=' + to2)
        .then(response => {
            console.log('Main Meter Low Voltage response status:', response.status);
            return response.json();
        }),
    fetch('/EnergyParameter/GetSubMeter_LowVoltage?fromDate=' + from2 + '&toDate=' + to2)
        .then(response => {
            console.log('Sub Meter Low Voltage response status:', response.status);
            return response.json();
        })
]).then(([mainMeterData, subMeterData, mainMeterHighVoltage, subMeterHighVoltage, mainMeterLowVoltage, subMeterLowVoltage]) => {
    console.log('Raw Main Meter Data:', mainMeterData);
    console.log('Raw Sub Meter Data:', subMeterData);
    console.log('Raw Main Meter High Voltage Data:', mainMeterHighVoltage);
    console.log('Raw Sub Meter High Voltage Data:', subMeterHighVoltage);
    console.log('Raw Main Meter Low Voltage Data:', mainMeterLowVoltage);
    console.log('Raw Sub Meter Low Voltage Data:', subMeterLowVoltage);

    // Handle stringified JSON for all datasets
    const parseIfNeeded = (data) => {
        if (typeof data === 'string') {
            try {
                return JSON.parse(data);
            } catch (e) {
                console.error('Failed to parse data:', e);
                return data;
            }
        }
        return data;
    };

    mainMeterData = parseIfNeeded(mainMeterData);
    subMeterData = parseIfNeeded(subMeterData);
    mainMeterHighVoltage = parseIfNeeded(mainMeterHighVoltage);
    subMeterHighVoltage = parseIfNeeded(subMeterHighVoltage);
    mainMeterLowVoltage = parseIfNeeded(mainMeterLowVoltage);
    subMeterLowVoltage = parseIfNeeded(subMeterLowVoltage);

    // Wrap single objects in array
    if (!Array.isArray(mainMeterData)) mainMeterData = [mainMeterData];
    if (!Array.isArray(subMeterData)) subMeterData = [subMeterData];
    if (!Array.isArray(mainMeterHighVoltage)) mainMeterHighVoltage = [mainMeterHighVoltage];
    if (!Array.isArray(subMeterHighVoltage)) subMeterHighVoltage = [subMeterHighVoltage];
    if (!Array.isArray(mainMeterLowVoltage)) mainMeterLowVoltage = [mainMeterLowVoltage];
    if (!Array.isArray(subMeterLowVoltage)) subMeterLowVoltage = [subMeterLowVoltage];

    // Render all three sections
    renderVoltageCircles(mainMeterData, subMeterData);
    renderHighVoltageCircles(mainMeterHighVoltage, subMeterHighVoltage);
    renderLowVoltageCircles(mainMeterLowVoltage, subMeterLowVoltage);
}).catch(error => {
    console.error('Error fetching voltage data:', error);
});

// ----------- Average Voltage Bar Chart Section (KEPT EXACTLY THE SAME) -----------
//function getTodayRange() {
//    const today = new Date();
//    today.setHours(0, 0, 0, 0);
//    const from2 = formatDate(today);
//    const endOfToday = new Date(today);
//    endOfToday.setHours(23, 59, 59, 999);
//    const to2 = formatDate(endOfToday);
//    return { from2, to2 };
//}


function processAllRows(data) {
    if (!data || data.length === 0) return [];
    const parsedData = Array.isArray(data) ? data : [data];
    return parsedData.map((row, index) => ({
        rowIndex: index + 1,
        total_avgVoltage: row.Total_AvgVoltage ? parseFloat(row.Total_AvgVoltage).toFixed(2) : '0.00',
        r_avgVoltage: row.R_AvgVoltage ? parseFloat(row.R_AvgVoltage).toFixed(2) : '0.00',
        y_avgVoltage: row.Y_AvgVoltage ? parseFloat(row.Y_AvgVoltage).toFixed(2) : '0.00',
        b_avgVoltage: row.B_AvgVoltage ? parseFloat(row.B_AvgVoltage).toFixed(2) : '0.00',
        Hour : row.ReadingHour+1 ,
        deviceName: row.DeviceName || 'Device'
    }));
}


function createDirectBarChartOption(rows) {
    const seriesData = [];
    const xAxisLabels = [];
    let maxVoltage = 0;

    rows.forEach((row) => {
        const voltageValue = parseFloat(row.total_avgVoltage);
        

        if (voltageValue > maxVoltage) {
            maxVoltage = voltageValue;
        }

        seriesData.push({
            value: voltageValue,
            itemStyle: {
                borderRadius: [8, 8, 0, 0],
                color: getVoltageColor(voltageValue) // Simply use the color directly
            },
            rowData: row
        });

        xAxisLabels.push(row.Hour || `${row.rowIndex}`);
    });

    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function (params) {
                if (!params || params.length === 0) return '';
                const dataPoint = params[0].data;
                if (!dataPoint || !dataPoint.rowData) return '';
                const rowData = dataPoint.rowData;
                return `
                    <div style="background: rgba(0,0,0,0.9); border-radius: 8px; padding: 12px; font-size: 13px; min-width: 200px;">
                        <div style="color: #66BB6A; font-weight: bold; margin-bottom: 10px; font-size: 14px; text-align: center;">
                            Hour ${rowData.Hour}
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span style="color: #FFD54F; font-size: 15px;"><strong>Total Avg</strong></span>
                            <span style="color: #fff; font-weight: bold; margin-left: 20px; font-size: 15px;">${rowData.total_avgVoltage} V</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span style="color: #FFD54F;"><strong>R Phase</strong></span>
                            <span style="color: #fff; font-weight: bold; margin-left: 20px;">${rowData.r_avgVoltage} V</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span style="color: #FFD54F;"><strong>Y Phase</strong></span>
                            <span style="color: #fff; font-weight: bold; margin-left: 20px;">${rowData.y_avgVoltage} V</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #FFD54F;"><strong>B Phase</strong></span>
                            <span style="color: #fff; font-weight: bold; margin-left: 20px;">${rowData.b_avgVoltage} V</span>
                        </div>
                        ${rowData.timestamp ? `<div style="color: #999; margin-top: 8px; font-size: 11px; text-align: center;">${rowData.timestamp}</div>` : ''}
                    </div>
                `;
            },
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            textStyle: { color: '#fff' }
        },
        grid: { left: 60, right: 40, top: 40, bottom: 60 },
        xAxis: {
            type: 'category',
            data: xAxisLabels,
            axisLabel: {
                color: '#666',
                fontSize: 12,
                fontWeight: 'bold',
                interval: 0
            },
            axisLine: { lineStyle: { color: '#ddd' } },
            axisTick: { show: false }
        },
        yAxis: {
            type: 'value',
            min: 180,
            max: Math.ceil(maxVoltage / 10) * 10 + 10,
            splitLine: { lineStyle: { type: 'dashed', color: '#eee' } },
            axisLabel: { color: '#666', fontSize: 12, formatter: '{value} V' }
        },
        series: [{
            data: seriesData,
            type: 'bar',
            label: { show: false },
            barWidth: '60%'
        }]
    };
}

document.addEventListener('DOMContentLoaded', function () {
    const chartAvgVoltage = echarts.init(document.getElementById('chart-avg-voltage'));
    const endpoint = `/EnergyParameter/GetMainmeter_HourlyAvgVoltage_hot?fromDate=${encodeURIComponent(from2)}&toDate=${encodeURIComponent(to2)}`;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            console.log('Today raw data:', data);
            let parsedData = data;
            if (typeof data === 'string') {
                try {
                    parsedData = JSON.parse(data);
                } catch (e) {
                    console.error('Failed to parse today data:', e);
                    parsedData = [];
                }
            }

            const todayRows = processAllRows(parsedData);

            if (todayRows.length > 0) {
                console.log('Processed rows for chart:', todayRows);
                chartAvgVoltage.setOption(createDirectBarChartOption(todayRows));
            } else {
                chartAvgVoltage.setOption({
                    title: {
                        text: 'No data available for today',
                        left: 'center',
                        top: 'center',
                        textStyle: { color: '#999', fontSize: 16 }
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error fetching today data:', error);
            chartAvgVoltage.setOption({
                title: {
                    text: 'Error loading data',
                    left: 'center',
                    top: 'center',
                    textStyle: { color: '#f44336', fontSize: 16 }
                }
            });
        });

    window.addEventListener('resize', () => {
        chartAvgVoltage.resize();
    });
});

// ----------- ACTUAL VOLTAGE LINE CHARTS - DYNAMIC WITH API DATA -----------

// Helper function to create dynamic line chart
function createDynamicLineChartOption(chartData) {
    if (!chartData || chartData.length === 0) {
        return {
            title: { text: 'No data available', left: 'center', top: 'center' },
            grid: { left: 50, right: 30, top: 40, bottom: 50 },
            xAxis: { type: 'category', data: [] },
            yAxis: { type: 'value' },
            series: []
        };
    }

    // Extract timestamps and voltage data
    const timestamps = chartData.map(d => {
        const time = new Date(d.Timestamp || d.DateTime);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    });

    const totalVoltageData = chartData.map(d => parseFloat(d.Total_AvgVoltage || d.Voltage || 0));
    const rVoltageData = chartData.map(d => parseFloat(d.R_AvgVoltage || d.R_Voltage || 0));
    const yVoltageData = chartData.map(d => parseFloat(d.Y_AvgVoltage || d.Y_Voltage || 0));
    const bVoltageData = chartData.map(d => parseFloat(d.B_AvgVoltage || d.B_Voltage || 0));

    // Store createDate for tooltip
    const createDates = chartData.map(d => d.CreateDate || d.Createdate || 'N/A');

    // Find min and max for Y-axis
    const allValues = [...totalVoltageData, ...rVoltageData, ...yVoltageData, ...bVoltageData].filter(v => !isNaN(v));
    const minVoltage = Math.floor(Math.min(...allValues) / 10) * 10 || 180;
    const maxVoltage = Math.ceil(Math.max(...allValues) / 10) * 10 + 10 || 260;

    // Function to determine color based on voltage value
    function getColorByVoltage(voltage) {
        if (voltage > 240) return '#E57373'; // Darker Red
        if (voltage >= 220) return '#81C784'; // Darker Green
        return '#FFF176'; // Darker Yellow
    }

    // Function to create series with dynamic coloring
    function createColoredSeries(name, data, defaultColor) {
        return {
            name: name,
            type: 'line',
            data: data.map((value, index) => ({
                value: value,
                itemStyle: {
                    color: getColorByVoltage(value)
                }
            })),
            smooth: true,
            showSymbol: false, // Hide dots by default
            symbol: 'circle',
            symbolSize: 8,
            emphasis: {
                focus: 'series',
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 2
                }
            },
            lineStyle: {
                width: 2,
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 1, y2: 0,
                    colorStops: data.map((value, index) => ({
                        offset: index / (data.length - 1),
                        color: getColorByVoltage(value)
                    }))
                }
            }
        };
    }

    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'line' },
            formatter: function (params) {
                if (!params || params.length === 0) return '';
                const dataIndex = params[0].dataIndex;
                const createDate = createDates[dataIndex];

                // Format to show only time
                let timeString = createDate;
                if (createDate !== 'N/A') {
                    try {
                        const dateObj = new Date(createDate);
                        timeString = dateObj.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        });
                    } catch (e) {
                        console.error('Error formatting date:', e);
                    }
                }

                let html = `<div style="background: rgba(0,0,0,0.9); border-radius: 8px; padding: 12px; font-size: 13px; min-width: 200px;">`;
                html += `<div style="color: #FFD54F; font-weight: bold; margin-bottom: 8px; text-align: center; font-size: 14px;">${timeString}</div>`;

                params.forEach(param => {
                    const voltage = param.value.value || param.value;
                    const statusColor = getColorByVoltage(voltage);
                    

                    html += `<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: ${statusColor};"><strong>${param.seriesName}</strong></span>
            <span style="color: #fff; font-weight: bold; margin-left: 20px;">${voltage} V</span>
        </div>`;
                });
                html += `</div>`;
                return html;
            },
            backgroundColor: 'transparent',
            borderColor: 'transparent'
        },
        grid: { left: 60, right: 40, top: 40, bottom: 60 },
        legend: {
            data: ['Total Voltage', 'R Phase', 'Y Phase', 'B Phase'],
            bottom: 10,
            textStyle: { fontSize: 12 }
        },
        xAxis: {
            type: 'category',
            data: timestamps,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            boundaryGap: false
        },
        yAxis: {
            type: 'value',
            min: minVoltage,
            max: maxVoltage,
            axisLabel: { formatter: '{value} V', fontSize: 12, color: '#666' },
            splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
        },
        series: [
            createColoredSeries('Total Voltage', totalVoltageData, '#ff6b6b'),
            createColoredSeries('R Phase', rVoltageData, '#4B60F6'),
            createColoredSeries('Y Phase', yVoltageData, '#92B870'),
            createColoredSeries('B Phase', bVoltageData, '#FFA500')
        ]
    };
}

// Initialize charts
document.addEventListener('DOMContentLoaded', function () {
    const chartPrev2 = echarts.init(document.getElementById('chart-prev2'));
    const chartToday2 = echarts.init(document.getElementById('chart-today2'));

    // Fetch last hour data
    fetch(`/EnergyParameter/GetMainMeter_ActualVoltage?fromDate=${encodeURIComponent(from1)}&toDate=${encodeURIComponent(to1)}`)
        .then(response => response.json())
        .then(data => {
            console.log('Last Hour Voltage Data:', data);

            let parsedData = data;
            if (typeof data === 'string') {
                try {
                    parsedData = JSON.parse(data);
                } catch (e) {
                    console.error('Failed to parse last hour data:', e);
                    parsedData = [];
                }
            }

            if (!Array.isArray(parsedData)) {
                parsedData = parsedData ? [parsedData] : [];
            }

            const option = createDynamicLineChartOption(parsedData);
            chartPrev2.setOption(option);
        })
        .catch(error => {
            console.error('Error fetching last hour data:', error);
            chartPrev2.setOption({
                title: { text: 'Error loading data', left: 'center', top: 'center', textStyle: { color: '#f44336' } }
            });
        });

    // Fetch today data
    fetch(`/EnergyParameter/GetMainMeter_ActualVoltage?fromDate=${encodeURIComponent(from2)}&toDate=${encodeURIComponent(to2)}`)
        .then(response => response.json())
        .then(data => {
            console.log('Today Voltage Data:', data);

            let parsedData = data;
            if (typeof data === 'string') {
                try {
                    parsedData = JSON.parse(data);
                } catch (e) {
                    console.error('Failed to parse today data:', e);
                    parsedData = [];
                }
            }

            if (!Array.isArray(parsedData)) {
                parsedData = parsedData ? [parsedData] : [];
            }

            const option = createDynamicLineChartOption(parsedData);
            chartToday2.setOption(option);
        })
        .catch(error => {
            console.error('Error fetching today data:', error);
            chartToday2.setOption({
                title: { text: 'Error loading data', left: 'center', top: 'center', textStyle: { color: '#f44336' } }
            });
        });

    // Handle window resize
    window.addEventListener('resize', () => {
        chartPrev2.resize();
        chartToday2.resize();
    });
});