// ===========================
// ThermalHVACTrends.js
// 4 HVAC Thermal Graphs:
//   Graph 1 - Live (line chart)           → sp_GetThermalMonitoringHVAC_live_ByAssetId
//                                            Columns: Asset, DeviceId, Temp_in_degree, TransactionDate
//   Graph 2 - Peak Temperature (bar)      → sp_GetThermalMonitoringHVAC_AverageTrends_Hot
//                                            Columns: Deviceid, Asset, Temperature, TransactionHour
//   Graph 3 - Hourly Average (bar)        → sp_GetThermalMonitoringHVAC_AverageTrends_Hot
//   Graph 4 - Thermal Profile Heatmap     → sp_GetThermalMonitoringHVAC_AverageTrends_Hot
//
//   Asset list → sp_GetHVACAssetList → Columns: AssetId, Name
//
// Asset filter above each graph:
//   Graphs 1,2,3: multi-select, all assets selected by default
//   Graph 4 (heatmap): single-select, first asset selected by default
//
// CACHING STRATEGY:
//   On init, ALL asset data is fetched ONCE and stored in:
//     cache.liveByAssetId[assetId]  → live rows for that asset
//     cache.avgByAssetId[assetId]   → avg/heatmap rows for that asset
//   Switching / toggling assets never triggers an API call — pure local filter.
//   Graph 1 live data re-fetches all assets silently every 60s.
// ===========================

