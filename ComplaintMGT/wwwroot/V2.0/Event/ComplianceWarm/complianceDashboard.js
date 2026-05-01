/**
 * Compliance Dashboard Module - Weekly View
 * Handles visualization of compliance data: Today, Current Week, Previous Week, Current Month
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

        getTodayRange: function () {
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            return {
                from: this.formatDate(startOfDay),
                to: this.formatDate(now)
            };
        },

        getCurrentWeekRange: function () {
            const now = new Date();
            const dayOfWeek = now.getDay();
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - dayOfWeek);
            startOfWeek.setHours(0, 0, 0, 0);
            return {
                from: this.formatDate(startOfWeek),
                to: this.formatDate(now)
            };
        },

        getPreviousWeekRange: function () {
            const now = new Date();
            const dayOfWeek = now.getDay();
            const startOfLastWeek = new Date(now);
            startOfLastWeek.setDate(now.getDate() - dayOfWeek - 7);
            startOfLastWeek.setHours(0, 0, 0, 0);
            const endOfLastWeek = new Date(startOfLastWeek);
            endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
            endOfLastWeek.setHours(23, 59, 59, 999);
            return {
                from: this.formatDate(startOfLastWeek),
                to: this.formatDate(endOfLastWeek)
            };
        },

        getCurrentMonthRange: function () {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
            return {
                from: this.formatDate(startOfMonth),
                to: this.formatDate(now)
            };
        }
    };

    const dateRanges = {
        today: DateUtils.getTodayRange(),
        currentWeek: DateUtils.getCurrentWeekRange(),
        previousWeek: DateUtils.getPreviousWeekRange(),
        currentMonth: DateUtils.getCurrentMonthRange()
    };

    const { from, to } = dateRanges.currentMonth;
    function getMonthName(dateStr) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const date = new Date(dateStr);
        return monthNames[date.getMonth()];
    }

    // Get current month name using the 'from' variable
    const currentMonthName = getMonthName(from);

    
    
    const timeLabels = ['Today', 'Curr Week', 'Prev Week', currentMonthName];

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
            const maxValue = 100;

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
                    max: maxValue,
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
                        label: { show: true, position: 'inside', formatter: '{c}%', fontSize: 12, color: '#333' },
                        barWidth: '60%',
                        data: [compliance]
                    },
                    {
                        name: 'Non Compliance',
                        type: 'bar',
                        stack: 'total',
                        color: COLORS.NON_COMPLIANCE,
                        label: { show: true, position: 'inside', formatter: '{c}%', fontSize: 12, color: '#333' },
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

        createWeeklyComparisonChart: function (deviceName, weeklyData) {
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

                grid: { left: '8', right: '8', bottom: '25', top: '15', containLabel: true },
                xAxis: {
                    type: 'category',
                    data: timeLabels,
                    axisLabel: {
                        interval: 0,
                        fontSize: 12,
                        //rotate: 20
                    }
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
                        data: weeklyData.compliance,
                        itemStyle: { borderRadius: [5, 5, 0, 0] },
                        color: COLORS.COMPLIANCE,
                        barWidth: '30%'
                    },
                    {
                        name: 'Non-compliance',
                        type: 'bar',
                        data: weeklyData.nonCompliance,
                        itemStyle: { borderRadius: [5, 5, 0, 0] },
                        color: COLORS.NON_COMPLIANCE,
                        barWidth: '30%'
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
                $.ajax({ type: "GET", url: `/Deshboard/ComplianceDashboardAllOverall_Warm?fromDate=${from}&toDate=${to}` }),
                $.ajax({ type: "GET", url: `/Deshboard/DiningWiseComplicanceofStore_Warm?fromDate=${from}&toDate=${to}` }),
                $.ajax({ type: "GET", url: `/Deshboard/ProductionWiseComplicanceofStore_Warm?fromDate=${from}&toDate=${to}` })
            ]).then(responses => {
                const [overallData, allDiningData, allProductionData] = responses.map(r => JSON.parse(r));
                const filteredDining = DataFilters.filterDining(allDiningData);
                const filteredProduction = DataFilters.filterProduction(allProductionData);

                const container = document.querySelector('.compliance');
                if (!container) return;
                container.innerHTML = '';



                // Always create all three cards
                this.createComplianceCard(container, 'overall', overallData[0] || {}, 'Overall', allDiningData.concat(allProductionData));
                this.createComplianceCard(container, 'dining', filteredDining[0] || {}, filteredDining[0]?.device || 'Store Dining Ambient', allDiningData);
                this.createComplianceCard(container, 'production', filteredProduction[0] || {}, filteredProduction[0]?.device || 'Production Area - Ambient', allProductionData);
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
                ModalManager.show(ChartBuilders.createDetailedBarChart(modalData.length > 0 ? modalData : [{ device: label, FirValue: 0, SecValue: 0 }]));
            });
        },

        renderWeeklyTrends: function () {
            const { from: fromToday, to: toToday } = dateRanges.today;
            const { from: fromCurrWeek, to: toCurrWeek } = dateRanges.currentWeek;
            const { from: fromPrevWeek, to: toPrevWeek } = dateRanges.previousWeek;
            const { from: fromCurrMonth, to: toCurrMonth } = dateRanges.currentMonth;

            // First, create Overall chart
            Promise.all([
                $.ajax({ type: "GET", url: `/Deshboard/ComplianceDashboardAllOverall_Warm?fromDate=${fromToday}&toDate=${toToday}` }),
                $.ajax({ type: "GET", url: `/Deshboard/ComplianceDashboardAllOverall_Warm?fromDate=${fromCurrWeek}&toDate=${toCurrWeek}` }),
                $.ajax({ type: "GET", url: `/Deshboard/ComplianceDashboardAllOverall_Warm?fromDate=${fromPrevWeek}&toDate=${toPrevWeek}` }),
                $.ajax({ type: "GET", url: `/Deshboard/ComplianceDashboardAllOverall_Warm?fromDate=${fromCurrMonth}&toDate=${toCurrMonth}` })
            ]).then(responses => {
                const [dataToday, dataCurrWeek, dataPrevWeek, dataCurrMonth] = responses.map(r => JSON.parse(r || '[]'));

                const gcontainer = document.querySelector('.gcontainer');
                if (!gcontainer) return;
                gcontainer.innerHTML = '';

                // Overall chart
                const overallDiv = document.createElement('div');
                overallDiv.className = 'eca-container_0';
                overallDiv.innerHTML = `
                    <div class="chart-containerETE1" id="pht0a"></div>
                    <div class="gheading">Overall</div>
                `;
                gcontainer.appendChild(overallDiv);

                const overallChart = echarts.init(document.getElementById('pht0a'));
                const overallOption = ChartBuilders.createWeeklyComparisonChart('Overall', {
                    compliance: [
                        dataToday[0]?.Compliance || 0,
                        dataCurrWeek[0]?.Compliance || 0,
                        dataPrevWeek[0]?.Compliance || 0,
                        dataCurrMonth[0]?.Compliance || 0
                    ],
                    nonCompliance: [
                        dataToday[0]?.nonCompliance || 0,
                        dataCurrWeek[0]?.nonCompliance || 0,
                        dataPrevWeek[0]?.nonCompliance || 0,
                        dataCurrMonth[0]?.nonCompliance || 0
                    ]
                });
                overallChart.setOption(overallOption);
                window.addEventListener('resize', () => overallChart.resize());
            });

            // Then create device-specific charts
            Promise.all([
                $.ajax({ type: "GET", url: `/Deshboard/DiningWiseComplicanceofStore_Warm?fromDate=${fromToday}&toDate=${toToday}` }),
                $.ajax({ type: "GET", url: `/Deshboard/DiningWiseComplicanceofStore_Warm?fromDate=${fromCurrWeek}&toDate=${toCurrWeek}` }),
                $.ajax({ type: "GET", url: `/Deshboard/DiningWiseComplicanceofStore_Warm?fromDate=${fromPrevWeek}&toDate=${toPrevWeek}` }),
                $.ajax({ type: "GET", url: `/Deshboard/DiningWiseComplicanceofStore_Warm?fromDate=${fromCurrMonth}&toDate=${toCurrMonth}` }),
                $.ajax({ type: "GET", url: `/Deshboard/ProductionWiseComplicanceofStore_Warm?fromDate=${fromToday}&toDate=${toToday}` }),
                $.ajax({ type: "GET", url: `/Deshboard/ProductionWiseComplicanceofStore_Warm?fromDate=${fromCurrWeek}&toDate=${toCurrWeek}` }),
                $.ajax({ type: "GET", url: `/Deshboard/ProductionWiseComplicanceofStore_Warm?fromDate=${fromPrevWeek}&toDate=${toPrevWeek}` }),
                $.ajax({ type: "GET", url: `/Deshboard/ProductionWiseComplicanceofStore_Warm?fromDate=${fromCurrMonth}&toDate=${toCurrMonth}` })
            ]).then(responses => {
                const [
                    diningToday, diningCurrWeek, diningPrevWeek, diningCurrMonth,
                    productionToday, productionCurrWeek, productionPrevWeek, productionCurrMonth
                ] = responses.map(r => JSON.parse(r || '[]'));

                const gcontainer = document.querySelector('.gcontainer');
                if (!gcontainer) return;

                const filteredDiningToday = DataFilters.filterDining(diningToday);
                const filteredDiningCurrWeek = DataFilters.filterDining(diningCurrWeek);
                const filteredDiningPrevWeek = DataFilters.filterDining(diningPrevWeek);
                const filteredDiningCurrMonth = DataFilters.filterDining(diningCurrMonth);

                const filteredProductionToday = DataFilters.filterProduction(productionToday);
                const filteredProductionCurrWeek = DataFilters.filterProduction(productionCurrWeek);
                const filteredProductionPrevWeek = DataFilters.filterProduction(productionPrevWeek);
                const filteredProductionCurrMonth = DataFilters.filterProduction(productionCurrMonth);

                // Always create Dining chart
                const diningName = filteredDiningToday[0]?.device || filteredDiningCurrWeek[0]?.device || filteredDiningPrevWeek[0]?.device || filteredDiningCurrMonth[0]?.device || 'Store Dining Ambient';
                this.createWeeklyChart(gcontainer, 1, diningName, {
                    today: filteredDiningToday[0] || { FirValue: 0, SecValue: 0 },
                    currWeek: filteredDiningCurrWeek[0] || { FirValue: 0, SecValue: 0 },
                    prevWeek: filteredDiningPrevWeek[0] || { FirValue: 0, SecValue: 0 },
                    currMonth: filteredDiningCurrMonth[0] || { FirValue: 0, SecValue: 0 }
                });

                // Always create Production chart
                const productionName = filteredProductionToday[0]?.device || filteredProductionCurrWeek[0]?.device || filteredProductionPrevWeek[0]?.device || filteredProductionCurrMonth[0]?.device || 'Production Area - Ambient';
                this.createWeeklyChart(gcontainer, 2, productionName, {
                    today: filteredProductionToday[0] || { FirValue: 0, SecValue: 0 },
                    currWeek: filteredProductionCurrWeek[0] || { FirValue: 0, SecValue: 0 },
                    prevWeek: filteredProductionPrevWeek[0] || { FirValue: 0, SecValue: 0 },
                    currMonth: filteredProductionCurrMonth[0] || { FirValue: 0, SecValue: 0 }
                });

            }).catch(err => console.error("Weekly trends error:", err));
        },

        createWeeklyChart: function (container, idx, deviceName, data) {
            const containerDiv = document.createElement('div');
            containerDiv.className = `eca-container_${idx}`;
            containerDiv.innerHTML = `
                <div class="chart-containerETE1" id="pht${idx}a"></div>
                <div class="gheading">${deviceName}</div>
            `;
            container.appendChild(containerDiv);

            const myChart = echarts.init(document.getElementById(`pht${idx}a`));
            const option = ChartBuilders.createWeeklyComparisonChart(deviceName, {
                compliance: [
                    data.today.FirValue || 0,
                    data.currWeek.FirValue || 0,
                    data.prevWeek.FirValue || 0,
                    data.currMonth.FirValue || 0
                ],
                nonCompliance: [
                    data.today.SecValue || 0,
                    data.currWeek.SecValue || 0,
                    data.prevWeek.SecValue || 0,
                    data.currMonth.SecValue || 0
                ]
            });
            myChart.setOption(option);
            window.addEventListener('resize', () => myChart.resize());
        },

        renderOperationsSchedule: function (scheduleType) {
            const urlPrefix = scheduleType === 'ops' ? 'Ops' : 'NonOps';
            const containerSelector = scheduleType === 'ops' ? '.row3_a .OsContainer' : '.row4_a .OsContainer';

            Promise.all([
                $.ajax({ type: "GET", url: `/Deshboard/ComplianceDashboardAllOverall${urlPrefix}_Warm?fromDate=${from}&toDate=${to}` }),
                $.ajax({ type: "GET", url: `/Deshboard/DiningWiseComplicanceofStore${urlPrefix}_Warm?fromDate=${from}&toDate=${to}` }),
                $.ajax({ type: "GET", url: `/Deshboard/ProductionWiseComplicanceofStore${urlPrefix}_Warm?fromDate=${from}&toDate=${to}` })
            ]).then(responses => {
                const [overallData, allDining, allProduction] = responses.map(r => JSON.parse(r || '[]'));
                const filteredDining = DataFilters.filterDining(allDining);
                const filteredProduction = DataFilters.filterProduction(allProduction);

                const container = document.querySelector(containerSelector);
                if (!container) return;
                container.innerHTML = '';

                // Always create all three gauge cards
                this.createGaugeCard(container, `${scheduleType}-overall`, overallData[0] || {}, 'Overall', allDining.concat(allProduction));
                this.createGaugeCard(container, `${scheduleType}-dining`, filteredDining[0] || {}, filteredDining[0]?.device || 'Store Dining Ambient', allDining);
                this.createGaugeCard(container, `${scheduleType}-production`, filteredProduction[0] || {}, filteredProduction[0]?.device || 'Production Area - Ambient', allProduction);

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
                ModalManager.show(ChartBuilders.createDetailedBarChart(modalData.length > 0 ? modalData : [{ device: label, FirValue: 0, SecValue: 0 }]));
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
                url: `/Deshboard/GetOperationsWiseCompliance_Warm?fromDate=${from}&toDate=${to}`,
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
            Renderers.renderWeeklyTrends();
            Renderers.renderOperationsSchedule('ops');
            Renderers.renderOperationsSchedule('nonops');
            Renderers.renderOperationsWiseCompliance();
        }
    };

})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => complianceDashboard.init());