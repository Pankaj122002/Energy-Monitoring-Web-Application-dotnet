/**
 * Compliance Dashboard Module
 * Handles visualization of compliance data across different operations
 */

var complianceDashboard = (function () {
    'use strict';

    // ============================================================================
    // CONFIGURATION & CONSTANTS
    // ============================================================================

    const COLORS = {
        COMPLIANCE: '#91cc75',
        NON_COMPLIANCE: '#ee6666'
    };

    const DEVICE_FILTERS = {
        DINING: ['Store Dining Ambient'],
        PRODUCTION: ['Production Area - Ambient']
    };

    // ============================================================================
    // UTILITY FUNCTIONS
    // ============================================================================

    const DateUtils = {
        formatDate: function (date) {
            const pad = num => num.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
        },

        getMonthRange: function (monthsBack) {
            const now = new Date();
            const fromDate = new Date(now.getFullYear(), now.getMonth() - monthsBack, 1, 0, 0, 0, 0);
            const toDate = monthsBack === 0
                ? now
                : new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 0, 23, 59, 59, 999);

            return {
                from: this.formatDate(fromDate),
                to: this.formatDate(toDate)
            };
        },

        getMonthName: function (dateStr) {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return monthNames[new Date(dateStr).getMonth()];
        }
    };

    // Initialize date ranges
    const dateRanges = {
        threeMonthsAgo: DateUtils.getMonthRange(3),
        twoMonthsAgo: DateUtils.getMonthRange(2),
        lastMonth: DateUtils.getMonthRange(1),
        currentMonth: DateUtils.getMonthRange(0),
        lastThreeMonths: (() => {
            const now = new Date();
            const from = new Date(now.getFullYear(), now.getMonth() - 3, 1, 0, 0, 0, 0);
            return {
                from: DateUtils.formatDate(from),
                to: DateUtils.formatDate(now)
            };
        })()
    };

    const { from, to } = dateRanges.lastThreeMonths;

    const monthLabels = [
        DateUtils.getMonthName(dateRanges.threeMonthsAgo.from),
        DateUtils.getMonthName(dateRanges.twoMonthsAgo.from),
        DateUtils.getMonthName(dateRanges.lastMonth.from),
        DateUtils.getMonthName(dateRanges.currentMonth.from)
    ];

    // ============================================================================
    // DATA FILTERS
    // ============================================================================

    const DataFilters = {
        filterByDeviceType: function (deviceData, deviceType) {
            const targetDevices = DEVICE_FILTERS[deviceType] || [];
            return deviceData.filter(device => targetDevices.includes(device.device));
        },

        filterDining: function (data) {
            return this.filterByDeviceType(data, 'DINING');
        },

        filterProduction: function (data) {
            return this.filterByDeviceType(data, 'PRODUCTION');
        }
    };

    // ============================================================================
    // CHART CONFIGURATION BUILDERS
    // ============================================================================

    const ChartBuilders = {
        createBarChart: function (compliance, nonCompliance, deviceName) {
            // const total = compliance + nonCompliance;  <-- OLD
            // const maxValue = Math.ceil(total * 1.0) || 100; <-- OLD
            const maxValue = 100; // FIXED: Set fixed max scale to 100 for consistency

            return {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    formatter: function (params) {
                        if (!params || !params.length) return '';
                        let result = `<strong>${deviceName}</strong><br/>`;
                        params.forEach(p => result += `${p.seriesName}: ${p.value}%<br/>`);
                        return result;
                    }
                },
                grid: { left: '10', right: '10', bottom: '10', top: '10', containLabel: true },
                xAxis: {
                    type: 'value',
                    max: maxValue, // Uses the fixed 100
                    min: 0,
                    splitLine: { show: true, lineStyle: { color: '#e0e0e0', type: 'dashed' } },
                    axisLabel: { color: '#666', fontSize: 10 },
                    axisLine: { show: true, lineStyle: { color: '#ccc' } }
                },
                yAxis: {
                    type: 'category',
                    data: [''],
                    axisLabel: { show: false },
                    axisLine: { show: false },
                    axisTick: { show: false }
                },
                series: [
                    {
                        name: 'Compliance',
                        type: 'bar',
                        stack: 'total',
                        color: COLORS.COMPLIANCE,
                        label: { show: true, position: 'inside', formatter: '{c}%', fontSize: 12,  color: '#333' }, // Added % sign
                        barWidth: '60%',
                        data: [compliance]
                    },
                    {
                        name: 'Non Compliance',
                        type: 'bar',
                        stack: 'total',
                        color: COLORS.NON_COMPLIANCE,
                        label: { show: true, position: 'inside', formatter: '{c}%', fontSize: 12,  color: '#333' }, // Added % sign
                        barWidth: '60%',
                        data: [nonCompliance]
                    }
                ]
            };
        },

        createDetailedBarChart: function (devices) {
            const deviceNames = devices.map(d => d.device);
            const complianceData = devices.map(d => d.FirValue || d.Compliance || 0);
            const nonComplianceData = devices.map(d => d.SecValue || d.nonCompliance || 0);

            return {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    formatter: function (params) {
                        if (!params || !params.length) return '';
                        const idx = params[0].dataIndex;
                        let result = `<strong>${deviceNames[idx]}</strong><br/>`;
                        params.forEach(p => result += `${p.seriesName}: ${p.value}%<br/>`);
                        return result;
                    }
                },
                grid: { left: '3%', right: '3%', bottom: '3%', top: '5%', containLabel: true },
                xAxis: { type: 'value', axisLabel: { color: '#333' } },
                yAxis: { type: 'category', data: deviceNames, axisLabel: { fontSize: 11, interval: 0 } },
                series: [
                    {
                        name: 'Compliance',
                        type: 'bar',
                        stack: 'total',
                        color: COLORS.COMPLIANCE,
                        label: { show: true, position: 'inside', formatter: '{c}%', fontSize: 11 },
                        itemStyle: { barBorderRadius: [0, 5, 5, 0] },
                        data: complianceData
                    },
                    {
                        name: 'Non Compliance',
                        type: 'bar',
                        stack: 'total',
                        color: COLORS.NON_COMPLIANCE,
                        label: { show: true, position: 'inside', formatter: '{c}%', fontSize: 11 },
                        itemStyle: { barBorderRadius: [0, 5, 5, 0] },
                        data: nonComplianceData
                    }
                ]
            };
        },

        createGaugeChart: function (compliance, nonCompliance) {
            return {
                tooltip: {
                    trigger: 'item',
                    formatter: params => `${params.name}: ${params.value}%`
                },
                series: [{
                    type: 'gauge',
                    startAngle: 90,
                    endAngle: -270,
                    pointer: { show: false },
                    progress: { show: true, overlap: false, roundCap: true, itemStyle: { borderWidth: 1 } },
                    radius: '95%',
                    axisLine: { lineStyle: { width: 15 } },
                    splitLine: { show: false },
                    axisTick: { show: false },
                    axisLabel: { show: false },
                    data: [
                        {
                            value: compliance,
                            name: 'Compliance',
                            title: { offsetCenter: ['0%', '-30%'], fontSize: 13, color: COLORS.COMPLIANCE, fontWeight: 'bold' },
                            detail: {
                                valueAnimation: true, offsetCenter: ['0%', '-10%'], fontSize: 11,
                                //fontWeight: 'bold',
                                color: COLORS.COMPLIANCE
                            },
                            itemStyle: { color: COLORS.COMPLIANCE }
                        },
                        {
                            value: nonCompliance,
                            name: 'Non Compliance',
                            title: { offsetCenter: ['0%', '30%'], fontSize: 13, color: COLORS.NON_COMPLIANCE, fontWeight: 'bold' },
                            detail: {
                                valueAnimation: true, offsetCenter: ['0%', '50%'], fontSize: 11,
                                //fontWeight: 'bold',
                                color: COLORS.NON_COMPLIANCE
                            },
                            itemStyle: { color: COLORS.NON_COMPLIANCE }
                        }
                    ],
                    detail: {
                        width: 100,
                        height: 30,
                        fontSize: 11,
                        fontWeight: 'bold',
                        color: 'inherit',
                        formatter: '{value}%'
                    }
                }]
            };
        },

        createMonthlyComparisonChart: function (deviceName, monthlyData) {
            return {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    formatter: function (params) {
                        let tooltip = params[0].axisValue + '<br/>';
                        params.forEach(p => {
                            tooltip += `${p.marker} ${p.seriesName}: ${p.value}%<br/>`;
                        });
                        return tooltip;
                    }
                },
                grid: { left: '5', right: '5', bottom: '5', top: '10', containLabel: true },
                xAxis: {
                    type: 'category',
                    data: monthLabels,
                    axisLabel: { interval: 0, fontSize: 12 }
                },
                yAxis: {
                    type: 'value',
                    max: 100, // FIXED: Force Y-axis to 100%
                    min: 0
                },
                series: [
                    {
                        name: 'Compliance',
                        type: 'bar',
                        data: monthlyData.compliance,
                        itemStyle: { borderRadius: [5, 5, 0, 0] },
                        color: COLORS.COMPLIANCE,
                        barWidth: '35%'
                    },
                    {
                        name: 'Non-compliance',
                        type: 'bar',
                        data: monthlyData.nonCompliance,
                        itemStyle: { borderRadius: [5, 5, 0, 0] },
                        color: COLORS.NON_COMPLIANCE,
                        barWidth: '35%'
                    }
                ]
            };
        }
    };

    // ============================================================================
    // MODAL MANAGEMENT
    // ============================================================================

    const ModalManager = {
        create: function () {
            const modal = document.createElement('div');
            modal.className = 'detail-modal';
            modal.id = 'detailModal';
            modal.innerHTML = `
        <div class="modal-content">
          <button class="modal-close" id="modalClose">&times;</button>
          <div class="modal-chart-container" id="modalChart"></div>
        </div>
      `;
            document.body.appendChild(modal);

            modal.querySelector('#modalClose').addEventListener('click', () => modal.classList.remove('show'));
            modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });

            return modal;
        },

        show: function (chartData) {
            let modal = document.getElementById('detailModal');
            if (!modal) modal = this.create();

            modal.classList.add('show');
            const modalChart = echarts.init(document.getElementById('modalChart'));
            modalChart.setOption(chartData);
            setTimeout(() => modalChart.resize(), 100);
        }
    };

    // ============================================================================
    // MAIN RENDERING FUNCTIONS
    // ============================================================================

    const Renderers = {
        renderComplianceOverview: function () {
            Promise.all([
                $.ajax({ type: "GET", url: `/Deshboard/ComplianceDashboardAllOverall_Cold?fromDate=${from}&toDate=${to}` }),
                $.ajax({ type: "GET", url: `/Deshboard/DiningWiseComplicanceofStore_Cold?fromDate=${from}&toDate=${to}` }),
                $.ajax({ type: "GET", url: `/Deshboard/ProductionWiseComplicanceofStore_Cold?fromDate=${from}&toDate=${to}` })
            ]).then(responses => {
                const [overallData, allDiningData, allProductionData] = responses.map(r => JSON.parse(r));
                const filteredDining = DataFilters.filterDining(allDiningData);
                const filteredProduction = DataFilters.filterProduction(allProductionData);

                const container = document.querySelector('.compliance');
                if (!container) return;
                container.innerHTML = '';

                // Create cards
                this.createComplianceCard(container, 'overall', overallData[0], 'Overall', allDiningData.concat(allProductionData));
                this.createComplianceCard(container, 'dining', filteredDining[0], filteredDining[0]?.device || 'Dining', allDiningData);
                this.createComplianceCard(container, 'production', filteredProduction[0], filteredProduction[0]?.device || 'Production', allProductionData);
            }).catch(err => console.error("Compliance overview error:", err));
        },

        createComplianceCard: function (container, type, data, label, modalData) {
            const id = `compliance_${type}`;
            const div = document.createElement('div');
            div.className = 'compliance-card';
            div.innerHTML = `
        <div class="compliance-button-header">
          <button class="detail-toggle-btn" data-type="${type}">+</button>
        </div>
        <div class="chart-containerGuest" id="${id}"></div>
        <div class="gheading">${label}</div>
      `;
            container.appendChild(div);

            const chart = echarts.init(document.getElementById(id));
            chart.setOption(ChartBuilders.createBarChart(
                data?.FirValue || data?.Compliance || 0,
                data?.SecValue || data?.nonCompliance || 0,
                label
            ));
            window.addEventListener('resize', () => chart.resize());

            div.querySelector('.detail-toggle-btn').addEventListener('click', () => {
                ModalManager.show(ChartBuilders.createDetailedBarChart(modalData));
            });
        },

        renderMonthlyTrends: function () {
            const { from: from1, to: to1 } = dateRanges.threeMonthsAgo;
            const { from: from2, to: to2 } = dateRanges.twoMonthsAgo;
            const { from: from3, to: to3 } = dateRanges.lastMonth;
            const { from: from4, to: to4 } = dateRanges.currentMonth;

            Promise.all([
                // Month 1 - Dining
                $.ajax({ type: "GET", url: `/Deshboard/DiningWiseComplicanceofStore_Cold?fromDate=${from1}&toDate=${to1}` }),
                // Month 2 - Dining
                $.ajax({ type: "GET", url: `/Deshboard/DiningWiseComplicanceofStore_Cold?fromDate=${from2}&toDate=${to2}` }),
                // Month 3 - Dining
                $.ajax({ type: "GET", url: `/Deshboard/DiningWiseComplicanceofStore_Cold?fromDate=${from3}&toDate=${to3}` }),
                // Month 4 - Dining
                $.ajax({ type: "GET", url: `/Deshboard/DiningWiseComplicanceofStore_Cold?fromDate=${from4}&toDate=${to4}` }),
                // Month 1 - Production
                $.ajax({ type: "GET", url: `/Deshboard/ProductionWiseComplicanceofStore_Cold?fromDate=${from1}&toDate=${to1}` }),
                // Month 2 - Production
                $.ajax({ type: "GET", url: `/Deshboard/ProductionWiseComplicanceofStore_Cold?fromDate=${from2}&toDate=${to2}` }),
                // Month 3 - Production
                $.ajax({ type: "GET", url: `/Deshboard/ProductionWiseComplicanceofStore_Cold?fromDate=${from3}&toDate=${to3}` }),
                // Month 4 - Production
                $.ajax({ type: "GET", url: `/Deshboard/ProductionWiseComplicanceofStore_Cold?fromDate=${from4}&toDate=${to4}` })
            ]).then(responses => {
                const [dining1, dining2, dining3, dining4, production1, production2, production3, production4] = responses.map(r => JSON.parse(r || '[]'));

                const gcontainer = document.querySelector('.gcontainer');
                if (!gcontainer) return;
                gcontainer.innerHTML = '';

                const filteredDining1 = DataFilters.filterDining(dining1);
                const filteredDining2 = DataFilters.filterDining(dining2);
                const filteredDining3 = DataFilters.filterDining(dining3);
                const filteredDining4 = DataFilters.filterDining(dining4);

                const filteredProduction1 = DataFilters.filterProduction(production1);
                const filteredProduction2 = DataFilters.filterProduction(production2);
                const filteredProduction3 = DataFilters.filterProduction(production3);
                const filteredProduction4 = DataFilters.filterProduction(production4);

                const data1 = filteredDining1.concat(filteredProduction1);
                const data2 = filteredDining2.concat(filteredProduction2);
                const data3 = filteredDining3.concat(filteredProduction3);
                const data4 = filteredDining4.concat(filteredProduction4);

                const deviceSet = new Set();
                [data1, data2, data3, data4].forEach(dataset => {
                    dataset.forEach(d => deviceSet.add(d.device));
                });

                let devices = Array.from(deviceSet);

                // Create device charts
                devices.forEach((deviceName, idx) => {
                    const device1 = data1.find(d => d.device === deviceName) || { FirValue: 0, SecValue: 0 };
                    const device2 = data2.find(d => d.device === deviceName) || { FirValue: 0, SecValue: 0 };
                    const device3 = data3.find(d => d.device === deviceName) || { FirValue: 0, SecValue: 0 };
                    const device4 = data4.find(d => d.device === deviceName) || { FirValue: 0, SecValue: 0 };

                    const containerDiv = document.createElement('div');
                    containerDiv.className = `eca-container_${idx + 1}`;
                    containerDiv.innerHTML = `
            <div class="chart-containerETE1" id="pht${idx}a"></div>
            <div class="gheading">${deviceName}</div>
          `;
                    gcontainer.appendChild(containerDiv);

                    const myChart = echarts.init(document.getElementById(`pht${idx}a`));
                    const option = ChartBuilders.createMonthlyComparisonChart(deviceName, {
                        compliance: [
                            device1.FirValue || 0,
                            device2.FirValue || 0,
                            device3.FirValue || 0,
                            device4.FirValue || 0
                        ],
                        nonCompliance: [
                            device1.SecValue || 0,
                            device2.SecValue || 0,
                            device3.SecValue || 0,
                            device4.SecValue || 0
                        ]
                    });

                    myChart.setOption(option);
                    window.addEventListener('resize', () => myChart.resize());
                });

            }).catch(err => console.error("Monthly trends error:", err));

            // Overall monthly chart
            Promise.all([
                $.ajax({ type: "GET", url: `/Deshboard/ComplianceDashboardAllOverall_Cold?fromDate=${from1}&toDate=${to1}` }),
                $.ajax({ type: "GET", url: `/Deshboard/ComplianceDashboardAllOverall_Cold?fromDate=${from2}&toDate=${to2}` }),
                $.ajax({ type: "GET", url: `/Deshboard/ComplianceDashboardAllOverall_Cold?fromDate=${from3}&toDate=${to3}` }),
                $.ajax({ type: "GET", url: `/Deshboard/ComplianceDashboardAllOverall_Cold?fromDate=${from4}&toDate=${to4}` })
            ]).then(responses => {
                const [data1, data2, data3, data4] = responses.map(r => JSON.parse(r || '[]'));

                const gcontainer = document.querySelector('.gcontainer');
                if (!gcontainer) return;

                const overallDiv = document.createElement('div');
                overallDiv.className = 'eca-container_0';
                overallDiv.innerHTML = `
          <div class="chart-containerETE1" id="pht0a"></div>
          <div class="gheading">Overall</div>
        `;
                gcontainer.insertBefore(overallDiv, gcontainer.firstChild);

                const myChart = echarts.init(document.getElementById('pht0a'));
                const option = ChartBuilders.createMonthlyComparisonChart('Overall', {
                    compliance: [
                        data1[0]?.Compliance || 0,
                        data2[0]?.Compliance || 0,
                        data3[0]?.Compliance || 0,
                        data4[0]?.Compliance || 0
                    ],
                    nonCompliance: [
                        data1[0]?.nonCompliance || 0,
                        data2[0]?.nonCompliance || 0,
                        data3[0]?.nonCompliance || 0,
                        data4[0]?.nonCompliance || 0
                    ]
                });

                myChart.setOption(option);
                window.addEventListener('resize', () => myChart.resize());
            });
        },

        renderOperationsSchedule: function (scheduleType) {
            const urlPrefix = scheduleType === 'ops' ? 'Ops' : 'NonOps';
            const containerSelector = scheduleType === 'ops' ? '.row3_a .OsContainer' : '.row4_a .OsContainer';

            Promise.all([
                $.ajax({ type: "GET", url: `/Deshboard/ComplianceDashboardAllOverall${urlPrefix}_Cold?fromDate=${from}&toDate=${to}` }),
                $.ajax({ type: "GET", url: `/Deshboard/DiningWiseComplicanceofStore${urlPrefix}_Cold?fromDate=${from}&toDate=${to}` }),
                $.ajax({ type: "GET", url: `/Deshboard/ProductionWiseComplicanceofStore${urlPrefix}_Cold?fromDate=${from}&toDate=${to}` })
            ]).then(responses => {
                const [overallData, allDining, allProduction] = responses.map(r => JSON.parse(r || '[]'));
                const filteredDining = DataFilters.filterDining(allDining);
                const filteredProduction = DataFilters.filterProduction(allProduction);

                const container = document.querySelector(containerSelector);
                if (!container) return;
                container.innerHTML = '';

                // Overall gauge
                this.createGaugeCard(container, `${scheduleType}-overall`, overallData[0], 'Overall', allDining.concat(allProduction));

                // Dining gauges
                if (filteredDining.length === 0) {
                    this.createGaugeCard(container, `${scheduleType}-dining`, null, 'Dining', allDining);
                } else {
                    filteredDining.forEach((device, i) =>
                        this.createGaugeCard(container, `${scheduleType}-dining-${i}`, device, device.device, allDining)
                    );
                }

                // Production gauges
                if (filteredProduction.length === 0) {
                    this.createGaugeCard(container, `${scheduleType}-production`, null, 'Production', allProduction);
                } else {
                    filteredProduction.forEach((device, i) =>
                        this.createGaugeCard(container, `${scheduleType}-production-${i}`, device, device.device, allProduction)
                    );
                }
            }).catch(err => console.error(`${scheduleType} schedule error:`, err));
        },

        createGaugeCard: function (container, type, data, label, modalData) {
            const id = `gauge_${type.replace(/-/g, '_')}`;
            const div = document.createElement('div');
            div.className = 'ops-gauge-card';
            div.innerHTML = `
        <div class="ops-gauge-header">
          <button class="detail-toggle-btn" data-type="${type}">+</button>
        </div>
        <div class="chart-containerGuest" id="${id}"></div>
        <div class="device-label">${label}</div>
      `;
            container.appendChild(div);

            const chart = echarts.init(document.getElementById(id));
            chart.setOption(ChartBuilders.createGaugeChart(
                data?.FirValue || data?.Compliance || 0,
                data?.SecValue || data?.nonCompliance || 0
            ));
            window.addEventListener('resize', () => chart.resize());

            div.querySelector('.detail-toggle-btn').addEventListener('click', () => {
                ModalManager.show(ChartBuilders.createDetailedBarChart(modalData));
            });
        },

        renderOperationsWiseCompliance: function () {
            const dom = document.getElementById('osw-gContainer');
            if (!dom || typeof echarts === 'undefined') return;

            const chart = echarts.init(dom);
            let animationRunning = true;
            let intervalId = null;
            let scatterOption, barOption, currentOption;

            $.ajax({
                type: "GET",
                url: `/Deshboard/GetOperationsWiseCompliance_Cold?fromDate=${from}&toDate=${to}`,
                success: function (data) {
                    const jsonData = JSON.parse(data || '[]');
                    if (!jsonData.length) {
                        chart.setOption({ title: { text: 'Data not available', left: 'center', top: 'middle' } });
                        return;
                    }

                    const categories = jsonData.map(i => i.SiteOperationWindow || 'Unknown');

                    // Scatter chart
                    scatterOption = {
                        tooltip: {
                            trigger: 'item',
                            formatter: p => `<strong>${p.name}</strong><br/>${p.seriesName}: ${p.value[0].toFixed(2)}%`
                        },
                        xAxis: { type: 'value', min: 0, max: 100 },
                        yAxis: { type: 'value', min: 0, max: 100 },
                        series: [
                            {
                                name: 'Compliance',
                                type: 'scatter',
                                symbolSize: 14,
                                itemStyle: { color: COLORS.COMPLIANCE },
                                data: jsonData.map(i => ({
                                    name: i.SiteOperationWindow || 'Unknown',
                                    value: [Number(i.CompliancePercent) || 0, Number(i.CompliancePercent) || 0]
                                })),
                                universalTransition: { enabled: true }
                            },
                            {
                                name: 'Non-Compliance',
                                type: 'scatter',
                                symbolSize: 14,
                                itemStyle: { color: COLORS.NON_COMPLIANCE },
                                data: jsonData.map(i => ({
                                    name: i.SiteOperationWindow || 'Unknown',
                                    value: [Number(i.NonCompliancePercent) || 0, Number(i.NonCompliancePercent) || 0]
                                })),
                                universalTransition: { enabled: true }
                            }
                        ]
                    };

                    // Bar chart
                    barOption = {
                        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
                        legend: { data: ['Compliance', 'Non-Compliance'] },
                        xAxis: {
                            type: 'category',
                            data: categories,
                            axisLabel: { rotate: 25, interval: 0, fontSize: 10 }
                        },
                        yAxis: { type: 'value', min: 0, max: 100 },
                        series: [
                            {
                                name: 'Compliance',
                                type: 'bar',
                                color: COLORS.COMPLIANCE,
                                data: jsonData.map(i => Number(i.CompliancePercent) || 0),
                                universalTransition: { enabled: true }
                            },
                            {
                                name: 'Non-Compliance',
                                type: 'bar',
                                color: COLORS.NON_COMPLIANCE,
                                data: jsonData.map(i => Number(i.NonCompliancePercent) || 0),
                                universalTransition: { enabled: true }
                            }
                        ]
                    };

                    currentOption = scatterOption;
                    chart.setOption(currentOption);

                    const toggleChart = () => {
                        currentOption = currentOption === scatterOption ? barOption : scatterOption;
                        chart.setOption(currentOption, true);
                    };

                    intervalId = setInterval(toggleChart, 3000);

                    const toggleBtn = document.getElementById('toggleAnimBtn');
                    if (toggleBtn) {
                        toggleBtn.onclick = () => {
                            animationRunning = !animationRunning;
                            toggleBtn.textContent = animationRunning ? 'Stop Animation' : 'Start Animation';
                            if (animationRunning) {
                                intervalId = setInterval(toggleChart, 3000);
                            } else {
                                clearInterval(intervalId);
                            }
                        };
                    }

                    window.addEventListener('resize', () => chart.resize());
                },
                error: err => console.error("Operations wise compliance error:", err)
            });
        }
    };

    // ============================================================================
    // PUBLIC API
    // ============================================================================

    return {
        init: function () {
            Renderers.renderComplianceOverview();
            Renderers.renderMonthlyTrends();
            Renderers.renderOperationsSchedule('ops');
            Renderers.renderOperationsSchedule('nonops');
            Renderers.renderOperationsWiseCompliance();
        }
    };

})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => complianceDashboard.init());