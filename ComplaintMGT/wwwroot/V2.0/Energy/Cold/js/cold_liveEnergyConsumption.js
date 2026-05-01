var energyColdDashboard = function () {

    var _echartEnergyConsumptionColdChartDashboard = {};
    var currentEnergyTempChartContainerId = null;

    // ===========================
    // ENERGY TEMP CHART - GLOBAL STATE
    // ===========================
    let energyTempData = [];
    let availableMeters = [];
    let selectedMeterIDs = new Set();
    let meterColorMap = new Map();
    let tempColorMap = new Map();



    function getToday24hRange() {
        // Derive the date from actual data if available, otherwise fall back to today
        var baseDate;
        if (energyTempData && energyTempData.length > 0) {
            var firstRecord = energyTempData[0];
            var dateStr = (firstRecord.date || '').split('T')[0];
            if (dateStr) {
                baseDate = new Date(dateStr + 'T00:00:00');
            }
        }
        if (!baseDate || isNaN(baseDate.getTime())) {
            baseDate = new Date();
        }
        var startOfDay = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 0, 0, 0, 0);
        var endOfDay = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), 23, 59, 59, 999);
        return { min: startOfDay.getTime(), max: endOfDay.getTime() };
    }

    // FIXED: Define exact colors that match the filter checkboxes
    const meterColors = [
        '#5470C6',  // SlaveId1 - Blue
        '#91CC75',  // SlaveId2 - Green
        '#FAC858',  // SlaveId3 - Yellow/Orange
        '#EE6666',  // SlaveId4 - Red
        '#73C0DE',  // SlaveId5 - Light Blue
        '#3BA272',  // SlaveId6 - Teal Green
        '#FC8452',  // SlaveId7 - Orange
        '#9A60B4',  // SlaveId8 - Purple
        '#EA7CCC'   // SlaveId9 - Pink
    ];

    function getMeterColor(meterName, index) {
        // Use the index from availableMeters array to ensure consistency
        return meterColors[index % meterColors.length];
    }

    const tempColors = [
        '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
        '#1ABC9C', '#E67E22', '#34495E', '#16A085', '#D35400',
        '#8E44AD', '#2980B9', '#27AE60', '#F1C40F', '#C0392B'
    ];

    function getColorFromMap(map, key, colors, index) {
        if (!map.has(key)) {
            map.set(key, colors[index % colors.length]);
        }
        return map.get(key);
    }

    // ===========================
    // COLD: SHARED MONTHLY X-AXIS HELPER
    // Shows "Month Year" label only on the FIRST week of each month group.
    // All subsequent weeks in the same month show an empty string.
    // getMonthYear(rec) should return e.g. "January 2026"
    // ===========================
    function buildMonthlyXAxisLabels(xKeys, dataArr, getMonthYear) {
        var keyToMonthYear = {};
        xKeys.forEach(function (key) {
            var rec = dataArr.find(function (r) { return r.xLabel === key; });
            keyToMonthYear[key] = rec ? getMonthYear(rec) : '';
        });
        var seen = {};
        return xKeys.map(function (key) {
            var my = keyToMonthYear[key] || '';
            if (!my || seen[my]) return '';
            seen[my] = true;
            return my;
        });
    }

    // Parse "January-2026" -> "January 2026", or combine separate month + year fields
    function formatMonthYear(month, year) {
        if (!month) return '';
        if (String(month).indexOf('-') !== -1) return String(month).replace('-', ' ');
        return year ? (month + ' ' + year) : month;
    }
    // ===========================
    // DATE FILTER - GLOBAL STATE (for Graphs 1, 2 & 3 - live graphs)
    // Cold version: shows current month + last 3 months (4 months total)
    // Default: 1st day of the 3rd-last month
    // ===========================
    let g_dateFilterSelectedDate = null;
    let g_dateFilterCurrentGraphId = null;
    let g_dateFilterOnChange = null;
    let g_dateFilterAllDates = [];   // all available dates (for data-has-data highlights)

    // Build a 4-month range: current month + last 3 months
    function g_buildFourMonthRange() {
        var now = new Date();
        var months = [];
        for (var i = 3; i >= 0; i--) {
            var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({ year: d.getFullYear(), month: d.getMonth() }); // month 0-based
        }
        // Build all calendar dates across these 4 months
        var allDates = [];
        months.forEach(function (m) {
            var daysInMonth = new Date(m.year, m.month + 1, 0).getDate();
            for (var day = 1; day <= daysInMonth; day++) {
                allDates.push(m.year + '-' + String(m.month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0'));
            }
        });
        return { months: months, allDates: allDates };
    }

    // Get the 1st day of the 3rd-last month (default selection)
    function g_getDefaultDate() {
        var now = new Date();
        var d = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-01';
    }

    // Extract unique sorted dates from a dataset
    function g_extractDatesFromData(dataArr) {
        var seen = {};
        var dates = [];
        dataArr.forEach(function (r) {
            var d = (r.date || r.ts ? (r.ts
                ? r.ts.getFullYear() + '-' + String(r.ts.getMonth() + 1).padStart(2, '0') + '-' + String(r.ts.getDate()).padStart(2, '0')
                : (r.date || '').split('T')[0])
                : '');
            if (d && !seen[d]) { seen[d] = true; dates.push(d); }
        });
        dates.sort();
        return dates;
    }

    // Refresh date filter — called after data loads
    // dataArr is used only for "has data" highlights
    function g_refreshDateFilterFromData(dataArr, onDateChange) {
        var dataDates = g_extractDatesFromData(dataArr);
        g_dateFilterAllDates = dataDates;

        // Default to 1st of the 3rd-last month (only on first init)
        if (!g_dateFilterSelectedDate) {
            g_dateFilterSelectedDate = g_getDefaultDate();
        }

        if (onDateChange) g_dateFilterOnChange = onDateChange;
        g_rebuildCalendarUI();
    }

    function g_renderDateFilter(graphId, onDateChange) {
        var container = document.getElementById('dateFilterContainer');
        if (!container) return;
        g_dateFilterCurrentGraphId = graphId;
        g_dateFilterOnChange = onDateChange;
        container.setAttribute('data-graph-owner', String(graphId));

        container.innerHTML = '';
        var label = document.createElement('div');
        label.className = 'filter-label';
        label.textContent = 'Filter by Date:';
        container.appendChild(label);

        var wrapper = document.createElement('div');
        wrapper.id = 'datePickerWrapper_' + graphId;
        wrapper.className = 'date-picker-wrapper';
        wrapper.style.cssText = 'position:relative;display:inline-block;';

        var displayBtn = document.createElement('button');
        displayBtn.id = 'datePickerBtn_' + graphId;
        displayBtn.className = 'date-picker-btn';
        displayBtn.type = 'button';
        displayBtn.style.cssText = 'display:inline-flex;align-items:center;gap:8px;padding:7px 14px;border-radius:8px;border:1.5px solid #1E90FF;background:#fff;color:#333;font-size:13px;font-weight:600;cursor:pointer;font-family:Arial,sans-serif;box-shadow:0 1px 4px rgba(30,144,255,0.12);min-width:140px;';
        displayBtn.innerHTML = '<span>&#128197;</span><span class="date-picker-text">Loading...</span><span style="margin-left:auto;font-size:10px;color:#1E90FF;">&#9660;</span>';

        var dropdown = document.createElement('div');
        dropdown.id = 'datePickerDropdown_' + graphId;
        dropdown.className = 'date-picker-dropdown';
        // Wide enough for 4 month columns (each ~200px + gap)
        dropdown.style.cssText = 'display:none;position:absolute;top:calc(100% + 6px);left:0;z-index:9999;background:#fff;border-radius:14px;border:1.5px solid #b8d4f8;box-shadow:0 8px 32px rgba(30,144,255,0.18);padding:16px;min-width:860px;max-width:900px;';

        displayBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            if (dropdown.style.display === 'block') g_rebuildCalendarUI();
        });
        document.addEventListener('click', function (e) {
            if (!wrapper.contains(e.target)) dropdown.style.display = 'none';
        });

        wrapper.appendChild(displayBtn);
        wrapper.appendChild(dropdown);
        container.appendChild(wrapper);
    }

    // Rebuild the 4-month calendar grid
    function g_rebuildCalendarUI() {
        var graphId = g_dateFilterCurrentGraphId;
        var dropdown = document.getElementById('datePickerDropdown_' + graphId);
        var displayBtn = document.getElementById('datePickerBtn_' + graphId);
        if (!dropdown || !displayBtn) return;

        var rangeInfo = g_buildFourMonthRange();
        var dataDatesSet = {};
        (g_dateFilterAllDates || []).forEach(function (d) { dataDatesSet[d] = true; });

        function formatDisplay(dateStr) {
            if (!dateStr) return 'Select Date';
            var p = dateStr.split('-');
            var mNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return p[2] + ' ' + mNames[parseInt(p[1], 10) - 1] + ' ' + p[0];
        }

        var textSpan = displayBtn.querySelector('.date-picker-text');
        if (textSpan) textSpan.textContent = formatDisplay(g_dateFilterSelectedDate);

        dropdown.innerHTML = '';

        // Title bar
        var titleBar = document.createElement('div');
        titleBar.style.cssText = 'text-align:center;font-size:13px;font-weight:700;color:#1E90FF;margin-bottom:12px;letter-spacing:0.5px;';
        titleBar.textContent = 'Select Date — Last 4 Months';
        dropdown.appendChild(titleBar);

        // 4-column grid for months
        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        var monthsGrid = document.createElement('div');
        monthsGrid.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:12px;';

        rangeInfo.months.forEach(function (m) {
            var monthBlock = document.createElement('div');
            monthBlock.style.cssText = 'background:#f7faff;border-radius:10px;padding:10px 8px;border:1px solid #ddeeff;';

            // Month header
            var mHeader = document.createElement('div');
            mHeader.style.cssText = 'text-align:center;font-weight:700;font-size:12px;color:#1E90FF;margin-bottom:6px;padding-bottom:5px;border-bottom:1px solid #ddeeff;';
            mHeader.textContent = monthNames[m.month] + ' ' + m.year;
            monthBlock.appendChild(mHeader);

            // Day-of-week row
            var dowRow = document.createElement('div');
            dowRow.style.cssText = 'display:grid;grid-template-columns:repeat(7,1fr);gap:1px;margin-bottom:3px;';
            dayNames.forEach(function (dn) {
                var cell = document.createElement('div');
                cell.textContent = dn;
                cell.style.cssText = 'text-align:center;font-size:9px;font-weight:600;color:#7aabdc;padding:1px 0;';
                dowRow.appendChild(cell);
            });
            monthBlock.appendChild(dowRow);

            // Day cells
            var grid = document.createElement('div');
            grid.style.cssText = 'display:grid;grid-template-columns:repeat(7,1fr);gap:2px;';

            var firstDay = new Date(m.year, m.month, 1).getDay();
            for (var e = 0; e < firstDay; e++) {
                grid.appendChild(document.createElement('div'));
            }

            var daysInMonth = new Date(m.year, m.month + 1, 0).getDate();
            for (var d = 1; d <= daysInMonth; d++) {
                (function (day) {
                    var dateStr = m.year + '-' + String(m.month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
                    var isSelected = (dateStr === g_dateFilterSelectedDate);
                    var hasData = !!dataDatesSet[dateStr];

                    var cell = document.createElement('button');
                    cell.type = 'button';
                    cell.textContent = day;

                    var baseBg = isSelected ? '#1E90FF' : 'transparent';
                    var baseColor = isSelected ? '#fff' : (hasData ? '#1a3a5c' : '#aac3de');
                    cell.style.cssText = [
                        'width:100%;aspect-ratio:1;border-radius:5px;border:none;',
                        'font-size:10px;font-weight:' + (isSelected ? '700' : (hasData ? '600' : '400')) + ';',
                        'cursor:pointer;transition:all 0.12s;',
                        'background:' + baseBg + ';color:' + baseColor + ';',
                        isSelected ? 'box-shadow:0 2px 6px rgba(30,144,255,0.4);' : ''
                    ].join('');

                    cell.title = dateStr + (hasData ? ' (has data)' : '');

                    cell.addEventListener('mouseenter', function () {
                        if (dateStr !== g_dateFilterSelectedDate) {
                            cell.style.background = '#cce4ff';
                            cell.style.color = '#1E90FF';
                        }
                    });
                    cell.addEventListener('mouseleave', function () {
                        if (dateStr !== g_dateFilterSelectedDate) {
                            cell.style.background = 'transparent';
                            cell.style.color = hasData ? '#1a3a5c' : '#aac3de';
                        }
                    });
                    cell.addEventListener('click', function () {
                        g_dateFilterSelectedDate = dateStr;
                        var dd = document.getElementById('datePickerDropdown_' + g_dateFilterCurrentGraphId);
                        if (dd) dd.style.display = 'none';
                        g_rebuildCalendarUI();
                        if (g_dateFilterOnChange) g_dateFilterOnChange(dateStr);
                    });

                    grid.appendChild(cell);
                }(d));
            }

            monthBlock.appendChild(grid);
            monthsGrid.appendChild(monthBlock);
        });

        dropdown.appendChild(monthsGrid);

        // Footer
        var footer = document.createElement('div');
        footer.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:8px;border-top:1px solid #ddeeff;';

        var resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.textContent = 'Reset to Default';
        resetBtn.style.cssText = 'border:1.5px solid #1E90FF;background:none;color:#1E90FF;font-size:11px;cursor:pointer;font-weight:600;border-radius:6px;padding:3px 10px;';
        resetBtn.addEventListener('click', function () {
            g_dateFilterSelectedDate = g_getDefaultDate();
            g_rebuildCalendarUI();
            if (g_dateFilterOnChange) g_dateFilterOnChange(g_dateFilterSelectedDate);
        });

        var infoLabel = document.createElement('span');
        infoLabel.style.cssText = 'font-size:10px;color:#aac3de;';
        var dflt = g_getDefaultDate();
        infoLabel.textContent = 'Default: 1st of ' + (function () {
            var p = dflt.split('-');
            var mn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return mn[parseInt(p[1], 10) - 1] + ' ' + p[0];
        }());

        footer.appendChild(resetBtn);
        footer.appendChild(infoLabel);
        dropdown.appendChild(footer);
    }

    function g_getSelectedDate() {
        return g_dateFilterSelectedDate || g_getDefaultDate();
    }


    // Helper: returns true if the given container is inside the currently active carousel slide
    function _isActiveSlide(containerId) {
        var el = document.getElementById(containerId);
        if (!el) return false;
        var slide = el.closest ? el.closest('.carousel-item') : null;
        if (!slide) {
            // Fallback for older browsers
            var parent = el.parentElement;
            while (parent) {
                if (parent.classList && parent.classList.contains('carousel-item')) { slide = parent; break; }
                parent = parent.parentElement;
            }
        }
        return slide ? slide.classList.contains('active') : false;
    }




    function processEnergyTempData(rows) {
        return rows.map(row => {
            const dateStr = (row.Date || '').split('T')[0];  // normalize to YYYY-MM-DD
            const timeStr = row.Time || '';

            return {
                date: dateStr,          // always "YYYY-MM-DD"
                time: timeStr,
                dateTime: dateStr + ' ' + timeStr,
                // BUG FIX (Graph 3): The endpoint EnergyConsumptionAndTemperatureHourlyActual
                // returns the meter field as MeterID (not Meter). row.Meter was always undefined
                // so meter was always '' and selectedMeterIDs.has('') was always false,
                // making filteredData always empty => perpetual loading spinner / error message.
                meter: (row.MeterID || row.Meter || '').replace(/ID/gi, 'Id'),
                kwh: parseFloat(row.KWH) || 0,
                kvah: parseFloat(row.KVAH) || 0,
                deviceID: row.DeviceID || null,
                assetName: row.Asset || null,
                temperature: (row.Temp_in_degree !== null && row.Temp_in_degree !== undefined) ? parseFloat(row.Temp_in_degree) : null
            };
        });
    }

    function createEnergyTempChartOption(filteredData, selectedDate) {
        console.log('🎯 createEnergyTempChartOption called with:', filteredData.length, 'records');

        if (selectedMeterIDs.size === 0) {
            return {
                title: {
                    text: 'Please select a meter',
                    left: 'center',
                    top: 'center',
                    textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' }
                }
            };
        }

        if (filteredData.length === 0) {
            return {
                title: {
                    text: 'No data available for selected meters',
                    left: 'center',
                    top: 'center',
                    textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' }
                }
            };
        }

        console.log('📊 Sample data (first 3 records):', filteredData.slice(0, 3));

        // Get unique meters and devices
        const uniqueMeters = [...new Set(filteredData.map(r => r.meter))];
        const uniqueDevices = [...new Set(filteredData.map(r => r.deviceID).filter(Boolean))];

        // Sort devices for consistent color assignment
        const sortedDevices = [...uniqueDevices].sort();

        console.log('📊 ========== CHART CREATION DEBUG ==========');
        console.log('📊 Unique Meters:', uniqueMeters);
        console.log('📊 Unique Devices:', uniqueDevices);
        console.log('📊 Sorted Devices (for colors):', sortedDevices);
        console.log('📊 Total Records:', filteredData.length);
        console.log('📊 ============================================');

        // PERFORMANCE FIX: Instead of creating one massive sorted array,
        // we'll create series that handle their own data efficiently

        const allSeries = [];

        // Create KWH and KVAH lines for each meter
        uniqueMeters.forEach((meter, meterIdx) => {
            const meterData = filteredData.filter(r => r.meter === meter);

            // Sort this meter's data once
            const sortedMeterData = meterData.sort((a, b) => {
                const dateTimeA = new Date(`${a.date} ${a.time}`);
                const dateTimeB = new Date(`${b.date} ${b.time}`);
                return dateTimeA - dateTimeB;
            });

            // Get meter color
            const meterIndex = availableMeters.indexOf(meter);
            const meterColor = meterIndex >= 0 ? meterColors[meterIndex % meterColors.length] : meterColors[0];
            meterColorMap.set(meter, meterColor);

            console.log(`📊 ${meter}: ${sortedMeterData.length} records, Color: ${meterColor}`);

            // KWH Line - using [timestamp, value] format for performance
            allSeries.push({
                name: `${meter}_KWH`,
                type: 'line',
                yAxisIndex: 1,
                smooth: true,
                symbol: 'none',
                sampling: 'lttb',
                large: true,
                largeThreshold: 500,
                lineStyle: {
                    width: 2.5,
                    color: meterColor
                },
                emphasis: {
                    disabled: true
                },
                // Use [timestamp, value] format - ECharts handles this efficiently
                data: sortedMeterData.map(r => {
                    let dateStr = r.date;
                    if (dateStr && dateStr.includes('T')) {
                        dateStr = dateStr.split('T')[0];
                    }
                    const timestamp = new Date(`${dateStr} ${r.time}`).getTime();
                    console.log(`Sample: ${dateStr} ${r.time} = ${timestamp}, KWH=${r.kwh}`);
                    return [timestamp, r.kwh];
                }),
                z: 3
            });

            // KVAH Line
            allSeries.push({
                name: `${meter}_KVAH`,
                type: 'line',
                yAxisIndex: 1,
                smooth: true,
                symbol: 'none',
                sampling: 'lttb',
                large: true,
                largeThreshold: 500,
                lineStyle: {
                    width: 2.5,
                    color: meterColor,
                    opacity: 0.5
                },
                emphasis: {
                    disabled: true
                },
                data: sortedMeterData.map(r => {
                    let dateStr = r.date;
                    if (dateStr && dateStr.includes('T')) {
                        dateStr = dateStr.split('T')[0];
                    }
                    const timestamp = new Date(`${dateStr} ${r.time}`).getTime();
                    return [timestamp, r.kvah];
                }),
                z: 2
            });
        });

        // Temperature lines
        uniqueDevices.forEach((deviceID) => {
            const deviceData = filteredData.filter(r => r.deviceID === deviceID);
            const assetName = deviceData[0]?.assetName || 'Unknown Asset';
            const displayName = `${assetName} (${deviceID})`;

            const sortedDeviceData = deviceData.sort((a, b) => {
                const dateTimeA = new Date(`${a.date} ${a.time}`);
                const dateTimeB = new Date(`${b.date} ${b.time}`);
                return dateTimeA - dateTimeB;
            });

            // Use sorted device index for consistent color assignment
            const colorIndex = sortedDevices.indexOf(deviceID);
            const tempColor = getColorFromMap(tempColorMap, deviceID, tempColors, colorIndex);

            allSeries.push({
                name: displayName,
                type: 'line',
                yAxisIndex: 0,
                smooth: true,
                symbol: 'none',
                sampling: 'lttb',
                large: true,
                largeThreshold: 500,
                lineStyle: {
                    width: 1,
                    color: tempColor
                },
                itemStyle: {
                    color: tempColor
                },
                emphasis: {
                    disabled: true
                },
                data: sortedDeviceData
                    .filter(r => r.temperature !== null)
                    .map(r => {
                        let dateStr = r.date;
                        if (dateStr && dateStr.includes('T')) {
                            dateStr = dateStr.split('T')[0];
                        }
                        const timestamp = new Date(`${dateStr} ${r.time}`).getTime();
                        return [timestamp, r.temperature];
                    }),
                connectNulls: true,
                z: 10
            });
        });

        // Legend shows only temperature series
        const legendData = allSeries
            .filter(s => !s.name.includes('_KWH') && !s.name.includes('_KVAH'))
            .map(s => s.name);

        console.log('📊 Total Series:', allSeries.length);

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: { color: '#999' }
                },
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                padding: [12, 16],
                textStyle: {
                    color: '#ffffff',
                    fontSize: 12
                },
                formatter: function (params) {
                    if (!params || params.length === 0) return '';

                    // Format timestamp
                    const timestamp = new Date(params[0].value[0]);
                    const dateStr = timestamp.toISOString().split('T')[0];
                    const timeStr = timestamp.toTimeString().split(' ')[0];
                    const dateTime = `${dateStr} ${timeStr}`;

                    let html = `<div style="font-weight:bold;margin-bottom:8px;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:4px;">${dateTime}</div>`;

                    // Group by meter and deduplicate temperatures
                    const byMeter = {};
                    const tempMap = new Map();  // Use Map to deduplicate by device name

                    params.forEach(p => {
                        if (p.seriesName.includes('_KWH')) {
                            const meter = p.seriesName.replace('_KWH', '');
                            if (!byMeter[meter]) byMeter[meter] = {};
                            byMeter[meter].kwh = p.value[1];
                            byMeter[meter].color = p.color;
                        } else if (p.seriesName.includes('_KVAH')) {
                            const meter = p.seriesName.replace('_KVAH', '');
                            if (!byMeter[meter]) byMeter[meter] = {};
                            byMeter[meter].kvah = p.value[1];
                        } else {
                            // Temperature - use Map to avoid duplicates
                            if (!tempMap.has(p.seriesName)) {
                                tempMap.set(p.seriesName, {
                                    name: p.seriesName,
                                    value: p.value[1],
                                    color: p.color
                                });
                            }
                        }
                    });

                    // Show meters
                    Object.keys(byMeter).forEach((meter, idx) => {
                        const data = byMeter[meter];
                        const marker = `<span style="display:inline-block;width:12px;height:12px;background:${data.color};margin-right:6px;"></span>`;

                        if (idx > 0) html += `<div style="margin-top:6px;border-top:1px solid rgba(255,255,255,0.2);padding-top:5px;">`;
                        else html += `<div style="margin-top:4px;">`;

                        html += `<div style="font-weight:600;font-size:12px;margin-bottom:3px;">${marker}${meter}</div>`;
                        html += `<div style="margin-left:18px;font-size:11px;color:#e0e0e0;">`;
                        html += `KWH: <strong>${data.kwh?.toFixed(2) || 'N/A'}</strong> | `;
                        html += `KVAH: <strong>${data.kvah?.toFixed(2) || 'N/A'}</strong>`;
                        html += `</div></div>`;
                    });

                    // Show deduplicated temperatures
                    if (tempMap.size > 0) {
                        html += `<div style="margin-top:6px;border-top:1px solid rgba(255,255,255,0.2);padding-top:5px;">`;
                        tempMap.forEach(t => {
                            const marker = `<span style="display:inline-block;width:10px;height:10px;background:${t.color};border-radius:50%;margin-right:5px;"></span>`;
                            html += `<div style="font-size:10px;color:#b0b0b0;margin:2px 0;">`;
                            html += `${marker}${t.name}: <strong style="color:#fff;">${t.value?.toFixed(2)}°C</strong>`;
                            html += `</div>`;
                        });
                        html += `</div>`;
                    }

                    return html;
                }
            },
            legend: {
                data: legendData,
                type: 'scroll',
                top: 5,
                left: 'center',
                padding: [6, 12],
                backgroundColor: 'rgba(255,255,255,0.92)',
                borderRadius: 6,
                borderColor: '#ddd',
                borderWidth: 1,
                textStyle: { fontSize: 12, color: '#333' },
                itemWidth: 22, itemHeight: 12, itemGap: 12,
                icon: 'roundRect',
                pageIconSize: 12,
                pageTextStyle: { fontSize: 11 }
            },
            grid: {
                left: '8%',
                right: '4%',
                bottom: '12%',
                // legend top:5, each row ~30px, +22px clear gap before chart
                top: (function () {
                    var rows = Math.ceil(legendData.length / 4);
                    return 5 + (rows * 30) + 22;
                }()),
                containLabel: true
            },
            xAxis: (function () {
                // COLD: trim to actual data range for selected day (no full 24h forced)
                var baseDateStr = selectedDate || (filteredData.length > 0 ? filteredData[0].date : null);
                if (!baseDateStr) { var r = getToday24hRange(); return { type: 'time', boundaryGap: false, min: r.min, max: r.max }; }

                var _base = new Date(baseDateStr + 'T00:00:00');
                var dayData = filteredData.filter(function (r) { return r.date === baseDateStr; });
                var _min, _max;
                if (dayData.length > 0) {
                    var timestamps = dayData.map(function (r) {
                        return new Date(baseDateStr + ' ' + r.time).getTime();
                    }).filter(function (t) { return !isNaN(t); });
                    if (timestamps.length > 0) {
                        _min = Math.min.apply(null, timestamps);
                        _max = Math.max.apply(null, timestamps) + 15 * 60 * 1000;
                    }
                }
                if (!_min || !_max) {
                    _min = new Date(_base.getFullYear(), _base.getMonth(), _base.getDate(), 0, 0, 0).getTime();
                    _max = new Date(_base.getFullYear(), _base.getMonth(), _base.getDate(), 23, 59, 59, 999).getTime();
                }
                return {
                    type: 'time',
                    boundaryGap: false,
                    min: _min,
                    max: _max,
                    axisLabel: {
                        show: true, fontSize: 10, color: '#555', rotate: 0,
                        formatter: function (value) {
                            var h = new Date(value).getHours();
                            var mn = new Date(value).getMinutes();
                            return String(h) + (mn > 0 ? ':' + String(mn).padStart(2, '0') : '');
                        }
                    },
                    axisLine: { lineStyle: { color: '#999', width: 1 } },
                    axisTick: { show: true, lineStyle: { color: '#999' } },
                    splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } }
                };
            }()),
            yAxis: [
                {
                    type: 'value',
                    name: 'Temperature (°C)',
                    nameLocation: 'middle',
                    nameGap: 45,
                    nameRotate: 90,
                    position: 'left',
                    nameTextStyle: {
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: '#333'
                    },
                    axisLabel: {
                        formatter: '{value}°',
                        fontSize: 10,
                        color: '#666'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#999', width: 1 }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: { color: '#f0f0f0', type: 'dashed' }
                    }
                },
                {
                    type: 'value',
                    name: 'KWH / KVAH',
                    nameLocation: 'middle',
                    nameGap: 45,
                    nameRotate: -90,
                    position: 'right',
                    nameTextStyle: {
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: '#333'
                    },
                    axisLabel: {
                        fontSize: 10,
                        color: '#666'
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#999', width: 1 }
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            series: allSeries,
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100,
                    zoomOnMouseWheel: true,
                    moveOnMouseMove: true
                },
                {
                    type: 'slider',
                    show: true,
                    start: 0,
                    end: 100,
                    height: 15,
                    bottom: 10,
                    handleSize: '60%',
                    handleStyle: {
                        color: '#5470C6',
                        borderColor: '#5470C6'
                    },
                    textStyle: {
                        color: '#666',
                        fontSize: 9
                    },
                    borderColor: '#ddd'
                }
            ],
            animation: true,
            animationDuration: 2000,
            animationEasing: 'cubicOut',
            animationDelay: 0
        };
    }


    function fetchAllMeterData() {
        console.log('🔄 Fetching data for ALL meters...');

        const TimeCategory = 'Cold';
        // Pass ALL available meters to the API
        const allMetersParam = availableMeters.join(',');

        console.log('📡 Requesting data for meters:', allMetersParam);

        // FIX: Use the correct endpoint for energy + temperature live data (same as Graph 801)
        $.ajax({
            type: "POST",
            url: "/Energy/GetEnergyTrends_EnergyConsumptionAndTemperatureLive?TimeCategory=" + TimeCategory + "&Meter=" + encodeURIComponent(allMetersParam),
            success: function (result) {
                const response = typeof result === "string" ? JSON.parse(result) : result;
                const rows = response.Table || response || [];

                console.log('✅ Fetched ALL meter data:', rows.length, 'rows');

                // Process and store ALL data globally
                energyTempData = processEnergyTempData(rows);
                console.log('✅ Processed and stored:', energyTempData.length, 'records');

                // Rebuild date filter calendar from actual data dates
                g_refreshDateFilterFromData(energyTempData, function (newDate) {
                    updateEnergyTempChart();
                });
                // Show chart for currently selected meters (just filter the data)
                updateEnergyTempChart();
            },
            error: function (error) {
                console.error('❌ Error loading all meter data:', error);
                const container = document.getElementById(currentEnergyTempChartContainerId);
                if (container) {
                    const myChart = echarts.getInstanceByDom(container);
                    if (myChart) {
                        myChart.setOption({
                            title: {
                                text: 'Error loading data',
                                left: 'center',
                                top: 'center',
                                textStyle: { color: '#f44336', fontSize: 16 }
                            }
                        });
                    }
                }
            }
        });
    }

    function updateEnergyTempChart() {
        if (!currentEnergyTempChartContainerId) return;

        const container = document.getElementById(currentEnergyTempChartContainerId);
        if (!container) return;

        const myChart = echarts.getInstanceByDom(container);
        if (!myChart) return;

        // If no meters selected, show message
        if (selectedMeterIDs.size === 0) {
            const option = createEnergyTempChartOption([]);
            myChart.setOption(option, true);
            return;
        }

        myChart.showLoading({
            text: 'Updating chart...',
            color: '#5470C6',
            textColor: '#000',
            maskColor: 'rgba(255, 255, 255, 0.8)',
            zlevel: 0
        });

        console.log('📊 Filtering preloaded data for selected meters:', Array.from(selectedMeterIDs));

        // Filter by BOTH meter AND selected date.
        // Previously only filtering by meter caused all dates' data to render at once
        // instead of showing just the selected single day.
        const selectedDate = g_getSelectedDate();
        const filteredData = energyTempData.filter(function (record) {
            return selectedMeterIDs.has(record.meter) && record.date === selectedDate;
        });

        console.log('✅ Filtered data points (meter + date):', filteredData.length, '| date:', selectedDate);

        myChart.hideLoading();
        const option = createEnergyTempChartOption(filteredData, selectedDate);
        myChart.setOption(option, true);
    }



    function renderMeterFilters(meters) {
        const filterContainer = document.getElementById('meterFilterContainer');
        if (!filterContainer) {
            console.warn('⚠️ Filter container not found');
            return;
        }

        filterContainer.innerHTML = '<div class="filter-label">Filter by Meter Type:</div>';

        meters.forEach((meter, index) => {
            // FIXED: Assign color based on index position in availableMeters array
            const color = getMeterColor(meter, index);
            meterColorMap.set(meter, color);

            console.log(`🎨 Meter: ${meter}, Index: ${index}, Color: ${color}`);

            const checkbox = document.createElement('label');
            checkbox.className = 'meter-checkbox-label';
            checkbox.innerHTML = `
                <input type="checkbox" class="meter-checkbox" data-meter="${meter}" ${selectedMeterIDs.has(meter) ? 'checked' : ''}>
                <span class="checkbox-box" style="border-color: ${color}; color: ${color};">
                    <span class="checkbox-check"></span>
                </span>
                <span class="checkbox-text">${meter}</span>
            `;

            checkbox.querySelector('.meter-checkbox').addEventListener('change', function () {
                const meterName = this.dataset.meter;

                if (this.checked) {
                    selectedMeterIDs.add(meterName);
                    console.log('✅ Added meter:', meterName);
                } else {
                    selectedMeterIDs.delete(meterName);
                    console.log('❌ Removed meter:', meterName);
                }

                console.log('📊 Currently selected meters:', Array.from(selectedMeterIDs));
                updateEnergyTempChart();
            });

            filterContainer.appendChild(checkbox);
        });
    }

    function fetchMetersAndInitialize() {
        console.log('🔄 Fetching available meters...');

        $.ajax({
            type: "POST",
            url: "/Energy/GetFilterbyMeter",
            success: function (result) {
                const response = typeof result === "string" ? JSON.parse(result) : result;
                const meters = response.Table || response || [];

                if (!meters.length) {
                    console.error('❌ No meters available');
                    return;
                }

                console.log('✅ Fetched meters:', meters);

                // CRITICAL: Normalize meter names to match data format (SlaveId1, not SlaveID1)
                availableMeters = meters.map(m => {
                    const meterName = m.MeterDisplayname || m.meter || m;
                    return meterName.replace(/ID/gi, 'Id');  // Normalize: SlaveID1 → SlaveId1
                });

                console.log('✅ Normalized meter names:', availableMeters);

                // Clear and set default meter (first one)
                selectedMeterIDs.clear();
                if (availableMeters.length > 0) {
                    selectedMeterIDs.add(availableMeters[0]);
                }

                console.log('📍 Default selected meter:', Array.from(selectedMeterIDs));

                // Render filter checkboxes with colors
                renderMeterFilters(availableMeters);

                // CRITICAL: Fetch ALL meter data at once
                fetchAllMeterData();
            },
            error: function (error) {
                console.error('❌ Error fetching meters:', error);
            }
        });
    }

    function initializeEnergyTempChart(graphContainerId) {
        console.log('🎯 Initializing Energy vs Temp chart for container:', graphContainerId);

        currentEnergyTempChartContainerId = graphContainerId;
        const dom = document.getElementById(graphContainerId);

        if (!dom) {
            console.error('❌ Container not found:', graphContainerId);
            return;
        }

        const existingChart = echarts.getInstanceByDom(dom);
        if (existingChart) {
            existingChart.dispose();
        }

        const myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        myChart.showLoading({
            text: 'Initializing...',
            color: '#5470C6',
            textColor: '#000',
            maskColor: 'rgba(255, 255, 255, 0.8)',
            zlevel: 0
        });

        // Cold version: default to 1st of 3rd-last month
        g_dateFilterSelectedDate = g_getDefaultDate();
        g_renderDateFilter(3, function (newDate) {
            updateEnergyTempChart();
        });

        fetchMetersAndInitialize();

        window.addEventListener('resize', function () {
            if (myChart) {
                myChart.resize();
            }
        });
    }

    // Graph 8: Energy Consumption - KWH vs KVAH vs Temperature (Live)
    _echartEnergyConsumptionColdChartDashboard[3] = function (graphContainerId) {
        console.log('📊 Graph 3 (Energy Consumption - KWH vs KVAH vs Temperature Live) called with container:', graphContainerId);
        initializeEnergyTempChart(graphContainerId);
    };



    // ===========================
    // GRAPH 1: ENERGY CONSUMPTION (LIVE) - NO TEMPERATURE
    // Same as Graph 3 but without temperature lines
    // ===========================

    let g1_energyData = [];
    let g1_availableMeters = [];
    let g1_selectedMeterIDs = new Set();
    let g1_meterColorMap = new Map();
    let g1_currentContainerId = null;

    function g1_processEnergyData(rows) {
        return rows.map(row => {
            const dateStr = (row.Date || '').split('T')[0];  // normalize to YYYY-MM-DD
            const timeStr = row.Time || '';

            return {
                date: dateStr,          // always "YYYY-MM-DD"
                time: timeStr,          // "HH:MM:SS"
                dateTime: dateStr + ' ' + timeStr,
                meter: (row.MeterID || row.Meter || '').replace(/ID/gi, 'Id'),
                kwh: parseFloat(row.KWH) || 0,
                kvah: parseFloat(row.KVAH) || 0
            };
        });
    }

    // Graph 1 - g1_createChartOption
    // Each meter gets its own independent [timestamp, value] series built from
    // ONLY its own data points. This mirrors Graph 3's approach and Graph 2's
    // pattern: no shared timestamp grid, no null padding between meters.
    // Null-padding caused line breaks on existing meters when a new meter
    // (with different recording timestamps) was added to the selection.
    function g1_createChartOption(filteredData, selectedDate) {
        console.log('🎯 Graph 1 createChartOption called with:', filteredData.length, 'records');

        if (g1_selectedMeterIDs.size === 0) {
            return {
                title: {
                    text: 'Please select a meter',
                    left: 'center',
                    top: 'center',
                    textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' }
                }
            };
        }

        if (filteredData.length === 0) {
            return {
                title: {
                    text: 'No data available for selected meters',
                    left: 'center',
                    top: 'center',
                    textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' }
                }
            };
        }

        console.log('📊 Sample data (first 3 records):', filteredData.slice(0, 3));

        // Build series per meter — each meter uses ONLY its own timestamps.
        // Do NOT build a shared allTimestamps grid and null-pad other meters:
        // that was causing line breaks on existing meters when a new meter
        // with different recording intervals was added to the selection.
        var selectedMetersArray = Array.from(g1_selectedMeterIDs);
        var legendData = [];
        var series = [];

        selectedMetersArray.forEach(function (meter) {
            var meterIndex = g1_availableMeters.indexOf(meter);
            var color = meterColors[meterIndex >= 0 ? meterIndex % meterColors.length : 0];
            g1_meterColorMap.set(meter, color);

            // Get only this meter's records and sort by time
            var meterRows = filteredData
                .filter(function (r) { return r.meter === meter; })
                .sort(function (a, b) {
                    return new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime();
                });

            // Each point is [timestamp, value] — ECharts time axis places them correctly
            var kwhData = meterRows.map(function (r) {
                return [new Date(r.date + ' ' + r.time).getTime(), r.kwh];
            });
            var kvahData = meterRows.map(function (r) {
                return [new Date(r.date + ' ' + r.time).getTime(), r.kvah];
            });

            legendData.push(meter + ' KWH');
            legendData.push(meter + ' KVAH');

            series.push({
                name: meter + '_KWH',
                type: 'line',
                smooth: false,
                symbol: 'none',
                sampling: 'lttb',
                lineStyle: { width: 2.5, color: color },
                itemStyle: { color: color },
                data: kwhData,
                connectNulls: true,
                z: 3
            });
            series.push({
                name: meter + '_KVAH',
                type: 'line',
                smooth: false,
                symbol: 'none',
                sampling: 'lttb',
                lineStyle: { width: 2.5, color: color, opacity: 0.5 },
                itemStyle: { color: color },
                data: kvahData,
                connectNulls: true,
                z: 2
            });
        });

        // X-axis: trim to the actual data range for the selected date (same as Graph 3)
        var baseDateStr = selectedDate || (filteredData.length > 0 ? filteredData[0].date : null);
        var xAxisOption;
        if (baseDateStr) {
            var dayData = filteredData.filter(function (r) { return r.date === baseDateStr; });
            var _min, _max;
            if (dayData.length > 0) {
                var timestamps = dayData.map(function (r) {
                    return new Date(baseDateStr + ' ' + r.time).getTime();
                }).filter(function (t) { return !isNaN(t); });
                if (timestamps.length > 0) {
                    _min = Math.min.apply(null, timestamps);
                    _max = Math.max.apply(null, timestamps) + 15 * 60 * 1000;
                }
            }
            if (!_min || !_max) {
                var _base = new Date(baseDateStr + 'T00:00:00');
                _min = new Date(_base.getFullYear(), _base.getMonth(), _base.getDate(), 0, 0, 0).getTime();
                _max = new Date(_base.getFullYear(), _base.getMonth(), _base.getDate(), 23, 59, 59, 999).getTime();
            }
            xAxisOption = {
                type: 'time',
                boundaryGap: false,
                min: _min,
                max: _max,
                axisLabel: {
                    show: true, fontSize: 10, color: '#555',
                    formatter: function (value) {
                        var h = new Date(value).getHours();
                        var mn = new Date(value).getMinutes();
                        return String(h) + (mn > 0 ? ':' + String(mn).padStart(2, '0') : '');
                    }
                },
                axisLine: { lineStyle: { color: '#999', width: 1 } },
                axisTick: { show: true, lineStyle: { color: '#999' } },
                splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } }
            };
        } else {
            xAxisOption = {
                type: 'time',
                boundaryGap: false,
                axisLabel: {
                    show: true, fontSize: 10, color: '#555',
                    formatter: function (value) {
                        var h = new Date(value).getHours();
                        var mn = new Date(value).getMinutes();
                        return String(h) + (mn > 0 ? ':' + String(mn).padStart(2, '0') : '');
                    }
                },
                axisLine: { lineStyle: { color: '#999', width: 1 } },
                axisTick: { show: true, lineStyle: { color: '#999' } },
                splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } }
            };
        }

        console.log('📊 Total Series:', series.length);

        // Legend rows calculation for grid top offset (same as Graph 2 pattern)
        var legendRows = Math.ceil(legendData.length / 4);
        var gridTop = 5 + (legendRows * 30) + 22;

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                padding: [12, 16],
                textStyle: { color: '#ffffff', fontSize: 12 },
                formatter: function (params) {
                    if (!params || params.length === 0) return '';

                    var ts = params[0].value && params[0].value[0] != null ? params[0].value[0] : null;
                    var dateTime = '';
                    if (ts != null) {
                        var d = new Date(ts);
                        dateTime = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
                            + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0');
                    }

                    var html = '<div style="font-weight:bold;margin-bottom:8px;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:4px;">' + dateTime + '</div>';

                    var byMeter = {};
                    params.forEach(function (p) {
                        if (p.value == null || p.value[1] == null) return;
                        if (p.seriesName.indexOf('_KWH') !== -1) {
                            var meter = p.seriesName.replace('_KWH', '');
                            if (!byMeter[meter]) byMeter[meter] = {};
                            byMeter[meter].kwh = p.value[1];
                            byMeter[meter].color = p.color;
                        } else if (p.seriesName.indexOf('_KVAH') !== -1) {
                            var meter = p.seriesName.replace('_KVAH', '');
                            if (!byMeter[meter]) byMeter[meter] = {};
                            byMeter[meter].kvah = p.value[1];
                        }
                    });

                    var idx = 0;
                    Object.keys(byMeter).forEach(function (meter) {
                        var data = byMeter[meter];
                        var marker = '<span style="display:inline-block;width:12px;height:12px;background:' + (data.color || '#999') + ';border-radius:2px;margin-right:6px;"></span>';
                        html += idx > 0
                            ? '<div style="margin-top:6px;border-top:1px solid rgba(255,255,255,0.2);padding-top:5px;">'
                            : '<div style="margin-top:4px;">';
                        html += '<div style="font-weight:600;font-size:12px;margin-bottom:3px;">' + marker + meter + '</div>';
                        html += '<div style="margin-left:18px;font-size:11px;color:#e0e0e0;">';
                        html += 'KWH: <strong>' + (data.kwh != null ? Number(data.kwh).toFixed(2) : 'N/A') + '</strong> | ';
                        html += 'KVAH: <strong>' + (data.kvah != null ? Number(data.kvah).toFixed(2) : 'N/A') + '</strong>';
                        html += '</div></div>';
                        idx++;
                    });

                    return html;
                }
            },
            legend: {
                data: legendData,
                type: 'scroll',
                top: 5,
                left: 'center',
                padding: [6, 12],
                backgroundColor: 'rgba(255,255,255,0.92)',
                borderRadius: 6,
                borderColor: '#ddd',
                borderWidth: 1,
                textStyle: { fontSize: 12, color: '#333' },
                itemWidth: 22, itemHeight: 12, itemGap: 12,
                icon: 'roundRect',
                pageIconSize: 12,
                pageTextStyle: { fontSize: 11 },
                formatter: function (name) {
                    // Show "SlaveId1 KWH" and "SlaveId1 KVAH (50%)" style labels
                    if (name.indexOf('_KVAH') !== -1) return name.replace('_KVAH', '') + ' KVAH';
                    if (name.indexOf('_KWH') !== -1) return name.replace('_KWH', '') + ' KWH';
                    return name;
                }
            },
            grid: {
                left: '7%',
                right: '7%',
                bottom: '12%',
                top: gridTop,
                containLabel: true
            },
            xAxis: xAxisOption,
            yAxis: {
                type: 'value',
                name: 'KWH / KVAH',
                nameLocation: 'middle',
                nameGap: 45,
                nameRotate: 90,
                nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#333' },
                axisLabel: { fontSize: 10, color: '#666' },
                axisLine: { show: true, lineStyle: { color: '#999', width: 1 } },
                splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } }
            },
            series: series,
            dataZoom: [
                { type: 'inside', start: 0, end: 100, zoomOnMouseWheel: true, moveOnMouseMove: true },
                {
                    type: 'slider',
                    show: true, start: 0, end: 100, height: 15, bottom: 10,
                    handleSize: '60%',
                    handleStyle: { color: '#5470C6', borderColor: '#5470C6' },
                    textStyle: { color: '#666', fontSize: 9 },
                    borderColor: '#ddd'
                }
            ],
            animation: false
        };
    }

    function g1_updateChart() {
        if (!g1_currentContainerId) return;

        const container = document.getElementById(g1_currentContainerId);
        if (!container) return;

        const myChart = echarts.getInstanceByDom(container);
        if (!myChart) return;

        if (g1_selectedMeterIDs.size === 0) {
            myChart.setOption({
                title: { text: 'Please select a meter', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 18 } },
                legend: { show: false },
                xAxis: { show: false },
                yAxis: { show: false },
                series: []
            }, true);
            return;
        }

        // Filter by both meter AND the selected date
        const selectedDate = g_getSelectedDate();
        const filteredData = g1_energyData.filter(r => g1_selectedMeterIDs.has(r.meter) && r.date === selectedDate);
        console.log('📊 Graph 1: Filtered data for selected meters and date:', filteredData.length, 'records, date:', selectedDate);

        myChart.hideLoading();
        const option = g1_createChartOption(filteredData, selectedDate);
        // notMerge=true ensures stale series from previously selected meters are fully removed
        myChart.setOption(option, true);
    }

    function g1_renderMeterFilters(meters) {
        const container = document.getElementById('meterFilterContainer');
        if (!container) return;

        container.innerHTML = '<div class="filter-label">Filter by Meter Type:</div>';

        meters.forEach(function (meter, index) {
            var color = meterColors[index % meterColors.length];
            g1_meterColorMap.set(meter, color);

            var label = document.createElement('label');
            label.className = 'meter-checkbox-label';
            label.innerHTML =
                '<input type="checkbox" class="meter-checkbox g1-meter-checkbox" data-meter="' + meter + '" ' +
                (g1_selectedMeterIDs.has(meter) ? 'checked' : '') + '>' +
                '<span class="checkbox-box" style="border-color:' + color + ';color:' + color + ';">' +
                '<span class="checkbox-check"></span>' +
                '</span>' +
                '<span class="checkbox-text">' + meter + '</span>';

            label.querySelector('.g1-meter-checkbox').addEventListener('change', function () {
                var meterName = this.dataset.meter;
                if (this.checked) {
                    g1_selectedMeterIDs.add(meterName);
                    console.log('✅ Graph 1: Added meter:', meterName);
                } else {
                    g1_selectedMeterIDs.delete(meterName);
                    console.log('❌ Graph 1: Removed meter:', meterName);
                }
                console.log('📊 Graph 1: Currently selected meters:', Array.from(g1_selectedMeterIDs));
                g1_updateChart();
            });

            container.appendChild(label);
        });
    }

    function g1_fetchAllMeterData() {
        console.log('🔄 Graph 1: Fetching data for ALL meters...');

        const TimeCategory = 'Cold';
        const allMetersParam = g1_availableMeters.join(',');

        console.log('📡 Graph 1: Requesting data for meters:', allMetersParam);

        $.ajax({
            type: "POST",
            url: "/Energy/GetEnergyTrends_EnergyConsumptionLive?TimeCategory=" + TimeCategory + "&Meter=" + encodeURIComponent(allMetersParam),
            success: function (result) {
                const response = typeof result === "string" ? JSON.parse(result) : result;
                const rows = response.Table || response || [];

                console.log('✅ Graph 1: Fetched ALL meter data:', rows.length, 'rows');

                g1_energyData = g1_processEnergyData(rows);
                console.log('✅ Graph 1: Processed and stored:', g1_energyData.length, 'records');

                // Rebuild date filter calendar from actual data dates
                g_refreshDateFilterFromData(g1_energyData, function (newDate) {
                    g1_updateChart();
                });
                g1_updateChart();
            },
            error: function (error) {
                console.error('❌ Graph 1: Error loading data:', error);
                const container = document.getElementById(g1_currentContainerId);
                if (container) {
                    const myChart = echarts.getInstanceByDom(container);
                    if (myChart) {
                        myChart.setOption({
                            title: {
                                text: 'Error loading data',
                                left: 'center',
                                top: 'center',
                                textStyle: { color: '#f44336', fontSize: 16 }
                            }
                        });
                    }
                }
            }
        });
    }

    function g1_fetchMetersAndInitialize() {
        console.log('🔄 Graph 1: Fetching available meters...');


        $.ajax({
            type: "POST",
            url: "/Energy/GetFilterbyMeter",
            success: function (result) {
                const response = typeof result === "string" ? JSON.parse(result) : result;
                let meters = response.Table || response || [];

                console.log('✅ Graph 1: Fetched meters:', meters);

                ;

                g1AvailableMeters = meters.map(function (m) {
                    var name = m.MeterDisplayname || m.meter || m;
                    return name.replace(/ID/gi, 'Id');
                });


                g1_availableMeters = [...new Set(g1AvailableMeters)];
                console.log('✅ Graph 1: Normalized meter names:', g1_availableMeters);

                g1_selectedMeterIDs.clear();
                if (g1_availableMeters.length > 0) {
                    g1_selectedMeterIDs.add(g1_availableMeters[0]);
                }

                console.log('📍 Graph 1: Default selected meter:', Array.from(g1_selectedMeterIDs));

                g1_renderMeterFilters(g1_availableMeters);
                g1_fetchAllMeterData();
            },
            error: function (error) {
                console.error('❌ Graph 1: Error fetching meters:', error);
            }
        });
    }

    function g1_initialize(graphContainerId) {
        console.log('🎯 Graph 1: Initializing Energy Consumption (Live) for container:', graphContainerId);

        g1_currentContainerId = graphContainerId;
        const dom = document.getElementById(graphContainerId);

        if (!dom) {
            console.error('❌ Graph 1: Container not found:', graphContainerId);
            return;
        }

        const existingChart = echarts.getInstanceByDom(dom);
        if (existingChart) {
            existingChart.dispose();
        }

        const myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        myChart.showLoading({
            text: 'Initializing...',
            color: '#5470C6',
            textColor: '#000',
            maskColor: 'rgba(255, 255, 255, 0.8)',
            zlevel: 0
        });

        // Cold version: default to 1st of 3rd-last month
        g_dateFilterSelectedDate = g_getDefaultDate();
        g_renderDateFilter(1, function (newDate) {
            g1_updateChart();
        });
        g1_fetchMetersAndInitialize();

        window.addEventListener('resize', function () { if (myChart) myChart.resize(); });
    }

    // Graph 1: Energy Consumption (Live) - No Temperature
    _echartEnergyConsumptionColdChartDashboard[1] = function (graphContainerId) {
        console.log('📊 Graph 1 (Energy Consumption Live - No Temperature) called with container:', graphContainerId);
        g1_initialize(graphContainerId);
    };



    // GRAPH 2 — Cumulative Energy Consumption (Live)
    // Dynamic: GetFilterbyMeter → GetEnergyTrends_CumulativeEnergyConsumptionLive
    //   params: TimeCategory, Meter (all meters csv), Mainmeter (first meter)
    // Lines per meter: Cumulative_KWH (solid, full opacity) + Cumulative_KVAH (dashed, 45% opacity)
    // No temperature — single yAxis
    // ===================================================================

    var g2ContainerId = null;
    var g2Data = [];
    var g2AvailableMeters = [];
    var g2MainMeter = '';          // first meter from GetFilterbyMeter
    var g2SelectedMeters = new Set();
    var g2MeterColorMap = new Map();

    function g2_processData(rows) {
        // COLD CumulativeEnergyConsumptionLive: MeterID, Date, Time, KWH, KVAH, Year, WeekNo
        // Use the last snapshot per week per meter (highest cumulative value = last entry)
        var records = rows.map(function (row) {
            var dateStr = (row.Date || '').split('T')[0];
            return {
                date: dateStr,
                weekNo: row.WeekNo || '',
                year: row.Year || '',
                weekKey: (row.Year || '') + '-W' + String(row.WeekNo || '').padStart(2, '0'),
                meter: (row.MeterID || row.Meter || '').replace(/ID/gi, 'Id'),
                cumKwh: parseFloat(row.KWH) || 0,
                cumKvah: parseFloat(row.KVAH) || 0
            };
        }).filter(function (r) { return !!r.date; });

        // Collapse to one record per meter per week (take max cumulative = last snapshot)
        var weekMap = {};
        records.forEach(function (r) {
            var key = r.meter + '||' + r.weekKey;
            if (!weekMap[key] || r.cumKwh > weekMap[key].cumKwh) {
                weekMap[key] = r;
            }
        });
        return Object.values(weekMap);
    }

    function g2_createChartOption(filteredData) {
        if (g2SelectedMeters.size === 0) {
            return { title: { text: 'Please select a meter', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' } } };
        }
        if (filteredData.length === 0) {
            return { title: { text: 'No data available for selected meters', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' } } };
        }

        var seenM = {}, uniqueMeters = [];
        filteredData.forEach(function (r) {
            if (!seenM[r.meter]) { seenM[r.meter] = true; uniqueMeters.push(r.meter); }
        });

        // Sorted unique week keys
        var seenW = {}, allWeekKeys = [];
        filteredData.forEach(function (r) {
            if (r.weekKey && !seenW[r.weekKey]) { seenW[r.weekKey] = true; allWeekKeys.push(r.weekKey); }
        });
        allWeekKeys.sort();

        // X-axis labels: "Wnn" format
        var xAxisLabels = allWeekKeys.map(function (wk) {
            var parts = wk.split('-W');
            return parts.length === 2 ? 'W' + parts[1] + '\'' + (parts[0] || '').slice(2) : wk;
        });

        var legendData = [];
        var kwhSeries = uniqueMeters.map(function (meter) {
            var meterIndex = g2AvailableMeters.indexOf(meter);
            var color = meterColors[meterIndex >= 0 ? meterIndex % meterColors.length : 0];
            g2MeterColorMap.set(meter, color);
            legendData.push(meter + ' KWH');
            var data = allWeekKeys.map(function (wk) {
                var rec = filteredData.find(function (r) { return r.meter === meter && r.weekKey === wk; });
                return rec ? rec.cumKwh : null;
            });
            return {
                name: meter + ' KWH', type: 'line', smooth: false,
                symbol: 'circle', symbolSize: 5,
                lineStyle: { width: 2.5, color: color }, itemStyle: { color: color },
                data: data, connectNulls: true,   // FIX: connectNulls true to draw continuous line
                z: 3
            };
        });

        var kvahSeries = uniqueMeters.map(function (meter) {
            var color = g2MeterColorMap.get(meter) || meterColors[0];
            legendData.push(meter + ' KVAH');
            var data = allWeekKeys.map(function (wk) {
                var rec = filteredData.find(function (r) { return r.meter === meter && r.weekKey === wk; });
                return rec ? rec.cumKvah : null;
            });
            return {
                name: meter + ' KVAH', type: 'line', smooth: false,
                symbol: 'circle', symbolSize: 5,
                lineStyle: { width: 2.5, color: color, opacity: 0.5 }, itemStyle: { color: color, opacity: 0.5 },
                data: data, connectNulls: true,   // FIX: connectNulls true
                z: 2
            };
        });

        var allSeries = kwhSeries.concat(kvahSeries);

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
                backgroundColor: 'rgba(0,0,0,0.85)',
                borderColor: 'rgba(255,255,255,0.2)',
                borderWidth: 1, padding: [14, 18],
                textStyle: { color: '#fff', fontSize: 13 },
                formatter: function (params) {
                    if (!params || !params.length) return '';
                    var wk = allWeekKeys[params[0].dataIndex] || params[0].axisValue;
                    // Find the actual date for this week from data
                    var rec = filteredData.find(function (r) { return r.weekKey === wk; });
                    var dateHint = rec ? ' (' + rec.date + ')' : '';
                    var html = '<div style="font-weight:bold;margin-bottom:10px;font-size:14px;color:#fff;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:6px;">' + wk + dateHint + '</div>';
                    var grouped = {};
                    params.forEach(function (p) {
                        if (p.value == null) return;
                        var km = p.seriesName.match(/^(.+) KWH$/);
                        var vm = p.seriesName.match(/^(.+) KVAH$/);
                        if (km) { if (!grouped[km[1]]) grouped[km[1]] = { color: p.color }; grouped[km[1]].kwh = p.value; }
                        else if (vm) { if (!grouped[vm[1]]) grouped[vm[1]] = {}; grouped[vm[1]].kvah = p.value; }
                    });
                    Object.keys(grouped).forEach(function (meter) {
                        var d = grouped[meter];
                        var mk = '<span style="display:inline-block;width:12px;height:12px;background:' + (d.color || '#999') + ';border-radius:2px;margin-right:7px;"></span>';
                        html += '<div style="margin:7px 0;"><div style="font-weight:600;color:#fff;margin-bottom:4px;">' + mk + meter + '</div>';
                        html += '<div style="margin-left:19px;font-size:12px;color:#e0e0e0;">';
                        if (d.kwh != null) html += '<span style="color:#90caf9;">Cum. KWH:</span> <strong>' + Number(d.kwh).toFixed(2) + '</strong>';
                        if (d.kvah != null) html += ' &nbsp;|&nbsp; <span style="color:#90caf9;">Cum. KVAH:</span> <strong>' + Number(d.kvah).toFixed(2) + '</strong>';
                        html += '</div></div>';
                    });
                    return html;
                }
            },
            legend: {
                data: legendData, type: 'scroll', top: 5, left: 'center', padding: [6, 12],
                backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 6, borderColor: '#ddd',
                borderWidth: 1, textStyle: { fontSize: 12, color: '#333' },
                itemWidth: 22, itemHeight: 12, itemGap: 12, icon: 'roundRect'
            },
            grid: {
                left: '8%', right: '4%', bottom: '12%',
                top: (function () { var rows = Math.ceil(legendData.length / 4); return 5 + (rows * 30) + 22; }()),
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxisLabels,
                name: 'Week No.',
                nameLocation: 'middle',
                nameGap: 30,
                nameTextStyle: { fontSize: 11, color: '#555' },
                axisLabel: { fontSize: 10, color: '#555', rotate: 30 },
                axisLine: { lineStyle: { color: '#000', width: 1.5 } },
                axisTick: { show: true, lineStyle: { color: '#000' } }
            },
            yAxis: {
                type: 'value', name: 'Cumulative KWH / KVAH', scale: true,
                nameLocation: 'middle', nameRotate: 90, nameGap: 60,
                nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#555' },
                axisLabel: { fontSize: 11, color: '#666' },
                axisLine: { show: true, lineStyle: { color: '#000', width: 2 } },
                splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } }
            },
            series: allSeries,
            dataZoom: [
                { type: 'inside', start: 0, end: 100, zoomOnMouseWheel: true, moveOnMouseMove: true },
                {
                    type: 'slider', show: true, start: 0, end: 100, height: 20, bottom: 20,
                    handleSize: '80%', handleStyle: { color: '#5470C6', borderColor: '#5470C6' },
                    textStyle: { color: '#666' }, borderColor: '#ddd'
                }
            ],
            animation: true
        };
    }
    function g2_update() {
        if (!g2ContainerId) return;
        var container = document.getElementById(g2ContainerId);
        if (!container) return;
        var myChart = echarts.getInstanceByDom(container);
        if (!myChart) return;

        if (g2SelectedMeters.size === 0) {
            myChart.setOption(g2_createChartOption([]), true);
            return;
        }

        myChart.showLoading({
            text: 'Updating chart...', color: '#5470C6', textColor: '#000',
            maskColor: 'rgba(255,255,255,0.8)', zlevel: 0
        });

        // Graph 2 shows full current month — filter by meter only
        var filteredData = g2Data.filter(function (r) { return g2SelectedMeters.has(r.meter); });
        myChart.hideLoading();
        myChart.setOption(g2_createChartOption(filteredData), true);
    }

    function g2_renderMeterFilters(meters) {
        var filterContainer = document.getElementById('meterFilterContainer');
        if (!filterContainer) return;

        filterContainer.innerHTML = '<div class="filter-label">Filter by Meter Type:</div>';

        meters.forEach(function (meter, index) {
            var color = meterColors[index % meterColors.length];
            g2MeterColorMap.set(meter, color);

            var checkbox = document.createElement('label');
            checkbox.className = 'meter-checkbox-label';
            checkbox.innerHTML =
                '<input type="checkbox" class="meter-checkbox g2-meter-checkbox" data-meter="' + meter + '" ' +
                (g2SelectedMeters.has(meter) ? 'checked' : '') + '>' +
                '<span class="checkbox-box" style="border-color:' + color + ';color:' + color + ';">' +
                '<span class="checkbox-check"></span>' +
                '</span>' +
                '<span class="checkbox-text">' + meter + '</span>';

            checkbox.querySelector('.g2-meter-checkbox').addEventListener('change', function () {
                var meterName = this.dataset.meter;
                if (this.checked) { g2SelectedMeters.add(meterName); }
                else { g2SelectedMeters.delete(meterName); }
                g2_update();
            });

            filterContainer.appendChild(checkbox);
        });
    }

    function g2_fetchAllData() {
        var allMetersParam = g2AvailableMeters.join(',');
        const TimeCategory = 'Cold';
        // API takes: TimeCategory, Meter (all meters csv), Mainmeter (first meter)
        $.ajax({
            type: 'POST',
            url: "/Energy/GetEnergyTrends_CumulativeEnergyConsumptionLive?TimeCategory=" + TimeCategory +
                "&Meter=" + encodeURIComponent(allMetersParam) +
                "&MainMeter=" + encodeURIComponent(g2MainMeter),
            success: function (result) {
                var response = (typeof result === 'string') ? JSON.parse(result) : result;
                var rows = response.Table || response || [];
                g2Data = g2_processData(rows);
                g2_update();
            },
            error: function () {
                var container = document.getElementById(g2ContainerId);
                if (container) {
                    var chart = echarts.getInstanceByDom(container);
                    if (chart) chart.setOption({
                        title: {
                            text: 'Error loading data',
                            left: 'center', top: 'center',
                            textStyle: { color: '#f44336', fontSize: 16 }
                        }
                    });
                }
            }
        });
    }

    function g2_fetchMetersAndInit() {
        $.ajax({
            type: 'POST',
            url: '/Energy/GetFilterbyMeter',
            success: function (result) {
                var response = (typeof result === 'string') ? JSON.parse(result) : result;
                var meters = response.Table || response || [];
                if (!meters.length) return;

                g2AvailableMeters = meters.map(function (m) {
                    var name = m.MeterDisplayname || m.meter || m;
                    return name.replace(/ID/gi, 'Id');
                });

                // Mainmeter = first meter returned by GetFilterbyMeter
                g2MainMeter = g2AvailableMeters[0] || '';

                g2SelectedMeters.clear();
                g2SelectedMeters.add(g2MainMeter);   // default: first meter selected

                g2_renderMeterFilters(g2AvailableMeters);
                g2_fetchAllData();
            },
            error: function () { console.error('Error fetching meters for Graph 2'); }
        });
    }

    function g2_initialize(graphContainerId) {
        g2ContainerId = graphContainerId;
        g2Data = [];
        g2AvailableMeters = [];
        g2MainMeter = '';
        g2SelectedMeters = new Set();
        g2MeterColorMap = new Map();

        var dom = document.getElementById(graphContainerId);
        if (!dom) { console.error('Graph 2: container not found:', graphContainerId); return; }

        var existing = echarts.getInstanceByDom(dom);
        if (existing) existing.dispose();
        g1401ChartInstance = null;

        var myChart = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });
        myChart.showLoading({
            text: 'Initializing...', color: '#5470C6', textColor: '#000',
            maskColor: 'rgba(255,255,255,0.8)', zlevel: 0
        });

        g2_fetchMetersAndInit();
        window.addEventListener('resize', function () { if (myChart) myChart.resize(); });
    }

    // Cumulative Energy Consumption (Live) — dynamic, meter-filtered
    _echartEnergyConsumptionColdChartDashboard[2] = function (graphContainerId) {
        console.log('📊 Graph 2 (Cumulative Energy Consumption Live) called:', graphContainerId);
        g2_initialize(graphContainerId);
    };

    //Energy Consumption with Peak Energy Consumption

    // ===========================
    // GRAPH 4: ENERGY CONSUMPTION WITH PEAK (HOURLY) - WITH METER FILTERS
    // Like Graph 1 but hourly data with morning/evening peak highlighting
    // ===========================

    let g4_energyData = [];
    let g4_availableMeters = [];
    let g4_selectedMeterIDs = new Set();
    let g4_meterColorMap = new Map();
    let g4_currentContainerId = null;

    function g4_processEnergyData(rows) {
        // COLD API returns weekly records: MeterID, WeekStart, WeekEnd, Month, Year, WeekNo, KWH, KVAH
        return rows.map(row => {
            var ws = (row.WeekStart || '').split('T')[0];
            var we = (row.WeekEnd || '').split('T')[0];
            return {
                meter: (row.MeterID || row.Meter || '').replace(/ID/gi, 'Id'),
                weekStart: ws,
                weekEnd: we,
                weekNo: row.WeekNo || '',
                month: row.Month || '',
                year: row.Year || '',
                xLabel: ws,   // primary x-axis key
                kwh: parseFloat(row.KWH) || 0,
                kvah: parseFloat(row.KVAH) || 0
            };
        });
    }

    function g4_createChartOption(filteredData) {
        console.log('🎯 Graph 401 (Cold/Weekly+Peak) createChartOption called with:', filteredData.length, 'records');

        if (g4_selectedMeterIDs.size === 0) {
            return { title: { text: 'Please select a meter', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' } } };
        }
        if (filteredData.length === 0) {
            return { title: { text: 'No data available for selected meters', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' } } };
        }

        const uniqueMeters = [...new Set(filteredData.map(r => r.meter))];

        // Weekly data: x-axis = unique weekStart dates sorted
        const allWeekStarts = [...new Set(filteredData.map(r => r.xLabel))].sort();

        // Build a map of weekStart -> weekEnd for tooltip
        var weekEndMap = {};
        filteredData.forEach(function (r) { if (!weekEndMap[r.xLabel]) weekEndMap[r.xLabel] = r.weekEnd; });

        // X-axis labels: show "Month Year" only on first week of each month, blank for rest
        const xAxisLabels = buildMonthlyXAxisLabels(allWeekStarts, filteredData, function (r) {
            return formatMonthYear(r.month, r.year);
        });

        const allSeries = [];

        uniqueMeters.forEach(meter => {
            const meterIndex = g4_availableMeters.indexOf(meter);
            const color = meterIndex >= 0 ? meterColors[meterIndex % meterColors.length] : meterColors[0];
            g4_meterColorMap.set(meter, color);

            const meterRows = filteredData.filter(r => r.meter === meter);
            const kwhData = allWeekStarts.map(ws => { const rec = meterRows.find(r => r.xLabel === ws); return rec ? rec.kwh : null; });
            const kvahData = allWeekStarts.map(ws => { const rec = meterRows.find(r => r.xLabel === ws); return rec ? rec.kvah : null; });

            // Peak week index
            let peakIdx = 0, peakKWH = -Infinity;
            kwhData.forEach((v, i) => { if (v != null && v > peakKWH) { peakKWH = v; peakIdx = i; } });
            const peakWeekStart = allWeekStarts[peakIdx] || '';
            const peakWeekEnd = weekEndMap[peakWeekStart] || '';
            const peakStart = Math.max(0, peakIdx - 1);
            const peakEnd = Math.min(allWeekStarts.length - 1, peakIdx + 1);

            allSeries.push({
                name: `${meter}_KWH`, type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
                data: kwhData, lineStyle: { width: 2, color: color }, itemStyle: { color: color },
                markPoint: {
                    symbol: 'circle', symbolSize: 10,
                    itemStyle: { color: 'red', borderColor: 'darkred', borderWidth: 2 },
                    data: [{ coord: [peakIdx, kwhData[peakIdx]], name: 'Peak Week' }]
                },
                markArea: {
                    itemStyle: { color: 'rgba(255,173,177,0.35)' },
                    label: {
                        show: true, position: 'top', fontSize: 11, color: '#c00', fontWeight: '600',
                        formatter: function () { return 'Peak Week\n' + peakWeekStart + ' – ' + peakWeekEnd; }
                    },
                    data: [[{ xAxis: peakStart }, { xAxis: peakEnd }]]
                },
                z: 3
            });
            allSeries.push({
                name: `${meter}_KVAH`, type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
                data: kvahData, lineStyle: { width: 2, color: color, opacity: 0.5 }, itemStyle: { color: color, opacity: 0.5 },
                markPoint: {
                    symbol: 'circle', symbolSize: 10,
                    itemStyle: { color: 'red', borderColor: 'darkred', borderWidth: 2 },
                    data: [{ coord: [peakIdx, kvahData[peakIdx]], name: 'Peak Week' }]
                },
                z: 2
            });
        });

        return {
            tooltip: {
                trigger: 'axis', axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
                backgroundColor: 'rgba(0,0,0,0.85)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1,
                padding: [12, 16], textStyle: { color: '#ffffff', fontSize: 12 },
                formatter: function (params) {
                    if (!params || params.length === 0) return '';
                    var ws = allWeekStarts[params[0].dataIndex] || params[0].axisValue;
                    var we = weekEndMap[ws] || '';
                    var header = we ? ws + ' – ' + we : ws;
                    let html = `<div style="font-weight:bold;margin-bottom:8px;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:4px;">Week: ${header}</div>`;
                    const byMeter = {};
                    params.forEach(p => {
                        if (p.seriesName.includes('_KWH')) { const m = p.seriesName.replace('_KWH', ''); if (!byMeter[m]) byMeter[m] = {}; byMeter[m].kwh = p.value; byMeter[m].color = p.color; }
                        else if (p.seriesName.includes('_KVAH')) { const m = p.seriesName.replace('_KVAH', ''); if (!byMeter[m]) byMeter[m] = {}; byMeter[m].kvah = p.value; }
                    });
                    Object.keys(byMeter).forEach((meter, idx) => {
                        const d = byMeter[meter];
                        const marker = `<span style="display:inline-block;width:12px;height:12px;background:${d.color};margin-right:6px;"></span>`;
                        html += idx > 0 ? `<div style="margin-top:6px;border-top:1px solid rgba(255,255,255,0.2);padding-top:5px;">` : `<div style="margin-top:4px;">`;
                        html += `<div style="font-weight:600;font-size:12px;margin-bottom:3px;">${marker}${meter}</div>`;
                        html += `<div style="margin-left:18px;font-size:11px;color:#e0e0e0;">KWH: <strong>${d.kwh != null ? Number(d.kwh).toFixed(2) : 'N/A'}</strong> | KVAH: <strong>${d.kvah != null ? Number(d.kvah).toFixed(2) : 'N/A'}</strong></div></div>`;
                    });
                    return html;
                }
            },
            grid: { left: '7%', right: '7%', bottom: '12%', top: 40, containLabel: true },
            xAxis: {
                type: 'category', boundaryGap: false, data: xAxisLabels,
                name: '', nameLocation: 'middle', nameGap: 30,
                nameTextStyle: { fontSize: 11, color: '#555' },
                axisLabel: { fontSize: 11, color: '#444', fontWeight: 600, rotate: 0, interval: 0 },
                axisLine: { lineStyle: { color: '#999', width: 1 } },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'value', name: 'KWH / KVAH', nameLocation: 'middle', nameGap: 45, nameRotate: 90,
                nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#333' },
                axisLabel: { formatter: '{value}', fontSize: 10, color: '#666' },
                axisLine: { show: true, lineStyle: { color: '#999', width: 1 } },
                splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } }
            },
            series: allSeries,
            dataZoom: [
                { type: 'inside', start: 0, end: 100, zoomOnMouseWheel: true, moveOnMouseMove: true },
                { type: 'slider', show: true, start: 0, end: 100, height: 15, bottom: 10, handleSize: '60%', handleStyle: { color: '#5470C6', borderColor: '#5470C6' }, textStyle: { color: '#666', fontSize: 9 }, borderColor: '#ddd' }
            ],
            animation: true
        };
    }

    function g4_updateChart() {
        if (!g4_currentContainerId) return;

        const container = document.getElementById(g4_currentContainerId);
        if (!container) return;

        const myChart = echarts.getInstanceByDom(container);
        if (!myChart) return;

        if (g4_selectedMeterIDs.size === 0) {
            myChart.setOption({
                title: {
                    text: 'Please select a meter',
                    left: 'center',
                    top: 'center',
                    textStyle: { color: '#999', fontSize: 18 }
                },
                xAxis: { show: false },
                yAxis: { show: false },
                series: []
            });
            return;
        }

        const filteredData = g4_energyData.filter(r => g4_selectedMeterIDs.has(r.meter));
        console.log('📊 Graph 4: Filtered data for selected meters:', filteredData.length, 'records');

        myChart.hideLoading();
        const option = g4_createChartOption(filteredData);
        myChart.setOption(option, true);
    }

    function g4_renderMeterFilters(meters) {
        const container = document.getElementById('meterFilterContainer');
        if (!container) { console.error('❌ Graph 4: meterFilterContainer not found'); return; }
        // Only render if this graph owns the container
        if (container.getAttribute('data-graph-owner') !== '401') return;

        console.log('📊 Graph 4: Rendering meter filters for:', meters);

        container.innerHTML = '<div class="filter-label">Filter by Meter Type:</div>';

        meters.forEach((meter, index) => {
            const meterIndex = g4_availableMeters.indexOf(meter);
            const color = meterIndex >= 0 ? meterColors[meterIndex % meterColors.length] : meterColors[0];
            g4_meterColorMap.set(meter, color);

            console.log(`🎨 Graph 4 Meter: ${meter}, Index: ${meterIndex}, Color: ${color}`);

            const checkbox = document.createElement('label');
            checkbox.className = 'meter-checkbox-label';
            checkbox.innerHTML = `
                <input type="checkbox" class="meter-checkbox" data-meter="${meter}" ${g4_selectedMeterIDs.has(meter) ? 'checked' : ''}>
                <span class="checkbox-box" style="border-color: ${color}; color: ${color};">
                    <span class="checkbox-check"></span>
                </span>
                <span class="checkbox-text">${meter}</span>
            `;

            checkbox.querySelector('.meter-checkbox').addEventListener('change', function () {
                const meterName = this.dataset.meter;

                if (this.checked) {
                    g4_selectedMeterIDs.add(meterName);
                    console.log('✅ Graph 4: Added meter:', meterName);
                } else {
                    g4_selectedMeterIDs.delete(meterName);
                    console.log('❌ Graph 4: Removed meter:', meterName);
                }

                console.log('📊 Graph 4: Currently selected meters:', Array.from(g4_selectedMeterIDs));
                g4_updateChart();
            });

            container.appendChild(checkbox);
        });

        console.log('✅ Graph 4: Rendered', meters.length, 'meter filter checkboxes');
    }

    function g4_fetchAllMeterData() {
        console.log('🔄 Graph 4: Fetching data for ALL meters...');

        const TimeCategory = 'Cold';
        const allMetersParam = g4_availableMeters.join(',');

        console.log('📡 Graph 4: Requesting data for meters:', allMetersParam);
        console.log('📡 Graph 4: API URL:', "/Energy/GetEnergyTrends_EnergyConsumptionPeak?TimeCategory=" + TimeCategory + "&Meter=" + encodeURIComponent(allMetersParam));

        $.ajax({
            type: "POST",
            url: "/Energy/EnergyTrends_EnergyConsumptionPeakHourlyActual?TimeCategory=" + TimeCategory + "&Meter=" + encodeURIComponent(allMetersParam),
            success: function (result) {
                const response = typeof result === "string" ? JSON.parse(result) : result;
                const rows = response.Table || response || [];

                console.log('✅ Graph 4: Fetched ALL meter data:', rows.length, 'rows');
                console.log('📊 Graph 4: Sample raw data:', rows.slice(0, 3));

                g4_energyData = g4_processEnergyData(rows);
                console.log('✅ Graph 4: Processed and stored:', g4_energyData.length, 'records');
                console.log('📊 Graph 4: Sample processed data:', g4_energyData.slice(0, 3));

                g4_updateChart();
            },
            error: function (error) {
                console.error('❌ Graph 4: Error loading data:', error);
                const container = document.getElementById(g4_currentContainerId);
                if (container) {
                    const myChart = echarts.getInstanceByDom(container);
                    if (myChart) {
                        myChart.setOption({
                            title: {
                                text: 'Error loading data',
                                left: 'center',
                                top: 'center',
                                textStyle: { color: '#f44336', fontSize: 16 }
                            }
                        });
                    }
                }
            }
        });
    }

    function g4_fetchMetersAndInitialize() {
        console.log('🔄 Graph 4: Fetching available meters...');

        $.ajax({
            type: "POST",
            url: "/Energy/GetFilterbyMeter",
            success: function (result) {
                const response = typeof result === "string" ? JSON.parse(result) : result;
                let meters = response.Table || response || [];

                console.log('✅ Graph 4: Fetched meters raw:', meters);

                const normalizedMeters = meters.map(function (m) {
                    if (typeof m === 'string') {
                        return m.replace(/ID/gi, 'Id');
                    } else if (m.MeterDisplayname) {
                        return m.MeterDisplayname.replace(/ID/gi, 'Id');
                    } else if (m.Meter) {
                        return m.Meter.replace(/ID/gi, 'Id');
                    } else if (m.meter) {
                        return m.meter.replace(/ID/gi, 'Id');
                    }
                    return m;
                });

                g4_availableMeters = [...new Set(normalizedMeters)];
                console.log('✅ Graph 4: Normalized meter names:', g4_availableMeters);

                g4_selectedMeterIDs.clear();
                if (g4_availableMeters.length > 0) {
                    g4_selectedMeterIDs.add(g4_availableMeters[0]);
                }

                console.log('📍 Graph 4: Default selected meter:', Array.from(g4_selectedMeterIDs));

                g4_renderMeterFilters(g4_availableMeters);
                g4_fetchAllMeterData();
            },
            error: function (error) {
                console.error('❌ Graph 4: Error fetching meters:', error);
            }
        });
    }

    function g4_initialize(graphContainerId) {
        console.log('🎯 Graph 4: Initializing Energy Consumption with Peak for container:', graphContainerId);

        g4_currentContainerId = graphContainerId;
        // Reset state so switching graphs always starts with first meter only
        g4_energyData = []; g4_availableMeters = []; g4_selectedMeterIDs = new Set(); g4_meterColorMap = new Map();
        // Claim filter container ownership if this is the active slide
        var sf4 = document.getElementById('meterFilterContainer');
        if (sf4 && _isActiveSlide(graphContainerId)) { sf4.innerHTML = ''; sf4.setAttribute('data-graph-owner', '401'); }
        const dom = document.getElementById(graphContainerId);

        if (!dom) {
            console.error('❌ Graph 4: Container not found:', graphContainerId);
            return;
        }

        const existingChart = echarts.getInstanceByDom(dom);
        if (existingChart) {
            existingChart.dispose();
        }

        const myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        myChart.showLoading({
            text: 'Initializing...',
            color: '#5470C6',
            textColor: '#000',
            maskColor: 'rgba(255, 255, 255, 0.8)',
            zlevel: 0
        });

        g4_fetchMetersAndInitialize();

        window.addEventListener('resize', function () {
            if (myChart) {
                myChart.resize();
            }
        });
    }

    // Graph 4: Energy Consumption with Peak Energy Consumption
    // Registered under both [4] (legacy, no-frequency path) and [401] (Hrly Actual frequency index)
    _echartEnergyConsumptionColdChartDashboard[4] = function (graphContainerId) {
        console.log('📊 Graph 4 (Energy Consumption with Peak) called with container:', graphContainerId);
        g4_initialize(graphContainerId);
    };
    _echartEnergyConsumptionColdChartDashboard[401] = function (graphContainerId) {
        console.log('📊 Graph 401 (Hourly Actual Energy Consumption with Peak) called with container:', graphContainerId);
        g4_initialize(graphContainerId);
    };

    // ===========================
    // GRAPH 402 - Hourly Average: Energy Consumption with Peak (identical to 401 but uses HourlyAverage API)
    // ===========================

    let g402_energyData = [];
    let g402_availableMeters = [];
    let g402_selectedMeterIDs = new Set();
    let g402_meterColorMap = new Map();
    let g402_currentContainerId = null;

    function g402_processEnergyData(rows) {
        // COLD API returns weekly records: MeterID, WeekStart, WeekEnd, Month, Year, WeekNo, KWH, KVAH
        return rows.map(row => ({
            meter: (row.MeterID || row.Meter || '').replace(/ID/gi, 'Id'),
            weekStart: (row.WeekStart || '').split('T')[0],
            weekEnd: (row.WeekEnd || '').split('T')[0],
            weekNo: row.WeekNo || '',
            month: row.Month || '',
            year: row.Year || '',
            xLabel: (row.WeekStart || '').split('T')[0],
            kwh: parseFloat(row.KWH) || 0,
            kvah: parseFloat(row.KVAH) || 0
        }));
    }

    function g402_createChartOption(filteredData) {
        if (g402_selectedMeterIDs.size === 0) {
            return { title: { text: 'Please select a meter', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' } } };
        }
        if (filteredData.length === 0) {
            return { title: { text: 'No data available for selected meters', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' } } };
        }

        const uniqueMeters = [...new Set(filteredData.map(r => r.meter))];
        const allWeekStarts = [...new Set(filteredData.map(r => r.xLabel))].sort();
        var weekEndMap = {};
        filteredData.forEach(function (r) { if (!weekEndMap[r.xLabel]) weekEndMap[r.xLabel] = r.weekEnd; });
        // X-axis: show "Month Year" only on first week of each month
        const xAxisLabels = buildMonthlyXAxisLabels(allWeekStarts, filteredData, function (r) {
            return formatMonthYear(r.month, r.year);
        });

        const allSeries = [];
        uniqueMeters.forEach((meter) => {
            const meterIndex = g402_availableMeters.indexOf(meter);
            const color = meterIndex >= 0 ? meterColors[meterIndex % meterColors.length] : meterColors[0];
            g402_meterColorMap.set(meter, color);

            const meterRows = filteredData.filter(r => r.meter === meter);
            const kwhData = allWeekStarts.map(ws => { const rec = meterRows.find(r => r.xLabel === ws); return rec ? rec.kwh : null; });
            const kvahData = allWeekStarts.map(ws => { const rec = meterRows.find(r => r.xLabel === ws); return rec ? rec.kvah : null; });

            let peakDayIdx = 0, peakKWH = -Infinity;
            kwhData.forEach((v, i) => { if (v != null && v > peakKWH) { peakKWH = v; peakDayIdx = i; } });
            const peakWeekStart = allWeekStarts[peakDayIdx] || '';
            const peakWeekEnd = weekEndMap[peakWeekStart] || '';
            const peakStart = Math.max(0, peakDayIdx - 1);
            const peakEnd = Math.min(allWeekStarts.length - 1, peakDayIdx + 1);

            allSeries.push({
                name: `${meter}_KWH`, type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
                data: kwhData, lineStyle: { width: 2, color: color }, itemStyle: { color: color },
                markPoint: {
                    symbol: 'circle', symbolSize: 10, itemStyle: { color: 'red', borderColor: 'darkred', borderWidth: 2 },
                    data: [{ coord: [peakDayIdx, kwhData[peakDayIdx]], name: 'Peak Week' }]
                },
                markArea: {
                    itemStyle: { color: 'rgba(255,173,177,0.35)' },
                    label: {
                        show: true, position: 'top', fontSize: 11, color: '#c00', fontWeight: '600',
                        formatter: function () { return 'Peak Week\n' + peakWeekStart + ' – ' + peakWeekEnd; }
                    },
                    data: [[{ xAxis: peakStart }, { xAxis: peakEnd }]]
                },
                z: 3
            });
            allSeries.push({
                name: `${meter}_KVAH`, type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
                data: kvahData, lineStyle: { width: 2, color: color, opacity: 0.5 }, itemStyle: { color: color, opacity: 0.5 },
                markPoint: {
                    symbol: 'circle', symbolSize: 10, itemStyle: { color: 'red', borderColor: 'darkred', borderWidth: 2 },
                    data: [{ coord: [peakDayIdx, kvahData[peakDayIdx]], name: 'Peak Week' }]
                },
                z: 2
            });
        });

        return {
            tooltip: {
                trigger: 'axis', axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
                backgroundColor: 'rgba(0,0,0,0.85)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1, padding: [12, 16],
                textStyle: { color: '#ffffff', fontSize: 12 },
                formatter: function (params) {
                    if (!params || params.length === 0) return '';
                    var ws = allWeekStarts[params[0].dataIndex] || params[0].axisValue;
                    var we = weekEndMap[ws] || '';
                    var header = we ? ws + ' – ' + we : ws;
                    let html = `<div style="font-weight:bold;margin-bottom:8px;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:4px;">Week: ${header}</div>`;
                    const byMeter = {};
                    params.forEach(p => {
                        if (p.seriesName.includes('_KWH')) { const m = p.seriesName.replace('_KWH', ''); if (!byMeter[m]) byMeter[m] = {}; byMeter[m].kwh = p.value; byMeter[m].color = p.color; }
                        else if (p.seriesName.includes('_KVAH')) { const m = p.seriesName.replace('_KVAH', ''); if (!byMeter[m]) byMeter[m] = {}; byMeter[m].kvah = p.value; }
                    });
                    Object.keys(byMeter).forEach((meter, idx) => {
                        const d = byMeter[meter];
                        const marker = `<span style="display:inline-block;width:12px;height:12px;background:${d.color};margin-right:6px;"></span>`;
                        html += idx > 0 ? `<div style="margin-top:6px;border-top:1px solid rgba(255,255,255,0.2);padding-top:5px;">` : `<div style="margin-top:4px;">`;
                        html += `<div style="font-weight:600;font-size:12px;margin-bottom:3px;">${marker}${meter}</div>`;
                        html += `<div style="margin-left:18px;font-size:11px;color:#e0e0e0;">KWH: <strong>${d.kwh != null ? Number(d.kwh).toFixed(2) : 'N/A'}</strong> | KVAH: <strong>${d.kvah != null ? Number(d.kvah).toFixed(2) : 'N/A'}</strong></div></div>`;
                    });
                    return html;
                }
            },
            grid: { left: '7%', right: '7%', bottom: '12%', top: 40, containLabel: true },
            xAxis: {
                type: 'category', boundaryGap: false, data: xAxisLabels,
                name: '', nameLocation: 'middle', nameGap: 30,
                nameTextStyle: { fontSize: 11, color: '#555' },
                axisLabel: { fontSize: 11, color: '#444', fontWeight: 600, rotate: 0, interval: 0 },
                axisLine: { lineStyle: { color: '#999', width: 1 } },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'value', name: 'KWH / KVAH', nameLocation: 'middle', nameGap: 45, nameRotate: 90,
                nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#333' },
                axisLabel: { formatter: '{value}', fontSize: 10, color: '#666' },
                axisLine: { show: true, lineStyle: { color: '#999', width: 1 } },
                splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } }
            },
            series: allSeries,
            dataZoom: [
                { type: 'inside', start: 0, end: 100, zoomOnMouseWheel: true, moveOnMouseMove: true },
                { type: 'slider', show: true, start: 0, end: 100, height: 15, bottom: 10, handleSize: '60%', handleStyle: { color: '#5470C6', borderColor: '#5470C6' }, textStyle: { color: '#666', fontSize: 9 }, borderColor: '#ddd' }
            ],
            animation: true
        };
    }
    function g402_updateChart() {
        if (!g402_currentContainerId) return;
        const container = document.getElementById(g402_currentContainerId);
        if (!container) return;
        const myChart = echarts.getInstanceByDom(container);
        if (!myChart) return;
        if (g402_selectedMeterIDs.size === 0) { myChart.setOption(g402_createChartOption([]), true); return; }
        myChart.showLoading({ text: 'Updating chart...', color: '#5470C6', textColor: '#000', maskColor: 'rgba(255, 255, 255, 0.8)', zlevel: 0 });
        const filteredData = g402_energyData.filter(r => g402_selectedMeterIDs.has(r.meter));
        myChart.hideLoading();
        myChart.setOption(g402_createChartOption(filteredData), true);
    }

    function g402_renderMeterFilters(meters) {
        const filterContainer = document.getElementById('meterFilterContainer');
        if (!filterContainer) return;
        // Only render if this graph owns the container
        if (filterContainer.getAttribute('data-graph-owner') !== '402') return;
        filterContainer.innerHTML = '<div class="filter-label">Filter by Meter Type:</div>';
        meters.forEach((meter, index) => {
            const color = meterColors[index % meterColors.length];
            g402_meterColorMap.set(meter, color);
            const checkbox = document.createElement('label');
            checkbox.className = 'meter-checkbox-label';
            checkbox.innerHTML = `<input type="checkbox" class="meter-checkbox" data-meter="${meter}" ${g402_selectedMeterIDs.has(meter) ? 'checked' : ''}><span class="checkbox-box" style="border-color:${color};color:${color};"><span class="checkbox-check"></span></span><span class="checkbox-text">${meter}</span>`;
            checkbox.querySelector('.meter-checkbox').addEventListener('change', function () {
                const meterName = this.dataset.meter;
                if (this.checked) { g402_selectedMeterIDs.add(meterName); } else { g402_selectedMeterIDs.delete(meterName); }
                g402_updateChart();
            });
            filterContainer.appendChild(checkbox);
        });
    }

    function g402_fetchAllMeterData() {
        const TimeCategory = 'Cold';
        const allMetersParam = g402_availableMeters.join(',');
        $.ajax({
            type: 'POST',
            url: '/Energy/EnergyTrends_EnergyConsumptionPeakHourlyAverage?TimeCategory=' + TimeCategory + '&Meter=' + encodeURIComponent(allMetersParam),
            success: function (result) {
                const response = typeof result === 'string' ? JSON.parse(result) : result;
                const rows = response.Table || response || [];
                g402_energyData = g402_processEnergyData(rows);
                g402_updateChart();
            },
            error: function (error) {
                console.error('❌ Graph 402: Error loading data:', error);
                const container = document.getElementById(g402_currentContainerId);
                if (container) { const myChart = echarts.getInstanceByDom(container); if (myChart) myChart.setOption({ title: { text: 'Error loading data', left: 'center', top: 'center', textStyle: { color: '#f44336', fontSize: 16 } } }); }
            }
        });
    }

    function g402_fetchMetersAndInitialize() {
        $.ajax({
            type: 'POST',
            url: '/Energy/GetFilterbyMeter',
            success: function (result) {
                const response = typeof result === 'string' ? JSON.parse(result) : result;
                const meters = response.Table || response || [];
                const normalizedMeters = meters.map(function (m) {
                    if (typeof m === 'string') return m.replace(/ID/gi, 'Id');
                    else if (m.MeterDisplayname) return m.MeterDisplayname.replace(/ID/gi, 'Id');
                    else if (m.Meter) return m.Meter.replace(/ID/gi, 'Id');
                    else if (m.meter) return m.meter.replace(/ID/gi, 'Id');
                    return m;
                });
                g402_availableMeters = [...new Set(normalizedMeters)];
                g402_selectedMeterIDs.clear();
                if (g402_availableMeters.length > 0) { g402_selectedMeterIDs.add(g402_availableMeters[0]); }
                g402_renderMeterFilters(g402_availableMeters);
                g402_fetchAllMeterData();
            },
            error: function () { console.error('❌ Graph 402: Error fetching meters'); }
        });
    }

    function g402_initialize(graphContainerId) {
        console.log('🎯 Graph 402: Initializing for container:', graphContainerId);
        g402_currentContainerId = graphContainerId;
        g402_energyData = []; g402_availableMeters = []; g402_selectedMeterIDs = new Set(); g402_meterColorMap = new Map();
        // Claim filter container ownership if this is the active slide
        var sf402 = document.getElementById('meterFilterContainer');
        if (sf402 && _isActiveSlide(graphContainerId)) { sf402.innerHTML = ''; sf402.setAttribute('data-graph-owner', '402'); }
        const dom = document.getElementById(graphContainerId);
        if (!dom) { console.error('❌ Graph 402: Container not found:', graphContainerId); return; }
        const existingChart = echarts.getInstanceByDom(dom);
        if (existingChart) { existingChart.dispose(); }
        const myChart = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });
        myChart.showLoading({ text: 'Initializing...', color: '#5470C6', textColor: '#000', maskColor: 'rgba(255, 255, 255, 0.8)', zlevel: 0 });
        g402_fetchMetersAndInitialize();
        window.addEventListener('resize', function () { if (myChart) myChart.resize(); });
    }

    _echartEnergyConsumptionColdChartDashboard[402] = function (graphContainerId) {
        console.log('📊 Graph 402 (Hourly Average Energy Consumption with Peak) called with container:', graphContainerId);
        g402_initialize(graphContainerId);
    };

    //Energy Consumption vs Rated Energy Consumption
    _echartEnergyConsumptionColdChartDashboard[5] = function (graphContainerId) {
        var dom = document.getElementById(graphContainerId);
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        const posList = [
            'left',
            'right',
            'top',
            'bottom',
            'inside',
            'insideTop',
            'insideLeft',
            'insideRight',
            'insideBottom',
            'insideTopLeft',
            'insideTopRight',
            'insideBottomLeft',
            'insideBottomRight'
        ];
        app.configParameters = {
            rotate: {
                min: -90,
                max: 90
            },
            align: {
                options: {
                    left: 'left',
                    center: 'center',
                    right: 'right'
                }
            },
            verticalAlign: {
                options: {
                    top: 'top',
                    middle: 'middle',
                    bottom: 'bottom'
                }
            },
            position: {
                options: posList.reduce(function (map, pos) {
                    map[pos] = pos;
                    return map;
                }, {})
            },
            distance: {
                min: 0,
                max: 100
            }
        };
        app.config = {
            rotate: 90,
            align: 'left',
            verticalAlign: 'middle',
            position: 'insideBottom',
            distance: 15,
            onChange: function () {
                const labelOption = {
                    rotate: app.config.rotate,
                    align: app.config.align,
                    verticalAlign: app.config.verticalAlign,
                    position: app.config.position,
                    distance: app.config.distance
                };
                myChart.setOption({
                    series: [
                        {
                            label: labelOption
                        },
                        {
                            label: labelOption
                        },
                        {
                            label: labelOption
                        },
                        {
                            label: labelOption
                        }
                    ]
                });
            }
        };
        const labelOption = {
            show: true,
            position: app.config.position,
            distance: app.config.distance,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            rotate: app.config.rotate,
            formatter: '{c}  {name|{a}}',
            fontSize: 16,
            rich: {
                name: {}
            }
        };
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['Forest', 'Steppe', 'Desert', 'Wetland']
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar', 'stack'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: { show: false },
                    data: ['2012', '2013', '2014', '2015', '2016']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Forest',
                    type: 'bar',
                    barGap: 0,
                    label: labelOption,
                    emphasis: {
                        focus: 'series'
                    },
                    data: [320, 332, 301, 334, 390]
                },
                {
                    name: 'Steppe',
                    type: 'bar',
                    label: labelOption,
                    emphasis: {
                        focus: 'series'
                    },
                    data: [220, 182, 191, 234, 290]
                },
                {
                    name: 'Desert',
                    type: 'bar',
                    label: labelOption,
                    emphasis: {
                        focus: 'series'
                    },
                    data: [150, 232, 201, 154, 190]
                },
                {
                    name: 'Wetland',
                    type: 'bar',
                    label: labelOption,
                    emphasis: {
                        focus: 'series'
                    },
                    data: [98, 77, 101, 99, 40]
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);

    }
    //Hrly Actual Energy Consumption - KWH vs KVAH
    // ===================================================================
    // GRAPH 601 - Hrly Actual: Energy Consumption KWH vs KVAH (Bar chart, no temperature)
    // Dynamic version: uses GetFilterbyMeter + GetEnergyTrends_EnergyConsumptionKWHKVAHHourlyActual
    // Bars for KWH (full opacity) and KVAH (reduced opacity), meter filter, hours 0-to-1, 1-to-2 on x-axis
    // ===================================================================

    var g601ContainerId = null;
    var g601Data = [];
    var g601AvailableMeters = [];
    var g601SelectedMeters = new Set();
    var g601MeterColorMap = new Map();

    function g601_getMeterColor(index) {
        return meterColors[index % meterColors.length];
    }

    function g601_processData(rows) {
        // COLD API: MeterID, WeekStart, WeekEnd, Month, Year, WeekNo, KWH, KVAH
        return rows.map(function (row) {
            var rawMeter = row.MeterID || row.Meter || row.meter || '';
            var ws = (row.WeekStart || '').split('T')[0];
            return {
                weekStart: ws,
                weekEnd: (row.WeekEnd || '').split('T')[0],
                weekNo: row.WeekNo || '',
                month: row.Month || '',
                year: row.Year || '',
                xLabel: ws,
                meter: rawMeter.replace(/ID/gi, 'Id'),
                kwh: parseFloat(row.KWH) || 0,
                kvah: parseFloat(row.KVAH) || 0
            };
        });
    }

    function g601_createChartOption(filteredData) {
        if (g601SelectedMeters.size === 0) {
            return { title: { text: 'Please select a meter', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' } } };
        }
        if (filteredData.length === 0) {
            return { title: { text: 'No data available for selected meters', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' } } };
        }

        var sortedData = filteredData.slice().sort(function (a, b) {
            return a.weekStart < b.weekStart ? -1 : a.weekStart > b.weekStart ? 1 : 0;
        });

        var seenWeeks = {}, allWeekStarts = [];
        sortedData.forEach(function (r) {
            if (!seenWeeks[r.xLabel]) { seenWeeks[r.xLabel] = true; allWeekStarts.push(r.xLabel); }
        });

        // Build weekEnd lookup map for tooltip
        var weekEndMap = {};
        sortedData.forEach(function (r) { if (!weekEndMap[r.xLabel]) weekEndMap[r.xLabel] = r.weekEnd; });

        // X-axis: "Month Year" label only on first week of that month
        var xAxisLabels = buildMonthlyXAxisLabels(allWeekStarts, sortedData, function (r) {
            return formatMonthYear(r.month, r.year);
        });

        var uniqueMeters = [], meterSeen = {};
        sortedData.forEach(function (r) {
            if (!meterSeen[r.meter]) { meterSeen[r.meter] = true; uniqueMeters.push(r.meter); }
        });

        var kwhSeries = uniqueMeters.map(function (meter) {
            var meterIndex = g601AvailableMeters.indexOf(meter);
            var color = g601_getMeterColor(meterIndex >= 0 ? meterIndex : 0);
            g601MeterColorMap.set(meter, color);
            var barData = allWeekStarts.map(function (ws) {
                var rec = sortedData.find(function (r) { return r.meter === meter && r.xLabel === ws; });
                return rec ? rec.kwh : null;
            });
            return { name: meter + ' KWH', type: 'bar', barMaxWidth: 18, itemStyle: { color: color, opacity: 1 }, data: barData, z: 3 };
        });

        var kvahSeries = uniqueMeters.map(function (meter) {
            var color = g601MeterColorMap.get(meter) || meterColors[0];
            var barData = allWeekStarts.map(function (ws) {
                var rec = sortedData.find(function (r) { return r.meter === meter && r.xLabel === ws; });
                return rec ? rec.kvah : null;
            });
            return { name: meter + ' KVAH', type: 'bar', barMaxWidth: 18, itemStyle: { color: color, opacity: 0.5 }, data: barData, z: 2 };
        });

        var allSeries = kwhSeries.concat(kvahSeries);
        var legendData = [];
        uniqueMeters.forEach(function (m) { legendData.push(m + ' KWH'); legendData.push(m + ' KVAH'); });

        return {
            tooltip: {
                trigger: 'axis', axisPointer: { type: 'shadow' },
                backgroundColor: 'rgba(0,0,0,0.85)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1, padding: [12, 16],
                textStyle: { color: '#fff', fontSize: 12 },
                formatter: function (params) {
                    if (!params || params.length === 0) return '';
                    var ws = allWeekStarts[params[0].dataIndex] || params[0].axisValue;
                    var we = weekEndMap[ws] || '';
                    var header = we ? ws + ' – ' + we : ws;
                    var html = '<div style="font-weight:bold;margin-bottom:8px;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:4px;">Week: ' + header + '</div>';
                    var meterData = {};
                    params.forEach(function (p) {
                        var kwhMatch = p.seriesName.match(/^(.+) KWH$/);
                        var kvahMatch = p.seriesName.match(/^(.+) KVAH$/);
                        if (kwhMatch) { var m = kwhMatch[1]; if (!meterData[m]) meterData[m] = {}; meterData[m].kwh = p.value; meterData[m].color = p.color; }
                        else if (kvahMatch) { var m2 = kvahMatch[1]; if (!meterData[m2]) meterData[m2] = {}; meterData[m2].kvah = p.value; }
                    });
                    Object.keys(meterData).forEach(function (meter) {
                        var d = meterData[meter];
                        var mk = '<span style="display:inline-block;width:12px;height:12px;background:' + (d.color || '#999') + ';border-radius:2px;margin-right:7px;"></span>';
                        html += '<div style="margin:7px 0;"><div style="font-weight:600;color:#fff;margin-bottom:4px;">' + mk + meter + '</div>';
                        html += '<div style="margin-left:19px;font-size:12px;color:#e0e0e0;">';
                        if (d.kwh != null) html += '<span style="color:#90caf9;">KWH:</span> <strong>' + d.kwh.toFixed(3) + '</strong>';
                        if (d.kvah != null) html += ' &nbsp;|&nbsp; <span style="color:#90caf9;">KVAH:</span> <strong>' + d.kvah.toFixed(3) + '</strong>';
                        html += '</div></div>';
                    });
                    return html;
                }
            },
            legend: { data: legendData, type: 'scroll', top: 5, left: 'center', padding: [6, 12], backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 6, borderColor: '#ddd', borderWidth: 1, textStyle: { fontSize: 12, color: '#333' }, itemWidth: 22, itemHeight: 12, itemGap: 12, icon: 'roundRect' },
            grid: { left: '6%', right: '4%', bottom: '12%', top: (function () { var rows = Math.ceil(legendData.length / 4); return 5 + (rows * 30) + 22; }()), containLabel: true },
            xAxis: {
                type: 'category', data: xAxisLabels,
                name: '', nameLocation: 'middle', nameGap: 30, nameTextStyle: { fontSize: 11, color: '#555' },
                axisLabel: { show: true, fontSize: 11, color: '#444', fontWeight: 600, rotate: 0, interval: 0 },
                axisLine: { lineStyle: { color: '#000', width: 1.5 } }, axisTick: { show: false }, axisPointer: { type: 'shadow' }
            },
            yAxis: { type: 'value', name: 'KWH / KVAH', nameLocation: 'middle', nameRotate: 90, nameGap: 50, nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#555' }, axisLabel: { fontSize: 11, color: '#666' }, axisLine: { show: true, lineStyle: { color: '#000', width: 1.5 } }, splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } } },
            series: allSeries,
            dataZoom: [
                { type: 'inside', start: 0, end: 100, zoomOnMouseWheel: true, moveOnMouseMove: true },
                { type: 'slider', show: true, start: 0, end: 100, height: 20, bottom: 20, handleSize: '80%', handleStyle: { color: '#5470C6', borderColor: '#5470C6' }, textStyle: { color: '#666' }, borderColor: '#ddd' }
            ]
        };
    }

    function g601_update() {
        if (!g601ContainerId) return;
        var container = document.getElementById(g601ContainerId);
        if (!container) return;
        var myChart = echarts.getInstanceByDom(container);
        if (!myChart) return;

        if (g601SelectedMeters.size === 0) {
            myChart.setOption(g601_createChartOption([]), true);
            return;
        }

        myChart.showLoading({
            text: 'Updating chart...', color: '#5470C6', textColor: '#000',
            maskColor: 'rgba(255,255,255,0.8)', zlevel: 0
        });

        var filteredData = g601Data.filter(function (r) { return g601SelectedMeters.has(r.meter); });
        myChart.hideLoading();
        myChart.setOption(g601_createChartOption(filteredData), true);
    }

    function g601_renderMeterFilters(meters) {
        var filterContainer = document.getElementById('meterFilterContainer');
        if (!filterContainer) return;
        // Only render if this graph currently owns the container (set during initialize)
        if (filterContainer.getAttribute('data-graph-owner') !== '601') return;

        filterContainer.innerHTML = '<div class="filter-label">Filter by Meter Type:</div>';

        meters.forEach(function (meter, index) {
            var color = g601_getMeterColor(index);
            g601MeterColorMap.set(meter, color);

            var checkbox = document.createElement('label');
            checkbox.className = 'meter-checkbox-label';
            checkbox.innerHTML =
                '<input type="checkbox" class="meter-checkbox" data-meter="' + meter + '" ' + (g601SelectedMeters.has(meter) ? 'checked' : '') + '>' +
                '<span class="checkbox-box" style="border-color:' + color + ';color:' + color + ';">' +
                '<span class="checkbox-check"></span>' +
                '</span>' +
                '<span class="checkbox-text">' + meter + '</span>';

            checkbox.querySelector('.meter-checkbox').addEventListener('change', function () {
                var meterName = this.dataset.meter;
                if (this.checked) {
                    g601SelectedMeters.add(meterName);
                } else {
                    g601SelectedMeters.delete(meterName);
                }
                g601_update();
            });

            filterContainer.appendChild(checkbox);
        });
    }

    function g601_fetchAllData() {
        var TimeCategory = 'Cold';
        var allMetersParam = g601AvailableMeters.join(',');

        $.ajax({
            type: 'POST',
            url: '/Energy/EnergyTrends_EnergyConsumptionHourlyActual?TimeCategory=' + TimeCategory + '&Meter=' + encodeURIComponent(allMetersParam),
            success: function (result) {
                var response = (typeof result === 'string') ? JSON.parse(result) : result;
                var rows = response.Table || response || [];
                g601Data = g601_processData(rows);
                g601_update();
            },
            error: function () {
                var container = document.getElementById(g601ContainerId);
                if (container) {
                    var chart = echarts.getInstanceByDom(container);
                    if (chart) chart.setOption({
                        title: {
                            text: 'Error loading data', left: 'center', top: 'center',
                            textStyle: { color: '#f44336', fontSize: 16 }
                        }
                    });
                }
            }
        });
    }

    function g601_fetchMetersAndInit() {
        $.ajax({
            type: 'POST',
            url: '/Energy/GetFilterbyMeter',
            success: function (result) {
                var response = (typeof result === 'string') ? JSON.parse(result) : result;
                var meters = response.Table || response || [];
                if (!meters.length) return;

                g601AvailableMeters = meters.map(function (m) {
                    var name = m.MeterDisplayname || m.MeterID || m.Meter || m.meter || m;
                    return (typeof name === 'string' ? name : String(name)).replace(/ID/gi, 'Id');
                });

                g601SelectedMeters.clear();
                if (g601AvailableMeters.length > 0) {
                    g601SelectedMeters.add(g601AvailableMeters[0]);
                }

                g601_renderMeterFilters(g601AvailableMeters);
                g601_fetchAllData();
            },
            error: function () {
                console.error('Error fetching meters for Graph 601');
            }
        });
    }

    function g601_initialize(graphContainerId) {
        g601ContainerId = graphContainerId;
        g601Data = [];
        g601AvailableMeters = [];
        g601SelectedMeters = new Set();
        g601MeterColorMap = new Map();

        // Only claim the shared filter container if THIS graph's slide is the active one.
        var sharedFilter601 = document.getElementById('meterFilterContainer');
        if (sharedFilter601 && _isActiveSlide(graphContainerId)) { sharedFilter601.innerHTML = ''; sharedFilter601.setAttribute('data-graph-owner', '601'); }

        var dom = document.getElementById(graphContainerId);
        if (!dom) { console.error('Graph 601: container not found:', graphContainerId); return; }

        var existing = echarts.getInstanceByDom(dom);
        if (existing) existing.dispose();

        var myChart = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });
        myChart.showLoading({
            text: 'Initializing...', color: '#5470C6', textColor: '#000',
            maskColor: 'rgba(255,255,255,0.8)', zlevel: 0
        });

        g601_fetchMetersAndInit();

        window.addEventListener('resize', function () { if (myChart) myChart.resize(); });
    }

    //Hrly Actual Energy Consumption - KWH vs KVAH (dynamic bar chart with meter filter)
    _echartEnergyConsumptionColdChartDashboard[601] = function (graphContainerId) {
        console.log('Graph 601 (Hrly Actual KWH vs KVAH - Bar Chart) called:', graphContainerId);
        g601_initialize(graphContainerId);
    };

    // ===================================================================
    // GRAPH 602 - Hrly Average: Energy Consumption KWH vs KVAH (dynamic, identical to 601 but uses HourlyAverage API)
    // ===================================================================

    var g602ContainerId = null;
    var g602Data = [];
    var g602AvailableMeters = [];
    var g602SelectedMeters = new Set();
    var g602MeterColorMap = new Map();

    function g602_getMeterColor(index) {
        return meterColors[index % meterColors.length];
    }

    function g602_processData(rows) {
        // COLD API: MeterID, WeekStart, WeekEnd, Month, Year, WeekNo, KWH, KVAH
        return rows.map(function (row) {
            var rawMeter = row.MeterID || row.Meter || row.meter || '';
            var ws = (row.WeekStart || '').split('T')[0];
            return {
                weekStart: ws,
                weekEnd: (row.WeekEnd || '').split('T')[0],
                weekNo: row.WeekNo || '',
                month: row.Month || '',
                year: row.Year || '',
                xLabel: ws,
                meter: rawMeter.replace(/ID/gi, 'Id'),
                kwh: parseFloat(row.KWH) || 0,
                kvah: parseFloat(row.KVAH) || 0
            };
        });
    }

    function g602_createChartOption(filteredData) {
        if (g602SelectedMeters.size === 0) {
            return { title: { text: 'Please select a meter', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' } } };
        }
        if (filteredData.length === 0) {
            return { title: { text: 'No data available for selected meters', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' } } };
        }

        var sortedData = filteredData.slice().sort(function (a, b) {
            return a.weekStart < b.weekStart ? -1 : a.weekStart > b.weekStart ? 1 : 0;
        });

        var seenWeeks = {}, allWeekStarts = [];
        sortedData.forEach(function (r) { if (!seenWeeks[r.xLabel]) { seenWeeks[r.xLabel] = true; allWeekStarts.push(r.xLabel); } });

        var weekEndMap = {};
        sortedData.forEach(function (r) { if (!weekEndMap[r.xLabel]) weekEndMap[r.xLabel] = r.weekEnd; });

        // X-axis: "Month Year" label only on first week of that month
        var xAxisLabels = buildMonthlyXAxisLabels(allWeekStarts, sortedData, function (r) {
            return formatMonthYear(r.month, r.year);
        });

        var uniqueMeters = [], meterSeen = {};
        sortedData.forEach(function (r) { if (!meterSeen[r.meter]) { meterSeen[r.meter] = true; uniqueMeters.push(r.meter); } });

        var kwhSeries = uniqueMeters.map(function (meter) {
            var meterIndex = g602AvailableMeters.indexOf(meter);
            var color = g602_getMeterColor(meterIndex >= 0 ? meterIndex : 0);
            g602MeterColorMap.set(meter, color);
            var barData = allWeekStarts.map(function (ws) {
                var rec = sortedData.find(function (r) { return r.meter === meter && r.xLabel === ws; });
                return rec ? rec.kwh : null;
            });
            return { name: meter + ' KWH', type: 'bar', barMaxWidth: 18, itemStyle: { color: color, opacity: 1 }, data: barData, z: 3 };
        });

        var kvahSeries = uniqueMeters.map(function (meter) {
            var color = g602MeterColorMap.get(meter) || meterColors[0];
            var barData = allWeekStarts.map(function (ws) {
                var rec = sortedData.find(function (r) { return r.meter === meter && r.xLabel === ws; });
                return rec ? rec.kvah : null;
            });
            return { name: meter + ' KVAH', type: 'bar', barMaxWidth: 18, itemStyle: { color: color, opacity: 0.5 }, data: barData, z: 2 };
        });

        var allSeries = kwhSeries.concat(kvahSeries);
        var legendData = [];
        uniqueMeters.forEach(function (m) { legendData.push(m + ' KWH'); legendData.push(m + ' KVAH'); });

        return {
            tooltip: {
                trigger: 'axis', axisPointer: { type: 'shadow' },
                backgroundColor: 'rgba(0,0,0,0.85)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1, padding: [12, 16],
                textStyle: { color: '#fff', fontSize: 12 },
                formatter: function (params) {
                    if (!params || params.length === 0) return '';
                    var ws = allWeekStarts[params[0].dataIndex] || params[0].axisValue;
                    var we = weekEndMap[ws] || '';
                    var header = we ? ws + ' – ' + we : ws;
                    var html = '<div style="font-weight:bold;margin-bottom:8px;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:4px;">Week: ' + header + '</div>';
                    var meterData = {};
                    params.forEach(function (p) {
                        var kwhMatch = p.seriesName.match(/^(.+) KWH$/);
                        var kvahMatch = p.seriesName.match(/^(.+) KVAH$/);
                        if (kwhMatch) { var m = kwhMatch[1]; if (!meterData[m]) meterData[m] = {}; meterData[m].kwh = p.value; meterData[m].color = p.color; }
                        else if (kvahMatch) { var m2 = kvahMatch[1]; if (!meterData[m2]) meterData[m2] = {}; meterData[m2].kvah = p.value; }
                    });
                    Object.keys(meterData).forEach(function (meter) {
                        var d = meterData[meter];
                        var mk = '<span style="display:inline-block;width:12px;height:12px;background:' + (d.color || '#999') + ';border-radius:2px;margin-right:7px;"></span>';
                        html += '<div style="margin:7px 0;"><div style="font-weight:600;color:#fff;margin-bottom:4px;">' + mk + meter + '</div>';
                        html += '<div style="margin-left:19px;font-size:12px;color:#e0e0e0;">';
                        if (d.kwh != null) html += '<span style="color:#90caf9;">KWH:</span> <strong>' + d.kwh.toFixed(3) + '</strong>';
                        if (d.kvah != null) html += ' &nbsp;|&nbsp; <span style="color:#90caf9;">KVAH:</span> <strong>' + d.kvah.toFixed(3) + '</strong>';
                        html += '</div></div>';
                    });
                    return html;
                }
            },
            legend: { data: legendData, type: 'scroll', top: 5, left: 'center', padding: [6, 12], backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 6, borderColor: '#ddd', borderWidth: 1, textStyle: { fontSize: 12, color: '#333' }, itemWidth: 22, itemHeight: 12, itemGap: 12, icon: 'roundRect' },
            grid: { left: '6%', right: '4%', bottom: '12%', top: (function () { var rows = Math.ceil(legendData.length / 4); return 5 + (rows * 30) + 22; }()), containLabel: true },
            xAxis: {
                type: 'category', data: xAxisLabels,
                name: '', nameLocation: 'middle', nameGap: 30, nameTextStyle: { fontSize: 11, color: '#555' },
                axisLabel: { show: true, fontSize: 11, color: '#444', fontWeight: 600, rotate: 0, interval: 0 }, axisLine: { lineStyle: { color: '#000', width: 1.5 } }, axisTick: { show: false }, axisPointer: { type: 'shadow' }
            },
            yAxis: { type: 'value', name: 'KWH / KVAH', nameLocation: 'middle', nameRotate: 90, nameGap: 50, nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#555' }, axisLabel: { fontSize: 11, color: '#666' }, axisLine: { show: true, lineStyle: { color: '#000', width: 1.5 } }, splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } } },
            series: allSeries,
            dataZoom: [
                { type: 'inside', start: 0, end: 100, zoomOnMouseWheel: true, moveOnMouseMove: true },
                { type: 'slider', show: true, start: 0, end: 100, height: 20, bottom: 20, handleSize: '80%', handleStyle: { color: '#5470C6', borderColor: '#5470C6' }, textStyle: { color: '#666' }, borderColor: '#ddd' }
            ]
        };
    }

    function g602_update() {
        if (!g602ContainerId) return;
        var container = document.getElementById(g602ContainerId);
        if (!container) return;
        var myChart = echarts.getInstanceByDom(container);
        if (!myChart) return;
        if (g602SelectedMeters.size === 0) { myChart.setOption(g602_createChartOption([]), true); return; }
        myChart.showLoading({ text: 'Updating chart...', color: '#5470C6', textColor: '#000', maskColor: 'rgba(255,255,255,0.8)', zlevel: 0 });
        var filteredData = g602Data.filter(function (r) { return g602SelectedMeters.has(r.meter); });
        myChart.hideLoading();
        myChart.setOption(g602_createChartOption(filteredData), true);
    }

    function g602_renderMeterFilters(meters) {
        var filterContainer = document.getElementById('meterFilterContainer');
        if (!filterContainer) return;
        // Only render if this graph currently owns the container (set during initialize)
        if (filterContainer.getAttribute('data-graph-owner') !== '602') return;
        filterContainer.innerHTML = '<div class="filter-label">Filter by Meter Type:</div>';
        meters.forEach(function (meter, index) {
            var color = g602_getMeterColor(index);
            g602MeterColorMap.set(meter, color);
            var checkbox = document.createElement('label');
            checkbox.className = 'meter-checkbox-label';
            checkbox.innerHTML =
                '<input type="checkbox" class="meter-checkbox" data-meter="' + meter + '" ' + (g602SelectedMeters.has(meter) ? 'checked' : '') + '>' +
                '<span class="checkbox-box" style="border-color:' + color + ';color:' + color + ';">' +
                '<span class="checkbox-check"></span>' +
                '</span>' +
                '<span class="checkbox-text">' + meter + '</span>';
            checkbox.querySelector('.meter-checkbox').addEventListener('change', function () {
                var meterName = this.dataset.meter;
                if (this.checked) { g602SelectedMeters.add(meterName); } else { g602SelectedMeters.delete(meterName); }
                g602_update();
            });
            filterContainer.appendChild(checkbox);
        });
    }

    function g602_fetchAllData() {
        var TimeCategory = 'Cold';
        var allMetersParam = g602AvailableMeters.join(',');
        $.ajax({
            type: 'POST',
            url: '/Energy/EnergyTrends_EnergyConsumptionHourlyAverage?TimeCategory=' + TimeCategory + '&Meter=' + encodeURIComponent(allMetersParam),
            success: function (result) {
                var response = (typeof result === 'string') ? JSON.parse(result) : result;
                var rows = response.Table || response || [];
                g602Data = g602_processData(rows);
                g602_update();
            },
            error: function () {
                var container = document.getElementById(g602ContainerId);
                if (container) { var chart = echarts.getInstanceByDom(container); if (chart) chart.setOption({ title: { text: 'Error loading data', left: 'center', top: 'center', textStyle: { color: '#f44336', fontSize: 16 } } }); }
            }
        });
    }

    function g602_fetchMetersAndInit() {
        $.ajax({
            type: 'POST',
            url: '/Energy/GetFilterbyMeter',
            success: function (result) {
                var response = (typeof result === 'string') ? JSON.parse(result) : result;
                var meters = response.Table || response || [];
                if (!meters.length) return;
                g602AvailableMeters = meters.map(function (m) {
                    var name = m.MeterDisplayname || m.MeterID || m.Meter || m.meter || m;
                    return (typeof name === 'string' ? name : String(name)).replace(/ID/gi, 'Id');
                });
                g602SelectedMeters.clear();
                if (g602AvailableMeters.length > 0) { g602SelectedMeters.add(g602AvailableMeters[0]); }
                g602_renderMeterFilters(g602AvailableMeters);
                g602_fetchAllData();
            },
            error: function () { console.error('Error fetching meters for Graph 602'); }
        });
    }

    function g602_initialize(graphContainerId) {
        g602ContainerId = graphContainerId;
        g602Data = []; g602AvailableMeters = []; g602SelectedMeters = new Set(); g602MeterColorMap = new Map();

        // Only claim the shared filter container if THIS graph's slide is the active one.
        var sharedFilter602 = document.getElementById('meterFilterContainer');
        if (sharedFilter602 && _isActiveSlide(graphContainerId)) { sharedFilter602.innerHTML = ''; sharedFilter602.setAttribute('data-graph-owner', '602'); }

        var dom = document.getElementById(graphContainerId);
        if (!dom) { console.error('Graph 602: container not found:', graphContainerId); return; }
        var existing = echarts.getInstanceByDom(dom);
        if (existing) existing.dispose();
        var myChart = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });
        myChart.showLoading({ text: 'Initializing...', color: '#5470C6', textColor: '#000', maskColor: 'rgba(255,255,255,0.8)', zlevel: 0 });
        g602_fetchMetersAndInit();
        window.addEventListener('resize', function () { if (myChart) myChart.resize(); });
    }

    //Hrly Average Energy Consumption - KWH vs KVAH (dynamic bar chart with meter filter)
    _echartEnergyConsumptionColdChartDashboard[602] = function (graphContainerId) {
        console.log('Graph 602 (Hrly Average KWH vs KVAH - Bar Chart) called:', graphContainerId);
        g602_initialize(graphContainerId);
    };

    //Hrly Actual Energy Consumption - KWH vs KVAH vs Cost
    _echartEnergyConsumptionColdChartDashboard[701] = function (graphContainerId) {
        var dom = document.getElementById(graphContainerId);
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        myChart.showLoading();
        var TimeCategory = 'Hot'

        $.ajax({
            type: "post",
            url: "/Energy/GetEnergyTrends_EnergyConsumptionKWHKVAHAndTemprature?TimeCategory=" + TimeCategory,
            data: {},
            success: function (result) {
                myChart.hideLoading();
                var myJSON = JSON.parse(result)

                const posList = [
                    'left',
                    'right',
                    'top',
                    'bottom',
                    'inside',
                    'insideTop',
                    'insideLeft',
                    'insideRight',
                    'insideBottom',
                    'insideTopLeft',
                    'insideTopRight',
                    'insideBottomLeft',
                    'insideBottomRight'
                ];
                app.configParameters = {
                    rotate: {
                        min: -90,
                        max: 90
                    },
                    align: {
                        options: {
                            left: 'left',
                            center: 'center',
                            right: 'right'
                        }
                    },
                    verticalAlign: {
                        options: {
                            top: 'top',
                            middle: 'middle',
                            bottom: 'bottom'
                        }
                    },
                    position: {
                        options: posList.reduce(function (map, pos) {
                            map[pos] = pos;
                            return map;
                        }, {})
                    },
                    distance: {
                        min: 0,
                        max: 100
                    }
                };
                app.config = {
                    rotate: 90,
                    align: 'left',
                    verticalAlign: 'middle',
                    position: 'insideBottom',
                    distance: 15,
                    onChange: function () {
                        const labelOption = {
                            rotate: app.config.rotate,
                            align: app.config.align,
                            verticalAlign: app.config.verticalAlign,
                            position: app.config.position,
                            distance: app.config.distance
                        };
                        myChart.setOption({
                            series: [
                                {
                                    label: labelOption
                                },
                                {
                                    label: labelOption
                                },
                                {
                                    label: labelOption
                                },
                                {
                                    label: labelOption
                                }
                            ]
                        });
                    }
                };
                const labelOption = {
                    show: true,
                    position: app.config.position,
                    distance: app.config.distance,
                    align: app.config.align,
                    verticalAlign: app.config.verticalAlign,
                    rotate: app.config.rotate,
                    formatter: '{c}  {name|{a}}',
                    fontSize: 16,
                    rich: {
                        name: {}
                    }
                };
                option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['Forest', 'Steppe', 'Desert', 'Wetland']
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        left: 'right',
                        top: 'center',
                        feature: {
                            mark: { show: true },
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: ['line', 'bar', 'stack'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: { show: false },
                            data: ['2012', '2013', '2014', '2015', '2016']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: 'Forest',
                            type: 'bar',
                            barGap: 0,
                            label: labelOption,
                            emphasis: {
                                focus: 'series'
                            },
                            data: [320, 332, 301, 334, 390]
                        },
                        {
                            name: 'Steppe',
                            type: 'bar',
                            label: labelOption,
                            emphasis: {
                                focus: 'series'
                            },
                            data: [220, 182, 191, 234, 290]
                        },
                        {
                            name: 'Desert',
                            type: 'bar',
                            label: labelOption,
                            emphasis: {
                                focus: 'series'
                            },
                            data: [150, 232, 201, 154, 190]
                        },
                        {
                            name: 'Wetland',
                            type: 'bar',
                            label: labelOption,
                            emphasis: {
                                focus: 'series'
                            },
                            data: [98, 77, 101, 99, 40]
                        }
                    ]
                };

                if (option && typeof option === 'object') {
                    myChart.setOption(option);
                }

                window.addEventListener('resize', myChart.resize);
            }
        });



    }
    //Hrly Average Energy Consumption - KWH vs KVAH vs Cost
    _echartEnergyConsumptionColdChartDashboard[702] = function (graphContainerId) {
        var dom = document.getElementById(graphContainerId);
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        myChart.showLoading();
        var TimeCategory = 'Hot'

        $.ajax({
            type: "post",
            url: "/Energy/GetEnergyTrends_EnergyConsumptionKWHKVAHAndTemprature?TimeCategory=" + TimeCategory,
            data: {},
            success: function (result) {
                myChart.hideLoading();
                var myJSON = JSON.parse(result)

                const posList = [
                    'left',
                    'right',
                    'top',
                    'bottom',
                    'inside',
                    'insideTop',
                    'insideLeft',
                    'insideRight',
                    'insideBottom',
                    'insideTopLeft',
                    'insideTopRight',
                    'insideBottomLeft',
                    'insideBottomRight'
                ];
                app.configParameters = {
                    rotate: {
                        min: -90,
                        max: 90
                    },
                    align: {
                        options: {
                            left: 'left',
                            center: 'center',
                            right: 'right'
                        }
                    },
                    verticalAlign: {
                        options: {
                            top: 'top',
                            middle: 'middle',
                            bottom: 'bottom'
                        }
                    },
                    position: {
                        options: posList.reduce(function (map, pos) {
                            map[pos] = pos;
                            return map;
                        }, {})
                    },
                    distance: {
                        min: 0,
                        max: 100
                    }
                };
                app.config = {
                    rotate: 90,
                    align: 'left',
                    verticalAlign: 'middle',
                    position: 'insideBottom',
                    distance: 15,
                    onChange: function () {
                        const labelOption = {
                            rotate: app.config.rotate,
                            align: app.config.align,
                            verticalAlign: app.config.verticalAlign,
                            position: app.config.position,
                            distance: app.config.distance
                        };
                        myChart.setOption({
                            series: [
                                {
                                    label: labelOption
                                },
                                {
                                    label: labelOption
                                },
                                {
                                    label: labelOption
                                },
                                {
                                    label: labelOption
                                }
                            ]
                        });
                    }
                };
                const labelOption = {
                    show: true,
                    position: app.config.position,
                    distance: app.config.distance,
                    align: app.config.align,
                    verticalAlign: app.config.verticalAlign,
                    rotate: app.config.rotate,
                    formatter: '{c}  {name|{a}}',
                    fontSize: 16,
                    rich: {
                        name: {}
                    }
                };
                option = {
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['Forest', 'Steppe', 'Desert', 'Wetland']
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        left: 'right',
                        top: 'center',
                        feature: {
                            mark: { show: true },
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: ['line', 'bar', 'stack'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: { show: false },
                            data: ['2012', '2013', '2014', '2015', '2016']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: 'Forest',
                            type: 'bar',
                            barGap: 0,
                            label: labelOption,
                            emphasis: {
                                focus: 'series'
                            },
                            data: [320, 332, 301, 334, 390]
                        },
                        {
                            name: 'Steppe',
                            type: 'bar',
                            label: labelOption,
                            emphasis: {
                                focus: 'series'
                            },
                            data: [220, 182, 191, 234, 290]
                        },
                        {
                            name: 'Desert',
                            type: 'bar',
                            label: labelOption,
                            emphasis: {
                                focus: 'series'
                            },
                            data: [150, 232, 201, 154, 190]
                        },
                        {
                            name: 'Wetland',
                            type: 'bar',
                            label: labelOption,
                            emphasis: {
                                focus: 'series'
                            },
                            data: [98, 77, 101, 99, 40]
                        }
                    ]
                };

                if (option && typeof option === 'object') {
                    myChart.setOption(option);
                }

                window.addEventListener('resize', myChart.resize);
            }
        });



    }
    // ===================================================================
    // GRAPH 801 - Hourly Actual: Energy Consumption KWH vs KVAH vs Temperature
    // Dynamic version: uses GetFilterbyMeter + GetEnergyTrends_EnergyConsumptionAndTemperature
    // Bars for KWH (full opacity) and KVAH (reduced opacity), dashed lines for temperature per device
    // ===================================================================

    // Isolated state for Graph 801 (does not share with Graph 3's live state)
    var g801ContainerId = null;
    var g801Data = [];
    var g801AvailableMeters = [];
    var g801SelectedMeters = new Set();
    var g801MeterColorMap = new Map();
    var g801TempColorMap = new Map();

    function g801_getMeterColor(index) {
        return meterColors[index % meterColors.length];
    }

    function g801_processData(rows) {
        // COLD API: Month, WeekStart, WeekEnd, Meter, KWH, KVAH, Asset, Temp_in_degree, Device_ID
        return rows.map(function (row) {
            var ws = (row.WeekStart || '').split('T')[0];
            return {
                weekStart: ws,
                weekEnd: (row.WeekEnd || '').split('T')[0],
                month: row.Month || '',
                xLabel: ws,
                meter: (row.Meter || row.MeterID || '').replace(/ID/gi, 'Id'),
                kwh: parseFloat(row.KWH) || 0,
                kvah: parseFloat(row.KVAH) || 0,
                deviceID: row.Device_ID || row.DeviceID || null,
                assetName: row.Asset || null,
                temperature: (row.Temp_in_degree != null && row.Temp_in_degree !== undefined)
                    ? parseFloat(row.Temp_in_degree) : null
            };
        });
    }

    function g801_createChartOption(filteredData) {
        if (g801SelectedMeters.size === 0) {
            return {
                title: {
                    text: 'Please select a meter', left: 'center', top: 'center',
                    textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' }
                }
            };
        }
        if (filteredData.length === 0) {
            return {
                title: {
                    text: 'No data available for selected meters', left: 'center', top: 'center',
                    textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' }
                }
            };
        }

        // COLD: Sort by weekStart
        var sortedData = filteredData.slice().sort(function (a, b) {
            return a.weekStart < b.weekStart ? -1 : a.weekStart > b.weekStart ? 1 : 0;
        });

        // Build unique x-axis keys (weekStart dates), deduplicated while keeping order
        var seen = {};
        var xAxisData = [];
        sortedData.forEach(function (r) {
            if (!seen[r.xLabel]) {
                seen[r.xLabel] = true;
                xAxisData.push(r.xLabel);
            }
        });

        // Build weekEnd lookup for tooltip
        var weekEndMap801 = {};
        sortedData.forEach(function (r) { if (!weekEndMap801[r.xLabel]) weekEndMap801[r.xLabel] = r.weekEnd; });

        // X-axis display labels: "Month Year" only on first week of each month, blank for rest
        // g801 month field is combined like "January-2026"
        var xAxisDisplayLabels801 = buildMonthlyXAxisLabels(xAxisData, sortedData, function (r) {
            return formatMonthYear(r.month, r.year);
        });

        var uniqueMeters = [];
        var meterSeen = {};
        sortedData.forEach(function (r) {
            if (!meterSeen[r.meter]) { meterSeen[r.meter] = true; uniqueMeters.push(r.meter); }
        });

        var uniqueDevices = [];
        var deviceSeen = {};
        sortedData.forEach(function (r) {
            if (r.deviceID && !deviceSeen[r.deviceID]) { deviceSeen[r.deviceID] = true; uniqueDevices.push(r.deviceID); }
        });

        var deviceAssetMap = {};
        sortedData.forEach(function (r) {
            if (r.deviceID && r.assetName && !deviceAssetMap[r.deviceID]) {
                deviceAssetMap[r.deviceID] = r.assetName;
            }
        });

        // KWH bars - full opacity
        var kwhSeries = uniqueMeters.map(function (meter) {
            var meterIndex = g801AvailableMeters.indexOf(meter);
            var color = g801_getMeterColor(meterIndex >= 0 ? meterIndex : 0);
            g801MeterColorMap.set(meter, color);

            var barData = xAxisData.map(function (lbl) {
                var rec = sortedData.find(function (r) { return r.meter === meter && r.xLabel === lbl; });
                return rec ? rec.kwh : null;
            });

            return {
                name: meter + ' KWH',
                type: 'bar',
                yAxisIndex: 1,
                barMaxWidth: 18,
                itemStyle: { color: color, opacity: 1 },
                //emphasis: { itemStyle: { opacity: 1 } },
                data: barData,
                z: 3
            };
        });



        // KVAH bars - same color, reduced opacity
        var kvahSeries = uniqueMeters.map(function (meter) {
            var color = g801MeterColorMap.get(meter) || meterColors[0];

            var barData = xAxisData.map(function (lbl) {
                var rec = sortedData.find(function (r) { return r.meter === meter && r.xLabel === lbl; });
                return rec ? rec.kvah : null;
            });

            return {
                name: meter + ' KVAH',
                type: 'bar',
                yAxisIndex: 1,
                barMaxWidth: 18,
                itemStyle: { color: color, opacity: 0.5 },
                //emphasis: { itemStyle: { opacity: 0.5 } },
                data: barData,
                z: 2
            };
        });

        // Temperature dashed lines - one per DeviceID
        // Sort devices alphabetically for consistent color assignment
        var sortedDevices = uniqueDevices.slice().sort();

        var tempSeries = uniqueDevices.map(function (deviceID) {
            // Use position in sorted array for consistent color index
            var colorIndex = sortedDevices.indexOf(deviceID);
            var assetName = deviceAssetMap[deviceID] || 'Unknown';
            var displayName = assetName + ' (' + deviceID + ')';
            var tempColor;

            // Assign color based on sorted position (consistent across meter changes)
            if (!g801TempColorMap.has(deviceID)) {
                g801TempColorMap.set(deviceID, tempColors[colorIndex % tempColors.length]);
            }
            tempColor = g801TempColorMap.get(deviceID);

            var lineData = xAxisData.map(function (lbl) {
                var rec = sortedData.find(function (r) { return r.deviceID === deviceID && r.xLabel === lbl; });
                return (rec && rec.temperature !== null) ? rec.temperature : null;
            });

            return {
                name: displayName,
                type: 'line',
                yAxisIndex: 0,
                smooth: true,
                symbol: 'none',
                lineStyle: { width: 1, color: tempColor },
                itemStyle: { color: tempColor },
                connectNulls: true,
                data: lineData,
                z: 10
            };
        });



        var allSeries = kwhSeries.concat(kvahSeries).concat(tempSeries);
        var legendData = tempSeries.map(function (s) { return s.name; });

        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                backgroundColor: 'rgba(0,0,0,0.85)',
                borderColor: 'rgba(255,255,255,0.2)',
                borderWidth: 1,
                padding: [14, 18],
                textStyle: { color: '#fff', fontSize: 13 },
                formatter: function (params) {
                    if (!params || params.length === 0) return '';
                    // FIX: use dataIndex to retrieve original week start from xAxisData
                    var dataIndex = params[0].dataIndex;
                    var ws = xAxisData[dataIndex] || '';
                    var we = weekEndMap801[ws] || '';
                    var displayLabel = we ? ws + ' – ' + we : ws;
                    var html = '<div style="font-weight:bold;margin-bottom:10px;font-size:14px;color:#fff;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:6px;">' + displayLabel + '</div>';

                    // Group by meter for bars, then list temperatures
                    var meterData = {};
                    var tempData = [];

                    params.forEach(function (p) {
                        if (p.value == null) return;
                        var seriesName = p.seriesName;
                        // KWH bar
                        var kwhMatch = seriesName.match(/^(.+) KWH$/);
                        var kvahMatch = seriesName.match(/^(.+) KVAH$/);
                        if (kwhMatch) {
                            var m = kwhMatch[1];
                            if (!meterData[m]) meterData[m] = {};
                            meterData[m].kwh = p.value;
                            meterData[m].color = p.color;
                        } else if (kvahMatch) {
                            var m2 = kvahMatch[1];
                            if (!meterData[m2]) meterData[m2] = {};
                            meterData[m2].kvah = p.value;
                        } else {
                            tempData.push({ name: seriesName, value: p.value, color: p.color });
                        }
                    });

                    Object.keys(meterData).forEach(function (meter) {
                        var d = meterData[meter];
                        var mk = '<span style="display:inline-block;width:12px;height:12px;background:' + (d.color || '#999') + ';border-radius:2px;margin-right:7px;"></span>';
                        html += '<div style="margin:7px 0;">';
                        html += '<div style="font-weight:600;color:#fff;margin-bottom:4px;">' + mk + meter + '</div>';
                        html += '<div style="margin-left:19px;font-size:12px;color:#e0e0e0;">';
                        if (d.kwh != null) html += '<span style="color:#90caf9;">KWH:</span> <strong>' + d.kwh.toFixed(3) + '</strong>';
                        if (d.kvah != null) html += ' &nbsp;|&nbsp; <span style="color:#90caf9;">KVAH:</span> <strong>' + d.kvah.toFixed(3) + '</strong>';
                        html += '</div></div>';
                    });

                    if (tempData.length > 0) {
                        html += '<div style="border-top:1px solid rgba(255,255,255,0.2);margin-top:6px;padding-top:6px;">';
                        tempData.forEach(function (t) {
                            var tk = '<span style="display:inline-block;width:10px;height:10px;background:' + t.color + ';border-radius:50%;margin-right:6px;"></span>';
                            html += '<div style="font-size:12px;color:#b0b0b0;margin:3px 0;">' + tk + '<span style="color:#ffb74d;">' + t.name + ':</span> <strong style="color:#fff;">' + t.value.toFixed(2) + '°C</strong></div>';
                        });
                        html += '</div>';
                    }

                    return html;
                }
            },
            legend: {
                data: legendData,
                type: 'scroll',
                top: 5,
                left: 'center',
                padding: [6, 12],
                backgroundColor: 'rgba(255,255,255,0.92)',
                borderRadius: 6,
                borderColor: '#ddd',
                borderWidth: 1,
                textStyle: { fontSize: 12, color: '#333' },
                itemWidth: 22, itemHeight: 12, itemGap: 12,
                icon: 'roundRect',
                pageIconSize: 12,
                pageTextStyle: { fontSize: 11 }
            },
            grid: {
                left: '8%',
                right: '4%',
                bottom: '12%',
                // legend top:5, each row ~30px, +22px clear gap before chart
                top: (function () {
                    var rows = Math.ceil(legendData.length / 4);
                    return 5 + (rows * 30) + 22;
                }()),
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: xAxisDisplayLabels801,
                axisLabel: {
                    show: true,
                    rotate: 0,
                    fontSize: 11,
                    color: '#444',
                    fontWeight: 600,
                    interval: 0
                },
                name: '',
                nameLocation: 'middle',
                nameGap: 35,
                nameTextStyle: { fontSize: 11, color: '#555' },
                axisLine: { lineStyle: { color: '#000', width: 1.5 } },
                axisTick: { show: false },
                axisPointer: { type: 'shadow' }
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'Temperature (°C)',
                    position: 'left',
                    scale: true,
                    nameLocation: 'middle',
                    nameRotate: 90,
                    nameGap: 52,
                    nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#555' },
                    axisLabel: { formatter: '{value}°C', fontSize: 11, color: '#666' },
                    axisLine: { show: true, lineStyle: { color: '#000', width: 2 } },
                    splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } }
                },
                {
                    type: 'value',
                    name: 'KWH / KVAH',
                    position: 'right',
                    scale: true,
                    nameLocation: 'middle',
                    nameRotate: -90,
                    nameGap: 52,
                    nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#555' },
                    axisLabel: { fontSize: 11, color: '#666' },
                    axisLine: { show: true, lineStyle: { color: '#000', width: 2 } },
                    splitLine: { show: false }
                }
            ],
            series: allSeries,
            dataZoom: [
                { type: 'inside', start: 0, end: 100, zoomOnMouseWheel: true, moveOnMouseMove: true },
                {
                    type: 'slider', show: true, start: 0, end: 100, height: 20, bottom: 20,
                    handleSize: '80%', handleStyle: { color: '#5470C6', borderColor: '#5470C6' },
                    textStyle: { color: '#666' }, borderColor: '#ddd'
                }
            ]
        };
    }

    function g801_update() {
        if (!g801ContainerId) return;
        var container = document.getElementById(g801ContainerId);
        if (!container) return;
        var myChart = echarts.getInstanceByDom(container);
        if (!myChart) return;

        if (g801SelectedMeters.size === 0) {
            myChart.setOption(g801_createChartOption([]), true);
            return;
        }

        myChart.showLoading({
            text: 'Updating chart...', color: '#5470C6', textColor: '#000',
            maskColor: 'rgba(255,255,255,0.8)', zlevel: 0
        });

        var filteredData = g801Data.filter(function (r) { return g801SelectedMeters.has(r.meter); });
        myChart.hideLoading();
        myChart.setOption(g801_createChartOption(filteredData), true);
    }

    function g801_renderMeterFilters(meters) {
        var filterContainer = document.getElementById('meterFilterContainer');
        if (!filterContainer) return;
        // Only render if this graph currently owns the container (set during initialize)
        if (filterContainer.getAttribute('data-graph-owner') !== '801') return;

        filterContainer.innerHTML = '<div class="filter-label">Filter by Meter Type:</div>';

        meters.forEach(function (meter, index) {
            var color = g801_getMeterColor(index);
            g801MeterColorMap.set(meter, color);

            var checkbox = document.createElement('label');
            checkbox.className = 'meter-checkbox-label';
            checkbox.innerHTML =
                '<input type="checkbox" class="meter-checkbox" data-meter="' + meter + '" ' + (g801SelectedMeters.has(meter) ? 'checked' : '') + '>' +
                '<span class="checkbox-box" style="border-color:' + color + ';color:' + color + ';">' +
                '<span class="checkbox-check"></span>' +
                '</span>' +
                '<span class="checkbox-text">' + meter + '</span>';

            checkbox.querySelector('.meter-checkbox').addEventListener('change', function () {
                var meterName = this.dataset.meter;
                if (this.checked) {
                    g801SelectedMeters.add(meterName);
                } else {
                    g801SelectedMeters.delete(meterName);
                }
                g801_update();
            });

            filterContainer.appendChild(checkbox);
        });
    }

    function g801_fetchAllData() {
        var TimeCategory = 'Cold';
        var allMetersParam = g801AvailableMeters.join(',');

        $.ajax({
            type: 'POST',
            url: '/Energy/EnergyTrends_EnergyConsumptionAndTemperatureHourlyActual?TimeCategory=' + TimeCategory + '&Meter=' + encodeURIComponent(allMetersParam),
            success: function (result) {
                var response = (typeof result === 'string') ? JSON.parse(result) : result;
                var rows = response.Table || response || [];
                g801Data = g801_processData(rows);
                g801_update();
            },
            error: function () {
                var container = document.getElementById(g801ContainerId);
                if (container) {
                    var chart = echarts.getInstanceByDom(container);
                    if (chart) chart.setOption({
                        title: {
                            text: 'Error loading data', left: 'center', top: 'center',
                            textStyle: { color: '#f44336', fontSize: 16 }
                        }
                    });
                }
            }
        });
    }

    function g801_fetchMetersAndInit() {
        $.ajax({
            type: 'POST',
            url: '/Energy/GetFilterbyMeter',
            success: function (result) {
                var response = (typeof result === 'string') ? JSON.parse(result) : result;
                var meters = response.Table || response || [];
                if (!meters.length) return;

                g801AvailableMeters = meters.map(function (m) {
                    var name = m.MeterDisplayname || m.MeterID || m.Meter || m.meter || m;
                    return (typeof name === 'string' ? name : String(name)).replace(/ID/gi, 'Id');
                });

                g801SelectedMeters.clear();
                if (g801AvailableMeters.length > 0) {
                    g801SelectedMeters.add(g801AvailableMeters[0]);
                }

                g801_renderMeterFilters(g801AvailableMeters);
                g801_fetchAllData();
            },
            error: function () {
                console.error('Error fetching meters for Graph 801');
            }
        });
    }

    function g801_initialize(graphContainerId) {
        g801ContainerId = graphContainerId;
        // Reset state on each init - ensures switching from another graph starts fresh
        g801Data = [];
        g801AvailableMeters = [];
        g801SelectedMeters = new Set();
        g801MeterColorMap = new Map();
        g801TempColorMap = new Map();

        // Only claim the shared filter container if THIS graph's slide is the active one.
        // If not active, renderMeterFilters will be blocked; Hot.js refreshFilter() will
        // re-render the correct graph's filters when the user swipes to that slide.
        var sharedFilter801 = document.getElementById('meterFilterContainer');
        if (sharedFilter801 && _isActiveSlide(graphContainerId)) {
            sharedFilter801.innerHTML = '';
            sharedFilter801.setAttribute('data-graph-owner', '801');
        }

        var dom = document.getElementById(graphContainerId);
        if (!dom) { console.error('Graph 801: container not found:', graphContainerId); return; }

        var existing = echarts.getInstanceByDom(dom);
        if (existing) existing.dispose();

        var myChart = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });
        myChart.showLoading({
            text: 'Initializing...', color: '#5470C6', textColor: '#000',
            maskColor: 'rgba(255,255,255,0.8)', zlevel: 0
        });

        g801_fetchMetersAndInit();

        window.addEventListener('resize', function () { if (myChart) myChart.resize(); });
    }

    // Graph 8: Energy Consumption - KWH vs KVAH vs Temperature (Hourly)
    // This is the base graph that routes to hourly actual (801)
    _echartEnergyConsumptionColdChartDashboard[8] = function (graphContainerId) {
        console.log('📊 Graph 8 (Energy Consumption - KWH vs KVAH vs Temperature Hourly) called:', graphContainerId);
        console.log('📊 Graph 8 routing to Graph 801 (Hourly Actual)');
        g801_initialize(graphContainerId);
    };

    // Hourly Actual: Energy Consumption KWH vs KVAH vs Temperature (dynamic, meter-filtered)
    _echartEnergyConsumptionColdChartDashboard[801] = function (graphContainerId) {
        console.log('📊 Graph 801 (Hourly Actual KWH vs KVAH vs Temperature) called:', graphContainerId);
        g801_initialize(graphContainerId);
    };
    // ===================================================================
    // GRAPH 802 - Hrly Average: Energy Consumption KWH vs KVAH vs Temperature
    // Dynamic version: identical to 801 but uses HourlyAverage API endpoint
    // ===================================================================

    var g802ContainerId = null;
    var g802Data = [];
    var g802AvailableMeters = [];
    var g802SelectedMeters = new Set();
    var g802MeterColorMap = new Map();
    var g802TempColorMap = new Map();

    function g802_getMeterColor(index) { return meterColors[index % meterColors.length]; }

    function g802_processData(rows) {
        // COLD API: Month, WeekStart, WeekEnd, Meter, KWH, KVAH, Asset, Temp_in_degree, Device_ID
        return rows.map(function (row) {
            var ws = (row.WeekStart || '').split('T')[0];
            return {
                weekStart: ws,
                weekEnd: (row.WeekEnd || '').split('T')[0],
                month: row.Month || '',
                xLabel: ws,
                meter: (row.Meter || row.MeterID || '').replace(/ID/gi, 'Id'),
                kwh: parseFloat(row.KWH) || 0,
                kvah: parseFloat(row.KVAH) || 0,
                deviceID: row.Device_ID || row.DeviceID || null,
                assetName: row.Asset || null,
                temperature: (row.Temp_in_degree != null && row.Temp_in_degree !== undefined) ? parseFloat(row.Temp_in_degree) : null
            };
        });
    }

    function g802_createChartOption(filteredData) {
        if (g802SelectedMeters.size === 0) {
            return { title: { text: 'Please select a meter', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' } } };
        }
        if (filteredData.length === 0) {
            return { title: { text: 'No data available for selected meters', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' } } };
        }

        var sortedData = filteredData.slice().sort(function (a, b) {
            return a.weekStart < b.weekStart ? -1 : a.weekStart > b.weekStart ? 1 : 0;
        });

        var seenX = {};
        var xAxisData = [];
        sortedData.forEach(function (r) { if (!seenX[r.xLabel]) { seenX[r.xLabel] = true; xAxisData.push(r.xLabel); } });

        // Build weekEnd lookup for tooltip
        var weekEndMap802 = {};
        sortedData.forEach(function (r) { if (!weekEndMap802[r.xLabel]) weekEndMap802[r.xLabel] = r.weekEnd; });

        // X-axis: "Month Year" only on first week of that month
        var xAxisDisplayLabels802 = buildMonthlyXAxisLabels(xAxisData, sortedData, function (r) {
            return formatMonthYear(r.month, r.year);
        });

        var uniqueMeters = [];
        var meterSeen802 = {};
        sortedData.forEach(function (r) { if (!meterSeen802[r.meter]) { meterSeen802[r.meter] = true; uniqueMeters.push(r.meter); } });

        var uniqueDevices = [];
        var deviceSeen802 = {};
        sortedData.forEach(function (r) { if (r.deviceID && !deviceSeen802[r.deviceID]) { deviceSeen802[r.deviceID] = true; uniqueDevices.push(r.deviceID); } });
        var sortedDevices = uniqueDevices.slice().sort();
        var tempColors802 = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22', '#34495E', '#16A085', '#D35400'];

        var allSeries = [];
        uniqueMeters.forEach(function (meter) {
            var meterIndex = g802AvailableMeters.indexOf(meter);
            var color = g802_getMeterColor(meterIndex >= 0 ? meterIndex : 0);
            g802MeterColorMap.set(meter, color);

            var kwhData = xAxisData.map(function (xl) {
                var rec = sortedData.find(function (r) { return r.meter === meter && r.xLabel === xl; });
                return rec ? rec.kwh : null;
            });
            var kvahData = xAxisData.map(function (xl) {
                var rec = sortedData.find(function (r) { return r.meter === meter && r.xLabel === xl; });
                return rec ? rec.kvah : null;
            });

            allSeries.push({ name: meter + ' KWH', type: 'bar', yAxisIndex: 1, barMaxWidth: 18, itemStyle: { color: color, opacity: 1 }, data: kwhData, z: 3 });
            allSeries.push({ name: meter + ' KVAH', type: 'bar', yAxisIndex: 1, barMaxWidth: 18, itemStyle: { color: color, opacity: 0.5 }, data: kvahData, z: 2 });
        });

        uniqueDevices.forEach(function (deviceID) {
            var deviceData = sortedData.filter(function (r) { return r.deviceID === deviceID; });
            var assetName = deviceData[0] ? (deviceData[0].assetName || 'Unknown Asset') : 'Unknown Asset';
            var displayName = assetName + ' (' + deviceID + ')';
            var colorIndex = sortedDevices.indexOf(deviceID);
            var tempColor = tempColors802[colorIndex % tempColors802.length];
            if (!g802TempColorMap.has(deviceID)) g802TempColorMap.set(deviceID, tempColor);

            var tempLineData = xAxisData.map(function (xl) {
                var rec = deviceData.find(function (r) { return r.xLabel === xl && r.temperature !== null; });
                return rec ? rec.temperature : null;
            });

            allSeries.push({
                name: displayName, type: 'line', yAxisIndex: 0, smooth: true, symbol: 'none',
                lineStyle: { width: 1, color: tempColor }, itemStyle: { color: tempColor },
                data: tempLineData, connectNulls: true, z: 10
            });
        });

        var legendData = [];
        uniqueDevices.forEach(function (dID) {
            var deviceData = sortedData.filter(function (r) { return r.deviceID === dID; });
            var assetName = deviceData[0] ? (deviceData[0].assetName || 'Unknown Asset') : 'Unknown Asset';
            legendData.push(assetName + ' (' + dID + ')');
        });

        return {
            tooltip: {
                trigger: 'axis', axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
                backgroundColor: 'rgba(0,0,0,0.85)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1, padding: [12, 16],
                textStyle: { color: '#fff', fontSize: 12 },
                formatter: function (params) {
                    if (!params || params.length === 0) return '';
                    // FIX: use dataIndex to retrieve original week start from xAxisData
                    var dataIndex = params[0].dataIndex;
                    var ws = xAxisData[dataIndex] || '';
                    var we = weekEndMap802[ws] || '';
                    var label = we ? ws + ' – ' + we : ws;
                    var html = '<div style="font-weight:bold;margin-bottom:8px;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:4px;">' + label + '</div>';
                    var meterData = {};
                    var tempMap = new Map();
                    params.forEach(function (p) {
                        var kwhMatch = p.seriesName.match(/^(.+) KWH$/);
                        var kvahMatch = p.seriesName.match(/^(.+) KVAH$/);
                        if (kwhMatch) { var m = kwhMatch[1]; if (!meterData[m]) meterData[m] = {}; meterData[m].kwh = p.value; meterData[m].color = p.color; }
                        else if (kvahMatch) { var m2 = kvahMatch[1]; if (!meterData[m2]) meterData[m2] = {}; meterData[m2].kvah = p.value; }
                        else if (!tempMap.has(p.seriesName)) { tempMap.set(p.seriesName, { name: p.seriesName, value: p.value, color: p.color }); }
                    });
                    Object.keys(meterData).forEach(function (meter, idx) {
                        var d = meterData[meter];
                        var mk = '<span style="display:inline-block;width:12px;height:12px;background:' + (d.color || '#999') + ';border-radius:2px;margin-right:7px;"></span>';
                        html += '<div style="margin:7px 0;"><div style="font-weight:600;color:#fff;margin-bottom:4px;">' + mk + meter + '</div>';
                        html += '<div style="margin-left:19px;font-size:12px;color:#e0e0e0;">';
                        if (d.kwh != null) html += '<span style="color:#90caf9;">KWH:</span> <strong>' + Number(d.kwh).toFixed(3) + '</strong>';
                        if (d.kvah != null) html += ' &nbsp;|&nbsp; <span style="color:#90caf9;">KVAH:</span> <strong>' + Number(d.kvah).toFixed(3) + '</strong>';
                        html += '</div></div>';
                    });
                    if (tempMap.size > 0) {
                        html += '<div style="margin-top:6px;border-top:1px solid rgba(255,255,255,0.2);padding-top:5px;">';
                        tempMap.forEach(function (t) {
                            var mk2 = '<span style="display:inline-block;width:10px;height:10px;background:' + t.color + ';border-radius:50%;margin-right:5px;"></span>';
                            html += '<div style="font-size:10px;color:#b0b0b0;margin:2px 0;">' + mk2 + t.name + ': <strong style="color:#fff;">' + (t.value != null ? Number(t.value).toFixed(2) + '°C' : 'N/A') + '</strong></div>';
                        });
                        html += '</div>';
                    }
                    return html;
                }
            },
            legend: { data: legendData, type: 'scroll', top: 5, left: 'center', padding: [6, 12], backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 6, borderColor: '#ddd', borderWidth: 1, textStyle: { fontSize: 12, color: '#333' }, itemWidth: 22, itemHeight: 12, itemGap: 12, icon: 'roundRect', pageIconSize: 12, pageTextStyle: { fontSize: 11 } },
            grid: { left: '8%', right: '8%', bottom: '12%', top: (function () { var rows = Math.ceil(legendData.length / 4); return 5 + (rows * 30) + 22; }()), containLabel: true },
            xAxis: {
                type: 'category', data: xAxisDisplayLabels802,
                axisLabel: {
                    show: true, rotate: 0, fontSize: 11, color: '#444',
                    fontWeight: 600, interval: 0
                },
                name: '',
                nameLocation: 'middle',
                nameGap: 35,
                nameTextStyle: { fontSize: 11, color: '#555' },
                axisLine: { lineStyle: { color: '#000', width: 1.5 } },
                axisTick: { show: false },
                axisPointer: { type: 'shadow' }
            },
            yAxis: [
                { type: 'value', name: 'Temperature (°C)', position: 'left', scale: true, nameLocation: 'middle', nameRotate: 90, nameGap: 52, nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#555' }, axisLabel: { formatter: '{value}°C', fontSize: 11, color: '#666' }, axisLine: { show: true, lineStyle: { color: '#000', width: 2 } }, splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } } },
                { type: 'value', name: 'KWH / KVAH', position: 'right', scale: true, nameLocation: 'middle', nameRotate: -90, nameGap: 52, nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#555' }, axisLabel: { fontSize: 11, color: '#666' }, axisLine: { show: true, lineStyle: { color: '#000', width: 2 } }, splitLine: { show: false } }
            ],
            series: allSeries,
            dataZoom: [
                { type: 'inside', start: 0, end: 100, zoomOnMouseWheel: true, moveOnMouseMove: true },
                { type: 'slider', show: true, start: 0, end: 100, height: 20, bottom: 20, handleSize: '80%', handleStyle: { color: '#5470C6', borderColor: '#5470C6' }, textStyle: { color: '#666' }, borderColor: '#ddd' }
            ]
        };
    }

    function g802_update() {
        if (!g802ContainerId) return;
        var container = document.getElementById(g802ContainerId);
        if (!container) return;
        var myChart = echarts.getInstanceByDom(container);
        if (!myChart) return;
        if (g802SelectedMeters.size === 0) { myChart.setOption(g802_createChartOption([]), true); return; }
        myChart.showLoading({ text: 'Updating chart...', color: '#5470C6', textColor: '#000', maskColor: 'rgba(255,255,255,0.8)', zlevel: 0 });
        var filteredData = g802Data.filter(function (r) { return g802SelectedMeters.has(r.meter); });
        myChart.hideLoading();
        myChart.setOption(g802_createChartOption(filteredData), true);
    }

    function g802_renderMeterFilters(meters) {
        var filterContainer = document.getElementById('meterFilterContainer');
        if (!filterContainer) return;
        // Only render if this graph currently owns the container (set during initialize)
        if (filterContainer.getAttribute('data-graph-owner') !== '802') return;
        filterContainer.innerHTML = '<div class="filter-label">Filter by Meter Type:</div>';
        meters.forEach(function (meter, index) {
            var color = g802_getMeterColor(index);
            g802MeterColorMap.set(meter, color);
            var checkbox = document.createElement('label');
            checkbox.className = 'meter-checkbox-label';
            checkbox.innerHTML =
                '<input type="checkbox" class="meter-checkbox" data-meter="' + meter + '" ' + (g802SelectedMeters.has(meter) ? 'checked' : '') + '>' +
                '<span class="checkbox-box" style="border-color:' + color + ';color:' + color + ';">' +
                '<span class="checkbox-check"></span>' +
                '</span>' +
                '<span class="checkbox-text">' + meter + '</span>';
            checkbox.querySelector('.meter-checkbox').addEventListener('change', function () {
                var meterName = this.dataset.meter;
                if (this.checked) { g802SelectedMeters.add(meterName); } else { g802SelectedMeters.delete(meterName); }
                g802_update();
            });
            filterContainer.appendChild(checkbox);
        });
    }

    function g802_fetchAllData() {
        var TimeCategory = 'Cold';
        var allMetersParam = g802AvailableMeters.join(',');
        $.ajax({
            type: 'POST',
            url: '/Energy/EnergyTrends_EnergyConsumptionAndTemperatureHourlyAverage?TimeCategory=' + TimeCategory + '&Meter=' + encodeURIComponent(allMetersParam),
            success: function (result) {
                var response = (typeof result === 'string') ? JSON.parse(result) : result;
                var rows = response.Table || response || [];
                g802Data = g802_processData(rows);
                g802_update();
            },
            error: function () {
                var container = document.getElementById(g802ContainerId);
                if (container) { var chart = echarts.getInstanceByDom(container); if (chart) chart.setOption({ title: { text: 'Error loading data', left: 'center', top: 'center', textStyle: { color: '#f44336', fontSize: 16 } } }); }
            }
        });
    }

    function g802_fetchMetersAndInit() {
        $.ajax({
            type: 'POST',
            url: '/Energy/GetFilterbyMeter',
            success: function (result) {
                var response = (typeof result === 'string') ? JSON.parse(result) : result;
                var meters = response.Table || response || [];
                if (!meters.length) return;
                g802AvailableMeters = meters.map(function (m) {
                    var name = m.MeterDisplayname || m.MeterID || m.Meter || m.meter || m;
                    return (typeof name === 'string' ? name : String(name)).replace(/ID/gi, 'Id');
                });
                g802SelectedMeters.clear();
                if (g802AvailableMeters.length > 0) { g802SelectedMeters.add(g802AvailableMeters[0]); }
                g802_renderMeterFilters(g802AvailableMeters);
                g802_fetchAllData();
            },
            error: function () { console.error('Error fetching meters for Graph 802'); }
        });
    }

    function g802_initialize(graphContainerId) {
        g802ContainerId = graphContainerId;
        g802Data = []; g802AvailableMeters = []; g802SelectedMeters = new Set(); g802MeterColorMap = new Map(); g802TempColorMap = new Map();

        // Only claim the shared filter container if THIS graph's slide is the active one.
        var sharedFilter802 = document.getElementById('meterFilterContainer');
        if (sharedFilter802 && _isActiveSlide(graphContainerId)) {
            sharedFilter802.innerHTML = '';
            sharedFilter802.setAttribute('data-graph-owner', '802');
        }

        var dom = document.getElementById(graphContainerId);
        if (!dom) { console.error('Graph 802: container not found:', graphContainerId); return; }
        var existing = echarts.getInstanceByDom(dom);
        if (existing) existing.dispose();
        var myChart = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });
        myChart.showLoading({ text: 'Initializing...', color: '#5470C6', textColor: '#000', maskColor: 'rgba(255,255,255,0.8)', zlevel: 0 });
        g802_fetchMetersAndInit();
        window.addEventListener('resize', function () { if (myChart) myChart.resize(); });
    }

    //Hrly Average Energy Consumption - KWH vs KVAH vs Temperature (dynamic, meter-filtered)
    _echartEnergyConsumptionColdChartDashboard[802] = function (graphContainerId) {
        console.log('📊 Graph 802 (Hourly Average KWH vs KVAH vs Temperature) called:', graphContainerId);
        g802_initialize(graphContainerId);
    };

    //Carbon Footprint Live
    _echartEnergyConsumptionColdChartDashboard[9] = function (graphContainerId) {
        var dom = document.getElementById(graphContainerId);
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        let base = +new Date(2016, 9, 3);
        let oneDay = 24 * 3600 * 1000;
        let valueBase = Math.random() * 300;
        let valueBase2 = Math.random() * 50;
        let data = [];
        let data2 = [];
        for (var i = 1; i < 10; i++) {
            var now = new Date((base += oneDay));
            var dayStr = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');
            valueBase = Math.round((Math.random() - 0.5) * 20 + valueBase);
            valueBase <= 0 && (valueBase = Math.random() * 300);
            data.push([dayStr, valueBase]);
            valueBase2 = Math.round((Math.random() - 0.5) * 20 + valueBase2);
            valueBase2 <= 0 && (valueBase2 = Math.random() * 50);
            data2.push([dayStr, valueBase2]);
        }
        option = {
            legend: {
                top: 'bottom',
                data: ['Intention']
            },
            tooltip: {
                triggerOn: 'none',
                position: function (pt) {
                    return [pt[0], 130];
                }
            },
            toolbox: {
                left: 'center',
                itemSize: 25,
                top: 55,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {}
                }
            },
            xAxis: {
                type: 'time',
                axisPointer: {
                    value: '2016-10-7',
                    snap: true,
                    lineStyle: {
                        color: '#7581BD',
                        width: 2
                    },
                    label: {
                        show: true,
                        formatter: function (params) {
                            return echarts.format.formatTime('yyyy-MM-dd', params.value);
                        },
                        backgroundColor: '#7581BD'
                    },
                    handle: {
                        show: true,
                        color: '#7581BD'
                    }
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    inside: true
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    inside: true,
                    formatter: '{value}\n'
                },
                z: 10
            },
            grid: {
                top: 110,
                left: 15,
                right: 15,
                height: 160
            },
            dataZoom: [
                {
                    type: 'inside',
                    throttle: 50
                }
            ],
            series: [
                {
                    name: 'Fake Data',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    sampling: 'average',
                    itemStyle: {
                        color: '#0770FF'
                    },
                    stack: 'a',
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(58,77,233,0.8)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(58,77,233,0.3)'
                            }
                        ])
                    },
                    data: data
                },
                {
                    name: 'Fake Data',
                    type: 'line',
                    smooth: true,
                    stack: 'a',
                    symbol: 'circle',
                    symbolSize: 5,
                    sampling: 'average',
                    itemStyle: {
                        color: '#F2597F'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(213,72,120,0.8)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(213,72,120,0.3)'
                            }
                        ])
                    },
                    data: data2
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);

    }
    //Hrly Actual Carbon Footprint
    _echartEnergyConsumptionColdChartDashboard[1001] = function (graphContainerId) {
        var dom = document.getElementById(graphContainerId);
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        let base = +new Date(2016, 9, 3);
        let oneDay = 24 * 3600 * 1000;
        let valueBase = Math.random() * 300;
        let valueBase2 = Math.random() * 50;
        let data = [];
        let data2 = [];
        for (var i = 1; i < 10; i++) {
            var now = new Date((base += oneDay));
            var dayStr = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');
            valueBase = Math.round((Math.random() - 0.5) * 20 + valueBase);
            valueBase <= 0 && (valueBase = Math.random() * 300);
            data.push([dayStr, valueBase]);
            valueBase2 = Math.round((Math.random() - 0.5) * 20 + valueBase2);
            valueBase2 <= 0 && (valueBase2 = Math.random() * 50);
            data2.push([dayStr, valueBase2]);
        }
        option = {
            legend: {
                top: 'bottom',
                data: ['Intention']
            },
            tooltip: {
                triggerOn: 'none',
                position: function (pt) {
                    return [pt[0], 130];
                }
            },
            toolbox: {
                left: 'center',
                itemSize: 25,
                top: 55,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {}
                }
            },
            xAxis: {
                type: 'time',
                axisPointer: {
                    value: '2016-10-7',
                    snap: true,
                    lineStyle: {
                        color: '#7581BD',
                        width: 2
                    },
                    label: {
                        show: true,
                        formatter: function (params) {
                            return echarts.format.formatTime('yyyy-MM-dd', params.value);
                        },
                        backgroundColor: '#7581BD'
                    },
                    handle: {
                        show: true,
                        color: '#7581BD'
                    }
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    inside: true
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    inside: true,
                    formatter: '{value}\n'
                },
                z: 10
            },
            grid: {
                top: 110,
                left: 15,
                right: 15,
                height: 160
            },
            dataZoom: [
                {
                    type: 'inside',
                    throttle: 50
                }
            ],
            series: [
                {
                    name: 'Fake Data',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    sampling: 'average',
                    itemStyle: {
                        color: '#0770FF'
                    },
                    stack: 'a',
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(58,77,233,0.8)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(58,77,233,0.3)'
                            }
                        ])
                    },
                    data: data
                },
                {
                    name: 'Fake Data',
                    type: 'line',
                    smooth: true,
                    stack: 'a',
                    symbol: 'circle',
                    symbolSize: 5,
                    sampling: 'average',
                    itemStyle: {
                        color: '#F2597F'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(213,72,120,0.8)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(213,72,120,0.3)'
                            }
                        ])
                    },
                    data: data2
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);

    }
    //Hrly Average Carbon Footprint
    _echartEnergyConsumptionColdChartDashboard[1002] = function (graphContainerId) {
        var dom = document.getElementById(graphContainerId);
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        let base = +new Date(2016, 9, 3);
        let oneDay = 24 * 3600 * 1000;
        let valueBase = Math.random() * 300;
        let valueBase2 = Math.random() * 50;
        let data = [];
        let data2 = [];
        for (var i = 1; i < 10; i++) {
            var now = new Date((base += oneDay));
            var dayStr = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');
            valueBase = Math.round((Math.random() - 0.5) * 20 + valueBase);
            valueBase <= 0 && (valueBase = Math.random() * 300);
            data.push([dayStr, valueBase]);
            valueBase2 = Math.round((Math.random() - 0.5) * 20 + valueBase2);
            valueBase2 <= 0 && (valueBase2 = Math.random() * 50);
            data2.push([dayStr, valueBase2]);
        }
        option = {
            legend: {
                top: 'bottom',
                data: ['Intention']
            },
            tooltip: {
                triggerOn: 'none',
                position: function (pt) {
                    return [pt[0], 130];
                }
            },
            toolbox: {
                left: 'center',
                itemSize: 25,
                top: 55,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {}
                }
            },
            xAxis: {
                type: 'time',
                axisPointer: {
                    value: '2016-10-7',
                    snap: true,
                    lineStyle: {
                        color: '#7581BD',
                        width: 2
                    },
                    label: {
                        show: true,
                        formatter: function (params) {
                            return echarts.format.formatTime('yyyy-MM-dd', params.value);
                        },
                        backgroundColor: '#7581BD'
                    },
                    handle: {
                        show: true,
                        color: '#7581BD'
                    }
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    inside: true
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    inside: true,
                    formatter: '{value}\n'
                },
                z: 10
            },
            grid: {
                top: 110,
                left: 15,
                right: 15,
                height: 160
            },
            dataZoom: [
                {
                    type: 'inside',
                    throttle: 50
                }
            ],
            series: [
                {
                    name: 'Fake Data',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    sampling: 'average',
                    itemStyle: {
                        color: '#0770FF'
                    },
                    stack: 'a',
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(58,77,233,0.8)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(58,77,233,0.3)'
                            }
                        ])
                    },
                    data: data
                },
                {
                    name: 'Fake Data',
                    type: 'line',
                    smooth: true,
                    stack: 'a',
                    symbol: 'circle',
                    symbolSize: 5,
                    sampling: 'average',
                    itemStyle: {
                        color: '#F2597F'
                    },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgba(213,72,120,0.8)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(213,72,120,0.3)'
                            }
                        ])
                    },
                    data: data2
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);

    }
    //Carbon Footprint vs Energy Consumption
    _echartEnergyConsumptionColdChartDashboard[11] = function (graphContainerId) {
        var dom = document.getElementById(graphContainerId);
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        const categories = (function () {
            let now = new Date();
            let res = [];
            let len = 10;
            while (len--) {
                res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
                now = new Date(+now - 2000);
            }
            return res;
        })();
        const categories2 = (function () {
            let res = [];
            let len = 10;
            while (len--) {
                res.push(10 - len - 1);
            }
            return res;
        })();
        const data = (function () {
            let res = [];
            let len = 10;
            while (len--) {
                res.push(Math.round(Math.random() * 1000));
            }
            return res;
        })();
        const data2 = (function () {
            let res = [];
            let len = 0;
            while (len < 10) {
                res.push(+(Math.random() * 10 + 5).toFixed(1));
                len++;
            }
            return res;
        })();
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            legend: {},
            toolbox: {
                show: true,
                feature: {
                    dataView: { readOnly: false },
                    restore: {},
                    saveAsImage: {}
                }
            },
            dataZoom: {
                show: false,
                start: 0,
                end: 100
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    data: categories
                },
                {
                    type: 'category',
                    boundaryGap: true,
                    data: categories2
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    name: 'Price',
                    max: 30,
                    min: 0,
                    boundaryGap: [0.2, 0.2]
                },
                {
                    type: 'value',
                    scale: true,
                    name: 'Order',
                    max: 1200,
                    min: 0,
                    boundaryGap: [0.2, 0.2]
                }
            ],
            series: [
                {
                    name: 'Dynamic Bar',
                    type: 'bar',
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: data
                },
                {
                    name: 'Dynamic Line',
                    type: 'line',
                    data: data2
                }
            ]
        };
        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    }
    //Carbon Foot print with Peak carbon FootPrint
    _echartEnergyConsumptionColdChartDashboard[12] = function (graphContainerId) {
        var dom = document.getElementById(graphContainerId);
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                // prettier-ignore
                data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45']
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} W'
                },
                axisPointer: {
                    snap: true
                }
            },
            visualMap: {
                show: false,
                dimension: 0,
                pieces: [
                    {
                        lte: 6,
                        color: 'green'
                    },
                    {
                        gt: 6,
                        lte: 8,
                        color: 'red'
                    },
                    {
                        gt: 8,
                        lte: 14,
                        color: 'green'
                    },
                    {
                        gt: 14,
                        lte: 17,
                        color: 'red'
                    },
                    {
                        gt: 17,
                        color: 'green'
                    }
                ]
            },
            series: [
                {
                    name: 'Electricity',
                    type: 'line',
                    smooth: true,
                    // prettier-ignore
                    data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400],
                    markArea: {
                        itemStyle: {
                            color: 'rgba(255, 173, 177, 0.4)'
                        },
                        data: [
                            [
                                {
                                    name: 'Morning Peak',
                                    xAxis: '07:30'
                                },
                                {
                                    xAxis: '10:00'
                                }
                            ],
                            [
                                {
                                    name: 'Evening Peak',
                                    xAxis: '17:30'
                                },
                                {
                                    xAxis: '21:15'
                                }
                            ]
                        ]
                    }
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);
    }
    //Hrly Actual Carbon footprint - KWH vs KVAH vs Cost
    _echartEnergyConsumptionColdChartDashboard[1301] = function (graphContainerId) {
        var dom = document.getElementById(graphContainerId);
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        const posList = [
            'left',
            'right',
            'top',
            'bottom',
            'inside',
            'insideTop',
            'insideLeft',
            'insideRight',
            'insideBottom',
            'insideTopLeft',
            'insideTopRight',
            'insideBottomLeft',
            'insideBottomRight'
        ];
        app.configParameters = {
            rotate: {
                min: -90,
                max: 90
            },
            align: {
                options: {
                    left: 'left',
                    center: 'center',
                    right: 'right'
                }
            },
            verticalAlign: {
                options: {
                    top: 'top',
                    middle: 'middle',
                    bottom: 'bottom'
                }
            },
            position: {
                options: posList.reduce(function (map, pos) {
                    map[pos] = pos;
                    return map;
                }, {})
            },
            distance: {
                min: 0,
                max: 100
            }
        };
        app.config = {
            rotate: 90,
            align: 'left',
            verticalAlign: 'middle',
            position: 'insideBottom',
            distance: 15,
            onChange: function () {
                const labelOption = {
                    rotate: app.config.rotate,
                    align: app.config.align,
                    verticalAlign: app.config.verticalAlign,
                    position: app.config.position,
                    distance: app.config.distance
                };
                myChart.setOption({
                    series: [
                        {
                            label: labelOption
                        },
                        {
                            label: labelOption
                        },
                        {
                            label: labelOption
                        },
                        {
                            label: labelOption
                        }
                    ]
                });
            }
        };
        const labelOption = {
            show: true,
            position: app.config.position,
            distance: app.config.distance,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            rotate: app.config.rotate,
            formatter: '{c}  {name|{a}}',
            fontSize: 16,
            rich: {
                name: {}
            }
        };
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['Forest', 'Steppe', 'Desert', 'Wetland']
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar', 'stack'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: { show: false },
                    data: ['2012', '2013', '2014', '2015', '2016']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Forest',
                    type: 'bar',
                    barGap: 0,
                    label: labelOption,
                    emphasis: {
                        focus: 'series'
                    },
                    data: [320, 332, 301, 334, 390]
                },
                {
                    name: 'Steppe',
                    type: 'bar',
                    label: labelOption,
                    emphasis: {
                        focus: 'series'
                    },
                    data: [220, 182, 191, 234, 290]
                },
                {
                    name: 'Desert',
                    type: 'bar',
                    label: labelOption,
                    emphasis: {
                        focus: 'series'
                    },
                    data: [150, 232, 201, 154, 190]
                },
                {
                    name: 'Wetland',
                    type: 'bar',
                    label: labelOption,
                    emphasis: {
                        focus: 'series'
                    },
                    data: [98, 77, 101, 99, 40]
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);

    }
    //Hrly Average Carbon footprint - KWH vs KVAH vs Cost
    _echartEnergyConsumptionColdChartDashboard[1302] = function (graphContainerId) {
        var dom = document.getElementById(graphContainerId);
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        const posList = [
            'left',
            'right',
            'top',
            'bottom',
            'inside',
            'insideTop',
            'insideLeft',
            'insideRight',
            'insideBottom',
            'insideTopLeft',
            'insideTopRight',
            'insideBottomLeft',
            'insideBottomRight'
        ];
        app.configParameters = {
            rotate: {
                min: -90,
                max: 90
            },
            align: {
                options: {
                    left: 'left',
                    center: 'center',
                    right: 'right'
                }
            },
            verticalAlign: {
                options: {
                    top: 'top',
                    middle: 'middle',
                    bottom: 'bottom'
                }
            },
            position: {
                options: posList.reduce(function (map, pos) {
                    map[pos] = pos;
                    return map;
                }, {})
            },
            distance: {
                min: 0,
                max: 100
            }
        };
        app.config = {
            rotate: 90,
            align: 'left',
            verticalAlign: 'middle',
            position: 'insideBottom',
            distance: 15,
            onChange: function () {
                const labelOption = {
                    rotate: app.config.rotate,
                    align: app.config.align,
                    verticalAlign: app.config.verticalAlign,
                    position: app.config.position,
                    distance: app.config.distance
                };
                myChart.setOption({
                    series: [
                        {
                            label: labelOption
                        },
                        {
                            label: labelOption
                        },
                        {
                            label: labelOption
                        },
                        {
                            label: labelOption
                        }
                    ]
                });
            }
        };
        const labelOption = {
            show: true,
            position: app.config.position,
            distance: app.config.distance,
            align: app.config.align,
            verticalAlign: app.config.verticalAlign,
            rotate: app.config.rotate,
            formatter: '{c}  {name|{a}}',
            fontSize: 16,
            rich: {
                name: {}
            }
        };
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['Forest', 'Steppe', 'Desert', 'Wetland']
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ['line', 'bar', 'stack'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: { show: false },
                    data: ['2012', '2013', '2014', '2015', '2016']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Forest',
                    type: 'bar',
                    barGap: 0,
                    label: labelOption,
                    emphasis: {
                        focus: 'series'
                    },
                    data: [320, 332, 301, 334, 390]
                },
                {
                    name: 'Steppe',
                    type: 'bar',
                    label: labelOption,
                    emphasis: {
                        focus: 'series'
                    },
                    data: [220, 182, 191, 234, 290]
                },
                {
                    name: 'Desert',
                    type: 'bar',
                    label: labelOption,
                    emphasis: {
                        focus: 'series'
                    },
                    data: [150, 232, 201, 154, 190]
                },
                {
                    name: 'Wetland',
                    type: 'bar',
                    label: labelOption,
                    emphasis: {
                        focus: 'series'
                    },
                    data: [98, 77, 101, 99, 40]
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);


    }


    // ===================================================================
    // GRAPH 1401 - Hrly Actual Energy Profile
    // Heatmap with:
    //   - Meter filter (radio-style: only one meter active at a time, color matches meter)
    //   - KWH / KVAH toggle button above chart
    //   - Hours 0:00 to 23:00 on x-axis, meter name on y-axis
    // ===================================================================

    var g1401ContainerId = null;
    var g1401Data = [];
    var g1401AvailableMeters = [];
    var g1401SelectedMeter = null;  // single meter (radio behavior)
    var g1401ActiveMetric = 'KWH';  // 'KWH' or 'KVAH'
    var g1401MeterColorMap = new Map();
    var g1401ChartInstance = null;  // stored chart instance reference


    function g1401_getMeterColor(index) {
        return meterColors[index % meterColors.length];
    }

    function g1401_processData(rows) {
        // COLD API: MeterID, Month, Year, WeekStart, WeekEnd, KWH, KVAH (weekly)
        return rows.map(function (row) {
            var rawMeter = row.MeterID || row.Meter || row.meter || '';
            var ws = (row.WeekStart || '').split('T')[0];
            return {
                weekStart: ws,
                weekEnd: (row.WeekEnd || '').split('T')[0],
                month: row.Month || '',
                year: row.Year || '',
                xLabel: ws,
                meter: rawMeter.replace(/ID/gi, 'Id'),
                kwh: parseFloat(row.KWH) || 0,
                kvah: parseFloat(row.KVAH) || 0
            };
        });
    }

    function g1401_buildKWHVAHToggle(containerId) {
        // Inject KWH/KVAH toggle above the chart container
        var container = document.getElementById(containerId);
        if (!container) return;
        var parent = container.parentElement;
        if (!parent) return;

        // Remove existing toggle if any
        var existingToggle = document.getElementById('g1401_metric_toggle_' + containerId);
        if (existingToggle) existingToggle.remove();

        var toggleDiv = document.createElement('div');
        toggleDiv.id = 'g1401_metric_toggle_' + containerId;
        toggleDiv.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:8px;justify-content:flex-end;';

        ['KWH', 'KVAH'].forEach(function (metric) {
            var btn = document.createElement('button');
            btn.textContent = metric;
            btn.dataset.metric = metric;
            btn.style.cssText = 'padding:5px 16px;border-radius:20px;border:2px solid #5470C6;cursor:pointer;font-size:13px;font-weight:600;transition:all 0.2s;';
            if (metric === g1401ActiveMetric) {
                btn.style.background = '#5470C6';
                btn.style.color = '#fff';
            } else {
                btn.style.background = '#fff';
                btn.style.color = '#5470C6';
            }
            btn.addEventListener('click', function () {
                g1401ActiveMetric = metric;
                // Update button styles
                var allBtns = toggleDiv.querySelectorAll('button');
                allBtns.forEach(function (b) {
                    if (b.dataset.metric === g1401ActiveMetric) {
                        b.style.background = '#5470C6';
                        b.style.color = '#fff';
                    } else {
                        b.style.background = '#fff';
                        b.style.color = '#5470C6';
                    }
                });
                // Recalculate range and update chart
                g1401_recalcRangeAndUpdate();
            });
            toggleDiv.appendChild(btn);
        });

        parent.insertBefore(toggleDiv, container);
    }





    function g1401_recalcRangeAndUpdate() {
        g1401_updateChart();
    }

    function g1401_createChartOption(filteredData) {
        if (!g1401SelectedMeter) {
            return {
                title: {
                    text: 'Please select a meter', left: 'center', top: 'center',
                    textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' }
                }
            };
        }
        if (filteredData.length === 0) {
            return {
                title: {
                    text: 'No data available for selected meter', left: 'center', top: 'center',
                    textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' }
                }
            };
        }

        // Get the meter color for heatmap
        var meterIndex = g1401AvailableMeters.indexOf(g1401SelectedMeter);
        var meterColor = g1401_getMeterColor(meterIndex >= 0 ? meterIndex : 0);

        function hexToRgb(hex) {
            var r = parseInt(hex.slice(1, 3), 16);
            var g = parseInt(hex.slice(3, 5), 16);
            var b = parseInt(hex.slice(5, 7), 16);
            return [r, g, b];
        }
        var rgb = hexToRgb(meterColor);
        var lightColor = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.15)';
        var darkColor = meterColor;

        // COLD/weekly: x-axis = weekStart dates sorted
        var sortedWeekStarts = filteredData.map(function (r) { return r.weekStart; })
            .filter(function (d, i, arr) { return arr.indexOf(d) === i; })
            .sort();

        // Build weekEnd map for tooltip
        var g1401WeekEndMap = {};
        filteredData.forEach(function (r) { if (!g1401WeekEndMap[r.weekStart]) g1401WeekEndMap[r.weekStart] = r.weekEnd; });

        // X-axis: "Month Year" label only on first week of each month, blank for rest
        var weekLabels = buildMonthlyXAxisLabels(sortedWeekStarts, filteredData, function (r) {
            return formatMonthYear(r.month, r.year);
        });

        // Build heatmap data: [weekIndex, meterName, value]
        var data = filteredData.map(function (r) {
            var wIdx = sortedWeekStarts.indexOf(r.weekStart);
            var val = g1401ActiveMetric === 'KWH' ? r.kwh : r.kvah;
            return [wIdx, g1401SelectedMeter, val];
        });

        var values = filteredData.map(function (r) { return g1401ActiveMetric === 'KWH' ? r.kwh : r.kvah; });
        var minVal = values.length ? Math.min.apply(null, values) : 0;
        var maxVal = values.length ? Math.max.apply(null, values) : 0;

        return {
            tooltip: {
                confine: true,
                position: function (point, params, dom, rect, size) {
                    var x = point[0];
                    var y = point[1] - size.contentSize[1] - 10;
                    if (x + size.contentSize[0] > size.viewSize[0]) { x = size.viewSize[0] - size.contentSize[0] - 8; }
                    if (x < 0) x = 8;
                    if (y < 0) y = point[1] + 10;
                    return [x, y];
                },
                backgroundColor: 'rgba(0,0,0,0.82)',
                borderColor: 'rgba(255,255,255,0.15)',
                borderWidth: 1,
                padding: [8, 12],
                textStyle: { color: '#fff', fontSize: 12 },
                formatter: function (params) {
                    var wIdx = params.value[0];
                    var ws = sortedWeekStarts[wIdx] || '';
                    var we = g1401WeekEndMap[ws] || '';
                    var weekLabel = we ? ws + ' – ' + we : ws;
                    var val = (params.value[2] || 0).toFixed(3);
                    return '<div style="font-weight:600;margin-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.25);padding-bottom:4px;">Week: ' + weekLabel + '</div>' +
                        '<div style="margin-top:4px;">' + params.value[1] + '</div>' +
                        '<div style="margin-top:2px;color:#90caf9;">' + g1401ActiveMetric + ': <strong style="color:#fff;">' + val + '</strong></div>';
                }
            },
            grid: { left: '12%', right: '6%', bottom: '25%', top: '8%' },
            xAxis: {
                type: 'category',
                data: weekLabels,
                splitArea: { show: true },
                name: '',
                nameLocation: 'middle',
                nameGap: 28,
                nameTextStyle: { fontSize: 11, color: '#555' },
                axisLabel: { fontSize: 11, color: '#444', fontWeight: 600, rotate: 0, interval: 0 },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'category',
                data: [g1401SelectedMeter],
                splitArea: { show: true },
                axisLabel: { fontSize: 11, color: '#555' }
            },
            visualMap: {
                min: minVal,
                max: maxVal,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '5%',
                inRange: { color: [lightColor, darkColor] },
                textStyle: { fontSize: 10 }
            },
            series: [{
                name: g1401ActiveMetric + ' Heatmap',
                type: 'heatmap',
                data: data,
                label: { show: false },
                emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } }
            }]
        };
    }

    function g1401_updateChart() {
        if (!g1401ContainerId) return;
        var container = document.getElementById(g1401ContainerId);
        if (!container) return;

        // Use stored instance for reliable access across all meter/metric changes
        var myChart = g1401ChartInstance || echarts.getInstanceByDom(container);
        if (!myChart) return;

        if (!g1401SelectedMeter) {
            myChart.clear();
            myChart.setOption(g1401_createChartOption([]));
            return;
        }

        var filteredData = g1401Data.filter(function (r) { return r.meter === g1401SelectedMeter; });
        myChart.hideLoading();
        // Use clear() + setOption() (without notMerge) to guarantee full redraw
        // for every meter + metric combination — fixes KWH/KVAH not updating for non-first meters
        myChart.clear();
        myChart.setOption(g1401_createChartOption(filteredData));
    }

    function g1401_renderMeterFilters(meters) {
        var filterContainer = document.getElementById('meterFilterContainer');
        if (!filterContainer) return;
        // Guard 1: only render if the 1401 slide is currently active
        if (!_isActiveSlide(g1401ContainerId)) return;
        // Guard 2: only render if this graph owns the container
        if (filterContainer.getAttribute('data-graph-owner') !== '1401') return;

        filterContainer.innerHTML = '<div class="filter-label">Filter by Meter Type:</div>';
        meters.forEach(function (meter, index) {
            var color = g1401_getMeterColor(index);
            g1401MeterColorMap.set(meter, color);

            var checkbox = document.createElement('label');
            checkbox.className = 'meter-checkbox-label';
            checkbox.innerHTML =
                '<input type="checkbox" class="meter-checkbox" data-meter="' + meter + '" ' + (g1401SelectedMeter === meter ? 'checked' : '') + '>' +
                '<span class="checkbox-box" style="border-color:' + color + ';color:' + color + ';">' +
                '<span class="checkbox-check"></span>' +
                '</span>' +
                '<span class="checkbox-text">' + meter + '</span>';

            checkbox.querySelector('.meter-checkbox').addEventListener('change', function () {
                var meterName = this.dataset.meter;
                if (this.checked) {
                    filterContainer.querySelectorAll('.meter-checkbox').forEach(function (cb) {
                        if (cb.dataset.meter !== meterName) cb.checked = false;
                    });
                    g1401SelectedMeter = meterName;
                    g1401_recalcRangeAndUpdate();
                } else {
                    g1401SelectedMeter = null;
                    g1401_updateChart();
                }
            });

            filterContainer.appendChild(checkbox);
        });
    }

    function g1401_fetchAllData() {
        var TimeCategory = 'Cold';
        var allMetersParam = g1401AvailableMeters.join(',');

        $.ajax({
            type: 'POST',
            url: '/Energy/EnergyTrends_EnergyProfileHourlyActual?TimeCategory=' + TimeCategory + '&Meter=' + encodeURIComponent(allMetersParam),
            success: function (result) {
                var response = (typeof result === 'string') ? JSON.parse(result) : result;
                var rows = response.Table || response || [];
                g1401Data = g1401_processData(rows);
                g1401_recalcRangeAndUpdate();
            },
            error: function () {
                var container = document.getElementById(g1401ContainerId);
                if (container) {
                    var chart = g1401ChartInstance || echarts.getInstanceByDom(container);
                    if (chart) chart.setOption({
                        title: {
                            text: 'Error loading data', left: 'center', top: 'center',
                            textStyle: { color: '#f44336', fontSize: 16 }
                        }
                    });
                }
            }
        });
    }

    function g1401_fetchMetersAndInit() {
        $.ajax({
            type: 'POST',
            url: '/Energy/GetFilterbyMeter',
            success: function (result) {
                var response = (typeof result === 'string') ? JSON.parse(result) : result;
                var meters = response.Table || response || [];
                if (!meters.length) return;

                g1401AvailableMeters = meters.map(function (m) {
                    var name = m.MeterDisplayname || m.MeterID || m.Meter || m.meter || m;
                    return (typeof name === 'string' ? name : String(name)).replace(/ID/gi, 'Id');
                });

                // Default to first meter
                g1401SelectedMeter = g1401AvailableMeters.length > 0 ? g1401AvailableMeters[0] : null;

                g1401_renderMeterFilters(g1401AvailableMeters);
                g1401_fetchAllData();
            },
            error: function () {
                console.error('Error fetching meters for Graph 1401');
            }
        });
    }

    function g1401_initialize(graphContainerId) {
        g1401ContainerId = graphContainerId;
        g1401Data = [];
        g1401AvailableMeters = [];
        g1401SelectedMeter = null;
        g1401ActiveMetric = 'KWH';
        g1401MeterColorMap = new Map();
        g1401ChartInstance = null;  // FIX: reset stored instance so stale disposed chart isn't reused

        // Claim filter container only if this slide is active (same pattern as 401/402)
        var sf1401 = document.getElementById('meterFilterContainer');
        if (sf1401 && _isActiveSlide(graphContainerId)) { sf1401.innerHTML = ''; sf1401.setAttribute('data-graph-owner', '1401'); }

        var dom = document.getElementById(graphContainerId);
        if (!dom) { console.error('Graph 1401: container not found:', graphContainerId); return; }

        var existing = echarts.getInstanceByDom(dom);
        if (existing) existing.dispose();

        g1401ChartInstance = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });
        g1401ChartInstance.showLoading({
            text: 'Initializing...', color: '#5470C6', textColor: '#000',
            maskColor: 'rgba(255,255,255,0.8)', zlevel: 0
        });

        // Build the KWH/KVAH toggle UI
        g1401_buildKWHVAHToggle(graphContainerId);

        g1401_fetchMetersAndInit();

        window.addEventListener('resize', function () { if (g1401ChartInstance) g1401ChartInstance.resize(); });
    }

    //Hrly Actual Energy Profile (dynamic heatmap with meter filter, KWH/KVAH toggle, range slider)
    _echartEnergyConsumptionColdChartDashboard[1401] = function (graphContainerId) {
        console.log('Graph 1401 (Hrly Actual Energy Profile Heatmap) called:', graphContainerId);
        g1401_initialize(graphContainerId);
    };

    // ===================================================================
    // GRAPH 1402 - Hrly Average: Energy Profile (heatmap, identical to 1401 but uses HourlyAverage API)
    // ===================================================================

    var g1402ContainerId = null;
    var g1402Data = [];
    var g1402AvailableMeters = [];
    var g1402SelectedMeter = null;
    var g1402ActiveMetric = 'KWH';
    var g1402MeterColorMap = new Map();
    var g1402ChartInstance = null;

    function g1402_getMeterColor(index) { return meterColors[index % meterColors.length]; }

    function g1402_processData(rows) {
        // COLD API: MeterID, Month, Year, WeekStart, WeekEnd, KWH, KVAH (weekly)
        return rows.map(function (row) {
            var rawMeter = row.MeterID || row.Meter || row.meter || '';
            var ws = (row.WeekStart || '').split('T')[0];
            return {
                weekStart: ws,
                weekEnd: (row.WeekEnd || '').split('T')[0],
                month: row.Month || '',
                year: row.Year || '',
                xLabel: ws,
                meter: rawMeter.replace(/ID/gi, 'Id'),
                kwh: parseFloat(row.KWH) || 0,
                kvah: parseFloat(row.KVAH) || 0
            };
        });
    }

    function g1402_buildKWHVAHToggle(containerId) {
        var container = document.getElementById(containerId);
        if (!container) return;
        var parent = container.parentElement;
        if (!parent) return;
        var existingToggle = document.getElementById('g1402_metric_toggle_' + containerId);
        if (existingToggle) existingToggle.remove();
        var toggleDiv = document.createElement('div');
        toggleDiv.id = 'g1402_metric_toggle_' + containerId;
        toggleDiv.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:8px;justify-content:flex-end;';
        ['KWH', 'KVAH'].forEach(function (metric) {
            var btn = document.createElement('button');
            btn.textContent = metric;
            btn.dataset.metric = metric;
            btn.style.cssText = 'padding:5px 16px;border-radius:20px;border:2px solid #5470C6;cursor:pointer;font-size:13px;font-weight:600;transition:all 0.2s;';
            if (metric === g1402ActiveMetric) { btn.style.background = '#5470C6'; btn.style.color = '#fff'; }
            else { btn.style.background = '#fff'; btn.style.color = '#5470C6'; }
            btn.addEventListener('click', function () {
                g1402ActiveMetric = metric;
                var allBtns = toggleDiv.querySelectorAll('button');
                allBtns.forEach(function (b) {
                    if (b.dataset.metric === g1402ActiveMetric) { b.style.background = '#5470C6'; b.style.color = '#fff'; }
                    else { b.style.background = '#fff'; b.style.color = '#5470C6'; }
                });
                g1402_updateChart();
            });
            toggleDiv.appendChild(btn);
        });
        parent.insertBefore(toggleDiv, container);
    }

    function g1402_createChartOption(filteredData) {
        if (!g1402SelectedMeter) {
            return { title: { text: 'Please select a meter', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' } } };
        }
        if (filteredData.length === 0) {
            return { title: { text: 'No data available for selected meter', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 18, fontWeight: 'normal' } } };
        }

        var meterIndex = g1402AvailableMeters.indexOf(g1402SelectedMeter);
        var meterColor = g1402_getMeterColor(meterIndex >= 0 ? meterIndex : 0);

        function hexToRgb(hex) {
            var r = parseInt(hex.slice(1, 3), 16); var g = parseInt(hex.slice(3, 5), 16); var b = parseInt(hex.slice(5, 7), 16); return [r, g, b];
        }
        var rgb = hexToRgb(meterColor);
        var lightColor = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.15)';

        // COLD/weekly: x-axis = weekStart dates sorted
        var sortedWeekStarts = filteredData.map(function (r) { return r.weekStart; })
            .filter(function (d, i, arr) { return arr.indexOf(d) === i; })
            .sort();

        var g1402WeekEndMap = {};
        filteredData.forEach(function (r) { if (!g1402WeekEndMap[r.weekStart]) g1402WeekEndMap[r.weekStart] = r.weekEnd; });

        // X-axis: "Month Year" label only on first week of each month
        var weekLabels = buildMonthlyXAxisLabels(sortedWeekStarts, filteredData, function (r) {
            return formatMonthYear(r.month, r.year);
        });

        var data = filteredData.map(function (r) {
            var wIdx = sortedWeekStarts.indexOf(r.weekStart);
            var val = g1402ActiveMetric === 'KWH' ? r.kwh : r.kvah;
            return [wIdx, g1402SelectedMeter, val];
        });
        var values = filteredData.map(function (r) { return g1402ActiveMetric === 'KWH' ? r.kwh : r.kvah; });
        var minVal = values.length ? Math.min.apply(null, values) : 0;
        var maxVal = values.length ? Math.max.apply(null, values) : 0;

        return {
            tooltip: {
                confine: true,
                position: function (point, params, dom, rect, size) {
                    var x = point[0]; var y = point[1] - size.contentSize[1] - 10;
                    if (x + size.contentSize[0] > size.viewSize[0]) x = size.viewSize[0] - size.contentSize[0] - 8;
                    if (x < 0) x = 8; if (y < 0) y = point[1] + 10;
                    return [x, y];
                },
                backgroundColor: 'rgba(0,0,0,0.82)', borderColor: 'rgba(255,255,255,0.15)', borderWidth: 1, padding: [8, 12],
                textStyle: { color: '#fff', fontSize: 12 },
                formatter: function (params) {
                    var wIdx = params.value[0];
                    var ws = sortedWeekStarts[wIdx] || '';
                    var we = g1402WeekEndMap[ws] || '';
                    var weekLabel = we ? ws + ' – ' + we : ws;
                    var val = (params.value[2] || 0).toFixed(3);
                    return '<div style="font-weight:600;margin-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.25);padding-bottom:4px;">Week: ' + weekLabel + '</div>' +
                        '<div style="margin-top:4px;">' + params.value[1] + '</div>' +
                        '<div style="margin-top:2px;color:#90caf9;">' + g1402ActiveMetric + ': <strong style="color:#fff;">' + val + '</strong></div>';
                }
            },
            grid: { left: '12%', right: '6%', bottom: '25%', top: '8%' },
            xAxis: {
                type: 'category', data: weekLabels, splitArea: { show: true },
                name: '',
                nameLocation: 'middle', nameGap: 28,
                nameTextStyle: { fontSize: 11, color: '#555' },
                axisLabel: { fontSize: 11, color: '#444', fontWeight: 600, rotate: 0, interval: 0 },
                axisTick: { show: false }
            },
            yAxis: { type: 'category', data: [g1402SelectedMeter], splitArea: { show: true }, axisLabel: { fontSize: 11, color: '#555' } },
            visualMap: { min: minVal, max: maxVal, calculable: true, orient: 'horizontal', left: 'center', bottom: '5%', inRange: { color: [lightColor, meterColor] }, textStyle: { fontSize: 10 } },
            series: [{ name: g1402ActiveMetric + ' Heatmap', type: 'heatmap', data: data, label: { show: false }, emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } } }]
        };
    }

    function g1402_updateChart() {
        if (!g1402ContainerId) return;
        var container = document.getElementById(g1402ContainerId);
        if (!container) return;
        var myChart = g1402ChartInstance || echarts.getInstanceByDom(container);
        if (!myChart) return;
        if (!g1402SelectedMeter) { myChart.clear(); myChart.setOption(g1402_createChartOption([])); return; }
        var filteredData = g1402Data.filter(function (r) { return r.meter === g1402SelectedMeter; });
        myChart.hideLoading();
        myChart.clear();
        myChart.setOption(g1402_createChartOption(filteredData));
    }

    function g1402_renderMeterFilters(meters) {
        var filterContainer = document.getElementById('meterFilterContainer');
        if (!filterContainer) return;
        // Guard 1: only render if the 1402 slide is currently active
        if (!_isActiveSlide(g1402ContainerId)) return;
        // Guard 2: only render if this graph owns the container
        if (filterContainer.getAttribute('data-graph-owner') !== '1402') return;

        filterContainer.innerHTML = '<div class="filter-label">Filter by Meter Type:</div>';
        meters.forEach(function (meter, index) {
            var color = g1402_getMeterColor(index);
            g1402MeterColorMap.set(meter, color);
            var checkbox = document.createElement('label');
            checkbox.className = 'meter-checkbox-label';
            checkbox.innerHTML =
                '<input type="checkbox" class="meter-checkbox" data-meter="' + meter + '" ' + (g1402SelectedMeter === meter ? 'checked' : '') + '>' +
                '<span class="checkbox-box" style="border-color:' + color + ';color:' + color + ';">' +
                '<span class="checkbox-check"></span>' +
                '</span>' +
                '<span class="checkbox-text">' + meter + '</span>';
            checkbox.querySelector('.meter-checkbox').addEventListener('change', function () {
                var meterName = this.dataset.meter;
                if (this.checked) {
                    filterContainer.querySelectorAll('.meter-checkbox').forEach(function (cb) {
                        if (cb.dataset.meter !== meterName) cb.checked = false;
                    });
                    g1402SelectedMeter = meterName;
                    g1402_updateChart();
                } else {
                    g1402SelectedMeter = null;
                    g1402_updateChart();
                }
            });
            filterContainer.appendChild(checkbox);
        });
    }

    function g1402_fetchAllData() {
        var TimeCategory = 'Cold';
        var allMetersParam = g1402AvailableMeters.join(',');
        $.ajax({
            type: 'POST',
            url: '/Energy/EnergyTrends_EnergyProfileHourlyAverage?TimeCategory=' + TimeCategory + '&Meter=' + encodeURIComponent(allMetersParam),
            success: function (result) {
                var response = (typeof result === 'string') ? JSON.parse(result) : result;
                var rows = response.Table || response || [];
                g1402Data = g1402_processData(rows);
                g1402_updateChart();
            },
            error: function () {
                var container = document.getElementById(g1402ContainerId);
                if (container) { var chart = g1402ChartInstance || echarts.getInstanceByDom(container); if (chart) chart.setOption({ title: { text: 'Error loading data', left: 'center', top: 'center', textStyle: { color: '#f44336', fontSize: 16 } } }); }
            }
        });
    }

    function g1402_fetchMetersAndInit() {
        $.ajax({
            type: 'POST',
            url: '/Energy/GetFilterbyMeter',
            success: function (result) {
                var response = (typeof result === 'string') ? JSON.parse(result) : result;
                var meters = response.Table || response || [];
                if (!meters.length) return;
                g1402AvailableMeters = meters.map(function (m) {
                    var name = m.MeterDisplayname || m.MeterID || m.Meter || m.meter || m;
                    return (typeof name === 'string' ? name : String(name)).replace(/ID/gi, 'Id');
                });
                g1402SelectedMeter = g1402AvailableMeters.length > 0 ? g1402AvailableMeters[0] : null;
                g1402_renderMeterFilters(g1402AvailableMeters);
                g1402_fetchAllData();
            },
            error: function () { console.error('Error fetching meters for Graph 1402'); }
        });
    }

    function g1402_initialize(graphContainerId) {
        g1402ContainerId = graphContainerId;
        g1402Data = []; g1402AvailableMeters = []; g1402SelectedMeter = null; g1402ActiveMetric = 'KWH'; g1402MeterColorMap = new Map();
        g1402ChartInstance = null;  // FIX: reset stored instance so stale disposed chart isn't reused

        // Claim filter container only if this slide is active (same pattern as 401/402)
        var sf1402 = document.getElementById('meterFilterContainer');
        if (sf1402 && _isActiveSlide(graphContainerId)) { sf1402.innerHTML = ''; sf1402.setAttribute('data-graph-owner', '1402'); }

        var dom = document.getElementById(graphContainerId);
        if (!dom) { console.error('Graph 1402: container not found:', graphContainerId); return; }
        var existing = echarts.getInstanceByDom(dom);
        if (existing) existing.dispose();
        g1402ChartInstance = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });
        g1402ChartInstance.showLoading({ text: 'Initializing...', color: '#5470C6', textColor: '#000', maskColor: 'rgba(255,255,255,0.8)', zlevel: 0 });
        g1402_buildKWHVAHToggle(graphContainerId);
        g1402_fetchMetersAndInit();
        window.addEventListener('resize', function () { if (g1402ChartInstance) g1402ChartInstance.resize(); });
    }

    //Hrly Average Energy Profile (dynamic heatmap with meter filter, KWH/KVAH toggle)
    _echartEnergyConsumptionColdChartDashboard[1402] = function (graphContainerId) {
        console.log('Graph 1402 (Hrly Average Energy Profile Heatmap) called:', graphContainerId);
        g1402_initialize(graphContainerId);
    };

    //Hrly Actual Power Cuts & Duration
    _echartEnergyConsumptionColdChartDashboard[1501] = function (graphContainerId) {

        var dom = document.getElementById(graphContainerId);
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        option = {
            grid: {
                bottom: 80
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: {
                        backgroundColor: '#505765'
                    }
                }
            },
            legend: {
                data: ['Flow', 'Rainfall'],
                left: 10
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 65,
                    end: 85
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 65,
                    end: 85
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    // prettier-ignore
                    data: [
                        '2009/6/12 2:00', '2009/6/12 3:00', '2009/6/12 4:00', '2009/6/12 5:00', '2009/6/12 6:00', '2009/6/12 7:00', '2009/6/12 8:00', '2009/6/12 9:00', '2009/6/12 10:00', '2009/6/12 11:00', '2009/6/12 12:00', '2009/6/12 13:00', '2009/6/12 14:00', '2009/6/12 15:00', '2009/6/12 16:00', '2009/6/12 17:00', '2009/6/12 18:00', '2009/6/12 19:00', '2009/6/12 20:00', '2009/6/12 21:00', '2009/6/12 22:00', '2009/6/12 23:00', '2009/6/13 0:00', '2009/6/13 1:00', '2009/6/13 2:00', '2009/6/13 3:00', '2009/6/13 4:00', '2009/6/13 5:00', '2009/6/13 6:00', '2009/6/13 7:00', '2009/6/13 8:00', '2009/6/13 9:00', '2009/6/13 10:00', '2009/6/13 11:00', '2009/6/13 12:00', '2009/6/13 13:00', '2009/6/13 14:00', '2009/6/13 15:00', '2009/6/13 16:00', '2009/6/13 17:00', '2009/6/13 18:00', '2009/6/13 19:00', '2009/6/13 20:00', '2009/6/13 21:00', '2009/6/13 22:00', '2009/6/13 23:00', '2009/6/14 0:00', '2009/6/14 1:00', '2009/6/14 2:00', '2009/6/14 3:00', '2009/6/14 4:00', '2009/6/14 5:00', '2009/6/14 6:00', '2009/6/14 7:00', '2009/6/14 8:00', '2009/6/14 9:00', '2009/6/14 10:00', '2009/6/14 11:00', '2009/6/14 12:00', '2009/6/14 13:00', '2009/6/14 14:00', '2009/6/14 15:00', '2009/6/14 16:00', '2009/6/14 17:00', '2009/6/14 18:00', '2009/6/14 19:00', '2009/6/14 20:00', '2009/6/14 21:00', '2009/6/14 22:00', '2009/6/14 23:00', '2009/6/15 0:00', '2009/6/15 1:00', '2009/6/15 2:00', '2009/6/15 3:00', '2009/6/15 4:00', '2009/6/15 5:00', '2009/6/15 6:00', '2009/6/15 7:00', '2009/6/15 8:00', '2009/6/15 9:00', '2009/6/15 10:00', '2009/6/15 11:00', '2009/6/15 12:00', '2009/6/15 13:00', '2009/6/15 14:00', '2009/6/15 15:00', '2009/6/15 16:00', '2009/6/15 17:00', '2009/6/15 18:00', '2009/6/15 19:00', '2009/6/15 20:00', '2009/6/15 21:00', '2009/6/15 22:00', '2009/6/15 23:00', '2009/6/15 0:00', '2009/6/16 1:00', '2009/6/16 2:00', '2009/6/16 3:00', '2009/6/16 4:00', '2009/6/16 5:00', '2009/6/16 6:00', '2009/6/16 7:00', '2009/6/16 8:00', '2009/6/16 9:00', '2009/6/16 10:00', '2009/6/16 11:00', '2009/6/16 12:00', '2009/6/16 13:00', '2009/6/16 14:00', '2009/6/16 15:00', '2009/6/16 16:00', '2009/6/16 17:00', '2009/6/16 18:00', '2009/6/16 19:00', '2009/6/16 20:00', '2009/6/16 21:00', '2009/6/16 22:00', '2009/6/16 23:00', '2009/6/15 0:00', '2009/6/17 1:00', '2009/6/17 2:00', '2009/6/17 3:00', '2009/6/17 4:00', '2009/6/17 5:00', '2009/6/17 6:00', '2009/6/17 7:00', '2009/6/17 8:00', '2009/6/17 9:00', '2009/6/17 10:00', '2009/6/17 11:00', '2009/6/17 12:00', '2009/6/17 13:00', '2009/6/17 14:00', '2009/6/17 15:00', '2009/6/17 16:00', '2009/6/17 17:00', '2009/6/17 18:00', '2009/6/17 19:00', '2009/6/17 20:00', '2009/6/17 21:00', '2009/6/17 22:00', '2009/6/17 23:00', '2009/6/18 0:00', '2009/6/18 1:00', '2009/6/18 2:00', '2009/6/18 3:00', '2009/6/18 4:00', '2009/6/18 5:00', '2009/6/18 6:00', '2009/6/18 7:00', '2009/6/18 8:00', '2009/6/18 9:00', '2009/6/18 10:00', '2009/6/18 11:00', '2009/6/18 12:00', '2009/6/18 13:00', '2009/6/18 14:00', '2009/6/18 15:00', '2009/6/18 16:00', '2009/6/18 17:00', '2009/6/18 18:00', '2009/6/18 19:00', '2009/6/18 20:00', '2009/6/18 21:00', '2009/6/18 22:00', '2009/6/18 23:00', '2009/6/15 0:00', '2009/6/19 1:00', '2009/6/19 2:00', '2009/6/19 3:00', '2009/6/19 4:00', '2009/6/19 5:00', '2009/6/19 6:00', '2009/6/19 7:00', '2009/6/19 8:00', '2009/6/19 9:00', '2009/6/19 10:00', '2009/6/19 11:00', '2009/6/19 12:00', '2009/6/19 13:00', '2009/6/19 14:00', '2009/6/19 15:00', '2009/6/19 16:00', '2009/6/19 17:00', '2009/6/19 18:00', '2009/6/19 19:00', '2009/6/19 20:00', '2009/6/19 21:00', '2009/6/19 22:00', '2009/6/19 23:00', '2009/6/20 0:00', '2009/6/20 1:00', '2009/6/20 2:00', '2009/6/20 3:00', '2009/6/20 4:00', '2009/6/20 5:00', '2009/6/20 6:00', '2009/6/20 7:00', '2009/6/20 8:00', '2009/6/20 9:00', '2009/6/20 10:00', '2009/6/20 11:00', '2009/6/20 12:00', '2009/6/20 13:00', '2009/6/20 14:00', '2009/6/20 15:00', '2009/6/20 16:00', '2009/6/20 17:00', '2009/6/20 18:00', '2009/6/20 19:00', '2009/6/20 20:00', '2009/6/20 21:00', '2009/6/20 22:00', '2009/6/20 23:00', '2009/6/21 0:00', '2009/6/21 1:00', '2009/6/21 2:00', '2009/6/21 3:00', '2009/6/21 4:00', '2009/6/21 5:00', '2009/6/21 6:00', '2009/6/21 7:00', '2009/6/21 8:00', '2009/6/21 9:00', '2009/6/21 10:00', '2009/6/21 11:00', '2009/6/21 12:00', '2009/6/21 13:00', '2009/6/21 14:00', '2009/6/21 15:00', '2009/6/21 16:00', '2009/6/21 17:00', '2009/6/21 18:00', '2009/6/21 19:00', '2009/6/21 20:00', '2009/6/21 21:00', '2009/6/21 22:00', '2009/6/21 23:00', '2009/6/22 0:00', '2009/6/22 1:00', '2009/6/22 2:00', '2009/6/22 3:00', '2009/6/22 4:00', '2009/6/22 5:00', '2009/6/22 6:00', '2009/6/22 7:00', '2009/6/22 8:00', '2009/6/22 9:00', '2009/6/22 10:00', '2009/6/22 11:00', '2009/6/22 12:00', '2009/6/22 13:00', '2009/6/22 14:00', '2009/6/22 15:00', '2009/6/22 16:00', '2009/6/22 17:00', '2009/6/22 18:00', '2009/6/22 19:00', '2009/6/22 20:00', '2009/6/22 21:00', '2009/6/22 22:00', '2009/6/22 23:00', '2009/6/23 0:00', '2009/6/23 1:00', '2009/6/23 2:00', '2009/6/23 3:00', '2009/6/23 4:00', '2009/6/23 5:00', '2009/6/23 6:00', '2009/6/23 7:00', '2009/6/23 8:00', '2009/6/23 9:00', '2009/6/23 10:00', '2009/6/23 11:00', '2009/6/23 12:00', '2009/6/23 13:00', '2009/6/23 14:00', '2009/6/23 15:00', '2009/6/23 16:00', '2009/6/23 17:00', '2009/6/23 18:00', '2009/6/23 19:00', '2009/6/23 20:00', '2009/6/23 21:00', '2009/6/23 22:00', '2009/6/23 23:00', '2009/6/24 0:00', '2009/6/24 1:00', '2009/6/24 2:00', '2009/6/24 3:00', '2009/6/24 4:00', '2009/6/24 5:00', '2009/6/24 6:00', '2009/6/24 7:00', '2009/6/24 8:00', '2009/6/24 9:00', '2009/6/24 10:00', '2009/6/24 11:00', '2009/6/24 12:00', '2009/6/24 13:00', '2009/6/24 14:00', '2009/6/24 15:00', '2009/6/24 16:00', '2009/6/24 17:00', '2009/6/24 18:00', '2009/6/24 19:00', '2009/6/24 20:00', '2009/6/24 21:00', '2009/6/24 22:00', '2009/6/24 23:00', '2009/6/25 0:00', '2009/6/25 1:00', '2009/6/25 2:00', '2009/6/25 3:00', '2009/6/25 4:00', '2009/6/25 5:00', '2009/6/25 6:00', '2009/6/25 7:00', '2009/6/25 8:00', '2009/6/25 9:00', '2009/6/25 10:00', '2009/6/25 11:00', '2009/6/25 12:00', '2009/6/25 13:00', '2009/6/25 14:00', '2009/6/25 15:00', '2009/6/25 16:00', '2009/6/25 17:00', '2009/6/25 18:00', '2009/6/25 19:00', '2009/6/25 20:00', '2009/6/25 21:00', '2009/6/25 22:00', '2009/6/25 23:00', '2009/6/26 0:00', '2009/6/26 1:00', '2009/6/26 2:00', '2009/6/26 3:00', '2009/6/26 4:00', '2009/6/26 5:00', '2009/6/26 6:00', '2009/6/26 7:00', '2009/6/26 8:00', '2009/6/26 9:00', '2009/6/26 10:00', '2009/6/26 11:00', '2009/6/26 12:00', '2009/6/26 13:00', '2009/6/26 14:00', '2009/6/26 15:00', '2009/6/26 16:00', '2009/6/26 17:00', '2009/6/26 18:00', '2009/6/26 19:00', '2009/6/26 20:00', '2009/6/26 21:00', '2009/6/26 22:00', '2009/6/26 23:00', '2009/6/27 0:00', '2009/6/27 1:00', '2009/6/27 2:00', '2009/6/27 3:00', '2009/6/27 4:00', '2009/6/27 5:00', '2009/6/27 6:00', '2009/6/27 7:00', '2009/6/27 8:00', '2009/6/27 9:00', '2009/6/27 10:00', '2009/6/27 11:00', '2009/6/27 12:00', '2009/6/27 13:00', '2009/6/27 14:00', '2009/6/27 15:00', '2009/6/27 16:00', '2009/6/27 17:00', '2009/6/27 18:00', '2009/6/27 19:00', '2009/6/27 20:00', '2009/6/27 21:00', '2009/6/27 22:00', '2009/6/27 23:00', '2009/6/28 0:00', '2009/6/28 1:00', '2009/6/28 2:00', '2009/6/28 3:00', '2009/6/28 4:00', '2009/6/28 5:00', '2009/6/28 6:00', '2009/6/28 7:00', '2009/6/28 8:00', '2009/6/28 9:00', '2009/6/28 10:00', '2009/6/28 11:00', '2009/6/28 12:00', '2009/6/28 13:00', '2009/6/28 14:00', '2009/6/28 15:00', '2009/6/28 16:00', '2009/6/28 17:00', '2009/6/28 18:00', '2009/6/28 19:00', '2009/6/28 20:00', '2009/6/28 21:00', '2009/6/28 22:00', '2009/6/28 23:00', '2009/6/29 0:00', '2009/6/29 1:00', '2009/6/29 2:00', '2009/6/29 3:00', '2009/6/29 4:00', '2009/6/29 5:00', '2009/6/29 6:00', '2009/6/29 7:00', '2009/6/29 8:00', '2009/6/29 9:00', '2009/6/29 10:00', '2009/6/29 11:00', '2009/6/29 12:00', '2009/6/29 13:00', '2009/6/29 14:00', '2009/6/29 15:00', '2009/6/29 16:00', '2009/6/29 17:00', '2009/6/29 18:00', '2009/6/29 19:00', '2009/6/29 20:00', '2009/6/29 21:00', '2009/6/29 22:00', '2009/6/29 23:00', '2009/6/30 0:00', '2009/6/30 1:00', '2009/6/30 2:00', '2009/6/30 3:00', '2009/6/30 4:00', '2009/6/30 5:00', '2009/6/30 6:00', '2009/6/30 7:00', '2009/6/30 8:00', '2009/6/30 9:00', '2009/6/30 10:00', '2009/6/30 11:00', '2009/6/30 12:00', '2009/6/30 13:00', '2009/6/30 14:00', '2009/6/30 15:00', '2009/6/30 16:00', '2009/6/30 17:00', '2009/6/30 18:00', '2009/6/30 19:00', '2009/6/30 20:00', '2009/6/30 21:00', '2009/6/30 22:00', '2009/6/30 23:00', '2009/7/1 0:00', '2009/7/1 1:00', '2009/7/1 2:00', '2009/7/1 3:00', '2009/7/1 4:00', '2009/7/1 5:00', '2009/7/1 6:00', '2009/7/1 7:00', '2009/7/1 8:00', '2009/7/1 9:00', '2009/7/1 10:00', '2009/7/1 11:00', '2009/7/1 12:00', '2009/7/1 13:00', '2009/7/1 14:00', '2009/7/1 15:00', '2009/7/1 16:00', '2009/7/1 17:00', '2009/7/1 18:00', '2009/7/1 19:00', '2009/7/1 20:00', '2009/7/1 21:00', '2009/7/1 22:00', '2009/7/1 23:00', '2009/7/2 0:00', '2009/7/2 1:00', '2009/7/2 2:00', '2009/7/2 3:00', '2009/7/2 4:00', '2009/7/2 5:00', '2009/7/2 6:00', '2009/7/2 7:00', '2009/7/2 8:00', '2009/7/2 9:00', '2009/7/2 10:00', '2009/7/2 11:00', '2009/7/2 12:00', '2009/7/2 13:00', '2009/7/2 14:00', '2009/7/2 15:00', '2009/7/2 16:00', '2009/7/2 17:00', '2009/7/2 18:00', '2009/7/2 19:00', '2009/7/2 20:00', '2009/7/2 21:00', '2009/7/2 22:00', '2009/7/2 23:00', '2009/7/3 0:00', '2009/7/3 1:00', '2009/7/3 2:00', '2009/7/3 3:00', '2009/7/3 4:00', '2009/7/3 5:00', '2009/7/3 6:00', '2009/7/3 7:00', '2009/7/3 8:00', '2009/7/3 9:00', '2009/7/3 10:00', '2009/7/3 11:00', '2009/7/3 12:00', '2009/7/3 13:00', '2009/7/3 14:00', '2009/7/3 15:00', '2009/7/3 16:00', '2009/7/3 17:00', '2009/7/3 18:00', '2009/7/3 19:00', '2009/7/3 20:00', '2009/7/3 21:00', '2009/7/3 22:00', '2009/7/3 23:00', '2009/7/4 0:00', '2009/7/4 1:00', '2009/7/4 2:00', '2009/7/4 3:00', '2009/7/4 4:00', '2009/7/4 5:00', '2009/7/4 6:00', '2009/7/4 7:00', '2009/7/4 8:00', '2009/7/4 9:00', '2009/7/4 10:00', '2009/7/4 11:00', '2009/7/4 12:00', '2009/7/4 13:00', '2009/7/4 14:00', '2009/7/4 15:00', '2009/7/4 16:00', '2009/7/4 17:00', '2009/7/4 18:00', '2009/7/4 19:00', '2009/7/4 20:00', '2009/7/4 21:00', '2009/7/4 22:00', '2009/7/4 23:00', '2009/7/5 0:00', '2009/7/5 1:00', '2009/7/5 2:00', '2009/7/5 3:00', '2009/7/5 4:00', '2009/7/5 5:00', '2009/7/5 6:00', '2009/7/5 7:00', '2009/7/5 8:00', '2009/7/5 9:00', '2009/7/5 10:00', '2009/7/5 11:00', '2009/7/5 12:00', '2009/7/5 13:00', '2009/7/5 14:00', '2009/7/5 15:00', '2009/7/5 16:00', '2009/7/5 17:00', '2009/7/5 18:00', '2009/7/5 19:00', '2009/7/5 20:00', '2009/7/5 21:00', '2009/7/5 22:00', '2009/7/5 23:00', '2009/7/6 0:00', '2009/7/6 1:00', '2009/7/6 2:00', '2009/7/6 3:00', '2009/7/6 4:00', '2009/7/6 5:00', '2009/7/6 6:00', '2009/7/6 7:00', '2009/7/6 8:00', '2009/7/6 9:00', '2009/7/6 10:00', '2009/7/6 11:00', '2009/7/6 12:00', '2009/7/6 13:00', '2009/7/6 14:00', '2009/7/6 15:00', '2009/7/6 16:00', '2009/7/6 17:00', '2009/7/6 18:00', '2009/7/6 19:00', '2009/7/6 20:00', '2009/7/6 21:00', '2009/7/6 22:00', '2009/7/6 23:00', '2009/7/7 0:00', '2009/7/7 1:00', '2009/7/7 2:00', '2009/7/7 3:00', '2009/7/7 4:00', '2009/7/7 5:00', '2009/7/7 6:00', '2009/7/7 7:00', '2009/7/7 8:00', '2009/7/7 9:00', '2009/7/7 10:00', '2009/7/7 11:00', '2009/7/7 12:00', '2009/7/7 13:00', '2009/7/7 14:00', '2009/7/7 15:00', '2009/7/7 16:00', '2009/7/7 17:00', '2009/7/7 18:00', '2009/7/7 19:00', '2009/7/7 20:00', '2009/7/7 21:00', '2009/7/7 22:00', '2009/7/7 23:00', '2009/7/8 0:00', '2009/7/8 1:00', '2009/7/8 2:00', '2009/7/8 3:00', '2009/7/8 4:00', '2009/7/8 5:00', '2009/7/8 6:00', '2009/7/8 7:00', '2009/7/8 8:00', '2009/7/8 9:00', '2009/7/8 10:00', '2009/7/8 11:00', '2009/7/8 12:00', '2009/7/8 13:00', '2009/7/8 14:00', '2009/7/8 15:00', '2009/7/8 16:00', '2009/7/8 17:00', '2009/7/8 18:00', '2009/7/8 19:00', '2009/7/8 20:00', '2009/7/8 21:00', '2009/7/8 22:00', '2009/7/8 23:00', '2009/7/9 0:00', '2009/7/9 1:00', '2009/7/9 2:00', '2009/7/9 3:00', '2009/7/9 4:00', '2009/7/9 5:00', '2009/7/9 6:00', '2009/7/9 7:00', '2009/7/9 8:00', '2009/7/9 9:00', '2009/7/9 10:00', '2009/7/9 11:00', '2009/7/9 12:00', '2009/7/9 13:00', '2009/7/9 14:00', '2009/7/9 15:00', '2009/7/9 16:00', '2009/7/9 17:00', '2009/7/9 18:00', '2009/7/9 19:00', '2009/7/9 20:00', '2009/7/9 21:00', '2009/7/9 22:00', '2009/7/9 23:00', '2009/7/10 0:00', '2009/7/10 1:00', '2009/7/10 2:00', '2009/7/10 3:00', '2009/7/10 4:00', '2009/7/10 5:00', '2009/7/10 6:00', '2009/7/10 7:00', '2009/7/10 8:00', '2009/7/10 9:00', '2009/7/10 10:00', '2009/7/10 11:00', '2009/7/10 12:00', '2009/7/10 13:00', '2009/7/10 14:00', '2009/7/10 15:00', '2009/7/10 16:00', '2009/7/10 17:00', '2009/7/10 18:00', '2009/7/10 19:00', '2009/7/10 20:00', '2009/7/10 21:00', '2009/7/10 22:00', '2009/7/10 23:00', '2009/7/11 0:00', '2009/7/11 1:00', '2009/7/11 2:00', '2009/7/11 3:00', '2009/7/11 4:00', '2009/7/11 5:00', '2009/7/11 6:00', '2009/7/11 7:00', '2009/7/11 8:00', '2009/7/11 9:00', '2009/7/11 10:00', '2009/7/11 11:00', '2009/7/11 12:00', '2009/7/11 13:00', '2009/7/11 14:00', '2009/7/11 15:00', '2009/7/11 16:00', '2009/7/11 17:00', '2009/7/11 18:00', '2009/7/11 19:00', '2009/7/11 20:00', '2009/7/11 21:00', '2009/7/11 22:00', '2009/7/11 23:00', '2009/7/12 0:00', '2009/7/12 1:00', '2009/7/12 2:00', '2009/7/12 3:00', '2009/7/12 4:00', '2009/7/12 5:00', '2009/7/12 6:00', '2009/7/12 7:00', '2009/7/12 8:00', '2009/7/12 9:00', '2009/7/12 10:00', '2009/7/12 11:00', '2009/7/12 12:00', '2009/7/12 13:00', '2009/7/12 14:00', '2009/7/12 15:00', '2009/7/12 16:00', '2009/7/12 17:00', '2009/7/12 18:00', '2009/7/12 19:00', '2009/7/12 20:00', '2009/7/12 21:00', '2009/7/12 22:00', '2009/7/12 23:00', '2009/7/13 0:00', '2009/7/13 1:00', '2009/7/13 2:00', '2009/7/13 3:00', '2009/7/13 4:00', '2009/7/13 5:00', '2009/7/13 6:00', '2009/7/13 7:00', '2009/7/13 8:00', '2009/7/13 9:00', '2009/7/13 10:00', '2009/7/13 11:00', '2009/7/13 12:00', '2009/7/13 13:00', '2009/7/13 14:00', '2009/7/13 15:00', '2009/7/13 16:00', '2009/7/13 17:00', '2009/7/13 18:00', '2009/7/13 19:00', '2009/7/13 20:00', '2009/7/13 21:00', '2009/7/13 22:00', '2009/7/13 23:00', '2009/7/14 0:00', '2009/7/14 1:00', '2009/7/14 2:00', '2009/7/14 3:00', '2009/7/14 4:00', '2009/7/14 5:00', '2009/7/14 6:00', '2009/7/14 7:00', '2009/7/14 8:00', '2009/7/14 9:00', '2009/7/14 10:00', '2009/7/14 11:00', '2009/7/14 12:00', '2009/7/14 13:00', '2009/7/14 14:00', '2009/7/14 15:00', '2009/7/14 16:00', '2009/7/14 17:00', '2009/7/14 18:00', '2009/7/14 19:00', '2009/7/14 20:00', '2009/7/14 21:00', '2009/7/14 22:00', '2009/7/14 23:00', '2009/7/15 0:00', '2009/7/15 1:00', '2009/7/15 2:00', '2009/7/15 3:00', '2009/7/15 4:00', '2009/7/15 5:00', '2009/7/15 6:00', '2009/7/15 7:00', '2009/7/15 8:00', '2009/7/15 9:00', '2009/7/15 10:00', '2009/7/15 11:00', '2009/7/15 12:00', '2009/7/15 13:00', '2009/7/15 14:00', '2009/7/15 15:00', '2009/7/15 16:00', '2009/7/15 17:00', '2009/7/15 18:00', '2009/7/15 19:00', '2009/7/15 20:00', '2009/7/15 21:00', '2009/7/15 22:00', '2009/7/15 23:00', '2009/7/16 0:00', '2009/7/16 1:00', '2009/7/16 2:00', '2009/7/16 3:00', '2009/7/16 4:00', '2009/7/16 5:00', '2009/7/16 6:00', '2009/7/16 7:00', '2009/7/16 8:00', '2009/7/16 9:00', '2009/7/16 10:00', '2009/7/16 11:00', '2009/7/16 12:00', '2009/7/16 13:00', '2009/7/16 14:00', '2009/7/16 15:00', '2009/7/16 16:00', '2009/7/16 17:00', '2009/7/16 18:00', '2009/7/16 19:00', '2009/7/16 20:00', '2009/7/16 21:00', '2009/7/16 22:00', '2009/7/16 23:00', '2009/7/17 0:00', '2009/7/17 1:00', '2009/7/17 2:00', '2009/7/17 3:00', '2009/7/17 4:00', '2009/7/17 5:00', '2009/7/17 6:00', '2009/7/17 7:00', '2009/7/17 8:00', '2009/7/17 9:00', '2009/7/17 10:00', '2009/7/17 11:00', '2009/7/17 12:00', '2009/7/17 13:00', '2009/7/17 14:00', '2009/7/17 15:00', '2009/7/17 16:00', '2009/7/17 17:00', '2009/7/17 18:00', '2009/7/17 19:00', '2009/7/17 20:00', '2009/7/17 21:00', '2009/7/17 22:00', '2009/7/17 23:00', '2009/7/18 0:00', '2009/7/18 1:00', '2009/7/18 2:00', '2009/7/18 3:00', '2009/7/18 4:00', '2009/7/18 5:00', '2009/7/18 6:00', '2009/7/18 7:00', '2009/7/18 8:00', '2009/7/18 9:00', '2009/7/18 10:00', '2009/7/18 11:00', '2009/7/18 12:00', '2009/7/18 13:00', '2009/7/18 14:00', '2009/7/18 15:00', '2009/7/18 16:00', '2009/7/18 17:00', '2009/7/18 18:00', '2009/7/18 19:00', '2009/7/18 20:00', '2009/7/18 21:00', '2009/7/18 22:00', '2009/7/18 23:00', '2009/7/19 0:00', '2009/7/19 1:00', '2009/7/19 2:00', '2009/7/19 3:00', '2009/7/19 4:00', '2009/7/19 5:00', '2009/7/19 6:00', '2009/7/19 7:00', '2009/7/19 8:00', '2009/7/19 9:00', '2009/7/19 10:00', '2009/7/19 11:00', '2009/7/19 12:00', '2009/7/19 13:00', '2009/7/19 14:00', '2009/7/19 15:00', '2009/7/19 16:00', '2009/7/19 17:00', '2009/7/19 18:00', '2009/7/19 19:00', '2009/7/19 20:00', '2009/7/19 21:00', '2009/7/19 22:00', '2009/7/19 23:00', '2009/7/20 0:00', '2009/7/20 1:00', '2009/7/20 2:00', '2009/7/20 3:00', '2009/7/20 4:00', '2009/7/20 5:00', '2009/7/20 6:00', '2009/7/20 7:00', '2009/7/20 8:00', '2009/7/20 9:00', '2009/7/20 10:00', '2009/7/20 11:00', '2009/7/20 12:00', '2009/7/20 13:00', '2009/7/20 14:00', '2009/7/20 15:00', '2009/7/20 16:00', '2009/7/20 17:00', '2009/7/20 18:00', '2009/7/20 19:00', '2009/7/20 20:00', '2009/7/20 21:00', '2009/7/20 22:00', '2009/7/20 23:00', '2009/7/21 0:00', '2009/7/21 1:00', '2009/7/21 2:00', '2009/7/21 3:00', '2009/7/21 4:00', '2009/7/21 5:00', '2009/7/21 6:00', '2009/7/21 7:00', '2009/7/21 8:00', '2009/7/21 9:00', '2009/7/21 10:00', '2009/7/21 11:00', '2009/7/21 12:00', '2009/7/21 13:00', '2009/7/21 14:00', '2009/7/21 15:00', '2009/7/21 16:00', '2009/7/21 17:00', '2009/7/21 18:00', '2009/7/21 19:00', '2009/7/21 20:00', '2009/7/21 21:00', '2009/7/21 22:00', '2009/7/21 23:00', '2009/7/22 0:00', '2009/7/22 1:00', '2009/7/22 2:00', '2009/7/22 3:00', '2009/7/22 4:00', '2009/7/22 5:00', '2009/7/22 6:00', '2009/7/22 7:00', '2009/7/22 8:00', '2009/7/22 9:00', '2009/7/22 10:00', '2009/7/22 11:00', '2009/7/22 12:00', '2009/7/22 13:00', '2009/7/22 14:00', '2009/7/22 15:00', '2009/7/22 16:00', '2009/7/22 17:00', '2009/7/22 18:00', '2009/7/22 19:00', '2009/7/22 20:00', '2009/7/22 21:00', '2009/7/22 22:00', '2009/7/22 23:00', '2009/7/23 0:00', '2009/7/23 1:00', '2009/7/23 2:00', '2009/7/23 3:00', '2009/7/23 4:00', '2009/7/23 5:00', '2009/7/23 6:00', '2009/7/23 7:00', '2009/7/23 8:00', '2009/7/23 9:00', '2009/7/23 10:00', '2009/7/23 11:00', '2009/7/23 12:00', '2009/7/23 13:00', '2009/7/23 14:00', '2009/7/23 15:00', '2009/7/23 16:00', '2009/7/23 17:00', '2009/7/23 18:00', '2009/7/23 19:00', '2009/7/23 20:00', '2009/7/23 21:00', '2009/7/23 22:00', '2009/7/23 23:00', '2009/7/24 0:00', '2009/7/24 1:00', '2009/7/24 2:00', '2009/7/24 3:00', '2009/7/24 4:00', '2009/7/24 5:00', '2009/7/24 6:00', '2009/7/24 7:00', '2009/7/24 8:00', '2009/7/24 9:00', '2009/7/24 10:00', '2009/7/24 11:00', '2009/7/24 12:00', '2009/7/24 13:00', '2009/7/24 14:00', '2009/7/24 15:00', '2009/7/24 16:00', '2009/7/24 17:00', '2009/7/24 18:00', '2009/7/24 19:00', '2009/7/24 20:00', '2009/7/24 21:00', '2009/7/24 22:00', '2009/7/24 23:00', '2009/7/25 0:00', '2009/7/25 1:00', '2009/7/25 2:00', '2009/7/25 3:00', '2009/7/25 4:00', '2009/7/25 5:00', '2009/7/25 6:00', '2009/7/25 7:00', '2009/7/25 8:00', '2009/7/25 9:00', '2009/7/25 10:00', '2009/7/25 11:00', '2009/7/25 12:00', '2009/7/25 13:00', '2009/7/25 14:00', '2009/7/25 15:00', '2009/7/25 16:00', '2009/7/25 17:00', '2009/7/25 18:00', '2009/7/25 19:00', '2009/7/25 20:00', '2009/7/25 21:00', '2009/7/25 22:00', '2009/7/25 23:00', '2009/7/26 0:00', '2009/7/26 1:00', '2009/7/26 2:00', '2009/7/26 3:00', '2009/7/26 4:00', '2009/7/26 5:00', '2009/7/26 6:00', '2009/7/26 7:00', '2009/7/26 8:00', '2009/7/26 9:00', '2009/7/26 10:00', '2009/7/26 11:00', '2009/7/26 12:00', '2009/7/26 13:00', '2009/7/26 14:00', '2009/7/26 15:00', '2009/7/26 16:00', '2009/7/26 17:00', '2009/7/26 18:00', '2009/7/26 19:00', '2009/7/26 20:00', '2009/7/26 21:00', '2009/7/26 22:00', '2009/7/26 23:00', '2009/7/27 0:00', '2009/7/27 1:00', '2009/7/27 2:00', '2009/7/27 3:00', '2009/7/27 4:00', '2009/7/27 5:00', '2009/7/27 6:00', '2009/7/27 7:00', '2009/7/27 8:00', '2009/7/27 9:00', '2009/7/27 10:00', '2009/7/27 11:00', '2009/7/27 12:00', '2009/7/27 13:00', '2009/7/27 14:00', '2009/7/27 15:00', '2009/7/27 16:00', '2009/7/27 17:00', '2009/7/27 18:00', '2009/7/27 19:00', '2009/7/27 20:00', '2009/7/27 21:00', '2009/7/27 22:00', '2009/7/27 23:00', '2009/7/28 0:00', '2009/7/28 1:00', '2009/7/28 2:00', '2009/7/28 3:00', '2009/7/28 4:00', '2009/7/28 5:00', '2009/7/28 6:00', '2009/7/28 7:00', '2009/7/28 8:00', '2009/7/28 9:00', '2009/7/28 10:00', '2009/7/28 11:00', '2009/7/28 12:00', '2009/7/28 13:00', '2009/7/28 14:00', '2009/7/28 15:00', '2009/7/28 16:00', '2009/7/28 17:00', '2009/7/28 18:00', '2009/7/28 19:00', '2009/7/28 20:00', '2009/7/28 21:00', '2009/7/28 22:00', '2009/7/28 23:00', '2009/7/29 0:00', '2009/7/29 1:00', '2009/7/29 2:00', '2009/7/29 3:00', '2009/7/29 4:00', '2009/7/29 5:00', '2009/7/29 6:00', '2009/7/29 7:00', '2009/7/29 8:00', '2009/7/29 9:00', '2009/7/29 10:00', '2009/7/29 11:00', '2009/7/29 12:00', '2009/7/29 13:00', '2009/7/29 14:00', '2009/7/29 15:00', '2009/7/29 16:00', '2009/7/29 17:00', '2009/7/29 18:00', '2009/7/29 19:00', '2009/7/29 20:00', '2009/7/29 21:00', '2009/7/29 22:00', '2009/7/29 23:00', '2009/7/30 0:00', '2009/7/30 1:00', '2009/7/30 2:00', '2009/7/30 3:00', '2009/7/30 4:00', '2009/7/30 5:00', '2009/7/30 6:00', '2009/7/30 7:00', '2009/7/30 8:00', '2009/7/30 9:00', '2009/7/30 10:00', '2009/7/30 11:00', '2009/7/30 12:00', '2009/7/30 13:00', '2009/7/30 14:00', '2009/7/30 15:00', '2009/7/30 16:00', '2009/7/30 17:00', '2009/7/30 18:00', '2009/7/30 19:00', '2009/7/30 20:00', '2009/7/30 21:00', '2009/7/30 22:00', '2009/7/30 23:00', '2009/7/31 0:00', '2009/7/31 1:00', '2009/7/31 2:00', '2009/7/31 3:00', '2009/7/31 4:00', '2009/7/31 5:00', '2009/7/31 6:00', '2009/7/31 7:00', '2009/7/31 8:00', '2009/7/31 9:00', '2009/7/31 10:00', '2009/7/31 11:00', '2009/7/31 12:00', '2009/7/31 13:00', '2009/7/31 14:00', '2009/7/31 15:00', '2009/7/31 16:00', '2009/7/31 17:00', '2009/7/31 18:00', '2009/7/31 19:00', '2009/7/31 20:00', '2009/7/31 21:00', '2009/7/31 22:00', '2009/7/31 23:00', '2009/8/1 0:00', '2009/8/1 1:00', '2009/8/1 2:00', '2009/8/1 3:00', '2009/8/1 4:00', '2009/8/1 5:00', '2009/8/1 6:00', '2009/8/1 7:00', '2009/8/1 8:00', '2009/8/1 9:00', '2009/8/1 10:00', '2009/8/1 11:00', '2009/8/1 12:00', '2009/8/1 13:00', '2009/8/1 14:00', '2009/8/1 15:00', '2009/8/1 16:00', '2009/8/1 17:00', '2009/8/1 18:00', '2009/8/1 19:00', '2009/8/1 20:00', '2009/8/1 21:00', '2009/8/1 22:00', '2009/8/1 23:00', '2009/8/2 0:00', '2009/8/2 1:00', '2009/8/2 2:00', '2009/8/2 3:00', '2009/8/2 4:00', '2009/8/2 5:00', '2009/8/2 6:00', '2009/8/2 7:00', '2009/8/2 8:00', '2009/8/2 9:00', '2009/8/2 10:00', '2009/8/2 11:00', '2009/8/2 12:00', '2009/8/2 13:00', '2009/8/2 14:00', '2009/8/2 15:00', '2009/8/2 16:00', '2009/8/2 17:00', '2009/8/2 18:00', '2009/8/2 19:00', '2009/8/2 20:00', '2009/8/2 21:00', '2009/8/2 22:00', '2009/8/2 23:00', '2009/8/3 0:00', '2009/8/3 1:00', '2009/8/3 2:00', '2009/8/3 3:00', '2009/8/3 4:00', '2009/8/3 5:00', '2009/8/3 6:00', '2009/8/3 7:00', '2009/8/3 8:00', '2009/8/3 9:00', '2009/8/3 10:00', '2009/8/3 11:00', '2009/8/3 12:00', '2009/8/3 13:00', '2009/8/3 14:00', '2009/8/3 15:00', '2009/8/3 16:00', '2009/8/3 17:00', '2009/8/3 18:00', '2009/8/3 19:00', '2009/8/3 20:00', '2009/8/3 21:00', '2009/8/3 22:00', '2009/8/3 23:00', '2009/8/4 0:00', '2009/8/4 1:00', '2009/8/4 2:00', '2009/8/4 3:00', '2009/8/4 4:00', '2009/8/4 5:00', '2009/8/4 6:00', '2009/8/4 7:00', '2009/8/4 8:00', '2009/8/4 9:00', '2009/8/4 10:00', '2009/8/4 11:00', '2009/8/4 12:00', '2009/8/4 13:00', '2009/8/4 14:00', '2009/8/4 15:00', '2009/8/4 16:00', '2009/8/4 17:00', '2009/8/4 18:00', '2009/8/4 19:00', '2009/8/4 20:00', '2009/8/4 21:00', '2009/8/4 22:00', '2009/8/4 23:00', '2009/8/5 0:00', '2009/8/5 1:00', '2009/8/5 2:00', '2009/8/5 3:00', '2009/8/5 4:00', '2009/8/5 5:00', '2009/8/5 6:00', '2009/8/5 7:00', '2009/8/5 8:00', '2009/8/5 9:00', '2009/8/5 10:00', '2009/8/5 11:00', '2009/8/5 12:00', '2009/8/5 13:00', '2009/8/5 14:00', '2009/8/5 15:00', '2009/8/5 16:00', '2009/8/5 17:00', '2009/8/5 18:00', '2009/8/5 19:00', '2009/8/5 20:00', '2009/8/5 21:00', '2009/8/5 22:00', '2009/8/5 23:00', '2009/8/6 0:00', '2009/8/6 1:00', '2009/8/6 2:00', '2009/8/6 3:00', '2009/8/6 4:00', '2009/8/6 5:00', '2009/8/6 6:00', '2009/8/6 7:00', '2009/8/6 8:00', '2009/8/6 9:00', '2009/8/6 10:00', '2009/8/6 11:00', '2009/8/6 12:00', '2009/8/6 13:00', '2009/8/6 14:00', '2009/8/6 15:00', '2009/8/6 16:00', '2009/8/6 17:00', '2009/8/6 18:00', '2009/8/6 19:00', '2009/8/6 20:00', '2009/8/6 21:00', '2009/8/6 22:00', '2009/8/6 23:00', '2009/8/7 0:00', '2009/8/7 1:00', '2009/8/7 2:00', '2009/8/7 3:00', '2009/8/7 4:00', '2009/8/7 5:00', '2009/8/7 6:00', '2009/8/7 7:00', '2009/8/7 8:00', '2009/8/7 9:00', '2009/8/7 10:00', '2009/8/7 11:00', '2009/8/7 12:00', '2009/8/7 13:00', '2009/8/7 14:00', '2009/8/7 15:00', '2009/8/7 16:00', '2009/8/7 17:00', '2009/8/7 18:00', '2009/8/7 19:00', '2009/8/7 20:00', '2009/8/7 21:00', '2009/8/7 22:00', '2009/8/7 23:00', '2009/8/8 0:00', '2009/8/8 1:00', '2009/8/8 2:00', '2009/8/8 3:00', '2009/8/8 4:00', '2009/8/8 5:00', '2009/8/8 6:00', '2009/8/8 7:00', '2009/8/8 8:00', '2009/8/8 9:00', '2009/8/8 10:00', '2009/8/8 11:00', '2009/8/8 12:00', '2009/8/8 13:00', '2009/8/8 14:00', '2009/8/8 15:00', '2009/8/8 16:00', '2009/8/8 17:00', '2009/8/8 18:00', '2009/8/8 19:00', '2009/8/8 20:00', '2009/8/8 21:00', '2009/8/8 22:00', '2009/8/8 23:00', '2009/8/9 0:00', '2009/8/9 1:00', '2009/8/9 2:00', '2009/8/9 3:00', '2009/8/9 4:00', '2009/8/9 5:00', '2009/8/9 6:00', '2009/8/9 7:00', '2009/8/9 8:00', '2009/8/9 9:00', '2009/8/9 10:00', '2009/8/9 11:00', '2009/8/9 12:00', '2009/8/9 13:00', '2009/8/9 14:00', '2009/8/9 15:00', '2009/8/9 16:00', '2009/8/9 17:00', '2009/8/9 18:00', '2009/8/9 19:00', '2009/8/9 20:00', '2009/8/9 21:00', '2009/8/9 22:00', '2009/8/9 23:00', '2009/8/10 0:00', '2009/8/10 1:00', '2009/8/10 2:00', '2009/8/10 3:00', '2009/8/10 4:00', '2009/8/10 5:00', '2009/8/10 6:00', '2009/8/10 7:00', '2009/8/10 8:00', '2009/8/10 9:00', '2009/8/10 10:00', '2009/8/10 11:00', '2009/8/10 12:00', '2009/8/10 13:00', '2009/8/10 14:00', '2009/8/10 15:00', '2009/8/10 16:00', '2009/8/10 17:00', '2009/8/10 18:00', '2009/8/10 19:00', '2009/8/10 20:00', '2009/8/10 21:00', '2009/8/10 22:00', '2009/8/10 23:00', '2009/8/11 0:00', '2009/8/11 1:00', '2009/8/11 2:00', '2009/8/11 3:00', '2009/8/11 4:00', '2009/8/11 5:00', '2009/8/11 6:00', '2009/8/11 7:00', '2009/8/11 8:00', '2009/8/11 9:00', '2009/8/11 10:00', '2009/8/11 11:00', '2009/8/11 12:00', '2009/8/11 13:00', '2009/8/11 14:00', '2009/8/11 15:00', '2009/8/11 16:00', '2009/8/11 17:00', '2009/8/11 18:00', '2009/8/11 19:00', '2009/8/11 20:00', '2009/8/11 21:00', '2009/8/11 22:00', '2009/8/11 23:00', '2009/8/12 0:00', '2009/8/12 1:00', '2009/8/12 2:00', '2009/8/12 3:00', '2009/8/12 4:00', '2009/8/12 5:00', '2009/8/12 6:00', '2009/8/12 7:00', '2009/8/12 8:00', '2009/8/12 9:00', '2009/8/12 10:00', '2009/8/12 11:00', '2009/8/12 12:00', '2009/8/12 13:00', '2009/8/12 14:00', '2009/8/12 15:00', '2009/8/12 16:00', '2009/8/12 17:00', '2009/8/12 18:00', '2009/8/12 19:00', '2009/8/12 20:00', '2009/8/12 21:00', '2009/8/12 22:00', '2009/8/12 23:00', '2009/8/13 0:00', '2009/8/13 1:00', '2009/8/13 2:00', '2009/8/13 3:00', '2009/8/13 4:00', '2009/8/13 5:00', '2009/8/13 6:00', '2009/8/13 7:00', '2009/8/13 8:00', '2009/8/13 9:00', '2009/8/13 10:00', '2009/8/13 11:00', '2009/8/13 12:00', '2009/8/13 13:00', '2009/8/13 14:00', '2009/8/13 15:00', '2009/8/13 16:00', '2009/8/13 17:00', '2009/8/13 18:00', '2009/8/13 19:00', '2009/8/13 20:00', '2009/8/13 21:00', '2009/8/13 22:00', '2009/8/13 23:00', '2009/8/14 0:00', '2009/8/14 1:00', '2009/8/14 2:00', '2009/8/14 3:00', '2009/8/14 4:00', '2009/8/14 5:00', '2009/8/14 6:00', '2009/8/14 7:00', '2009/8/14 8:00', '2009/8/14 9:00', '2009/8/14 10:00', '2009/8/14 11:00', '2009/8/14 12:00', '2009/8/14 13:00', '2009/8/14 14:00', '2009/8/14 15:00', '2009/8/14 16:00', '2009/8/14 17:00', '2009/8/14 18:00', '2009/8/14 19:00', '2009/8/14 20:00', '2009/8/14 21:00', '2009/8/14 22:00', '2009/8/14 23:00', '2009/8/15 0:00', '2009/8/15 1:00', '2009/8/15 2:00', '2009/8/15 3:00', '2009/8/15 4:00', '2009/8/15 5:00', '2009/8/15 6:00', '2009/8/15 7:00', '2009/8/15 8:00', '2009/8/15 9:00', '2009/8/15 10:00', '2009/8/15 11:00', '2009/8/15 12:00', '2009/8/15 13:00', '2009/8/15 14:00', '2009/8/15 15:00', '2009/8/15 16:00', '2009/8/15 17:00', '2009/8/15 18:00', '2009/8/15 19:00', '2009/8/15 20:00', '2009/8/15 21:00', '2009/8/15 22:00', '2009/8/15 23:00', '2009/8/16 0:00', '2009/8/16 1:00', '2009/8/16 2:00', '2009/8/16 3:00', '2009/8/16 4:00', '2009/8/16 5:00', '2009/8/16 6:00', '2009/8/16 7:00', '2009/8/16 8:00', '2009/8/16 9:00', '2009/8/16 10:00', '2009/8/16 11:00', '2009/8/16 12:00', '2009/8/16 13:00', '2009/8/16 14:00', '2009/8/16 15:00', '2009/8/16 16:00', '2009/8/16 17:00', '2009/8/16 18:00', '2009/8/16 19:00', '2009/8/16 20:00', '2009/8/16 21:00', '2009/8/16 22:00', '2009/8/16 23:00', '2009/8/17 0:00', '2009/8/17 1:00', '2009/8/17 2:00', '2009/8/17 3:00', '2009/8/17 4:00', '2009/8/17 5:00', '2009/8/17 6:00', '2009/8/17 7:00', '2009/8/17 8:00', '2009/8/17 9:00', '2009/8/17 10:00', '2009/8/17 11:00', '2009/8/17 12:00', '2009/8/17 13:00', '2009/8/17 14:00', '2009/8/17 15:00', '2009/8/17 16:00', '2009/8/17 17:00', '2009/8/17 18:00', '2009/8/17 19:00', '2009/8/17 20:00', '2009/8/17 21:00', '2009/8/17 22:00', '2009/8/17 23:00', '2009/8/18 0:00', '2009/8/18 1:00', '2009/8/18 2:00', '2009/8/18 3:00', '2009/8/18 4:00', '2009/8/18 5:00', '2009/8/18 6:00', '2009/8/18 7:00', '2009/8/18 8:00', '2009/8/18 9:00', '2009/8/18 10:00', '2009/8/18 11:00', '2009/8/18 12:00', '2009/8/18 13:00', '2009/8/18 14:00', '2009/8/18 15:00', '2009/8/18 16:00', '2009/8/18 17:00', '2009/8/18 18:00', '2009/8/18 19:00', '2009/8/18 20:00', '2009/8/18 21:00', '2009/8/18 22:00', '2009/8/18 23:00', '2009/8/19 0:00', '2009/8/19 1:00', '2009/8/19 2:00', '2009/8/19 3:00', '2009/8/19 4:00', '2009/8/19 5:00', '2009/8/19 6:00', '2009/8/19 7:00', '2009/8/19 8:00', '2009/8/19 9:00', '2009/8/19 10:00', '2009/8/19 11:00', '2009/8/19 12:00', '2009/8/19 13:00', '2009/8/19 14:00', '2009/8/19 15:00', '2009/8/19 16:00', '2009/8/19 17:00', '2009/8/19 18:00', '2009/8/19 19:00', '2009/8/19 20:00', '2009/8/19 21:00', '2009/8/19 22:00', '2009/8/19 23:00', '2009/8/20 0:00', '2009/8/20 1:00', '2009/8/20 2:00', '2009/8/20 3:00', '2009/8/20 4:00', '2009/8/20 5:00', '2009/8/20 6:00', '2009/8/20 7:00', '2009/8/20 8:00', '2009/8/20 9:00', '2009/8/20 10:00', '2009/8/20 11:00', '2009/8/20 12:00', '2009/8/20 13:00', '2009/8/20 14:00', '2009/8/20 15:00', '2009/8/20 16:00', '2009/8/20 17:00', '2009/8/20 18:00', '2009/8/20 19:00', '2009/8/20 20:00', '2009/8/20 21:00', '2009/8/20 22:00', '2009/8/20 23:00', '2009/8/21 0:00', '2009/8/21 1:00', '2009/8/21 2:00', '2009/8/21 3:00', '2009/8/21 4:00', '2009/8/21 5:00', '2009/8/21 6:00', '2009/8/21 7:00', '2009/8/21 8:00', '2009/8/21 9:00', '2009/8/21 10:00', '2009/8/21 11:00', '2009/8/21 12:00', '2009/8/21 13:00', '2009/8/21 14:00', '2009/8/21 15:00', '2009/8/21 16:00', '2009/8/21 17:00', '2009/8/21 18:00', '2009/8/21 19:00', '2009/8/21 20:00', '2009/8/21 21:00', '2009/8/21 22:00', '2009/8/21 23:00', '2009/8/22 0:00', '2009/8/22 1:00', '2009/8/22 2:00', '2009/8/22 3:00', '2009/8/22 4:00', '2009/8/22 5:00', '2009/8/22 6:00', '2009/8/22 7:00', '2009/8/22 8:00', '2009/8/22 9:00', '2009/8/22 10:00', '2009/8/22 11:00', '2009/8/22 12:00', '2009/8/22 13:00', '2009/8/22 14:00', '2009/8/22 15:00', '2009/8/22 16:00', '2009/8/22 17:00', '2009/8/22 18:00', '2009/8/22 19:00', '2009/8/22 20:00', '2009/8/22 21:00', '2009/8/22 22:00', '2009/8/22 23:00', '2009/8/23 0:00', '2009/8/23 1:00', '2009/8/23 2:00', '2009/8/23 3:00', '2009/8/23 4:00', '2009/8/23 5:00', '2009/8/23 6:00', '2009/8/23 7:00', '2009/8/23 8:00', '2009/8/23 9:00', '2009/8/23 10:00', '2009/8/23 11:00', '2009/8/23 12:00', '2009/8/23 13:00', '2009/8/23 14:00', '2009/8/23 15:00', '2009/8/23 16:00', '2009/8/23 17:00', '2009/8/23 18:00', '2009/8/23 19:00', '2009/8/23 20:00', '2009/8/23 21:00', '2009/8/23 22:00', '2009/8/23 23:00', '2009/8/24 0:00', '2009/8/24 1:00', '2009/8/24 2:00', '2009/8/24 3:00', '2009/8/24 4:00', '2009/8/24 5:00', '2009/8/24 6:00', '2009/8/24 7:00', '2009/8/24 8:00', '2009/8/24 9:00', '2009/8/24 10:00', '2009/8/24 11:00', '2009/8/24 12:00', '2009/8/24 13:00', '2009/8/24 14:00', '2009/8/24 15:00', '2009/8/24 16:00', '2009/8/24 17:00', '2009/8/24 18:00', '2009/8/24 19:00', '2009/8/24 20:00', '2009/8/24 21:00', '2009/8/24 22:00', '2009/8/24 23:00', '2009/8/25 0:00', '2009/8/25 1:00', '2009/8/25 2:00', '2009/8/25 3:00', '2009/8/25 4:00', '2009/8/25 5:00', '2009/8/25 6:00', '2009/8/25 7:00', '2009/8/25 8:00', '2009/8/25 9:00', '2009/8/25 10:00', '2009/8/25 11:00', '2009/8/25 12:00', '2009/8/25 13:00', '2009/8/25 14:00', '2009/8/25 15:00', '2009/8/25 16:00', '2009/8/25 17:00', '2009/8/25 18:00', '2009/8/25 19:00', '2009/8/25 20:00', '2009/8/25 21:00', '2009/8/25 22:00', '2009/8/25 23:00', '2009/8/26 0:00', '2009/8/26 1:00', '2009/8/26 2:00', '2009/8/26 3:00', '2009/8/26 4:00', '2009/8/26 5:00', '2009/8/26 6:00', '2009/8/26 7:00', '2009/8/26 8:00', '2009/8/26 9:00', '2009/8/26 10:00', '2009/8/26 11:00', '2009/8/26 12:00', '2009/8/26 13:00', '2009/8/26 14:00', '2009/8/26 15:00', '2009/8/26 16:00', '2009/8/26 17:00', '2009/8/26 18:00', '2009/8/26 19:00', '2009/8/26 20:00', '2009/8/26 21:00', '2009/8/26 22:00', '2009/8/26 23:00', '2009/8/27 0:00', '2009/8/27 1:00', '2009/8/27 2:00', '2009/8/27 3:00', '2009/8/27 4:00', '2009/8/27 5:00', '2009/8/27 6:00', '2009/8/27 7:00', '2009/8/27 8:00', '2009/8/27 9:00', '2009/8/27 10:00', '2009/8/27 11:00', '2009/8/27 12:00', '2009/8/27 13:00', '2009/8/27 14:00', '2009/8/27 15:00', '2009/8/27 16:00', '2009/8/27 17:00', '2009/8/27 18:00', '2009/8/27 19:00', '2009/8/27 20:00', '2009/8/27 21:00', '2009/8/27 22:00', '2009/8/27 23:00', '2009/8/28 0:00', '2009/8/28 1:00', '2009/8/28 2:00', '2009/8/28 3:00', '2009/8/28 4:00', '2009/8/28 5:00', '2009/8/28 6:00', '2009/8/28 7:00', '2009/8/28 8:00', '2009/8/28 9:00', '2009/8/28 10:00', '2009/8/28 11:00', '2009/8/28 12:00', '2009/8/28 13:00', '2009/8/28 14:00', '2009/8/28 15:00', '2009/8/28 16:00', '2009/8/28 17:00', '2009/8/28 18:00', '2009/8/28 19:00', '2009/8/28 20:00', '2009/8/28 21:00', '2009/8/28 22:00', '2009/8/28 23:00', '2009/8/29 0:00', '2009/8/29 1:00', '2009/8/29 2:00', '2009/8/29 3:00', '2009/8/29 4:00', '2009/8/29 5:00', '2009/8/29 6:00', '2009/8/29 7:00', '2009/8/29 8:00', '2009/8/29 9:00', '2009/8/29 10:00', '2009/8/29 11:00', '2009/8/29 12:00', '2009/8/29 13:00', '2009/8/29 14:00', '2009/8/29 15:00', '2009/8/29 16:00', '2009/8/29 17:00', '2009/8/29 18:00', '2009/8/29 19:00', '2009/8/29 20:00', '2009/8/29 21:00', '2009/8/29 22:00', '2009/8/29 23:00', '2009/8/30 0:00', '2009/8/30 1:00', '2009/8/30 2:00', '2009/8/30 3:00', '2009/8/30 4:00', '2009/8/30 5:00', '2009/8/30 6:00', '2009/8/30 7:00', '2009/8/30 8:00', '2009/8/30 9:00', '2009/8/30 10:00', '2009/8/30 11:00', '2009/8/30 12:00', '2009/8/30 13:00', '2009/8/30 14:00', '2009/8/30 15:00', '2009/8/30 16:00', '2009/8/30 17:00', '2009/8/30 18:00', '2009/8/30 19:00', '2009/8/30 20:00', '2009/8/30 21:00', '2009/8/30 22:00', '2009/8/30 23:00', '2009/8/31 0:00', '2009/8/31 1:00', '2009/8/31 2:00', '2009/8/31 3:00', '2009/8/31 4:00', '2009/8/31 5:00', '2009/8/31 6:00', '2009/8/31 7:00', '2009/8/31 8:00', '2009/8/31 9:00', '2009/8/31 10:00', '2009/8/31 11:00', '2009/8/31 12:00', '2009/8/31 13:00', '2009/8/31 14:00', '2009/8/31 15:00', '2009/8/31 16:00', '2009/8/31 17:00', '2009/8/31 18:00', '2009/8/31 19:00', '2009/8/31 20:00', '2009/8/31 21:00', '2009/8/31 22:00', '2009/8/31 23:00', '2009/9/1 0:00', '2009/9/1 1:00', '2009/9/1 2:00', '2009/9/1 3:00', '2009/9/1 4:00', '2009/9/1 5:00', '2009/9/1 6:00', '2009/9/1 7:00', '2009/9/1 8:00', '2009/9/1 9:00', '2009/9/1 10:00', '2009/9/1 11:00', '2009/9/1 12:00', '2009/9/1 13:00', '2009/9/1 14:00', '2009/9/1 15:00', '2009/9/1 16:00', '2009/9/1 17:00', '2009/9/1 18:00', '2009/9/1 19:00', '2009/9/1 20:00', '2009/9/1 21:00', '2009/9/1 22:00', '2009/9/1 23:00', '2009/9/2 0:00', '2009/9/2 1:00', '2009/9/2 2:00', '2009/9/2 3:00', '2009/9/2 4:00', '2009/9/2 5:00', '2009/9/2 6:00', '2009/9/2 7:00', '2009/9/2 8:00', '2009/9/2 9:00', '2009/9/2 10:00', '2009/9/2 11:00', '2009/9/2 12:00', '2009/9/2 13:00', '2009/9/2 14:00', '2009/9/2 15:00', '2009/9/2 16:00', '2009/9/2 17:00', '2009/9/2 18:00', '2009/9/2 19:00', '2009/9/2 20:00', '2009/9/2 21:00', '2009/9/2 22:00', '2009/9/2 23:00', '2009/9/3 0:00', '2009/9/3 1:00', '2009/9/3 2:00', '2009/9/3 3:00', '2009/9/3 4:00', '2009/9/3 5:00', '2009/9/3 6:00', '2009/9/3 7:00', '2009/9/3 8:00', '2009/9/3 9:00', '2009/9/3 10:00', '2009/9/3 11:00', '2009/9/3 12:00', '2009/9/3 13:00', '2009/9/3 14:00', '2009/9/3 15:00', '2009/9/3 16:00', '2009/9/3 17:00', '2009/9/3 18:00', '2009/9/3 19:00', '2009/9/3 20:00', '2009/9/3 21:00', '2009/9/3 22:00', '2009/9/3 23:00', '2009/9/4 0:00', '2009/9/4 1:00', '2009/9/4 2:00', '2009/9/4 3:00', '2009/9/4 4:00', '2009/9/4 5:00', '2009/9/4 6:00', '2009/9/4 7:00', '2009/9/4 8:00', '2009/9/4 9:00', '2009/9/4 10:00', '2009/9/4 11:00', '2009/9/4 12:00', '2009/9/4 13:00', '2009/9/4 14:00', '2009/9/4 15:00', '2009/9/4 16:00', '2009/9/4 17:00', '2009/9/4 18:00', '2009/9/4 19:00', '2009/9/4 20:00', '2009/9/4 21:00', '2009/9/4 22:00', '2009/9/4 23:00', '2009/9/5 0:00', '2009/9/5 1:00', '2009/9/5 2:00', '2009/9/5 3:00', '2009/9/5 4:00', '2009/9/5 5:00', '2009/9/5 6:00', '2009/9/5 7:00', '2009/9/5 8:00', '2009/9/5 9:00', '2009/9/5 10:00', '2009/9/5 11:00', '2009/9/5 12:00', '2009/9/5 13:00', '2009/9/5 14:00', '2009/9/5 15:00', '2009/9/5 16:00', '2009/9/5 17:00', '2009/9/5 18:00', '2009/9/5 19:00', '2009/9/5 20:00', '2009/9/5 21:00', '2009/9/5 22:00', '2009/9/5 23:00', '2009/9/6 0:00', '2009/9/6 1:00', '2009/9/6 2:00', '2009/9/6 3:00', '2009/9/6 4:00', '2009/9/6 5:00', '2009/9/6 6:00', '2009/9/6 7:00', '2009/9/6 8:00', '2009/9/6 9:00', '2009/9/6 10:00', '2009/9/6 11:00', '2009/9/6 12:00', '2009/9/6 13:00', '2009/9/6 14:00', '2009/9/6 15:00', '2009/9/6 16:00', '2009/9/6 17:00', '2009/9/6 18:00', '2009/9/6 19:00', '2009/9/6 20:00', '2009/9/6 21:00', '2009/9/6 22:00', '2009/9/6 23:00', '2009/9/7 0:00', '2009/9/7 1:00', '2009/9/7 2:00', '2009/9/7 3:00', '2009/9/7 4:00', '2009/9/7 5:00', '2009/9/7 6:00', '2009/9/7 7:00', '2009/9/7 8:00', '2009/9/7 9:00', '2009/9/7 10:00', '2009/9/7 11:00', '2009/9/7 12:00', '2009/9/7 13:00', '2009/9/7 14:00', '2009/9/7 15:00', '2009/9/7 16:00', '2009/9/7 17:00', '2009/9/7 18:00', '2009/9/7 19:00', '2009/9/7 20:00', '2009/9/7 21:00', '2009/9/7 22:00', '2009/9/7 23:00', '2009/9/8 0:00', '2009/9/8 1:00', '2009/9/8 2:00', '2009/9/8 3:00', '2009/9/8 4:00', '2009/9/8 5:00', '2009/9/8 6:00', '2009/9/8 7:00', '2009/9/8 8:00', '2009/9/8 9:00', '2009/9/8 10:00', '2009/9/8 11:00', '2009/9/8 12:00', '2009/9/8 13:00', '2009/9/8 14:00', '2009/9/8 15:00', '2009/9/8 16:00', '2009/9/8 17:00', '2009/9/8 18:00', '2009/9/8 19:00', '2009/9/8 20:00', '2009/9/8 21:00', '2009/9/8 22:00', '2009/9/8 23:00', '2009/9/9 0:00', '2009/9/9 1:00', '2009/9/9 2:00', '2009/9/9 3:00', '2009/9/9 4:00', '2009/9/9 5:00', '2009/9/9 6:00', '2009/9/9 7:00', '2009/9/9 8:00', '2009/9/9 9:00', '2009/9/9 10:00', '2009/9/9 11:00', '2009/9/9 12:00', '2009/9/9 13:00', '2009/9/9 14:00', '2009/9/9 15:00', '2009/9/9 16:00', '2009/9/9 17:00', '2009/9/9 18:00', '2009/9/9 19:00', '2009/9/9 20:00', '2009/9/9 21:00', '2009/9/9 22:00', '2009/9/9 23:00', '2009/9/10 0:00', '2009/9/10 1:00', '2009/9/10 2:00', '2009/9/10 3:00', '2009/9/10 4:00', '2009/9/10 5:00', '2009/9/10 6:00', '2009/9/10 7:00', '2009/9/10 8:00', '2009/9/10 9:00', '2009/9/10 10:00', '2009/9/10 11:00', '2009/9/10 12:00', '2009/9/10 13:00', '2009/9/10 14:00', '2009/9/10 15:00', '2009/9/10 16:00', '2009/9/10 17:00', '2009/9/10 18:00', '2009/9/10 19:00', '2009/9/10 20:00', '2009/9/10 21:00', '2009/9/10 22:00', '2009/9/10 23:00', '2009/9/11 0:00', '2009/9/11 1:00', '2009/9/11 2:00', '2009/9/11 3:00', '2009/9/11 4:00', '2009/9/11 5:00', '2009/9/11 6:00', '2009/9/11 7:00', '2009/9/11 8:00', '2009/9/11 9:00', '2009/9/11 10:00', '2009/9/11 11:00', '2009/9/11 12:00', '2009/9/11 13:00', '2009/9/11 14:00', '2009/9/11 15:00', '2009/9/11 16:00', '2009/9/11 17:00', '2009/9/11 18:00', '2009/9/11 19:00', '2009/9/11 20:00', '2009/9/11 21:00', '2009/9/11 22:00', '2009/9/11 23:00', '2009/9/12 0:00', '2009/9/12 1:00', '2009/9/12 2:00', '2009/9/12 3:00', '2009/9/12 4:00', '2009/9/12 5:00', '2009/9/12 6:00', '2009/9/12 7:00', '2009/9/12 8:00', '2009/9/12 9:00', '2009/9/12 10:00', '2009/9/12 11:00', '2009/9/12 12:00', '2009/9/12 13:00', '2009/9/12 14:00', '2009/9/12 15:00', '2009/9/12 16:00', '2009/9/12 17:00', '2009/9/12 18:00', '2009/9/12 19:00', '2009/9/12 20:00', '2009/9/12 21:00', '2009/9/12 22:00', '2009/9/12 23:00', '2009/9/13 0:00', '2009/9/13 1:00', '2009/9/13 2:00', '2009/9/13 3:00', '2009/9/13 4:00', '2009/9/13 5:00', '2009/9/13 6:00', '2009/9/13 7:00', '2009/9/13 8:00', '2009/9/13 9:00', '2009/9/13 10:00', '2009/9/13 11:00', '2009/9/13 12:00', '2009/9/13 13:00', '2009/9/13 14:00', '2009/9/13 15:00', '2009/9/13 16:00', '2009/9/13 17:00', '2009/9/13 18:00', '2009/9/13 19:00', '2009/9/13 20:00', '2009/9/13 21:00', '2009/9/13 22:00', '2009/9/13 23:00', '2009/9/14 0:00', '2009/9/14 1:00', '2009/9/14 2:00', '2009/9/14 3:00', '2009/9/14 4:00', '2009/9/14 5:00', '2009/9/14 6:00', '2009/9/14 7:00', '2009/9/14 8:00', '2009/9/14 9:00', '2009/9/14 10:00', '2009/9/14 11:00', '2009/9/14 12:00', '2009/9/14 13:00', '2009/9/14 14:00', '2009/9/14 15:00', '2009/9/14 16:00', '2009/9/14 17:00', '2009/9/14 18:00', '2009/9/14 19:00', '2009/9/14 20:00', '2009/9/14 21:00', '2009/9/14 22:00', '2009/9/14 23:00', '2009/9/15 0:00', '2009/9/15 1:00', '2009/9/15 2:00', '2009/9/15 3:00', '2009/9/15 4:00', '2009/9/15 5:00', '2009/9/15 6:00', '2009/9/15 7:00', '2009/9/15 8:00', '2009/9/15 9:00', '2009/9/15 10:00', '2009/9/15 11:00', '2009/9/15 12:00', '2009/9/15 13:00', '2009/9/15 14:00', '2009/9/15 15:00', '2009/9/15 16:00', '2009/9/15 17:00', '2009/9/15 18:00', '2009/9/15 19:00', '2009/9/15 20:00', '2009/9/15 21:00', '2009/9/15 22:00', '2009/9/15 23:00', '2009/9/16 0:00', '2009/9/16 1:00', '2009/9/16 2:00', '2009/9/16 3:00', '2009/9/16 4:00', '2009/9/16 5:00', '2009/9/16 6:00', '2009/9/16 7:00', '2009/9/16 8:00', '2009/9/16 9:00', '2009/9/16 10:00', '2009/9/16 11:00', '2009/9/16 12:00', '2009/9/16 13:00', '2009/9/16 14:00', '2009/9/16 15:00', '2009/9/16 16:00', '2009/9/16 17:00', '2009/9/16 18:00', '2009/9/16 19:00', '2009/9/16 20:00', '2009/9/16 21:00', '2009/9/16 22:00', '2009/9/16 23:00', '2009/9/17 0:00', '2009/9/17 1:00', '2009/9/17 2:00', '2009/9/17 3:00', '2009/9/17 4:00', '2009/9/17 5:00', '2009/9/17 6:00', '2009/9/17 7:00', '2009/9/17 8:00', '2009/9/17 9:00', '2009/9/17 10:00', '2009/9/17 11:00', '2009/9/17 12:00', '2009/9/17 13:00', '2009/9/17 14:00', '2009/9/17 15:00', '2009/9/17 16:00', '2009/9/17 17:00', '2009/9/17 18:00', '2009/9/17 19:00', '2009/9/17 20:00', '2009/9/17 21:00', '2009/9/17 22:00', '2009/9/17 23:00', '2009/9/18 0:00', '2009/9/18 1:00', '2009/9/18 2:00', '2009/9/18 3:00', '2009/9/18 4:00', '2009/9/18 5:00', '2009/9/18 6:00', '2009/9/18 7:00', '2009/9/18 8:00', '2009/9/18 9:00', '2009/9/18 10:00', '2009/9/18 11:00', '2009/9/18 12:00', '2009/9/18 13:00', '2009/9/18 14:00', '2009/9/18 15:00', '2009/9/18 16:00', '2009/9/18 17:00', '2009/9/18 18:00', '2009/9/18 19:00', '2009/9/18 20:00', '2009/9/18 21:00', '2009/9/18 22:00', '2009/9/18 23:00', '2009/9/19 0:00', '2009/9/19 1:00', '2009/9/19 2:00', '2009/9/19 3:00', '2009/9/19 4:00', '2009/9/19 5:00', '2009/9/19 6:00', '2009/9/19 7:00', '2009/9/19 8:00', '2009/9/19 9:00', '2009/9/19 10:00', '2009/9/19 11:00', '2009/9/19 12:00', '2009/9/19 13:00', '2009/9/19 14:00', '2009/9/19 15:00', '2009/9/19 16:00', '2009/9/19 17:00', '2009/9/19 18:00', '2009/9/19 19:00', '2009/9/19 20:00', '2009/9/19 21:00', '2009/9/19 22:00', '2009/9/19 23:00', '2009/9/20 0:00', '2009/9/20 1:00', '2009/9/20 2:00', '2009/9/20 3:00', '2009/9/20 4:00', '2009/9/20 5:00', '2009/9/20 6:00', '2009/9/20 7:00', '2009/9/20 8:00', '2009/9/20 9:00', '2009/9/20 10:00', '2009/9/20 11:00', '2009/9/20 12:00', '2009/9/20 13:00', '2009/9/20 14:00', '2009/9/20 15:00', '2009/9/20 16:00', '2009/9/20 17:00', '2009/9/20 18:00', '2009/9/20 19:00', '2009/9/20 20:00', '2009/9/20 21:00', '2009/9/20 22:00', '2009/9/20 23:00', '2009/9/21 0:00', '2009/9/21 1:00', '2009/9/21 2:00', '2009/9/21 3:00', '2009/9/21 4:00', '2009/9/21 5:00', '2009/9/21 6:00', '2009/9/21 7:00', '2009/9/21 8:00', '2009/9/21 9:00', '2009/9/21 10:00', '2009/9/21 11:00', '2009/9/21 12:00', '2009/9/21 13:00', '2009/9/21 14:00', '2009/9/21 15:00', '2009/9/21 16:00', '2009/9/21 17:00', '2009/9/21 18:00', '2009/9/21 19:00', '2009/9/21 20:00', '2009/9/21 21:00', '2009/9/21 22:00', '2009/9/21 23:00', '2009/9/22 0:00', '2009/9/22 1:00', '2009/9/22 2:00', '2009/9/22 3:00', '2009/9/22 4:00', '2009/9/22 5:00', '2009/9/22 6:00', '2009/9/22 7:00', '2009/9/22 8:00', '2009/9/22 9:00', '2009/9/22 10:00', '2009/9/22 11:00', '2009/9/22 12:00', '2009/9/22 13:00', '2009/9/22 14:00', '2009/9/22 15:00', '2009/9/22 16:00', '2009/9/22 17:00', '2009/9/22 18:00', '2009/9/22 19:00', '2009/9/22 20:00', '2009/9/22 21:00', '2009/9/22 22:00', '2009/9/22 23:00', '2009/9/23 0:00', '2009/9/23 1:00', '2009/9/23 2:00', '2009/9/23 3:00', '2009/9/23 4:00', '2009/9/23 5:00', '2009/9/23 6:00', '2009/9/23 7:00', '2009/9/23 8:00', '2009/9/23 9:00', '2009/9/23 10:00', '2009/9/23 11:00', '2009/9/23 12:00', '2009/9/23 13:00', '2009/9/23 14:00', '2009/9/23 15:00', '2009/9/23 16:00', '2009/9/23 17:00', '2009/9/23 18:00', '2009/9/23 19:00', '2009/9/23 20:00', '2009/9/23 21:00', '2009/9/23 22:00', '2009/9/23 23:00', '2009/9/24 0:00', '2009/9/24 1:00', '2009/9/24 2:00', '2009/9/24 3:00', '2009/9/24 4:00', '2009/9/24 5:00', '2009/9/24 6:00', '2009/9/24 7:00', '2009/9/24 8:00', '2009/9/24 9:00', '2009/9/24 10:00', '2009/9/24 11:00', '2009/9/24 12:00', '2009/9/24 13:00', '2009/9/24 14:00', '2009/9/24 15:00', '2009/9/24 16:00', '2009/9/24 17:00', '2009/9/24 18:00', '2009/9/24 19:00', '2009/9/24 20:00', '2009/9/24 21:00', '2009/9/24 22:00', '2009/9/24 23:00', '2009/9/25 0:00', '2009/9/25 1:00', '2009/9/25 2:00', '2009/9/25 3:00', '2009/9/25 4:00', '2009/9/25 5:00', '2009/9/25 6:00', '2009/9/25 7:00', '2009/9/25 8:00', '2009/9/25 9:00', '2009/9/25 10:00', '2009/9/25 11:00', '2009/9/25 12:00', '2009/9/25 13:00', '2009/9/25 14:00', '2009/9/25 15:00', '2009/9/25 16:00', '2009/9/25 17:00', '2009/9/25 18:00', '2009/9/25 19:00', '2009/9/25 20:00', '2009/9/25 21:00', '2009/9/25 22:00', '2009/9/25 23:00', '2009/9/26 0:00', '2009/9/26 1:00', '2009/9/26 2:00', '2009/9/26 3:00', '2009/9/26 4:00', '2009/9/26 5:00', '2009/9/26 6:00', '2009/9/26 7:00', '2009/9/26 8:00', '2009/9/26 9:00', '2009/9/26 10:00', '2009/9/26 11:00', '2009/9/26 12:00', '2009/9/26 13:00', '2009/9/26 14:00', '2009/9/26 15:00', '2009/9/26 16:00', '2009/9/26 17:00', '2009/9/26 18:00', '2009/9/26 19:00', '2009/9/26 20:00', '2009/9/26 21:00', '2009/9/26 22:00', '2009/9/26 23:00', '2009/9/27 0:00', '2009/9/27 1:00', '2009/9/27 2:00', '2009/9/27 3:00', '2009/9/27 4:00', '2009/9/27 5:00', '2009/9/27 6:00', '2009/9/27 7:00', '2009/9/27 8:00', '2009/9/27 9:00', '2009/9/27 10:00', '2009/9/27 11:00', '2009/9/27 12:00', '2009/9/27 13:00', '2009/9/27 14:00', '2009/9/27 15:00', '2009/9/27 16:00', '2009/9/27 17:00', '2009/9/27 18:00', '2009/9/27 19:00', '2009/9/27 20:00', '2009/9/27 21:00', '2009/9/27 22:00', '2009/9/27 23:00', '2009/9/28 0:00', '2009/9/28 1:00', '2009/9/28 2:00', '2009/9/28 3:00', '2009/9/28 4:00', '2009/9/28 5:00', '2009/9/28 6:00', '2009/9/28 7:00', '2009/9/28 8:00', '2009/9/28 9:00', '2009/9/28 10:00', '2009/9/28 11:00', '2009/9/28 12:00', '2009/9/28 13:00', '2009/9/28 14:00', '2009/9/28 15:00', '2009/9/28 16:00', '2009/9/28 17:00', '2009/9/28 18:00', '2009/9/28 19:00', '2009/9/28 20:00', '2009/9/28 21:00', '2009/9/28 22:00', '2009/9/28 23:00', '2009/9/29 0:00', '2009/9/29 1:00', '2009/9/29 2:00', '2009/9/29 3:00', '2009/9/29 4:00', '2009/9/29 5:00', '2009/9/29 6:00', '2009/9/29 7:00', '2009/9/29 8:00', '2009/9/29 9:00', '2009/9/29 10:00', '2009/9/29 11:00', '2009/9/29 12:00', '2009/9/29 13:00', '2009/9/29 14:00', '2009/9/29 15:00', '2009/9/29 16:00', '2009/9/29 17:00', '2009/9/29 18:00', '2009/9/29 19:00', '2009/9/29 20:00', '2009/9/29 21:00', '2009/9/29 22:00', '2009/9/29 23:00', '2009/9/30 0:00', '2009/9/30 1:00', '2009/9/30 2:00', '2009/9/30 3:00', '2009/9/30 4:00', '2009/9/30 5:00', '2009/9/30 6:00', '2009/9/30 7:00', '2009/9/30 8:00', '2009/9/30 9:00', '2009/9/30 10:00', '2009/9/30 11:00', '2009/9/30 12:00', '2009/9/30 13:00', '2009/9/30 14:00', '2009/9/30 15:00', '2009/9/30 16:00', '2009/9/30 17:00', '2009/9/30 18:00', '2009/9/30 19:00', '2009/9/30 20:00', '2009/9/30 21:00', '2009/9/30 22:00', '2009/9/30 23:00', '2009/10/1 0:00', '2009/10/1 1:00', '2009/10/1 2:00', '2009/10/1 3:00', '2009/10/1 4:00', '2009/10/1 5:00', '2009/10/1 6:00', '2009/10/1 7:00', '2009/10/1 8:00', '2009/10/1 9:00', '2009/10/1 10:00', '2009/10/1 11:00', '2009/10/1 12:00', '2009/10/1 13:00', '2009/10/1 14:00', '2009/10/1 15:00', '2009/10/1 16:00', '2009/10/1 17:00', '2009/10/1 18:00', '2009/10/1 19:00', '2009/10/1 20:00', '2009/10/1 21:00', '2009/10/1 22:00', '2009/10/1 23:00', '2009/10/2 0:00', '2009/10/2 1:00', '2009/10/2 2:00', '2009/10/2 3:00', '2009/10/2 4:00', '2009/10/2 5:00', '2009/10/2 6:00', '2009/10/2 7:00', '2009/10/2 8:00', '2009/10/2 9:00', '2009/10/2 10:00', '2009/10/2 11:00', '2009/10/2 12:00', '2009/10/2 13:00', '2009/10/2 14:00', '2009/10/2 15:00', '2009/10/2 16:00', '2009/10/2 17:00', '2009/10/2 18:00', '2009/10/2 19:00', '2009/10/2 20:00', '2009/10/2 21:00', '2009/10/2 22:00', '2009/10/2 23:00', '2009/10/3 0:00', '2009/10/3 1:00', '2009/10/3 2:00', '2009/10/3 3:00', '2009/10/3 4:00', '2009/10/3 5:00', '2009/10/3 6:00', '2009/10/3 7:00', '2009/10/3 8:00', '2009/10/3 9:00', '2009/10/3 10:00', '2009/10/3 11:00', '2009/10/3 12:00', '2009/10/3 13:00', '2009/10/3 14:00', '2009/10/3 15:00', '2009/10/3 16:00', '2009/10/3 17:00', '2009/10/3 18:00', '2009/10/3 19:00', '2009/10/3 20:00', '2009/10/3 21:00', '2009/10/3 22:00', '2009/10/3 23:00', '2009/10/4 0:00', '2009/10/4 1:00', '2009/10/4 2:00', '2009/10/4 3:00', '2009/10/4 4:00', '2009/10/4 5:00', '2009/10/4 6:00', '2009/10/4 7:00', '2009/10/4 8:00', '2009/10/4 9:00', '2009/10/4 10:00', '2009/10/4 11:00', '2009/10/4 12:00', '2009/10/4 13:00', '2009/10/4 14:00', '2009/10/4 15:00', '2009/10/4 16:00', '2009/10/4 17:00', '2009/10/4 18:00', '2009/10/4 19:00', '2009/10/4 20:00', '2009/10/4 21:00', '2009/10/4 22:00', '2009/10/4 23:00', '2009/10/5 0:00', '2009/10/5 1:00', '2009/10/5 2:00', '2009/10/5 3:00', '2009/10/5 4:00', '2009/10/5 5:00', '2009/10/5 6:00', '2009/10/5 7:00', '2009/10/5 8:00', '2009/10/5 9:00', '2009/10/5 10:00', '2009/10/5 11:00', '2009/10/5 12:00', '2009/10/5 13:00', '2009/10/5 14:00', '2009/10/5 15:00', '2009/10/5 16:00', '2009/10/5 17:00', '2009/10/5 18:00', '2009/10/5 19:00', '2009/10/5 20:00', '2009/10/5 21:00', '2009/10/5 22:00', '2009/10/5 23:00', '2009/10/6 0:00', '2009/10/6 1:00', '2009/10/6 2:00', '2009/10/6 3:00', '2009/10/6 4:00', '2009/10/6 5:00', '2009/10/6 6:00', '2009/10/6 7:00', '2009/10/6 8:00', '2009/10/6 9:00', '2009/10/6 10:00', '2009/10/6 11:00', '2009/10/6 12:00', '2009/10/6 13:00', '2009/10/6 14:00', '2009/10/6 15:00', '2009/10/6 16:00', '2009/10/6 17:00', '2009/10/6 18:00', '2009/10/6 19:00', '2009/10/6 20:00', '2009/10/6 21:00', '2009/10/6 22:00', '2009/10/6 23:00', '2009/10/7 0:00', '2009/10/7 1:00', '2009/10/7 2:00', '2009/10/7 3:00', '2009/10/7 4:00', '2009/10/7 5:00', '2009/10/7 6:00', '2009/10/7 7:00', '2009/10/7 8:00', '2009/10/7 9:00', '2009/10/7 10:00', '2009/10/7 11:00', '2009/10/7 12:00', '2009/10/7 13:00', '2009/10/7 14:00', '2009/10/7 15:00', '2009/10/7 16:00', '2009/10/7 17:00', '2009/10/7 18:00', '2009/10/7 19:00', '2009/10/7 20:00', '2009/10/7 21:00', '2009/10/7 22:00', '2009/10/7 23:00', '2009/10/8 0:00', '2009/10/8 1:00', '2009/10/8 2:00', '2009/10/8 3:00', '2009/10/8 4:00', '2009/10/8 5:00', '2009/10/8 6:00', '2009/10/8 7:00', '2009/10/8 8:00', '2009/10/8 9:00', '2009/10/8 10:00', '2009/10/8 11:00', '2009/10/8 12:00', '2009/10/8 13:00', '2009/10/8 14:00', '2009/10/8 15:00', '2009/10/8 16:00', '2009/10/8 17:00', '2009/10/8 18:00', '2009/10/8 19:00', '2009/10/8 20:00', '2009/10/8 21:00', '2009/10/8 22:00', '2009/10/8 23:00', '2009/10/9 0:00', '2009/10/9 1:00', '2009/10/9 2:00', '2009/10/9 3:00', '2009/10/9 4:00', '2009/10/9 5:00', '2009/10/9 6:00', '2009/10/9 7:00', '2009/10/9 8:00', '2009/10/9 9:00', '2009/10/9 10:00', '2009/10/9 11:00', '2009/10/9 12:00', '2009/10/9 13:00', '2009/10/9 14:00', '2009/10/9 15:00', '2009/10/9 16:00', '2009/10/9 17:00', '2009/10/9 18:00', '2009/10/9 19:00', '2009/10/9 20:00', '2009/10/9 21:00', '2009/10/9 22:00', '2009/10/9 23:00', '2009/10/10 0:00', '2009/10/10 1:00', '2009/10/10 2:00', '2009/10/10 3:00', '2009/10/10 4:00', '2009/10/10 5:00', '2009/10/10 6:00', '2009/10/10 7:00', '2009/10/10 8:00', '2009/10/10 9:00', '2009/10/10 10:00', '2009/10/10 11:00', '2009/10/10 12:00', '2009/10/10 13:00', '2009/10/10 14:00', '2009/10/10 15:00', '2009/10/10 16:00', '2009/10/10 17:00', '2009/10/10 18:00', '2009/10/10 19:00', '2009/10/10 20:00', '2009/10/10 21:00', '2009/10/10 22:00', '2009/10/10 23:00', '2009/10/11 0:00', '2009/10/11 1:00', '2009/10/11 2:00', '2009/10/11 3:00', '2009/10/11 4:00', '2009/10/11 5:00', '2009/10/11 6:00', '2009/10/11 7:00', '2009/10/11 8:00', '2009/10/11 9:00', '2009/10/11 10:00', '2009/10/11 11:00', '2009/10/11 12:00', '2009/10/11 13:00', '2009/10/11 14:00', '2009/10/11 15:00', '2009/10/11 16:00', '2009/10/11 17:00', '2009/10/11 18:00', '2009/10/11 19:00', '2009/10/11 20:00', '2009/10/11 21:00', '2009/10/11 22:00', '2009/10/11 23:00', '2009/10/12 0:00', '2009/10/12 1:00', '2009/10/12 2:00', '2009/10/12 3:00', '2009/10/12 4:00', '2009/10/12 5:00', '2009/10/12 6:00', '2009/10/12 7:00', '2009/10/12 8:00', '2009/10/12 9:00', '2009/10/12 10:00', '2009/10/12 11:00', '2009/10/12 12:00', '2009/10/12 13:00', '2009/10/12 14:00', '2009/10/12 15:00', '2009/10/12 16:00', '2009/10/12 17:00', '2009/10/12 18:00', '2009/10/12 19:00', '2009/10/12 20:00', '2009/10/12 21:00', '2009/10/12 22:00', '2009/10/12 23:00', '2009/10/13 0:00', '2009/10/13 1:00', '2009/10/13 2:00', '2009/10/13 3:00', '2009/10/13 4:00', '2009/10/13 5:00', '2009/10/13 6:00', '2009/10/13 7:00', '2009/10/13 8:00', '2009/10/13 9:00', '2009/10/13 10:00', '2009/10/13 11:00', '2009/10/13 12:00', '2009/10/13 13:00', '2009/10/13 14:00', '2009/10/13 15:00', '2009/10/13 16:00', '2009/10/13 17:00', '2009/10/13 18:00', '2009/10/13 19:00', '2009/10/13 20:00', '2009/10/13 21:00', '2009/10/13 22:00', '2009/10/13 23:00', '2009/10/14 0:00', '2009/10/14 1:00', '2009/10/14 2:00', '2009/10/14 3:00', '2009/10/14 4:00', '2009/10/14 5:00', '2009/10/14 6:00', '2009/10/14 7:00', '2009/10/14 8:00', '2009/10/14 9:00', '2009/10/14 10:00', '2009/10/14 11:00', '2009/10/14 12:00', '2009/10/14 13:00', '2009/10/14 14:00', '2009/10/14 15:00', '2009/10/14 16:00', '2009/10/14 17:00', '2009/10/14 18:00', '2009/10/14 19:00', '2009/10/14 20:00', '2009/10/14 21:00', '2009/10/14 22:00', '2009/10/14 23:00', '2009/10/15 0:00', '2009/10/15 1:00', '2009/10/15 2:00', '2009/10/15 3:00', '2009/10/15 4:00', '2009/10/15 5:00', '2009/10/15 6:00', '2009/10/15 7:00', '2009/10/15 8:00', '2009/10/15 9:00', '2009/10/15 10:00', '2009/10/15 11:00', '2009/10/15 12:00', '2009/10/15 13:00', '2009/10/15 14:00', '2009/10/15 15:00', '2009/10/15 16:00', '2009/10/15 17:00', '2009/10/15 18:00', '2009/10/15 19:00', '2009/10/15 20:00', '2009/10/15 21:00', '2009/10/15 22:00', '2009/10/15 23:00', '2009/10/16 0:00', '2009/10/16 1:00', '2009/10/16 2:00', '2009/10/16 3:00', '2009/10/16 4:00', '2009/10/16 5:00', '2009/10/16 6:00', '2009/10/16 7:00', '2009/10/16 8:00', '2009/10/16 9:00', '2009/10/16 10:00', '2009/10/16 11:00', '2009/10/16 12:00', '2009/10/16 13:00', '2009/10/16 14:00', '2009/10/16 15:00', '2009/10/16 16:00', '2009/10/16 17:00', '2009/10/16 18:00', '2009/10/16 19:00', '2009/10/16 20:00', '2009/10/16 21:00', '2009/10/16 22:00', '2009/10/16 23:00', '2009/10/17 0:00', '2009/10/17 1:00', '2009/10/17 2:00', '2009/10/17 3:00', '2009/10/17 4:00', '2009/10/17 5:00', '2009/10/17 6:00', '2009/10/17 7:00', '2009/10/17 8:00', '2009/10/17 9:00', '2009/10/17 10:00', '2009/10/17 11:00', '2009/10/17 12:00', '2009/10/17 13:00', '2009/10/17 14:00', '2009/10/17 15:00', '2009/10/17 16:00', '2009/10/17 17:00', '2009/10/17 18:00', '2009/10/17 19:00', '2009/10/17 20:00', '2009/10/17 21:00', '2009/10/17 22:00', '2009/10/17 23:00', '2009/10/18 0:00', '2009/10/18 1:00', '2009/10/18 2:00', '2009/10/18 3:00', '2009/10/18 4:00', '2009/10/18 5:00', '2009/10/18 6:00', '2009/10/18 7:00', '2009/10/18 8:00'
                    ].map(function (str) {
                        return str.replace(' ', '\n');
                    })
                }
            ],
            yAxis: [
                {
                    name: 'Flow(m³/s)',
                    type: 'value'
                },
                {
                    name: 'Rainfall(mm)',
                    nameLocation: 'start',
                    alignTicks: true,
                    type: 'value',
                    inverse: true
                }
            ],
            series: [
                {
                    name: 'Flow',
                    type: 'line',
                    areaStyle: {},
                    lineStyle: {
                        width: 1
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    markArea: {
                        silent: true,
                        itemStyle: {
                            opacity: 0.3
                        },
                        data: [
                            [
                                {
                                    xAxis: '2009/9/12\n7:00'
                                },
                                {
                                    xAxis: '2009/9/22\n7:00'
                                }
                            ]
                        ]
                    },
                    // prettier-ignore
                    data: [
                        0.97, 0.96, 0.96, 0.95, 0.95, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.93, 0.92, 0.91, 0.9, 0.89, 0.88, 0.87, 0.87, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.87, 0.88, 0.9, 0.93, 0.96, 0.99, 1.03, 1.06, 1.1, 1.14, 1.17, 1.2, 1.23, 1.26, 1.29, 1.33, 1.36, 1.4, 1.43, 1.45, 1.48, 1.49, 1.51, 1.51, 1.5, 1.49, 1.47, 1.44, 1.41, 1.37, 1.34, 1.3, 1.27, 1.24, 1.22, 1.2, 1.19, 1.18, 1.16, 1.15, 1.14, 1.13, 1.12, 1.11, 1.11, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.09, 1.09, 1.08, 1.07, 1.06, 1.05, 1.04, 1.03, 1.03, 1.02, 1.01, 1.01, 1, 0.99, 0.98, 0.97, 0.96, 0.96, 0.95, 0.95, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.93, 0.92, 0.91, 0.9, 0.89, 0.88, 0.87, 0.87, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.85, 0.84, 0.83, 0.82, 0.81, 0.8, 0.8, 0.79, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.77, 0.75, 0.73, 0.71, 0.68, 0.65, 0.63, 0.61, 0.59, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.57, 0.57, 0.57, 0.56, 0.55, 0.55, 0.54, 0.54, 0.53, 0.52, 0.52, 0.51, 0.51, 0.5, 0.5, 0.49, 0.48, 0.48, 0.47, 0.47, 0.47, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.52, 0.67, 0.9, 1.19, 1.52, 1.87, 2.22, 2.55, 2.84, 3.07, 3.22, 3.28, 3.28, 3.28, 3.28, 3.28, 3.28, 3.28, 3.28, 3.28, 3.28, 3.28, 3.28, 3.28, 3.24, 3.13, 2.97, 2.77, 2.54, 2.3, 2.05, 1.82, 1.62, 1.46, 1.35, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.3, 1.26, 1.21, 1.14, 1.06, 0.97, 0.89, 0.81, 0.74, 0.69, 0.65, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.63, 0.63, 0.62, 0.62, 0.61, 0.6, 0.59, 0.59, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.59, 0.61, 0.63, 0.65, 0.68, 0.71, 0.73, 0.75, 0.77, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.77, 0.75, 0.73, 0.71, 0.68, 0.65, 0.63, 0.61, 0.59, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.59, 0.59, 0.6, 0.61, 0.62, 0.62, 0.63, 0.63, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.65, 0.66, 0.68, 0.69, 0.71, 0.73, 0.74, 0.76, 0.77, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.79, 0.81, 0.82, 0.84, 0.86, 0.88, 0.9, 0.92, 0.93, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.93, 0.92, 0.91, 0.9, 0.89, 0.88, 0.87, 0.87, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.85, 0.84, 0.82, 0.8, 0.78, 0.76, 0.75, 0.73, 0.72, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.72, 0.73, 0.74, 0.76, 0.78, 0.79, 0.82, 0.84, 0.86, 0.89, 0.91, 0.94, 0.97, 1, 1.02, 1.05, 1.08, 1.11, 1.14, 1.17, 1.19, 1.22, 1.25, 1.27, 1.29, 1.31, 1.33, 1.35, 1.36, 1.38, 1.39, 1.39, 1.4, 1.4, 1.4, 1.39, 1.37, 1.35, 1.32, 1.29, 1.26, 1.22, 1.18, 1.14, 1.1, 1.05, 1.01, 0.97, 0.93, 0.89, 0.85, 0.82, 0.78, 0.76, 0.74, 0.72, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.72, 0.73, 0.74, 0.75, 0.77, 0.78, 0.8, 0.82, 0.84, 0.87, 0.89, 0.92, 0.94, 0.97, 0.99, 1.02, 1.05, 1.08, 1.1, 1.13, 1.16, 1.18, 1.21, 1.23, 1.26, 1.28, 1.3, 1.32, 1.34, 1.35, 1.37, 1.38, 1.39, 1.4, 1.41, 1.41, 1.42, 1.42, 1.43, 1.43, 1.43, 1.44, 1.44, 1.44, 1.44, 1.45, 1.45, 1.45, 1.46, 1.46, 1.46, 1.47, 1.47, 1.48, 1.48, 1.49, 1.5, 1.51, 1.54, 1.62, 1.73, 1.88, 2.05, 2.24, 2.45, 2.67, 2.89, 3.11, 3.31, 3.51, 3.69, 3.86, 4.03, 4.18, 4.33, 4.48, 4.62, 4.76, 4.89, 5.02, 5.16, 5.29, 5.43, 5.57, 5.71, 5.86, 6.02, 6.18, 6.36, 6.54, 6.73, 6.93, 7.15, 7.38, 7.62, 7.88, 8.16, 8.46, 8.77, 9.11, 9.46, 9.84, 10.24, 10.67, 11.12, 11.6, 12.3, 13.66, 16, 38.43, 82.21, 146.6, 218.7, 226, 225.23, 223.08, 219.78, 212, 199.82, 184.6, 168, 151.65, 137.21, 126.31, 119.94, 115.52, 112.06, 108.92, 105.44, 101, 94.56, 86.36, 77.67, 69.76, 63.9, 60.38, 57.41, 54.84, 52.57, 50.56, 48.71, 46.97, 45.25, 43.48, 41.6, 39.5, 37.19, 34.81, 32.46, 30.27, 28.36, 26.85, 25.86, 25.5, 25.5, 25.5, 25.5, 25.5, 25.5, 25.5, 25.5, 25.5, 25.5, 25.5, 25.5, 25.5, 25.27, 24.65, 23.7, 22.52, 21.17, 19.75, 18.33, 16.98, 15.8, 14.85, 14.23, 14, 14.02, 14.08, 14.17, 14.29, 14.44, 14.61, 14.8, 15.01, 15.23, 15.47, 15.71, 15.95, 16.19, 16.43, 16.67, 16.89, 17.1, 17.29, 17.46, 17.61, 17.73, 17.82, 17.88, 17.9, 17.63, 16.88, 15.75, 14.33, 12.71, 10.98, 9.23, 7.56, 6.05, 4.81, 3.92, 3.47, 3.28, 3.1, 2.93, 2.76, 2.61, 2.46, 2.32, 2.19, 2.07, 1.96, 1.85, 1.75, 1.66, 1.58, 1.51, 1.44, 1.39, 1.34, 1.29, 1.26, 1.23, 1.22, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.21, 1.21, 1.21, 1.21, 1.22, 1.22, 1.22, 1.23, 1.23, 1.23, 1.24, 1.24, 1.25, 1.25, 1.25, 1.26, 1.26, 1.27, 1.27, 1.27, 1.28, 1.28, 1.28, 1.29, 1.29, 1.29, 1.29, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.29, 1.29, 1.29, 1.29, 1.28, 1.28, 1.28, 1.27, 1.27, 1.26, 1.25, 1.25, 1.24, 1.23, 1.23, 1.22, 1.21, 1.2, 1.16, 1.06, 0.95, 0.83, 0.74, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.69, 0.69, 0.69, 0.69, 0.69, 0.69, 0.69, 0.69, 0.68, 0.68, 0.68, 0.68, 0.68, 0.68, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.66, 0.66, 0.66, 0.66, 0.66, 0.66, 0.66, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.65, 0.66, 0.68, 0.69, 0.71, 0.73, 0.74, 0.76, 0.77, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.8, 0.86, 0.95, 1.08, 1.25, 1.46, 1.7, 1.97, 2.28, 2.63, 3.01, 3.42, 3.87, 4.35, 4.86, 5.4, 5.98, 6.59, 7.92, 10.49, 14.04, 18.31, 23.04, 27.98, 32.87, 37.45, 41.46, 44.64, 46.74, 47.5, 46.86, 45.16, 42.77, 40.04, 37.33, 35, 32.74, 30.21, 27.7, 25.5, 23.9, 23.2, 23.06, 22.94, 22.84, 22.77, 22.72, 22.7, 22.8, 23.23, 23.95, 24.91, 26.04, 27.3, 28.76, 30.7, 33.39, 37.12, 42.15, 48.77, 65.22, 252.1, 257, 237.32, 221.19, 212, 208.67, 206.89, 205.2, 202.15, 189.82, 172, 165.3, 160.49, 156.8, 153.44, 149.62, 144.6, 138.27, 131, 123.11, 114.9, 106.69, 98.79, 91.5, 85.13, 80, 75.53, 71.03, 66.65, 62.54, 58.85, 55.73, 53.31, 51.75, 51.2, 56.53, 68.25, 80, 91.01, 102.03, 109, 112.37, 115.29, 117.68, 119.48, 120.61, 121, 119.45, 115.57, 110.52, 105.47, 101.58, 100, 99.97, 99.94, 99.92, 99.9, 99.88, 99.86, 99.85, 99.84, 99.83, 99.82, 99.81, 99.81, 99.8, 99.8, 99.8, 122.15, 163.65, 186, 182.96, 175.15, 164.56, 153.18, 143, 136, 131.37, 126.98, 122.81, 118.85, 115.09, 111.52, 108.13, 104.9, 101.83, 98.9, 96.11, 93.44, 90.87, 88.41, 86.04, 83.74, 81.51, 79.33, 77.2, 75.1, 73.02, 70.95, 68.88, 66.8, 64.87, 63.14, 61.4, 59.53, 57.67, 56, 54.6, 53.36, 52.2, 51.05, 49.85, 48.5, 46.87, 44.92, 42.74, 40.42, 38.04, 35.69, 33.46, 31.44, 29.72, 28.38, 27.51, 27.2, 27.2, 27.2, 27.2, 27.2, 27.2, 27.2, 27.2, 27.2, 27.2, 27.2, 27.2, 27.2, 27.14, 26.97, 26.7, 26.35, 25.95, 25.49, 25.02, 24.53, 24.04, 23.58, 23.16, 22.8, 22.46, 22.11, 21.75, 21.39, 21.03, 20.69, 20.36, 20.05, 19.78, 19.54, 19.35, 19.2, 19.09, 19, 18.92, 18.85, 18.79, 18.74, 18.68, 18.62, 18.56, 18.49, 18.4, 18.3, 18.17, 18.02, 17.83, 17.63, 17.41, 17.18, 16.93, 16.68, 16.43, 16.18, 15.93, 15.7, 15.47, 15.22, 14.97, 14.71, 14.45, 14.18, 13.93, 13.68, 13.44, 13.21, 13, 12.8, 12.62, 12.46, 12.31, 12.16, 12.03, 11.89, 11.76, 11.62, 11.48, 11.33, 11.17, 11, 10.81, 10.59, 10.36, 10.12, 9.86, 9.61, 9.36, 9.12, 8.89, 8.68, 8.5, 8.35, 8.21, 8.08, 7.94, 7.81, 7.68, 7.56, 7.46, 7.36, 7.29, 7.23, 7.19, 7.18, 7.51, 8.42, 9.81, 11.58, 13.63, 15.86, 18.16, 20.44, 22.58, 24.49, 26.06, 27.2, 28.08, 28.95, 29.81, 30.65, 31.48, 32.28, 33.07, 33.82, 34.55, 35.25, 35.92, 36.56, 37.15, 37.71, 38.23, 38.7, 39.13, 39.5, 39.83, 40.1, 40.31, 40.47, 40.57, 40.6, 40.49, 40.16, 39.64, 38.94, 38.09, 37.1, 36, 34.79, 33.51, 32.17, 30.79, 29.39, 27.99, 26.6, 25.25, 23.96, 22.75, 21.63, 20.63, 19.76, 19.04, 18.49, 18.14, 18, 17.97, 17.95, 17.94, 17.92, 17.91, 17.9, 17.89, 17.88, 17.87, 17.85, 17.83, 17.8, 17.7, 17.46, 17.13, 16.7, 16.21, 15.68, 15.13, 14.57, 14.04, 13.56, 13.14, 12.8, 12.52, 12.27, 12.02, 11.79, 11.57, 11.37, 11.16, 10.97, 10.78, 10.59, 10.39, 10.2, 10.01, 9.81, 9.63, 9.44, 9.26, 9.08, 8.9, 8.73, 8.56, 8.39, 8.22, 8.06, 7.9, 7.73, 7.57, 7.41, 7.25, 7.09, 6.94, 6.79, 6.65, 6.52, 6.4, 6.28, 6.17, 6.08, 5.98, 5.9, 5.81, 5.73, 5.65, 5.57, 5.49, 5.41, 5.32, 5.23, 5.14, 5.04, 4.94, 4.84, 4.74, 4.63, 4.53, 4.43, 4.33, 4.23, 4.13, 4.03, 3.93, 3.81, 3.69, 3.57, 3.45, 3.33, 3.22, 3.12, 3.04, 2.98, 2.93, 2.92, 2.92, 2.92, 2.92, 2.92, 2.92, 2.92, 2.92, 2.92, 2.92, 2.92, 2.92, 2.92, 2.9, 2.86, 2.8, 2.71, 2.62, 2.52, 2.42, 2.33, 2.24, 2.18, 2.14, 2.12, 2.12, 2.12, 2.12, 2.12, 2.12, 2.12, 2.12, 2.12, 2.12, 2.12, 2.12, 2.12, 2.1, 2.06, 2, 1.91, 1.82, 1.71, 1.61, 1.5, 1.4, 1.32, 1.25, 1.2, 1.16, 1.13, 1.1, 1.06, 1.03, 1, 0.97, 0.93, 0.9, 0.87, 0.85, 0.82, 0.79, 0.77, 0.74, 0.72, 0.69, 0.67, 0.65, 0.63, 0.61, 0.59, 0.58, 0.56, 0.54, 0.53, 0.52, 0.51, 0.5, 0.49, 0.48, 0.48, 0.47, 0.47, 0.46, 0.46, 0.47, 0.48, 0.5, 0.53, 0.56, 0.59, 0.62, 0.64, 0.67, 0.69, 0.7, 0.71, 0.71, 0.71, 0.71, 0.7, 0.7, 0.7, 0.69, 0.69, 0.69, 0.68, 0.68, 0.67, 0.67, 0.67, 0.66, 0.66, 0.65, 0.65, 0.65, 0.65, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.65, 0.65, 0.65, 0.66, 0.66, 0.67, 0.68, 0.69, 0.69, 0.7, 0.71, 0.73, 0.74, 0.75, 0.76, 0.78, 0.8, 0.81, 0.83, 0.85, 0.87, 0.89, 0.92, 0.94, 0.97, 0.99, 1.02, 1.05, 1.08, 1.11, 1.15, 1.18, 1.32, 1.66, 2.21, 2.97, 3.94, 5.11, 6.5, 8.1, 9.9, 11.92, 14.15, 16.6, 22.3, 22.8, 24.48, 30.38, 35.74, 42.4, 57.14, 94.04, 112.9, 123.4, 130.4, 130, 119.4, 120.7, 116.8, 118.1, 119.4, 124.8, 143.5, 204, 294, 319.2, 328.4, 365, 350.8, 347.6, 347.6, 325, 331.6, 319.2, 308, 308, 308, 308, 296.8, 300, 281, 278.4, 270.6, 271, 253.6, 233.5, 219.2, 207.8, 205.9, 204, 189.6, 178.8, 173.4, 160, 154.4, 146, 145, 140.5, 130.4, 126.2, 116.8, 112.9, 106.5, 101.6, 98.51, 82.67, 67.3, 80.05, 76.12, 72.3, 71.02, 69.78, 67.3, 67.3, 68.54, 57.6, 71.02, 66.06, 59.12, 57.14, 55.16, 55.16, 52.19, 52.19, 51.2, 48.56, 44.16, 43, 45.92, 49.44, 44.16, 36.48, 35.74, 35, 32.36, 37.22, 32.36, 32.36, 32.36, 33.68, 32.36, 31.7, 35.74, 29.72, 32.36, 30.38, 29.72, 28.4, 28.4, 28.4, 27.28, 25.6, 25.04, 23.92, 22.3, 21.8, 21.8, 21.8, 22.8, 21.8, 25.6, 22.8, 22.8, 17.8, 16.04, 16.04, 16.04, 16.04, 16.04, 16.04, 16.04, 16.04, 16.04, 16.04, 15.02, 14, 14.03, 14.11, 14.25, 14.45, 14.72, 15.06, 15.46, 15.95, 16.51, 17.15, 17.87, 18.69, 19.59, 20.59, 21.69, 22.88, 24.18, 25.59, 27.1, 28.73, 30.48, 32.34, 34.33, 36.44, 38.69, 41.06, 43.57, 46.22, 49.01, 51.95, 55.04, 58.27, 61.66, 65.21, 68.92, 72.8, 88.09, 104.9, 105.7, 110.3, 111.6, 110.3, 106.5, 105.7, 103.3, 100, 97.02, 98.8, 91.07, 83.98, 88.09, 81.36, 78.74, 77.43, 77.43, 73.5, 74.81, 72.63, 68.58, 66.4, 68.54, 69.78, 67.3, 64.82, 61.1, 59.12, 56.15, 53.18, 50.32, 49.44, 44.16, 36.5, 42.4, 37.96, 37.22, 33.68, 36.48, 35.74, 35, 35, 37.22, 37.22, 39.44, 32.6, 34.54, 36.48, 35.74, 34.34, 33.68, 33.02, 31.04, 29.72, 29.72, 29.72, 26.16, 25.6, 29.72, 18.3, 22.3, 21.3, 21.8, 21.8, 20.3, 20.8, 25.04, 25.04, 25.6, 25.6, 25.04, 25.6, 25.04, 25.6, 23.92, 25.04, 21.3, 21.8, 22.3, 21.8, 20.8, 16.1, 20.3, 18.3, 13.22, 19.3, 19.3, 18.3, 14.4, 13.86, 13.36, 12.9, 12.48, 12.1, 11.75, 11.43, 11.15, 10.9, 10.67, 10.48, 10.31, 10.16, 10.04, 9.93, 9.85, 9.78, 9.73, 9.69, 9.67, 9.65, 9.65, 12.08, 8.67, 11.7, 11.38, 10.65, 9.84, 9.32, 9.07, 8.85, 8.66, 8.49, 8.35, 8.22, 8.1, 7.98, 7.86, 7.74, 7.61, 7.47, 7.31, 7.14, 6.96, 6.78, 6.58, 6.39, 6.19, 5.99, 5.78, 5.58, 5.39, 5.2, 5.01, 4.83, 4.67, 4.51, 4.37, 4.24, 4.12, 4.02, 3.95, 3.89, 3.85, 3.84, 4.41, 5.77, 7.39, 8.75, 9.32, 9.18, 9, 8.94, 8.88, 8.83, 8.78, 8.73, 8.68, 8.64, 8.6, 8.56, 8.53, 8.5, 8.47, 8.45, 8.42, 8.4, 8.39, 8.37, 8.36, 8.35, 8.35, 8.34, 8.34, 8.67, 9.65, 9.62, 9.53, 9.4, 9.21, 8.98, 8.7, 8.4, 8.06, 7.69, 7.3, 6.89, 6.47, 6.03, 5.59, 5.14, 4.7, 4.26, 3.83, 3.42, 3.02, 2.65, 2.3, 1.98, 1.7, 1.45, 1.25, 1.09, 0.99, 0.94, 0.92, 0.91, 0.89, 0.87, 0.85, 0.84, 0.82, 0.81, 0.79, 0.78, 0.77, 0.75, 0.74, 0.73, 0.72, 0.71, 0.7, 0.69, 0.68, 0.67, 0.66, 0.65, 0.64, 0.64, 0.63, 0.63, 0.62, 0.62, 0.61, 0.61, 0.61, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.61, 0.61, 0.61, 0.61, 0.61, 0.61, 0.62, 0.62, 0.62, 0.62, 0.63, 0.63, 0.63, 0.63, 0.63, 0.64, 0.64, 0.64, 0.64, 0.64, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.64, 0.63, 0.62, 0.6, 0.59, 0.57, 0.55, 0.54, 0.53, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.51, 0.51, 0.51, 0.5, 0.5, 0.49, 0.48, 0.47, 0.47, 0.46, 0.45, 0.45, 0.44, 0.43, 0.42, 0.42, 0.41, 0.41, 0.41, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.41, 0.42, 0.43, 0.44, 0.46, 0.48, 0.5, 0.53, 0.55, 0.58, 0.61, 0.64, 0.67, 0.7, 0.73, 0.77, 0.8, 0.83, 0.87, 0.9, 0.93, 0.96, 0.99, 1.02, 1.05, 1.08, 1.1, 1.12, 1.14, 1.16, 1.17, 1.18, 1.19, 1.2, 1.2, 1.2, 1.19, 1.17, 1.15, 1.12, 1.09, 1.06, 1.02, 0.98, 0.94, 0.9, 0.86, 0.82, 0.78, 0.74, 0.7, 0.66, 0.63, 0.6, 0.57, 0.55, 0.53, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.51, 0.51, 0.5, 0.5, 0.49, 0.49, 0.48, 0.47, 0.47, 0.47, 0.46, 0.46, 0.45, 0.45, 0.45, 0.44, 0.44, 0.44, 0.43, 0.43, 0.43, 0.42, 0.42, 0.42, 0.41, 0.41, 0.41, 0.41, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.43, 0.43, 0.43, 0.43, 0.43, 0.43, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.45, 0.45, 0.45
                    ]
                },
                {
                    name: 'Rainfall',
                    type: 'line',
                    yAxisIndex: 1,
                    areaStyle: {},
                    lineStyle: {
                        width: 1
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    markArea: {
                        silent: true,
                        itemStyle: {
                            opacity: 0.3
                        },
                        data: [
                            [
                                {
                                    xAxis: '2009/9/10\n7:00'
                                },
                                {
                                    xAxis: '2009/9/20\n7:00'
                                }
                            ]
                        ]
                    },
                    // prettier-ignore
                    data: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.005, 0.017, 0.017, 0.017, 0.017, 0.011, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.021, 0.026, 0.03, 0.036, 0.036, 0.195, 0.221, 0.019, 0.013, 0.017, 0.03, 0.03, 0.03, 0.046, 0.045, 0.038, 0.084, 0.045, 0.045, 0.037, 0.034, 0.035, 0.036, 0.044, 0.052, 0.048, 0.109, 0.033, 0.029, 0.04, 0.042, 0.042, 0.042, 0.073, 0.076, 0.062, 0.066, 0.066, 0.075, 0.096, 0.128, 0.121, 0.128, 0.14, 0.226, 0.143, 0.097, 0.018, 0, 0, 0, 0, 0, 0.018, 0.047, 0.054, 0.054, 0.054, 0.036, 0.185, 0.009, 0.038, 0.061, 0.077, 0.091, 0.126, 0.69, 0.182, 0.349, 0.231, 0.146, 0.128, 0.167, 0.1, 0.075, 0.071, 0.071, 0.117, 0.01, 0.002, 0.002, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.005, 0.026, 0.038, 0.038, 0.038, 0.076, 0.086, 0.109, 0.213, 0.276, 0.288, 0.297, 0.642, 1.799, 1.236, 2.138, 0.921, 0.497, 0.685, 0.828, 0.41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.018, 0.024, 0.024, 0.024, 0.024, 0.006, 0.003, 0.046, 0.046, 0.046, 0.046, 0.043, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.204, 0.303, 1.028, 1.328, 1.524, 1.41, 1.362, 1.292, 1.191, 0.529, 0.501, 0.944, 1.81, 2.899, 0.859, 0.126, 0.087, 0.047, 0, 0, 0, 0, 0.011, 0.028, 0.028, 0.028, 0.028, 0.017, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.099, 0.159, 0.297, 0.309, 0.309, 0.614, 0.818, 1.436, 1.195, 0.553, 0.542, 0.955, 0.898, 0.466, 0.386, 0.556, 0.388, 0.221, 0.192, 0.192, 0.187, 0.166, 0.18, 0.302, 0.158, 0.009, 0.009, 0.009, 0.009, 0.009, 0.007, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.004, 0.032, 0.032, 0.032, 0.032, 0.082, 0.149, 0.204, 0.247, 0.262, 0.49, 0.51, 0.533, 0.746, 0.847, 2.393, 1.188, 1.114, 0.475, 0.043, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.017, 0.017, 0.021, 0.042, 0.079, 0.111, 0.126, 0.122, 0.133, 0.846, 0.102, 0.077, 0.067, 0.056, 0.005, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.011, 0.017, 0.017, 0.017, 0.017, 0.006, 0, 0, 0, 0, 0, 0.01, 0.03, 0.054, 0.067, 0.07, 0.25, 0.251, 0.494, 0.065, 0.054, 0.054, 0.064, 0.084, 0.077, 0.101, 0.132, 0.248, 0.069, 0.117, 0.115, 0.087, 0.326, 0.036, 0.009, 0.009, 0.009, 0.009, 0.009, 0.004, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.02, 0.039, 0.04, 0.04, 0.04, 0.229, 0.079, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.023, 0.069, 0.082, 0.082, 0.082, 0.503, 0.774, 0.038, 0.012, 0.012, 0.012, 0.016, 0.02, 0.028, 0.051, 0.06, 0.064, 0.19, 0.15, 0.164, 0.139, 0.13, 0.085, 0.031, 0.023, 0.022, 0.007, 0.005, 0.005, 0.001, 0, 0.02, 0.048, 0.048, 0.053, 0.056, 0.036, 0.008, 0.008, 0.004, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.013, 0.017, 0.036, 0.068, 0.095, 0.233, 0.272, 0.377, 0.722, 1.494, 3.756, 0.954, 0.439, 0.442, 0.462, 0.373, 0.249, 0.214, 0.1, 0.044, 0.037, 0.023, 0.002, 0, 0, 0, 0, 0, 0, 0.02, 0.024, 0.024, 0.024, 0.024, 0.004, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.008, 0.017, 0.017, 0.045, 0.186, 0.308, 0.241, 0.241, 0.893, 4.067, 4.494, 5.015, 3.494, 2.057, 1.411, 0.718, 0.407, 0.313, 0.339, 1.537, 1.105, 0.218, 0.136, 0.03, 0.005, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.037, 0.448, 1.2, 1.309, 1.309, 1.425, 1.223, 0.471, 0.767, 0.423, 0.273, 0.412, 0.646, 0.481, 0.239, 0.131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.044, 0.15, 0.223, 0.388, 0.513, 0.883, 2.828, 4.786, 5.959, 4.95, 6.434, 6.319, 3.35, 2.806, 4.204, 1.395, 1.015, 1.015, 0.836, 0.74, 0.72, 0.615, 0.477, 0.192, 0.046, 0.007, 0.007, 0.007, 0.007, 0.007, 0.007, 0.007, 0.008, 0.005, 0.005, 0.005, 0.005, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.001, 0.012, 0.012, 0.012, 0.012, 0.011, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.002, 0.012, 0.028, 0.028, 0.028, 0.138, 0.092, 0.082, 0.082, 0.096, 0.719, 0.155, 0.042, 0.047, 0.129, 0.021, 0.021, 0.014, 0.009, 0.029, 0.067, 0.088, 0.095, 0.095, 0.138, 0.091, 0.032, 0.025, 0.025, 0.003, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.002, 0.045, 0.228, 0.297, 0.325, 0.339, 0.581, 1.244, 0.796, 0.517, 0.227, 0.053, 0.006, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.003, 0.005, 0.005, 0.005, 0.005, 0.081, 0.129, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.014, 0.041, 0.041, 0.041, 0.041, 0.027, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.009, 0.017, 0.017, 0.017, 0.017, 0.355, 0.174, 0.009, 0.009, 0.012, 0.136, 0.208, 0.208, 0.208, 0.215, 7.359, 1.858, 0.458, 0.053, 0.053, 0.047, 0.045, 0.045, 0.059, 0.136, 0.188, 0.206, 0.21, 0.588, 1.517, 6.02, 4.688, 4.42, 0.624, 0.326, 0.359, 0.553, 0.899, 0.94, 2.95, 9.415, 5.752, 1.092, 0.096, 0.035, 0.026, 0.018, 0.015, 0.011, 0.011, 0.011, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.056, 0.27, 0.314, 0.351, 0.354, 0.609, 0.796, 1.857, 0.848, 0.538, 0.214, 0.178, 0.178, 0.201, 0.231, 0.227, 0.272, 0.397, 0.45, 1.014, 2.917, 1.675, 0.081, 0.059, 0.059, 0.148, 0.075, 0.075, 0.078, 0.236, 0.784, 0.784, 0.784, 0.784, 0.741, 0.115, 0.058, 0.058, 0.058, 0.029, 0.015, 0.015, 0.015, 0.015, 0.012, 0.008, 0.604, 0.985, 1.305, 2.273, 2.528, 2.336, 2.496, 2.281, 1.397, 1.713, 3.259, 1.167, 0.745, 0.548, 1.058, 0.684, 0.728, 0.392, 0.179, 0.283, 0.283, 0.46, 0.08, 0.099, 0.099, 0.099, 0.1, 0.143, 0.137, 0.238, 0.317, 0.262, 0.225, 0.792, 0.426, 0.332, 0.261, 0.11, 0.093, 0.102, 0.171, 0.292, 0.504, 0.605, 1.745, 2.485, 1.964, 0.33, 0.171, 0.259, 0.242, 0.215, 0.366, 0.354, 0.205, 0.203, 0.262, 0.153, 0.13, 0.137, 0.362, 0.691, 0.295, 0.433, 0.154, 0.056, 0.053, 0.053, 0.053, 0.051, 0.047, 0.065, 0.078, 0.091, 0.206, 0.813, 0.102, 0.151, 0.05, 0.024, 0.004, 0.001, 0, 0, 0, 0.021, 0.021, 0.021, 0.021, 0.021, 0.013, 0.013, 0.013, 0.013, 0.013, 0.013, 0.013, 0.013, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.008, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.018, 0.021, 0.021, 0.021, 0.021, 0.003, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.024, 0.173, 0.261, 0.267, 0.267, 0.534, 1.354, 1.772, 0.72, 0.218, 0.018, 0.018, 0.028, 0.036, 0.032, 0.194, 0.082, 0.035, 0.286, 0.027, 0.038, 0.038, 0.027, 0.021, 0.014, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.016, 0.017, 0.017, 0.031, 0.047, 0.043, 0.056, 0.104, 0.149, 0.179, 0.205, 0.328, 0.998, 0.522, 1.851, 3.727, 3.273, 2.204, 1.169, 1.006, 1.179, 0.74, 0.741, 1.065, 0.925, 0.671, 0.497, 0.431, 0.327, 0.277, 0.126, 0.581, 0.207, 0.359, 2.485, 0.038, 0.036, 0.003, 0.003, 0.003, 0.003, 0.004, 0.098, 0.023, 0.021, 0.021, 0.022, 0.041, 0.041, 0.043, 0.045, 0.043, 0.014, 0.014, 0.014, 0.014, 0.014, 0.014, 0.014, 0.031, 0.046, 0.063, 0.119, 0.107, 0.092, 0.085, 0.065, 0.06, 0.054, 0.042, 0.039, 0.046, 0.044, 0.028, 0.028, 0.02, 0.013, 0.013, 0.013, 0.013, 0.016, 0.032, 0.031, 0.031, 0.031, 0.028, 0.011, 0.011, 0.011, 0.011, 0.011, 0.023, 0.024, 0.024, 0.024, 0.019, 0.015, 0.015, 0.015, 0.015, 0.015, 0.015, 0.013, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.011, 0.017, 0.024, 0.026, 0.061, 0.172, 0.206, 0.213, 0.267, 0.511, 0.668, 0.157, 0.017, 0.017, 0.017, 0.046, 0.054, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.001, 0.017, 0.017, 0.017, 0.017, 0.016, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.01, 0.017, 0.017, 0.017, 0.017, 0.012, 0.017, 0.017, 0.017, 0.017, 0.012, 0, 0, 0, 0, 0, 0.003, 0.031, 0.066, 0.093, 0.112, 0.122, 0.202, 0.068, 0.041, 0.022, 0.011, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.002, 0.005, 0.012, 0.021, 0.021, 0.019, 0.033, 0.03, 0.026, 0.026, 0.034, 0.095, 0.024, 0.024, 0.024, 0.023, 0.019, 0.018, 0.018, 0.018, 0.011, 0.03, 0.045, 0.044, 0.044, 0.044, 0.022, 0.009, 0.024, 0.033, 0.033, 0.033, 0.024, 0.009, 0, 0, 0, 0, 0, 0, 0.003, 0.017, 0.017, 0.017, 0.017, 0.014, 0, 0, 0, 0, 0, 0.032, 0.032, 0.032, 0.032, 0.032, 0.005, 0.008, 0.009, 0.014, 0.014, 0.009, 0.005, 0.004, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.007, 0.009, 0.009, 0.009, 0.009, 0.043, 0.063, 0.084, 0.098, 0.101, 0.213, 0.334, 0.383, 0.43, 0.448, 0.511, 0.801, 0.835, 1.642, 1.614, 1.496, 1.496, 1.476, 1.068, 0.481, 0.22, 0.119, 0.099, 0.07, 0.072, 0.063, 0.076, 0.14, 0.205, 0.28, 0.297, 0.3, 0.479, 0.877, 1.098, 1.611, 1.629, 1.686, 1.686, 1.631, 1.528, 1.862, 1.703, 1.531, 2.196, 0.395, 0.416, 0.453, 0.728, 0.917, 0.986, 1.17, 2.171, 3.011, 2.909, 3.301, 1.377, 0.778, 0.799, 0.947, 1.039, 0.879, 0.76, 1.372, 1.674, 1.674, 1.68, 1.823, 1.793, 1.162, 0.783, 0.216, 0.152, 0.152, 0.152, 0.049, 0, 0, 0, 0.117, 0.127, 0.127, 0.127, 0.127, 0.127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.003, 0.005, 0.005, 0.005, 0.005, 0.003, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.309, 0.364, 0.364, 0.364, 0.364, 0.063, 0.01, 0.01, 0.01, 0.012, 0.015, 0.015, 0.11, 0.55, 0.824, 0.825, 0.829, 1.39, 1.429, 1.342, 1.43, 1.636, 1.717, 2.135, 2.203, 3.191, 3.022, 1.589, 0.86, 0.807, 0.645, 0.595, 0.588, 0.557, 0.552, 1.271, 0.708, 0.677, 0.629, 0.714, 0.203, 0.133, 0.061, 0.062, 0.018, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.001, 0.072, 0.29, 0.438, 0.53, 0.557, 0.873, 1.039, 1.04, 0.208, 0.049, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.03, 0.039, 0.039, 0.039, 0.039, 0.098, 0.008, 0.007, 0.007, 0.007, 0.007, 0.007, 0.007, 0.007, 0.007, 0.007, 0.056, 0.062, 0.065, 0.065, 0.065, 0.047, 0.216, 0.256, 0.315, 0.4, 0.502, 0.449, 0.47, 0.571, 0.814, 1.153, 0.774, 0.202, 0.086, 0.075, 0.071, 0.032, 0.019, 0.003, 0.004, 0.004, 0.004, 0.004, 0.004, 0.004, 0.007, 0.072, 0.153, 0.256, 0.306, 0.404, 0.698, 0.733, 0.823, 0.715, 0.563, 0.404, 0.293, 0.217, 0.213, 0.202, 0.202, 0.294, 0.704, 0.797, 1.359, 1.101, 0.72, 0.514, 0.539, 0.434, 0.389, 0.387, 0.386, 0.375, 0.369, 0.319, 0.239, 0.183, 0.136, 0.062, 0.052, 0.096, 0.119, 0.119, 0.114, 0.127, 0.132, 0.139, 0.169, 0.191, 0.278, 0.254, 0.214, 0.237, 0.221, 0.143, 0.129, 0.125, 0.109, 0.1, 0.087, 0.06, 0.038, 0.029, 0.029, 0.028, 0.048, 0.053, 0.053, 0.111, 0.125, 0.102, 0.097, 0.097, 0.039, 0.02, 0.02, 0.02, 0.014, 0.004, 0.031, 0.043, 0.047, 0.052, 0.08, 0.144, 0.182, 0.176, 0.171, 0.149, 0.112, 0.025, 0, 0, 0, 0, 0, 0, 0, 0.016, 0.031, 0.031, 0.031, 0.031, 0.015, 0, 0, 0, 0, 0, 0.005, 0.005, 0.005, 0.005, 0.005, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.005, 0.005, 0.005, 0.005, 0.005, 0.001, 0, 0, 0
                    ]
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);

    }
    //Hrly Average Power Cuts & Duration
    _echartEnergyConsumptionColdChartDashboard[1502] = function (graphContainerId) {
        var dom = document.getElementById(graphContainerId);
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        option = {
            grid: {
                bottom: 80
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: {
                        backgroundColor: '#505765'
                    }
                }
            },
            legend: {
                data: ['Flow', 'Rainfall'],
                left: 10
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 65,
                    end: 85
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 65,
                    end: 85
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    axisLine: { onZero: false },
                    // prettier-ignore
                    data: [
                        '2009/6/12 2:00', '2009/6/12 3:00', '2009/6/12 4:00', '2009/6/12 5:00', '2009/6/12 6:00', '2009/6/12 7:00', '2009/6/12 8:00', '2009/6/12 9:00', '2009/6/12 10:00', '2009/6/12 11:00', '2009/6/12 12:00', '2009/6/12 13:00', '2009/6/12 14:00', '2009/6/12 15:00', '2009/6/12 16:00', '2009/6/12 17:00', '2009/6/12 18:00', '2009/6/12 19:00', '2009/6/12 20:00', '2009/6/12 21:00', '2009/6/12 22:00', '2009/6/12 23:00', '2009/6/13 0:00', '2009/6/13 1:00', '2009/6/13 2:00', '2009/6/13 3:00', '2009/6/13 4:00', '2009/6/13 5:00', '2009/6/13 6:00', '2009/6/13 7:00', '2009/6/13 8:00', '2009/6/13 9:00', '2009/6/13 10:00', '2009/6/13 11:00', '2009/6/13 12:00', '2009/6/13 13:00', '2009/6/13 14:00', '2009/6/13 15:00', '2009/6/13 16:00', '2009/6/13 17:00', '2009/6/13 18:00', '2009/6/13 19:00', '2009/6/13 20:00', '2009/6/13 21:00', '2009/6/13 22:00', '2009/6/13 23:00', '2009/6/14 0:00', '2009/6/14 1:00', '2009/6/14 2:00', '2009/6/14 3:00', '2009/6/14 4:00', '2009/6/14 5:00', '2009/6/14 6:00', '2009/6/14 7:00', '2009/6/14 8:00', '2009/6/14 9:00', '2009/6/14 10:00', '2009/6/14 11:00', '2009/6/14 12:00', '2009/6/14 13:00', '2009/6/14 14:00', '2009/6/14 15:00', '2009/6/14 16:00', '2009/6/14 17:00', '2009/6/14 18:00', '2009/6/14 19:00', '2009/6/14 20:00', '2009/6/14 21:00', '2009/6/14 22:00', '2009/6/14 23:00', '2009/6/15 0:00', '2009/6/15 1:00', '2009/6/15 2:00', '2009/6/15 3:00', '2009/6/15 4:00', '2009/6/15 5:00', '2009/6/15 6:00', '2009/6/15 7:00', '2009/6/15 8:00', '2009/6/15 9:00', '2009/6/15 10:00', '2009/6/15 11:00', '2009/6/15 12:00', '2009/6/15 13:00', '2009/6/15 14:00', '2009/6/15 15:00', '2009/6/15 16:00', '2009/6/15 17:00', '2009/6/15 18:00', '2009/6/15 19:00', '2009/6/15 20:00', '2009/6/15 21:00', '2009/6/15 22:00', '2009/6/15 23:00', '2009/6/15 0:00', '2009/6/16 1:00', '2009/6/16 2:00', '2009/6/16 3:00', '2009/6/16 4:00', '2009/6/16 5:00', '2009/6/16 6:00', '2009/6/16 7:00', '2009/6/16 8:00', '2009/6/16 9:00', '2009/6/16 10:00', '2009/6/16 11:00', '2009/6/16 12:00', '2009/6/16 13:00', '2009/6/16 14:00', '2009/6/16 15:00', '2009/6/16 16:00', '2009/6/16 17:00', '2009/6/16 18:00', '2009/6/16 19:00', '2009/6/16 20:00', '2009/6/16 21:00', '2009/6/16 22:00', '2009/6/16 23:00', '2009/6/15 0:00', '2009/6/17 1:00', '2009/6/17 2:00', '2009/6/17 3:00', '2009/6/17 4:00', '2009/6/17 5:00', '2009/6/17 6:00', '2009/6/17 7:00', '2009/6/17 8:00', '2009/6/17 9:00', '2009/6/17 10:00', '2009/6/17 11:00', '2009/6/17 12:00', '2009/6/17 13:00', '2009/6/17 14:00', '2009/6/17 15:00', '2009/6/17 16:00', '2009/6/17 17:00', '2009/6/17 18:00', '2009/6/17 19:00', '2009/6/17 20:00', '2009/6/17 21:00', '2009/6/17 22:00', '2009/6/17 23:00', '2009/6/18 0:00', '2009/6/18 1:00', '2009/6/18 2:00', '2009/6/18 3:00', '2009/6/18 4:00', '2009/6/18 5:00', '2009/6/18 6:00', '2009/6/18 7:00', '2009/6/18 8:00', '2009/6/18 9:00', '2009/6/18 10:00', '2009/6/18 11:00', '2009/6/18 12:00', '2009/6/18 13:00', '2009/6/18 14:00', '2009/6/18 15:00', '2009/6/18 16:00', '2009/6/18 17:00', '2009/6/18 18:00', '2009/6/18 19:00', '2009/6/18 20:00', '2009/6/18 21:00', '2009/6/18 22:00', '2009/6/18 23:00', '2009/6/15 0:00', '2009/6/19 1:00', '2009/6/19 2:00', '2009/6/19 3:00', '2009/6/19 4:00', '2009/6/19 5:00', '2009/6/19 6:00', '2009/6/19 7:00', '2009/6/19 8:00', '2009/6/19 9:00', '2009/6/19 10:00', '2009/6/19 11:00', '2009/6/19 12:00', '2009/6/19 13:00', '2009/6/19 14:00', '2009/6/19 15:00', '2009/6/19 16:00', '2009/6/19 17:00', '2009/6/19 18:00', '2009/6/19 19:00', '2009/6/19 20:00', '2009/6/19 21:00', '2009/6/19 22:00', '2009/6/19 23:00', '2009/6/20 0:00', '2009/6/20 1:00', '2009/6/20 2:00', '2009/6/20 3:00', '2009/6/20 4:00', '2009/6/20 5:00', '2009/6/20 6:00', '2009/6/20 7:00', '2009/6/20 8:00', '2009/6/20 9:00', '2009/6/20 10:00', '2009/6/20 11:00', '2009/6/20 12:00', '2009/6/20 13:00', '2009/6/20 14:00', '2009/6/20 15:00', '2009/6/20 16:00', '2009/6/20 17:00', '2009/6/20 18:00', '2009/6/20 19:00', '2009/6/20 20:00', '2009/6/20 21:00', '2009/6/20 22:00', '2009/6/20 23:00', '2009/6/21 0:00', '2009/6/21 1:00', '2009/6/21 2:00', '2009/6/21 3:00', '2009/6/21 4:00', '2009/6/21 5:00', '2009/6/21 6:00', '2009/6/21 7:00', '2009/6/21 8:00', '2009/6/21 9:00', '2009/6/21 10:00', '2009/6/21 11:00', '2009/6/21 12:00', '2009/6/21 13:00', '2009/6/21 14:00', '2009/6/21 15:00', '2009/6/21 16:00', '2009/6/21 17:00', '2009/6/21 18:00', '2009/6/21 19:00', '2009/6/21 20:00', '2009/6/21 21:00', '2009/6/21 22:00', '2009/6/21 23:00', '2009/6/22 0:00', '2009/6/22 1:00', '2009/6/22 2:00', '2009/6/22 3:00', '2009/6/22 4:00', '2009/6/22 5:00', '2009/6/22 6:00', '2009/6/22 7:00', '2009/6/22 8:00', '2009/6/22 9:00', '2009/6/22 10:00', '2009/6/22 11:00', '2009/6/22 12:00', '2009/6/22 13:00', '2009/6/22 14:00', '2009/6/22 15:00', '2009/6/22 16:00', '2009/6/22 17:00', '2009/6/22 18:00', '2009/6/22 19:00', '2009/6/22 20:00', '2009/6/22 21:00', '2009/6/22 22:00', '2009/6/22 23:00', '2009/6/23 0:00', '2009/6/23 1:00', '2009/6/23 2:00', '2009/6/23 3:00', '2009/6/23 4:00', '2009/6/23 5:00', '2009/6/23 6:00', '2009/6/23 7:00', '2009/6/23 8:00', '2009/6/23 9:00', '2009/6/23 10:00', '2009/6/23 11:00', '2009/6/23 12:00', '2009/6/23 13:00', '2009/6/23 14:00', '2009/6/23 15:00', '2009/6/23 16:00', '2009/6/23 17:00', '2009/6/23 18:00', '2009/6/23 19:00', '2009/6/23 20:00', '2009/6/23 21:00', '2009/6/23 22:00', '2009/6/23 23:00', '2009/6/24 0:00', '2009/6/24 1:00', '2009/6/24 2:00', '2009/6/24 3:00', '2009/6/24 4:00', '2009/6/24 5:00', '2009/6/24 6:00', '2009/6/24 7:00', '2009/6/24 8:00', '2009/6/24 9:00', '2009/6/24 10:00', '2009/6/24 11:00', '2009/6/24 12:00', '2009/6/24 13:00', '2009/6/24 14:00', '2009/6/24 15:00', '2009/6/24 16:00', '2009/6/24 17:00', '2009/6/24 18:00', '2009/6/24 19:00', '2009/6/24 20:00', '2009/6/24 21:00', '2009/6/24 22:00', '2009/6/24 23:00', '2009/6/25 0:00', '2009/6/25 1:00', '2009/6/25 2:00', '2009/6/25 3:00', '2009/6/25 4:00', '2009/6/25 5:00', '2009/6/25 6:00', '2009/6/25 7:00', '2009/6/25 8:00', '2009/6/25 9:00', '2009/6/25 10:00', '2009/6/25 11:00', '2009/6/25 12:00', '2009/6/25 13:00', '2009/6/25 14:00', '2009/6/25 15:00', '2009/6/25 16:00', '2009/6/25 17:00', '2009/6/25 18:00', '2009/6/25 19:00', '2009/6/25 20:00', '2009/6/25 21:00', '2009/6/25 22:00', '2009/6/25 23:00', '2009/6/26 0:00', '2009/6/26 1:00', '2009/6/26 2:00', '2009/6/26 3:00', '2009/6/26 4:00', '2009/6/26 5:00', '2009/6/26 6:00', '2009/6/26 7:00', '2009/6/26 8:00', '2009/6/26 9:00', '2009/6/26 10:00', '2009/6/26 11:00', '2009/6/26 12:00', '2009/6/26 13:00', '2009/6/26 14:00', '2009/6/26 15:00', '2009/6/26 16:00', '2009/6/26 17:00', '2009/6/26 18:00', '2009/6/26 19:00', '2009/6/26 20:00', '2009/6/26 21:00', '2009/6/26 22:00', '2009/6/26 23:00', '2009/6/27 0:00', '2009/6/27 1:00', '2009/6/27 2:00', '2009/6/27 3:00', '2009/6/27 4:00', '2009/6/27 5:00', '2009/6/27 6:00', '2009/6/27 7:00', '2009/6/27 8:00', '2009/6/27 9:00', '2009/6/27 10:00', '2009/6/27 11:00', '2009/6/27 12:00', '2009/6/27 13:00', '2009/6/27 14:00', '2009/6/27 15:00', '2009/6/27 16:00', '2009/6/27 17:00', '2009/6/27 18:00', '2009/6/27 19:00', '2009/6/27 20:00', '2009/6/27 21:00', '2009/6/27 22:00', '2009/6/27 23:00', '2009/6/28 0:00', '2009/6/28 1:00', '2009/6/28 2:00', '2009/6/28 3:00', '2009/6/28 4:00', '2009/6/28 5:00', '2009/6/28 6:00', '2009/6/28 7:00', '2009/6/28 8:00', '2009/6/28 9:00', '2009/6/28 10:00', '2009/6/28 11:00', '2009/6/28 12:00', '2009/6/28 13:00', '2009/6/28 14:00', '2009/6/28 15:00', '2009/6/28 16:00', '2009/6/28 17:00', '2009/6/28 18:00', '2009/6/28 19:00', '2009/6/28 20:00', '2009/6/28 21:00', '2009/6/28 22:00', '2009/6/28 23:00', '2009/6/29 0:00', '2009/6/29 1:00', '2009/6/29 2:00', '2009/6/29 3:00', '2009/6/29 4:00', '2009/6/29 5:00', '2009/6/29 6:00', '2009/6/29 7:00', '2009/6/29 8:00', '2009/6/29 9:00', '2009/6/29 10:00', '2009/6/29 11:00', '2009/6/29 12:00', '2009/6/29 13:00', '2009/6/29 14:00', '2009/6/29 15:00', '2009/6/29 16:00', '2009/6/29 17:00', '2009/6/29 18:00', '2009/6/29 19:00', '2009/6/29 20:00', '2009/6/29 21:00', '2009/6/29 22:00', '2009/6/29 23:00', '2009/6/30 0:00', '2009/6/30 1:00', '2009/6/30 2:00', '2009/6/30 3:00', '2009/6/30 4:00', '2009/6/30 5:00', '2009/6/30 6:00', '2009/6/30 7:00', '2009/6/30 8:00', '2009/6/30 9:00', '2009/6/30 10:00', '2009/6/30 11:00', '2009/6/30 12:00', '2009/6/30 13:00', '2009/6/30 14:00', '2009/6/30 15:00', '2009/6/30 16:00', '2009/6/30 17:00', '2009/6/30 18:00', '2009/6/30 19:00', '2009/6/30 20:00', '2009/6/30 21:00', '2009/6/30 22:00', '2009/6/30 23:00', '2009/7/1 0:00', '2009/7/1 1:00', '2009/7/1 2:00', '2009/7/1 3:00', '2009/7/1 4:00', '2009/7/1 5:00', '2009/7/1 6:00', '2009/7/1 7:00', '2009/7/1 8:00', '2009/7/1 9:00', '2009/7/1 10:00', '2009/7/1 11:00', '2009/7/1 12:00', '2009/7/1 13:00', '2009/7/1 14:00', '2009/7/1 15:00', '2009/7/1 16:00', '2009/7/1 17:00', '2009/7/1 18:00', '2009/7/1 19:00', '2009/7/1 20:00', '2009/7/1 21:00', '2009/7/1 22:00', '2009/7/1 23:00', '2009/7/2 0:00', '2009/7/2 1:00', '2009/7/2 2:00', '2009/7/2 3:00', '2009/7/2 4:00', '2009/7/2 5:00', '2009/7/2 6:00', '2009/7/2 7:00', '2009/7/2 8:00', '2009/7/2 9:00', '2009/7/2 10:00', '2009/7/2 11:00', '2009/7/2 12:00', '2009/7/2 13:00', '2009/7/2 14:00', '2009/7/2 15:00', '2009/7/2 16:00', '2009/7/2 17:00', '2009/7/2 18:00', '2009/7/2 19:00', '2009/7/2 20:00', '2009/7/2 21:00', '2009/7/2 22:00', '2009/7/2 23:00', '2009/7/3 0:00', '2009/7/3 1:00', '2009/7/3 2:00', '2009/7/3 3:00', '2009/7/3 4:00', '2009/7/3 5:00', '2009/7/3 6:00', '2009/7/3 7:00', '2009/7/3 8:00', '2009/7/3 9:00', '2009/7/3 10:00', '2009/7/3 11:00', '2009/7/3 12:00', '2009/7/3 13:00', '2009/7/3 14:00', '2009/7/3 15:00', '2009/7/3 16:00', '2009/7/3 17:00', '2009/7/3 18:00', '2009/7/3 19:00', '2009/7/3 20:00', '2009/7/3 21:00', '2009/7/3 22:00', '2009/7/3 23:00', '2009/7/4 0:00', '2009/7/4 1:00', '2009/7/4 2:00', '2009/7/4 3:00', '2009/7/4 4:00', '2009/7/4 5:00', '2009/7/4 6:00', '2009/7/4 7:00', '2009/7/4 8:00', '2009/7/4 9:00', '2009/7/4 10:00', '2009/7/4 11:00', '2009/7/4 12:00', '2009/7/4 13:00', '2009/7/4 14:00', '2009/7/4 15:00', '2009/7/4 16:00', '2009/7/4 17:00', '2009/7/4 18:00', '2009/7/4 19:00', '2009/7/4 20:00', '2009/7/4 21:00', '2009/7/4 22:00', '2009/7/4 23:00', '2009/7/5 0:00', '2009/7/5 1:00', '2009/7/5 2:00', '2009/7/5 3:00', '2009/7/5 4:00', '2009/7/5 5:00', '2009/7/5 6:00', '2009/7/5 7:00', '2009/7/5 8:00', '2009/7/5 9:00', '2009/7/5 10:00', '2009/7/5 11:00', '2009/7/5 12:00', '2009/7/5 13:00', '2009/7/5 14:00', '2009/7/5 15:00', '2009/7/5 16:00', '2009/7/5 17:00', '2009/7/5 18:00', '2009/7/5 19:00', '2009/7/5 20:00', '2009/7/5 21:00', '2009/7/5 22:00', '2009/7/5 23:00', '2009/7/6 0:00', '2009/7/6 1:00', '2009/7/6 2:00', '2009/7/6 3:00', '2009/7/6 4:00', '2009/7/6 5:00', '2009/7/6 6:00', '2009/7/6 7:00', '2009/7/6 8:00', '2009/7/6 9:00', '2009/7/6 10:00', '2009/7/6 11:00', '2009/7/6 12:00', '2009/7/6 13:00', '2009/7/6 14:00', '2009/7/6 15:00', '2009/7/6 16:00', '2009/7/6 17:00', '2009/7/6 18:00', '2009/7/6 19:00', '2009/7/6 20:00', '2009/7/6 21:00', '2009/7/6 22:00', '2009/7/6 23:00', '2009/7/7 0:00', '2009/7/7 1:00', '2009/7/7 2:00', '2009/7/7 3:00', '2009/7/7 4:00', '2009/7/7 5:00', '2009/7/7 6:00', '2009/7/7 7:00', '2009/7/7 8:00', '2009/7/7 9:00', '2009/7/7 10:00', '2009/7/7 11:00', '2009/7/7 12:00', '2009/7/7 13:00', '2009/7/7 14:00', '2009/7/7 15:00', '2009/7/7 16:00', '2009/7/7 17:00', '2009/7/7 18:00', '2009/7/7 19:00', '2009/7/7 20:00', '2009/7/7 21:00', '2009/7/7 22:00', '2009/7/7 23:00', '2009/7/8 0:00', '2009/7/8 1:00', '2009/7/8 2:00', '2009/7/8 3:00', '2009/7/8 4:00', '2009/7/8 5:00', '2009/7/8 6:00', '2009/7/8 7:00', '2009/7/8 8:00', '2009/7/8 9:00', '2009/7/8 10:00', '2009/7/8 11:00', '2009/7/8 12:00', '2009/7/8 13:00', '2009/7/8 14:00', '2009/7/8 15:00', '2009/7/8 16:00', '2009/7/8 17:00', '2009/7/8 18:00', '2009/7/8 19:00', '2009/7/8 20:00', '2009/7/8 21:00', '2009/7/8 22:00', '2009/7/8 23:00', '2009/7/9 0:00', '2009/7/9 1:00', '2009/7/9 2:00', '2009/7/9 3:00', '2009/7/9 4:00', '2009/7/9 5:00', '2009/7/9 6:00', '2009/7/9 7:00', '2009/7/9 8:00', '2009/7/9 9:00', '2009/7/9 10:00', '2009/7/9 11:00', '2009/7/9 12:00', '2009/7/9 13:00', '2009/7/9 14:00', '2009/7/9 15:00', '2009/7/9 16:00', '2009/7/9 17:00', '2009/7/9 18:00', '2009/7/9 19:00', '2009/7/9 20:00', '2009/7/9 21:00', '2009/7/9 22:00', '2009/7/9 23:00', '2009/7/10 0:00', '2009/7/10 1:00', '2009/7/10 2:00', '2009/7/10 3:00', '2009/7/10 4:00', '2009/7/10 5:00', '2009/7/10 6:00', '2009/7/10 7:00', '2009/7/10 8:00', '2009/7/10 9:00', '2009/7/10 10:00', '2009/7/10 11:00', '2009/7/10 12:00', '2009/7/10 13:00', '2009/7/10 14:00', '2009/7/10 15:00', '2009/7/10 16:00', '2009/7/10 17:00', '2009/7/10 18:00', '2009/7/10 19:00', '2009/7/10 20:00', '2009/7/10 21:00', '2009/7/10 22:00', '2009/7/10 23:00', '2009/7/11 0:00', '2009/7/11 1:00', '2009/7/11 2:00', '2009/7/11 3:00', '2009/7/11 4:00', '2009/7/11 5:00', '2009/7/11 6:00', '2009/7/11 7:00', '2009/7/11 8:00', '2009/7/11 9:00', '2009/7/11 10:00', '2009/7/11 11:00', '2009/7/11 12:00', '2009/7/11 13:00', '2009/7/11 14:00', '2009/7/11 15:00', '2009/7/11 16:00', '2009/7/11 17:00', '2009/7/11 18:00', '2009/7/11 19:00', '2009/7/11 20:00', '2009/7/11 21:00', '2009/7/11 22:00', '2009/7/11 23:00', '2009/7/12 0:00', '2009/7/12 1:00', '2009/7/12 2:00', '2009/7/12 3:00', '2009/7/12 4:00', '2009/7/12 5:00', '2009/7/12 6:00', '2009/7/12 7:00', '2009/7/12 8:00', '2009/7/12 9:00', '2009/7/12 10:00', '2009/7/12 11:00', '2009/7/12 12:00', '2009/7/12 13:00', '2009/7/12 14:00', '2009/7/12 15:00', '2009/7/12 16:00', '2009/7/12 17:00', '2009/7/12 18:00', '2009/7/12 19:00', '2009/7/12 20:00', '2009/7/12 21:00', '2009/7/12 22:00', '2009/7/12 23:00', '2009/7/13 0:00', '2009/7/13 1:00', '2009/7/13 2:00', '2009/7/13 3:00', '2009/7/13 4:00', '2009/7/13 5:00', '2009/7/13 6:00', '2009/7/13 7:00', '2009/7/13 8:00', '2009/7/13 9:00', '2009/7/13 10:00', '2009/7/13 11:00', '2009/7/13 12:00', '2009/7/13 13:00', '2009/7/13 14:00', '2009/7/13 15:00', '2009/7/13 16:00', '2009/7/13 17:00', '2009/7/13 18:00', '2009/7/13 19:00', '2009/7/13 20:00', '2009/7/13 21:00', '2009/7/13 22:00', '2009/7/13 23:00', '2009/7/14 0:00', '2009/7/14 1:00', '2009/7/14 2:00', '2009/7/14 3:00', '2009/7/14 4:00', '2009/7/14 5:00', '2009/7/14 6:00', '2009/7/14 7:00', '2009/7/14 8:00', '2009/7/14 9:00', '2009/7/14 10:00', '2009/7/14 11:00', '2009/7/14 12:00', '2009/7/14 13:00', '2009/7/14 14:00', '2009/7/14 15:00', '2009/7/14 16:00', '2009/7/14 17:00', '2009/7/14 18:00', '2009/7/14 19:00', '2009/7/14 20:00', '2009/7/14 21:00', '2009/7/14 22:00', '2009/7/14 23:00', '2009/7/15 0:00', '2009/7/15 1:00', '2009/7/15 2:00', '2009/7/15 3:00', '2009/7/15 4:00', '2009/7/15 5:00', '2009/7/15 6:00', '2009/7/15 7:00', '2009/7/15 8:00', '2009/7/15 9:00', '2009/7/15 10:00', '2009/7/15 11:00', '2009/7/15 12:00', '2009/7/15 13:00', '2009/7/15 14:00', '2009/7/15 15:00', '2009/7/15 16:00', '2009/7/15 17:00', '2009/7/15 18:00', '2009/7/15 19:00', '2009/7/15 20:00', '2009/7/15 21:00', '2009/7/15 22:00', '2009/7/15 23:00', '2009/7/16 0:00', '2009/7/16 1:00', '2009/7/16 2:00', '2009/7/16 3:00', '2009/7/16 4:00', '2009/7/16 5:00', '2009/7/16 6:00', '2009/7/16 7:00', '2009/7/16 8:00', '2009/7/16 9:00', '2009/7/16 10:00', '2009/7/16 11:00', '2009/7/16 12:00', '2009/7/16 13:00', '2009/7/16 14:00', '2009/7/16 15:00', '2009/7/16 16:00', '2009/7/16 17:00', '2009/7/16 18:00', '2009/7/16 19:00', '2009/7/16 20:00', '2009/7/16 21:00', '2009/7/16 22:00', '2009/7/16 23:00', '2009/7/17 0:00', '2009/7/17 1:00', '2009/7/17 2:00', '2009/7/17 3:00', '2009/7/17 4:00', '2009/7/17 5:00', '2009/7/17 6:00', '2009/7/17 7:00', '2009/7/17 8:00', '2009/7/17 9:00', '2009/7/17 10:00', '2009/7/17 11:00', '2009/7/17 12:00', '2009/7/17 13:00', '2009/7/17 14:00', '2009/7/17 15:00', '2009/7/17 16:00', '2009/7/17 17:00', '2009/7/17 18:00', '2009/7/17 19:00', '2009/7/17 20:00', '2009/7/17 21:00', '2009/7/17 22:00', '2009/7/17 23:00', '2009/7/18 0:00', '2009/7/18 1:00', '2009/7/18 2:00', '2009/7/18 3:00', '2009/7/18 4:00', '2009/7/18 5:00', '2009/7/18 6:00', '2009/7/18 7:00', '2009/7/18 8:00', '2009/7/18 9:00', '2009/7/18 10:00', '2009/7/18 11:00', '2009/7/18 12:00', '2009/7/18 13:00', '2009/7/18 14:00', '2009/7/18 15:00', '2009/7/18 16:00', '2009/7/18 17:00', '2009/7/18 18:00', '2009/7/18 19:00', '2009/7/18 20:00', '2009/7/18 21:00', '2009/7/18 22:00', '2009/7/18 23:00', '2009/7/19 0:00', '2009/7/19 1:00', '2009/7/19 2:00', '2009/7/19 3:00', '2009/7/19 4:00', '2009/7/19 5:00', '2009/7/19 6:00', '2009/7/19 7:00', '2009/7/19 8:00', '2009/7/19 9:00', '2009/7/19 10:00', '2009/7/19 11:00', '2009/7/19 12:00', '2009/7/19 13:00', '2009/7/19 14:00', '2009/7/19 15:00', '2009/7/19 16:00', '2009/7/19 17:00', '2009/7/19 18:00', '2009/7/19 19:00', '2009/7/19 20:00', '2009/7/19 21:00', '2009/7/19 22:00', '2009/7/19 23:00', '2009/7/20 0:00', '2009/7/20 1:00', '2009/7/20 2:00', '2009/7/20 3:00', '2009/7/20 4:00', '2009/7/20 5:00', '2009/7/20 6:00', '2009/7/20 7:00', '2009/7/20 8:00', '2009/7/20 9:00', '2009/7/20 10:00', '2009/7/20 11:00', '2009/7/20 12:00', '2009/7/20 13:00', '2009/7/20 14:00', '2009/7/20 15:00', '2009/7/20 16:00', '2009/7/20 17:00', '2009/7/20 18:00', '2009/7/20 19:00', '2009/7/20 20:00', '2009/7/20 21:00', '2009/7/20 22:00', '2009/7/20 23:00', '2009/7/21 0:00', '2009/7/21 1:00', '2009/7/21 2:00', '2009/7/21 3:00', '2009/7/21 4:00', '2009/7/21 5:00', '2009/7/21 6:00', '2009/7/21 7:00', '2009/7/21 8:00', '2009/7/21 9:00', '2009/7/21 10:00', '2009/7/21 11:00', '2009/7/21 12:00', '2009/7/21 13:00', '2009/7/21 14:00', '2009/7/21 15:00', '2009/7/21 16:00', '2009/7/21 17:00', '2009/7/21 18:00', '2009/7/21 19:00', '2009/7/21 20:00', '2009/7/21 21:00', '2009/7/21 22:00', '2009/7/21 23:00', '2009/7/22 0:00', '2009/7/22 1:00', '2009/7/22 2:00', '2009/7/22 3:00', '2009/7/22 4:00', '2009/7/22 5:00', '2009/7/22 6:00', '2009/7/22 7:00', '2009/7/22 8:00', '2009/7/22 9:00', '2009/7/22 10:00', '2009/7/22 11:00', '2009/7/22 12:00', '2009/7/22 13:00', '2009/7/22 14:00', '2009/7/22 15:00', '2009/7/22 16:00', '2009/7/22 17:00', '2009/7/22 18:00', '2009/7/22 19:00', '2009/7/22 20:00', '2009/7/22 21:00', '2009/7/22 22:00', '2009/7/22 23:00', '2009/7/23 0:00', '2009/7/23 1:00', '2009/7/23 2:00', '2009/7/23 3:00', '2009/7/23 4:00', '2009/7/23 5:00', '2009/7/23 6:00', '2009/7/23 7:00', '2009/7/23 8:00', '2009/7/23 9:00', '2009/7/23 10:00', '2009/7/23 11:00', '2009/7/23 12:00', '2009/7/23 13:00', '2009/7/23 14:00', '2009/7/23 15:00', '2009/7/23 16:00', '2009/7/23 17:00', '2009/7/23 18:00', '2009/7/23 19:00', '2009/7/23 20:00', '2009/7/23 21:00', '2009/7/23 22:00', '2009/7/23 23:00', '2009/7/24 0:00', '2009/7/24 1:00', '2009/7/24 2:00', '2009/7/24 3:00', '2009/7/24 4:00', '2009/7/24 5:00', '2009/7/24 6:00', '2009/7/24 7:00', '2009/7/24 8:00', '2009/7/24 9:00', '2009/7/24 10:00', '2009/7/24 11:00', '2009/7/24 12:00', '2009/7/24 13:00', '2009/7/24 14:00', '2009/7/24 15:00', '2009/7/24 16:00', '2009/7/24 17:00', '2009/7/24 18:00', '2009/7/24 19:00', '2009/7/24 20:00', '2009/7/24 21:00', '2009/7/24 22:00', '2009/7/24 23:00', '2009/7/25 0:00', '2009/7/25 1:00', '2009/7/25 2:00', '2009/7/25 3:00', '2009/7/25 4:00', '2009/7/25 5:00', '2009/7/25 6:00', '2009/7/25 7:00', '2009/7/25 8:00', '2009/7/25 9:00', '2009/7/25 10:00', '2009/7/25 11:00', '2009/7/25 12:00', '2009/7/25 13:00', '2009/7/25 14:00', '2009/7/25 15:00', '2009/7/25 16:00', '2009/7/25 17:00', '2009/7/25 18:00', '2009/7/25 19:00', '2009/7/25 20:00', '2009/7/25 21:00', '2009/7/25 22:00', '2009/7/25 23:00', '2009/7/26 0:00', '2009/7/26 1:00', '2009/7/26 2:00', '2009/7/26 3:00', '2009/7/26 4:00', '2009/7/26 5:00', '2009/7/26 6:00', '2009/7/26 7:00', '2009/7/26 8:00', '2009/7/26 9:00', '2009/7/26 10:00', '2009/7/26 11:00', '2009/7/26 12:00', '2009/7/26 13:00', '2009/7/26 14:00', '2009/7/26 15:00', '2009/7/26 16:00', '2009/7/26 17:00', '2009/7/26 18:00', '2009/7/26 19:00', '2009/7/26 20:00', '2009/7/26 21:00', '2009/7/26 22:00', '2009/7/26 23:00', '2009/7/27 0:00', '2009/7/27 1:00', '2009/7/27 2:00', '2009/7/27 3:00', '2009/7/27 4:00', '2009/7/27 5:00', '2009/7/27 6:00', '2009/7/27 7:00', '2009/7/27 8:00', '2009/7/27 9:00', '2009/7/27 10:00', '2009/7/27 11:00', '2009/7/27 12:00', '2009/7/27 13:00', '2009/7/27 14:00', '2009/7/27 15:00', '2009/7/27 16:00', '2009/7/27 17:00', '2009/7/27 18:00', '2009/7/27 19:00', '2009/7/27 20:00', '2009/7/27 21:00', '2009/7/27 22:00', '2009/7/27 23:00', '2009/7/28 0:00', '2009/7/28 1:00', '2009/7/28 2:00', '2009/7/28 3:00', '2009/7/28 4:00', '2009/7/28 5:00', '2009/7/28 6:00', '2009/7/28 7:00', '2009/7/28 8:00', '2009/7/28 9:00', '2009/7/28 10:00', '2009/7/28 11:00', '2009/7/28 12:00', '2009/7/28 13:00', '2009/7/28 14:00', '2009/7/28 15:00', '2009/7/28 16:00', '2009/7/28 17:00', '2009/7/28 18:00', '2009/7/28 19:00', '2009/7/28 20:00', '2009/7/28 21:00', '2009/7/28 22:00', '2009/7/28 23:00', '2009/7/29 0:00', '2009/7/29 1:00', '2009/7/29 2:00', '2009/7/29 3:00', '2009/7/29 4:00', '2009/7/29 5:00', '2009/7/29 6:00', '2009/7/29 7:00', '2009/7/29 8:00', '2009/7/29 9:00', '2009/7/29 10:00', '2009/7/29 11:00', '2009/7/29 12:00', '2009/7/29 13:00', '2009/7/29 14:00', '2009/7/29 15:00', '2009/7/29 16:00', '2009/7/29 17:00', '2009/7/29 18:00', '2009/7/29 19:00', '2009/7/29 20:00', '2009/7/29 21:00', '2009/7/29 22:00', '2009/7/29 23:00', '2009/7/30 0:00', '2009/7/30 1:00', '2009/7/30 2:00', '2009/7/30 3:00', '2009/7/30 4:00', '2009/7/30 5:00', '2009/7/30 6:00', '2009/7/30 7:00', '2009/7/30 8:00', '2009/7/30 9:00', '2009/7/30 10:00', '2009/7/30 11:00', '2009/7/30 12:00', '2009/7/30 13:00', '2009/7/30 14:00', '2009/7/30 15:00', '2009/7/30 16:00', '2009/7/30 17:00', '2009/7/30 18:00', '2009/7/30 19:00', '2009/7/30 20:00', '2009/7/30 21:00', '2009/7/30 22:00', '2009/7/30 23:00', '2009/7/31 0:00', '2009/7/31 1:00', '2009/7/31 2:00', '2009/7/31 3:00', '2009/7/31 4:00', '2009/7/31 5:00', '2009/7/31 6:00', '2009/7/31 7:00', '2009/7/31 8:00', '2009/7/31 9:00', '2009/7/31 10:00', '2009/7/31 11:00', '2009/7/31 12:00', '2009/7/31 13:00', '2009/7/31 14:00', '2009/7/31 15:00', '2009/7/31 16:00', '2009/7/31 17:00', '2009/7/31 18:00', '2009/7/31 19:00', '2009/7/31 20:00', '2009/7/31 21:00', '2009/7/31 22:00', '2009/7/31 23:00', '2009/8/1 0:00', '2009/8/1 1:00', '2009/8/1 2:00', '2009/8/1 3:00', '2009/8/1 4:00', '2009/8/1 5:00', '2009/8/1 6:00', '2009/8/1 7:00', '2009/8/1 8:00', '2009/8/1 9:00', '2009/8/1 10:00', '2009/8/1 11:00', '2009/8/1 12:00', '2009/8/1 13:00', '2009/8/1 14:00', '2009/8/1 15:00', '2009/8/1 16:00', '2009/8/1 17:00', '2009/8/1 18:00', '2009/8/1 19:00', '2009/8/1 20:00', '2009/8/1 21:00', '2009/8/1 22:00', '2009/8/1 23:00', '2009/8/2 0:00', '2009/8/2 1:00', '2009/8/2 2:00', '2009/8/2 3:00', '2009/8/2 4:00', '2009/8/2 5:00', '2009/8/2 6:00', '2009/8/2 7:00', '2009/8/2 8:00', '2009/8/2 9:00', '2009/8/2 10:00', '2009/8/2 11:00', '2009/8/2 12:00', '2009/8/2 13:00', '2009/8/2 14:00', '2009/8/2 15:00', '2009/8/2 16:00', '2009/8/2 17:00', '2009/8/2 18:00', '2009/8/2 19:00', '2009/8/2 20:00', '2009/8/2 21:00', '2009/8/2 22:00', '2009/8/2 23:00', '2009/8/3 0:00', '2009/8/3 1:00', '2009/8/3 2:00', '2009/8/3 3:00', '2009/8/3 4:00', '2009/8/3 5:00', '2009/8/3 6:00', '2009/8/3 7:00', '2009/8/3 8:00', '2009/8/3 9:00', '2009/8/3 10:00', '2009/8/3 11:00', '2009/8/3 12:00', '2009/8/3 13:00', '2009/8/3 14:00', '2009/8/3 15:00', '2009/8/3 16:00', '2009/8/3 17:00', '2009/8/3 18:00', '2009/8/3 19:00', '2009/8/3 20:00', '2009/8/3 21:00', '2009/8/3 22:00', '2009/8/3 23:00', '2009/8/4 0:00', '2009/8/4 1:00', '2009/8/4 2:00', '2009/8/4 3:00', '2009/8/4 4:00', '2009/8/4 5:00', '2009/8/4 6:00', '2009/8/4 7:00', '2009/8/4 8:00', '2009/8/4 9:00', '2009/8/4 10:00', '2009/8/4 11:00', '2009/8/4 12:00', '2009/8/4 13:00', '2009/8/4 14:00', '2009/8/4 15:00', '2009/8/4 16:00', '2009/8/4 17:00', '2009/8/4 18:00', '2009/8/4 19:00', '2009/8/4 20:00', '2009/8/4 21:00', '2009/8/4 22:00', '2009/8/4 23:00', '2009/8/5 0:00', '2009/8/5 1:00', '2009/8/5 2:00', '2009/8/5 3:00', '2009/8/5 4:00', '2009/8/5 5:00', '2009/8/5 6:00', '2009/8/5 7:00', '2009/8/5 8:00', '2009/8/5 9:00', '2009/8/5 10:00', '2009/8/5 11:00', '2009/8/5 12:00', '2009/8/5 13:00', '2009/8/5 14:00', '2009/8/5 15:00', '2009/8/5 16:00', '2009/8/5 17:00', '2009/8/5 18:00', '2009/8/5 19:00', '2009/8/5 20:00', '2009/8/5 21:00', '2009/8/5 22:00', '2009/8/5 23:00', '2009/8/6 0:00', '2009/8/6 1:00', '2009/8/6 2:00', '2009/8/6 3:00', '2009/8/6 4:00', '2009/8/6 5:00', '2009/8/6 6:00', '2009/8/6 7:00', '2009/8/6 8:00', '2009/8/6 9:00', '2009/8/6 10:00', '2009/8/6 11:00', '2009/8/6 12:00', '2009/8/6 13:00', '2009/8/6 14:00', '2009/8/6 15:00', '2009/8/6 16:00', '2009/8/6 17:00', '2009/8/6 18:00', '2009/8/6 19:00', '2009/8/6 20:00', '2009/8/6 21:00', '2009/8/6 22:00', '2009/8/6 23:00', '2009/8/7 0:00', '2009/8/7 1:00', '2009/8/7 2:00', '2009/8/7 3:00', '2009/8/7 4:00', '2009/8/7 5:00', '2009/8/7 6:00', '2009/8/7 7:00', '2009/8/7 8:00', '2009/8/7 9:00', '2009/8/7 10:00', '2009/8/7 11:00', '2009/8/7 12:00', '2009/8/7 13:00', '2009/8/7 14:00', '2009/8/7 15:00', '2009/8/7 16:00', '2009/8/7 17:00', '2009/8/7 18:00', '2009/8/7 19:00', '2009/8/7 20:00', '2009/8/7 21:00', '2009/8/7 22:00', '2009/8/7 23:00', '2009/8/8 0:00', '2009/8/8 1:00', '2009/8/8 2:00', '2009/8/8 3:00', '2009/8/8 4:00', '2009/8/8 5:00', '2009/8/8 6:00', '2009/8/8 7:00', '2009/8/8 8:00', '2009/8/8 9:00', '2009/8/8 10:00', '2009/8/8 11:00', '2009/8/8 12:00', '2009/8/8 13:00', '2009/8/8 14:00', '2009/8/8 15:00', '2009/8/8 16:00', '2009/8/8 17:00', '2009/8/8 18:00', '2009/8/8 19:00', '2009/8/8 20:00', '2009/8/8 21:00', '2009/8/8 22:00', '2009/8/8 23:00', '2009/8/9 0:00', '2009/8/9 1:00', '2009/8/9 2:00', '2009/8/9 3:00', '2009/8/9 4:00', '2009/8/9 5:00', '2009/8/9 6:00', '2009/8/9 7:00', '2009/8/9 8:00', '2009/8/9 9:00', '2009/8/9 10:00', '2009/8/9 11:00', '2009/8/9 12:00', '2009/8/9 13:00', '2009/8/9 14:00', '2009/8/9 15:00', '2009/8/9 16:00', '2009/8/9 17:00', '2009/8/9 18:00', '2009/8/9 19:00', '2009/8/9 20:00', '2009/8/9 21:00', '2009/8/9 22:00', '2009/8/9 23:00', '2009/8/10 0:00', '2009/8/10 1:00', '2009/8/10 2:00', '2009/8/10 3:00', '2009/8/10 4:00', '2009/8/10 5:00', '2009/8/10 6:00', '2009/8/10 7:00', '2009/8/10 8:00', '2009/8/10 9:00', '2009/8/10 10:00', '2009/8/10 11:00', '2009/8/10 12:00', '2009/8/10 13:00', '2009/8/10 14:00', '2009/8/10 15:00', '2009/8/10 16:00', '2009/8/10 17:00', '2009/8/10 18:00', '2009/8/10 19:00', '2009/8/10 20:00', '2009/8/10 21:00', '2009/8/10 22:00', '2009/8/10 23:00', '2009/8/11 0:00', '2009/8/11 1:00', '2009/8/11 2:00', '2009/8/11 3:00', '2009/8/11 4:00', '2009/8/11 5:00', '2009/8/11 6:00', '2009/8/11 7:00', '2009/8/11 8:00', '2009/8/11 9:00', '2009/8/11 10:00', '2009/8/11 11:00', '2009/8/11 12:00', '2009/8/11 13:00', '2009/8/11 14:00', '2009/8/11 15:00', '2009/8/11 16:00', '2009/8/11 17:00', '2009/8/11 18:00', '2009/8/11 19:00', '2009/8/11 20:00', '2009/8/11 21:00', '2009/8/11 22:00', '2009/8/11 23:00', '2009/8/12 0:00', '2009/8/12 1:00', '2009/8/12 2:00', '2009/8/12 3:00', '2009/8/12 4:00', '2009/8/12 5:00', '2009/8/12 6:00', '2009/8/12 7:00', '2009/8/12 8:00', '2009/8/12 9:00', '2009/8/12 10:00', '2009/8/12 11:00', '2009/8/12 12:00', '2009/8/12 13:00', '2009/8/12 14:00', '2009/8/12 15:00', '2009/8/12 16:00', '2009/8/12 17:00', '2009/8/12 18:00', '2009/8/12 19:00', '2009/8/12 20:00', '2009/8/12 21:00', '2009/8/12 22:00', '2009/8/12 23:00', '2009/8/13 0:00', '2009/8/13 1:00', '2009/8/13 2:00', '2009/8/13 3:00', '2009/8/13 4:00', '2009/8/13 5:00', '2009/8/13 6:00', '2009/8/13 7:00', '2009/8/13 8:00', '2009/8/13 9:00', '2009/8/13 10:00', '2009/8/13 11:00', '2009/8/13 12:00', '2009/8/13 13:00', '2009/8/13 14:00', '2009/8/13 15:00', '2009/8/13 16:00', '2009/8/13 17:00', '2009/8/13 18:00', '2009/8/13 19:00', '2009/8/13 20:00', '2009/8/13 21:00', '2009/8/13 22:00', '2009/8/13 23:00', '2009/8/14 0:00', '2009/8/14 1:00', '2009/8/14 2:00', '2009/8/14 3:00', '2009/8/14 4:00', '2009/8/14 5:00', '2009/8/14 6:00', '2009/8/14 7:00', '2009/8/14 8:00', '2009/8/14 9:00', '2009/8/14 10:00', '2009/8/14 11:00', '2009/8/14 12:00', '2009/8/14 13:00', '2009/8/14 14:00', '2009/8/14 15:00', '2009/8/14 16:00', '2009/8/14 17:00', '2009/8/14 18:00', '2009/8/14 19:00', '2009/8/14 20:00', '2009/8/14 21:00', '2009/8/14 22:00', '2009/8/14 23:00', '2009/8/15 0:00', '2009/8/15 1:00', '2009/8/15 2:00', '2009/8/15 3:00', '2009/8/15 4:00', '2009/8/15 5:00', '2009/8/15 6:00', '2009/8/15 7:00', '2009/8/15 8:00', '2009/8/15 9:00', '2009/8/15 10:00', '2009/8/15 11:00', '2009/8/15 12:00', '2009/8/15 13:00', '2009/8/15 14:00', '2009/8/15 15:00', '2009/8/15 16:00', '2009/8/15 17:00', '2009/8/15 18:00', '2009/8/15 19:00', '2009/8/15 20:00', '2009/8/15 21:00', '2009/8/15 22:00', '2009/8/15 23:00', '2009/8/16 0:00', '2009/8/16 1:00', '2009/8/16 2:00', '2009/8/16 3:00', '2009/8/16 4:00', '2009/8/16 5:00', '2009/8/16 6:00', '2009/8/16 7:00', '2009/8/16 8:00', '2009/8/16 9:00', '2009/8/16 10:00', '2009/8/16 11:00', '2009/8/16 12:00', '2009/8/16 13:00', '2009/8/16 14:00', '2009/8/16 15:00', '2009/8/16 16:00', '2009/8/16 17:00', '2009/8/16 18:00', '2009/8/16 19:00', '2009/8/16 20:00', '2009/8/16 21:00', '2009/8/16 22:00', '2009/8/16 23:00', '2009/8/17 0:00', '2009/8/17 1:00', '2009/8/17 2:00', '2009/8/17 3:00', '2009/8/17 4:00', '2009/8/17 5:00', '2009/8/17 6:00', '2009/8/17 7:00', '2009/8/17 8:00', '2009/8/17 9:00', '2009/8/17 10:00', '2009/8/17 11:00', '2009/8/17 12:00', '2009/8/17 13:00', '2009/8/17 14:00', '2009/8/17 15:00', '2009/8/17 16:00', '2009/8/17 17:00', '2009/8/17 18:00', '2009/8/17 19:00', '2009/8/17 20:00', '2009/8/17 21:00', '2009/8/17 22:00', '2009/8/17 23:00', '2009/8/18 0:00', '2009/8/18 1:00', '2009/8/18 2:00', '2009/8/18 3:00', '2009/8/18 4:00', '2009/8/18 5:00', '2009/8/18 6:00', '2009/8/18 7:00', '2009/8/18 8:00', '2009/8/18 9:00', '2009/8/18 10:00', '2009/8/18 11:00', '2009/8/18 12:00', '2009/8/18 13:00', '2009/8/18 14:00', '2009/8/18 15:00', '2009/8/18 16:00', '2009/8/18 17:00', '2009/8/18 18:00', '2009/8/18 19:00', '2009/8/18 20:00', '2009/8/18 21:00', '2009/8/18 22:00', '2009/8/18 23:00', '2009/8/19 0:00', '2009/8/19 1:00', '2009/8/19 2:00', '2009/8/19 3:00', '2009/8/19 4:00', '2009/8/19 5:00', '2009/8/19 6:00', '2009/8/19 7:00', '2009/8/19 8:00', '2009/8/19 9:00', '2009/8/19 10:00', '2009/8/19 11:00', '2009/8/19 12:00', '2009/8/19 13:00', '2009/8/19 14:00', '2009/8/19 15:00', '2009/8/19 16:00', '2009/8/19 17:00', '2009/8/19 18:00', '2009/8/19 19:00', '2009/8/19 20:00', '2009/8/19 21:00', '2009/8/19 22:00', '2009/8/19 23:00', '2009/8/20 0:00', '2009/8/20 1:00', '2009/8/20 2:00', '2009/8/20 3:00', '2009/8/20 4:00', '2009/8/20 5:00', '2009/8/20 6:00', '2009/8/20 7:00', '2009/8/20 8:00', '2009/8/20 9:00', '2009/8/20 10:00', '2009/8/20 11:00', '2009/8/20 12:00', '2009/8/20 13:00', '2009/8/20 14:00', '2009/8/20 15:00', '2009/8/20 16:00', '2009/8/20 17:00', '2009/8/20 18:00', '2009/8/20 19:00', '2009/8/20 20:00', '2009/8/20 21:00', '2009/8/20 22:00', '2009/8/20 23:00', '2009/8/21 0:00', '2009/8/21 1:00', '2009/8/21 2:00', '2009/8/21 3:00', '2009/8/21 4:00', '2009/8/21 5:00', '2009/8/21 6:00', '2009/8/21 7:00', '2009/8/21 8:00', '2009/8/21 9:00', '2009/8/21 10:00', '2009/8/21 11:00', '2009/8/21 12:00', '2009/8/21 13:00', '2009/8/21 14:00', '2009/8/21 15:00', '2009/8/21 16:00', '2009/8/21 17:00', '2009/8/21 18:00', '2009/8/21 19:00', '2009/8/21 20:00', '2009/8/21 21:00', '2009/8/21 22:00', '2009/8/21 23:00', '2009/8/22 0:00', '2009/8/22 1:00', '2009/8/22 2:00', '2009/8/22 3:00', '2009/8/22 4:00', '2009/8/22 5:00', '2009/8/22 6:00', '2009/8/22 7:00', '2009/8/22 8:00', '2009/8/22 9:00', '2009/8/22 10:00', '2009/8/22 11:00', '2009/8/22 12:00', '2009/8/22 13:00', '2009/8/22 14:00', '2009/8/22 15:00', '2009/8/22 16:00', '2009/8/22 17:00', '2009/8/22 18:00', '2009/8/22 19:00', '2009/8/22 20:00', '2009/8/22 21:00', '2009/8/22 22:00', '2009/8/22 23:00', '2009/8/23 0:00', '2009/8/23 1:00', '2009/8/23 2:00', '2009/8/23 3:00', '2009/8/23 4:00', '2009/8/23 5:00', '2009/8/23 6:00', '2009/8/23 7:00', '2009/8/23 8:00', '2009/8/23 9:00', '2009/8/23 10:00', '2009/8/23 11:00', '2009/8/23 12:00', '2009/8/23 13:00', '2009/8/23 14:00', '2009/8/23 15:00', '2009/8/23 16:00', '2009/8/23 17:00', '2009/8/23 18:00', '2009/8/23 19:00', '2009/8/23 20:00', '2009/8/23 21:00', '2009/8/23 22:00', '2009/8/23 23:00', '2009/8/24 0:00', '2009/8/24 1:00', '2009/8/24 2:00', '2009/8/24 3:00', '2009/8/24 4:00', '2009/8/24 5:00', '2009/8/24 6:00', '2009/8/24 7:00', '2009/8/24 8:00', '2009/8/24 9:00', '2009/8/24 10:00', '2009/8/24 11:00', '2009/8/24 12:00', '2009/8/24 13:00', '2009/8/24 14:00', '2009/8/24 15:00', '2009/8/24 16:00', '2009/8/24 17:00', '2009/8/24 18:00', '2009/8/24 19:00', '2009/8/24 20:00', '2009/8/24 21:00', '2009/8/24 22:00', '2009/8/24 23:00', '2009/8/25 0:00', '2009/8/25 1:00', '2009/8/25 2:00', '2009/8/25 3:00', '2009/8/25 4:00', '2009/8/25 5:00', '2009/8/25 6:00', '2009/8/25 7:00', '2009/8/25 8:00', '2009/8/25 9:00', '2009/8/25 10:00', '2009/8/25 11:00', '2009/8/25 12:00', '2009/8/25 13:00', '2009/8/25 14:00', '2009/8/25 15:00', '2009/8/25 16:00', '2009/8/25 17:00', '2009/8/25 18:00', '2009/8/25 19:00', '2009/8/25 20:00', '2009/8/25 21:00', '2009/8/25 22:00', '2009/8/25 23:00', '2009/8/26 0:00', '2009/8/26 1:00', '2009/8/26 2:00', '2009/8/26 3:00', '2009/8/26 4:00', '2009/8/26 5:00', '2009/8/26 6:00', '2009/8/26 7:00', '2009/8/26 8:00', '2009/8/26 9:00', '2009/8/26 10:00', '2009/8/26 11:00', '2009/8/26 12:00', '2009/8/26 13:00', '2009/8/26 14:00', '2009/8/26 15:00', '2009/8/26 16:00', '2009/8/26 17:00', '2009/8/26 18:00', '2009/8/26 19:00', '2009/8/26 20:00', '2009/8/26 21:00', '2009/8/26 22:00', '2009/8/26 23:00', '2009/8/27 0:00', '2009/8/27 1:00', '2009/8/27 2:00', '2009/8/27 3:00', '2009/8/27 4:00', '2009/8/27 5:00', '2009/8/27 6:00', '2009/8/27 7:00', '2009/8/27 8:00', '2009/8/27 9:00', '2009/8/27 10:00', '2009/8/27 11:00', '2009/8/27 12:00', '2009/8/27 13:00', '2009/8/27 14:00', '2009/8/27 15:00', '2009/8/27 16:00', '2009/8/27 17:00', '2009/8/27 18:00', '2009/8/27 19:00', '2009/8/27 20:00', '2009/8/27 21:00', '2009/8/27 22:00', '2009/8/27 23:00', '2009/8/28 0:00', '2009/8/28 1:00', '2009/8/28 2:00', '2009/8/28 3:00', '2009/8/28 4:00', '2009/8/28 5:00', '2009/8/28 6:00', '2009/8/28 7:00', '2009/8/28 8:00', '2009/8/28 9:00', '2009/8/28 10:00', '2009/8/28 11:00', '2009/8/28 12:00', '2009/8/28 13:00', '2009/8/28 14:00', '2009/8/28 15:00', '2009/8/28 16:00', '2009/8/28 17:00', '2009/8/28 18:00', '2009/8/28 19:00', '2009/8/28 20:00', '2009/8/28 21:00', '2009/8/28 22:00', '2009/8/28 23:00', '2009/8/29 0:00', '2009/8/29 1:00', '2009/8/29 2:00', '2009/8/29 3:00', '2009/8/29 4:00', '2009/8/29 5:00', '2009/8/29 6:00', '2009/8/29 7:00', '2009/8/29 8:00', '2009/8/29 9:00', '2009/8/29 10:00', '2009/8/29 11:00', '2009/8/29 12:00', '2009/8/29 13:00', '2009/8/29 14:00', '2009/8/29 15:00', '2009/8/29 16:00', '2009/8/29 17:00', '2009/8/29 18:00', '2009/8/29 19:00', '2009/8/29 20:00', '2009/8/29 21:00', '2009/8/29 22:00', '2009/8/29 23:00', '2009/8/30 0:00', '2009/8/30 1:00', '2009/8/30 2:00', '2009/8/30 3:00', '2009/8/30 4:00', '2009/8/30 5:00', '2009/8/30 6:00', '2009/8/30 7:00', '2009/8/30 8:00', '2009/8/30 9:00', '2009/8/30 10:00', '2009/8/30 11:00', '2009/8/30 12:00', '2009/8/30 13:00', '2009/8/30 14:00', '2009/8/30 15:00', '2009/8/30 16:00', '2009/8/30 17:00', '2009/8/30 18:00', '2009/8/30 19:00', '2009/8/30 20:00', '2009/8/30 21:00', '2009/8/30 22:00', '2009/8/30 23:00', '2009/8/31 0:00', '2009/8/31 1:00', '2009/8/31 2:00', '2009/8/31 3:00', '2009/8/31 4:00', '2009/8/31 5:00', '2009/8/31 6:00', '2009/8/31 7:00', '2009/8/31 8:00', '2009/8/31 9:00', '2009/8/31 10:00', '2009/8/31 11:00', '2009/8/31 12:00', '2009/8/31 13:00', '2009/8/31 14:00', '2009/8/31 15:00', '2009/8/31 16:00', '2009/8/31 17:00', '2009/8/31 18:00', '2009/8/31 19:00', '2009/8/31 20:00', '2009/8/31 21:00', '2009/8/31 22:00', '2009/8/31 23:00', '2009/9/1 0:00', '2009/9/1 1:00', '2009/9/1 2:00', '2009/9/1 3:00', '2009/9/1 4:00', '2009/9/1 5:00', '2009/9/1 6:00', '2009/9/1 7:00', '2009/9/1 8:00', '2009/9/1 9:00', '2009/9/1 10:00', '2009/9/1 11:00', '2009/9/1 12:00', '2009/9/1 13:00', '2009/9/1 14:00', '2009/9/1 15:00', '2009/9/1 16:00', '2009/9/1 17:00', '2009/9/1 18:00', '2009/9/1 19:00', '2009/9/1 20:00', '2009/9/1 21:00', '2009/9/1 22:00', '2009/9/1 23:00', '2009/9/2 0:00', '2009/9/2 1:00', '2009/9/2 2:00', '2009/9/2 3:00', '2009/9/2 4:00', '2009/9/2 5:00', '2009/9/2 6:00', '2009/9/2 7:00', '2009/9/2 8:00', '2009/9/2 9:00', '2009/9/2 10:00', '2009/9/2 11:00', '2009/9/2 12:00', '2009/9/2 13:00', '2009/9/2 14:00', '2009/9/2 15:00', '2009/9/2 16:00', '2009/9/2 17:00', '2009/9/2 18:00', '2009/9/2 19:00', '2009/9/2 20:00', '2009/9/2 21:00', '2009/9/2 22:00', '2009/9/2 23:00', '2009/9/3 0:00', '2009/9/3 1:00', '2009/9/3 2:00', '2009/9/3 3:00', '2009/9/3 4:00', '2009/9/3 5:00', '2009/9/3 6:00', '2009/9/3 7:00', '2009/9/3 8:00', '2009/9/3 9:00', '2009/9/3 10:00', '2009/9/3 11:00', '2009/9/3 12:00', '2009/9/3 13:00', '2009/9/3 14:00', '2009/9/3 15:00', '2009/9/3 16:00', '2009/9/3 17:00', '2009/9/3 18:00', '2009/9/3 19:00', '2009/9/3 20:00', '2009/9/3 21:00', '2009/9/3 22:00', '2009/9/3 23:00', '2009/9/4 0:00', '2009/9/4 1:00', '2009/9/4 2:00', '2009/9/4 3:00', '2009/9/4 4:00', '2009/9/4 5:00', '2009/9/4 6:00', '2009/9/4 7:00', '2009/9/4 8:00', '2009/9/4 9:00', '2009/9/4 10:00', '2009/9/4 11:00', '2009/9/4 12:00', '2009/9/4 13:00', '2009/9/4 14:00', '2009/9/4 15:00', '2009/9/4 16:00', '2009/9/4 17:00', '2009/9/4 18:00', '2009/9/4 19:00', '2009/9/4 20:00', '2009/9/4 21:00', '2009/9/4 22:00', '2009/9/4 23:00', '2009/9/5 0:00', '2009/9/5 1:00', '2009/9/5 2:00', '2009/9/5 3:00', '2009/9/5 4:00', '2009/9/5 5:00', '2009/9/5 6:00', '2009/9/5 7:00', '2009/9/5 8:00', '2009/9/5 9:00', '2009/9/5 10:00', '2009/9/5 11:00', '2009/9/5 12:00', '2009/9/5 13:00', '2009/9/5 14:00', '2009/9/5 15:00', '2009/9/5 16:00', '2009/9/5 17:00', '2009/9/5 18:00', '2009/9/5 19:00', '2009/9/5 20:00', '2009/9/5 21:00', '2009/9/5 22:00', '2009/9/5 23:00', '2009/9/6 0:00', '2009/9/6 1:00', '2009/9/6 2:00', '2009/9/6 3:00', '2009/9/6 4:00', '2009/9/6 5:00', '2009/9/6 6:00', '2009/9/6 7:00', '2009/9/6 8:00', '2009/9/6 9:00', '2009/9/6 10:00', '2009/9/6 11:00', '2009/9/6 12:00', '2009/9/6 13:00', '2009/9/6 14:00', '2009/9/6 15:00', '2009/9/6 16:00', '2009/9/6 17:00', '2009/9/6 18:00', '2009/9/6 19:00', '2009/9/6 20:00', '2009/9/6 21:00', '2009/9/6 22:00', '2009/9/6 23:00', '2009/9/7 0:00', '2009/9/7 1:00', '2009/9/7 2:00', '2009/9/7 3:00', '2009/9/7 4:00', '2009/9/7 5:00', '2009/9/7 6:00', '2009/9/7 7:00', '2009/9/7 8:00', '2009/9/7 9:00', '2009/9/7 10:00', '2009/9/7 11:00', '2009/9/7 12:00', '2009/9/7 13:00', '2009/9/7 14:00', '2009/9/7 15:00', '2009/9/7 16:00', '2009/9/7 17:00', '2009/9/7 18:00', '2009/9/7 19:00', '2009/9/7 20:00', '2009/9/7 21:00', '2009/9/7 22:00', '2009/9/7 23:00', '2009/9/8 0:00', '2009/9/8 1:00', '2009/9/8 2:00', '2009/9/8 3:00', '2009/9/8 4:00', '2009/9/8 5:00', '2009/9/8 6:00', '2009/9/8 7:00', '2009/9/8 8:00', '2009/9/8 9:00', '2009/9/8 10:00', '2009/9/8 11:00', '2009/9/8 12:00', '2009/9/8 13:00', '2009/9/8 14:00', '2009/9/8 15:00', '2009/9/8 16:00', '2009/9/8 17:00', '2009/9/8 18:00', '2009/9/8 19:00', '2009/9/8 20:00', '2009/9/8 21:00', '2009/9/8 22:00', '2009/9/8 23:00', '2009/9/9 0:00', '2009/9/9 1:00', '2009/9/9 2:00', '2009/9/9 3:00', '2009/9/9 4:00', '2009/9/9 5:00', '2009/9/9 6:00', '2009/9/9 7:00', '2009/9/9 8:00', '2009/9/9 9:00', '2009/9/9 10:00', '2009/9/9 11:00', '2009/9/9 12:00', '2009/9/9 13:00', '2009/9/9 14:00', '2009/9/9 15:00', '2009/9/9 16:00', '2009/9/9 17:00', '2009/9/9 18:00', '2009/9/9 19:00', '2009/9/9 20:00', '2009/9/9 21:00', '2009/9/9 22:00', '2009/9/9 23:00', '2009/9/10 0:00', '2009/9/10 1:00', '2009/9/10 2:00', '2009/9/10 3:00', '2009/9/10 4:00', '2009/9/10 5:00', '2009/9/10 6:00', '2009/9/10 7:00', '2009/9/10 8:00', '2009/9/10 9:00', '2009/9/10 10:00', '2009/9/10 11:00', '2009/9/10 12:00', '2009/9/10 13:00', '2009/9/10 14:00', '2009/9/10 15:00', '2009/9/10 16:00', '2009/9/10 17:00', '2009/9/10 18:00', '2009/9/10 19:00', '2009/9/10 20:00', '2009/9/10 21:00', '2009/9/10 22:00', '2009/9/10 23:00', '2009/9/11 0:00', '2009/9/11 1:00', '2009/9/11 2:00', '2009/9/11 3:00', '2009/9/11 4:00', '2009/9/11 5:00', '2009/9/11 6:00', '2009/9/11 7:00', '2009/9/11 8:00', '2009/9/11 9:00', '2009/9/11 10:00', '2009/9/11 11:00', '2009/9/11 12:00', '2009/9/11 13:00', '2009/9/11 14:00', '2009/9/11 15:00', '2009/9/11 16:00', '2009/9/11 17:00', '2009/9/11 18:00', '2009/9/11 19:00', '2009/9/11 20:00', '2009/9/11 21:00', '2009/9/11 22:00', '2009/9/11 23:00', '2009/9/12 0:00', '2009/9/12 1:00', '2009/9/12 2:00', '2009/9/12 3:00', '2009/9/12 4:00', '2009/9/12 5:00', '2009/9/12 6:00', '2009/9/12 7:00', '2009/9/12 8:00', '2009/9/12 9:00', '2009/9/12 10:00', '2009/9/12 11:00', '2009/9/12 12:00', '2009/9/12 13:00', '2009/9/12 14:00', '2009/9/12 15:00', '2009/9/12 16:00', '2009/9/12 17:00', '2009/9/12 18:00', '2009/9/12 19:00', '2009/9/12 20:00', '2009/9/12 21:00', '2009/9/12 22:00', '2009/9/12 23:00', '2009/9/13 0:00', '2009/9/13 1:00', '2009/9/13 2:00', '2009/9/13 3:00', '2009/9/13 4:00', '2009/9/13 5:00', '2009/9/13 6:00', '2009/9/13 7:00', '2009/9/13 8:00', '2009/9/13 9:00', '2009/9/13 10:00', '2009/9/13 11:00', '2009/9/13 12:00', '2009/9/13 13:00', '2009/9/13 14:00', '2009/9/13 15:00', '2009/9/13 16:00', '2009/9/13 17:00', '2009/9/13 18:00', '2009/9/13 19:00', '2009/9/13 20:00', '2009/9/13 21:00', '2009/9/13 22:00', '2009/9/13 23:00', '2009/9/14 0:00', '2009/9/14 1:00', '2009/9/14 2:00', '2009/9/14 3:00', '2009/9/14 4:00', '2009/9/14 5:00', '2009/9/14 6:00', '2009/9/14 7:00', '2009/9/14 8:00', '2009/9/14 9:00', '2009/9/14 10:00', '2009/9/14 11:00', '2009/9/14 12:00', '2009/9/14 13:00', '2009/9/14 14:00', '2009/9/14 15:00', '2009/9/14 16:00', '2009/9/14 17:00', '2009/9/14 18:00', '2009/9/14 19:00', '2009/9/14 20:00', '2009/9/14 21:00', '2009/9/14 22:00', '2009/9/14 23:00', '2009/9/15 0:00', '2009/9/15 1:00', '2009/9/15 2:00', '2009/9/15 3:00', '2009/9/15 4:00', '2009/9/15 5:00', '2009/9/15 6:00', '2009/9/15 7:00', '2009/9/15 8:00', '2009/9/15 9:00', '2009/9/15 10:00', '2009/9/15 11:00', '2009/9/15 12:00', '2009/9/15 13:00', '2009/9/15 14:00', '2009/9/15 15:00', '2009/9/15 16:00', '2009/9/15 17:00', '2009/9/15 18:00', '2009/9/15 19:00', '2009/9/15 20:00', '2009/9/15 21:00', '2009/9/15 22:00', '2009/9/15 23:00', '2009/9/16 0:00', '2009/9/16 1:00', '2009/9/16 2:00', '2009/9/16 3:00', '2009/9/16 4:00', '2009/9/16 5:00', '2009/9/16 6:00', '2009/9/16 7:00', '2009/9/16 8:00', '2009/9/16 9:00', '2009/9/16 10:00', '2009/9/16 11:00', '2009/9/16 12:00', '2009/9/16 13:00', '2009/9/16 14:00', '2009/9/16 15:00', '2009/9/16 16:00', '2009/9/16 17:00', '2009/9/16 18:00', '2009/9/16 19:00', '2009/9/16 20:00', '2009/9/16 21:00', '2009/9/16 22:00', '2009/9/16 23:00', '2009/9/17 0:00', '2009/9/17 1:00', '2009/9/17 2:00', '2009/9/17 3:00', '2009/9/17 4:00', '2009/9/17 5:00', '2009/9/17 6:00', '2009/9/17 7:00', '2009/9/17 8:00', '2009/9/17 9:00', '2009/9/17 10:00', '2009/9/17 11:00', '2009/9/17 12:00', '2009/9/17 13:00', '2009/9/17 14:00', '2009/9/17 15:00', '2009/9/17 16:00', '2009/9/17 17:00', '2009/9/17 18:00', '2009/9/17 19:00', '2009/9/17 20:00', '2009/9/17 21:00', '2009/9/17 22:00', '2009/9/17 23:00', '2009/9/18 0:00', '2009/9/18 1:00', '2009/9/18 2:00', '2009/9/18 3:00', '2009/9/18 4:00', '2009/9/18 5:00', '2009/9/18 6:00', '2009/9/18 7:00', '2009/9/18 8:00', '2009/9/18 9:00', '2009/9/18 10:00', '2009/9/18 11:00', '2009/9/18 12:00', '2009/9/18 13:00', '2009/9/18 14:00', '2009/9/18 15:00', '2009/9/18 16:00', '2009/9/18 17:00', '2009/9/18 18:00', '2009/9/18 19:00', '2009/9/18 20:00', '2009/9/18 21:00', '2009/9/18 22:00', '2009/9/18 23:00', '2009/9/19 0:00', '2009/9/19 1:00', '2009/9/19 2:00', '2009/9/19 3:00', '2009/9/19 4:00', '2009/9/19 5:00', '2009/9/19 6:00', '2009/9/19 7:00', '2009/9/19 8:00', '2009/9/19 9:00', '2009/9/19 10:00', '2009/9/19 11:00', '2009/9/19 12:00', '2009/9/19 13:00', '2009/9/19 14:00', '2009/9/19 15:00', '2009/9/19 16:00', '2009/9/19 17:00', '2009/9/19 18:00', '2009/9/19 19:00', '2009/9/19 20:00', '2009/9/19 21:00', '2009/9/19 22:00', '2009/9/19 23:00', '2009/9/20 0:00', '2009/9/20 1:00', '2009/9/20 2:00', '2009/9/20 3:00', '2009/9/20 4:00', '2009/9/20 5:00', '2009/9/20 6:00', '2009/9/20 7:00', '2009/9/20 8:00', '2009/9/20 9:00', '2009/9/20 10:00', '2009/9/20 11:00', '2009/9/20 12:00', '2009/9/20 13:00', '2009/9/20 14:00', '2009/9/20 15:00', '2009/9/20 16:00', '2009/9/20 17:00', '2009/9/20 18:00', '2009/9/20 19:00', '2009/9/20 20:00', '2009/9/20 21:00', '2009/9/20 22:00', '2009/9/20 23:00', '2009/9/21 0:00', '2009/9/21 1:00', '2009/9/21 2:00', '2009/9/21 3:00', '2009/9/21 4:00', '2009/9/21 5:00', '2009/9/21 6:00', '2009/9/21 7:00', '2009/9/21 8:00', '2009/9/21 9:00', '2009/9/21 10:00', '2009/9/21 11:00', '2009/9/21 12:00', '2009/9/21 13:00', '2009/9/21 14:00', '2009/9/21 15:00', '2009/9/21 16:00', '2009/9/21 17:00', '2009/9/21 18:00', '2009/9/21 19:00', '2009/9/21 20:00', '2009/9/21 21:00', '2009/9/21 22:00', '2009/9/21 23:00', '2009/9/22 0:00', '2009/9/22 1:00', '2009/9/22 2:00', '2009/9/22 3:00', '2009/9/22 4:00', '2009/9/22 5:00', '2009/9/22 6:00', '2009/9/22 7:00', '2009/9/22 8:00', '2009/9/22 9:00', '2009/9/22 10:00', '2009/9/22 11:00', '2009/9/22 12:00', '2009/9/22 13:00', '2009/9/22 14:00', '2009/9/22 15:00', '2009/9/22 16:00', '2009/9/22 17:00', '2009/9/22 18:00', '2009/9/22 19:00', '2009/9/22 20:00', '2009/9/22 21:00', '2009/9/22 22:00', '2009/9/22 23:00', '2009/9/23 0:00', '2009/9/23 1:00', '2009/9/23 2:00', '2009/9/23 3:00', '2009/9/23 4:00', '2009/9/23 5:00', '2009/9/23 6:00', '2009/9/23 7:00', '2009/9/23 8:00', '2009/9/23 9:00', '2009/9/23 10:00', '2009/9/23 11:00', '2009/9/23 12:00', '2009/9/23 13:00', '2009/9/23 14:00', '2009/9/23 15:00', '2009/9/23 16:00', '2009/9/23 17:00', '2009/9/23 18:00', '2009/9/23 19:00', '2009/9/23 20:00', '2009/9/23 21:00', '2009/9/23 22:00', '2009/9/23 23:00', '2009/9/24 0:00', '2009/9/24 1:00', '2009/9/24 2:00', '2009/9/24 3:00', '2009/9/24 4:00', '2009/9/24 5:00', '2009/9/24 6:00', '2009/9/24 7:00', '2009/9/24 8:00', '2009/9/24 9:00', '2009/9/24 10:00', '2009/9/24 11:00', '2009/9/24 12:00', '2009/9/24 13:00', '2009/9/24 14:00', '2009/9/24 15:00', '2009/9/24 16:00', '2009/9/24 17:00', '2009/9/24 18:00', '2009/9/24 19:00', '2009/9/24 20:00', '2009/9/24 21:00', '2009/9/24 22:00', '2009/9/24 23:00', '2009/9/25 0:00', '2009/9/25 1:00', '2009/9/25 2:00', '2009/9/25 3:00', '2009/9/25 4:00', '2009/9/25 5:00', '2009/9/25 6:00', '2009/9/25 7:00', '2009/9/25 8:00', '2009/9/25 9:00', '2009/9/25 10:00', '2009/9/25 11:00', '2009/9/25 12:00', '2009/9/25 13:00', '2009/9/25 14:00', '2009/9/25 15:00', '2009/9/25 16:00', '2009/9/25 17:00', '2009/9/25 18:00', '2009/9/25 19:00', '2009/9/25 20:00', '2009/9/25 21:00', '2009/9/25 22:00', '2009/9/25 23:00', '2009/9/26 0:00', '2009/9/26 1:00', '2009/9/26 2:00', '2009/9/26 3:00', '2009/9/26 4:00', '2009/9/26 5:00', '2009/9/26 6:00', '2009/9/26 7:00', '2009/9/26 8:00', '2009/9/26 9:00', '2009/9/26 10:00', '2009/9/26 11:00', '2009/9/26 12:00', '2009/9/26 13:00', '2009/9/26 14:00', '2009/9/26 15:00', '2009/9/26 16:00', '2009/9/26 17:00', '2009/9/26 18:00', '2009/9/26 19:00', '2009/9/26 20:00', '2009/9/26 21:00', '2009/9/26 22:00', '2009/9/26 23:00', '2009/9/27 0:00', '2009/9/27 1:00', '2009/9/27 2:00', '2009/9/27 3:00', '2009/9/27 4:00', '2009/9/27 5:00', '2009/9/27 6:00', '2009/9/27 7:00', '2009/9/27 8:00', '2009/9/27 9:00', '2009/9/27 10:00', '2009/9/27 11:00', '2009/9/27 12:00', '2009/9/27 13:00', '2009/9/27 14:00', '2009/9/27 15:00', '2009/9/27 16:00', '2009/9/27 17:00', '2009/9/27 18:00', '2009/9/27 19:00', '2009/9/27 20:00', '2009/9/27 21:00', '2009/9/27 22:00', '2009/9/27 23:00', '2009/9/28 0:00', '2009/9/28 1:00', '2009/9/28 2:00', '2009/9/28 3:00', '2009/9/28 4:00', '2009/9/28 5:00', '2009/9/28 6:00', '2009/9/28 7:00', '2009/9/28 8:00', '2009/9/28 9:00', '2009/9/28 10:00', '2009/9/28 11:00', '2009/9/28 12:00', '2009/9/28 13:00', '2009/9/28 14:00', '2009/9/28 15:00', '2009/9/28 16:00', '2009/9/28 17:00', '2009/9/28 18:00', '2009/9/28 19:00', '2009/9/28 20:00', '2009/9/28 21:00', '2009/9/28 22:00', '2009/9/28 23:00', '2009/9/29 0:00', '2009/9/29 1:00', '2009/9/29 2:00', '2009/9/29 3:00', '2009/9/29 4:00', '2009/9/29 5:00', '2009/9/29 6:00', '2009/9/29 7:00', '2009/9/29 8:00', '2009/9/29 9:00', '2009/9/29 10:00', '2009/9/29 11:00', '2009/9/29 12:00', '2009/9/29 13:00', '2009/9/29 14:00', '2009/9/29 15:00', '2009/9/29 16:00', '2009/9/29 17:00', '2009/9/29 18:00', '2009/9/29 19:00', '2009/9/29 20:00', '2009/9/29 21:00', '2009/9/29 22:00', '2009/9/29 23:00', '2009/9/30 0:00', '2009/9/30 1:00', '2009/9/30 2:00', '2009/9/30 3:00', '2009/9/30 4:00', '2009/9/30 5:00', '2009/9/30 6:00', '2009/9/30 7:00', '2009/9/30 8:00', '2009/9/30 9:00', '2009/9/30 10:00', '2009/9/30 11:00', '2009/9/30 12:00', '2009/9/30 13:00', '2009/9/30 14:00', '2009/9/30 15:00', '2009/9/30 16:00', '2009/9/30 17:00', '2009/9/30 18:00', '2009/9/30 19:00', '2009/9/30 20:00', '2009/9/30 21:00', '2009/9/30 22:00', '2009/9/30 23:00', '2009/10/1 0:00', '2009/10/1 1:00', '2009/10/1 2:00', '2009/10/1 3:00', '2009/10/1 4:00', '2009/10/1 5:00', '2009/10/1 6:00', '2009/10/1 7:00', '2009/10/1 8:00', '2009/10/1 9:00', '2009/10/1 10:00', '2009/10/1 11:00', '2009/10/1 12:00', '2009/10/1 13:00', '2009/10/1 14:00', '2009/10/1 15:00', '2009/10/1 16:00', '2009/10/1 17:00', '2009/10/1 18:00', '2009/10/1 19:00', '2009/10/1 20:00', '2009/10/1 21:00', '2009/10/1 22:00', '2009/10/1 23:00', '2009/10/2 0:00', '2009/10/2 1:00', '2009/10/2 2:00', '2009/10/2 3:00', '2009/10/2 4:00', '2009/10/2 5:00', '2009/10/2 6:00', '2009/10/2 7:00', '2009/10/2 8:00', '2009/10/2 9:00', '2009/10/2 10:00', '2009/10/2 11:00', '2009/10/2 12:00', '2009/10/2 13:00', '2009/10/2 14:00', '2009/10/2 15:00', '2009/10/2 16:00', '2009/10/2 17:00', '2009/10/2 18:00', '2009/10/2 19:00', '2009/10/2 20:00', '2009/10/2 21:00', '2009/10/2 22:00', '2009/10/2 23:00', '2009/10/3 0:00', '2009/10/3 1:00', '2009/10/3 2:00', '2009/10/3 3:00', '2009/10/3 4:00', '2009/10/3 5:00', '2009/10/3 6:00', '2009/10/3 7:00', '2009/10/3 8:00', '2009/10/3 9:00', '2009/10/3 10:00', '2009/10/3 11:00', '2009/10/3 12:00', '2009/10/3 13:00', '2009/10/3 14:00', '2009/10/3 15:00', '2009/10/3 16:00', '2009/10/3 17:00', '2009/10/3 18:00', '2009/10/3 19:00', '2009/10/3 20:00', '2009/10/3 21:00', '2009/10/3 22:00', '2009/10/3 23:00', '2009/10/4 0:00', '2009/10/4 1:00', '2009/10/4 2:00', '2009/10/4 3:00', '2009/10/4 4:00', '2009/10/4 5:00', '2009/10/4 6:00', '2009/10/4 7:00', '2009/10/4 8:00', '2009/10/4 9:00', '2009/10/4 10:00', '2009/10/4 11:00', '2009/10/4 12:00', '2009/10/4 13:00', '2009/10/4 14:00', '2009/10/4 15:00', '2009/10/4 16:00', '2009/10/4 17:00', '2009/10/4 18:00', '2009/10/4 19:00', '2009/10/4 20:00', '2009/10/4 21:00', '2009/10/4 22:00', '2009/10/4 23:00', '2009/10/5 0:00', '2009/10/5 1:00', '2009/10/5 2:00', '2009/10/5 3:00', '2009/10/5 4:00', '2009/10/5 5:00', '2009/10/5 6:00', '2009/10/5 7:00', '2009/10/5 8:00', '2009/10/5 9:00', '2009/10/5 10:00', '2009/10/5 11:00', '2009/10/5 12:00', '2009/10/5 13:00', '2009/10/5 14:00', '2009/10/5 15:00', '2009/10/5 16:00', '2009/10/5 17:00', '2009/10/5 18:00', '2009/10/5 19:00', '2009/10/5 20:00', '2009/10/5 21:00', '2009/10/5 22:00', '2009/10/5 23:00', '2009/10/6 0:00', '2009/10/6 1:00', '2009/10/6 2:00', '2009/10/6 3:00', '2009/10/6 4:00', '2009/10/6 5:00', '2009/10/6 6:00', '2009/10/6 7:00', '2009/10/6 8:00', '2009/10/6 9:00', '2009/10/6 10:00', '2009/10/6 11:00', '2009/10/6 12:00', '2009/10/6 13:00', '2009/10/6 14:00', '2009/10/6 15:00', '2009/10/6 16:00', '2009/10/6 17:00', '2009/10/6 18:00', '2009/10/6 19:00', '2009/10/6 20:00', '2009/10/6 21:00', '2009/10/6 22:00', '2009/10/6 23:00', '2009/10/7 0:00', '2009/10/7 1:00', '2009/10/7 2:00', '2009/10/7 3:00', '2009/10/7 4:00', '2009/10/7 5:00', '2009/10/7 6:00', '2009/10/7 7:00', '2009/10/7 8:00', '2009/10/7 9:00', '2009/10/7 10:00', '2009/10/7 11:00', '2009/10/7 12:00', '2009/10/7 13:00', '2009/10/7 14:00', '2009/10/7 15:00', '2009/10/7 16:00', '2009/10/7 17:00', '2009/10/7 18:00', '2009/10/7 19:00', '2009/10/7 20:00', '2009/10/7 21:00', '2009/10/7 22:00', '2009/10/7 23:00', '2009/10/8 0:00', '2009/10/8 1:00', '2009/10/8 2:00', '2009/10/8 3:00', '2009/10/8 4:00', '2009/10/8 5:00', '2009/10/8 6:00', '2009/10/8 7:00', '2009/10/8 8:00', '2009/10/8 9:00', '2009/10/8 10:00', '2009/10/8 11:00', '2009/10/8 12:00', '2009/10/8 13:00', '2009/10/8 14:00', '2009/10/8 15:00', '2009/10/8 16:00', '2009/10/8 17:00', '2009/10/8 18:00', '2009/10/8 19:00', '2009/10/8 20:00', '2009/10/8 21:00', '2009/10/8 22:00', '2009/10/8 23:00', '2009/10/9 0:00', '2009/10/9 1:00', '2009/10/9 2:00', '2009/10/9 3:00', '2009/10/9 4:00', '2009/10/9 5:00', '2009/10/9 6:00', '2009/10/9 7:00', '2009/10/9 8:00', '2009/10/9 9:00', '2009/10/9 10:00', '2009/10/9 11:00', '2009/10/9 12:00', '2009/10/9 13:00', '2009/10/9 14:00', '2009/10/9 15:00', '2009/10/9 16:00', '2009/10/9 17:00', '2009/10/9 18:00', '2009/10/9 19:00', '2009/10/9 20:00', '2009/10/9 21:00', '2009/10/9 22:00', '2009/10/9 23:00', '2009/10/10 0:00', '2009/10/10 1:00', '2009/10/10 2:00', '2009/10/10 3:00', '2009/10/10 4:00', '2009/10/10 5:00', '2009/10/10 6:00', '2009/10/10 7:00', '2009/10/10 8:00', '2009/10/10 9:00', '2009/10/10 10:00', '2009/10/10 11:00', '2009/10/10 12:00', '2009/10/10 13:00', '2009/10/10 14:00', '2009/10/10 15:00', '2009/10/10 16:00', '2009/10/10 17:00', '2009/10/10 18:00', '2009/10/10 19:00', '2009/10/10 20:00', '2009/10/10 21:00', '2009/10/10 22:00', '2009/10/10 23:00', '2009/10/11 0:00', '2009/10/11 1:00', '2009/10/11 2:00', '2009/10/11 3:00', '2009/10/11 4:00', '2009/10/11 5:00', '2009/10/11 6:00', '2009/10/11 7:00', '2009/10/11 8:00', '2009/10/11 9:00', '2009/10/11 10:00', '2009/10/11 11:00', '2009/10/11 12:00', '2009/10/11 13:00', '2009/10/11 14:00', '2009/10/11 15:00', '2009/10/11 16:00', '2009/10/11 17:00', '2009/10/11 18:00', '2009/10/11 19:00', '2009/10/11 20:00', '2009/10/11 21:00', '2009/10/11 22:00', '2009/10/11 23:00', '2009/10/12 0:00', '2009/10/12 1:00', '2009/10/12 2:00', '2009/10/12 3:00', '2009/10/12 4:00', '2009/10/12 5:00', '2009/10/12 6:00', '2009/10/12 7:00', '2009/10/12 8:00', '2009/10/12 9:00', '2009/10/12 10:00', '2009/10/12 11:00', '2009/10/12 12:00', '2009/10/12 13:00', '2009/10/12 14:00', '2009/10/12 15:00', '2009/10/12 16:00', '2009/10/12 17:00', '2009/10/12 18:00', '2009/10/12 19:00', '2009/10/12 20:00', '2009/10/12 21:00', '2009/10/12 22:00', '2009/10/12 23:00', '2009/10/13 0:00', '2009/10/13 1:00', '2009/10/13 2:00', '2009/10/13 3:00', '2009/10/13 4:00', '2009/10/13 5:00', '2009/10/13 6:00', '2009/10/13 7:00', '2009/10/13 8:00', '2009/10/13 9:00', '2009/10/13 10:00', '2009/10/13 11:00', '2009/10/13 12:00', '2009/10/13 13:00', '2009/10/13 14:00', '2009/10/13 15:00', '2009/10/13 16:00', '2009/10/13 17:00', '2009/10/13 18:00', '2009/10/13 19:00', '2009/10/13 20:00', '2009/10/13 21:00', '2009/10/13 22:00', '2009/10/13 23:00', '2009/10/14 0:00', '2009/10/14 1:00', '2009/10/14 2:00', '2009/10/14 3:00', '2009/10/14 4:00', '2009/10/14 5:00', '2009/10/14 6:00', '2009/10/14 7:00', '2009/10/14 8:00', '2009/10/14 9:00', '2009/10/14 10:00', '2009/10/14 11:00', '2009/10/14 12:00', '2009/10/14 13:00', '2009/10/14 14:00', '2009/10/14 15:00', '2009/10/14 16:00', '2009/10/14 17:00', '2009/10/14 18:00', '2009/10/14 19:00', '2009/10/14 20:00', '2009/10/14 21:00', '2009/10/14 22:00', '2009/10/14 23:00', '2009/10/15 0:00', '2009/10/15 1:00', '2009/10/15 2:00', '2009/10/15 3:00', '2009/10/15 4:00', '2009/10/15 5:00', '2009/10/15 6:00', '2009/10/15 7:00', '2009/10/15 8:00', '2009/10/15 9:00', '2009/10/15 10:00', '2009/10/15 11:00', '2009/10/15 12:00', '2009/10/15 13:00', '2009/10/15 14:00', '2009/10/15 15:00', '2009/10/15 16:00', '2009/10/15 17:00', '2009/10/15 18:00', '2009/10/15 19:00', '2009/10/15 20:00', '2009/10/15 21:00', '2009/10/15 22:00', '2009/10/15 23:00', '2009/10/16 0:00', '2009/10/16 1:00', '2009/10/16 2:00', '2009/10/16 3:00', '2009/10/16 4:00', '2009/10/16 5:00', '2009/10/16 6:00', '2009/10/16 7:00', '2009/10/16 8:00', '2009/10/16 9:00', '2009/10/16 10:00', '2009/10/16 11:00', '2009/10/16 12:00', '2009/10/16 13:00', '2009/10/16 14:00', '2009/10/16 15:00', '2009/10/16 16:00', '2009/10/16 17:00', '2009/10/16 18:00', '2009/10/16 19:00', '2009/10/16 20:00', '2009/10/16 21:00', '2009/10/16 22:00', '2009/10/16 23:00', '2009/10/17 0:00', '2009/10/17 1:00', '2009/10/17 2:00', '2009/10/17 3:00', '2009/10/17 4:00', '2009/10/17 5:00', '2009/10/17 6:00', '2009/10/17 7:00', '2009/10/17 8:00', '2009/10/17 9:00', '2009/10/17 10:00', '2009/10/17 11:00', '2009/10/17 12:00', '2009/10/17 13:00', '2009/10/17 14:00', '2009/10/17 15:00', '2009/10/17 16:00', '2009/10/17 17:00', '2009/10/17 18:00', '2009/10/17 19:00', '2009/10/17 20:00', '2009/10/17 21:00', '2009/10/17 22:00', '2009/10/17 23:00', '2009/10/18 0:00', '2009/10/18 1:00', '2009/10/18 2:00', '2009/10/18 3:00', '2009/10/18 4:00', '2009/10/18 5:00', '2009/10/18 6:00', '2009/10/18 7:00', '2009/10/18 8:00'
                    ].map(function (str) {
                        return str.replace(' ', '\n');
                    })
                }
            ],
            yAxis: [
                {
                    name: 'Flow(m³/s)',
                    type: 'value'
                },
                {
                    name: 'Rainfall(mm)',
                    nameLocation: 'start',
                    alignTicks: true,
                    type: 'value',
                    inverse: true
                }
            ],
            series: [
                {
                    name: 'Flow',
                    type: 'line',
                    areaStyle: {},
                    lineStyle: {
                        width: 1
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    markArea: {
                        silent: true,
                        itemStyle: {
                            opacity: 0.3
                        },
                        data: [
                            [
                                {
                                    xAxis: '2009/9/12\n7:00'
                                },
                                {
                                    xAxis: '2009/9/22\n7:00'
                                }
                            ]
                        ]
                    },
                    // prettier-ignore
                    data: [
                        0.97, 0.96, 0.96, 0.95, 0.95, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.93, 0.92, 0.91, 0.9, 0.89, 0.88, 0.87, 0.87, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.87, 0.88, 0.9, 0.93, 0.96, 0.99, 1.03, 1.06, 1.1, 1.14, 1.17, 1.2, 1.23, 1.26, 1.29, 1.33, 1.36, 1.4, 1.43, 1.45, 1.48, 1.49, 1.51, 1.51, 1.5, 1.49, 1.47, 1.44, 1.41, 1.37, 1.34, 1.3, 1.27, 1.24, 1.22, 1.2, 1.19, 1.18, 1.16, 1.15, 1.14, 1.13, 1.12, 1.11, 1.11, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.09, 1.09, 1.08, 1.07, 1.06, 1.05, 1.04, 1.03, 1.03, 1.02, 1.01, 1.01, 1, 0.99, 0.98, 0.97, 0.96, 0.96, 0.95, 0.95, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.93, 0.92, 0.91, 0.9, 0.89, 0.88, 0.87, 0.87, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.85, 0.84, 0.83, 0.82, 0.81, 0.8, 0.8, 0.79, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.77, 0.75, 0.73, 0.71, 0.68, 0.65, 0.63, 0.61, 0.59, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.57, 0.57, 0.57, 0.56, 0.55, 0.55, 0.54, 0.54, 0.53, 0.52, 0.52, 0.51, 0.51, 0.5, 0.5, 0.49, 0.48, 0.48, 0.47, 0.47, 0.47, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.46, 0.52, 0.67, 0.9, 1.19, 1.52, 1.87, 2.22, 2.55, 2.84, 3.07, 3.22, 3.28, 3.28, 3.28, 3.28, 3.28, 3.28, 3.28, 3.28, 3.28, 3.28, 3.28, 3.28, 3.28, 3.24, 3.13, 2.97, 2.77, 2.54, 2.3, 2.05, 1.82, 1.62, 1.46, 1.35, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.31, 1.3, 1.26, 1.21, 1.14, 1.06, 0.97, 0.89, 0.81, 0.74, 0.69, 0.65, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.63, 0.63, 0.62, 0.62, 0.61, 0.6, 0.59, 0.59, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.59, 0.61, 0.63, 0.65, 0.68, 0.71, 0.73, 0.75, 0.77, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.77, 0.75, 0.73, 0.71, 0.68, 0.65, 0.63, 0.61, 0.59, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.59, 0.59, 0.6, 0.61, 0.62, 0.62, 0.63, 0.63, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.65, 0.66, 0.68, 0.69, 0.71, 0.73, 0.74, 0.76, 0.77, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.79, 0.81, 0.82, 0.84, 0.86, 0.88, 0.9, 0.92, 0.93, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.94, 0.93, 0.92, 0.91, 0.9, 0.89, 0.88, 0.87, 0.87, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.86, 0.85, 0.84, 0.82, 0.8, 0.78, 0.76, 0.75, 0.73, 0.72, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.72, 0.73, 0.74, 0.76, 0.78, 0.79, 0.82, 0.84, 0.86, 0.89, 0.91, 0.94, 0.97, 1, 1.02, 1.05, 1.08, 1.11, 1.14, 1.17, 1.19, 1.22, 1.25, 1.27, 1.29, 1.31, 1.33, 1.35, 1.36, 1.38, 1.39, 1.39, 1.4, 1.4, 1.4, 1.39, 1.37, 1.35, 1.32, 1.29, 1.26, 1.22, 1.18, 1.14, 1.1, 1.05, 1.01, 0.97, 0.93, 0.89, 0.85, 0.82, 0.78, 0.76, 0.74, 0.72, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.72, 0.73, 0.74, 0.75, 0.77, 0.78, 0.8, 0.82, 0.84, 0.87, 0.89, 0.92, 0.94, 0.97, 0.99, 1.02, 1.05, 1.08, 1.1, 1.13, 1.16, 1.18, 1.21, 1.23, 1.26, 1.28, 1.3, 1.32, 1.34, 1.35, 1.37, 1.38, 1.39, 1.4, 1.41, 1.41, 1.42, 1.42, 1.43, 1.43, 1.43, 1.44, 1.44, 1.44, 1.44, 1.45, 1.45, 1.45, 1.46, 1.46, 1.46, 1.47, 1.47, 1.48, 1.48, 1.49, 1.5, 1.51, 1.54, 1.62, 1.73, 1.88, 2.05, 2.24, 2.45, 2.67, 2.89, 3.11, 3.31, 3.51, 3.69, 3.86, 4.03, 4.18, 4.33, 4.48, 4.62, 4.76, 4.89, 5.02, 5.16, 5.29, 5.43, 5.57, 5.71, 5.86, 6.02, 6.18, 6.36, 6.54, 6.73, 6.93, 7.15, 7.38, 7.62, 7.88, 8.16, 8.46, 8.77, 9.11, 9.46, 9.84, 10.24, 10.67, 11.12, 11.6, 12.3, 13.66, 16, 38.43, 82.21, 146.6, 218.7, 226, 225.23, 223.08, 219.78, 212, 199.82, 184.6, 168, 151.65, 137.21, 126.31, 119.94, 115.52, 112.06, 108.92, 105.44, 101, 94.56, 86.36, 77.67, 69.76, 63.9, 60.38, 57.41, 54.84, 52.57, 50.56, 48.71, 46.97, 45.25, 43.48, 41.6, 39.5, 37.19, 34.81, 32.46, 30.27, 28.36, 26.85, 25.86, 25.5, 25.5, 25.5, 25.5, 25.5, 25.5, 25.5, 25.5, 25.5, 25.5, 25.5, 25.5, 25.5, 25.27, 24.65, 23.7, 22.52, 21.17, 19.75, 18.33, 16.98, 15.8, 14.85, 14.23, 14, 14.02, 14.08, 14.17, 14.29, 14.44, 14.61, 14.8, 15.01, 15.23, 15.47, 15.71, 15.95, 16.19, 16.43, 16.67, 16.89, 17.1, 17.29, 17.46, 17.61, 17.73, 17.82, 17.88, 17.9, 17.63, 16.88, 15.75, 14.33, 12.71, 10.98, 9.23, 7.56, 6.05, 4.81, 3.92, 3.47, 3.28, 3.1, 2.93, 2.76, 2.61, 2.46, 2.32, 2.19, 2.07, 1.96, 1.85, 1.75, 1.66, 1.58, 1.51, 1.44, 1.39, 1.34, 1.29, 1.26, 1.23, 1.22, 1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.21, 1.21, 1.21, 1.21, 1.22, 1.22, 1.22, 1.23, 1.23, 1.23, 1.24, 1.24, 1.25, 1.25, 1.25, 1.26, 1.26, 1.27, 1.27, 1.27, 1.28, 1.28, 1.28, 1.29, 1.29, 1.29, 1.29, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.29, 1.29, 1.29, 1.29, 1.28, 1.28, 1.28, 1.27, 1.27, 1.26, 1.25, 1.25, 1.24, 1.23, 1.23, 1.22, 1.21, 1.2, 1.16, 1.06, 0.95, 0.83, 0.74, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.71, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.69, 0.69, 0.69, 0.69, 0.69, 0.69, 0.69, 0.69, 0.68, 0.68, 0.68, 0.68, 0.68, 0.68, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.67, 0.66, 0.66, 0.66, 0.66, 0.66, 0.66, 0.66, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.65, 0.66, 0.68, 0.69, 0.71, 0.73, 0.74, 0.76, 0.77, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.78, 0.8, 0.86, 0.95, 1.08, 1.25, 1.46, 1.7, 1.97, 2.28, 2.63, 3.01, 3.42, 3.87, 4.35, 4.86, 5.4, 5.98, 6.59, 7.92, 10.49, 14.04, 18.31, 23.04, 27.98, 32.87, 37.45, 41.46, 44.64, 46.74, 47.5, 46.86, 45.16, 42.77, 40.04, 37.33, 35, 32.74, 30.21, 27.7, 25.5, 23.9, 23.2, 23.06, 22.94, 22.84, 22.77, 22.72, 22.7, 22.8, 23.23, 23.95, 24.91, 26.04, 27.3, 28.76, 30.7, 33.39, 37.12, 42.15, 48.77, 65.22, 252.1, 257, 237.32, 221.19, 212, 208.67, 206.89, 205.2, 202.15, 189.82, 172, 165.3, 160.49, 156.8, 153.44, 149.62, 144.6, 138.27, 131, 123.11, 114.9, 106.69, 98.79, 91.5, 85.13, 80, 75.53, 71.03, 66.65, 62.54, 58.85, 55.73, 53.31, 51.75, 51.2, 56.53, 68.25, 80, 91.01, 102.03, 109, 112.37, 115.29, 117.68, 119.48, 120.61, 121, 119.45, 115.57, 110.52, 105.47, 101.58, 100, 99.97, 99.94, 99.92, 99.9, 99.88, 99.86, 99.85, 99.84, 99.83, 99.82, 99.81, 99.81, 99.8, 99.8, 99.8, 122.15, 163.65, 186, 182.96, 175.15, 164.56, 153.18, 143, 136, 131.37, 126.98, 122.81, 118.85, 115.09, 111.52, 108.13, 104.9, 101.83, 98.9, 96.11, 93.44, 90.87, 88.41, 86.04, 83.74, 81.51, 79.33, 77.2, 75.1, 73.02, 70.95, 68.88, 66.8, 64.87, 63.14, 61.4, 59.53, 57.67, 56, 54.6, 53.36, 52.2, 51.05, 49.85, 48.5, 46.87, 44.92, 42.74, 40.42, 38.04, 35.69, 33.46, 31.44, 29.72, 28.38, 27.51, 27.2, 27.2, 27.2, 27.2, 27.2, 27.2, 27.2, 27.2, 27.2, 27.2, 27.2, 27.2, 27.2, 27.14, 26.97, 26.7, 26.35, 25.95, 25.49, 25.02, 24.53, 24.04, 23.58, 23.16, 22.8, 22.46, 22.11, 21.75, 21.39, 21.03, 20.69, 20.36, 20.05, 19.78, 19.54, 19.35, 19.2, 19.09, 19, 18.92, 18.85, 18.79, 18.74, 18.68, 18.62, 18.56, 18.49, 18.4, 18.3, 18.17, 18.02, 17.83, 17.63, 17.41, 17.18, 16.93, 16.68, 16.43, 16.18, 15.93, 15.7, 15.47, 15.22, 14.97, 14.71, 14.45, 14.18, 13.93, 13.68, 13.44, 13.21, 13, 12.8, 12.62, 12.46, 12.31, 12.16, 12.03, 11.89, 11.76, 11.62, 11.48, 11.33, 11.17, 11, 10.81, 10.59, 10.36, 10.12, 9.86, 9.61, 9.36, 9.12, 8.89, 8.68, 8.5, 8.35, 8.21, 8.08, 7.94, 7.81, 7.68, 7.56, 7.46, 7.36, 7.29, 7.23, 7.19, 7.18, 7.51, 8.42, 9.81, 11.58, 13.63, 15.86, 18.16, 20.44, 22.58, 24.49, 26.06, 27.2, 28.08, 28.95, 29.81, 30.65, 31.48, 32.28, 33.07, 33.82, 34.55, 35.25, 35.92, 36.56, 37.15, 37.71, 38.23, 38.7, 39.13, 39.5, 39.83, 40.1, 40.31, 40.47, 40.57, 40.6, 40.49, 40.16, 39.64, 38.94, 38.09, 37.1, 36, 34.79, 33.51, 32.17, 30.79, 29.39, 27.99, 26.6, 25.25, 23.96, 22.75, 21.63, 20.63, 19.76, 19.04, 18.49, 18.14, 18, 17.97, 17.95, 17.94, 17.92, 17.91, 17.9, 17.89, 17.88, 17.87, 17.85, 17.83, 17.8, 17.7, 17.46, 17.13, 16.7, 16.21, 15.68, 15.13, 14.57, 14.04, 13.56, 13.14, 12.8, 12.52, 12.27, 12.02, 11.79, 11.57, 11.37, 11.16, 10.97, 10.78, 10.59, 10.39, 10.2, 10.01, 9.81, 9.63, 9.44, 9.26, 9.08, 8.9, 8.73, 8.56, 8.39, 8.22, 8.06, 7.9, 7.73, 7.57, 7.41, 7.25, 7.09, 6.94, 6.79, 6.65, 6.52, 6.4, 6.28, 6.17, 6.08, 5.98, 5.9, 5.81, 5.73, 5.65, 5.57, 5.49, 5.41, 5.32, 5.23, 5.14, 5.04, 4.94, 4.84, 4.74, 4.63, 4.53, 4.43, 4.33, 4.23, 4.13, 4.03, 3.93, 3.81, 3.69, 3.57, 3.45, 3.33, 3.22, 3.12, 3.04, 2.98, 2.93, 2.92, 2.92, 2.92, 2.92, 2.92, 2.92, 2.92, 2.92, 2.92, 2.92, 2.92, 2.92, 2.92, 2.9, 2.86, 2.8, 2.71, 2.62, 2.52, 2.42, 2.33, 2.24, 2.18, 2.14, 2.12, 2.12, 2.12, 2.12, 2.12, 2.12, 2.12, 2.12, 2.12, 2.12, 2.12, 2.12, 2.12, 2.1, 2.06, 2, 1.91, 1.82, 1.71, 1.61, 1.5, 1.4, 1.32, 1.25, 1.2, 1.16, 1.13, 1.1, 1.06, 1.03, 1, 0.97, 0.93, 0.9, 0.87, 0.85, 0.82, 0.79, 0.77, 0.74, 0.72, 0.69, 0.67, 0.65, 0.63, 0.61, 0.59, 0.58, 0.56, 0.54, 0.53, 0.52, 0.51, 0.5, 0.49, 0.48, 0.48, 0.47, 0.47, 0.46, 0.46, 0.47, 0.48, 0.5, 0.53, 0.56, 0.59, 0.62, 0.64, 0.67, 0.69, 0.7, 0.71, 0.71, 0.71, 0.71, 0.7, 0.7, 0.7, 0.69, 0.69, 0.69, 0.68, 0.68, 0.67, 0.67, 0.67, 0.66, 0.66, 0.65, 0.65, 0.65, 0.65, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.64, 0.65, 0.65, 0.65, 0.66, 0.66, 0.67, 0.68, 0.69, 0.69, 0.7, 0.71, 0.73, 0.74, 0.75, 0.76, 0.78, 0.8, 0.81, 0.83, 0.85, 0.87, 0.89, 0.92, 0.94, 0.97, 0.99, 1.02, 1.05, 1.08, 1.11, 1.15, 1.18, 1.32, 1.66, 2.21, 2.97, 3.94, 5.11, 6.5, 8.1, 9.9, 11.92, 14.15, 16.6, 22.3, 22.8, 24.48, 30.38, 35.74, 42.4, 57.14, 94.04, 112.9, 123.4, 130.4, 130, 119.4, 120.7, 116.8, 118.1, 119.4, 124.8, 143.5, 204, 294, 319.2, 328.4, 365, 350.8, 347.6, 347.6, 325, 331.6, 319.2, 308, 308, 308, 308, 296.8, 300, 281, 278.4, 270.6, 271, 253.6, 233.5, 219.2, 207.8, 205.9, 204, 189.6, 178.8, 173.4, 160, 154.4, 146, 145, 140.5, 130.4, 126.2, 116.8, 112.9, 106.5, 101.6, 98.51, 82.67, 67.3, 80.05, 76.12, 72.3, 71.02, 69.78, 67.3, 67.3, 68.54, 57.6, 71.02, 66.06, 59.12, 57.14, 55.16, 55.16, 52.19, 52.19, 51.2, 48.56, 44.16, 43, 45.92, 49.44, 44.16, 36.48, 35.74, 35, 32.36, 37.22, 32.36, 32.36, 32.36, 33.68, 32.36, 31.7, 35.74, 29.72, 32.36, 30.38, 29.72, 28.4, 28.4, 28.4, 27.28, 25.6, 25.04, 23.92, 22.3, 21.8, 21.8, 21.8, 22.8, 21.8, 25.6, 22.8, 22.8, 17.8, 16.04, 16.04, 16.04, 16.04, 16.04, 16.04, 16.04, 16.04, 16.04, 16.04, 15.02, 14, 14.03, 14.11, 14.25, 14.45, 14.72, 15.06, 15.46, 15.95, 16.51, 17.15, 17.87, 18.69, 19.59, 20.59, 21.69, 22.88, 24.18, 25.59, 27.1, 28.73, 30.48, 32.34, 34.33, 36.44, 38.69, 41.06, 43.57, 46.22, 49.01, 51.95, 55.04, 58.27, 61.66, 65.21, 68.92, 72.8, 88.09, 104.9, 105.7, 110.3, 111.6, 110.3, 106.5, 105.7, 103.3, 100, 97.02, 98.8, 91.07, 83.98, 88.09, 81.36, 78.74, 77.43, 77.43, 73.5, 74.81, 72.63, 68.58, 66.4, 68.54, 69.78, 67.3, 64.82, 61.1, 59.12, 56.15, 53.18, 50.32, 49.44, 44.16, 36.5, 42.4, 37.96, 37.22, 33.68, 36.48, 35.74, 35, 35, 37.22, 37.22, 39.44, 32.6, 34.54, 36.48, 35.74, 34.34, 33.68, 33.02, 31.04, 29.72, 29.72, 29.72, 26.16, 25.6, 29.72, 18.3, 22.3, 21.3, 21.8, 21.8, 20.3, 20.8, 25.04, 25.04, 25.6, 25.6, 25.04, 25.6, 25.04, 25.6, 23.92, 25.04, 21.3, 21.8, 22.3, 21.8, 20.8, 16.1, 20.3, 18.3, 13.22, 19.3, 19.3, 18.3, 14.4, 13.86, 13.36, 12.9, 12.48, 12.1, 11.75, 11.43, 11.15, 10.9, 10.67, 10.48, 10.31, 10.16, 10.04, 9.93, 9.85, 9.78, 9.73, 9.69, 9.67, 9.65, 9.65, 12.08, 8.67, 11.7, 11.38, 10.65, 9.84, 9.32, 9.07, 8.85, 8.66, 8.49, 8.35, 8.22, 8.1, 7.98, 7.86, 7.74, 7.61, 7.47, 7.31, 7.14, 6.96, 6.78, 6.58, 6.39, 6.19, 5.99, 5.78, 5.58, 5.39, 5.2, 5.01, 4.83, 4.67, 4.51, 4.37, 4.24, 4.12, 4.02, 3.95, 3.89, 3.85, 3.84, 4.41, 5.77, 7.39, 8.75, 9.32, 9.18, 9, 8.94, 8.88, 8.83, 8.78, 8.73, 8.68, 8.64, 8.6, 8.56, 8.53, 8.5, 8.47, 8.45, 8.42, 8.4, 8.39, 8.37, 8.36, 8.35, 8.35, 8.34, 8.34, 8.67, 9.65, 9.62, 9.53, 9.4, 9.21, 8.98, 8.7, 8.4, 8.06, 7.69, 7.3, 6.89, 6.47, 6.03, 5.59, 5.14, 4.7, 4.26, 3.83, 3.42, 3.02, 2.65, 2.3, 1.98, 1.7, 1.45, 1.25, 1.09, 0.99, 0.94, 0.92, 0.91, 0.89, 0.87, 0.85, 0.84, 0.82, 0.81, 0.79, 0.78, 0.77, 0.75, 0.74, 0.73, 0.72, 0.71, 0.7, 0.69, 0.68, 0.67, 0.66, 0.65, 0.64, 0.64, 0.63, 0.63, 0.62, 0.62, 0.61, 0.61, 0.61, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.61, 0.61, 0.61, 0.61, 0.61, 0.61, 0.62, 0.62, 0.62, 0.62, 0.63, 0.63, 0.63, 0.63, 0.63, 0.64, 0.64, 0.64, 0.64, 0.64, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.65, 0.64, 0.63, 0.62, 0.6, 0.59, 0.57, 0.55, 0.54, 0.53, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.51, 0.51, 0.51, 0.5, 0.5, 0.49, 0.48, 0.47, 0.47, 0.46, 0.45, 0.45, 0.44, 0.43, 0.42, 0.42, 0.41, 0.41, 0.41, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.41, 0.42, 0.43, 0.44, 0.46, 0.48, 0.5, 0.53, 0.55, 0.58, 0.61, 0.64, 0.67, 0.7, 0.73, 0.77, 0.8, 0.83, 0.87, 0.9, 0.93, 0.96, 0.99, 1.02, 1.05, 1.08, 1.1, 1.12, 1.14, 1.16, 1.17, 1.18, 1.19, 1.2, 1.2, 1.2, 1.19, 1.17, 1.15, 1.12, 1.09, 1.06, 1.02, 0.98, 0.94, 0.9, 0.86, 0.82, 0.78, 0.74, 0.7, 0.66, 0.63, 0.6, 0.57, 0.55, 0.53, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.51, 0.51, 0.5, 0.5, 0.49, 0.49, 0.48, 0.47, 0.47, 0.47, 0.46, 0.46, 0.45, 0.45, 0.45, 0.44, 0.44, 0.44, 0.43, 0.43, 0.43, 0.42, 0.42, 0.42, 0.41, 0.41, 0.41, 0.41, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.41, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.43, 0.43, 0.43, 0.43, 0.43, 0.43, 0.44, 0.44, 0.44, 0.44, 0.44, 0.44, 0.45, 0.45, 0.45
                    ]
                },
                {
                    name: 'Rainfall',
                    type: 'line',
                    yAxisIndex: 1,
                    areaStyle: {},
                    lineStyle: {
                        width: 1
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    markArea: {
                        silent: true,
                        itemStyle: {
                            opacity: 0.3
                        },
                        data: [
                            [
                                {
                                    xAxis: '2009/9/10\n7:00'
                                },
                                {
                                    xAxis: '2009/9/20\n7:00'
                                }
                            ]
                        ]
                    },
                    // prettier-ignore
                    data: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.005, 0.017, 0.017, 0.017, 0.017, 0.011, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.021, 0.026, 0.03, 0.036, 0.036, 0.195, 0.221, 0.019, 0.013, 0.017, 0.03, 0.03, 0.03, 0.046, 0.045, 0.038, 0.084, 0.045, 0.045, 0.037, 0.034, 0.035, 0.036, 0.044, 0.052, 0.048, 0.109, 0.033, 0.029, 0.04, 0.042, 0.042, 0.042, 0.073, 0.076, 0.062, 0.066, 0.066, 0.075, 0.096, 0.128, 0.121, 0.128, 0.14, 0.226, 0.143, 0.097, 0.018, 0, 0, 0, 0, 0, 0.018, 0.047, 0.054, 0.054, 0.054, 0.036, 0.185, 0.009, 0.038, 0.061, 0.077, 0.091, 0.126, 0.69, 0.182, 0.349, 0.231, 0.146, 0.128, 0.167, 0.1, 0.075, 0.071, 0.071, 0.117, 0.01, 0.002, 0.002, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.005, 0.026, 0.038, 0.038, 0.038, 0.076, 0.086, 0.109, 0.213, 0.276, 0.288, 0.297, 0.642, 1.799, 1.236, 2.138, 0.921, 0.497, 0.685, 0.828, 0.41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.018, 0.024, 0.024, 0.024, 0.024, 0.006, 0.003, 0.046, 0.046, 0.046, 0.046, 0.043, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.204, 0.303, 1.028, 1.328, 1.524, 1.41, 1.362, 1.292, 1.191, 0.529, 0.501, 0.944, 1.81, 2.899, 0.859, 0.126, 0.087, 0.047, 0, 0, 0, 0, 0.011, 0.028, 0.028, 0.028, 0.028, 0.017, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.099, 0.159, 0.297, 0.309, 0.309, 0.614, 0.818, 1.436, 1.195, 0.553, 0.542, 0.955, 0.898, 0.466, 0.386, 0.556, 0.388, 0.221, 0.192, 0.192, 0.187, 0.166, 0.18, 0.302, 0.158, 0.009, 0.009, 0.009, 0.009, 0.009, 0.007, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.004, 0.032, 0.032, 0.032, 0.032, 0.082, 0.149, 0.204, 0.247, 0.262, 0.49, 0.51, 0.533, 0.746, 0.847, 2.393, 1.188, 1.114, 0.475, 0.043, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.017, 0.017, 0.021, 0.042, 0.079, 0.111, 0.126, 0.122, 0.133, 0.846, 0.102, 0.077, 0.067, 0.056, 0.005, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.011, 0.017, 0.017, 0.017, 0.017, 0.006, 0, 0, 0, 0, 0, 0.01, 0.03, 0.054, 0.067, 0.07, 0.25, 0.251, 0.494, 0.065, 0.054, 0.054, 0.064, 0.084, 0.077, 0.101, 0.132, 0.248, 0.069, 0.117, 0.115, 0.087, 0.326, 0.036, 0.009, 0.009, 0.009, 0.009, 0.009, 0.004, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.02, 0.039, 0.04, 0.04, 0.04, 0.229, 0.079, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.023, 0.069, 0.082, 0.082, 0.082, 0.503, 0.774, 0.038, 0.012, 0.012, 0.012, 0.016, 0.02, 0.028, 0.051, 0.06, 0.064, 0.19, 0.15, 0.164, 0.139, 0.13, 0.085, 0.031, 0.023, 0.022, 0.007, 0.005, 0.005, 0.001, 0, 0.02, 0.048, 0.048, 0.053, 0.056, 0.036, 0.008, 0.008, 0.004, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.013, 0.017, 0.036, 0.068, 0.095, 0.233, 0.272, 0.377, 0.722, 1.494, 3.756, 0.954, 0.439, 0.442, 0.462, 0.373, 0.249, 0.214, 0.1, 0.044, 0.037, 0.023, 0.002, 0, 0, 0, 0, 0, 0, 0.02, 0.024, 0.024, 0.024, 0.024, 0.004, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.008, 0.017, 0.017, 0.045, 0.186, 0.308, 0.241, 0.241, 0.893, 4.067, 4.494, 5.015, 3.494, 2.057, 1.411, 0.718, 0.407, 0.313, 0.339, 1.537, 1.105, 0.218, 0.136, 0.03, 0.005, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.037, 0.448, 1.2, 1.309, 1.309, 1.425, 1.223, 0.471, 0.767, 0.423, 0.273, 0.412, 0.646, 0.481, 0.239, 0.131, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.044, 0.15, 0.223, 0.388, 0.513, 0.883, 2.828, 4.786, 5.959, 4.95, 6.434, 6.319, 3.35, 2.806, 4.204, 1.395, 1.015, 1.015, 0.836, 0.74, 0.72, 0.615, 0.477, 0.192, 0.046, 0.007, 0.007, 0.007, 0.007, 0.007, 0.007, 0.007, 0.008, 0.005, 0.005, 0.005, 0.005, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.001, 0.012, 0.012, 0.012, 0.012, 0.011, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.002, 0.012, 0.028, 0.028, 0.028, 0.138, 0.092, 0.082, 0.082, 0.096, 0.719, 0.155, 0.042, 0.047, 0.129, 0.021, 0.021, 0.014, 0.009, 0.029, 0.067, 0.088, 0.095, 0.095, 0.138, 0.091, 0.032, 0.025, 0.025, 0.003, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.002, 0.045, 0.228, 0.297, 0.325, 0.339, 0.581, 1.244, 0.796, 0.517, 0.227, 0.053, 0.006, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.003, 0.005, 0.005, 0.005, 0.005, 0.081, 0.129, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.014, 0.041, 0.041, 0.041, 0.041, 0.027, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.009, 0.017, 0.017, 0.017, 0.017, 0.355, 0.174, 0.009, 0.009, 0.012, 0.136, 0.208, 0.208, 0.208, 0.215, 7.359, 1.858, 0.458, 0.053, 0.053, 0.047, 0.045, 0.045, 0.059, 0.136, 0.188, 0.206, 0.21, 0.588, 1.517, 6.02, 4.688, 4.42, 0.624, 0.326, 0.359, 0.553, 0.899, 0.94, 2.95, 9.415, 5.752, 1.092, 0.096, 0.035, 0.026, 0.018, 0.015, 0.011, 0.011, 0.011, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.056, 0.27, 0.314, 0.351, 0.354, 0.609, 0.796, 1.857, 0.848, 0.538, 0.214, 0.178, 0.178, 0.201, 0.231, 0.227, 0.272, 0.397, 0.45, 1.014, 2.917, 1.675, 0.081, 0.059, 0.059, 0.148, 0.075, 0.075, 0.078, 0.236, 0.784, 0.784, 0.784, 0.784, 0.741, 0.115, 0.058, 0.058, 0.058, 0.029, 0.015, 0.015, 0.015, 0.015, 0.012, 0.008, 0.604, 0.985, 1.305, 2.273, 2.528, 2.336, 2.496, 2.281, 1.397, 1.713, 3.259, 1.167, 0.745, 0.548, 1.058, 0.684, 0.728, 0.392, 0.179, 0.283, 0.283, 0.46, 0.08, 0.099, 0.099, 0.099, 0.1, 0.143, 0.137, 0.238, 0.317, 0.262, 0.225, 0.792, 0.426, 0.332, 0.261, 0.11, 0.093, 0.102, 0.171, 0.292, 0.504, 0.605, 1.745, 2.485, 1.964, 0.33, 0.171, 0.259, 0.242, 0.215, 0.366, 0.354, 0.205, 0.203, 0.262, 0.153, 0.13, 0.137, 0.362, 0.691, 0.295, 0.433, 0.154, 0.056, 0.053, 0.053, 0.053, 0.051, 0.047, 0.065, 0.078, 0.091, 0.206, 0.813, 0.102, 0.151, 0.05, 0.024, 0.004, 0.001, 0, 0, 0, 0.021, 0.021, 0.021, 0.021, 0.021, 0.013, 0.013, 0.013, 0.013, 0.013, 0.013, 0.013, 0.013, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.008, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.018, 0.021, 0.021, 0.021, 0.021, 0.003, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.024, 0.173, 0.261, 0.267, 0.267, 0.534, 1.354, 1.772, 0.72, 0.218, 0.018, 0.018, 0.028, 0.036, 0.032, 0.194, 0.082, 0.035, 0.286, 0.027, 0.038, 0.038, 0.027, 0.021, 0.014, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.016, 0.017, 0.017, 0.031, 0.047, 0.043, 0.056, 0.104, 0.149, 0.179, 0.205, 0.328, 0.998, 0.522, 1.851, 3.727, 3.273, 2.204, 1.169, 1.006, 1.179, 0.74, 0.741, 1.065, 0.925, 0.671, 0.497, 0.431, 0.327, 0.277, 0.126, 0.581, 0.207, 0.359, 2.485, 0.038, 0.036, 0.003, 0.003, 0.003, 0.003, 0.004, 0.098, 0.023, 0.021, 0.021, 0.022, 0.041, 0.041, 0.043, 0.045, 0.043, 0.014, 0.014, 0.014, 0.014, 0.014, 0.014, 0.014, 0.031, 0.046, 0.063, 0.119, 0.107, 0.092, 0.085, 0.065, 0.06, 0.054, 0.042, 0.039, 0.046, 0.044, 0.028, 0.028, 0.02, 0.013, 0.013, 0.013, 0.013, 0.016, 0.032, 0.031, 0.031, 0.031, 0.028, 0.011, 0.011, 0.011, 0.011, 0.011, 0.023, 0.024, 0.024, 0.024, 0.019, 0.015, 0.015, 0.015, 0.015, 0.015, 0.015, 0.013, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.001, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.011, 0.017, 0.024, 0.026, 0.061, 0.172, 0.206, 0.213, 0.267, 0.511, 0.668, 0.157, 0.017, 0.017, 0.017, 0.046, 0.054, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.001, 0.017, 0.017, 0.017, 0.017, 0.016, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.01, 0.017, 0.017, 0.017, 0.017, 0.012, 0.017, 0.017, 0.017, 0.017, 0.012, 0, 0, 0, 0, 0, 0.003, 0.031, 0.066, 0.093, 0.112, 0.122, 0.202, 0.068, 0.041, 0.022, 0.011, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.002, 0.005, 0.012, 0.021, 0.021, 0.019, 0.033, 0.03, 0.026, 0.026, 0.034, 0.095, 0.024, 0.024, 0.024, 0.023, 0.019, 0.018, 0.018, 0.018, 0.011, 0.03, 0.045, 0.044, 0.044, 0.044, 0.022, 0.009, 0.024, 0.033, 0.033, 0.033, 0.024, 0.009, 0, 0, 0, 0, 0, 0, 0.003, 0.017, 0.017, 0.017, 0.017, 0.014, 0, 0, 0, 0, 0, 0.032, 0.032, 0.032, 0.032, 0.032, 0.005, 0.008, 0.009, 0.014, 0.014, 0.009, 0.005, 0.004, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.007, 0.009, 0.009, 0.009, 0.009, 0.043, 0.063, 0.084, 0.098, 0.101, 0.213, 0.334, 0.383, 0.43, 0.448, 0.511, 0.801, 0.835, 1.642, 1.614, 1.496, 1.496, 1.476, 1.068, 0.481, 0.22, 0.119, 0.099, 0.07, 0.072, 0.063, 0.076, 0.14, 0.205, 0.28, 0.297, 0.3, 0.479, 0.877, 1.098, 1.611, 1.629, 1.686, 1.686, 1.631, 1.528, 1.862, 1.703, 1.531, 2.196, 0.395, 0.416, 0.453, 0.728, 0.917, 0.986, 1.17, 2.171, 3.011, 2.909, 3.301, 1.377, 0.778, 0.799, 0.947, 1.039, 0.879, 0.76, 1.372, 1.674, 1.674, 1.68, 1.823, 1.793, 1.162, 0.783, 0.216, 0.152, 0.152, 0.152, 0.049, 0, 0, 0, 0.117, 0.127, 0.127, 0.127, 0.127, 0.127, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.003, 0.005, 0.005, 0.005, 0.005, 0.003, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.309, 0.364, 0.364, 0.364, 0.364, 0.063, 0.01, 0.01, 0.01, 0.012, 0.015, 0.015, 0.11, 0.55, 0.824, 0.825, 0.829, 1.39, 1.429, 1.342, 1.43, 1.636, 1.717, 2.135, 2.203, 3.191, 3.022, 1.589, 0.86, 0.807, 0.645, 0.595, 0.588, 0.557, 0.552, 1.271, 0.708, 0.677, 0.629, 0.714, 0.203, 0.133, 0.061, 0.062, 0.018, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.001, 0.072, 0.29, 0.438, 0.53, 0.557, 0.873, 1.039, 1.04, 0.208, 0.049, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.03, 0.039, 0.039, 0.039, 0.039, 0.098, 0.008, 0.007, 0.007, 0.007, 0.007, 0.007, 0.007, 0.007, 0.007, 0.007, 0.056, 0.062, 0.065, 0.065, 0.065, 0.047, 0.216, 0.256, 0.315, 0.4, 0.502, 0.449, 0.47, 0.571, 0.814, 1.153, 0.774, 0.202, 0.086, 0.075, 0.071, 0.032, 0.019, 0.003, 0.004, 0.004, 0.004, 0.004, 0.004, 0.004, 0.007, 0.072, 0.153, 0.256, 0.306, 0.404, 0.698, 0.733, 0.823, 0.715, 0.563, 0.404, 0.293, 0.217, 0.213, 0.202, 0.202, 0.294, 0.704, 0.797, 1.359, 1.101, 0.72, 0.514, 0.539, 0.434, 0.389, 0.387, 0.386, 0.375, 0.369, 0.319, 0.239, 0.183, 0.136, 0.062, 0.052, 0.096, 0.119, 0.119, 0.114, 0.127, 0.132, 0.139, 0.169, 0.191, 0.278, 0.254, 0.214, 0.237, 0.221, 0.143, 0.129, 0.125, 0.109, 0.1, 0.087, 0.06, 0.038, 0.029, 0.029, 0.028, 0.048, 0.053, 0.053, 0.111, 0.125, 0.102, 0.097, 0.097, 0.039, 0.02, 0.02, 0.02, 0.014, 0.004, 0.031, 0.043, 0.047, 0.052, 0.08, 0.144, 0.182, 0.176, 0.171, 0.149, 0.112, 0.025, 0, 0, 0, 0, 0, 0, 0, 0.016, 0.031, 0.031, 0.031, 0.031, 0.015, 0, 0, 0, 0, 0, 0.005, 0.005, 0.005, 0.005, 0.005, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.005, 0.005, 0.005, 0.005, 0.005, 0.001, 0, 0, 0
                    ]
                }
            ]
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);

    }

    //Hrly Actual Carbon Profile
    _echartEnergyConsumptionColdChartDashboard[1601] = function (graphContainerId) {
        var dom = document.getElementById(graphContainerId);
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        function getVirtualData(year) {
            const date = +echarts.time.parse(year + '-01-01');
            const end = +echarts.time.parse(+year + 1 + '-01-01');
            const dayTime = 3600 * 24 * 1000;
            const data = [];
            for (let time = date; time < end; time += dayTime) {
                data.push([
                    echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
                    Math.floor(Math.random() * 10000)
                ]);
            }
            return data;
        }
        option = {
            tooltip: {},
            visualMap: {
                min: 0,
                max: 10000,
                type: 'piecewise',
                orient: 'horizontal',
                left: 'center',
                top: 65
            },
            calendar: {
                top: 120,
                left: 30,
                right: 30,
                cellSize: ['auto', 13],
                range: '2016',
                itemStyle: {
                    borderWidth: 0.5
                },
                yearLabel: { show: false }
            },
            series: {
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: getVirtualData('2016')
            }
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);

    }
    //Hrly Average Carbon Profile
    _echartEnergyConsumptionColdChartDashboard[1602] = function (graphContainerId) {
        var dom = document.getElementById(graphContainerId);
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        function getVirtualData(year) {
            const date = +echarts.time.parse(year + '-01-01');
            const end = +echarts.time.parse(+year + 1 + '-01-01');
            const dayTime = 3600 * 24 * 1000;
            const data = [];
            for (let time = date; time < end; time += dayTime) {
                data.push([
                    echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
                    Math.floor(Math.random() * 10000)
                ]);
            }
            return data;
        }
        option = {
            tooltip: {},
            visualMap: {
                min: 0,
                max: 10000,
                type: 'piecewise',
                orient: 'horizontal',
                left: 'center',
                top: 65
            },
            calendar: {
                top: 120,
                left: 30,
                right: 30,
                cellSize: ['auto', 13],
                range: '2016',
                itemStyle: {
                    borderWidth: 0.5
                },
                yearLabel: { show: false }
            },
            series: {
                type: 'heatmap',
                coordinateSystem: 'calendar',
                data: getVirtualData('2016')
            }
        };

        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }

        window.addEventListener('resize', myChart.resize);

    }

    return {
        init: function (selectedGraphText, graphContainerID) {
            console.log('🎯 energyColdDashboard.init called with:', selectedGraphText, graphContainerID);

            if ((selectedGraphText == undefined || selectedGraphText == null) || (graphContainerID == undefined || graphContainerID == null)) {
                console.error('❌ Invalid parameters');
                return;
            }

            if (typeof _echartEnergyConsumptionColdChartDashboard[selectedGraphText] === 'function') {
                console.log('✅ Calling graph function:', selectedGraphText);
                _echartEnergyConsumptionColdChartDashboard[selectedGraphText](graphContainerID);
            } else {
                console.error('❌ Graph function not found for ID:', selectedGraphText);
                console.log('Available functions:', Object.keys(_echartEnergyConsumptionColdChartDashboard));
            }
        },

        // ===========================
        // refreshFilter(graphId)
        // Called by Cold.js on carousel slide change.
        // Re-renders the correct graph's meter checkboxes into meterFilterContainer.
        // All graphs use the same shared container — ownership is tracked via
        // data-graph-owner. This is exactly the same pattern as 401/402.
        // Radio graphs (1401, 1402): only one meter active at a time.
        // Multi-select graphs (others): multiple meters can be active.
        // ===========================
        refreshFilter: function (graphId) {
            console.log('🔄 energyColdDashboard.refreshFilter called for graph:', graphId);
            var filterContainer = document.getElementById('meterFilterContainer');
            if (!filterContainer) return;

            // All graphs: claim ownership of the shared container
            filterContainer.setAttribute('data-graph-owner', String(graphId));
            filterContainer.innerHTML = '<div class="filter-label">Filter by Meter Type:</div>';

            // Date filter only for graphs 1 and 3 (live single-day graphs)
            var dateFilterContainer = document.getElementById('dateFilterContainer');
            if (dateFilterContainer) {
                if (graphId === 1 || graphId === 3) {
                    dateFilterContainer.style.display = 'flex';
                    var updateFnForDate = graphId === 1 ? g1_updateChart : updateEnergyTempChart;
                    g_renderDateFilter(graphId, function (newDate) { updateFnForDate(); });
                } else {
                    dateFilterContainer.style.display = 'none';
                }
            }

            // Registry covers all graphs
            var graphRegistry = {
                1: { available: g1_availableMeters, radio: false, selectedSet: g1_selectedMeterIDs, selectedMeter: null, colorFn: function (i) { return meterColors[i % meterColors.length]; }, updateFn: g1_updateChart, setMeter: null },
                2: { available: g2AvailableMeters, radio: false, selectedSet: g2SelectedMeters, selectedMeter: null, colorFn: function (i) { return meterColors[i % meterColors.length]; }, updateFn: g2_update, setMeter: null },
                3: { available: availableMeters, radio: false, selectedSet: selectedMeterIDs, selectedMeter: null, colorFn: function (i) { return meterColors[i % meterColors.length]; }, updateFn: updateEnergyTempChart, setMeter: null },
                401: { available: g4_availableMeters, radio: false, selectedSet: g4_selectedMeterIDs, selectedMeter: null, colorFn: function (i) { return meterColors[i % meterColors.length]; }, updateFn: g4_updateChart, setMeter: null },
                402: { available: g402_availableMeters, radio: false, selectedSet: g402_selectedMeterIDs, selectedMeter: null, colorFn: function (i) { return meterColors[i % meterColors.length]; }, updateFn: g402_updateChart, setMeter: null },
                601: { available: g601AvailableMeters, radio: false, selectedSet: g601SelectedMeters, selectedMeter: null, colorFn: g601_getMeterColor, updateFn: g601_update, setMeter: null },
                602: { available: g602AvailableMeters, radio: false, selectedSet: g602SelectedMeters, selectedMeter: null, colorFn: g602_getMeterColor, updateFn: g602_update, setMeter: null },
                801: { available: g801AvailableMeters, radio: false, selectedSet: g801SelectedMeters, selectedMeter: null, colorFn: g801_getMeterColor, updateFn: g801_update, setMeter: null },
                802: { available: g802AvailableMeters, radio: false, selectedSet: g802SelectedMeters, selectedMeter: null, colorFn: g802_getMeterColor, updateFn: g802_update, setMeter: null },
                1401: { available: g1401AvailableMeters, radio: true, selectedSet: null, getSelected: function () { return g1401SelectedMeter; }, colorFn: g1401_getMeterColor, updateFn: g1401_recalcRangeAndUpdate, setMeter: function (m) { g1401SelectedMeter = m; } },
                1402: { available: g1402AvailableMeters, radio: true, selectedSet: null, getSelected: function () { return g1402SelectedMeter; }, colorFn: g1402_getMeterColor, updateFn: g1402_updateChart, setMeter: function (m) { g1402SelectedMeter = m; } }
            };

            var entry = graphRegistry[graphId];
            if (!entry || !entry.available || entry.available.length === 0) return;

            entry.available.forEach(function (meter, index) {
                var color = entry.colorFn(index);
                var isChecked = entry.radio
                    ? (entry.getSelected && entry.getSelected() === meter)
                    : (entry.selectedSet ? entry.selectedSet.has(meter) : false);

                var label = document.createElement('label');
                label.className = 'meter-checkbox-label';
                label.innerHTML =
                    '<input type="checkbox" class="meter-checkbox" data-meter="' + meter + '" ' + (isChecked ? 'checked' : '') + '>' +
                    '<span class="checkbox-box" style="border-color:' + color + ';color:' + color + ';">' +
                    '<span class="checkbox-check"></span>' +
                    '</span>' +
                    '<span class="checkbox-text">' + meter + '</span>';

                label.querySelector('.meter-checkbox').addEventListener('change', function () {
                    var meterName = this.dataset.meter;
                    if (entry.radio) {
                        // Radio: uncheck all others in THIS container, set selected meter, update THIS graph's chart
                        filterContainer.querySelectorAll('.meter-checkbox').forEach(function (cb) {
                            if (cb.dataset.meter !== meterName) cb.checked = false;
                        });
                        entry.setMeter(this.checked ? meterName : null);
                        entry.updateFn();
                    } else {
                        if (this.checked) { entry.selectedSet.add(meterName); }
                        else { entry.selectedSet.delete(meterName); }
                        entry.updateFn();
                    }
                });

                filterContainer.appendChild(label);
            });

            // After rendering checkboxes, ensure the chart reflects current selection.
            // This handles the case where the meter was already set (from init) but the
            // chart hasn't been updated yet because data loaded while this slide was inactive.
            if (entry.radio && entry.getSelected && entry.getSelected()) {
                entry.updateFn();
            }
        }
    }
}();

window.energyColdDashboard = energyColdDashboard;

$(document).ready(function () {
    console.log('✅ cold_liveEnergyConsumption.js loaded successfully');
    console.log('✅ energyColdDashboard object:', typeof energyColdDashboard);
});