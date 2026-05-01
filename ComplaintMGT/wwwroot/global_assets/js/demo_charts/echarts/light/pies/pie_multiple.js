/* ------------------------------------------------------------------------------
 *
 *  # Echarts - Pie multiple example
 *
 *  Demo JS code for multiple pie charts [light theme]
 *
 * ---------------------------------------------------------------------------- */


// Setup module
// ------------------------------


var EchartsPieMultipleLight1 = function () {


    //
    // Setup module components
    //

    // Multiple pie charts
    var _pieMultipleLightExample = function () {
        if (typeof echarts == 'undefined') {
            console.warn('Warning - echarts.min.js is not loaded.');
            return;
        }
        var col = "'#333'";
        var textStyleCol = "";
        if (sessionStorage.getItem("Mode") == 'dark') {
            col = '#000000';
            textStyleCol = '#000000';
        }
        else if (sessionStorage.getItem("Mode") == 'light') {

            col = '#fff';
            textStyleCol = '#222';
        }
        else {

            col = '#fff';
            textStyleCol = '#222';
        }
        // Define element
        var pie_multiples_element = document.getElementById('pie_multiples1');


        //
        // Charts configuration
        //

        if (pie_multiples_element) {

            // Initialize chart
            var pie_multiples = echarts.init(pie_multiples_element);


            //
            // Chart config
            //

            // Top text label
            var labelTop = {
                show: true,
                position: 'center',
                formatter: '{b}\n',
                fontSize: 15,
                lineHeight: 50,
                rich: {
                    a: {}
                }
            };

            // Background item style
            var backStyle = {
                color: '#97b552',
                //color: '#eee',
                emphasis: {
                    color: '#97b552'
                    //color: '#eee'
                }
            };

            // Bottom text label
            var labelBottom = {
                color: col,
                show: true,
                position: 'center',
                formatter: function (params) {
                    return '\n\n' + (100 - params.value) 
                },
                fontWeight: 500,
                lineHeight: 35,
                rich: {
                    a: {}
                },
                emphasis: {
                    color: col
                }
            };

            // Set inner and outer radius
            var radius = [36, 45];

            // Options
            pie_multiples.setOption({

                // Colors
                //color: [
                //    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                //    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                //    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                //    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                //],
                color: [
                    '#97b552'
                ],

                // Global text styles
                textStyle: {
                    fontFamily: 'Roboto, Arial, Verdana, sans-serif',
                    fontSize: 13
                },

                // Add title
                title: {
                    text: 'Thermal Monitoring ',
                    subtext: 'Kitchen Equipments',
                    left: 'center',
                    textStyle: {
                        fontSize: 17,
                        fontWeight: 500,
                        color: col
                    },
                    subtextStyle: {
                        fontSize: 12,
                        color: col
                    }
                },

                // Add legend
                legend: {
                    bottom: 0,
                    left: 'center',
                    data: ['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9'],
                    itemHeight: 8,
                    itemWidth: 8,
                    selectedMode: false,
                    textStyle: {
                        color: col
                    }
                },

                // Add series
                series: [
                    {
                        type: 'pie',
                        center: ['4.5%', '50%'],
                        radius: radius,
                        hoverAnimation: false,
                        data: [
                            { name: 'other', value: 78, label: labelBottom, itemStyle: backStyle },
                            { name: 'K1', value: 54, label: labelTop }
                        ]
                    },
                    {
                        type: 'pie',
                        center: ['14%', '50%'],
                        radius: radius,
                        hoverAnimation: false,
                        data: [
                            { name: 'other', value: 67, label: labelBottom, itemStyle: backStyle },
                            { name: 'K2', value: 44, label: labelTop }
                        ]
                    },
                    {
                        type: 'pie',
                        center: ['24%', '50%'],
                        radius: radius,
                        hoverAnimation: false,
                        data: [
                            { name: 'other', value: 76, label: labelBottom, itemStyle: backStyle },
                            { name: 'K3', value: 35, label: labelTop }
                        ]
                    },
                    {
                        type: 'pie',
                        center: ['34%', '50%'],
                        radius: radius,
                        hoverAnimation: false,
                        data: [
                            { name: 'other', value: 76, label: labelBottom, itemStyle: backStyle },
                            { name: 'K4', value: 35, label: labelTop }
                        ]
                    },
                    {
                        type: 'pie',
                        center: ['44%', '50%'],
                        radius: radius,
                        hoverAnimation: false,
                        data: [
                            { name: 'other', value: 76, label: labelBottom, itemStyle: backStyle },
                            { name: 'K5', value: 35, label: labelTop }
                        ]
                    },
                    {
                        type: 'pie',
                        center: ['54%', '50%'],
                        radius: radius,
                        hoverAnimation: false,
                        data: [
                            { name: 'other', value: 76, label: labelBottom, itemStyle: backStyle },
                            { name: 'K6', value: 35, label: labelTop }
                        ]
                    },
                    {
                        type: 'pie',
                        center: ['64%', '50%'],
                        radius: radius,
                        hoverAnimation: false,
                        data: [
                            { name: 'other', value: 76, label: labelBottom, itemStyle: backStyle },
                            { name: 'K7', value: 35, label: labelTop }
                        ]
                    },
                    {
                        type: 'pie',
                        center: ['74%', '50%'],
                        radius: radius,
                        hoverAnimation: false,
                        data: [
                            { name: 'other', value: 76, label: labelBottom, itemStyle: backStyle },
                            { name: 'K8', value: 35, label: labelTop }
                        ]
                    },
                    {
                        type: 'pie',
                        center: ['84%', '50%'],
                        radius: radius,
                        hoverAnimation: false,
                        data: [
                            { name: 'other', value: 76, label: labelBottom, itemStyle: backStyle },
                            { name: 'K9', value: 35, label: labelTop }
                        ]
                    },

                ]
            });
        }


        //
        // Resize charts
        //

        // Resize function
        var triggerChartResize = function () {
            pie_multiples_element && pie_multiples.resize();
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
            _pieMultipleLightExample();
        }
    }
}();


// Initialize module
// ------------------------------

document.addEventListener('DOMContentLoaded', function() {
    EchartsPieMultipleLight.init();
    EchartsPieMultipleLight1.init();
});
