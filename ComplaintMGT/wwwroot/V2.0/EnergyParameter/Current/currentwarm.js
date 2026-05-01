// ============================================================
//  CurrentWarm.js  –  Warm category Current dashboard
//  Only the two chart sections are warm-specific:
//    1. Average Current – Daily bar chart  (week-wise x-axis)
//    2. Actual Current  – Full-month line chart with date filter
//  All other sections (circles, pie, high/low, ops) reuse
//  the same helper functions from Current.js approach but call
//  the warm API endpoint (timeCategory=warm).
// ============================================================

// ── date/time helpers ──────────────────────────────────────
function formatDateTime(createDate) {
    if (!createDate) return { date: '-', time: '-' };
    try {
        const d = new Date(createDate);
        if (isNaN(d.getTime())) return { date: '-', time: '-' };
        const pad = n => String(n).padStart(2, '0');
        return {
            date: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
            time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
        };
    } catch (e) { return { date: '-', time: '-' }; }
}

function formatDate(date) {
    const pad = n => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// ── colour registry ────────────────────────────────────────
const _PALETTE = [
    '#2196F3', '#E53935', '#43A047', '#FB8C00', '#8E24AA',
    '#FFB300', '#F06292', '#6D4C41', '#7CB342', '#EA80FC',
    '#D81B60', '#546E7A', '#673AB7', '#00897B', '#3949AB',
    '#C0CA33', '#F4511E', '#4DB6AC', '#FF7043', '#9575CD',
];

const DeviceColors = (function () {
    const _map = new Map();
    let _nextIdx = 1;
    function _generate(idx) {
        const hue = (idx * 137.508) % 360;
        const sat = 55 + (idx % 4) * 8;
        const lit = 42 + (idx % 3) * 6;
        return 'hsl(' + hue.toFixed(1) + ',' + sat + '%,' + lit + '%)';
    }
    function get(name) {
        if (_map.has(name)) return _map.get(name);
        let colour;
        if ((name || '').trim().toLowerCase() === 'main meter') {
            colour = _PALETTE[0];
        } else {
            colour = _nextIdx < _PALETTE.length ? _PALETTE[_nextIdx] : _generate(_nextIdx);
            _nextIdx++;
        }
        _map.set(name, colour);
        return colour;
    }
    function registerAll(names) {
        const sorted = [...names].sort(function (a, b) {
            if ((a || '').trim().toLowerCase() === 'main meter') return -1;
            if ((b || '').trim().toLowerCase() === 'main meter') return 1;
            return a.localeCompare(b);
        });
        sorted.forEach(function (n) { get(n); });
    }
    return { get, registerAll };
})();

function isMainMeter(name) {
    return (name || '').trim().toLowerCase() === 'main meter';
}

function showState(gridId, state, msg) {
    const el = document.getElementById(gridId);
    if (!el) return;
    const c = { loading: '#888', error: '#f44336', nodata: '#888', nodevice: '#1565c0', nodevicedata: '#888' };
    el.innerHTML = `<div style="width:100%;text-align:center;padding:24px 0;font-size:15px;color:${c[state] || '#888'};font-weight:600;">${msg}</div>`;
}

async function fetchWithRetry(url, retries = 3, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            let data = await res.json();
            if (typeof data === 'string') data = JSON.parse(data);
            if (data && data.Table) data = data.Table;
            if (!Array.isArray(data)) data = data ? [data] : [];
            return data;
        } catch (e) {
            console.warn(`Fetch attempt ${i + 1}/${retries} failed:`, e.message);
            if (i === retries - 1) throw e;
            await new Promise(r => setTimeout(r, delay * (i + 1)));
        }
    }
}

