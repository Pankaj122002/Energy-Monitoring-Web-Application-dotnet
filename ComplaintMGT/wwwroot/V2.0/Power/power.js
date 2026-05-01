// ============================================================
//  Power Dashboard  – power.js
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

function getDayRange(daysAgo) {
    const t = new Date(); t.setDate(t.getDate() - daysAgo);
    const s = new Date(t); s.setHours(0, 0, 0, 0);
    const e = new Date(t); e.setHours(23, 59, 59, 999);
    return { from: formatDate(s), to: formatDate(e) };
}

// ============================================================
//  UNIFIED DEVICE COLOUR REGISTRY
//  Single source of truth for every device colour on the page.
//  Main Meter always gets index 0.  Every new device name gets
//  the next slot automatically.  First 20 slots are hand-picked
//  distinct colours; beyond that, golden-angle HSL ensures any
//  future device always gets a visually unique hue.
// ============================================================
const _PALETTE = [
    '#2196F3', // 0  - Main Meter (blue)
    '#E53935', // 1  - red
    '#43A047', // 2  - green
    '#FB8C00', // 3  - orange
    '#8E24AA', // 4  - purple
    '#FFB300', // 5  - amber
    '#F06292', // 6  - light pink
    '#6D4C41', // 7  - light blue
    '#7CB342', // 8  - light green
    '#EA80FC', // 9  - light purple
    '#D81B60', // 10 - pink
    '#546E7A', // 11 - blue-grey
    '#673AB7', // 12 - deep purple
    '#00897B', // 13 - teal
    '#3949AB', // 14 - indigo
    '#C0CA33', // 15 - lime
    '#F4511E', // 16 - light pink
    '#4DB6AC', // 17 - light teal
    '#FF7043', // 18 - deep orange light
    '#9575CD', // 19 - deep purple light
];

