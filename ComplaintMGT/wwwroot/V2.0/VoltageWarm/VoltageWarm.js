//var from2 = '2025-11-01 00:00:29.900';
//var to2 = '2025-11-07 00:00:29.900';
//var from1 = '2025-11-01 11:00:29.900';
//var to1 = '2025-11-30 12:00:29.900';
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
        from: formatDate(fromDate),
        to: formatDate(toDate)
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

const { from3, to3 } = getPreviousWeekRange();

const { from2, to2 } = getCurrentWeekRange();

const { from1, to1 } = gettodayRange();

const { from, to } = getCurrentMonthRange();


// ----------- Dynamic Voltage Circles Section -----------



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
    // Original APIs for main voltage circles
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
    // New APIs for high voltage section
    fetch(`/EnergyParameter/GetMainMeter_HighVoltage?fromDate=` + from + `&toDate=` + to)
        .then(response => {
            console.log('Main Meter High Voltage response status:', response.status);
            return response.json();
        }),
    fetch('/EnergyParameter/GetSubMeter_HighVoltage?fromDate=' + from + '&toDate=' + to)
        .then(response => {
            console.log('Sub Meter High Voltage response status:', response.status);
            return response.json();
        }),
    // New APIs for low voltage section
    fetch('/EnergyParameter/GetMainMeter_LowVoltage?fromDate=' + from + '&toDate=' + to)
        .then(response => {
            console.log('Main Meter Low Voltage response status:', response.status);
            return response.json();
        }),
    fetch('/EnergyParameter/GetSubMeter_LowVoltage?fromDate=' + from + '&toDate=' + to)
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





// ----------- Average Voltage Bar Chart Section (4 Months Combined) -----------

function formatDate(date) {
    const pad = num => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Get all weeks in the current month
function getCurrentMonthWeeks() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // First day of current month
    const firstDay = new Date(year, month, 1);

    // Last day of current month (or today if we're still in current month)
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    const effectiveLastDay = lastDay > today ? today : lastDay;

    const weeks = [];
    let weekStart = new Date(firstDay);
    weekStart.setHours(0, 0, 0, 0);

    let weekNumber = 1;

    while (weekStart <= effectiveLastDay) {
        // Week ends on Sunday or last day of month, whichever comes first
        let weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // 7 days later (Sunday)
        weekEnd.setHours(23, 59, 59, 999);

        // If week end goes beyond current month or today, cap it
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

        // Move to next week (Monday)
        weekStart = new Date(weekEnd);
        weekStart.setDate(weekEnd.getDate() + 1);
        weekStart.setHours(0, 0, 0, 0);

        weekNumber++;
    }

    return weeks;
}

function processAllRows(data, weekLabel) {
    if (!data || data.length === 0) return [];

    const parsedData = Array.isArray(data) ? data : [data];

    return parsedData.map((row, index) => ({
        week: weekLabel,
        rowIndex: index + 1,
        total_avgVoltage: row.Total_AvgVoltage
            ? parseFloat(row.Total_AvgVoltage).toFixed(2)
            : '0.00',
        r_avgVoltage: row.R_AvgVoltage
            ? parseFloat(row.R_AvgVoltage).toFixed(2)
            : '0.00',
        y_avgVoltage: row.Y_AvgVoltage
            ? parseFloat(row.Y_AvgVoltage).toFixed(2)
            : '0.00',
        b_avgVoltage: row.B_AvgVoltage
            ? parseFloat(row.B_AvgVoltage).toFixed(2)
            : '0.00',
        timestamp: row.Timestamp || row.DateTime || '',
        deviceName: row.DeviceName || 'Device'
    }));
}



