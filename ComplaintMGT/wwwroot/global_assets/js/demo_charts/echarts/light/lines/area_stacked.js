/* ------------------------------------------------------------------------------
 *
 *  # Echarts - Stacked area chart example
 *
 *  Demo JS code for stacked area chart [light theme]
 *
 * ---------------------------------------------------------------------------- */


// Setup module
// ------------------------------

var EchartsAreaStackedLight = function() {


    //
    // Setup module components
    //

    // Stacked area chart
    var _areaStackedLightExample = function() {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        // Define element
        var area_stacked_element = document.getElementById('area_stacked');


        //
        // Charts configuration
        //

        if (area_stacked_element) {

            // Initialize chart
            var area_stacked = echarts.init(area_stacked_element);


            //
            // Chart config
            //

            // Options
            area_stacked.setOption({

                // Define colors
                color: ['#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80'],

                // Global text styles
                textStyle: {
                    fontFamily: 'Roboto, Arial, Verdana, sans-serif',
                    fontSize: 13
                },

                // Chart animation duration
                animationDuration: 750,

                // Setup grid
                grid: {
                    left: 0,
                    right: 40,
                    top: 35,
                    bottom: 0,
                    containLabel: true
                },

                // Add legend
                legend: {
                    data: ['AC1', 'AC2', 'AC3'],
                    itemHeight: 8,
                    itemGap: 20
                },

                // Add tooltip
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    padding: [10, 15],
                    textStyle: {
                        fontSize: 13,
                        fontFamily: 'Roboto, sans-serif'
                    }
                },

                // Horizontal axis
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: ['00:10', '13:10', '14:10', '15:10', '16:10', '17:10', '18:10'],
                    axisLabel: {
                        color: '#333'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#999'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#eee',
                            type: 'dashed'
                        }
                    }
                }],

                // Vertical axis
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} C',
                        color: '#333'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#999'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#eee'
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(250,250,250,0.1)', 'rgba(0,0,0,0.01)']
                        }
                    }
                }],

                // Add series
                series: [
                    {
                        name: 'AC1',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbolSize: 7,
                        itemStyle: {
                            normal: {
                                borderWidth: 2
                            }
                        },
                        data: [26, 20, 31, 32, 12, 5,-1]
                    },
                    {
                        name: 'AC2',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbolSize: 7,
                        itemStyle: {
                            normal: {
                                borderWidth: 2
                            }
                        },
                        data: [34, 12, 34, 44, 10, 30, 10]
                    },
                    {
                        name: 'AC3',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbolSize: 7,
                        itemStyle: {
                            normal: {
                                borderWidth: 2
                            }
                        },
                        data: [32, 32, 18, 13, 50, 30, 20]
                    }
                ]
            });
        }


        //
        // Resize charts
        //

        // Resize function
        var triggerChartResize = function() {
            area_stacked_element && area_stacked.resize();
        };

        // On sidebar width change
        var sidebarToggle = document.querySelector('.sidebar-control');
        sidebarToggle && sidebarToggle.addEventListener('click', triggerChartResize);

        // On window resize
        var resizeCharts;
        window.addEventListener('resize', function() {
            clearTimeout(resizeCharts);
            resizeCharts = setTimeout(function () {
                triggerChartResize();
            }, 200);
        });
    };


    //
    // Return objects assigned to module
    //

    return {
        init: function() {
            _areaStackedLightExample();
        }
    }
}();