// ── helpers shared by circles + pie ────────────────────────
function _buildCircleElement(device, tooltipRows) {
    const box = document.createElement('div');
    box.className = 'circle-box' + (device.isMainMeter ? ' main-meter' : '');
    box.setAttribute('data-label', device.name);
    box.style.position = 'relative';
    DeviceColors.get(device.name); 
    box.style.backgroundColor = '#A9D4FB';
    box.style.color = '#222';
    if (device.isMainMeter) { box.style.border = '3px solid #222'; box.style.fontWeight = 'bold'; }
    const txt = document.createElement('div');
    txt.style.cssText = 'position:relative;z-index:1;text-align:center;line-height:1.2;';
    txt.innerHTML = `<span style="font-size:1rem;font-weight:bold;">${device.TotalCurrent}</span>`;
    const tip = document.createElement('div');
    tip.className = 'Current-tooltip';
    const tipContent = document.createElement('div');
    tipContent.className = 'Current-tooltip-content';
    tooltipRows.forEach(r => {
        const row = document.createElement('div');
        row.className = 'Current-tooltip-row';
        row.innerHTML = `<span class="Current-tooltip-label">${r.label}</span><span class="Current-tooltip-value">${r.value}</span>`;
        tipContent.appendChild(row);
    });
    tip.appendChild(tipContent);
    box.appendChild(txt);
    box.appendChild(tip);
    return box;
}

function createCurrentCircleElement(device) {
    return _buildCircleElement(device, [
        { label: 'Device ID', value: device.deviceID || '-' },
        { label: 'R Phase', value: (device.r_Current || '-') + ' A' },
        { label: 'Y Phase', value: (device.y_Current || '-') + ' A' },
        { label: 'B Phase', value: (device.b_Current || '-') + ' A' },
        { label: 'Date', value: device.date || '-' },
        { label: 'Time', value: device.time || '-' },
    ]);
}

function createAvgCurrentCircleElement(device) {
    return _buildCircleElement(device, [
        { label: 'Device ID', value: device.deviceID || '-' },
        { label: 'Count', value: device.count !== undefined ? device.count : '-' },
        { label: 'R Phase', value: (device.r_Current || '-') + ' A' },
        { label: 'Y Phase', value: (device.y_Current || '-') + ' A' },
        { label: 'B Phase', value: (device.b_Current || '-') + ' A' },
        { label: 'Date', value: device.date || '-' },
    ]);
}

function normaliseRow(row) {
    const rawDate = row.Date || row.CreateDate || row.createDate || row.Timestamp || row.DateTime || '';
    const { date, time } = rawDate ? formatDateTime(rawDate) : { date: '-', time: '-' };
    const name = row.Devicename || row.DeviceName || 'Unknown';
    const deviceID = row.DeviceID || '-';
    return {
        TotalCurrent: row.TotalCurrent !== undefined ? parseFloat(row.TotalCurrent).toFixed(2) : '-',
        r_Current: row.R_Current !== undefined ? parseFloat(row.R_Current).toFixed(2) : '-',
        y_Current: row.Y_Current !== undefined ? parseFloat(row.Y_Current).toFixed(2) : '-',
        b_Current: row.B_Current !== undefined ? parseFloat(row.B_Current).toFixed(2) : '-',
        count: row.Count !== undefined ? row.Count : '-',
        name, deviceID, isMainMeter: isMainMeter(name), date, time
    };
}

function renderCurrentCircles(devices) {
    const g1 = document.getElementById('Current-grid-1');
    const g2 = document.getElementById('Current-grid-2');
    if (!g1) return;
    g1.innerHTML = ''; if (g2) g2.innerHTML = '';
    devices.slice(0, 7).forEach(d => g1.appendChild(createCurrentCircleElement(d)));
    if (g2 && devices.length > 7) devices.slice(7).forEach(d => g2.appendChild(createCurrentCircleElement(d)));
}

function renderHighCurrentCircles(devices) {
    const grid = document.getElementById('high-Current-grid');
    const msg = document.getElementById('no-high-Current-message');
    if (!grid) return;
    grid.innerHTML = '';
    if (!devices.length) { grid.style.display = 'none'; if (msg) { msg.style.display = 'block'; msg.textContent = 'No data available'; } return; }
    grid.style.display = 'flex'; if (msg) msg.style.display = 'none';
    devices.forEach(d => grid.appendChild(createAvgCurrentCircleElement(d)));
}

function renderLowCurrentCircles(devices) {
    const grid = document.getElementById('low-Current-grid');
    const msg = document.getElementById('no-low-Current-message');
    if (!grid) return;
    grid.innerHTML = '';
    if (!devices.length) { grid.style.display = 'none'; if (msg) { msg.style.display = 'block'; msg.textContent = 'No data available'; } return; }
    grid.style.display = 'flex'; if (msg) msg.style.display = 'none';
    devices.forEach(d => grid.appendChild(createAvgCurrentCircleElement(d)));
}

