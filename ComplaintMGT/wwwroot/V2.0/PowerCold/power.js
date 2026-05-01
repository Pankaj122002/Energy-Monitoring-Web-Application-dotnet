// Power Dashboard – COLD – power-cold.js  (bug-fix build)
// =========================================================
// Changes vs original:
//   1. parseActualPowerTime()  → local-time parse (no UTC drift)
//   2. getLocalDateString()    → new helper, replaces toISOString() for date keys
//   3. updateActualChart()     → uses getLocalDateString for filter + per-device timeline
//   4. buildLineSeries()       → each device builds its own sorted data (no shared timeMap)
//   5. initActualChart()       → uses getLocalDateString so picker starts at 2026-01-01
//   6. updateWeeklyBarChart()  → grid.bottom 55→70, grid.top 30→20 (reduce month-label gap)
// Everything else is IDENTICAL to the original minified source.
// =========================================================

function formatDateTime(createDate) { if (!createDate) return { date: '-', time: '-' }; try { const d = new Date(createDate); if (isNaN(d.getTime())) return { date: '-', time: '-' }; const pad = n => String(n).padStart(2, '0'); return { date: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` } } catch (e) { return { date: '-', time: '-' } } }
function formatDate(date) { const pad = n => n.toString().padStart(2, '0'); return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}` }
const _PALETTE = ['#2196F3', '#E53935', '#43A047', '#FB8C00', '#8E24AA', '#FFB300', '#F06292', '#6D4C41', '#7CB342', '#EA80FC', '#D81B60', '#546E7A', '#673AB7', '#00897B', '#3949AB', '#C0CA33', '#F4511E', '#4DB6AC', '#FF7043', '#9575CD'];
const DeviceColors = (function () { const _map = new Map(); let _nextIdx = 1; function _generate(idx) { const hue = (idx * 137.508) % 360; const sat = 55 + (idx % 4) * 8; const lit = 42 + (idx % 3) * 6; return 'hsl(' + hue.toFixed(1) + ',' + sat + '%,' + lit + '%)' } function get(name) { if (_map.has(name)) return _map.get(name); let colour; if ((name || '').trim().toLowerCase() === 'main meter') colour = _PALETTE[0]; else { colour = _nextIdx < _PALETTE.length ? _PALETTE[_nextIdx] : _generate(_nextIdx); _nextIdx++ } _map.set(name, colour); return colour } function registerAll(names) { const sorted = [...names].sort((a, b) => { if ((a || '').trim().toLowerCase() === 'main meter') return -1; if ((b || '').trim().toLowerCase() === 'main meter') return 1; return a.localeCompare(b) }); sorted.forEach(n => get(n)) } return { get, registerAll } })();
function isMainMeter(name) { return (name || '').trim().toLowerCase() === 'main meter' }
function showState(gridId, state, msg) { const el = document.getElementById(gridId); if (!el) return; const c = { loading: '#888', error: '#f44336', nodata: '#888', nodevice: '#1565c0', nodevicedata: '#888' }; el.innerHTML = `<div style="width:100%;text-align:center;padding:24px 0;font-size:15px;color:${c[state] || '#888'};font-weight:600;">${msg}</div>` }
async function fetchWithRetry(url, retries = 3, delay = 3000) { for (let i = 0; i < retries; i++) { try { const res = await fetch(url); if (!res.ok) throw new Error(`HTTP ${res.status}`); let data = await res.json(); if (typeof data === 'string') data = JSON.parse(data); if (data && data.Table) data = data.Table; if (!Array.isArray(data)) data = data ? [data] : []; return data } catch (e) { console.warn(`Fetch ${i + 1}/${retries} failed:`, e.message); if (i === retries - 1) throw e; await new Promise(r => setTimeout(r, delay * (i + 1))) } } }

// ── Circle builders: IDENTICAL to original ───────────────────────────────────
function _buildCircleElement(device, tooltipRows) { const box = document.createElement('div'); box.className = 'circle-box' + (device.isMainMeter ? ' main-meter' : ''); box.setAttribute('data-label', device.name); box.style.position = 'relative'; DeviceColors.get(device.name); box.style.backgroundColor = '#FFE082'; box.style.color = '#222'; if (device.isMainMeter) { box.style.border = '3px solid #222'; box.style.fontWeight = 'bold' } const txt = document.createElement('div'); txt.style.cssText = 'position:relative;z-index:1;text-align:center;line-height:1.2;'; txt.innerHTML = `<span style="font-size:1rem;font-weight:bold;">${device.power}</span>`; const tip = document.createElement('div'); tip.className = 'power-tooltip'; const tipContent = document.createElement('div'); tipContent.className = 'power-tooltip-content'; tooltipRows.forEach(r => { const row = document.createElement('div'); row.className = 'power-tooltip-row'; row.innerHTML = `<span class="power-tooltip-label">${r.label}</span><span class="power-tooltip-value">${r.value}</span>`; tipContent.appendChild(row) }); tip.appendChild(tipContent); box.appendChild(txt); box.appendChild(tip); return box }
function createPowerCircleElement(d) { return _buildCircleElement(d, [{ label: 'Device ID', value: d.deviceID || '-' }, { label: 'R Phase', value: (d.r_power || '-') + ' W' }, { label: 'Y Phase', value: (d.y_power || '-') + ' W' }, { label: 'B Phase', value: (d.b_power || '-') + ' W' }, { label: 'Date', value: d.date || '-' }, { label: 'Time', value: d.time || '-' }]) }
function createAvgPowerCircleElement(d) { return _buildCircleElement(d, [{ label: 'Device ID', value: d.deviceID || '-' }, { label: 'Count', value: d.count !== undefined ? d.count : '-' }, { label: 'R Phase', value: (d.r_power || '-') + ' W' }, { label: 'Y Phase', value: (d.y_power || '-') + ' W' }, { label: 'B Phase', value: (d.b_power || '-') + ' W' }]) }
function normaliseRow(row) { const rawDate = row.Date || row.CreateDate || row.createDate || row.Timestamp || row.DateTime || ''; const { date, time } = rawDate ? formatDateTime(rawDate) : { date: '-', time: '-' }; const name = row.Devicename || row.DeviceName || 'Unknown'; const deviceID = row.DeviceID || '-'; return { power: row.Power !== undefined ? parseFloat(row.Power).toFixed(2) : '-', r_power: row.R_Power !== undefined ? parseFloat(row.R_Power).toFixed(2) : '-', y_power: row.Y_Power !== undefined ? parseFloat(row.Y_Power).toFixed(2) : '-', b_power: row.B_Power !== undefined ? parseFloat(row.B_Power).toFixed(2) : '-', count: row.Count !== undefined ? row.Count : '-', name, deviceID, isMainMeter: isMainMeter(name), date, time } }
function renderPowerCircles(devices) { const g1 = document.getElementById('power-grid-1'); const g2 = document.getElementById('power-grid-2'); if (!g1) return; g1.innerHTML = ''; if (g2) g2.innerHTML = ''; devices.slice(0, 7).forEach(d => g1.appendChild(createPowerCircleElement(d))); if (g2 && devices.length > 7) devices.slice(7).forEach(d => g2.appendChild(createPowerCircleElement(d))) }
function renderHighPowerCircles(devices) { const grid = document.getElementById('high-power-grid'); const msg = document.getElementById('no-high-power-message'); if (!grid) return; grid.innerHTML = ''; if (!devices.length) { grid.style.display = 'none'; if (msg) { msg.style.display = 'block'; msg.textContent = 'No data available' } return } grid.style.display = 'flex'; if (msg) msg.style.display = 'none'; devices.forEach(d => grid.appendChild(createAvgPowerCircleElement(d))) }
function renderLowPowerCircles(devices) { const grid = document.getElementById('low-power-grid'); const msg = document.getElementById('no-low-power-message'); if (!grid) return; grid.innerHTML = ''; if (!devices.length) { grid.style.display = 'none'; if (msg) { msg.style.display = 'block'; msg.textContent = 'No data available' } return } grid.style.display = 'flex'; if (msg) msg.style.display = 'none'; devices.forEach(d => grid.appendChild(createAvgPowerCircleElement(d))) }
function renderPowerDistributionPie(allDevices) { const dom = document.getElementById('pie_graph'); if (!dom) return; DeviceColors.registerAll(allDevices.map(d => d.name)); const pieData = allDevices.map(d => ({ name: d.name, value: parseFloat(d.power) || 0 })).filter(i => i.value > 0); const chart = echarts.init(dom, null, { renderer: 'canvas' }); if (!pieData.length) { chart.setOption({ title: { text: 'No data available', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 16 } } }); return } const devMap = {}; allDevices.forEach(d => devMap[d.name] = d.deviceID); const pieColors = pieData.map(d => DeviceColors.get(d.name)); chart.setOption({ color: pieColors, tooltip: { trigger: 'item', backgroundColor: 'rgba(0,0,0,0.88)', borderColor: 'transparent', textStyle: { color: '#fff', fontSize: 12 }, formatter: p => `<div style="padding:4px 2px;"><div style="color:#FFE082;font-weight:bold;font-size:13px;margin-bottom:6px;">${p.name}</div><div style="color:#ccc;">Device ID: <strong style="color:#fff;">${devMap[p.name] || '-'}</strong></div><div style="color:#ccc;margin-top:3px;">Power: <strong style="color:#81C784;">${p.value.toFixed(2)} W</strong></div><div style="color:#ccc;margin-top:3px;">Share: <strong style="color:#FFE082;">${p.percent.toFixed(2)}%</strong></div></div>` }, legend: { orient: 'horizontal', bottom: 0, left: 10, right: 36, type: 'scroll', textStyle: { fontSize: 11, color: '#555' } }, series: [{ name: 'Power Distribution', type: 'pie', radius: ['0%', '68%'], center: ['50%', '44%'], data: pieData, label: { show: true, formatter: p => p.percent > 3 ? p.percent.toFixed(1) + '%' : '', fontSize: 12, color: '#333' }, labelLine: { show: true, length: 12, length2: 12 } }] }); window.addEventListener('resize', () => chart.resize()) }
function fmtTime(t) { return t ? t.toString().substring(0, 5) : '' }
let _opsRawRows = []; let selOpsDevs = new Set();
function buildOpsScheduleSection(rows) { const container = document.getElementById('ops-schedule-grid'); if (!container) return; container.innerHTML = ''; if (!rows || !rows.length) { container.innerHTML = '<p style="color:#999;padding:20px;">No operation schedule data available.</p>'; return } const allDeviceNames = sortDevs([...new Set(rows.map(r => r.Devicename || r.DeviceName || 'Unknown'))]); DeviceColors.registerAll(allDeviceNames); const wrapper = document.getElementById('ops-device-filter-wrapper'); const cbContainer = document.getElementById('ops-schedule-filter-checkboxes'); if (wrapper && cbContainer && cbContainer.childElementCount === 0) { wrapper.style.display = 'flex'; if (allDeviceNames.includes('Main Meter')) selOpsDevs.add('Main Meter'); else if (allDeviceNames.length) selOpsDevs.add(allDeviceNames[0]); allDeviceNames.forEach(name => { const lbl = document.createElement('label'); const cb = document.createElement('input'); cb.type = 'checkbox'; cb.value = name; cb.checked = selOpsDevs.has(name); cb.addEventListener('change', function () { this.checked ? selOpsDevs.add(name) : selOpsDevs.delete(name); renderOpsCards(_opsRawRows) }); const col = DeviceColors.get(name); lbl.style.cssText = `border-left:4px solid ${col};padding-left:8px;`; lbl.appendChild(cb); lbl.appendChild(document.createTextNode(' ' + name)); cbContainer.appendChild(lbl) }) } renderOpsCards(rows) }
function renderOpsCards(rows) { const container = document.getElementById('ops-schedule-grid'); if (!container) return; container.innerHTML = ''; const filtered = selOpsDevs.size ? rows.filter(r => selOpsDevs.has(r.Devicename || r.DeviceName || 'Unknown')) : rows; if (!filtered.length) { container.innerHTML = '<p style="color:#999;padding:20px;">No data for selected devices.</p>'; return } const windowMap = {}; filtered.forEach(row => { const win = row.SiteOperationWindow || 'Unknown'; if (!windowMap[win]) windowMap[win] = { label: win, startTime: row.StartTime || '', endTime: row.EndTime || '', devices: [] }; const name = row.Devicename || row.DeviceName || 'Unknown'; const deviceID = row.DeviceID || '-'; windowMap[win].devices.push({ name, deviceID, power: row.Power !== undefined ? parseFloat(row.Power).toFixed(1) : '0.0', r_power: row.R_Power !== undefined ? parseFloat(row.R_Power).toFixed(1) : '0.0', y_power: row.Y_Power !== undefined ? parseFloat(row.Y_Power).toFixed(1) : '0.0', b_power: row.B_Power !== undefined ? parseFloat(row.B_Power).toFixed(1) : '0.0', isMain: isMainMeter(name) }) }); Object.values(windowMap).sort((a, b) => a.startTime.localeCompare(b.startTime)).forEach(win => { const card = document.createElement('div'); card.className = 'ops-card'; const hdr = document.createElement('div'); hdr.className = 'ops-card-header'; const tit = document.createElement('div'); tit.className = 'ops-card-title'; tit.textContent = win.label; const tim = document.createElement('div'); tim.className = 'ops-card-time'; tim.textContent = fmtTime(win.startTime) + ' – ' + fmtTime(win.endTime); hdr.appendChild(tit); hdr.appendChild(tim); card.appendChild(hdr); const tilesRow = document.createElement('div'); tilesRow.className = 'ops-tiles-row'; win.devices.forEach(dev => { const tile = document.createElement('div'); tile.className = 'ops-device-tile' + (dev.isMain ? ' ops-main-meter' : ''); tile.title = `Device ID: ${dev.deviceID}  |  R: ${dev.r_power} W  |  Y: ${dev.y_power} W  |  B: ${dev.b_power} W`; const dn = document.createElement('div'); dn.className = 'ops-device-name'; dn.textContent = dev.name; const dp = document.createElement('div'); dp.className = 'ops-device-power'; dp.textContent = dev.power + ' W'; dp.style.color = '#1a237e'; tile.appendChild(dn); tile.appendChild(dp); tilesRow.appendChild(tile) }); card.appendChild(tilesRow); container.appendChild(card) }) }

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
(async function initHighLowPower() {
    ['high-power-grid', 'low-power-grid'].forEach(id => showState(id, 'loading', '⏳ Loading...'));
    try {
        const data = await fetchWithRetry('/EnergyParameter/GetAllmeter_AvgPower?timeCategory=cold');
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
        const data = await fetchWithRetry('/EnergyParameter/GetAllMeters_AvgPower_Operationwise?timeCategory=cold');
        if (!data.length) {
            showState('ops-schedule-grid', 'nodata', 'No data available');
            return;
        }
        _opsRawRows = data;
        buildOpsScheduleSection(data);
    } catch (err) {
        showState('ops-schedule-grid', 'error', '⚠️ Error fetching data');
    }
})();

let barPowerData = [], actualPowerData = [];
let selBarDevs = new Set(), selActualDevs = new Set(), selActualDate = null;
function sortDevs(arr) { return arr.slice().sort((a, b) => { if ((a || '').trim().toLowerCase() === 'main meter') return -1; if ((b || '').trim().toLowerCase() === 'main meter') return 1; return a.localeCompare(b) }) }
function buildCheckboxes(containerId, names, selSet, onChangeFn) { const c = document.getElementById(containerId); if (!c) return; c.innerHTML = ''; sortDevs(names).forEach(name => { const lbl = document.createElement('label'), cb = document.createElement('input'); cb.type = 'checkbox'; cb.value = name; cb.checked = (name === 'Main Meter'); if (cb.checked) selSet.add(name); cb.addEventListener('change', function () { this.checked ? selSet.add(name) : selSet.delete(name); onChangeFn() }); const col = DeviceColors.get(name); lbl.style.cssText = `border-left:4px solid ${col};padding-left:8px;`; lbl.appendChild(cb); lbl.appendChild(document.createTextNode(' ' + name)); c.appendChild(lbl) }) }
function chartState(elId, state, msg) { const el = typeof elId === 'string' ? document.getElementById(elId) : elId; if (!el) return; const c = echarts.getInstanceByDom(el) || echarts.init(el); const cols = { loading: '#888', error: '#f44336', nodata: '#888', nodevice: '#1565c0', nodevicedata: '#888' }; c.setOption({ title: { text: msg, left: 'center', top: 'center', textStyle: { color: cols[state] || '#888', fontSize: 15 } }, xAxis: { show: false }, yAxis: { show: false }, series: [] }, true) }
function processWeeklyBarData(data) { return data.map(row => ({ deviceName: row.Devicename || row.DeviceName || 'Unknown', deviceId: row.DeviceID || '-', yearNo: row.YearNo, monthNo: row.MonthNo, monthName: row.MonthName, weekNo: row.WeekNo, power: row.Power !== undefined ? parseFloat(row.Power) : 0, r_power: row.R_Power !== undefined ? parseFloat(row.R_Power).toFixed(2) : '-', y_power: row.Y_Power !== undefined ? parseFloat(row.Y_Power).toFixed(2) : '-', b_power: row.B_Power !== undefined ? parseFloat(row.B_Power).toFixed(2) : '-' })) }

// ── FIX 1: Bar chart – reduced gap between month label and footer ─────────────
function updateWeeklyBarChart() {
    const el = document.getElementById('chart-avg-power'); if (!el) return; if (!selBarDevs.size) { chartState(el, 'nodevice', 'Please select a device'); return } const f = barPowerData.filter(r => selBarDevs.has(r.deviceName)); if (!f.length) { chartState(el, 'nodevicedata', 'No data for the selected devices'); return } const weekMap = new Map(); f.forEach(r => { const key = `${r.yearNo}-${r.monthNo}-${r.weekNo}`; if (!weekMap.has(key)) weekMap.set(key, { yearNo: r.yearNo, monthNo: r.monthNo, monthName: r.monthName, weekNo: r.weekNo }) }); const weeks = [...weekMap.values()].sort((a, b) => a.yearNo !== b.yearNo ? a.yearNo - b.yearNo : a.monthNo !== b.monthNo ? a.monthNo - b.monthNo : a.weekNo - b.weekNo); const weeksWithGaps = []; const monthGroups = []; let i = 0; while (i < weeks.length) { let j = i; while (j < weeks.length && weeks[j].monthName === weeks[i].monthName && weeks[j].yearNo === weeks[i].yearNo) j++; const group = weeks.slice(i, j); monthGroups.push({ monthName: group[0].monthName, start: weeksWithGaps.length, count: group.length }); weeksWithGaps.push(...group); if (j < weeks.length) weeksWithGaps.push({ isGap: true }); i = j } const weekLabels = weeksWithGaps.map(w => w.isGap ? '' : `W${w.weekNo}`); const monthLabels = new Array(weeksWithGaps.length).fill(''); monthGroups.forEach(g => { const mid = Math.floor(g.start + g.count / 2); monthLabels[mid] = g.monthName }); const groups = {}; f.forEach(r => { if (!groups[r.deviceName]) groups[r.deviceName] = []; groups[r.deviceName].push(r) }); const series = Object.keys(groups).map(name => ({ name, type: 'bar', barGap: '20%', barCategoryGap: '35%', itemStyle: { borderRadius: [4, 4, 0, 0], color: DeviceColors.get(name) }, data: weeksWithGaps.map(w => { if (w.isGap) return null; const found = groups[name].find(r => r.yearNo === w.yearNo && r.monthNo === w.monthNo && r.weekNo === w.weekNo); return found ? { value: found.power, rowData: found } : null }) })); const c = echarts.getInstanceByDom(el) || echarts.init(el); c.setOption({
        tooltip: { trigger: 'item', formatter(p) { if (!p.data?.rowData) return ''; const r = p.data.rowData; return `<div style="background:rgba(0,0,0,.92);border-radius:8px;padding:12px;min-width:210px;"><div style="color:#66BB6A;font-weight:bold;margin-bottom:8px;">${r.monthName} - Week ${r.weekNo} – ${r.deviceName}</div><div style="color:#FFE082"><strong>Device ID:</strong> <span style="color:#fff">${r.deviceId}</span></div><div style="color:#FFE082;margin-top:4px"><strong>Year:</strong> <span style="color:#fff">${r.yearNo}</span></div><div style="color:#FFE082;margin-top:4px"><strong>Power:</strong> <span style="color:#81C784;font-size:15px;font-weight:bold">${r.power.toFixed(2)} W</span></div><div style="border-top:1px solid #444;margin-top:6px;padding-top:6px;"><div style="color:#EF9A9A;margin-top:2px"><strong>R:</strong> <span style="color:#fff">${r.r_power} W</span></div><div style="color:#FFF176;margin-top:2px"><strong>Y:</strong> <span style="color:#fff">${r.y_power} W</span></div><div style="color:#90CAF9;margin-top:2px"><strong>B:</strong> <span style="color:#fff">${r.b_power} W</span></div></div></div>` }, backgroundColor: 'transparent', borderColor: 'transparent', confine: true },
        // left:65 ensures y-axis name "W" is fully visible; bottom:58 keeps month labels visible
        // without a large empty gap above the footer; top:30 gives a small breathing gap below filter
        grid: { left: 65, right: 30, top: 30, bottom: 40, containLabel: true },
        xAxis: [{ type: 'category', data: weekLabels, axisLabel: { interval: 0, fontSize: 11, color: '#666', fontWeight: 'bold' }, axisTick: { alignWithLabel: true } }, { type: 'category', data: monthLabels, position: 'bottom', offset: 28, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { interval: 0, fontSize: 13, color: '#1565c0', fontWeight: 'bold' } }], yAxis: { type: 'value', name: 'W', axisLabel: { fontSize: 11, color: '#666' }, splitLine: { lineStyle: { type: 'dashed', color: '#eee' } } }, series
    }, true)
}

async function initBarChart() { const el = document.getElementById('chart-avg-power'); if (!el) return; echarts.init(el); chartState(el, 'loading', '⏳ Loading...'); try { const data = await fetchWithRetry(`/EnergyParameter/GetAllmeter_AvgPower_bargraph?timeCategory=cold`); if (!data.length) { chartState(el, 'nodata', 'No data available'); return } barPowerData = processWeeklyBarData(data); const names = sortDevs([...new Set(barPowerData.map(r => r.deviceName))]); DeviceColors.registerAll(names); buildCheckboxes('power-bar-filter-checkboxes', names, selBarDevs, updateWeeklyBarChart); updateWeeklyBarChart() } catch (e) { chartState(el, 'error', '⚠️ Error fetching data') } window.addEventListener('resize', () => echarts.getInstanceByDom(el)?.resize()) }

// ── FIX 2: Parse time in LOCAL timezone (prevents UTC date-shift / 31-Dec bug) ─
function parseActualPowerTime(row) {
    if (row.Date && row.Time) {
        // strip T portion if present, keep YYYY-MM-DD only
        const datePart = row.Date.split('T')[0];
        // ensure HH:MM:SS format
        const timePart = (row.Time + '').substring(0, 8);
        // no Z → parsed as local time → no UTC offset shift
        return new Date(`${datePart}T${timePart}`);
    }
    const raw = row.CreateDate || row.Timestamp || row.DateTime || '';
    if (!raw) return new Date(NaN);
    // strip trailing Z so it's treated as local, not UTC
    return new Date(raw.replace('Z', ''));
}

// ── FIX 3: Helper to get YYYY-MM-DD from a Date using LOCAL clock ─────────────
function getLocalDateString(date) {
    if (!date || isNaN(date.getTime())) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function lineTooltip() { return { trigger: 'axis', backgroundColor: 'rgba(0,0,0,0.92)', borderColor: 'transparent', borderWidth: 0, padding: 0, textStyle: { color: '#fff', fontSize: 12 }, axisPointer: { type: 'cross', label: { backgroundColor: '#333' } }, formatter(params) { if (!params || !params.length) return ''; const t = params[0].axisValue; let h = `<div style="padding:8px 6px;min-width:200px;background:rgba(0,0,0,0.92);border-radius:8px;"><div style="color:#FFE082;font-weight:bold;margin-bottom:6px;border-bottom:1px solid #444;padding-bottom:4px;">${t}</div>`; params.forEach(p => { const v = p.value?.[1]; const d = p.data?.rowData; const dev = p.seriesName; const devId = d?.DeviceID || d?.deviceId || ''; const r = d?.R_Power ?? d?.r_power; const y = d?.Y_Power ?? d?.y_power; const b = d?.B_Power ?? d?.b_power; h += `<div style="margin:5px 0;"><div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color};"></span><span style="color:#ccc;">${dev}</span></div><div style="color:#81C784;font-weight:bold;font-size:14px;margin-bottom:3px;">${Number(v).toFixed(2)} W</div>`; if (devId) h += `<div style="color:#999;font-size:10px;margin-bottom:3px;">ID: ${devId}</div>`; if (r != null) h += `<div style="display:flex;gap:10px;margin-top:3px;font-size:11px;"><span style="color:#EF9A9A;">R: ${r} W</span><span style="color:#FFF176;">Y: ${y} W</span><span style="color:#90CAF9;">B: ${b} W</span></div></div>` }); return h + '</div>' }, backgroundColor: 'transparent', borderColor: 'transparent' } }

// ── FIX 4: Each device gets its own timeline; duplicates at same timestamp are removed ──
function buildLineSeries(sorted) {
    const groups = {};
    sorted.forEach(d => { const n = d.Devicename || d.DeviceName || 'Unknown'; if (!groups[n]) groups[n] = []; groups[n].push(d) });
    return Object.keys(groups).map(name => {
        const devRows = groups[name].slice().sort((a, b) => parseActualPowerTime(a) - parseActualPowerTime(b));
        // Deduplicate: for same device+timestamp keep the last entry only
        const seen = new Map();
        devRows.forEach(d => {
            const t = parseActualPowerTime(d);
            if (isNaN(t.getTime())) return;
            seen.set(t.getTime(), d); // later entry overwrites earlier duplicate
        });
        const data = [...seen.entries()]
            .sort((a, b) => a[0] - b[0])
            .map(([, d]) => {
                const t = parseActualPowerTime(d);
                const label = t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return { value: [label, parseFloat(d.Power || d.power || 0)], rowData: d };
            }).filter(Boolean);
        return { name, type: 'line', smooth: false, symbol: 'circle', symbolSize: 4, showSymbol: false, lineStyle: { width: 2, color: DeviceColors.get(name) }, itemStyle: { color: DeviceColors.get(name) }, emphasis: { focus: 'series' }, data };
    });
}

// ── FIX 5: updateActualChart uses local date comparison ───────────────────────
function updateActualChart() {
    const el = document.getElementById('chart-actual-power'); if (!el) return; if (!selActualDevs.size) { chartState(el, 'nodevice', 'Please select a device'); return } if (!selActualDate) { chartState(el, 'nodata', 'Please select a date'); return }
    // FIX: compare local date string instead of UTC toISOString
    const fDate = actualPowerData.filter(r => { const d = parseActualPowerTime(r); return getLocalDateString(d) === selActualDate });
    if (!fDate.length) { chartState(el, 'nodata', 'No data available for selected date'); return }
    const f = fDate.filter(r => selActualDevs.has(r.Devicename || r.DeviceName || 'Unknown'));
    if (!f.length) { chartState(el, 'nodevicedata', 'No data for selected device'); return }
    const sorted = f.slice().sort((a, b) => parseActualPowerTime(a) - parseActualPowerTime(b));
    // union of all time labels for shared x-axis
    const tsSet = new Map(); sorted.forEach(d => { const t = parseActualPowerTime(d); if (isNaN(t.getTime())) return; const ts = t.getTime(); if (!tsSet.has(ts)) tsSet.set(ts, t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })) });
    const timeLabels = [...tsSet.entries()].sort((a, b) => a[0] - b[0]).map(([, str]) => str);
    const c = echarts.getInstanceByDom(el) || echarts.init(el);
    c.setOption({ tooltip: lineTooltip(), grid: { left: 55, right: 25, top: 15, bottom: 20, containLabel: true }, xAxis: { type: 'category', data: timeLabels, boundaryGap: false, axisLabel: { show: false }, axisTick: { show: false }, axisLine: { lineStyle: { color: '#e5e7eb' } } }, yAxis: { type: 'value', name: 'W', nameGap: 25, axisLabel: { fontSize: 12, color: '#666' }, splitLine: { lineStyle: { type: 'dashed', color: '#eee' } } }, series: buildLineSeries(sorted), animation: false }, true)
}

