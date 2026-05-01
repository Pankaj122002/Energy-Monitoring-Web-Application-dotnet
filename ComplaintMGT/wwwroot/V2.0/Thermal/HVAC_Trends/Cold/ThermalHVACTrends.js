// ===========================
// ThermalHVACTrendsCold.js  — COLD CATEGORY (Weekly / 4-Month view)
// 4 HVAC Thermal Graphs:
//   Graph 1 - Live (line chart)           → sp_GetThermalMonitoringHVAC_live_ByAssetId
//                                            Columns: Asset, DeviceId, Temp_in_degree, TransactionDate
//                                            + Date picker: current month + last 3 months range
//                                            + Default: date of the 1st row of API data
//   Graph 2 - Peak Temperature (line)     → sp_GetThermalMonitoringHVAC_AverageTrends_Cold
//                                            Columns: Deviceid, Asset, Temperature, Month, WeekStart, WeekEnd
//                                            x = weekly labels across current + last 3 months
//   Graph 3 - Weekly Average (bar)        → sp_GetThermalMonitoringHVAC_AverageTrends_Cold
//   Graph 4 - Thermal Profile Heatmap     → sp_GetThermalMonitoringHVAC_AverageTrends_Cold
//                                            x = weekly labels across current + last 3 months
//
//   Asset list → sp_GetHVACAssetList → Columns: AssetId, Name
//
// CACHING STRATEGY:
//   On init, ALL asset data is fetched ONCE and stored in cache.
//   Switching assets or dates never triggers an API call — pure local filter.
//   Graph 1 live data re-fetches silently every 2 minutes.
// ===========================