function renderCurrentDistributionPie(allDevices) {
    const dom = document.getElementById('pie_graph');
    if (!dom) return;
    DeviceColors.registerAll(allDevices.map(d => d.name));
    const pieData = allDevices.map(d => ({ name: d.name, value: parseFloat(d.TotalCurrent) || 0 })).filter(i => i.value > 0);
    const chart = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });
    if (!pieData.length) {
        chart.setOption({ title: { text: 'No data available', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 16 } } });
        return;
    }
    const devMap = {};
    allDevices.forEach(d => devMap[d.name] = d.deviceID);
    const pieColors = pieData.map(d => DeviceColors.get(d.name));
    chart.setOption({
        color: pieColors,
        tooltip: {
            trigger: 'item', backgroundColor: 'rgba(0,0,0,0.88)', borderColor: 'transparent',
            textStyle: { color: '#fff', fontSize: 12 },
            formatter: p => `<div style="padding:4px 2px;"><div style="color:#A9D4FB;font-weight:bold;font-size:13px;margin-bottom:6px;">${p.name}</div><div style="color:#ccc;">Device ID: <strong style="color:#fff;">${devMap[p.name] || '-'}</strong></div><div style="color:#ccc;margin-top:3px;">Current: <strong style="color:#81C784;">${p.value.toFixed(2)} A</strong></div><div style="color:#ccc;margin-top:3px;">Share: <strong style="color:#A9D4FB;">${p.percent.toFixed(2)}%</strong></div></div>`
        },
        legend: { orient: 'horizontal', bottom: 0, left: 10, right: 36, type: 'scroll', textStyle: { fontSize: 11, color: '#555' }, pageIconSize: 12, pageButtonItemGap: 5, pageButtonGap: 8 },
        series: [{
            name: 'Current Distribution', type: 'pie', radius: ['0%', '68%'], center: ['50%', '44%'],
            data: pieData,
            label: { show: true, formatter: p => p.percent > 3 ? p.percent.toFixed(1) + '%' : '', fontSize: 12, color: '#333' },
            labelLine: { show: true, length: 12, length2: 12 },
            emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.4)' } }
        }]
    });
    window.addEventListener('resize', () => chart.resize());
}

// ── Ops Schedule ────────────────────────────────────────────
function fmtTime(t) { return t ? t.toString().substring(0, 5) : ''; }
let _opsRawRows = [];
let selOpsDevs = new Set();

function sortDevs(arr) {
    return arr.slice().sort((a, b) => {
        if ((a || '').trim().toLowerCase() === 'main meter') return -1;
        if ((b || '').trim().toLowerCase() === 'main meter') return 1;
        return a.localeCompare(b);
    });
}

function buildOpsScheduleSection(rows) {
    const container = document.getElementById('ops-schedule-grid');
    if (!container) return;
    container.innerHTML = '';
    if (!rows || !rows.length) { container.innerHTML = '<p style="color:#999;padding:20px;">No operation schedule data available.</p>'; return; }
    const allDeviceNames = sortDevs([...new Set(rows.map(r => r.Devicename || r.DeviceName || 'Unknown'))]);
    DeviceColors.registerAll(allDeviceNames);
    const wrapper = document.getElementById('ops-device-filter-wrapper');
    const cbContainer = document.getElementById('ops-schedule-filter-checkboxes');
    if (wrapper && cbContainer && cbContainer.childElementCount === 0) {
        wrapper.style.display = 'flex';
        if (allDeviceNames.includes('Main Meter')) selOpsDevs.add('Main Meter');
        else if (allDeviceNames.length) selOpsDevs.add(allDeviceNames[0]);
        allDeviceNames.forEach(name => {
            const lbl = document.createElement('label');
            const cb = document.createElement('input');
            cb.type = 'checkbox'; cb.value = name; cb.checked = selOpsDevs.has(name);
            cb.addEventListener('change', function () {
                this.checked ? selOpsDevs.add(name) : selOpsDevs.delete(name);
                renderOpsCards(_opsRawRows);
            });
            const col = DeviceColors.get(name);
            lbl.style.cssText = `border-left:4px solid ${col};padding-left:8px;`;
            lbl.appendChild(cb); lbl.appendChild(document.createTextNode(' ' + name));
            cbContainer.appendChild(lbl);
        });
    }
    renderOpsCards(rows);
}