function createGroupedBarChartOption(allWeeklyData) {
    // Create series data with grouping gaps
    const seriesData = [];
    const xAxisLabels = [];
    const weekBoundaries = [];
    let maxVoltage = 0;

    let currentIndex = 0;

    allWeeklyData.forEach((weekData, weekIndex) => {
        // Mark the start of each week group
        weekBoundaries.push({
            start: currentIndex,
            end: currentIndex + weekData.rows.length - 1,
            week: weekData.week
        });

        weekData.rows.forEach((row, rowIndex) => {
            const voltageValue = parseFloat(row.total_avgVoltage);
            

            // Track max voltage for dynamic Y-axis
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

            // Empty labels for individual bars
            xAxisLabels.push('');
            currentIndex++;
        });

        // Add spacing between week groups (except after last week)
        if (weekIndex < allWeeklyData.length - 1) {
            seriesData.push({
                value: null,
                itemStyle: { opacity: 0 }
            });
            xAxisLabels.push('');
            currentIndex++;
        }
    });

    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params) {
                if (!params || params.length === 0) return '';

                const dataPoint = params[0].data;
                if (!dataPoint || !dataPoint.rowData) return '';

                const rowData = dataPoint.rowData;

                return `
                    <div style="background: rgba(0,0,0,0.9); border-radius: 8px; padding: 12px; font-size: 13px; min-width: 200px;">
                        <div style="color: #66BB6A; font-weight: bold; margin-bottom: 10px; font-size: 14px; text-align: center;">
                            Day ${rowData.rowIndex}
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
            textStyle: {
                color: '#fff'
            }
        },
        grid: {
            left: 60,
            right: 40,
            top: 40,
            bottom: 80
        },
        xAxis: {
            type: 'category',
            data: xAxisLabels,
            axisLabel: {
                color: '#666',
                fontSize: 13,
                fontWeight: 'bold',
                interval: 0,
                formatter: function (value, index) {
                    // Only show label at the center of each week group
                    for (const boundary of weekBoundaries) {
                        const centerIndex = Math.floor((boundary.start + boundary.end) / 2);
                        if (index === centerIndex) {
                            return boundary.week;
                        }
                    }
                    return '';
                }
            },
            axisLine: {
                lineStyle: {
                    color: '#ddd'
                }
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            min: 180,
            max: Math.ceil(maxVoltage / 10) * 10 + 10, // Dynamic max: round up to nearest 10 and add 10
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#eee'
                }
            },
            axisLabel: {
                color: '#666',
                fontSize: 12,
                formatter: '{value} V'
            }
        },
        series: [
            {
                data: seriesData,
                type: 'bar',
                label: {
                    show: false
                },
                barWidth: '70%',
                barGap: '10%',
                barCategoryGap: '40%'
            }
        ]
        
    };
}

// Initialize chart with weekly data for current month
document.addEventListener('DOMContentLoaded', function () {
    const chartAvgVoltage = echarts.init(document.getElementById('chart-avg-voltage'));

    // Get all weeks in current month
    const weeks = getCurrentMonthWeeks();

    console.log('Weeks in current month:', weeks);

    const allWeeklyData = [];
    let completedRequests = 0;

    weeks.forEach((week, index) => {
        const endpoint = `/EnergyParameter/GetMainmeter_DailyAvgVoltage_warm?fromDate=${encodeURIComponent(week.from)}&toDate=${encodeURIComponent(week.to)}`;

        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                console.log(`${week.label} raw data:`, data);

                // Parse if stringified
                let parsedData = data;
                if (typeof data === 'string') {
                    try {
                        parsedData = JSON.parse(data);
                    } catch (e) {
                        console.error(`Failed to parse ${week.label} data:`, e);
                        parsedData = [];
                    }
                }

                // Process all rows from this week
                const weekRows = processAllRows(parsedData, week.label);

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
                        chartAvgVoltage.setOption(createGroupedBarChartOption(validData));
                    } else {
                        chartAvgVoltage.setOption({
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
                        chartAvgVoltage.setOption(createGroupedBarChartOption(validData));
                    } else {
                        chartAvgVoltage.setOption({
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

    // Handle window resize
    window.addEventListener('resize', () => {
        chartAvgVoltage.resize();
    });
});


// ----------- Actual Voltage Line Charts (EXISTING CODE - UNCHANGED) -----------

const radius = 45;
const circumference = 2 * Math.PI * radius;

function updateCircleProgress(card) {
    const value = +card.dataset.value;
    const color = card.dataset.color;
    const bgColor = card.dataset.bg;

    const svg = card.querySelector('svg');
    const progress = svg.querySelector('.progress');
    const progressBack = svg.querySelector('.progress-back');
    const text = svg.querySelector('.circle-text');

    progress.style.stroke = color;
    progressBack.style.stroke = bgColor;

    progress.setAttribute('stroke-dasharray', circumference);
    progress.setAttribute('stroke-dashoffset', ((100 - value) / 100) * circumference);

    progressBack.setAttribute('stroke-dasharray', circumference);
    progressBack.setAttribute('stroke-dashoffset', 0);

    text.textContent = `${value}%`;
}

document.querySelectorAll('.circle-card').forEach(updateCircleProgress);

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-value') {
            updateCircleProgress(mutation.target);
        }
    });
});

document.querySelectorAll('.circle-card').forEach(card => {
    observer.observe(card, { attributes: true });
});

setTimeout(() => {
    const lightsCard = document.querySelector('.circle-card[data-label="Lights"]');
    if (lightsCard) {
        lightsCard.setAttribute('data-value', 68);
    }
}, 2000);

// ----------- Actual Voltage Line Chart Section (UNCHANGED) -----------

const baseData = [
    124, 130, 131, 150, 240, 300, 250, 270, 310, 360, 400, 380,
    500, 710, 1000, 700, 780, 800, 1580, 1030, 1100, 1150, 1250,
    1300, 1400, 1500, 1600, 1400, 1900, 1800,
];

const categoryColors = [
    { end: 5, color: '#4B60F6' },
    { end: 10, color: '#92B870' },
    { end: 15, color: '#D6BD59' },
    { end: 20, color: '#E95959' },
    { end: 30, color: '#F27220' }
];

const createSegments = (data) => {
    const segments = [];
    for (let i = 0; i < data.length - 1; i++) {
        const color = categoryColors.find(c => i < c.end).color;
        segments.push({
            type: 'line',
            data: [[i + 1, data[i]], [i + 2, data[i + 1]]],
            showSymbol: false,
            lineStyle: { color, width: 2 },
            smooth: true,
            hoverAnimation: false
        });
    }
    return segments;
};

const createOption = (data) => ({
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 30, top: 40, bottom: 50 },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: Array.from({ length: 30 }, (_, i) => i + 1),
        axisLabel: {
            interval: 0,
            formatter: function (value) {
                return [1, 5, 10, 15, 20, 25, 30].includes(+value) ? value : '';
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 2500,
        splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
    },
    series: createSegments(data)
});

const chartPrev2 = echarts.init(document.getElementById('chart-prev2'));
const chartToday2 = echarts.init(document.getElementById('chart-today2'));

chartPrev2.setOption(createOption(baseData));

const dataToday = baseData.map((v, i) => v + 40 * Math.sin(i / 2));
chartToday2.setOption(createOption(dataToday));

window.addEventListener('resize', () => {
    chartPrev2.resize();
    chartToday2.resize();
});



// ----------- ACTUAL VOLTAGE LINE CHARTS - DYNAMIC WITH API DATA -----------

// Helper function to create dynamic line chart
//function createDynamicLineChartOption(chartData) {
//    if (!chartData || chartData.length === 0) {
//        return {
//            title: { text: 'No data available', left: 'center', top: 'center' },
//            grid: { left: 50, right: 30, top: 40, bottom: 50 },
//            xAxis: { type: 'category', data: [] },
//            yAxis: { type: 'value' },
//            series: []
//        };
//    }

//    // Extract timestamps and voltage data
//    const timestamps = chartData.map(d => {
//        const time = new Date(d.Timestamp || d.DateTime);
//        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
//    });

//    const totalVoltageData = chartData.map(d => parseFloat(d.Total_AvgVoltage || d.Voltage || 0));
//    const rVoltageData = chartData.map(d => parseFloat(d.R_AvgVoltage || d.R_Voltage || 0));
//    const yVoltageData = chartData.map(d => parseFloat(d.Y_AvgVoltage || d.Y_Voltage || 0));
//    const bVoltageData = chartData.map(d => parseFloat(d.B_AvgVoltage || d.B_Voltage || 0));

//    // Store createDate for tooltip
//    const createDates = chartData.map(d => d.CreateDate || d.Createdate || 'N/A');

//    // Find min and max for Y-axis
//    const allValues = [...totalVoltageData, ...rVoltageData, ...yVoltageData, ...bVoltageData].filter(v => !isNaN(v));
//    const minVoltage = Math.floor(Math.min(...allValues) / 10) * 10 || 180;
//    const maxVoltage = Math.ceil(Math.max(...allValues) / 10) * 10 + 10 || 260;

//    // Function to determine color based on voltage value
//    function getColorByVoltage(voltage) {
//        if (voltage > 240) return '#E57373'; // Darker Red
//        if (voltage >= 220) return '#81C784'; // Darker Green
//        return '#FFF176'; // Darker Yellow
//    }

//    // Function to create series with dynamic coloring
//    function createColoredSeries(name, data, defaultColor) {
//        return {
//            name: name,
//            type: 'line',
//            data: data.map((value, index) => ({
//                value: value,
//                itemStyle: {
//                    color: getColorByVoltage(value)
//                }
//            })),
//            smooth: true,
//            showSymbol: false, // Hide dots by default
//            symbol: 'circle',
//            symbolSize: 8,
//            emphasis: {
//                focus: 'series',
//                itemStyle: {
//                    borderColor: '#fff',
//                    borderWidth: 2
//                }
//            },
//            lineStyle: {
//                width: 2,
//                color: {
//                    type: 'linear',
//                    x: 0, y: 0, x2: 1, y2: 0,
//                    colorStops: data.map((value, index) => ({
//                        offset: index / (data.length - 1),
//                        color: getColorByVoltage(value)
//                    }))
//                }
//            }
//        };
//    }

//    return {
//        tooltip: {
//            trigger: 'axis',
//            axisPointer: { type: 'line' },
//            formatter: function (params) {
//                if (!params || params.length === 0) return '';
//                const dataIndex = params[0].dataIndex;
//                const createDate = createDates[dataIndex];

//                // Format to show only time
//                let timeString = createDate;
//                if (createDate !== 'N/A') {
//                    try {
//                        const dateObj = new Date(createDate);
//                        timeString = dateObj.toLocaleTimeString([], {
//                            hour: '2-digit',
//                            minute: '2-digit',
//                            second: '2-digit'
//                        });
//                    } catch (e) {
//                        console.error('Error formatting date:', e);
//                    }
//                }

//                let html = `<div style="background: rgba(0,0,0,0.9); border-radius: 8px; padding: 12px; font-size: 13px; min-width: 200px;">`;
//                html += `<div style="color: #FFD54F; font-weight: bold; margin-bottom: 8px; text-align: center; font-size: 14px;">${timeString}</div>`;

//                params.forEach(param => {
//                    const voltage = param.value.value || param.value;
//                    const statusColor = getColorByVoltage(voltage);


//                    html += `<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
//            <span style="color: ${statusColor};"><strong>${param.seriesName}</strong></span>
//            <span style="color: #fff; font-weight: bold; margin-left: 20px;">${voltage} V</span>
//        </div>`;
//                });
//                html += `</div>`;
//                return html;
//            },
//            backgroundColor: 'transparent',
//            borderColor: 'transparent'
//        },
//        grid: { left: 60, right: 40, top: 40, bottom: 60 },
//        legend: {
//            data: ['Total Voltage', 'R Phase', 'Y Phase', 'B Phase'],
//            bottom: 10,
//            textStyle: { fontSize: 12 }
//        },
//        xAxis: {
//            type: 'category',
//            data: timestamps,
//            axisLabel: { show: false },
//            axisLine: { show: false },
//            axisTick: { show: false },
//            boundaryGap: false
//        },
//        yAxis: {
//            type: 'value',
//            min: minVoltage,
//            max: maxVoltage,
//            axisLabel: { formatter: '{value} V', fontSize: 12, color: '#666' },
//            splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
//        },
//        series: [
//            createColoredSeries('Total Voltage', totalVoltageData, '#ff6b6b'),
//            createColoredSeries('R Phase', rVoltageData, '#4B60F6'),
//            createColoredSeries('Y Phase', yVoltageData, '#92B870'),
//            createColoredSeries('B Phase', bVoltageData, '#FFA500')
//        ]
//    };
//}

//// Initialize charts
//document.addEventListener('DOMContentLoaded', function () {
//    const chartPrev2 = echarts.init(document.getElementById('chart-prev2'));
//    const chartToday2 = echarts.init(document.getElementById('chart-today2'));

//    // Fetch last hour data
//    fetch(`/EnergyParameter/GetMainMeter_ActualVoltage?fromDate=${encodeURIComponent(from1)}&toDate=${encodeURIComponent(to1)}`)
//        .then(response => response.json())
//        .then(data => {
//            console.log('Last Hour Voltage Data:', data);

//            let parsedData = data;
//            if (typeof data === 'string') {
//                try {
//                    parsedData = JSON.parse(data);
//                } catch (e) {
//                    console.error('Failed to parse last hour data:', e);
//                    parsedData = [];
//                }
//            }

//            if (!Array.isArray(parsedData)) {
//                parsedData = parsedData ? [parsedData] : [];
//            }

//            const option = createDynamicLineChartOption(parsedData);
//            chartPrev2.setOption(option);
//        })
//        .catch(error => {
//            console.error('Error fetching last hour data:', error);
//            chartPrev2.setOption({
//                title: { text: 'Error loading data', left: 'center', top: 'center', textStyle: { color: '#f44336' } }
//            });
//        });

//    // Fetch today data
//    fetch(`/EnergyParameter/GetMainMeter_ActualVoltage?fromDate=${encodeURIComponent(from2)}&toDate=${encodeURIComponent(to2)}`)
//        .then(response => response.json())
//        .then(data => {
//            console.log('Today Voltage Data:', data);

//            let parsedData = data;
//            if (typeof data === 'string') {
//                try {
//                    parsedData = JSON.parse(data);
//                } catch (e) {
//                    console.error('Failed to parse today data:', e);
//                    parsedData = [];
//                }
//            }

//            if (!Array.isArray(parsedData)) {
//                parsedData = parsedData ? [parsedData] : [];
//            }

//            const option = createDynamicLineChartOption(parsedData);
//            chartToday2.setOption(option);
//        })
//        .catch(error => {
//            console.error('Error fetching today data:', error);
//            chartToday2.setOption({
//                title: { text: 'Error loading data', left: 'center', top: 'center', textStyle: { color: '#f44336' } }
//            });
//        });

//    // Handle window resize
//    window.addEventListener('resize', () => {
//        chartPrev2.resize();
//        chartToday2.resize();
//    });
//});