var hvacThermalDashboard = (function () {

    var assetColors = [
        '#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE',
        '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC', '#17B897'
    ];
    function getAssetColor(index) { return assetColors[index % assetColors.length]; }

    var cache = {
        assets: [], liveByAssetId: {}, avgByAssetId: {},
        assetsReady: false, liveReady: false, avgReady: false,
        _assetCallbacks: [], _liveCallbacks: [], _avgCallbacks: []
    };

    var g1 = { containerId: null, chartInstance: null, selectedIds: new Set(), selectedDate: null, refreshTimer: null };
    var g2 = { containerId: null, chartInstance: null, selectedIds: new Set() };
    var g3 = { containerId: null, chartInstance: null, selectedIds: new Set() };
    var g4 = { containerId: null, chartInstance: null, selectedId: null };

    // ===========================
    // HELPERS
    // ===========================
    function getAssetName(assetId) {
        var a = cache.assets.find(function (x) { return x.AssetId === String(assetId); });
        return a ? a.Name : String(assetId);
    }
    function getAssetColorById(assetId) {
        var idx = cache.assets.findIndex(function (x) { return x.AssetId === String(assetId); });
        return getAssetColor(idx >= 0 ? idx : 0);
    }
    function showNoData(chartInstance, msg) {
        if (!chartInstance) return;
        chartInstance.hideLoading();
        chartInstance.setOption({ title: { text: msg || 'No data available', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 16, fontWeight: 'normal' } } }, true);
    }
    function hexToRgbInline(hex) {
        hex = hex.replace('#', '');
        return parseInt(hex.slice(0, 2), 16) + ',' + parseInt(hex.slice(2, 4), 16) + ',' + parseInt(hex.slice(4, 6), 16);
    }
    function unwrapRows(response) {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.Table)) return response.Table;
        if (response && response.Table && Array.isArray(response.Table.rows)) return response.Table.rows;
        if (response && Array.isArray(response.rows)) return response.rows;
        return [];
    }
    function getLiveRows(assetIds) {
        var rows = [];
        assetIds.forEach(function (id) { rows = rows.concat(cache.liveByAssetId[id] || []); });
        return rows;
    }
    function getAvgRows(assetIds) {
        var rows = [];
        assetIds.forEach(function (id) { rows = rows.concat(cache.avgByAssetId[id] || []); });
        return rows;
    }
    function pad2(n) { return n < 10 ? '0' + n : String(n); }
    function fmtDate(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }

    function filterRowsByDate(rows, dateStr) {
        if (!dateStr) return rows;
        return rows.filter(function (r) {
            return fmtDate(new Date(r.TransactionDate)) === dateStr;
        });
    }

    function getFirstDateFromRows(rows) {
        var dates = {};
        rows.forEach(function (r) {
            var d = new Date(r.TransactionDate);
            if (!isNaN(d.getTime())) dates[fmtDate(d)] = true;
        });
        var sorted = Object.keys(dates).sort();
        return sorted.length ? sorted[0] : null;
    }

    // ===========================
    // CACHE LOADERS
    // ===========================
    function ensureAssets(callback) {
        if (cache.assetsReady) { callback(cache.assets); return; }
        cache._assetCallbacks.push(callback);
        if (cache._assetCallbacks.length > 1) return;
        $.ajax({
            type: 'POST', url: '/Thermal/GetHVACAssetLists',
            success: function (result) {
                var response = typeof result === 'string' ? JSON.parse(result) : result;
                cache.assets = unwrapRows(response).map(function (r) {
                    var id = r.AssetId !== undefined ? r.AssetId : r.AssetID !== undefined ? r.AssetID
                        : r.assetId !== undefined ? r.assetId : r.assetid !== undefined ? r.assetid : '';
                    return { AssetId: String(id), Name: r.Name || r.name || '' };
                }).filter(function (a) { return a.AssetId !== ''; });
                console.log('✅ HVAC Assets:', cache.assets);
                cache.assetsReady = true;
            },
            error: function () { console.error('❌ GetHVACAssetList failed'); },
            complete: function () {
                var cbs = cache._assetCallbacks.slice(); cache._assetCallbacks = [];
                cbs.forEach(function (cb) { cb(cache.assets); });
            }
        });
    }

    function ensureLiveCache(assets, callback) {
        if (cache.liveReady) { callback(); return; }
        cache._liveCallbacks.push(callback);
        if (cache._liveCallbacks.length > 1) return;
        if (!assets.length) {
            cache.liveReady = true;
            var cbs = cache._liveCallbacks.slice(); cache._liveCallbacks = [];
            cbs.forEach(function (cb) { cb(); }); return;
        }
        var pending = assets.length;
        assets.forEach(function (asset) {
            var id = asset.AssetId;
            $.ajax({
                type: 'POST',
                url: '/Thermal/GetThermalMonitoringHVAC_live_ByAssetId_cold?assetid=' + encodeURIComponent(id),
                success: function (result) {
                    var response = typeof result === 'string' ? JSON.parse(result) : result;
                    cache.liveByAssetId[id] = unwrapRows(response);
                    console.log('✅ Live [' + id + ']:', cache.liveByAssetId[id].length, 'rows');
                },
                error: function (xhr) {
                    console.error('❌ Live failed [' + id + '] HTTP', xhr.status);
                    cache.liveByAssetId[id] = [];
                },
                complete: function () {
                    pending--;
                    if (pending === 0) {
                        cache.liveReady = true;
                        var cbs = cache._liveCallbacks.slice(); cache._liveCallbacks = [];
                        cbs.forEach(function (cb) { cb(); });
                    }
                }
            });
        });
    }

    // ===========================
    // WEEKLY HELPERS for Cold graphs (G2, G3, G4)
    // API returns: Deviceid, Asset, Temperature, Month, WeekStart, WeekEnd
    // We build x-axis labels as "MMM Wn" (e.g. "Jan W1") across current + last 3 months.
    // ===========================
    var MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    function getFourMonthRange() {
        var now = new Date();
        var months = [];
        for (var i = 3; i >= 0; i--) {
            var d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({ year: d.getFullYear(), month: d.getMonth() });
        }
        return months; // oldest → newest
    }

    // Build ordered week-slot labels from all rows, bucketed by month.
    // Each unique WeekStart within a month gets a "MMM Wn" label.
    // Returns array of { label, weekStart, weekEnd, month, year } ordered chronologically.
    function buildWeekSlots(rows) {
        var fourMonths = getFourMonthRange();
        // Map month "January 2026" → { year, month (0-based) }
        var monthNameFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // Collect all unique (year, month, weekStart) from rows
        var slotMap = {}; // key: "YYYY-MM-weekStart"
        rows.forEach(function (r) {
            var ws = r.WeekStart || '';
            var me = r.Month || '';
            if (!ws) return;
            var wsDate = new Date(ws);
            if (isNaN(wsDate.getTime())) return;
            // Determine year/month from WeekStart date (more reliable than Month string)
            var yr = wsDate.getFullYear(), mo = wsDate.getMonth();
            var key = yr + '-' + pad2(mo + 1) + '-' + ws;
            if (!slotMap[key]) {
                slotMap[key] = { year: yr, month: mo, weekStart: ws, weekEnd: r.WeekEnd || '', sortKey: ws };
            }
        });

        // Sort slots chronologically
        var slots = Object.values ? Object.values(slotMap) : Object.keys(slotMap).map(function (k) { return slotMap[k]; });
        slots.sort(function (a, b) { return a.sortKey < b.sortKey ? -1 : a.sortKey > b.sortKey ? 1 : 0; });

        // Assign week numbers within each month
        var monthWeekCount = {};
        slots.forEach(function (s) {
            var mk = s.year + '-' + s.month;
            if (!monthWeekCount[mk]) monthWeekCount[mk] = 0;
            monthWeekCount[mk]++;
            s.weekNum = monthWeekCount[mk];
            s.label = MONTH_ABBR[s.month] + ' W' + s.weekNum;
        });

        return slots;
    }

    // Cold category uses: GetThermalMonitoringHVAC_AverageTrends_Cold
    // Returns: Deviceid, Asset, Temperature, Month, WeekStart, WeekEnd
    function ensureAvgCache(assets, callback) {
        if (cache.avgReady) { callback(); return; }
        cache._avgCallbacks.push(callback);
        if (cache._avgCallbacks.length > 1) return;
        if (!assets.length) {
            cache.avgReady = true;
            var cbs = cache._avgCallbacks.slice(); cache._avgCallbacks = [];
            cbs.forEach(function (cb) { cb(); }); return;
        }
        var pending = assets.length;
        assets.forEach(function (asset) {
            var id = asset.AssetId;
            $.ajax({
                type: 'POST',
                url: '/Thermal/GetThermalMonitoringHVAC_AverageTrends_Cold?assetid=' + encodeURIComponent(id),
                success: function (result) {
                    var response = typeof result === 'string' ? JSON.parse(result) : result;
                    cache.avgByAssetId[id] = unwrapRows(response);
                    console.log('✅ Avg Cold [' + id + ']:', cache.avgByAssetId[id].length, 'rows');
                },
                error: function (xhr) {
                    console.error('❌ Avg Cold failed [' + id + '] HTTP', xhr.status);
                    cache.avgByAssetId[id] = [];
                },
                complete: function () {
                    pending--;
                    if (pending === 0) {
                        cache.avgReady = true;
                        var cbs = cache._avgCallbacks.slice(); cache._avgCallbacks = [];
                        cbs.forEach(function (cb) { cb(); });
                    }
                }
            });
        });
    }

    function refreshLiveCache(callback) {
        var assets = cache.assets;
        if (!assets.length) { if (callback) callback(); return; }
        var pending = assets.length;
        assets.forEach(function (asset) {
            var id = asset.AssetId;
            $.ajax({
                type: 'POST',
                url: '/Thermal/GetThermalMonitoringHVAC_live_ByAssetId_cold?assetid=' + encodeURIComponent(id),
                success: function (result) {
                    var response = typeof result === 'string' ? JSON.parse(result) : result;
                    cache.liveByAssetId[id] = unwrapRows(response);
                },
                error: function () { },
                complete: function () { pending--; if (pending === 0 && callback) callback(); }
            });
        });
    }

    // ===========================
    // ASSET FILTER — Multi-select
    // ===========================
    function renderAssetFilter(containerId, assets, selectedIds, onChange) {
        var wrapper = document.getElementById('assetFilter_' + containerId);
        if (!wrapper) return;
        wrapper.innerHTML = '<div class="hvac-filter-label">Filter by HVAC Asset:</div>';

        var allSelected = selectedIds.size === assets.length;
        var allChip = document.createElement('label');
        allChip.className = 'hvac-asset-chip hvac-select-all' + (allSelected ? ' selected' : '');
        allChip.innerHTML = '<input type="checkbox" ' + (allSelected ? 'checked' : '') + '><span>All Assets</span>';
        allChip.querySelector('input').addEventListener('change', function () {
            if (this.checked) { assets.forEach(function (a) { selectedIds.add(a.AssetId); }); } else { selectedIds.clear(); }
            renderAssetFilter(containerId, assets, selectedIds, onChange);
            onChange(Array.from(selectedIds));
        });
        wrapper.appendChild(allChip);

        assets.forEach(function (asset, index) {
            var color = getAssetColor(index);
            var isChecked = selectedIds.has(asset.AssetId);
            var chip = document.createElement('label');
            chip.className = 'hvac-asset-chip' + (isChecked ? ' selected' : '');
            chip.style.setProperty('--chip-color', color);
            chip.style.border = isChecked ? '2.5px solid ' + color : '1.5px solid #d0d0d0';
            chip.style.background = isChecked ? 'rgba(' + hexToRgbInline(color) + ',0.18)' : '';
            chip.style.fontWeight = isChecked ? '700' : '';
            chip.innerHTML =
                '<input type="checkbox" data-assetid="' + asset.AssetId + '" ' + (isChecked ? 'checked' : '') + '>' +
                '<span class="hvac-chip-dot" style="background:' + color + ';"></span>' +
                '<span class="hvac-chip-name">' + asset.Name + '</span>';
            chip.querySelector('input').addEventListener('change', function () {
                if (this.checked) selectedIds.add(this.dataset.assetid); else selectedIds.delete(this.dataset.assetid);
                chip.classList.toggle('selected', this.checked);
                chip.style.border = this.checked ? '2.5px solid ' + color : '1.5px solid #d0d0d0';
                chip.style.background = this.checked ? 'rgba(' + hexToRgbInline(color) + ',0.18)' : '';
                chip.style.fontWeight = this.checked ? '700' : '';
                var allC = wrapper.querySelector('.hvac-select-all');
                if (allC) {
                    var nowAll = selectedIds.size === assets.length;
                    allC.classList.toggle('selected', nowAll);
                    allC.querySelector('input').checked = nowAll;
                }
                onChange(Array.from(selectedIds));
            });
            wrapper.appendChild(chip);
        });
    }

    // ===========================
    // ASSET FILTER — Single-select (Graph 4)
    // ===========================
    function renderAssetFilterSingle(containerId, assets, selectedId, onChange) {
        var wrapper = document.getElementById('assetFilter_' + containerId);
        if (!wrapper) return;
        wrapper.innerHTML = '<div class="hvac-filter-label">Select HVAC Asset:</div>';
        assets.forEach(function (asset, index) {
            var color = getAssetColor(index);
            var isChecked = selectedId === asset.AssetId;
            var chip = document.createElement('label');
            chip.className = 'hvac-asset-chip' + (isChecked ? ' selected' : '');
            chip.style.setProperty('--chip-color', color);
            chip.style.border = isChecked ? '2.5px solid ' + color : '1.5px solid #d0d0d0';
            chip.style.background = isChecked ? 'rgba(' + hexToRgbInline(color) + ',0.18)' : '';
            chip.style.fontWeight = isChecked ? '700' : '';
            chip.innerHTML =
                '<input type="radio" name="hvac_heatmap_radio_' + containerId + '" data-assetid="' + asset.AssetId + '" ' + (isChecked ? 'checked' : '') + '>' +
                '<span class="hvac-chip-dot" style="background:' + color + ';"></span>' +
                '<span class="hvac-chip-name">' + asset.Name + '</span>';
            chip.querySelector('input').addEventListener('change', function () {
                wrapper.querySelectorAll('.hvac-asset-chip').forEach(function (c) {
                    c.classList.remove('selected'); c.style.border = '1.5px solid #d0d0d0'; c.style.background = ''; c.style.fontWeight = '';
                });
                chip.classList.add('selected');
                chip.style.border = '2.5px solid ' + color;
                chip.style.background = 'rgba(' + hexToRgbInline(color) + ',0.18)';
                chip.style.fontWeight = '700';
                onChange(this.dataset.assetid);
            });
            wrapper.appendChild(chip);
        });
    }

    // ===========================
    // DATE PICKER for Graph 1 (Cold)
    //   Calendar range: current month + last 3 months (always shown).
    //   Days with no data are greyed out and unclickable.
    //   Default: date of the 1st row of data from API.
    // ===========================
    function renderDatePicker(containerId, allRows, selectedDate, onDateChange) {
        // Build valid date set from actual data
        var validDateSet = {};
        if (allRows && allRows.length) {
            allRows.forEach(function (r) {
                var d = new Date(r.TransactionDate);
                if (!isNaN(d.getTime())) validDateSet[fmtDate(d)] = true;
            });
        }

        // Calendar bounds: last 3 months through current month
        var now = new Date();
        var calEnd = { year: now.getFullYear(), month: now.getMonth() };
        var calStartD = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        var calStart = { year: calStartD.getFullYear(), month: calStartD.getMonth() };

        var pickerId = 'datePicker_' + containerId;
        var pickerBar = document.getElementById(pickerId);
        if (!pickerBar) {
            var assetBar = document.getElementById('assetFilter_' + containerId);
            if (!assetBar) return;
            pickerBar = document.createElement('div');
            pickerBar.id = pickerId;
            pickerBar.className = 'hvac-date-picker-bar';
            assetBar.parentNode.insertBefore(pickerBar, assetBar.nextSibling);
        }

        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // Build calendar state — default view = month of selected date, or current month
        var viewDate = selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date();
        var viewYear = viewDate.getFullYear();
        var viewMonth = viewDate.getMonth();

        // Label for toggle button
        var dispLabel = selectedDate
            ? (function () { var sd = new Date(selectedDate + 'T00:00:00'); return monthNames[sd.getMonth()] + ' ' + sd.getDate() + ', ' + sd.getFullYear(); }())
            : 'Select a date';

        function buildCalendarHTML(yr, mo) {
            var monthLabel = monthNames[mo] + ' ' + yr;
            var daysInMonth = new Date(yr, mo + 1, 0).getDate();
            var firstDow = new Date(yr, mo, 1).getDay();
            var html = '<div class="hvac-cal-header" style="display:flex;align-items:center;justify-content:space-between;">';
            // Prev arrow — disable if we'd go before calStart
            var prevYr = mo === 0 ? yr - 1 : yr, prevMo = mo === 0 ? 11 : mo - 1;
            var canPrev = (prevYr > calStart.year) || (prevYr === calStart.year && prevMo >= calStart.month);
            html += '<button type="button" class="hvac-cal-nav" data-dir="prev"' + (!canPrev ? ' disabled style="opacity:0.3;cursor:default;"' : '') + '>&#8249;</button>';
            html += '<span>' + monthLabel + '</span>';
            // Next arrow — disable if we'd go past calEnd (current month)
            var nextYr = mo === 11 ? yr + 1 : yr, nextMo = mo === 11 ? 0 : mo + 1;
            var canNext = (nextYr < calEnd.year) || (nextYr === calEnd.year && nextMo <= calEnd.month);
            html += '<button type="button" class="hvac-cal-nav" data-dir="next"' + (!canNext ? ' disabled style="opacity:0.3;cursor:default;"' : '') + '>&#8250;</button>';
            html += '</div>';
            html += '<div class="hvac-cal-grid">';
            ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(function (d) { html += '<div class="hvac-cal-dow">' + d + '</div>'; });
            for (var b = 0; b < firstDow; b++) { html += '<div class="hvac-cal-cell hvac-cal-blank"></div>'; }
            for (var day = 1; day <= daysInMonth; day++) {
                var dateStr = yr + '-' + pad2(mo + 1) + '-' + pad2(day);
                var hasData = !!validDateSet[dateStr];
                var isSelected = (selectedDate === dateStr);
                var cls = 'hvac-cal-cell' + (!hasData ? ' hvac-cal-disabled' : isSelected ? ' hvac-cal-selected' : ' hvac-cal-available');
                html += '<div class="' + cls + '"' + (hasData ? ' data-date="' + dateStr + '"' : '') + '>' + day + '</div>';
            }
            html += '</div>';
            return html;
        }

        var html = '<div class="hvac-filter-label" style="white-space:nowrap;">Filter by Date:</div>';
        html += '<div class="hvac-date-picker-wrapper">';
        html += '<button type="button" class="hvac-date-toggle" id="hvacDateToggle_' + containerId + '">';
        html += '<span class="hvac-date-icon">📅</span> ';
        html += '<span id="hvacDateLabel_' + containerId + '">' + dispLabel + '</span>';
        html += ' <span class="hvac-date-arrow">▾</span>';
        html += '</button>';
        html += '<div class="hvac-calendar-dropdown" id="hvacCalDrop_' + containerId + '" style="display:none;">';
        html += '<div id="hvacCalBody_' + containerId + '">' + buildCalendarHTML(viewYear, viewMonth) + '</div>';
        html += '</div></div>';
        pickerBar.innerHTML = html;

        var dropEl = document.getElementById('hvacCalDrop_' + containerId);
        var calBodyEl = document.getElementById('hvacCalBody_' + containerId);

        function rebuildCal() {
            calBodyEl.innerHTML = buildCalendarHTML(viewYear, viewMonth);
            attachCalEvents();
        }

        function attachCalEvents() {
            calBodyEl.querySelectorAll('.hvac-cal-nav').forEach(function (btn) {
                if (btn.disabled) return;
                btn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    var dir = this.dataset.dir;
                    if (dir === 'prev') { if (viewMonth === 0) { viewMonth = 11; viewYear--; } else { viewMonth--; } }
                    else { if (viewMonth === 11) { viewMonth = 0; viewYear++; } else { viewMonth++; } }
                    rebuildCal();
                });
            });
            calBodyEl.querySelectorAll('.hvac-cal-available, .hvac-cal-selected').forEach(function (cell) {
                cell.addEventListener('click', function () {
                    var date = this.dataset.date;
                    if (!date) return;
                    dropEl.style.display = 'none';
                    selectedDate = date;
                    var labelEl = document.getElementById('hvacDateLabel_' + containerId);
                    if (labelEl) {
                        var sd2 = new Date(date + 'T00:00:00');
                        labelEl.textContent = monthNames[sd2.getMonth()] + ' ' + sd2.getDate() + ', ' + sd2.getFullYear();
                    }
                    rebuildCal();
                    onDateChange(date);
                });
            });
        }

        var toggleBtn = document.getElementById('hvacDateToggle_' + containerId);
        if (toggleBtn && dropEl) {
            toggleBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                dropEl.style.display = dropEl.style.display === 'none' ? 'block' : 'none';
            });
            document.addEventListener('click', function (e) {
                if (!pickerBar.contains(e.target)) dropEl.style.display = 'none';
            });
        }

        attachCalEvents();
    }

    // ===========================
    // GRAPH 1: LIVE — Line chart + Date Picker
    // ===========================
    function g1_init(containerId) {
        g1.containerId = containerId;
        g1.selectedIds = new Set();
        g1.selectedDate = null;
        if (g1.refreshTimer) { clearInterval(g1.refreshTimer); g1.refreshTimer = null; }

        var dom = document.getElementById(containerId);
        if (!dom) return;
        var ex = echarts.getInstanceByDom(dom); if (ex) ex.dispose();
        g1.chartInstance = echarts.init(dom, null, { renderer: 'canvas' });
        g1.chartInstance.showLoading({ text: 'Loading data...', color: '#12CC7D', maskColor: 'rgba(255,255,255,0.8)' });

        ensureAssets(function (assets) {
            assets.forEach(function (a) { g1.selectedIds.add(a.AssetId); });

            ensureLiveCache(assets, function () {
                var allRows = getLiveRows(Array.from(g1.selectedIds));
                // Default: use the date of the very first row of API data (sorted ascending)
                var firstDateStr = getFirstDateFromRows(allRows);
                g1.selectedDate = firstDateStr || null;

                // Asset filter
                renderAssetFilter(containerId, assets, g1.selectedIds, function (ids) {
                    var rows = filterRowsByDate(getLiveRows(ids), g1.selectedDate);
                    g1_render(rows, ids);
                });

                // Date picker
                renderDatePicker(containerId, allRows, g1.selectedDate, function (date) {
                    g1.selectedDate = date;
                    g1_render(filterRowsByDate(getLiveRows(Array.from(g1.selectedIds)), date), Array.from(g1.selectedIds));
                });

                // Initial render
                g1_render(filterRowsByDate(allRows, g1.selectedDate), Array.from(g1.selectedIds));

                // Background refresh every 2 minutes
                g1.refreshTimer = setInterval(function () {
                    refreshLiveCache(function () {
                        var rows = filterRowsByDate(getLiveRows(Array.from(g1.selectedIds)), g1.selectedDate);
                        g1_render(rows, Array.from(g1.selectedIds));
                    });
                }, 120000);
            });
        });

        window.addEventListener('resize', function () { if (g1.chartInstance) g1.chartInstance.resize(); });
    }

    function g1_render(rows, selectedIds) {
        if (!g1.chartInstance) return;
        try {
            if (!rows || !rows.length) {
                showNoData(g1.chartInstance, 'No live data for selected date');
                return;
            }

            var byAsset = {};
            rows.forEach(function (r) {
                var name = r.Asset || '';
                if (!byAsset[name]) byAsset[name] = [];
                byAsset[name].push(r);
            });

            var series = [];
            selectedIds.forEach(function (assetId) {
                var assetName = getAssetName(assetId);
                var color = getAssetColorById(assetId);
                var assetRows = (byAsset[assetName] || []).slice().sort(function (a, b) {
                    return new Date(a.TransactionDate) - new Date(b.TransactionDate);
                });
                series.push({
                    name: assetName, type: 'line', smooth: true, symbol: 'none',
                    lineStyle: { width: 2.5, color: color },
                    itemStyle: { color: color },
                    data: assetRows.map(function (r) {
                        return [new Date(r.TransactionDate).getTime(), parseFloat(r.Temp_in_degree) || 0];
                    })
                });
            });

            g1.chartInstance.hideLoading();
            g1.chartInstance.setOption({
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(0,0,0,0.85)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1,
                    textStyle: { color: '#fff', fontSize: 12 },
                    formatter: function (params) {
                        if (!params.length) return '';
                        var dt = new Date(params[0].value[0]);
                        var label = dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString();
                        var html = '<div style="font-weight:bold;margin-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:4px;">' + label + '</div>';
                        var seen = {};
                        params.forEach(function (p) {
                            if (seen[p.seriesName]) return;
                            seen[p.seriesName] = true;
                            html += '<div style="margin:3px 0;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + p.color + ';margin-right:6px;"></span>' +
                                p.seriesName + ': <strong>' + (p.value[1] != null ? p.value[1].toFixed(2) + ' °C' : 'N/A') + '</strong></div>';
                        });
                        return html;
                    }
                },
                grid: { left: '6%', right: '4%', bottom: '12%', top: 55, containLabel: true },
                xAxis: {
                    type: 'time', boundaryGap: false,
                    axisLabel: { fontSize: 10, color: '#555', formatter: function (v) { var d = new Date(v); return d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'); } },
                    splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } }
                },
                yAxis: {
                    type: 'value', name: 'Temperature (°C)', nameLocation: 'middle', nameGap: 50, nameRotate: 90,
                    nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#333' },
                    axisLabel: { formatter: '{value}°', fontSize: 10, color: '#666' },
                    splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } }
                },
                dataZoom: [{ type: 'inside', start: 0, end: 100 }, { type: 'slider', show: true, start: 0, end: 100, height: 15, bottom: 10 }],
                series: series, animation: false
            }, true);
        } catch (e) {
            console.error('❌ g1_render error:', e);
            showNoData(g1.chartInstance, 'Error rendering chart');
        }
    }

    // ===========================
    // GRAPH 2: PEAK TEMPERATURE — Bar chart (x = Day of Month)
    // ===========================
    function g2_init(containerId) {
        g2.containerId = containerId; g2.selectedIds = new Set();
        var dom = document.getElementById(containerId);
        if (!dom) return;
        var ex = echarts.getInstanceByDom(dom); if (ex) ex.dispose();
        g2.chartInstance = echarts.init(dom, null, { renderer: 'canvas' });
        g2.chartInstance.showLoading({ text: 'Loading data...', color: '#5470C6', maskColor: 'rgba(255,255,255,0.8)' });
        ensureAssets(function (assets) {
            assets.forEach(function (a) { g2.selectedIds.add(a.AssetId); });
            ensureAvgCache(assets, function () {
                renderAssetFilter(containerId, assets, g2.selectedIds, function (ids) { g2_render(getAvgRows(ids), ids); });
                g2_render(getAvgRows(Array.from(g2.selectedIds)), Array.from(g2.selectedIds));
            });
        });
        window.addEventListener('resize', function () { if (g2.chartInstance) g2.chartInstance.resize(); });
    }

    function g2_render(rows, selectedIds) {
        if (!g2.chartInstance) return;
        if (!rows || !rows.length) { showNoData(g2.chartInstance, 'No data available'); return; }

        // Build ordered week slots from all rows
        var slots = buildWeekSlots(rows);
        if (!slots.length) { showNoData(g2.chartInstance, 'No weekly data available'); return; }
        var xLabels = slots.map(function (s) { return s.label; });

        var series = [];
        var allPeakIndices = [];

        selectedIds.forEach(function (assetId) {
            var assetName = getAssetName(assetId);
            var color = getAssetColorById(assetId);
            var assetRows = rows.filter(function (r) { return r.Asset === assetName; });

            // Map weekStart → temperature for this asset
            var wsMap = {};
            assetRows.forEach(function (r) {
                var ws = r.WeekStart || '';
                var temp = parseFloat(r.Temperature) || 0;
                if (ws) wsMap[ws] = temp;
            });

            var data = [], peakVal = -Infinity, peakIdx = 0;
            slots.forEach(function (s, i) {
                var val = parseFloat((wsMap[s.weekStart] || 0).toFixed(2));
                data.push(val);
                if (val > peakVal) { peakVal = val; peakIdx = i; }
            });

            allPeakIndices.push(peakIdx);
            var rgb = hexToRgbInline(color);
            series.push({
                name: assetName, type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
                lineStyle: { width: 2.5, color: color },
                itemStyle: { color: color },
                //areaStyle: { color: 'rgba(' + rgb + ',0.06)' },
                markPoint: {
                    symbol: 'circle', symbolSize: 14,
                    itemStyle: { color: '#e74c3c', borderColor: '#c0392b', borderWidth: 2 },
                    label: { show: true, position: 'top', fontSize: 9, color: '#c0392b', formatter: function (p) { return p.value.toFixed(1) + '°'; } },
                    data: [{ coord: [peakIdx, peakVal], name: 'Peak Temp', value: peakVal }]
                },
                data: data
            });
        });

        // Peak background bands
        var peakBands = [], seenPeaks = {};
        allPeakIndices.forEach(function (idx) {
            if (!seenPeaks[idx]) {
                seenPeaks[idx] = true;
                peakBands.push([
                    { xAxis: xLabels[idx], itemStyle: { color: 'rgba(231,76,60,0.08)' } },
                    { xAxis: xLabels[idx] }
                ]);
            }
        });
        if (peakBands.length) {
            series.push({
                name: '__peakBg__', type: 'line', data: [], silent: true, legendHoverLink: false,
                tooltip: { show: false },
                markArea: { silent: true, itemStyle: { opacity: 1 }, data: peakBands }
            });
        }

        g2.chartInstance.hideLoading();
        g2.chartInstance.setOption({
            tooltip: {
                trigger: 'axis', backgroundColor: 'rgba(0,0,0,0.85)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1,
                textStyle: { color: '#fff', fontSize: 12 },
                formatter: function (params) {
                    if (!params.length) return '';
                    var slotIdx = params[0].dataIndex;
                    var slot = slots[slotIdx] || {};
                    var rangeLabel = slot.weekStart && slot.weekEnd ? (slot.weekStart + ' → ' + slot.weekEnd) : params[0].name;
                    var html = '<div style="font-weight:bold;margin-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:4px;">' + params[0].name + '<br><small style="font-weight:normal;opacity:0.8;">' + rangeLabel + '</small></div>';
                    params.forEach(function (p) {
                        if (p.seriesName === '__peakBg__') return;
                        html += '<div style="margin:3px 0;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + p.color + ';margin-right:6px;"></span>' +
                            p.seriesName + ': <strong>' + (parseFloat(p.value) || 0).toFixed(2) + ' °C</strong></div>';
                    });
                    return html;
                }
            },
            legend: { show: false, top: 5, type: 'scroll', textStyle: { fontSize: 11 } },
            grid: { left: '6%', right: '4%', bottom: '18%', top: 55, containLabel: true },
            xAxis: {
                type: 'category', data: xLabels, name: 'Week', nameLocation: 'middle', nameGap: 35,
                axisLabel: { fontSize: 9, color: '#666', interval: 0 },
                axisLine: { lineStyle: { color: '#999' } }
            },
            yAxis: { type: 'value', name: 'Temperature (°C)', nameLocation: 'middle', nameGap: 50, nameRotate: 90, nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#333' }, axisLabel: { formatter: '{value}°', fontSize: 10, color: '#666' }, splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } } },
            dataZoom: [{ type: 'inside', start: 0, end: 100 }, { type: 'slider', show: true, start: 0, end: 100, height: 15, bottom: 10 }],
            series: series, animation: true
        }, true);
    }

    // ===========================
    // GRAPH 3: WEEKLY AVERAGE — Bar chart (x = Week labels across 4 months)
    // ===========================
    function g3_init(containerId) {
        g3.containerId = containerId; g3.selectedIds = new Set();
        var dom = document.getElementById(containerId);
        if (!dom) return;
        var ex = echarts.getInstanceByDom(dom); if (ex) ex.dispose();
        g3.chartInstance = echarts.init(dom, null, { renderer: 'canvas' });
        g3.chartInstance.showLoading({ text: 'Loading data...', color: '#5470C6', maskColor: 'rgba(255,255,255,0.8)' });
        ensureAssets(function (assets) {
            assets.forEach(function (a) { g3.selectedIds.add(a.AssetId); });
            ensureAvgCache(assets, function () {
                renderAssetFilter(containerId, assets, g3.selectedIds, function (ids) { g3_render(getAvgRows(ids), ids); });
                g3_render(getAvgRows(Array.from(g3.selectedIds)), Array.from(g3.selectedIds));
            });
        });
        window.addEventListener('resize', function () { if (g3.chartInstance) g3.chartInstance.resize(); });
    }

    function g3_render(rows, selectedIds) {
        if (!g3.chartInstance) return;
        if (!rows || !rows.length) { showNoData(g3.chartInstance, 'No data available'); return; }

        var slots = buildWeekSlots(rows);
        if (!slots.length) { showNoData(g3.chartInstance, 'No weekly data available'); return; }
        var xLabels = slots.map(function (s) { return s.label; });

        var series = [];
        selectedIds.forEach(function (assetId) {
            var assetName = getAssetName(assetId);
            var color = getAssetColorById(assetId);
            var assetRows = rows.filter(function (r) { return r.Asset === assetName; });

            var wsMap = {};
            assetRows.forEach(function (r) {
                var ws = r.WeekStart || '';
                var temp = parseFloat(r.Temperature) || 0;
                if (ws) wsMap[ws] = temp;
            });

            var data = [];
            slots.forEach(function (s) { data.push(parseFloat((wsMap[s.weekStart] || 0).toFixed(2))); });

            series.push({
                name: assetName, type: 'bar', barGap: '10%', data: data,
                itemStyle: { color: color, opacity: 0.85, borderRadius: [3, 3, 0, 0] }
            });
        });

        g3.chartInstance.hideLoading();
        g3.chartInstance.setOption({
            tooltip: {
                trigger: 'axis', backgroundColor: 'rgba(0,0,0,0.85)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1,
                textStyle: { color: '#fff', fontSize: 12 },
                formatter: function (params) {
                    if (!params.length) return '';
                    var slotIdx = params[0].dataIndex;
                    var slot = slots[slotIdx] || {};
                    var rangeLabel = slot.weekStart && slot.weekEnd ? (slot.weekStart + ' → ' + slot.weekEnd) : params[0].name;
                    var html = '<div style="font-weight:bold;margin-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:4px;">' + params[0].name + '<br><small style="font-weight:normal;opacity:0.8;">' + rangeLabel + '</small></div>';
                    params.forEach(function (p) {
                        html += '<div style="margin:3px 0;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + p.color + ';margin-right:6px;"></span>' +
                            p.seriesName + ': <strong>' + (parseFloat(p.value) || 0).toFixed(2) + ' °C</strong></div>';
                    });
                    return html;
                }
            },
            legend: { show: false, top: 5, type: 'scroll', textStyle: { fontSize: 11 } },
            grid: { left: '6%', right: '4%', bottom: '18%', top: 55, containLabel: true },
            xAxis: {
                type: 'category', data: xLabels, name: 'Week', nameLocation: 'middle', nameGap: 35,
                axisLabel: { fontSize: 9, color: '#666', interval: 0 },
                axisLine: { lineStyle: { color: '#999' } }
            },
            yAxis: { type: 'value', name: 'Avg Temperature (°C)', nameLocation: 'middle', nameGap: 50, nameRotate: 90, nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#333' }, axisLabel: { formatter: '{value}°', fontSize: 10, color: '#666' }, splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } } },
            dataZoom: [{ type: 'inside', start: 0, end: 100 }, { type: 'slider', show: true, start: 0, end: 100, height: 15, bottom: 10 }],
            series: series, animation: true
        }, true);
    }

    // ===========================
    // GRAPH 4: HEATMAP — Single-select (x = Day 1–31)
    // ===========================
    function g4_init(containerId) {
        g4.containerId = containerId; g4.selectedId = null;
        var dom = document.getElementById(containerId);
        if (!dom) return;
        var ex = echarts.getInstanceByDom(dom); if (ex) ex.dispose();
        g4.chartInstance = echarts.init(dom, null, { renderer: 'canvas' });
        g4.chartInstance.showLoading({ text: 'Loading data...', color: '#5470C6', maskColor: 'rgba(255,255,255,0.8)' });
        ensureAssets(function (assets) {
            g4.selectedId = assets.length > 0 ? assets[0].AssetId : null;
            ensureAvgCache(assets, function () {
                renderAssetFilterSingle(containerId, assets, g4.selectedId, function (assetId) {
                    g4.selectedId = assetId;
                    g4_render(cache.avgByAssetId[assetId] || [], assetId);
                });
                if (g4.selectedId) g4_render(cache.avgByAssetId[g4.selectedId] || [], g4.selectedId);
                else showNoData(g4.chartInstance, 'No assets available');
            });
        });
        window.addEventListener('resize', function () { if (g4.chartInstance) g4.chartInstance.resize(); });
    }

    function g4_render(rows, assetId) {
        if (!g4.chartInstance) return;
        if (!assetId) { showNoData(g4.chartInstance, 'Please select an asset'); return; }
        if (!rows || !rows.length) { showNoData(g4.chartInstance, 'No data for selected asset'); return; }

        var assetName = getAssetName(assetId);
        var colorIdx = cache.assets.findIndex(function (x) { return x.AssetId === assetId; });
        var color = getAssetColor(colorIdx >= 0 ? colorIdx : 0);
        var rgb = [parseInt(color.slice(1, 3), 16), parseInt(color.slice(3, 5), 16), parseInt(color.slice(5, 7), 16)];
        var lightColor = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.1)';

        var assetRows = rows.filter(function (r) { return r.Asset === assetName; });
        if (!assetRows.length) { showNoData(g4.chartInstance, 'No data for selected asset'); return; }

        // Build weekly slots from this asset's rows
        var slots = buildWeekSlots(assetRows);
        var xLabels = slots.map(function (s) { return s.label; });

        // Build weekStart → temperature map
        var wsMap = {};
        assetRows.forEach(function (r) {
            var ws = r.WeekStart || '';
            var temp = parseFloat(r.Temperature) || 0;
            if (ws) wsMap[ws] = temp;
        });

        var data = [];
        slots.forEach(function (s, i) {
            var val = parseFloat((wsMap[s.weekStart] || 0).toFixed(2));
            data.push([i, assetName, val]);
        });

        var vals = data.map(function (d) { return d[2]; });
        var minVal = vals.length ? Math.min.apply(null, vals) : 0;
        var maxVal = vals.length ? Math.max.apply(null, vals) : 0;

        g4.chartInstance.hideLoading();
        g4.chartInstance.clear();
        g4.chartInstance.setOption({
            tooltip: {
                confine: true,
                backgroundColor: 'rgba(0,0,0,0.82)', borderColor: 'rgba(255,255,255,0.15)', borderWidth: 1, padding: [8, 12],
                textStyle: { color: '#fff', fontSize: 12 },
                formatter: function (params) {
                    var slotIdx = params.value[0];
                    var slot = slots[slotIdx] || {};
                    var rangeLabel = slot.weekStart && slot.weekEnd ? (slot.weekStart + ' → ' + slot.weekEnd) : xLabels[slotIdx];
                    var val = (params.value[2] || 0).toFixed(2);
                    return '<div style="font-weight:600;margin-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.25);padding-bottom:4px;">' + xLabels[slotIdx] + '</div>' +
                        '<div style="margin-top:2px;opacity:0.75;font-size:11px;">' + rangeLabel + '</div>' +
                        '<div style="margin-top:4px;">' + assetName + '</div>' +
                        '<div style="margin-top:2px;color:#90caf9;">Temperature: <strong style="color:#fff;">' + val + ' °C</strong></div>';
                }
            },
            grid: { left: '14%', right: '6%', bottom: '30%', top: '8%' },
            xAxis: {
                type: 'category', data: xLabels, splitArea: { show: true },
                axisLabel: { fontSize: 9, color: '#555', interval: 0 },
                name: 'Week (last 4 months)', nameLocation: 'middle', nameGap: 30
            },
            yAxis: { type: 'category', data: [assetName], splitArea: { show: true }, axisLabel: { fontSize: 11, color: '#555' } },
            visualMap: {
                min: minVal, max: maxVal, calculable: true, orient: 'horizontal', left: 'center', bottom: '3%',
                inRange: { color: [lightColor, color] },
                text: [maxVal.toFixed(1) + ' °C', minVal.toFixed(1) + ' °C'],
                textStyle: { fontSize: 10 }
            },
            series: [{
                name: 'Temperature Heatmap', type: 'heatmap', data: data,
                label: { show: true, fontSize: 9, color: '#333', formatter: function (p) { return (p.value[2] || 0).toFixed(1); } },
                emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' } }
            }]
        });
    }

    // ===========================
    // PUBLIC API
    // ===========================
    return {
        init: function (graphId, containerId) {
            console.log('🌡️ hvacThermalDashboard.init → graphId:', graphId, 'container:', containerId);
            switch (graphId) {
                case 1: g1_init(containerId); break;
                case 2: g2_init(containerId); break;
                case 3: g3_init(containerId); break;
                case 4: g4_init(containerId); break;
                default: console.error('❌ Unknown HVAC graph id:', graphId);
            }
        }
    };

}());

window.hvacThermalDashboard = hvacThermalDashboard;

$(document).ready(function () {
    console.log('✅ ThermalHVACTrends.js loaded');
});