function renderOpsCards(rows) {
    const container = document.getElementById('ops-schedule-grid');
    if (!container) return;
    container.innerHTML = '';
    const filtered = selOpsDevs.size ? rows.filter(r => selOpsDevs.has(r.Devicename || r.DeviceName || 'Unknown')) : rows;
    if (!filtered.length) { container.innerHTML = '<p style="color:#999;padding:20px;">No data for selected devices.</p>'; return; }
    const windowMap = {};
    filtered.forEach(row => {
        const win = row.SiteOperationWindow || 'Unknown';
        if (!windowMap[win]) windowMap[win] = { label: win, startTime: row.StartTime || '', endTime: row.EndTime || '', devices: [] };
        const name = row.Devicename || row.DeviceName || 'Unknown';
        windowMap[win].devices.push({
            name, deviceID: row.DeviceID || '-',
            TotalCurrent: row.TotalCurrent !== undefined ? parseFloat(row.TotalCurrent).toFixed(1) : '0.0',
            r_Current: row.R_Current !== undefined ? parseFloat(row.R_Current).toFixed(1) : '0.0',
            y_Current: row.Y_Current !== undefined ? parseFloat(row.Y_Current).toFixed(1) : '0.0',
            b_Current: row.B_Current !== undefined ? parseFloat(row.B_Current).toFixed(1) : '0.0',
            isMain: isMainMeter(name)
        });
    });
    Object.values(windowMap).sort((a, b) => a.startTime.localeCompare(b.startTime)).forEach(win => {
        const card = document.createElement('div'); card.className = 'ops-card';
        const hdr = document.createElement('div'); hdr.className = 'ops-card-header';
        const tit = document.createElement('div'); tit.className = 'ops-card-title'; tit.textContent = win.label;
        const tim = document.createElement('div'); tim.className = 'ops-card-time'; tim.textContent = fmtTime(win.startTime) + ' – ' + fmtTime(win.endTime);
        hdr.appendChild(tit); hdr.appendChild(tim); card.appendChild(hdr);
        const tilesRow = document.createElement('div'); tilesRow.className = 'ops-tiles-row';
        win.devices.forEach(dev => {
            const tile = document.createElement('div');
            tile.className = 'ops-device-tile' + (dev.isMain ? ' ops-main-meter' : '');
            tile.title = `Device ID: ${dev.deviceID}  |  R: ${dev.r_Current} A  |  Y: ${dev.y_Current} A  |  B: ${dev.b_Current} A`;
            const dn = document.createElement('div'); dn.className = 'ops-device-name'; dn.textContent = dev.name;
            const dp = document.createElement('div'); dp.className = 'ops-device-Current'; dp.textContent = dev.TotalCurrent + ' A';
            dp.style.color = '#1a237e';
            tile.appendChild(dn); tile.appendChild(dp); tilesRow.appendChild(tile);
        });
        card.appendChild(tilesRow); container.appendChild(card);
    });
}

// ── chart helpers ──────────────────────────────────────────
function chartState(elId, state, msg) {
    const el = typeof elId === 'string' ? document.getElementById(elId) : elId; if (!el) return;
    const c = echarts.getInstanceByDom(el) || echarts.init(el);
    const cols = { loading: '#888', error: '#f44336', nodata: '#888', nodevice: '#1565c0', nodevicedata: '#888' };
    c.setOption({ title: { text: msg, left: 'center', top: 'center', textStyle: { color: cols[state] || '#888', fontSize: 15, fontWeight: state === 'error' ? 'bold' : 'normal' } }, xAxis: { show: false }, yAxis: { show: false }, series: [] }, true);
}

function buildCheckboxes(containerId, names, selSet, onChangeFn) {
    const c = document.getElementById(containerId); if (!c) return; c.innerHTML = '';
    sortDevs(names).forEach(name => {
        const lbl = document.createElement('label'), cb = document.createElement('input');
        cb.type = 'checkbox'; cb.value = name; cb.checked = (name === 'Main Meter'); if (cb.checked) selSet.add(name);
        cb.addEventListener('change', function () { this.checked ? selSet.add(name) : selSet.delete(name); onChangeFn(); });
        const col = DeviceColors.get(name); lbl.style.cssText = `border-left:4px solid ${col};padding-left:8px;`;
        lbl.appendChild(cb); lbl.appendChild(document.createTextNode(' ' + name)); c.appendChild(lbl);
    });
}

