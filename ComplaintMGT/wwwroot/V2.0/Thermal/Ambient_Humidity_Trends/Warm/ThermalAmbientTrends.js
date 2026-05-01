// ===========================
// ThermalHVACTrendsWarm.js  — WARM CATEGORY (Monthly / Daily view)
// 4 HVAC Thermal Graphs:
//   Graph 1 - Live (line chart)           → sp_GetThermalMonitoringHVAC_live_ByAssetId
//                                            Columns: Asset, DeviceId, Temp_in_degree, TransactionDate
//                                            + Date picker: filter by any date in the data's month
//   Graph 2 - Peak Humidity (bar)      → sp_GetThermalMonitoringHVAC_AverageTrends_Warm
//                                            Columns: Deviceid, Asset, Humidity, TransactionDay
//   Graph 3 - Daily Average (bar)         → sp_GetThermalMonitoringHVAC_AverageTrends_Warm
//   Graph 4 - Thermal Profile Heatmap     → sp_GetThermalMonitoringHVAC_AverageTrends_Warm
//                                            x = TransactionDay (1–31)
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
            type: 'POST', url: '/Thermal/GetAmbientThermalAssetList',
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
                url: '/Thermal/GetHumidityMonitoringAmbient_live_ByAssetId_warm?assetid=' + encodeURIComponent(id),
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

    // Warm category uses: GetThermalMonitoringHVAC_AverageTrends_Warm
    // Returns: Deviceid, Asset, Humidity, TransactionDay
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
                url: '/Thermal/GetHumidityMonitoringAmbient_AverageTrends_warm?assetid=' + encodeURIComponent(id),
                success: function (result) {
                    var response = typeof result === 'string' ? JSON.parse(result) : result;
                    cache.avgByAssetId[id] = unwrapRows(response);
                    console.log('✅ Avg Warm [' + id + ']:', cache.avgByAssetId[id].length, 'rows');
                },
                error: function (xhr) {
                    console.error('❌ Avg Warm failed [' + id + '] HTTP', xhr.status);
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
                url: '/Thermal/GetHumidityMonitoringAmbient_live_ByAssetId_warm?assetid=' + encodeURIComponent(id),
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
        wrapper.innerHTML = '<div class="hvac-filter-label">Filter by Ambient Asset:</div>';

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
        wrapper.innerHTML = '<div class="hvac-filter-label">Select Ambient Asset:</div>';
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
    // DATE PICKER for Graph 1
    //   Detects month from live data. Restricts calendar to that month only.
    //   Days with no data are shown greyed out and unclickable.
    // ===========================
    function renderDatePicker(containerId, allRows, selectedDate, onDateChange) {
        var dateRange = null;

        if (allRows && allRows.length) {
            var parsedDates = allRows.map(function (r) { return new Date(r.TransactionDate); }).filter(function (d) { return !isNaN(d.getTime()); });
            if (parsedDates.length) {
                // Build a set of all valid date strings from the data
                var validDateSet = {};
                parsedDates.forEach(function (d) { validDateSet[fmtDate(d)] = true; });
                var sortedDateStrs = Object.keys(validDateSet).sort();
                var firstDate = new Date(sortedDateStrs[0] + 'T00:00:00');
                var lastDate = new Date(sortedDateStrs[sortedDateStrs.length - 1] + 'T00:00:00');
                dateRange = {
                    firstDate: firstDate, lastDate: lastDate,
                    validDateSet: validDateSet
                };
            }
        }

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

        if (!dateRange) {
            pickerBar.innerHTML = '<span class="hvac-filter-label" style="color:#aaa;">No date range in live data</span>';
            return;
        }

        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // Build calendar state — current view month (default: month of selectedDate or first data date)
        var viewDate = selectedDate ? new Date(selectedDate + 'T00:00:00') : dateRange.firstDate;
        var viewYear = viewDate.getFullYear();
        var viewMonth = viewDate.getMonth();

        // Label for toggle button
        var dispLabel = selectedDate
            ? (function () { var sd = new Date(selectedDate + 'T00:00:00'); return monthNames[sd.getMonth()] + ' ' + sd.getDate() + ', ' + sd.getFullYear(); }())
            : monthNames[dateRange.firstDate.getMonth()] + ' ' + dateRange.firstDate.getDate() + ', ' + dateRange.firstDate.getFullYear();

        function buildCalendarHTML(yr, mo) {
            var monthLabel = monthNames[mo] + ' ' + yr;
            var daysInMonth = new Date(yr, mo + 1, 0).getDate();
            var firstDow = new Date(yr, mo, 1).getDay();
            var html = '<div class="hvac-cal-header" style="display:flex;align-items:center;justify-content:space-between;">';
            // Prev arrow — disable if we'd go before first data month
            var prevYr = mo === 0 ? yr - 1 : yr, prevMo = mo === 0 ? 11 : mo - 1;
            var canPrev = (prevYr > dateRange.firstDate.getFullYear()) || (prevYr === dateRange.firstDate.getFullYear() && prevMo >= dateRange.firstDate.getMonth());
            html += '<button type="button" class="hvac-cal-nav" data-dir="prev"' + (!canPrev ? ' disabled style="opacity:0.3;cursor:default;"' : '') + '>&#8249;</button>';
            html += '<span>' + monthLabel + '</span>';
            // Next arrow — disable if we'd go past last data month
            var nextYr = mo === 11 ? yr + 1 : yr, nextMo = mo === 11 ? 0 : mo + 1;
            var canNext = (nextYr < dateRange.lastDate.getFullYear()) || (nextYr === dateRange.lastDate.getFullYear() && nextMo <= dateRange.lastDate.getMonth());
            html += '<button type="button" class="hvac-cal-nav" data-dir="next"' + (!canNext ? ' disabled style="opacity:0.3;cursor:default;"' : '') + '>&#8250;</button>';
            html += '</div>';
            html += '<div class="hvac-cal-grid">';
            ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].forEach(function (d) { html += '<div class="hvac-cal-dow">' + d + '</div>'; });
            for (var b = 0; b < firstDow; b++) { html += '<div class="hvac-cal-cell hvac-cal-blank"></div>'; }
            for (var day = 1; day <= daysInMonth; day++) {
                var dateStr = yr + '-' + pad2(mo + 1) + '-' + pad2(day);
                var hasData = !!dateRange.validDateSet[dateStr];
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
            // Nav buttons
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
            // Day cells
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

        // Toggle open/close
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
                // Default to 1st of the month of the first data date
                var firstDateStr = getFirstDateFromRows(allRows);
                if (firstDateStr) {
                    var fd = new Date(firstDateStr + 'T00:00:00');
                    var firstOfMonth = fd.getFullYear() + '-' + pad2(fd.getMonth() + 1) + '-01';
                    // Check if 1st of month has data — if yes, use it; otherwise null (no data shown by default)
                    var hasDataOnFirst = allRows.some(function (r) { return fmtDate(new Date(r.TransactionDate)) === firstOfMonth; });
                    g1.selectedDate = hasDataOnFirst ? firstOfMonth : null;
                } else {
                    g1.selectedDate = null;
                }

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
        if (!rows || !rows.length) { showNoData(g1.chartInstance, 'No live data for selected date'); return; }

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
                    return [new Date(r.TransactionDate).getTime(), parseFloat(r.Humidity) || 0];
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
                            p.seriesName + ': <strong>' + (p.value[1] != null ? p.value[1].toFixed(2) + ' g-m3' : 'N/A') + '</strong></div>';
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
                type: 'value', name: 'Humidity', nameLocation: 'middle', nameGap: 50, nameRotate: 90,
                nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#333' },
                axisLabel: { formatter: '{value}g-m3', fontSize: 10, color: '#666' },
                splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } }
            },
            dataZoom: [{ type: 'inside', start: 0, end: 100 }, { type: 'slider', show: true, start: 0, end: 100, height: 15, bottom: 10 }],
            series: series, animation: false
        }, true);
    }

    // ===========================
    // GRAPH 2: PEAK Humidity — Bar chart (x = Day of Month)
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

        var maxDay = 1;
        rows.forEach(function (r) { var d = parseInt(r.TransactionDay) || 0; if (d > maxDay) maxDay = d; });
        var xLabels = [];
        for (var d = 1; d <= maxDay; d++) { xLabels.push(String(d)); }

        var series = [];
        var allPeakIndices = [];

        selectedIds.forEach(function (assetId) {
            var assetName = getAssetName(assetId);
            var color = getAssetColorById(assetId);
            var assetRows = rows.filter(function (r) { return r.Asset === assetName; });
            var dayMap = {};
            for (var d = 1; d <= maxDay; d++) { dayMap[d] = 0; }
            assetRows.forEach(function (r) {
                var day = parseInt(r.TransactionDay) || 0;
                var temp = parseFloat(r.Humidity) || 0;
                if (day >= 1 && day <= maxDay) dayMap[day] = temp;
            });
            var data = [], peakVal = -Infinity, peakIdx = 0;
            for (var d = 1; d <= maxDay; d++) {
                data.push(parseFloat((dayMap[d] || 0).toFixed(2)));
                if (dayMap[d] > peakVal) { peakVal = dayMap[d]; peakIdx = d - 1; }
            }

            allPeakIndices.push(peakIdx);

            var rgb = hexToRgbInline(color);
            series.push({
                name: assetName, type: 'line', smooth: true, symbol: 'circle', symbolSize: 6,
                lineStyle: { width: 2.5, color: color },
                itemStyle: { color: color },
                areaStyle: { color: 'rgba(' + rgb + ',0.06)' },
                markPoint: {
                    symbol: 'circle', symbolSize: 14,
                    itemStyle: { color: '#e74c3c', borderColor: '#c0392b', borderWidth: 2 },
                    label: { show: true, position: 'top', fontSize: 9, color: '#c0392b', formatter: function (p) { return p.value.toFixed(1) + 'g-m3'; } },
                    data: [{ coord: [peakIdx, peakVal], name: 'Peak Temp', value: peakVal }]
                },
                data: data
            });
        });

        // Build markArea bands for peak day columns (one per selected asset, de-duplicated)
        var peakBands = [];
        var seenPeaks = {};
        allPeakIndices.forEach(function (idx) {
            if (!seenPeaks[idx]) {
                seenPeaks[idx] = true;
                peakBands.push([
                    { xAxis: xLabels[idx], itemStyle: { color: 'rgba(231,76,60,0.08)' } },
                    { xAxis: xLabels[idx] }
                ]);
            }
        });

        // Add invisible helper series to carry the markArea (avoids per-series duplication)
        if (peakBands.length) {
            series.push({
                name: '__peakBg__', type: 'line', data: [], silent: true, legendHoverLink: false,
                tooltip: { show: false },
                markArea: {
                    silent: true,
                    itemStyle: { opacity: 1 },
                    data: peakBands
                }
            });
        }

        g2.chartInstance.hideLoading();
        g2.chartInstance.setOption({
            tooltip: {
                trigger: 'axis', backgroundColor: 'rgba(0,0,0,0.85)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1,
                textStyle: { color: '#fff', fontSize: 12 },
                formatter: function (params) {
                    if (!params.length) return '';
                    var html = '<div style="font-weight:bold;margin-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:4px;">Day ' + params[0].name + '</div>';
                    params.forEach(function (p) {
                        html += '<div style="margin:3px 0;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + p.color + ';margin-right:6px;"></span>' +
                            p.seriesName + ': <strong>' + (parseFloat(p.value) || 0).toFixed(2) + ' g-m3</strong></div>';
                    });
                    return html;
                }
            },
            grid: { left: '6%', right: '4%', bottom: '14%', top: 55, containLabel: true },
            xAxis: { type: 'category', data: xLabels, name: 'Day of Month', nameLocation: 'middle', nameGap: 30, axisLabel: { fontSize: 9, color: '#666' }, axisLine: { lineStyle: { color: '#999' } } },
            yAxis: { type: 'value', name: 'Humidity', nameLocation: 'middle', nameGap: 50, nameRotate: 90, nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#333' }, axisLabel: { formatter: '{value}g-m3', fontSize: 10, color: '#666' }, splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } } },
            dataZoom: [{ type: 'inside', start: 0, end: 100 }, { type: 'slider', show: true, start: 0, end: 100, height: 15, bottom: 10 }],
            series: series, animation: true
        }, true);
    }

    // ===========================
    // GRAPH 3: DAILY AVERAGE — Bar chart (x = Day of Month)
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

        var maxDay = 1;
        rows.forEach(function (r) { var d = parseInt(r.TransactionDay) || 0; if (d > maxDay) maxDay = d; });
        var xLabels = [];
        for (var d = 1; d <= maxDay; d++) { xLabels.push(String(d)); }

        var series = [];
        selectedIds.forEach(function (assetId) {
            var assetName = getAssetName(assetId);
            var color = getAssetColorById(assetId);
            var assetRows = rows.filter(function (r) { return r.Asset === assetName; });
            var dayMap = {};
            for (var d = 1; d <= maxDay; d++) { dayMap[d] = 0; }
            assetRows.forEach(function (r) {
                var day = parseInt(r.TransactionDay) || 0;
                var temp = parseFloat(r.Humidity) || 0;
                if (day >= 1 && day <= maxDay) dayMap[day] = temp;
            });
            var data = [];
            for (var d = 1; d <= maxDay; d++) { data.push(parseFloat((dayMap[d] || 0).toFixed(2))); }
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
                    var html = '<div style="font-weight:bold;margin-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:4px;">Daily Avg — Day ' + params[0].name + '</div>';
                    params.forEach(function (p) {
                        html += '<div style="margin:3px 0;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + p.color + ';margin-right:6px;"></span>' +
                            p.seriesName + ': <strong>' + (parseFloat(p.value) || 0).toFixed(2) + ' g-m3</strong></div>';
                    });
                    return html;
                }
            },
            grid: { left: '6%', right: '4%', bottom: '14%', top: 55, containLabel: true },
            xAxis: { type: 'category', data: xLabels, name: 'Day of Month', nameLocation: 'middle', nameGap: 30, axisLabel: { fontSize: 9, color: '#666' }, axisLine: { lineStyle: { color: '#999' } } },
            yAxis: { type: 'value', name: 'Avg Humidity', nameLocation: 'middle', nameGap: 50, nameRotate: 90, nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#333' }, axisLabel: { formatter: '{value}g-m3', fontSize: 10, color: '#666' }, splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } } },
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

        var maxDay = 1;
        assetRows.forEach(function (r) { var d = parseInt(r.TransactionDay) || 0; if (d > maxDay) maxDay = d; });

        var xLabels = [];
        for (var d = 1; d <= maxDay; d++) { xLabels.push(String(d)); }

        var data = assetRows.map(function (r) {
            var day = parseInt(r.TransactionDay) || 1;
            var val = parseFloat(r.Humidity) || 0;
            return [day - 1, assetName, parseFloat(val.toFixed(2))];
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
                    var day = params.value[0] + 1;
                    var val = (params.value[2] || 0).toFixed(2);
                    return '<div style="font-weight:600;margin-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.25);padding-bottom:4px;">Day ' + day + '</div>' +
                        '<div style="margin-top:4px;">' + assetName + '</div>' +
                        '<div style="margin-top:2px;color:#90caf9;">Humidity: <strong style="color:#fff;">' + val + ' g-m3</strong></div>';
                }
            },
            grid: { left: '14%', right: '6%', bottom: '30%', top: '8%' },
            xAxis: { type: 'category', data: xLabels, splitArea: { show: true }, axisLabel: { fontSize: 10, color: '#555' }, name: 'Day of Month', nameLocation: 'middle', nameGap: 30 },
            yAxis: { type: 'category', data: [assetName], splitArea: { show: true }, axisLabel: { fontSize: 11, color: '#555' } },
            visualMap: {
                min: minVal, max: maxVal, calculable: true, orient: 'horizontal', left: 'center', bottom: '3%',
                inRange: { color: [lightColor, color] },
                text: [maxVal.toFixed(1) + ' g-m3', minVal.toFixed(1) + ' g-m3'],
                textStyle: { fontSize: 10 }
            },
            series: [{
                name: 'Humidity Heatmap', type: 'heatmap', data: data,
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
            console.log('🌡️ hvacThermalDashboard (Warm).init → graphId:', graphId, 'container:', containerId);
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
    console.log('✅ ThermalHVACTrendsWarm.js loaded');
});