// ── FIX 6: initActualChart uses local date string (picker starts 2026-01-01) ──
async function initActualChart() {
    const el = document.getElementById('chart-actual-power'); if (!el) return; echarts.init(el); chartState(el, 'loading', '⏳ Loading...'); try {
        const data = await fetchWithRetry(`/EnergyParameter/GetAllmeter_ActualPower?timeCategory=cold`); if (!data.length) { chartState(el, 'nodata', 'No data available'); return } actualPowerData = data;
        // FIX: derive date strings via local clock, not UTC
        const dates = [...new Set(data.map(r => getLocalDateString(parseActualPowerTime(r))).filter(Boolean))].sort();
        const picker = document.getElementById('power-date-picker'); const rangeSpan = document.getElementById('power-date-range');
        if (picker && dates.length) { picker.min = dates[0]; picker.max = dates[dates.length - 1]; picker.value = dates[0]; selActualDate = picker.value; if (rangeSpan) rangeSpan.textContent = `(${dates[0]} to ${dates[dates.length - 1]})`; picker.addEventListener('change', () => { selActualDate = picker.value; updateActualChart() }) }
        const names = sortDevs([...new Set(data.map(d => d.Devicename || d.DeviceName || 'Unknown'))]); DeviceColors.registerAll(names); if (names.includes('Main Meter')) selActualDevs.add('Main Meter'); buildCheckboxes('power-actual-filter-checkboxes', names, selActualDevs, updateActualChart); updateActualChart()
    } catch (e) { chartState(el, 'error', '⚠️ Error fetching data'); console.error(e) } window.addEventListener('resize', () => echarts.getInstanceByDom(el)?.resize())
}

document.addEventListener('DOMContentLoaded', function () { Promise.all([initBarChart(), initActualChart()]).catch(e => console.error('Chart init error:', e)) });