// ============================================================
//  1. AVERAGE Current – DAILY BAR CHART  (week-wise x-axis)
// ============================================================
let barCurrentData = [];
let selBarDevs = new Set();

function processBarData(data) {
    return data.map(row => {
        const rd = row.ReadingDate ? new Date(row.ReadingDate) : null;
        const dateLabel = rd
            ? rd.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
            : 'N/A';
        const fullDate = rd
            ? rd.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'N/A';
        const weekNo = row.WeekNo !== undefined ? parseInt(row.WeekNo) : 0;
        return {
            dateLabel,
            fullDate,
            readingDate: rd,
            weekNo,
            xKey: `Week ${weekNo} – ${dateLabel}`,
            TotalCurrent: row.TotalCurrent !== undefined ? parseFloat(row.TotalCurrent).toFixed(2) : '0.00',
            r_Current: row.R_Current !== undefined ? parseFloat(row.R_Current).toFixed(2) : '-',
            y_Current: row.Y_Current !== undefined ? parseFloat(row.Y_Current).toFixed(2) : '-',
            b_Current: row.B_Current !== undefined ? parseFloat(row.B_Current).toFixed(2) : '-',
            deviceName: row.Devicename || row.DeviceName || 'Unknown',
            deviceId: row.DeviceID || '-',
        };
    });
}

function updateBarChart() {
    const el = document.getElementById('chart-avg-Current'); if (!el) return;
    if (!selBarDevs.size) { chartState(el, 'nodevice', 'Please select a device'); return; }

    const f = barCurrentData.filter(r => selBarDevs.has(r.deviceName));
    if (!f.length) { chartState(el, 'nodevicedata', 'No data for the selected devices'); return; }

    // Sort by date ascending
    const sorted = f.slice().sort((a, b) => (a.readingDate || 0) - (b.readingDate || 0));

    // Group dates by week
    const datesByWeek = {};
    sorted.forEach(r => {
        if (!datesByWeek[r.weekNo]) datesByWeek[r.weekNo] = new Set();
        datesByWeek[r.weekNo].add(r.fullDate);
    });

    const xLabels = [];
    const weekAxisData = [];
    const groups = {};

    // Build X Axis labels, Week labels, and Spacers
    Object.keys(datesByWeek).forEach((weekNo, wIdx) => {
        const dates = Array.from(datesByWeek[weekNo]).sort((a, b) => new Date(a) - new Date(b));

        dates.forEach((date, dIdx) => {
            xLabels.push(date);

            // Place the week label exactly in the middle date of the week group
            if (dIdx === Math.floor(dates.length / 2)) {
                weekAxisData.push(`Week ${weekNo}`);
            } else {
                weekAxisData.push('');
            }

            // Populate data mapping
            sorted.forEach(r => {
                if (r.fullDate === date && r.weekNo == weekNo) {
                    if (!groups[r.deviceName]) groups[r.deviceName] = {};
                    groups[r.deviceName][date] = r;
                }
            });
        });

        // Inject an empty spacer column after each week (except the last one) to create the visual gap
        if (wIdx < Object.keys(datesByWeek).length - 1) {
            xLabels.push(`spacer_${weekNo}`);
            weekAxisData.push('');
        }
    });

    const series = Object.keys(groups).filter(name => selBarDevs.has(name)).map(name => {
        const g = groups[name];
        return {
            name, type: 'bar', barGap: '5%', barMaxWidth: 28,
            itemStyle: { borderRadius: [4, 4, 0, 0], color: DeviceColors.get(name) },
            data: xLabels.map(lbl => {
                if (lbl.startsWith('spacer_')) return null; // Returns empty slot for the spacer
                const rd = g[lbl];
                return rd ? { value: parseFloat(rd.TotalCurrent), rowData: rd } : null;
            })
        };
    });

    const c = echarts.getInstanceByDom(el) || echarts.init(el);
    c.setOption({
        tooltip: {
            trigger: 'item',
            formatter(p) {
                if (!p.data?.rowData) return '';
                const r = p.data.rowData;
                return `<div style="background:rgba(0,0,0,.9);border-radius:8px;padding:12px;min-width:210px;">
                    <div style="color:#66BB6A;font-weight:bold;margin-bottom:8px;">Week ${r.weekNo} – ${r.deviceName}</div>
                    <div style="color:#A9D4FB"><strong>Device ID:</strong> <span style="color:#fff">${r.deviceId}</span></div>
                    <div style="color:#A9D4FB;margin-top:4px"><strong>Date:</strong> <span style="color:#fff">${r.fullDate}</span></div>
                    <div style="color:#A9D4FB;margin-top:4px"><strong>Current:</strong> <span style="color:#81C784;font-size:15px;font-weight:bold">${r.TotalCurrent} A</span></div>
                    <div style="border-top:1px solid #444;margin-top:6px;padding-top:6px;">
                        <div style="color:#EF9A9A;margin-top:2px"><strong>R Phase:</strong> <span style="color:#fff">${r.r_Current} A</span></div>
                        <div style="color:#FFF176;margin-top:2px"><strong>Y Phase:</strong> <span style="color:#fff">${r.y_Current} A</span></div>
                        <div style="color:#90CAF9;margin-top:2px"><strong>B Phase:</strong> <span style="color:#fff">${r.b_Current} A</span></div>
                    </div></div>`;
            },
            backgroundColor: 'transparent', borderColor: 'transparent', confine: true
        },
        grid: { left: 55, right: 30, top: 30, bottom: 65, containLabel: true },
        xAxis: [
            {
                type: 'category',
                data: xLabels,
                axisLabel: {
                    interval: 0,
                    fontSize: 10,
                    color: '#666',
                    formatter: (val) => val.startsWith('spacer_') ? '' : val.split(' ').slice(0, 2).join(' ')
                },
                axisTick: { alignWithLabel: true }
            },
            {
                type: 'category',
                data: weekAxisData,
                position: 'bottom',
                offset: 25,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { fontSize: 13, fontWeight: 'bold', color: '#444' }
            }
        ],
        yAxis: { type: 'value', name: 'A', axisLabel: { fontSize: 11, color: '#666' } },
        series
    }, true);
}