const DeviceColors = (function () {
    const _map = new Map();
    let _nextIdx = 1; // index 0 reserved for Main Meter

    function _generate(idx) {
        // golden-angle rotation guarantees maximum hue separation
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

    // Register a batch up-front to lock in stable ordering
    function registerAll(names) {
        const sorted = [...names].sort(function (a, b) {
            if ((a || '').trim().toLowerCase() === 'main meter') return -1;
            if ((b || '').trim().toLowerCase() === 'main meter') return 1;
            return a.localeCompare(b);
        });
        sorted.forEach(function (n) { get(n); });
    }

    return { get: get, registerAll: registerAll };
})();

// ── Main Meter detection – by Devicname, NOT DeviceID ──────
function isMainMeter(Devicename) {
    return (Devicename || '').trim().toLowerCase() === 'main meter';
}

// ── section state helper ───────────────────────────────────
function showState(gridId, state, msg) {
    const el = document.getElementById(gridId);
    if (!el) return;
    const c = { loading: '#888', error: '#f44336', nodata: '#888', nodevice: '#1565c0', nodevicedata: '#888' };
    el.innerHTML = `<div style="width:100%;text-align:center;padding:24px 0;font-size:15px;color:${c[state] || '#888'};font-weight:600;">${msg}</div>`;
}

// ── retry fetch ────────────────────────────────────────────
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

// ============================================================
//  CIRCLE CREATION
// ============================================================
// ── shared circle builder; tooltipRows controls what is shown ─
function _buildCircleElement(device, tooltipRows) {
    const box = document.createElement('div');
    box.className = 'circle-box' + (device.isMainMeter ? ' main-meter' : '');
    box.setAttribute('data-label', device.name);
    box.style.position = 'relative';
    DeviceColors.get(device.name); // ensure colour registered
    box.style.backgroundColor = '#FFE082';
    box.style.color = '#222';
    if (device.isMainMeter) { box.style.border = '3px solid #222'; box.style.fontWeight = 'bold'; }

    const txt = document.createElement('div');
    txt.style.cssText = 'position:relative;z-index:1;text-align:center;line-height:1.2;';
    txt.innerHTML = `<span style="font-size:1rem;font-weight:bold;">${device.power}</span>`;

    const tip = document.createElement('div');
    tip.className = 'power-tooltip';
    const tipContent = document.createElement('div');
    tipContent.className = 'power-tooltip-content';

    tooltipRows.forEach(r => {
        const row = document.createElement('div');
        row.className = 'power-tooltip-row';
        row.innerHTML = `<span class="power-tooltip-label">${r.label}</span><span class="power-tooltip-value">${r.value}</span>`;
        tipContent.appendChild(row);
    });

    tip.appendChild(tipContent);
    box.appendChild(txt);
    box.appendChild(tip);
    return box;
}

// Real-time section: LastUpdated API → show Time, NO Count
function createPowerCircleElement(device) {
    return _buildCircleElement(device, [
        { label: 'Device ID', value: device.deviceID || '-' },
        { label: 'R Phase', value: (device.r_power || '-') + ' W' },
        { label: 'Y Phase', value: (device.y_power || '-') + ' W' },
        { label: 'B Phase', value: (device.b_power || '-') + ' W' },
        { label: 'Date', value: device.date || '-' },
        { label: 'Time', value: device.time || '-' },
    ]);
}

// High / Low Power sections: AvgPower API → show Count, NO Time
function createAvgPowerCircleElement(device) {
    return _buildCircleElement(device, [
        { label: 'Device ID', value: device.deviceID || '-' },
        { label: 'Count', value: device.count !== undefined ? device.count : '-' },
        { label: 'R Phase', value: (device.r_power || '-') + ' W' },
        { label: 'Y Phase', value: (device.y_power || '-') + ' W' },
        { label: 'B Phase', value: (device.b_power || '-') + ' W' },
        { label: 'Date', value: device.date || '-' },
    ]);
}

function normaliseRow(row) {
    // GetAllmeter_AvgPower: Devicename, DeviceID, Count, Power, R_Power, Y_Power, B_Power, Date
    const rawDate = row.Date || row.CreateDate || row.createDate || row.Timestamp || row.DateTime || '';
    const { date, time } = rawDate ? formatDateTime(rawDate) : { date: '-', time: '-' };
    const name = row.Devicename || row.DeviceName || 'Unknown';
    const deviceID = row.DeviceID || '-';
    return {
        power: row.Power !== undefined ? parseFloat(row.Power).toFixed(2) : '-',
        r_power: row.R_Power !== undefined ? parseFloat(row.R_Power).toFixed(2) : '-',
        y_power: row.Y_Power !== undefined ? parseFloat(row.Y_Power).toFixed(2) : '-',
        b_power: row.B_Power !== undefined ? parseFloat(row.B_Power).toFixed(2) : '-',
        count: row.Count !== undefined ? row.Count : '-',
        name, deviceID, isMainMeter: isMainMeter(name), date, time
    };
}

// ============================================================
//  RENDER REAL-TIME CIRCLES
// ============================================================
function renderPowerCircles(devices) {
    const g1 = document.getElementById('power-grid-1');
    const g2 = document.getElementById('power-grid-2');
    if (!g1) return;
    g1.innerHTML = ''; if (g2) g2.innerHTML = '';
    devices.slice(0, 7).forEach(d => g1.appendChild(createPowerCircleElement(d)));
    if (g2 && devices.length > 7) devices.slice(7).forEach(d => g2.appendChild(createPowerCircleElement(d)));
}

function renderHighPowerCircles(devices) {
    const grid = document.getElementById('high-power-grid');
    const msg = document.getElementById('no-high-power-message');
    if (!grid) return;
    grid.innerHTML = '';
    if (!devices.length) { grid.style.display = 'none'; if (msg) { msg.style.display = 'block'; msg.textContent = 'No data available'; } return; }
    grid.style.display = 'flex'; if (msg) msg.style.display = 'none';
    devices.forEach(d => grid.appendChild(createAvgPowerCircleElement(d)));
}

function renderLowPowerCircles(devices) {
    const grid = document.getElementById('low-power-grid');
    const msg = document.getElementById('no-low-power-message');
    if (!grid) return;
    grid.innerHTML = '';
    if (!devices.length) { grid.style.display = 'none'; if (msg) { msg.style.display = 'block'; msg.textContent = 'No data available'; } return; }
    grid.style.display = 'flex'; if (msg) msg.style.display = 'none';
    devices.forEach(d => grid.appendChild(createAvgPowerCircleElement(d)));
}

// ============================================================
//  PIE CHART – includes Main Meter, full legend names
// ============================================================
function renderPowerDistributionPie(allDevices) {
    const dom = document.getElementById('pie_graph');
    if (!dom) return;
    // Register all device names so colours are consistent with every other section
    DeviceColors.registerAll(allDevices.map(d => d.name));
    const pieData = allDevices.map(d => ({ name: d.name, value: parseFloat(d.power) || 0 })).filter(i => i.value > 0);
    const chart = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });
    if (!pieData.length) {
        chart.setOption({ title: { text: 'No data available', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 16 } } });
        return;
    }
    const devMap = {};
    allDevices.forEach(d => devMap[d.name] = d.deviceID);
    // Use DeviceColors so pie slices match circles, charts and checkboxes
    const pieColors = pieData.map(d => DeviceColors.get(d.name));

    chart.setOption({
        color: pieColors,
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0.88)',
            borderColor: 'transparent',
            textStyle: { color: '#fff', fontSize: 12 },
            formatter: p => `<div style="padding:4px 2px;"><div style="color:#FFE082;font-weight:bold;font-size:13px;margin-bottom:6px;">${p.name}</div><div style="color:#ccc;">Device ID: <strong style="color:#fff;">${devMap[p.name] || '-'}</strong></div><div style="color:#ccc;margin-top:3px;">Power: <strong style="color:#81C784;">${p.value.toFixed(2)} W</strong></div><div style="color:#ccc;margin-top:3px;">Share: <strong style="color:#FFE082;">${p.percent.toFixed(2)}%</strong></div></div>`
        },
        legend: {
            orient: 'horizontal', bottom: 0, left: 10, right: 36, type: 'scroll',
            formatter: name => name,
            textStyle: { fontSize: 11, color: '#555' }, pageIconSize: 12,
            pageButtonItemGap: 5,
            pageButtonGap: 8
        },
        series: [{
            name: 'Power Distribution', type: 'pie', radius: ['0%', '68%'], center: ['50%', '44%'],
            data: pieData,
            label: { show: true, formatter: p => p.percent > 3 ? p.percent.toFixed(1) + '%' : '', fontSize: 12, color: '#333' },
            labelLine: { show: true, length: 12, length2: 12 },
            emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.4)' } }
        }]
    });
    window.addEventListener('resize', () => chart.resize());
    const mb = document.querySelector('.menu_button');
    if (mb) mb.addEventListener('click', () => chart.resize());
}

