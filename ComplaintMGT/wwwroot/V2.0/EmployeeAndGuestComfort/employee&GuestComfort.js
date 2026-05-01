var guestComfortDashboard = function () {

    // ============================================================================
    // 1. UTILITIES & MODAL CONFIGURATION (NEW)
    // ============================================================================

    // Manages opening/closing the popup window
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
        show: function (chartOption) {
            let modal = document.getElementById('detailModal');
            if (!modal) modal = this.create();
            modal.classList.add('show');

            const chartDom = document.getElementById('modalChart');
            // Dispose existing instance to avoid conflicts
            if (echarts.getInstanceByDom(chartDom)) {
                echarts.getInstanceByDom(chartDom).dispose();
            }
            const modalChart = echarts.init(chartDom);
            modalChart.setOption(chartOption);
            setTimeout(() => modalChart.resize(), 100);
        }
    };

    // Helper to build the chart inside the popup
    const ChartBuilders = {
        createDetailedComfortChart: function (dataList, title) {
            const deviceNames = dataList.map(d => d.deviceName || d.device || 'Unknown');
            const overCooling = dataList.map(d => d.OverCooling || 0);
            const underCooling = dataList.map(d => d.UnderCooling || 0);
            const compliance = dataList.map(d => d.Compliance || 0);

            return {
                title: { text: title, left: 'center' },
                tooltip: {
                    trigger: 'axis', axisPointer: { type: 'shadow' },
                    formatter: function (params) {
                        let result = `<div style="text-align: left;"><strong>${params[0].axisValue}</strong><br/>`;
                        params.forEach(item => {
                            result += `<div style="display: flex; justify-content: space-between; min-width: 150px;"><span>${item.marker} ${item.seriesName}</span><span style="margin-left: 20px;"><strong>${item.value}%</strong></span></div>`;
                        });
                        return result + '</div>';
                    }
                },
                legend: { bottom: 0 },
                grid: { left: '3%', right: '3%', bottom: '10%', top: '10%', containLabel: true },
                xAxis: { type: 'value', max: 100 },
                yAxis: {
                    type: 'category',
                    data: deviceNames,
                    axisLabel: { interval: 0, width: 150, overflow: 'truncate' }
                },
                series: [
                    {
                        name: 'OverCooling',
                        type: 'bar',
                        stack: 'total',
                        color: '#80bdff',
                        data: overCooling
                    },
                    {
                        name: 'UnderCooling',
                        type: 'bar',
                        stack: 'total',
                        color: '#f28b82',
                        data: underCooling
                    },
                    {
                        name: 'Compliance',
                        type: 'bar',
                        stack: 'total',
                        color: '#81c784',
                        data: compliance
                    }
                ]
            };
        }
    };

    function formatDate(date) {
        const pad = num => num.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }



    function gettodayRange() {
        const toDate = new Date(); // Current date & time

        const fromDate = new Date(toDate); // Copy current date
        fromDate.setDate(toDate.getDate()); // 0 days ago
        fromDate.setHours(0, 0, 0, 0); // Set time to 12:00 AM

        return {
            from: formatDate(fromDate),
            to: formatDate(toDate)
        };
    }

    function getLastHourRange() {
        const toDate = new Date();
        const fromDate = new Date(toDate);
        fromDate.setHours(toDate.getHours() - 1);
        return {
            from1: formatDate(fromDate),
            to1: formatDate(toDate)
        };
    }

    const { from1, to1 } = getLastHourRange();

    const { from, to } = gettodayRange();


    var _echartsguestA1ChartDashboard = function () {
        var dom = document.getElementById('guest-container1');
        if (!dom) return;
        var myChart = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });
        myChart.showLoading();

        $.ajax({
            type: "GET",
            url: "/Deshboard/GetEmployeeGuestComfortDashboard_Hot?fromDate=" + from + "&toDate=" + to,
            success: function (data) {
                myChart.hideLoading();
                var myJSON = JSON.parse(data);
                var guestComfort = myJSON[0].guestComfort || 0;
                var employeeComfort = myJSON[0].employeeComfort || 0;

                const gaugeData = [
                    { value: employeeComfort, name: 'Employee', title: { offsetCenter: ['-55%', '90%'] }, detail: { offsetCenter: ['-55%', '115%'] } },
                    { value: guestComfort, name: 'Guest', title: { offsetCenter: ['50%', '90%'] }, detail: { offsetCenter: ['50%', '115%'] } }
                ];

                var option = {
                    tooltip: { trigger: 'item', formatter: '{b}: {c}%' },
                    series: [{
                        type: 'gauge', min: 0, max: 100,
                        axisLabel: { show: false },
                        anchor: { show: true, showAbove: true, size: 18, itemStyle: { color: '#FAC858' } },
                        pointer: { icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z', width: 8, length: '65%', offsetCenter: [0, '8%'] },
                        progress: { show: true, overlap: true, roundCap: true },
                        axisLine: { roundCap: true },
                        data: gaugeData,
                        title: { fontSize: 10 },
                        detail: { width: 40, height: 14, fontSize: 12, color: '#fff', backgroundColor: 'inherit', borderRadius: 3, formatter: '{value}%' }
                    }]
                };
                myChart.setOption(option);
            },
            error: function (err) {
                myChart.hideLoading();
                console.error("Error fetching data:", err);
            }
        });
        window.addEventListener('resize', () => myChart.resize());
    };

    // --- EMPLOYEE CHART (UPDATED WITH PLUS BUTTON) ---
    var _echartsguestA2ChartDashboard = function () {
        var dom = document.getElementById('guest-container2');
        if (!dom) return;
        var myChart = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });
        myChart.showLoading();

        $.ajax({
            type: "GET",
            url: "/Deshboard/GetEmployeeGuestComfortDashboardDetail_Hot?fromDate=" + from + "&toDate=" + to,
            success: function (data) {
                myChart.hideLoading();
                var myJSON = JSON.parse(data);

                // 1. Data for Main Chart (Employee Overall)
                let employeeComfort = myJSON.find(d => d.deviceName == 'Employee Overall') || {};
                let EmployeeOverCooling = employeeComfort.OverCooling || 0;
                let EmployeeUnderCooling = employeeComfort.UnderCooling || 0;
                let EmployeeCompliance = employeeComfort.Compliance || 0;

                // Replace the internal filtering logic for Employee
                const employeeModalData = myJSON.filter(item => {
                    // Check for "11" as a string or number
                    return String(item.AssetTypeID) === "11";
                });

                // Update the click handler
                const btnEmployee = document.getElementById('btn-detail-employee');
                if (btnEmployee) {
                    btnEmployee.onclick = function () {
                        if (employeeModalData.length === 0) {
                            alert("No data found for Employee");
                        } else {
                            const config = ChartBuilders.createDetailedComfortChart(employeeModalData, 'Employee Details');
                            ModalManager.show(config);
                        }
                    };
                }

                var option = {
                    tooltip: {
                        trigger: 'axis', axisPointer: { type: 'shadow' },
                        formatter: function (params) {
                            let result = `<div style="text-align: left;"><strong>${params[0].axisValue}</strong><br/>`;
                            params.forEach(item => {
                                result += `<div style="display: flex; justify-content: space-between; min-width: 150px;"><span>${item.marker} ${item.seriesName}</span><span style="margin-left: 20px;"><strong>${item.value}%</strong></span></div>`;
                            });
                            return result + '</div>';
                        }
                    },
                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                    xAxis: { type: 'value', max: 100 },
                    yAxis: { type: 'category', data: ['Employee'] },
                    series: [
                        { name: 'OverCooling', type: 'bar', stack: 'total', itemStyle: { color: '#80bdff' }, data: [EmployeeOverCooling] },
                        { name: 'UnderCooling', type: 'bar', stack: 'total', itemStyle: { color: '#f28b82' }, data: [EmployeeUnderCooling] },
                        { name: 'Compliance', type: 'bar', stack: 'total', itemStyle: { color: '#81c784' }, data: [EmployeeCompliance] }
                    ]
                };
                myChart.setOption(option);
            },
            error: function (err) {
                myChart.hideLoading();
                console.error("Error fetching data:", err);
            }
        });
        window.addEventListener('resize', () => myChart.resize());
    };

    // --- GUEST CHART (UPDATED WITH PLUS BUTTON) ---
    var _echartsguestA3ChartDashboard = function () {
        var dom = document.getElementById('guest-container3');
        if (!dom) return;
        var myChart = echarts.init(dom, null, { renderer: 'canvas', useDirtyRect: false });
        myChart.showLoading();
        $.ajax({
            type: "GET",
            url: "/Deshboard/GetEmployeeGuestComfortDashboardDetail_Hot?fromDate=" + from + "&toDate=" + to,
            success: function (data) {
                myChart.hideLoading();
                var myJSON = JSON.parse(data);

                // 1. Data for Main Chart (Guest Overall)
                let guestComfort = myJSON.find(d => d.deviceName == 'Guest Overall') || {};
                let guestOverCooling = guestComfort.OverCooling || 0;
                let guestUnderCooling = guestComfort.UnderCooling || 0;
                let guestCompliance = guestComfort.Compliance || 0;

                // Replace the internal filtering logic for Guest
                const guestModalData = myJSON.filter(item => {
                    const id = String(item.AssetTypeID);
                    // Matches "3", "13", or "13,3"
                    return id === "3" || id === "13" || id === "3,13";
                });

                // Update the click handler
                const btnGuest = document.getElementById('btn-detail-guest');
                if (btnGuest) {
                    btnGuest.onclick = function () {
                        if (guestModalData.length === 0) {
                            alert("No data found for Guest");
                        } else {
                            const config = ChartBuilders.createDetailedComfortChart(guestModalData, 'Guest Details');
                            ModalManager.show(config);
                        }
                    };
                }

                var option = {
                    tooltip: {
                        trigger: 'axis', axisPointer: { type: 'shadow' },
                        formatter: function (params) {
                            let result = `<div style="text-align: left;"><strong>${params[0].axisValue}</strong><br/>`;
                            params.forEach(item => {
                                result += `<div style="display: flex; justify-content: space-between; min-width: 150px;"><span>${item.marker} ${item.seriesName}</span><span style="margin-left: 20px;"><strong>${item.value}%</strong></span></div>`;
                            });
                            return result + '</div>';
                        }
                    },
                    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                    xAxis: { type: 'value', max: 100 },
                    yAxis: { type: 'category', data: ['Guest'] },
                    series: [
                        { name: 'OverCooling', type: 'bar', stack: 'total', itemStyle: { color: '#80bdff' }, data: [guestOverCooling] },
                        { name: 'UnderCooling', type: 'bar', stack: 'total', itemStyle: { color: '#f28b82' }, data: [guestUnderCooling] },
                        { name: 'Compliance', type: 'bar', stack: 'total', itemStyle: { color: '#81c784' }, data: [guestCompliance] }
                    ]
                };
                myChart.setOption(option);
            },
            error: function (err) {
                myChart.hideLoading();
                console.error("Error fetching data:", err);
            }
        });
        window.addEventListener('resize', () => myChart.resize());
    };

    
    var _echartshr1ChartDashboard = function () {
        var dom = document.getElementById('hr1');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        myChart.showLoading();

      

        Promise.all([
            $.ajax({
                type: "GET",
                url: "/Deshboard/GetEmployeeGuestComfortDashboard_Hot?fromDate=" + from1 + "&toDate=" + to1,
            }),
            $.ajax({
                type: "GET",
                url: "/Deshboard/GetEmployeeGuestComfortDashboard_Hot?fromDate=" + from + "&toDate=" + to,
            })
        ]).then(function (responses) {
            myChart.hideLoading();
            let data1 = JSON.parse(responses[0] || '{}');
            let data2 = JSON.parse(responses[1] || '{}');
           

            let employeeComfort1 = (data1[0] && data1[0].employeeComfort) || 0;
            let employeeComfort2 = (data2[0] && data2[0].employeeComfort) || 0;
           


            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        let result = '<div style="text-align: left;">';
                        result += '<strong>' + params[0].axisValue + '</strong><br/>';
                        params.forEach(item => {
                            result += '<div style="display: flex; justify-content: space-between; min-width: 150px;">';
                            result += '<span>' + item.marker + ' ' + item.seriesName + '</span>';
                            result += '<span style="margin-left: 20px;"><strong>' + item.value + '%</strong></span>';
                            result += '</div>';
                        });
                        result += '</div>';
                        return result;
                    }
                },
                //legend: {
                //    data: ['Compliance', 'Non-compliance']
                //},
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        interval: 0, // Force all labels to show
                        //    rotate: 0, // Rotate labels if needed
                        //    fontSize: 10, // Set appropriate font size
                        //    width: 100, // Set label width
                        //    overflow: 'break' // Break text if needed
                    },
                    
                    data: ['Last Hour', 'Today']
                },
                yAxis: {
                    type: 'value'
                },
                series: {
                    name: 'Employee',
                    type: 'bar',
                    data: [employeeComfort1, employeeComfort2],
                    itemStyle: {
                        borderRadius: [10, 10, 0, 0]
                    }
                    //color: "#91cc75"
                    //},
                    //{
                    //    name: 'Non-compliance',
                    //    type: 'bar',
                    //    data: [noncompliance1, noncompliance2, noncompliance3, noncompliance4],
                    //    itemStyle: {
                    //        borderRadius: [10, 10, 0, 0]
                    //    },
                    //    color: '#ee6666'
                    //
                }

            };

            myChart.setOption(option);

            window.addEventListener('resize', function () {
                myChart.resize();
            });

            var menuBtn = document.querySelector(".menu_button");
            if (menuBtn) {
                menuBtn.addEventListener("click", function () {
                    myChart.resize();
                });
            }
        }).catch(function (error) {
            myChart.hideLoading();
            console.error("Error fetching data: ", error);
        });
    };


    var _echartshr2ChartDashboard = function () {
        var dom = document.getElementById('hr3');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        myChart.showLoading();

      

        Promise.all([
            $.ajax({
                type: "GET",
                url: "/Deshboard/GetEmployeeGuestComfortDashboard_Hot?fromDate=" + from1 + "&toDate=" + to1,
            }),
            $.ajax({
                type: "GET",
                url: "/Deshboard/GetEmployeeGuestComfortDashboard_Hot?fromDate=" + from + "&toDate=" + to,
            })
        ]).then(function (responses) {
            myChart.hideLoading();
            let data1 = JSON.parse(responses[0] || '{}');
            let data2 = JSON.parse(responses[1] || '{}');
            

            let guestComfort1 = (data1[0] && data1[0].guestComfort) || 0;
            let guestComfort2 = (data2[0] && data2[0].guestComfort) || 0;
            


            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        let result = '<div style="text-align: left;">';
                        result += '<strong>' + params[0].axisValue + '</strong><br/>';
                        params.forEach(item => {
                            result += '<div style="display: flex; justify-content: space-between; min-width: 150px;">';
                            result += '<span>' + item.marker + ' ' + item.seriesName + '</span>';
                            result += '<span style="margin-left: 20px;"><strong>' + item.value + '%</strong></span>';
                            result += '</div>';
                        });
                        result += '</div>';
                        return result;
                    }
                },
                //legend: {
                //    data: ['Compliance', 'Non-compliance']
                //},
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        interval: 0, // Force all labels to show
                        //    rotate: 0, // Rotate labels if needed
                        //    fontSize: 10, // Set appropriate font size
                        //    width: 100, // Set label width
                        //    overflow: 'break' // Break text if needed
                    },
                    data: ['Last Hour', 'Today']
                },
                yAxis: {
                    type: 'value'
                },
                series: {
                    name: 'Guest',
                    type: 'bar',
                    data: [guestComfort1, guestComfort2],
                    itemStyle: {
                        borderRadius: [10, 10, 0, 0]
                    }
                    //color: "#91cc75"
                    //},
                    //{
                    //    name: 'Non-compliance',
                    //    type: 'bar',
                    //    data: [noncompliance1, noncompliance2, noncompliance3, noncompliance4],
                    //    itemStyle: {
                    //        borderRadius: [10, 10, 0, 0]
                    //    },
                    //    color: '#ee6666'
                    //
                }

            };

            myChart.setOption(option);

            window.addEventListener('resize', function () {
                myChart.resize();
            });

            var menuBtn = document.querySelector(".menu_button");
            if (menuBtn) {
                menuBtn.addEventListener("click", function () {
                    myChart.resize();
                });
            }
        }).catch(function (error) {
            myChart.hideLoading();
            console.error("Error fetching data: ", error);
        });
    };


    var _echartshr3ChartDashboard = function () {
        var dom = document.getElementById('hr5');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        myChart.showLoading();
        //function getMonthName(dateStr) {
        //    const monthNames = ["January", "February", "March", "April", "May", "June",
        //        "July", "August", "September", "October", "November", "December"];
        //    const date = new Date(dateStr);
        //    return monthNames[date.getMonth()];
        //}

        //// Create dynamic labels from fromDates
        //const monthLabels = [
        //    getMonthName(from1),
        //    getMonthName(from2),
        //    getMonthName(from3),
        //    getMonthName(from4)
        //];

        Promise.all([
            $.ajax({
                type: "GET",
                url: "/Deshboard/GetEmployeeGuestComfortDashboardDetail_Hot?fromDate=" + from1 + "&toDate=" + to1,
            }),
            $.ajax({
                type: "GET",
                url: "/Deshboard/GetEmployeeGuestComfortDashboardDetail_Hot?fromDate=" + from + "&toDate=" + to,
            })
        ]).then(function (responses) {
            myChart.hideLoading();
            let data1 = JSON.parse(responses[0] || '{}');
            let data2 = JSON.parse(responses[1] || '{}');
            //let data3 = JSON.parse(responses[2] || '{}');
            //let data4 = JSON.parse(responses[3] || '{}');

            let employeeComfort1;
            for (var i = 0; i < data1.length; i++) {
                if (data1[i].deviceName == 'Employee Overall') {
                    employeeComfort1 = data1[i];
                }
            }

            let employeeComfort2;
            for (var i = 0; i < data2.length; i++) {
                if (data2[i].deviceName == 'Employee Overall') {
                    employeeComfort2 = data2[i];
                }
            }

            //let employeeComfort3;
            //for (var i = 0; i < data3.length; i++) {
            //    if (data3[i].deviceName == 'Employee Overall') {
            //        employeeComfort3 = data3[i];
            //    }
            //}

            //let employeeComfort4;
            //for (var i = 0; i < data4.length; i++) {
            //    if (data4[i].deviceName == 'Employee Overall') {
            //        employeeComfort4 = data4[i];
            //    }
            //}

            let OverCooling1 = employeeComfort1.OverCooling;
            let UnderCooling1 = employeeComfort1.UnderCooling;
            let OverCooling2 = employeeComfort2.OverCooling;
            let UnderCooling2 = employeeComfort2.UnderCooling;
            //let OverCooling3 = employeeComfort3.OverCooling;
            //let UnderCooling3 = employeeComfort3.UnderCooling;
            //let OverCooling4 = employeeComfort4.OverCooling;
            //let UnderCooling4 = employeeComfort4.UnderCooling;


            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        let result = '<div style="text-align: left;">';
                        result += '<strong>' + params[0].axisValue + '</strong><br/>';
                        params.forEach(item => {
                            result += '<div style="display: flex; justify-content: space-between; min-width: 150px;">';
                            result += '<span>' + item.marker + ' ' + item.seriesName + '</span>';
                            result += '<span style="margin-left: 20px;"><strong>' + item.value + '%</strong></span>';
                            result += '</div>';
                        });
                        result += '</div>';
                        return result;
                    }
                },
                legend: {
                    data: ['UnderCooling', 'OverCooling']
                },
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        interval: 0, // Force all labels to show
                        //    rotate: 0, // Rotate labels if needed
                        //    fontSize: 10, // Set appropriate font size
                        //    width: 100, // Set label width
                        //    overflow: 'break' // Break text if needed
                    },
                    data: ['Last Hour', 'Today']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: 'UnderCooling',
                        type: 'bar',
                        data: [UnderCooling1, UnderCooling2],
                        itemStyle: {
                            borderRadius: [10, 10, 0, 0]
                        },
                        color: "#f28b82"
                    },
                    {
                        name: 'OverCooling',
                        type: 'bar',
                        data: [OverCooling1, OverCooling2],
                        itemStyle: {
                            borderRadius: [10, 10, 0, 0]
                        },
                        color: '#80bdff'
                    }
                ]

            };

            myChart.setOption(option);

            window.addEventListener('resize', function () {
                myChart.resize();
            });

            var menuBtn = document.querySelector(".menu_button");
            if (menuBtn) {
                menuBtn.addEventListener("click", function () {
                    myChart.resize();
                });
            }
        }).catch(function (error) {
            myChart.hideLoading();
            console.error("Error fetching data: ", error);
        });
    };

    var _echartshr4ChartDashboard = function () {
        var dom = document.getElementById('hr7');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        myChart.showLoading();

        //function getMonthName(dateStr) {
        //    const monthNames = ["January", "February", "March", "April", "May", "June",
        //        "July", "August", "September", "October", "November", "December"];
        //    const date = new Date(dateStr);
        //    return monthNames[date.getMonth()];
        //}

        //// Create dynamic labels from fromDates
        //const monthLabels = [
        //    getMonthName(from1),
        //    getMonthName(from2),
        //    getMonthName(from3),
        //    getMonthName(from4)
        //];

        Promise.all([
            $.ajax({
                type: "GET",
                url: "/Deshboard/GetEmployeeGuestComfortDashboardDetail_Hot?fromDate=" + from1 + "&toDate=" + to1,
            }),
            $.ajax({
                type: "GET",
                url: "/Deshboard/GetEmployeeGuestComfortDashboardDetail_Hot?fromDate=" + from + "&toDate=" + to,
            })
        ]).then(function (responses) {
            myChart.hideLoading();
            let data1 = JSON.parse(responses[0] || '{}');
            let data2 = JSON.parse(responses[1] || '{}');
            //let data3 = JSON.parse(responses[2] || '{}');
            //let data4 = JSON.parse(responses[3] || '{}');

            let guestComfort1;
            for (var i = 0; i < data1.length; i++) {
                if (data1[i].deviceName == 'Guest Overall') {
                    guestComfort1 = data1[i];
                }
            }

            let guestComfort2;
            for (var i = 0; i < data2.length; i++) {
                if (data2[i].deviceName == 'Guest Overall') {
                    guestComfort2 = data2[i];
                }
            }

            //let guestComfort3;
            //for (var i = 0; i < data3.length; i++) {
            //    if (data3[i].deviceName == 'Guest Overall') {
            //        guestComfort3 = data3[i];
            //    }
            //}

            //let guestComfort4;
            //for (var i = 0; i < data4.length; i++) {
            //    if (data4[i].deviceName == 'Guest Overall') {
            //        guestComfort4 = data4[i];
            //    }
            //}

            let OverCooling1 = guestComfort1 ? guestComfort1.OverCooling : 0;
            let UnderCooling1 = guestComfort1 ? guestComfort1.UnderCooling : 0;

            let OverCooling2 = guestComfort2 ? guestComfort2.OverCooling : 0;
            let UnderCooling2 = guestComfort2 ? guestComfort2.UnderCooling : 0;

            //let OverCooling3 = guestComfort3 ? guestComfort3.OverCooling : 0;
            //let UnderCooling3 = guestComfort3 ? guestComfort3.UnderCooling : 0;

            //let OverCooling4 = guestComfort4 ? guestComfort4.OverCooling : 0;
            //let UnderCooling4 = guestComfort4 ? guestComfort4.UnderCooling : 0;



            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        let result = '<div style="text-align: left;">';
                        result += '<strong>' + params[0].axisValue + '</strong><br/>';
                        params.forEach(item => {
                            result += '<div style="display: flex; justify-content: space-between; min-width: 150px;">';
                            result += '<span>' + item.marker + ' ' + item.seriesName + '</span>';
                            result += '<span style="margin-left: 20px;"><strong>' + item.value + '%</strong></span>';
                            result += '</div>';
                        });
                        result += '</div>';
                        return result;
                    }
                },
                legend: {
                    data: ['UnderCooling', 'OverCooling']
                },
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        interval: 0, // Force all labels to show
                        //    rotate: 0, // Rotate labels if needed
                        //    fontSize: 10, // Set appropriate font size
                        //    width: 100, // Set label width
                        //    overflow: 'break' // Break text if needed
                    },
                    data: ['Last Hour', 'Today']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: 'UnderCooling',
                        type: 'bar',
                        data: [UnderCooling1, UnderCooling2],
                        itemStyle: {
                            borderRadius: [10, 10, 0, 0]
                        },
                        color: "#f28b82"
                    },
                    {
                        name: 'OverCooling',
                        type: 'bar',
                        data: [OverCooling1, OverCooling2],
                        itemStyle: {
                            borderRadius: [10, 10, 0, 0]
                        },
                        color: '#80bdff'
                    }
                ]

            };

            myChart.setOption(option);

            window.addEventListener('resize', function () {
                myChart.resize();
            });

            var menuBtn = document.querySelector(".menu_button");
            if (menuBtn) {
                menuBtn.addEventListener("click", function () {
                    myChart.resize();
                });
            }
        }).catch(function (error) {
            myChart.hideLoading();
            console.error("Error fetching data: ", error);
        });
    };




   

    var _echartsProductionDining1ChartDashboard = function () {
        var dom = document.getElementById('opsSchedule1');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        myChart.showLoading();
        $.ajax({
            type: "GET",
            url: "/Deshboard/GetEmployeeGuestComfortDashboardOps_Hot?fromDate=" + from + "&toDate=" + to,
            success: function (data) {
                myChart.hideLoading();

                var myJSON = JSON.parse(data);
                var guestComfort = myJSON[0].guestComfort || 0;
                var employeeComfort = myJSON[0].employeeComfort || 0;

                const gaugeData = [
                    {
                        value: employeeComfort,
                        name: 'Employee',
                        title: { offsetCenter: ['-55%', '90%'] },
                        detail: { offsetCenter: ['-55%', '115%'] }
                    },
                    {
                        value: guestComfort,
                        name: 'Guest',
                        title: { offsetCenter: ['50%', '90%'] },
                        detail: { offsetCenter: ['50%', '115%'] }
                    }
                ];

                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c}%',
                        confine: true,  // Keep tooltip within chart container
                        position: function (point, params, dom, rect, size) {
                            // Adjust position to prevent cutoff
                            var x = point[0];
                            var y = point[1];
                            var viewWidth = size.viewSize[0];
                            var viewHeight = size.viewSize[1];
                            var boxWidth = size.contentSize[0];
                            var boxHeight = size.contentSize[1];

                            // If tooltip would go off right edge, position to the left
                            if (x + boxWidth > viewWidth) {
                                x = x - boxWidth - 10;
                            } else {
                                x = x + 10;
                            }

                            // If tooltip would go off bottom edge, position above
                            if (y + boxHeight > viewHeight) {
                                y = y - boxHeight - 10;
                            } else {
                                y = y + 10;
                            }

                            return [x, y];
                        }
                    },
                    series: [{
                        type: 'gauge',
                        radius: '80%',
                        min: 0,
                        max: 100,
                        axisLabel: { show: false },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: { color: '#FAC858' }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '65%',
                            offsetCenter: [0, '8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        data: gaugeData,
                        title: { fontSize: 10 },
                        detail: {
                            width: 40,
                            height: 14,
                            fontSize: 12,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            borderRadius: 3,
                            formatter: '{value}%'
                        }
                    }]
                };

                myChart.setOption(option);
                myChart.resize();
            },
            error: function (err) {
                myChart.hideLoading();
                console.error("Error fetching compliance data:", err);
            }
        });

        // ✅ Move this OUTSIDE the AJAX config
        window.addEventListener('resize', function () {
            myChart.resize();
        });
    };




    var _echartsProductionDining2ChartDashboard = function () {
        var dom = document.getElementById('opsSchedule2');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        myChart.showLoading();
        $.ajax({
            type: "GET",
            url: "/Deshboard/GetEmployeeGuestComfortDashboardNonOps_Hot?fromDate=" + from + "&toDate=" + to,
            success: function (data) {
                myChart.hideLoading();

                var myJSON = JSON.parse(data);
                var guestComfort = myJSON[0].guestComfort || 0;
                var employeeComfort = myJSON[0].employeeComfort || 0;

                const gaugeData = [
                    {
                        value: employeeComfort,
                        name: 'Employee',
                        title: { offsetCenter: ['-55%', '90%'] },
                        detail: { offsetCenter: ['-55%', '115%'] }
                    },
                    {
                        value: guestComfort,
                        name: 'Guest',
                        title: { offsetCenter: ['50%', '90%'] },
                        detail: { offsetCenter: ['50%', '115%'] }
                    }
                ];

                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b}: {c}%',
                        confine: true,  // Keep tooltip within chart container
                        position: function (point, params, dom, rect, size) {
                            // Adjust position to prevent cutoff
                            var x = point[0];
                            var y = point[1];
                            var viewWidth = size.viewSize[0];
                            var viewHeight = size.viewSize[1];
                            var boxWidth = size.contentSize[0];
                            var boxHeight = size.contentSize[1];

                            // If tooltip would go off right edge, position to the left
                            if (x + boxWidth > viewWidth) {
                                x = x - boxWidth - 10;
                            } else {
                                x = x + 10;
                            }

                            // If tooltip would go off bottom edge, position above
                            if (y + boxHeight > viewHeight) {
                                y = y - boxHeight - 10;
                            } else {
                                y = y + 10;
                            }

                            return [x, y];
                        }
                    },
                    series: [{
                        type: 'gauge',
                        radius: '80%',
                        min: 0,
                        max: 100,
                        axisLabel: { show: false },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 18,
                            itemStyle: { color: '#FAC858' }
                        },
                        pointer: {
                            icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                            width: 8,
                            length: '65%',
                            offsetCenter: [0, '8%']
                        },
                        progress: {
                            show: true,
                            overlap: true,
                            roundCap: true
                        },
                        axisLine: {
                            roundCap: true
                        },
                        data: gaugeData,
                        title: { fontSize: 10 },
                        detail: {
                            width: 40,
                            height: 14,
                            fontSize: 12,
                            color: '#fff',
                            backgroundColor: 'inherit',
                            borderRadius: 3,
                            formatter: '{value}%'
                        }
                    }]
                };

                myChart.setOption(option);
                myChart.resize();
            },
            error: function (err) {
                myChart.hideLoading();
                console.error("Error fetching compliance data:", err);
            }
        });

        // ✅ Move this OUTSIDE the AJAX config
        window.addEventListener('resize', function () {
            myChart.resize();
        });
    };

    var _echartsProductionDiningOU1ChartDashboard = function () {
        var dom5 = document.getElementById('opsScheduleOU1');
        var myChart = echarts.init(dom5, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        myChart.showLoading();

        $.ajax({
            type: "GET",
            url: "/Deshboard/GetEmployeeGuestComfortDashboardDetailOps_Hot?fromDate=" + from + "&toDate=" + to,
            success: function (data) {
                myChart.hideLoading();
                var myJSON = JSON.parse(data);
                let guestComfort;
                for (var i = 0; i < myJSON.length; i++) {
                    if (myJSON[i].deviceName == 'Guest Overall') {
                        guestComfort = myJSON[i];
                    }
                }

                let employeeComfort;
                for (var i = 0; i < myJSON.length; i++) {
                    if (myJSON[i].deviceName == 'Employee Overall') {
                        employeeComfort = myJSON[i];
                    }
                }

                let EmployeeOverCooling = employeeComfort ? employeeComfort.OverCooling : 0;
                let EmployeeUnderCooling = employeeComfort ? employeeComfort.UnderCooling : 0;

                let guestOverCooling = guestComfort ? guestComfort.OverCooling : 0;
                let guestUnderCooling = guestComfort ? guestComfort.UnderCooling : 0;

                const gaugeData = [
                    {
                        value: EmployeeOverCooling,
                        name: 'EmployeeOverCooling',
                        title: {
                            offsetCenter: ['0%', '-68%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['0%', '-58%']
                        }
                    },
                    {
                        value: EmployeeUnderCooling,
                        name: 'EmployeeUnderCooling',
                        title: {
                            offsetCenter: ['0%', '-26%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['0%', '-16%']
                        }
                    },
                    {
                        value: guestOverCooling,
                        name: 'GuestOverCooling',
                        title: {
                            offsetCenter: ['0%', '16%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['0%', '26%']
                        }
                    },
                    {
                        value: guestUnderCooling,
                        name: 'GuestUnderCooling',
                        title: {
                            offsetCenter: ['0%', '58%']   // 🔁 Changed from '30%' to '70%'
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['0%', '68%']   // 🔁 Changed from '45%' to '85%'
                        }
                    }
                ];


                var option = {
                    tooltip: {
                        trigger: 'item',
                        confine: true,
                        formatter: function (params) {
                            return '<div style="text-align: left; min-width: 120px;">' +
                                '<div style="display: flex; justify-content: space-between;">' +
                                '<span>' + params.name + ':</span>' +
                                '<span style="margin-left: 15px;"><strong>' + params.value + '%</strong></span>' +
                                '</div>' +
                                '</div>';
                        },
                        position: function (point, params, dom, rect, size) {
                            var x = point[0];
                            var y = point[1];
                            var viewWidth = size.viewSize[0];
                            var viewHeight = size.viewSize[1];
                            var boxWidth = size.contentSize[0];
                            var boxHeight = size.contentSize[1];

                            if (x + boxWidth > viewWidth) {
                                x = x - boxWidth - 10;
                            } else {
                                x = x + 10;
                            }

                            if (y + boxHeight > viewHeight) {
                                y = y - boxHeight - 10;
                            } else {
                                y = y + 10;
                            }

                            return [x, y];
                        }
                    },
                    series: [
                        {
                            type: 'gauge',
                            radius: '90%', // Bigger gauge
                            startAngle: 90,
                            endAngle: -270,
                            pointer: { show: false },
                            progress: {
                                show: true,
                                overlap: false,
                                roundCap: true,
                                clip: false,
                                itemStyle: {
                                    borderWidth: 1,
                                    borderColor: '#464646'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    width: 22
                                }
                            },
                            splitLine: { show: false },
                            axisTick: { show: false },
                            axisLabel: { show: false },
                            data: gaugeData,
                            title: {
                                fontSize: 8  // ⬆️ title size
                            },
                            detail: {
                                fontSize: 8, // ⬆️ value size
                                width: 40,
                                height: 2,
                                color: 'inherit',
                                borderColor: 'inherit',
                                borderRadius: 20,
                                borderWidth: 1,
                                formatter: '{value}%'
                            }
                        }
                    ]
                };


                myChart.setOption(option);
                myChart.resize();
            },
            error: function (err) {
                myChart.hideLoading();
                console.error("Error fetching compliance data:", err);
            }
        });

        // ✅ Move this OUTSIDE the AJAX config
        window.addEventListener('resize', function () {
            myChart.resize();
        });
    };


    var _echartsProductionDiningOU2ChartDashboard = function () {
        var dom5 = document.getElementById('opsScheduleOU2');
        var myChart = echarts.init(dom5, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        myChart.showLoading();

        $.ajax({
            type: "GET",
            url: "/Deshboard/GetEmployeeGuestComfortDashboardDetailNonOps_Hot?fromDate=" + from + "&toDate=" + to,
            success: function (data) {
                myChart.hideLoading();
                var myJSON = JSON.parse(data);
                let guestComfort;
                for (var i = 0; i < myJSON.length; i++) {
                    if (myJSON[i].deviceName == 'Guest Overall') {
                        guestComfort = myJSON[i];
                    }
                }

                let employeeComfort;
                for (var i = 0; i < myJSON.length; i++) {
                    if (myJSON[i].deviceName == 'Employee Overall') {
                        employeeComfort = myJSON[i];
                    }
                }

                let EmployeeOverCooling = employeeComfort ? employeeComfort.OverCooling : 0;
                let EmployeeUnderCooling = employeeComfort ? employeeComfort.UnderCooling : 0;

                let guestOverCooling = guestComfort ? guestComfort.OverCooling : 0;
                let guestUnderCooling = guestComfort ? guestComfort.UnderCooling : 0;

                const gaugeData = [
                    {
                        value: EmployeeOverCooling,
                        name: 'EmployeeOverCooling',
                        title: {
                            offsetCenter: ['0%', '-68%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['0%', '-58%']
                        }
                    },
                    {
                        value: EmployeeUnderCooling,
                        name: 'EmployeeUnderCooling',
                        title: {
                            offsetCenter: ['0%', '-26%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['0%', '-16%']
                        }
                    },
                    {
                        value: guestOverCooling,
                        name: 'GuestOverCooling',
                        title: {
                            offsetCenter: ['0%', '16%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['0%', '26%']
                        }
                    },
                    {
                        value: guestUnderCooling,
                        name: 'GuestUnderCooling',
                        title: {
                            offsetCenter: ['0%', '58%']
                        },
                        detail: {
                            valueAnimation: true,
                            offsetCenter: ['0%', '68%']
                        }
                    }
                ];


                option = {
                    tooltip: {
                        trigger: 'item',
                        confine: true,
                        formatter: function (params) {
                            return '<div style="text-align: left; min-width: 120px;">' +
                                '<div style="display: flex; justify-content: space-between;">' +
                                '<span>' + params.name + ':</span>' +
                                '<span style="margin-left: 15px;"><strong>' + params.value + '%</strong></span>' +
                                '</div>' +
                                '</div>';
                        },
                        position: function (point, params, dom, rect, size) {
                            var x = point[0];
                            var y = point[1];
                            var viewWidth = size.viewSize[0];
                            var viewHeight = size.viewSize[1];
                            var boxWidth = size.contentSize[0];
                            var boxHeight = size.contentSize[1];

                            if (x + boxWidth > viewWidth) {
                                x = x - boxWidth - 10;
                            } else {
                                x = x + 10;
                            }

                            if (y + boxHeight > viewHeight) {
                                y = y - boxHeight - 10;
                            } else {
                                y = y + 10;
                            }

                            return [x, y];
                        }
                    },
                    series: [
                        {
                            type: 'gauge',
                            radius: '90%', // Bigger gauge
                            startAngle: 90,
                            endAngle: -270,
                            pointer: { show: false },
                            progress: {
                                show: true,
                                overlap: false,
                                roundCap: true,
                                clip: false,
                                itemStyle: {
                                    borderWidth: 1,
                                    borderColor: '#464646'
                                }
                            },
                            axisLine: {
                                lineStyle: {
                                    width: 22
                                }
                            },
                            splitLine: { show: false },
                            axisTick: { show: false },
                            axisLabel: { show: false },
                            data: gaugeData,
                            title: {
                                fontSize: 8  // ⬆️ title size
                            },
                            detail: {
                                fontSize: 8, // ⬆️ value size
                                width: 40,
                                height: 2,
                                color: 'inherit',
                                borderColor: 'inherit',
                                borderRadius: 20,
                                borderWidth: 1,
                                formatter: '{value}%'
                            }
                        }
                    ]
                };

                myChart.setOption(option);
                myChart.resize();
            },
            error: function (err) {
                myChart.hideLoading();
                console.error("Error fetching compliance data:", err);
            }
        });

        // ✅ Move this OUTSIDE the AJAX config
        window.addEventListener('resize', function () {
            myChart.resize();
        });
    };


    return {
        init: function () {
            _echartsguestA1ChartDashboard();
            _echartsguestA2ChartDashboard();
            _echartsguestA3ChartDashboard();
            _echartshr1ChartDashboard();
            _echartshr2ChartDashboard();
            _echartshr3ChartDashboard();
            _echartshr4ChartDashboard();
            //_echartshr5ChartDashboard();
            //_echartshr6ChartDashboard();
            //_echartshr7ChartDashboard();
            //_echartshr8ChartDashboard();
            _echartsProductionDining1ChartDashboard();
            _echartsProductionDining2ChartDashboard();
            _echartsProductionDiningOU1ChartDashboard();
            _echartsProductionDiningOU2ChartDashboard();
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    guestComfortDashboard.init();
});