async function initBarChart() {
    const el = document.getElementById('chart-avg-Current'); if (!el) return;
    echarts.init(el); chartState(el, 'loading', '⏳ Loading...');
    try {
        const data = await fetchWithRetry(`/EnergyParameter/GetAllmeter_AvgCurrent_bargraph?timeCategory=warm`);
        if (!data.length) { chartState(el, 'nodata', 'No data available'); return; }
        barCurrentData = processBarData(data);
        const names = sortDevs([...new Set(barCurrentData.map(r => r.deviceName))]);
        DeviceColors.registerAll(names);
        buildCheckboxes('Current-bar-filter-checkboxes', names, selBarDevs, updateBarChart);
        updateBarChart();
    } catch (e) { chartState(el, 'error', '⚠️ Error fetching data'); }
    window.addEventListener('resize', () => echarts.getInstanceByDom(el)?.resize());
}

// ============================================================
//  2. ACTUAL Current – FULL MONTH LINE CHART  (date filter)
// ============================================================
let actualCurrentData = [];
let selTodayDevs = new Set();
let warmSelectedDate = null;

function parseActualTime(row) {
    if (row.Date && row.Time) return new Date(row.Date.split('T')[0] + 'T' + row.Time);
    return new Date(row.CreateDate || row.Timestamp || row.DateTime || '');
}