var EchartsAreaStackedLight1 = function () {


    //
    // Setup module components
    //

    // Stacked area chart
    var _areaStackedLightExample = function () {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }

        // Define element
        var area_stacked_element = document.getElementById('area_stacked1');


        //
        // Charts configuration
        //

        if (area_stacked_element) {

            // Initialize chart
            var area_stacked = echarts.init(area_stacked_element);


            //
            // Chart config
            //

            // Options
            area_stacked.setOption({

                // Define colors
                color: ['#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80'],

                // Global text styles
                textStyle: {
                    fontFamily: 'Roboto, Arial, Verdana, sans-serif',
                    fontSize: 13
                },

                // Chart animation duration
                animationDuration: 750,

                // Setup grid
                grid: {
                    left: 0,
                    right: 40,
                    top: 35,
                    bottom: 0,
                    containLabel: true
                },

                // Add legend
                legend: {
                    data: ['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9'],
                    itemHeight: 8,
                    itemGap: 20
                },

                // Add tooltip
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    padding: [10, 15],
                    textStyle: {
                        fontSize: 13,
                        fontFamily: 'Roboto, sans-serif'
                    }
                },

                // Horizontal axis
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: ['00:10', '13:10', '14:10', '15:10', '16:10', '17:10', '18:10'],
                    axisLabel: {
                        color: '#333'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#999'
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#eee',
                            type: 'dashed'
                        }
                    }
                }],

                // Vertical axis
                yAxis: [{
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} C',
                        color: '#333'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#999'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#eee'
                        }
                    },
                    splitArea: {
                        show: true,
                        areaStyle: {
                            color: ['rgba(250,250,250,0.1)', 'rgba(0,0,0,0.01)']
                        }
                    }
                }],

                // Add series
                series: [
                    {
                        name: 'K1',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbolSize: 7,
                        itemStyle: {
                            normal: {
                                borderWidth: 2
                            }
                        },
                        data: [26, 20, 31, 32, 12, 5, -1]
                    },
                    {
                        name: 'K2',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbolSize: 7,
                        itemStyle: {
                            normal: {
                                borderWidth: 2
                            }
                        },
                        data: [34, 12, 34, 44, 10, 30, 10]
                    },
                    {
                        name: 'K3',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbolSize: 7,
                        itemStyle: {
                            normal: {
                                borderWidth: 2
                            }
                        },
                        data: [32, 32, 18, 13, 50, 30, 20]
                    },
                    {
                        name: 'K4',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbolSize: 7,
                        itemStyle: {
                            normal: {
                                borderWidth: 2
                            }
                        },
                        data: [32, 32, 18, 13, 50, 30, 20]
                    },
                    {
                        name: 'K5',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbolSize: 7,
                        itemStyle: {
                            normal: {
                                borderWidth: 2
                            }
                        },
                        data: [32, 32, 18, 13, 50, 30, 20]
                    },
                    {
                        name: 'K6',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbolSize: 7,
                        itemStyle: {
                            normal: {
                                borderWidth: 2
                            }
                        },
                        data: [32, 32, 18, 13, 50, 30, 20]
                    },
                    {
                        name: 'K7',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbolSize: 7,
                        itemStyle: {
                            normal: {
                                borderWidth: 2
                            }
                        },
                        data: [32, 32, 18, 13, 50, 30, 20]
                    },
                    {
                        name: 'K8',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbolSize: 7,
                        itemStyle: {
                            normal: {
                                borderWidth: 2
                            }
                        },
                        data: [32, 32, 18, 13, 50, 30, 20]
                    },
                    {
                        name: 'K9',
                        type: 'line',
                        stack: 'Total',
                        areaStyle: {
                            normal: {
                                opacity: 0.25
                            }
                        },
                        smooth: true,
                        symbolSize: 7,
                        itemStyle: {
                            normal: {
                                borderWidth: 2
                            }
                        },
                        data: [32, 32, 18, 13, 50, 30, 20]
                    }
                ]
            });
        }


        //
        // Resize charts
        //

        // Resize function
        var triggerChartResize = function () {
            area_stacked_element && area_stacked.resize();
        };

        // On sidebar width change
        var sidebarToggle = document.querySelector('.sidebar-control');
        sidebarToggle && sidebarToggle.addEventListener('click', triggerChartResize);

        // On window resize
        var resizeCharts;
        window.addEventListener('resize', function () {
            clearTimeout(resizeCharts);
            resizeCharts = setTimeout(function () {
                triggerChartResize();
            }, 200);
        });
    };


    //
    // Return objects assigned to module
    //

    return {
        init: function () {
            _areaStackedLightExample();
        }
    }
}();



// Initialize module
// ------------------------------

document.addEventListener('DOMContentLoaded', function() {
    EchartsAreaStackedLight.init();
    EchartsAreaStackedLight1.init();
});