// ============================================================
//  OPS SCHEDULE
// ============================================================
function fmtTime(t) { return t ? t.toString().substring(0, 5) : ''; }

// raw rows stored so filter re-renders without re-fetching
let _opsRawRows = [];
let selOpsDevs = new Set();

function buildOpsScheduleSection(rows) {
    const container = document.getElementById('ops-schedule-grid');
    if (!container) return;
    container.innerHTML = '';
    if (!rows || !rows.length) {
        container.innerHTML = '<p style="color:#999;padding:20px;">No operation schedule data available.</p>';
        return;
    }

    // Collect all unique device names from the raw data
    const allDeviceNames = sortDevs([...new Set(rows.map(r => r.Devicename || r.DeviceName || 'Unknown'))]);
    // Register so colours are consistent with all other sections
    DeviceColors.registerAll(allDeviceNames);

    // First call: build filter checkboxes and default to Main Meter
    const wrapper = document.getElementById('ops-device-filter-wrapper');
    const cbContainer = document.getElementById('ops-schedule-filter-checkboxes');
    if (wrapper && cbContainer && cbContainer.childElementCount === 0) {
        wrapper.style.display = 'flex';
        // Default: select Main Meter (or first device if no Main Meter)
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

    // Filter rows to only selected devices
    const filtered = selOpsDevs.size
        ? rows.filter(r => selOpsDevs.has(r.Devicename || r.DeviceName || 'Unknown'))
        : rows;

    if (!filtered.length) {
        container.innerHTML = '<p style="color:#999;padding:20px;">No data for selected devices.</p>';
        return;
    }

    const windowMap = {};
    filtered.forEach(row => {
        const win = row.SiteOperationWindow || 'Unknown';
        if (!windowMap[win]) windowMap[win] = { label: win, startTime: row.StartTime || '', endTime: row.EndTime || '', devices: [] };
        const name = row.Devicename || row.DeviceName || 'Unknown';   // display name
        const deviceID = row.DeviceID || '-';                          // unique ID for tooltip
        windowMap[win].devices.push({
            name, deviceID,
            power: row.Power !== undefined ? parseFloat(row.Power).toFixed(1) : '0.0',
            r_power: row.R_Power !== undefined ? parseFloat(row.R_Power).toFixed(1) : '0.0',
            y_power: row.Y_Power !== undefined ? parseFloat(row.Y_Power).toFixed(1) : '0.0',
            b_power: row.B_Power !== undefined ? parseFloat(row.B_Power).toFixed(1) : '0.0',
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
            // tooltip shows DeviceID + phase breakdown
            tile.title = `Device ID: ${dev.deviceID}  |  R: ${dev.r_power} W  |  Y: ${dev.y_power} W  |  B: ${dev.b_power} W`;
            const dn = document.createElement('div'); dn.className = 'ops-device-name'; dn.textContent = dev.name;
            const dp = document.createElement('div'); dp.className = 'ops-device-power'; dp.textContent = dev.power + ' W';
            dp.style.color = '#1a237e';
            tile.appendChild(dn); tile.appendChild(dp); tilesRow.appendChild(tile);
        });
        card.appendChild(tilesRow); container.appendChild(card);
    });
}

// ============================================================
//  MAIN FETCHES
// ============================================================

(async function initPowerRealtime() {
    showState('current-grid-1', 'loading', '⏳ Loading...');
    const piedom = document.getElementById('pie_graph');
    if (piedom) piedom.innerHTML = '<div style="text-align:center;padding:30px;color:#888;">⏳ Loading...</div>';
    try {
        const data1 = await fetchWithRetry('/EnergyParameter/GetAllMeters_LastUpdatedPower_piegraph'); // real-time data
        if (!data1.length) {
            showState('current-grid-1', 'nodata', 'No data available');
        }
        const data = await fetchWithRetry('/EnergyParameter/GetAllMeters_LastUpdated_Power');
        if (!data.length) {
            if (piedom) piedom.innerHTML = '<div style="text-align:center;padding:30px;color:#888;">No data available</div>';
            return;
        }
        const all = data.map(normaliseRow);
        DeviceColors.registerAll(all.map(d => d.name));
        const all1 = data1.map(normaliseRow);
        DeviceColors.registerAll(all1.map(d => d.name));
        renderPowerCircles(all);
        renderPowerDistributionPie(all1);
    } catch (err) {
        showState('current-grid-1', 'error', '⚠️ Error fetching data');
        if (piedom) piedom.innerHTML = '<div style="text-align:center;padding:30px;color:#f44336;">⚠️ Error fetching data</div>';
    }
})();

// High & Low sections use GetAllmeter_AvgPower — sorted by Power desc
(async function initHighLowPower() {
    ['high-power-grid', 'low-power-grid'].forEach(id => showState(id, 'loading', '⏳ Loading...'));
    try {
        const data = await fetchWithRetry('/EnergyParameter/GetAllmeter_AvgPower?timeCategory=hot');
        if (!data.length) {
            ['high-power-grid', 'low-power-grid'].forEach(id => showState(id, 'nodata', 'No data available'));
            return;
        }
        const all = data.map(normaliseRow);
        DeviceColors.registerAll(all.map(d => d.name));
        const sorted = all.slice().sort((a, b) => parseFloat(b.power) - parseFloat(a.power));
        const mid = Math.ceil(sorted.length / 2);
        renderHighPowerCircles(sorted.slice(0, mid));
        renderLowPowerCircles(sorted.slice(mid));
    } catch (err) {
        ['high-power-grid', 'low-power-grid'].forEach(id => showState(id, 'error', '⚠️ Error fetching data'));
    }
})();

(async function initOpsSchedule() {
    showState('ops-schedule-grid', 'loading', '⏳ Loading...');
    try {
        const data = await fetchWithRetry('/EnergyParameter/GetAllMeters_AvgPower_Operationwise?timeCategory=hot');
        if (!data.length) { showState('ops-schedule-grid', 'nodata', 'No data available'); return; }
        _opsRawRows = data;   // store for filter re-renders
        buildOpsScheduleSection(data);
    } catch (err) { showState('ops-schedule-grid', 'error', '⚠️ Error fetching data'); }
})();

// ============================================================
//  POWER CHART SECTIONS
// ============================================================
let barPowerData = [], hourlyPowerData = [], todayPowerData = [];
let selBarDevs = new Set(), selHourlyDevs = new Set(), selTodayDevs = new Set();
let selHour = null;

// sortDevs: Main Meter always first, rest alphabetical
function sortDevs(arr) { return arr.slice().sort((a, b) => { if ((a || '').trim().toLowerCase() === 'main meter') return -1; if ((b || '').trim().toLowerCase() === 'main meter') return 1; return a.localeCompare(b); }); }

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

function chartState(elId, state, msg) {
    const el = typeof elId === 'string' ? document.getElementById(elId) : elId; if (!el) return;
    const c = echarts.getInstanceByDom(el) || echarts.init(el);
    const cols = { loading: '#888', error: '#f44336', nodata: '#888', nodevice: '#1565c0', nodevicedata: '#888' };
    c.setOption({ title: { text: msg, left: 'center', top: 'center', textStyle: { color: cols[state] || '#888', fontSize: 15, fontWeight: state === 'error' ? 'bold' : 'normal' } }, xAxis: { show: false }, yAxis: { show: false }, series: [] }, true);
}

// ── BAR CHART ─────────────────────────────────────────────
function processBarData(data) {
    return data.map(row => ({
        date: row.ReadingDate ? new Date(row.ReadingDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
        readingDate: row.ReadingDate,
        // ReadingHour from API is 0-based; display as ReadingHour+1
        hourDisplay: (row.ReadingHour !== undefined ? parseInt(row.ReadingHour) : 0) + 1,
        // Bars driven by Power column only
        avgPower: row.Power !== undefined ? parseFloat(row.Power).toFixed(2) : '0.00',
        // R/Y/B stored for tooltip only
        r_power: row.R_Power !== undefined ? parseFloat(row.R_Power).toFixed(2) : '-',
        y_power: row.Y_Power !== undefined ? parseFloat(row.Y_Power).toFixed(2) : '-',
        b_power: row.B_Power !== undefined ? parseFloat(row.B_Power).toFixed(2) : '-',
        deviceName: row.Devicename || row.DeviceName || 'Unknown',
        deviceId: row.DeviceID || '-'
    }));
}

function updateBarChart() {
    const el = document.getElementById('chart-avg-power'); if (!el) return;
    if (!selBarDevs.size) { chartState(el, 'nodevice', 'Please select a device'); return; }
    const f = barPowerData.filter(r => selBarDevs.has(r.deviceName));
    if (!f.length) { chartState(el, 'nodevicedata', 'No data for the selected devices'); return; }
    const hours = [...new Set(f.map(r => r.hourDisplay))].sort((a, b) => a - b);
    const groups = {}; f.forEach(r => { if (!groups[r.deviceName]) groups[r.deviceName] = []; groups[r.deviceName].push(r); });
    const series = Object.keys(groups).map(name => ({
        name, type: 'bar', barGap: '10%',
        itemStyle: { borderRadius: [4, 4, 0, 0], color: DeviceColors.get(name) },
        data: hours.map(h => { const fd = groups[name].find(r => r.hourDisplay === h); return fd ? { value: parseFloat(fd.avgPower), rowData: fd } : null; })
    }));
    const c = echarts.getInstanceByDom(el) || echarts.init(el);
    c.setOption({
        tooltip: { trigger: 'item', formatter(p) { if (!p.data?.rowData) return ''; const r = p.data.rowData; return `<div style="background:rgba(0,0,0,.9);border-radius:8px;padding:12px;min-width:210px;"><div style="color:#66BB6A;font-weight:bold;margin-bottom:8px;">Hour ${r.hourDisplay} – ${r.deviceName}</div><div style="color:#FFE082"><strong>Device ID:</strong> <span style="color:#fff">${r.deviceId}</span></div><div style="color:#FFE082;margin-top:4px"><strong>Date:</strong> <span style="color:#fff">${r.date}</span></div><div style="color:#FFE082;margin-top:4px"><strong>Power:</strong> <span style="color:#81C784;font-size:15px;font-weight:bold">${r.avgPower} W</span></div><div style="border-top:1px solid #444;margin-top:6px;padding-top:6px;"><div style="color:#EF9A9A;margin-top:2px"><strong>R Phase:</strong> <span style="color:#fff">${r.r_power} W</span></div><div style="color:#FFF176;margin-top:2px"><strong>Y Phase:</strong> <span style="color:#fff">${r.y_power} W</span></div><div style="color:#90CAF9;margin-top:2px"><strong>B Phase:</strong> <span style="color:#fff">${r.b_power} W</span></div></div></div>`; }, backgroundColor: 'transparent', borderColor: 'transparent', confine: true },
        grid: { left: 55, right: 30, top: 50, bottom: 0, containLabel: true },
        xAxis: { type: 'category', data: hours, axisLabel: { interval: 0, fontSize: 11, color: '#666', fontWeight: 'bold' } },
        yAxis: { type: 'value', name: 'W', axisLabel: { fontSize: 11, color: '#666' } },
        series
    }, true);
}

async function initBarChart() {
    const el = document.getElementById('chart-avg-power'); if (!el) return;
    echarts.init(el); chartState(el, 'loading', '⏳ Loading...');
    const range = getDayRange(0);
    try {
        const data = await fetchWithRetry(`/EnergyParameter/GetAllmeter_AvgPower_bargraph?timeCategory=hot`);
        if (!data.length) { chartState(el, 'nodata', 'No data available'); return; }
        barPowerData = processBarData(data);
        const names = sortDevs([...new Set(barPowerData.map(r => r.deviceName))]);
        DeviceColors.registerAll(names); buildCheckboxes('power-bar-filter-checkboxes', names, selBarDevs, updateBarChart); updateBarChart();
    } catch (e) { chartState(el, 'error', '⚠️ Error fetching data'); }
    window.addEventListener('resize', () => echarts.getInstanceByDom(el)?.resize());
}

// ── HOURLY LINE CHART ─────────────────────────────────────
function getDayHours() {
    const cur = new Date().getHours();
    return Array.from({ length: cur + 1 }, (_, i) => ({ value: i, label: i.toString().padStart(2, '0') + ':00' }));
}

function renderHourFilter() {
    const container = document.getElementById('power-hourly-hour-filter'); if (!container) return;
    const sel = document.createElement('select');
    sel.style.cssText = 'padding:6px 10px;margin:0 10px;border:1px solid #ddd;border-radius:4px;font-size:14px;min-width:120px;cursor:pointer;';
    const curH = new Date().getHours();
    getDayHours().forEach(h => { const o = document.createElement('option'); o.value = h.value; o.textContent = h.label; if (h.value === curH) { o.selected = true; selHour = curH; } sel.appendChild(o); });
    sel.addEventListener('change', () => { selHour = parseInt(sel.value); updateHourlyChart(); });
    const lbl = document.createElement('label'); lbl.textContent = 'Filter by Hour: '; lbl.style.fontWeight = 'bold'; lbl.appendChild(sel);
    container.innerHTML = ''; container.appendChild(lbl);
}

// Each device gets its own x-axis via dataset; here we build independent series
// that don't rely on a shared timeMap index alignment.
// We use a single shared x-axis (union of all timestamps) but fall back to
// nearest-second matching (±500ms) so minor clock skew doesn't drop dots.
function buildLineSeries(sorted, timeMap) {
    const groups = {};
    sorted.forEach(d => {
        const n = d.Devicename || d.DeviceName || 'Unknown';
        if (!groups[n]) groups[n] = [];
        groups[n].push(d);
    });

    // Per-device: array of {ts, row} sorted ascending
    const groupArr = {};
    Object.keys(groups).forEach(name => {
        groupArr[name] = groups[name].map(d => {
            const rt = d.Date && d.Time
                ? d.Date.split('T')[0] + ' ' + d.Time
                : (d.CreateDate || d.Timestamp || d.DateTime || '');
            return { ts: new Date(rt).getTime(), d };
        }).sort((a, b) => a.ts - b.ts);
    });

    return Object.keys(groups).map(name => {
        const arr = groupArr[name];
        // Build a quick map for exact match; fallback to ±2 s nearest match
        const exactMap = new Map(arr.map(({ ts, d }) => [ts, d]));

        const data = timeMap.map(tp => {
            let m = exactMap.get(tp.ts);
            if (!m) {
                // nearest within ±2000 ms
                let best = null, bestDiff = Infinity;
                arr.forEach(({ ts, d }) => {
                    const diff = Math.abs(ts - tp.ts);
                    if (diff < bestDiff && diff <= 2000) { bestDiff = diff; best = d; }
                });
                m = best;
            }
            if (!m) return { value: '-', symbol: 'none' };
            return {
                value: parseFloat(m.Power || 0),
                deviceId: m.DeviceID || '-',
                r_power: m.R_Power !== undefined ? parseFloat(m.R_Power).toFixed(2) : '-',
                y_power: m.Y_Power !== undefined ? parseFloat(m.Y_Power).toFixed(2) : '-',
                b_power: m.B_Power !== undefined ? parseFloat(m.B_Power).toFixed(2) : '-',
            };
        });

        return {
            name, type: 'line', smooth: true,
            showSymbol: true, symbolSize: 5, symbol: 'circle',
            connectNulls: true,
            lineStyle: { width: 2, color: DeviceColors.get(name) },
            itemStyle: { color: DeviceColors.get(name) },
            data
        };
    });
}

function lineTooltip() {
    return {
        trigger: 'axis', axisPointer: { type: 'line' },
        formatter(params) {
            if (!params?.length) return '';
            // Show date + time on separate lines
            const nameParts = params[0].name ? params[0].name.split(' ') : [];
            let h = `<div style="background:rgba(0,0,0,.9);border-radius:8px;padding:14px;min-width:240px;">`;
            h += `<div style="color:#FFE082;font-weight:bold;margin-bottom:10px;text-align:center;font-size:13px;">${params[0].name}</div>`;
            params.forEach(p => {
                const v = typeof p.value === 'object' ? p.value?.value : p.value;
                if (v == null) return;
                const devId = p.data?.deviceId;
                const r = p.data?.r_power, y = p.data?.y_power, b = p.data?.b_power;
                h += `<div style="margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid #444;">`;
                // Device name on its own line
                h += `<div style="color:${p.color};font-weight:bold;font-size:12px;margin-bottom:4px;">${p.seriesName}</div>`;
                // Power value on next line
                h += `<div style="color:#81C784;font-weight:bold;font-size:14px;margin-bottom:4px;">${Number(v).toFixed(2)} W</div>`;
                if (devId) h += `<div style="color:#999;font-size:10px;margin-bottom:4px;">ID: ${devId}</div>`;
                if (r != null) h += `<div style="display:flex;gap:12px;margin-top:4px;font-size:11px;"><span style="color:#EF9A9A;">R: ${r} W</span><span style="color:#FFF176;">Y: ${y} W</span><span style="color:#90CAF9;">B: ${b} W</span></div>`;
                h += `</div>`;
            });
            return h + '</div>';
        },
        backgroundColor: 'transparent', borderColor: 'transparent'
    };
}

function parseActualPowerTime(row) {
    // GetAllmeter_ActualPower returns separate Date and Time columns
    if (row.Date && row.Time) return new Date(row.Date.split('T')[0] + ' ' + row.Time);
    return new Date(row.CreateDate || row.Timestamp || row.DateTime || '');
}

function updateHourlyChart() {
    const el = document.getElementById('chart-hourly-power'); if (!el) return;
    if (!selHourlyDevs.size) { chartState(el, 'nodevice', 'Please select a device'); return; }
    let f = hourlyPowerData.filter(r => selHourlyDevs.has(r.Devicename || r.DeviceName || 'Unknown'));
    if (selHour !== null && selHour !== undefined && selHour !== '') {
        f = f.filter(r => parseActualPowerTime(r).getHours() === selHour);
    }
    if (!f.length) { chartState(el, 'nodevicedata', 'No data for selected hour / devices'); return; }
    const sorted = f.slice().sort((a, b) => parseActualPowerTime(a) - parseActualPowerTime(b));
    // Build a deduped union of all timestamps across all selected devices
    const tsSet = new Map();
    sorted.forEach(d => {
        const t = parseActualPowerTime(d);
        const ts = t.getTime();
        if (!tsSet.has(ts)) tsSet.set(ts, t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    });
    const timeMap = [...tsSet.entries()].sort((a, b) => a[0] - b[0]).map(([ts, str]) => ({ ts, str }));
    const c = echarts.getInstanceByDom(el) || echarts.init(el);
    c.setOption({ tooltip: lineTooltip(), grid: { left: 60, right: 40, top: 40, bottom: 20 }, xAxis: { type: 'category', data: timeMap.map(t => t.str), axisLabel: { show: false }, boundaryGap: false }, yAxis: { type: 'value', name: 'W', axisLabel: { fontSize: 12, color: '#666' }, splitLine: { lineStyle: { type: 'dashed', color: '#eee' } } }, series: buildLineSeries(sorted, timeMap), animation: false }, true);
}

async function initHourlyChart() {
    const el = document.getElementById('chart-hourly-power'); if (!el) return;
    echarts.init(el); chartState(el, 'loading', '⏳ Loading...');
    try {
        // Full day — hour filter applied in updateHourlyChart; default = current hour
        const data = await fetchWithRetry(`/EnergyParameter/GetAllmeter_ActualPower?timeCategory=hot`);
        if (!data.length) { chartState(el, 'nodata', 'No data available'); return; }
        hourlyPowerData = data;
        const names = sortDevs([...new Set(data.map(d => d.Devicename || d.DeviceName || 'Unknown'))]);
        DeviceColors.registerAll(names);
        if (names.includes('Main Meter')) selHourlyDevs.add('Main Meter');
        selHour = new Date().getHours();
        buildCheckboxes('power-hourly-filter-checkboxes', names, selHourlyDevs, updateHourlyChart);
        renderHourFilter(); updateHourlyChart();
    } catch (e) { chartState(el, 'error', '⚠️ Error fetching data'); }
    window.addEventListener('resize', () => echarts.getInstanceByDom(el)?.resize());
}

// ── TODAY LINE CHART ──────────────────────────────────────
function updateTodayChart() {
    const el = document.getElementById('chart-today-power'); if (!el) return;
    if (!selTodayDevs.size) { chartState(el, 'nodevice', 'Please select a device'); return; }
    const f = todayPowerData.filter(r => selTodayDevs.has(r.Devicename || r.DeviceName || 'Unknown'));
    if (!f.length) { chartState(el, 'nodevicedata', 'No data for the selected devices'); return; }
    const sorted = f.slice().sort((a, b) => parseActualPowerTime(a) - parseActualPowerTime(b));
    // Build a deduped union of all timestamps across all selected devices
    const tsSet = new Map();
    sorted.forEach(d => {
        const t = parseActualPowerTime(d);
        const ts = t.getTime();
        if (!tsSet.has(ts)) tsSet.set(ts, t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    });
    const timeMap = [...tsSet.entries()].sort((a, b) => a[0] - b[0]).map(([ts, str]) => ({ ts, str }));
    const c = echarts.getInstanceByDom(el) || echarts.init(el);
    c.setOption({
        tooltip: lineTooltip(),
        grid: { left: 60, right: 40, top: 40, bottom: 28, containLabel: true },
        xAxis: {
            type: 'category',
            data: timeMap.map(t => t.str),
            boundaryGap: false,
            axisLabel: { show: false, fontSize: 10, color: '#999', interval: Math.floor(timeMap.length / 6) || 0, rotate: 0 },
            axisTick: { show: false },
            axisLine: { lineStyle: { color: '#ddd' } }
        },
        yAxis: { type: 'value', name: 'W', axisLabel: { fontSize: 12, color: '#666' }, splitLine: { lineStyle: { type: 'dashed', color: '#eee' } } },
        series: buildLineSeries(sorted, timeMap),
        animation: false
    }, true);
}

async function initTodayChart() {
    const el = document.getElementById('chart-today-power'); if (!el) return;
    echarts.init(el); chartState(el, 'loading', '⏳ Loading...');
    try {
        // Same API as hourly; updateTodayChart shows all 24h without hour filter
        const data = await fetchWithRetry(`/EnergyParameter/GetAllmeter_ActualPower?timeCategory=hot`);
        if (!data.length) { chartState(el, 'nodata', 'No data available'); return; }
        todayPowerData = data;
        const names = sortDevs([...new Set(data.map(d => d.Devicename || d.DeviceName || 'Unknown'))]);
        DeviceColors.registerAll(names);
        if (names.includes('Main Meter')) selTodayDevs.add('Main Meter');
        buildCheckboxes('power-today-filter-checkboxes', names, selTodayDevs, updateTodayChart);
        updateTodayChart();
    } catch (e) { chartState(el, 'error', '⚠️ Error fetching data'); }
    window.addEventListener('resize', () => echarts.getInstanceByDom(el)?.resize());
}

document.addEventListener('DOMContentLoaded', function () {
    Promise.all([initBarChart(), initHourlyChart(), initTodayChart()])
        .catch(e => console.error('Chart init error:', e));
});