function toInputDate(d) {
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function lineTooltipWarm() {
    return {
        trigger: 'axis', axisPointer: { type: 'line' },
        formatter(params) {
            if (!params?.length) return '';
            const dateObj = new Date(params[0].value[0]);
            const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            let h = `<div style="background:rgba(0,0,0,.9);border-radius:8px;padding:14px;min-width:240px;">`;
            h += `<div style="color:#A9D4FB;font-weight:bold;margin-bottom:10px;text-align:center;font-size:13px;">${timeStr}</div>`;
            params.forEach(p => {
                const v = p.value[1];
                if (v == null) return;
                const devId = p.data?.deviceId;
                const r = p.data?.r_Current, y = p.data?.y_Current, b = p.data?.b_Current;
                h += `<div style="margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #444;">`;
                h += `<div style="color:${p.color};font-weight:bold;font-size:12px;margin-bottom:4px;">${p.seriesName}</div>`;
                h += `<div style="color:#81C784;font-weight:bold;font-size:14px;margin-bottom:4px;">${Number(v).toFixed(2)} A</div>`;
                if (devId) h += `<div style="color:#999;font-size:10px;margin-bottom:4px;">ID: ${devId}</div>`;
                if (r != null) h += `<div style="display:flex;gap:12px;margin-top:4px;font-size:11px;"><span style="color:#EF9A9A;">R: ${r} A</span><span style="color:#FFF176;">Y: ${y} A</span><span style="color:#90CAF9;">B: ${b} A</span></div>`;
                h += `</div>`;
            });
            return h + '</div>';
        },
        backgroundColor: 'transparent', borderColor: 'transparent'
    };
}

function buildActualLineSeries(sortedRows) {
    const groups = {};
    sortedRows.forEach(d => {
        const n = d.Devicename || d.DeviceName || 'Unknown';
        if (!groups[n]) groups[n] = [];
        groups[n].push(d);
    });

    return Object.keys(groups).map(name => {
        const data = groups[name].map(d => {
            const t = parseActualTime(d);
            return {
                name: t.getTime(),
                value: [
                    t,
                    parseFloat(d.TotalCurrent || 0)
                ],
                deviceId: d.DeviceID || '-',
                r_Current: d.R_Current !== undefined ? parseFloat(d.R_Current).toFixed(2) : '-',
                y_Current: d.Y_Current !== undefined ? parseFloat(d.Y_Current).toFixed(2) : '-',
                b_Current: d.B_Current !== undefined ? parseFloat(d.B_Current).toFixed(2) : '-'
            };
        });

        return {
            name,
            type: 'line',
            smooth: true,
            showSymbol: false,
            symbolSize: 4,
            symbol: 'circle',
            lineStyle: { width: 2, color: DeviceColors.get(name) },
            itemStyle: { color: DeviceColors.get(name) },
            data
        };
    });
}

function updateActualChart() {
    const el = document.getElementById('chart-today-Current'); if (!el) return;
    if (!selTodayDevs.size) { chartState(el, 'nodevice', 'Please select a device'); return; }

    let f = actualCurrentData.filter(r => selTodayDevs.has(r.Devicename || r.DeviceName || 'Unknown'));
    if (warmSelectedDate) {
        const selDateStr = toInputDate(warmSelectedDate);
        f = f.filter(r => {
            const t = parseActualTime(r);
            return !isNaN(t.getTime()) && toInputDate(t) === selDateStr;
        });
    }
    if (!f.length) { chartState(el, 'nodevicedata', 'No data for selected date / devices'); return; }

    const sorted = f.slice().sort((a, b) => parseActualTime(a) - parseActualTime(b));

    const c = echarts.getInstanceByDom(el) || echarts.init(el);
    c.setOption({
        tooltip: lineTooltipWarm(),
        grid: { left: 60, right: 40, top: 40, bottom: 28, containLabel: true },
        xAxis: {
            type: 'time',
            axisLabel: {
                show: true, fontSize: 10, color: '#999',
                formatter: '{HH}:{mm}:{ss}'
            },
            axisTick: { show: false },
            axisLine: { lineStyle: { color: '#ddd' } },
            splitLine: { show: false }
        },
        yAxis: { type: 'value', name: 'A', axisLabel: { fontSize: 12, color: '#666' }, splitLine: { lineStyle: { type: 'dashed', color: '#eee' } } },
        series: buildActualLineSeries(sorted),
        animation: false
    }, true);

    const footer = document.getElementById('actual-legend-footer');
    if (footer && warmSelectedDate) {
        footer.textContent = warmSelectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) + ' – Real-time Data';
    }
}