var hvacThermalDashboard = (function () {

    // ===========================
    // SHARED COLORS
    // ===========================
    var assetColors = [
        '#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE',
        '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC', '#17B897'
    ];
    function getAssetColor(index) { return assetColors[index % assetColors.length]; }

    // ===========================
    // GLOBAL DATA CACHE
    //   Populated once on first init. All graphs and all filter changes read from here.
    // ===========================
    var cache = {
        assets: [],               // [{ AssetId, Name }, ...]
        liveByAssetId: {},        // { "112": [...rows], "113": [...rows], ... }
        avgByAssetId: {},         // { "112": [...rows], "113": [...rows], ... }
        assetsReady: false,
        liveReady: false,
        avgReady: false,
        _assetCallbacks: [],
        _liveCallbacks: [],
        _avgCallbacks: []
    };

    // ===========================
    // PER-GRAPH STATE (fully isolated)
    // ===========================
    var g1 = { containerId: null, chartInstance: null, selectedIds: new Set(), refreshTimer: null };
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
        chartInstance.setOption({
            title: { text: msg || 'No data available', left: 'center', top: 'center', textStyle: { color: '#999', fontSize: 16, fontWeight: 'normal' } }
        }, true);
    }

    // Convert hex color "#5470C6" → "84,112,198" for use in rgba()
    function hexToRgbInline(hex) {
        hex = hex.replace("#", "");
        return parseInt(hex.slice(0, 2), 16) + "," + parseInt(hex.slice(2, 4), 16) + "," + parseInt(hex.slice(4, 6), 16);
    }

    // Unwrap any shape C# Json(Result) can produce
    function unwrapRows(response) {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.Table)) return response.Table;
        if (response && response.Table && Array.isArray(response.Table.rows)) return response.Table.rows;
        if (response && Array.isArray(response.rows)) return response.rows;
        return [];
    }

    // Merge cached rows for a list of assetIds
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

    // ===========================
    // CACHE LOADER: Asset List (fetched once, shared by all graphs)
    // ===========================
    function ensureAssets(callback) {
        if (cache.assetsReady) { callback(cache.assets); return; }
        cache._assetCallbacks.push(callback);
        if (cache._assetCallbacks.length > 1) return; // already in-flight

        $.ajax({
            type: 'POST',
            url: '/Thermal/GetAmbientThermalAssetList',
            success: function (result) {
                var response = typeof result === 'string' ? JSON.parse(result) : result;
                var rows = unwrapRows(response);
                cache.assets = rows.map(function (r) {
                    var id = r.AssetId !== undefined ? r.AssetId
                        : r.AssetID !== undefined ? r.AssetID
                            : r.assetId !== undefined ? r.assetId
                                : r.assetid !== undefined ? r.assetid : '';
                    return { AssetId: String(id), Name: r.Name || r.name || '' };
                }).filter(function (a) { return a.AssetId !== ''; });
                console.log('✅ HVAC Assets loaded:', cache.assets);
                cache.assetsReady = true;
            },
            error: function () { console.error('❌ GetHVACAssetList failed'); },
            complete: function () {
                var cbs = cache._assetCallbacks.slice(); cache._assetCallbacks = [];
                cbs.forEach(function (cb) { cb(cache.assets); });
            }
        });
    }

    // ===========================
    // CACHE LOADER: Live Data (all assets, fetched once)
    // ===========================
    function ensureLiveCache(assets, callback) {
        if (cache.liveReady) { callback(); return; }
        cache._liveCallbacks.push(callback);
        if (cache._liveCallbacks.length > 1) return; // already in-flight

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
                // C# reads assetid from query string: ?assetid=
                url: '/Thermal/GetThermalMonitoringAmbient_live_ByAssetId?assetid=' + encodeURIComponent(id),
                success: function (result) {
                    var response = typeof result === 'string' ? JSON.parse(result) : result;
                    cache.liveByAssetId[id] = unwrapRows(response);
                    console.log('✅ Live cache [' + id + ']:', cache.liveByAssetId[id].length, 'rows');
                },
                error: function (xhr) {
                    console.error('❌ Live fetch failed for assetId:', id, '— HTTP', xhr.status);
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
    // CACHE LOADER: Average Data (all assets, fetched once)
    // ===========================
    function ensureAvgCache(assets, callback) {
        if (cache.avgReady) { callback(); return; }
        cache._avgCallbacks.push(callback);
        if (cache._avgCallbacks.length > 1) return; // already in-flight

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
                // C# reads assetid from query string: ?assetid=
                url: '/Thermal/GetThermalMonitoringAmbient_AverageTrends_Hot?assetid=' + encodeURIComponent(id),
                success: function (result) {
                    var response = typeof result === 'string' ? JSON.parse(result) : result;
                    cache.avgByAssetId[id] = unwrapRows(response);
                    console.log('✅ Avg cache [' + id + ']:', cache.avgByAssetId[id].length, 'rows');
                },
                error: function (xhr) {
                    console.error('❌ Avg fetch failed for assetId:', id, '— HTTP', xhr.status);
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

    // ===========================
    // BACKGROUND LIVE REFRESH (Graph 1 only, every 60s)
    // Re-fetches all assets silently and updates the cache; no loading spinner shown.
    // ===========================
    function refreshLiveCache(callback) {
        var assets = cache.assets;
        if (!assets.length) { if (callback) callback(); return; }
        var pending = assets.length;
        assets.forEach(function (asset) {
            var id = asset.AssetId;
            $.ajax({
                type: 'POST',
                // C# reads assetid from query string: ?assetid=
                url: '/Thermal/GetThermalMonitoringAmbient_live_ByAssetId?assetid=' + encodeURIComponent(id),
                success: function (result) {
                    var response = typeof result === 'string' ? JSON.parse(result) : result;
                    cache.liveByAssetId[id] = unwrapRows(response);
                },
                error: function () { /* keep stale cache on error */ },
                complete: function () {
                    pending--;
                    if (pending === 0 && callback) callback();
                }
            });
        });
    }

    // ===========================
    // ASSET FILTER UI — Multi-select (Graphs 1, 2, 3)
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
            if (this.checked) { assets.forEach(function (a) { selectedIds.add(a.AssetId); }); }
            else { selectedIds.clear(); }
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
            if (isChecked) {
                chip.style.border = '2.5px solid ' + color;
                chip.style.background = 'rgba(' + hexToRgbInline(color) + ',0.18)';
                chip.style.fontWeight = '700';
            } else {
                chip.style.border = '1.5px solid #d0d0d0';
                chip.style.background = '';
                chip.style.fontWeight = '';
            }
            chip.innerHTML =
                '<input type="checkbox" data-assetid="' + asset.AssetId + '" ' + (isChecked ? 'checked' : '') + '>' +
                '<span class="hvac-chip-dot" style="background:' + color + ';"></span>' +
                '<span class="hvac-chip-name">' + asset.Name + '</span>';
            chip.querySelector('input').addEventListener('change', function () {
                if (this.checked) selectedIds.add(this.dataset.assetid);
                else selectedIds.delete(this.dataset.assetid);
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
    // ASSET FILTER UI — Single-select radio (Graph 4)
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
                    c.classList.remove('selected');
                    c.style.border = '1.5px solid #d0d0d0';
                    c.style.background = '';
                    c.style.fontWeight = '';
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
    // GRAPH 1: LIVE — Line chart
    // ===========================
    function g1_init(containerId) {
        g1.containerId = containerId;
        g1.selectedIds = new Set();
        if (g1.refreshTimer) { clearInterval(g1.refreshTimer); g1.refreshTimer = null; }

        var dom = document.getElementById(containerId);
        if (!dom) return;
        var ex = echarts.getInstanceByDom(dom); if (ex) ex.dispose();
        g1.chartInstance = echarts.init(dom, null, { renderer: 'canvas' });
        g1.chartInstance.showLoading({ text: 'Loading data...', color: '#12CC7D', maskColor: 'rgba(255,255,255,0.8)' });

        ensureAssets(function (assets) {
            assets.forEach(function (a) { g1.selectedIds.add(a.AssetId); });

            ensureLiveCache(assets, function () {
                // ✅ Cache ready — render immediately, filter changes are instant from here
                renderAssetFilter(containerId, assets, g1.selectedIds, function (ids) {
                    g1_render(getLiveRows(ids), ids);   // no loading, no API call
                });
                g1_render(getLiveRows(Array.from(g1.selectedIds)), Array.from(g1.selectedIds));

                // Background refresh every 2 minutes — no spinner, updates cache then re-renders
                g1.refreshTimer = setInterval(function () {
                    refreshLiveCache(function () {
                        g1_render(getLiveRows(Array.from(g1.selectedIds)), Array.from(g1.selectedIds));
                    });
                }, 120000);
            });
        });

        window.addEventListener('resize', function () { if (g1.chartInstance) g1.chartInstance.resize(); });
    }

    function g1_render(rows, selectedIds) {
        if (!g1.chartInstance) return;
        if (!rows || !rows.length) { showNoData(g1.chartInstance, 'No live data available'); return; }

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
                    // Deduplicate: keep only one entry per series name (axis trigger can return
                    // multiple points from the same series when lines overlap at the same timestamp)
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
            //legend: { type: 'scroll', top: 5, left: 'center', textStyle: { fontSize: 12 }, data: series.map(function (s) { return s.name; }) },
            grid: { left: '6%', right: '4%', bottom: '12%', top: 55, containLabel: true },
            xAxis: {
                type: 'time', boundaryGap: false,
                axisLabel: { fontSize: 10, color: '#555', formatter: function (v) { var d = new Date(v); return d.getHours() + ':' + String(d.getMinutes()).padStart(2, '0'); } },
                splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } }
            },
            yAxis: {
                type: 'value', name: 'Temperature (°C)',
                nameLocation: 'middle', nameGap: 50, nameRotate: 90,
                nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#333' },
                axisLabel: { formatter: '{value}°', fontSize: 10, color: '#666' },
                splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } }
            },
            dataZoom: [{ type: 'inside', start: 0, end: 100 }, { type: 'slider', show: true, start: 0, end: 100, height: 15, bottom: 10 }],
            series: series,
            animation: false
        }, true);
    }

    // ===========================
    // GRAPH 2: PEAK TEMPERATURE — Bar chart
    // ===========================
    function g2_init(containerId) {
        g2.containerId = containerId;
        g2.selectedIds = new Set();

        var dom = document.getElementById(containerId);
        if (!dom) return;
        var ex = echarts.getInstanceByDom(dom); if (ex) ex.dispose();
        g2.chartInstance = echarts.init(dom, null, { renderer: 'canvas' });
        g2.chartInstance.showLoading({ text: 'Loading data...', color: '#5470C6', maskColor: 'rgba(255,255,255,0.8)' });

        ensureAssets(function (assets) {
            assets.forEach(function (a) { g2.selectedIds.add(a.AssetId); });

            ensureAvgCache(assets, function () {
                // ✅ Cache ready — render immediately, filter changes are instant from here
                renderAssetFilter(containerId, assets, g2.selectedIds, function (ids) {
                    g2_render(getAvgRows(ids), ids);   // no loading, no API call
                });
                g2_render(getAvgRows(Array.from(g2.selectedIds)), Array.from(g2.selectedIds));
            });
        });

        window.addEventListener('resize', function () { if (g2.chartInstance) g2.chartInstance.resize(); });
    }

    function g2_render(rows, selectedIds) {
        if (!g2.chartInstance) return;
        if (!rows || !rows.length) { showNoData(g2.chartInstance, 'No data available'); return; }

        var xLabels = [];
        for (var h = 1; h <= 24; h++) { xLabels.push(String(h)); }

        var series = [];
        selectedIds.forEach(function (assetId) {
            var assetName = getAssetName(assetId);
            var color = getAssetColorById(assetId);
            var assetRows = rows.filter(function (r) { return r.Asset === assetName; });

            var hourMap = {};
            for (var h = 1; h <= 24; h++) { hourMap[h] = 0; }
            assetRows.forEach(function (r) {
                var hr = parseInt(r.TransactionHour) || 0;
                var temp = parseFloat(r.Temperature) || 0;
                if (hr >= 1 && hr <= 24) { hourMap[hr] = temp; }
            });

            var data = [];
            var peakVal = -Infinity, peakIdx = 0;
            for (var h = 1; h <= 24; h++) {
                data.push(hourMap[h]);
                if (hourMap[h] > peakVal) { peakVal = hourMap[h]; peakIdx = h - 1; }
            }


            var rgb = hexToRgbInline(color);
            var capturedColor = color;
            var capturedPeakVal = peakVal;
            var capturedPeakIdx = peakIdx;
         
            series.push({
                name: assetName,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: { width: 2.5, color: capturedColor },
                itemStyle: { color: capturedColor },
                areaStyle: { color: 'rgba(' + rgb + ',0.06)' },
                //areaStyle: {
                //    color: {
                //        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                //        colorStops: [
                //            { offset: 0, color: 'rgba(' + rgbColor + ', 0.30)' },
                //            { offset: 1, color: 'rgba(' + rgbColor + ', 0.03)' }
                //        ]
                //    }
                //},
                data: data,
                markPoint: (function (pv, pi) {
                    return {
                        symbol: 'circle', symbolSize: 14,
                        itemStyle: { color: '#e74c3c', borderColor: '#fff', borderWidth: 2 },
                        label: { show: true, position: 'top', fontSize: 9, fontWeight: '700', color: '#e74c3c', formatter: function (p) { return p.value.toFixed(1) + '°'; } },
                        data: [{ coord: [pi, pv], name: 'Peak Temp', value: pv }]
                    };
                }(capturedPeakVal, capturedPeakIdx))
            });
        });

        g2.chartInstance.hideLoading();
        g2.chartInstance.setOption({
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0,0,0,0.85)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1,
                textStyle: { color: '#fff', fontSize: 12 },
                formatter: function (params) {
                    if (!params.length) return '';
                    var html = '<div style="font-weight:bold;margin-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:4px;">Hour: ' + params[0].name + '</div>';
                    params.forEach(function (p) {
                        html += '<div style="margin:3px 0;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + p.color + ';margin-right:6px;"></span>' +
                            p.seriesName + ': <strong>' + (parseFloat(p.value) || 0).toFixed(2) + ' °C</strong></div>';
                    });
                    return html;
                }
            },
            //legend: { type: 'scroll', top: 5, left: 'center', textStyle: { fontSize: 12 }, data: series.map(function (s) { return s.name; }) },
            grid: { left: '6%', right: '4%', bottom: '14%', top: 55, containLabel: true },
            xAxis: { type: 'category', data: xLabels, name: 'Hour', nameLocation: 'middle', nameGap: 30, axisLabel: { fontSize: 9, color: '#666' }, axisLine: { lineStyle: { color: '#999' } } },
            yAxis: { type: 'value', name: 'Temperature (°C)', nameLocation: 'middle', nameGap: 50, nameRotate: 90, nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#333' }, axisLabel: { formatter: '{value}°', fontSize: 10, color: '#666' }, splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } } },
            dataZoom: [{ type: 'inside', start: 0, end: 100 }, { type: 'slider', show: true, start: 0, end: 100, height: 15, bottom: 10 }],
            series: series,
            animation: true
        }, true);
    }

    // ===========================
    // GRAPH 3: HOURLY AVERAGE — Bar chart
    // ===========================
    function g3_init(containerId) {
        g3.containerId = containerId;
        g3.selectedIds = new Set();

        var dom = document.getElementById(containerId);
        if (!dom) return;
        var ex = echarts.getInstanceByDom(dom); if (ex) ex.dispose();
        g3.chartInstance = echarts.init(dom, null, { renderer: 'canvas' });
        g3.chartInstance.showLoading({ text: 'Loading data...', color: '#5470C6', maskColor: 'rgba(255,255,255,0.8)' });

        ensureAssets(function (assets) {
            assets.forEach(function (a) { g3.selectedIds.add(a.AssetId); });

            ensureAvgCache(assets, function () {
                // ✅ Cache ready — render immediately, filter changes are instant from here
                renderAssetFilter(containerId, assets, g3.selectedIds, function (ids) {
                    g3_render(getAvgRows(ids), ids);   // no loading, no API call
                });
                g3_render(getAvgRows(Array.from(g3.selectedIds)), Array.from(g3.selectedIds));
            });
        });

        window.addEventListener('resize', function () { if (g3.chartInstance) g3.chartInstance.resize(); });
    }

    function g3_render(rows, selectedIds) {
        if (!g3.chartInstance) return;
        if (!rows || !rows.length) { showNoData(g3.chartInstance, 'No data available'); return; }

        var xLabels = [];
        for (var h = 1; h <= 24; h++) { xLabels.push(String(h)); }

        var series = [];
        selectedIds.forEach(function (assetId) {
            var assetName = getAssetName(assetId);
            var color = getAssetColorById(assetId);
            var assetRows = rows.filter(function (r) { return r.Asset === assetName; });

            var hourMap = {};
            for (var h = 1; h <= 24; h++) { hourMap[h] = 0; }
            assetRows.forEach(function (r) {
                var hr = parseInt(r.TransactionHour) || 0;
                var temp = parseFloat(r.Temperature) || 0;
                if (hr >= 1 && hr <= 24) { hourMap[hr] = temp; }
            });

            var data = [];
            for (var h = 1; h <= 24; h++) { data.push(hourMap[h]); }

            series.push({
                name: assetName, type: 'bar', barGap: '10%',
                data: data,
                itemStyle: { color: color, opacity: 0.85, borderRadius: [3, 3, 0, 0] }
            });
        });

        g3.chartInstance.hideLoading();
        g3.chartInstance.setOption({
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0,0,0,0.85)', borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1,
                textStyle: { color: '#fff', fontSize: 12 },
                formatter: function (params) {
                    if (!params.length) return '';
                    var html = '<div style="font-weight:bold;margin-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.3);padding-bottom:4px;">Hourly Avg: ' + params[0].name + '</div>';
                    params.forEach(function (p) {
                        html += '<div style="margin:3px 0;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:' + p.color + ';margin-right:6px;"></span>' +
                            p.seriesName + ': <strong>' + (parseFloat(p.value) || 0).toFixed(2) + ' °C</strong></div>';
                    });
                    return html;
                }
            },
            //legend: { type: 'scroll', top: 5, left: 'center', textStyle: { fontSize: 12 }, data: series.map(function (s) { return s.name; }) },
            grid: { left: '6%', right: '4%', bottom: '14%', top: 55, containLabel: true },
            xAxis: { type: 'category', data: xLabels, name: 'Hour', nameLocation: 'middle', nameGap: 30, axisLabel: { fontSize: 9, color: '#666' }, axisLine: { lineStyle: { color: '#999' } } },
            yAxis: { type: 'value', name: 'Avg Temperature (°C)', nameLocation: 'middle', nameGap: 50, nameRotate: 90, nameTextStyle: { fontSize: 12, fontWeight: 'bold', color: '#333' }, axisLabel: { formatter: '{value}°', fontSize: 10, color: '#666' }, splitLine: { show: true, lineStyle: { color: '#f0f0f0', type: 'dashed' } } },
            dataZoom: [{ type: 'inside', start: 0, end: 100 }, { type: 'slider', show: true, start: 0, end: 100, height: 15, bottom: 10 }],
            series: series,
            animation: true
        }, true);
    }

    // ===========================
    // GRAPH 4: THERMAL PROFILE HEATMAP — Single-select
    // ===========================
    function g4_init(containerId) {
        g4.containerId = containerId;
        g4.selectedId = null;

        var dom = document.getElementById(containerId);
        if (!dom) return;
        var ex = echarts.getInstanceByDom(dom); if (ex) ex.dispose();
        g4.chartInstance = echarts.init(dom, null, { renderer: 'canvas' });
        g4.chartInstance.showLoading({ text: 'Loading data...', color: '#5470C6', maskColor: 'rgba(255,255,255,0.8)' });

        ensureAssets(function (assets) {
            g4.selectedId = assets.length > 0 ? assets[0].AssetId : null;

            ensureAvgCache(assets, function () {
                // ✅ Cache ready — switching assets is instant from here
                renderAssetFilterSingle(containerId, assets, g4.selectedId, function (assetId) {
                    g4.selectedId = assetId;
                    g4_render(cache.avgByAssetId[assetId] || [], assetId);  // no loading, no API call
                });

                if (g4.selectedId) { g4_render(cache.avgByAssetId[g4.selectedId] || [], g4.selectedId); }
                else { showNoData(g4.chartInstance, 'No assets available'); }
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

        function hexToRgb(hex) {
            return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
        }
        var rgb = hexToRgb(color);
        var lightColor = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',0.1)';

        var assetRows = rows.filter(function (r) { return r.Asset === assetName; });
        var xLabels = [];
        for (var h = 1; h <= 24; h++) { xLabels.push(String(h)); }

        var data = assetRows.map(function (r) {
            var hr = parseInt(r.TransactionHour) || 1;
            var val = parseFloat(r.Temperature) || 0;
            return [hr - 1, assetName, parseFloat(val.toFixed(2))];
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
                    var hr = params.value[0] + 1;
                    var val = (params.value[2] || 0).toFixed(2);
                    return '<div style="font-weight:600;margin-bottom:4px;border-bottom:1px solid rgba(255,255,255,0.25);padding-bottom:4px;">Hour: ' + hr + ':00 – ' + (hr + 1) + ':00</div>' +
                        '<div style="margin-top:4px;">' + assetName + '</div>' +
                        '<div style="margin-top:2px;color:#90caf9;">Temperature: <strong style="color:#fff;">' + val + ' °C</strong></div>';
                }
            },
            grid: { left: '14%', right: '6%', bottom: '30%', top: '8%' },
            xAxis: { type: 'category', data: xLabels, splitArea: { show: true }, axisLabel: { fontSize: 10, color: '#555' } },
            yAxis: { type: 'category', data: [assetName], splitArea: { show: true }, axisLabel: { fontSize: 11, color: '#555' } },
            visualMap: {
                min: minVal, max: maxVal, calculable: true, orient: 'horizontal', left: 'center', bottom: '5%',
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