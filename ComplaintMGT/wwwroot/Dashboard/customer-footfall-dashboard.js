/*EmployeeGuestConfort Graph Start*/

/*Alert Graph Start*/
var CustomerFootfallDashboard = function () {
    var _echartsCustomerFootfallChartDashboardExt = function () {
        var dom = document.getElementById('customer-footfall-chart-container');
        var customerFootfallChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};
        var option;
        customerFootfallChart.showLoading();
        $.ajax({
            type: "post",
            url: "/Deshboard/Get_Customer_Footfall",
            data: {},
            success: function (data) {
                customerFootfallChart.hideLoading();
                var myJSON = JSON.parse(data)
                var inHouseFootfall = parseFloat(myJSON[0].in);
                var outHouseFootfall = parseFloat(myJSON[0].out);
                var occupancyFootfall = parseFloat(myJSON[0].occupancy);

                const gaugeData = [
                    //{
                    //    value: inHouseFootfall,
                    //    name: 'In',
                    //    title: {
                    //        offsetCenter: ['-100%', '90%']
                    //    },
                    //    detail: {
                    //        offsetCenter: ['-100%', '115%']
                    //    }
                    //},
                    //{
                    //    value: outHouseFootfall,
                    //    name: 'Out',
                    //    title: {
                    //        offsetCenter: ['-10%', '90%']
                    //    },
                    //    detail: {
                    //        offsetCenter: ['-10%', '115%']
                    //    }
                    //},
                    //{
                    //    value: occupancyFootfall,
                    //    name: 'In Outlet',
                    //    title: {
                    //        offsetCenter: ['80%', '90%']
                    //    },
                    //    detail: {
                    //        offsetCenter: ['80%', '115%']
                    //    }
                    //}

                      {
                        value: inHouseFootfall,
                        name: '',
                        title: {
                            offsetCenter: ['0%', '80%']
                        },
                        detail: {
                            offsetCenter: ['0%', '95%']
                        }
                    },
                ];
                option = {
                    series: [
                        {
                            type: 'gauge',
                            min: 0,
                            max: 100,
                            axisLabel: {
                                show: false
                                //distance: 100
                            },
                            anchor: {
                                show: true,
                                showAbove: true,
                                size: 18,
                                itemStyle: {
                                    color: '#FAC858'
                                }
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
                            title: {
                                fontSize: 10
                            },
                            detail: {
                                width: 40,
                                height: 14,
                                fontSize: 12,
                                color: '#fff',
                                backgroundColor: 'inherit',
                                borderRadius: 3,
                                formatter: '{value}'
                            }
                        }
                    ]
                };

                if (option && typeof option === 'object') {
                    customerFootfallChart.setOption(option);
                }
                customerFootfallChart.resize();
                window.addEventListener('resize', customerFootfallChart.resize);
            }
        });
    };

    return {
        init: function () {
            _echartsCustomerFootfallChartDashboardExt();
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {
    CustomerFootfallDashboard.init();
});

/*EmployeeGuestConfort Graph End*/

$('#btnAddCustomerFootfall').click(function () {
    $('#CustomerFootfallModal').modal('show');
    $.ajax({
        type: "post",
        url: "/Deshboard/Get_Customer_Footfall_TimeOfDay",
        data: {},
        datatype: "json",
        //traditional: true,
        success: function (data) {
            var myJSON = JSON.parse(data);
            if (myJSON.length > 0) {

                let footfallsData = [...myJSON]
                footfallsData = footfallsData.filter(o => o.SiteOperationWindow !== "Yesterday" && o.SiteOperationWindow !== "Today");

                footfallsData = footfallsData.sort(function (a, b) {
                    return a.IsMainWindow - b.IsMainWindow || a.SiteOperationWindow.localeCompare(b.SiteOperationWindow);
                });

                console.log(footfallsData);

            
                let yesterday = myJSON.find(x => x.SiteOperationWindow == "Yesterday")
                let today = myJSON.find(x => x.SiteOperationWindow == "Today")


                let masterDiv = document.getElementById("footfall_desc");

                masterDiv.innerHTML = '';
                masterDiv.innerHTML = ` <div class="row">
                    <div class="col-md-6">
                        <a href="#" style="text-decoration: none;">
                            <div class="graph4t" style="text-decoration: none;width: 9vw;height: 18vh;">
                                <div class="g-icon"><img src="/Dashboard/assests/Icons/icon-graph.png" alt="" class="graph-icont"></div>
                                <div class="g-textt" style="margin-top: 10%">
                                    <span>${yesterday ? yesterday.Value : 0}</span>
                                    <div class="g-stextt">Yesterday</div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="col-md-6">
                        <a href="#" style="text-decoration: none;">
                            <div class="graph4t" style="width: 9vw;height: 18vh;">
                                <div class="g-icon"><img src="/Dashboard/assests/Icons/icon-graph.png" alt="" class="graph-icont"></div>
                                <div class="g-textt" style="margin-top: 10%">
                                    <span>${today ? today.Value : 0}</span>
                                    <div class="g-stextt">Today</div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>`

                const chunkSize = 3;
                for (let i = 0; i < footfallsData.length; i += chunkSize) {
                    const chunk = footfallsData.slice(i, i + chunkSize);
                    console.log(chunk)

                    let row = document.createElement('div');
                    row.className = "row"
                    row.style = "margin-top:3%;"

                    chunk.forEach(o => {

                        row.innerHTML += ` <div class="col-md-4">
                                <a href="#" style="text-decoration: none;">
                                    <div class="graph4t" style="width: 7vw;height: 18vh;">
                                        <div class="g-icon"><img src="/Dashboard/assests/Icons/icon-graph.png" alt="" class="graph-icont"></div>
                                        <div class="g-textt">
                                            <span">${o ? o.Value : 0}</span>
                                            <div class="g-stextt">${o.SiteOperationWindow}</div>
                                        </div>
                                    </div>
                                </a>
                            </div>`
                    });

                    masterDiv.appendChild(row);
                }

            }

        }
    });
})