async function initActualChart() {
    const el = document.getElementById('chart-today-Current'); if (!el) return;
    echarts.init(el); chartState(el, 'loading', '⏳ Loading...');
    try {
        const data = await fetchWithRetry(`/EnergyParameter/GetAllmeter_ActualCurrent?timeCategory=warm`);
        if (!data.length) { chartState(el, 'nodata', 'No data available'); return; }
        actualCurrentData = data;

        const allDates = data.map(r => parseActualTime(r)).filter(d => !isNaN(d.getTime()));
        allDates.sort((a, b) => a - b);
        const firstDate = allDates[0];
        const lastDate = allDates[allDates.length - 1];

        const dateInput = document.getElementById('warm-date-filter');
        if (dateInput) {
            dateInput.min = toInputDate(firstDate);
            dateInput.max = toInputDate(lastDate);
            dateInput.value = toInputDate(firstDate);
            warmSelectedDate = firstDate;

            dateInput.addEventListener('change', () => {
                const [y, m, d] = dateInput.value.split('-').map(Number);
                warmSelectedDate = new Date(y, m - 1, d);
                updateActualChart();
            });
        } else {
            warmSelectedDate = firstDate;
        }

        const names = sortDevs([...new Set(data.map(d => d.Devicename || d.DeviceName || 'Unknown'))]);
        DeviceColors.registerAll(names);
        buildCheckboxes('Current-today-filter-checkboxes', names, selTodayDevs, updateActualChart);
        updateActualChart();
    } catch (e) { chartState(el, 'error', '⚠️ Error fetching data'); }
    window.addEventListener('resize', () => echarts.getInstanceByDom(el)?.resize());
}

// ============================================================
//  MAIN FETCHES
// ============================================================

(async function initCurrentRealtime() {
    showState('Current-grid-1', 'loading', '⏳ Loading...');
    const piedom = document.getElementById('pie_graph');
    if (piedom) piedom.innerHTML = '<div style="text-align:center;padding:30px;color:#888;">⏳ Loading...</div>';
    try {
        const data1 = await fetchWithRetry('/EnergyParameter/GetAllMeters_LastUpdatedCurrent_piegraph');
        if (!data1.length) {
            if (piedom) piedom.innerHTML = '<div style="text-align:center;padding:30px;color:#888;">No data available</div>';
            return;
        }
        const data = await fetchWithRetry('/EnergyParameter/GetAllMeters_LastUpdated_Current');
        if (!data.length) {
            showState('Current-grid-1', 'nodata', 'No data available');
            return;
        }
        const all = data.map(normaliseRow);
        DeviceColors.registerAll(all.map(d => d.name));
        const all1 = data1.map(normaliseRow);
        DeviceColors.registerAll(all1.map(d => d.name));
        renderCurrentCircles(all);
        renderCurrentDistributionPie(all1);
    } catch (err) {
        showState('Current-grid-1', 'error', '⚠️ Error fetching data');
        if (piedom) piedom.innerHTML = '<div style="text-align:center;padding:30px;color:#f44336;">⚠️ Error fetching data</div>';
    }
})();

(async function initHighLowCurrent() {
    ['high-Current-grid', 'low-Current-grid'].forEach(id => showState(id, 'loading', '⏳ Loading...'));
    try {
        const data = await fetchWithRetry('/EnergyParameter/GetAllmeter_AvgCurrent?timeCategory=warm');
        if (!data.length) { ['high-Current-grid', 'low-Current-grid'].forEach(id => showState(id, 'nodata', 'No data available')); return; }
        const all = data.map(normaliseRow);
        DeviceColors.registerAll(all.map(d => d.name));
        const sorted = all.slice().sort((a, b) => parseFloat(b.TotalCurrent) - parseFloat(a.TotalCurrent));
        const mid = Math.ceil(sorted.length / 2);
        renderHighCurrentCircles(sorted.slice(0, mid));
        renderLowCurrentCircles(sorted.slice(mid));
    } catch (err) { ['high-Current-grid', 'low-Current-grid'].forEach(id => showState(id, 'error', '⚠️ Error fetching data')); }
})();

(async function initOpsSchedule() {
    showState('ops-schedule-grid', 'loading', '⏳ Loading...');
    try {
        const data = await fetchWithRetry('/EnergyParameter/GetAllMeters_AvgCurrent_Operationwise?timeCategory=warm');
        if (!data.length) { showState('ops-schedule-grid', 'nodata', 'No data available'); return; }
        _opsRawRows = data;
        buildOpsScheduleSection(data);
    } catch (err) { showState('ops-schedule-grid', 'error', '⚠️ Error fetching data'); }
})();

document.addEventListener('DOMContentLoaded', function () {
    // Inject dynamic month script for headings
    const currentMonthYear = new Date().toLocaleString('en-GB', { month: 'long', year: 'numeric' });
    document.querySelectorAll('.dynamic-month-year').forEach(el => {
        el.textContent = currentMonthYear;
    });

    Promise.all([initBarChart(), initActualChart()])
        .catch(e => console.error('Chart init error:', e));
});