/* ------------------------------------------------------------------------------
 *
 *  # Google Visualization - sliced 3D donut
 *
 *  Google Visualization sliced 3D donut chart demonstration
 *
 * ---------------------------------------------------------------------------- */


// Setup module
// ------------------------------

var GoogleDonut3dExploded = function() {


    //
    // Setup module components
    //

    // 3D donut chart
    var _googleDonut3dExploded = function() {
        if (typeof google == 'undefined') {
            console.warn('Warning - Google Charts library is not loaded.');
            return;
        }
       
        // Initialize chart
        google.charts.load('current', {
            callback: function () {
                $.ajax({
                    type: "POST",
                    // contentType: "application/json; charset=utf-8",
                    url: '/Deshboard/DeshAlerts',
                    data: {},
                    //  dataType: "json",
                    success: function (data) {
                        var myJSON = JSON.parse(data);
                        var n = myJSON[0].Notifications;
                        var d = myJSON[0].Deviations;
                        var a = myJSON[0].Alerts
                // Draw chart
                drawDonut3dExploded(n,d,a);

                // Resize on sidebar width change
                var sidebarToggle = document.querySelector('.sidebar-control');
                sidebarToggle && sidebarToggle.addEventListener('click', drawDonut3dExploded);

                // Resize on window resize
                var resizeDonut3dExploded;
                window.addEventListener('resize', function () {
                    clearTimeout(resizeDonut3dExploded);
                    resizeDonut3dExploded = setTimeout(function () {
                        drawDonut3dExploded();
                    }, 200);
                });
                    },
                    error: function (result) {
                        HideLoading($('#columns_basic2'));
                        ShowMessage('0', 'Something Went Wrong!');
                    }
                });
            },
             packages: ['corechart']

        });

        // Chart settings
        function drawDonut3dExploded(n,d,a) {

            // Define charts element
            var donut_3d_exploded_element = document.getElementById('google-3d-exploded');

            // Data
            var data = google.visualization.arrayToDataTable([
                ['Language', 'Speakers (in millions)'],
                ['Medium', parseInt(n)],
                ['Low', parseInt(d)],
                ['High', parseInt(a)]
               
            ]);

            // Options
            var options = {
                
                fontName: 'Roboto',
                height: 300,
                width: 450,
                backgroundColor: 'transparent',
                colors: [
                   '#5ab1ef','#d87a80',
                    '#97b552'
                ],
                chartArea: {
                    left: 50,
                    width: '55%',
                    height: '55%'
                },
                is3D: true,
                //pieSliceText: 'label',
                //slices: {  
                //    2: {offset: 0.15},
                //    8: {offset: 0.1},
                //    10: {offset: 0.15},
                //    11: {offset: 0.1}
                //}
            };

            // Instantiate and draw our chart, passing in some options.
            var pie_3d_exploded = new google.visualization.PieChart(donut_3d_exploded_element);
            pie_3d_exploded.draw(data, options);
        }
    };


    //
    // Return objects assigned to module
    //

    return {
        init: function() {
            _googleDonut3dExploded();
        }
    }
}();
var GoogleDonut3dExploded1 = function () {


    //
    // Setup module components
    //

    // 3D donut chart
    var _googleDonut3dExploded = function () {
        if (typeof google == 'undefined') {
            console.warn('Warning - Google Charts library is not loaded.');
            return;
        }

        // Initialize chart
        google.charts.load('current', {
            callback: function () {
                $.ajax({
                    type: "POST",
                    // contentType: "application/json; charset=utf-8",
                    url: '/Deshboard/DeshHVACAlerts?DType=4,7',
                    data: {},
                    //  dataType: "json",
                    success: function (data) {
                        var myJSON = JSON.parse(data);
                       
                        // Draw chart
                       
                        drawDonut3dExploded1(myJSON);

                        // Resize on sidebar width change
                        var sidebarToggle = document.querySelector('.sidebar-control');
                        sidebarToggle && sidebarToggle.addEventListener('click', drawDonut3dExploded);

                        // Resize on window resize
                        var resizeDonut3dExploded;
                        window.addEventListener('resize', function () {
                            clearTimeout(resizeDonut3dExploded);
                            resizeDonut3dExploded = setTimeout(function () {
                                drawDonut3dExploded();
                            }, 200);
                        });
                    },
                    error: function (result) {
                        HideLoading($('#columns_basic2'));
                        ShowMessage('0', 'Something Went Wrong!');
                    }
                });
            },
            packages: ['corechart']
        });

        // Chart settings
        function drawDonut3dExploded1(dd) {

            // Define charts element
            var donut_3d_exploded_element = document.getElementById('google-3d-exploded1');
           // alert();
           
            // Data
           // var data = google.visualization.arrayToDataTable([dd]);
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Country');
            data.addColumn('number', 'Population');
            //data.addRows([
            //    ['China', 1361512535],
            //    ['India', 1251695584],
            //    ['US', 321362789],
            //    ['Indonesia', 255993674],
            //    ['Brazil', 204259812]
            //]);

            $.each(dd, function (index, row) {
                data.addRow([
                    row.DispalyName,
                    row.CO
                ]);
            });
                //['Language', 'Speakers (in millions)'],
                //['HAVC Near Entrance', 13],
                //['HAVC Opposite Entrance', 83],
                //['HAVC Near Window', 46],
                //['Production Area', 90]
             
          //  ]);

            // Options
            var options = {
                fontName: 'Roboto',
                height: 300,
                width: 600,
                backgroundColor: 'transparent',
                colors: [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],
                chartArea: {
                    left: 50,
                    width: '75%',
                    height: '95%'
                },
                is3D: true,
                //pieSliceText: 'label',
                //slices: {
                //    2: { offset: 0.15 },
                //    8: { offset: 0.1 },
                //    10: { offset: 0.15 },
                //    11: { offset: 0.1 }
                //}
            };

            // Instantiate and draw our chart, passing in some options.
            var pie_3d_exploded = new google.visualization.PieChart(donut_3d_exploded_element);
            pie_3d_exploded.draw(data, options);
        }
    };


    //
    // Return objects assigned to module
    //

    return {
        init: function () {
            _googleDonut3dExploded();
        }
    }
}();
var GoogleDonut3dExploded2 = function () {


    //
    // Setup module components
    //

    // 3D donut chart
    var _googleDonut3dExploded = function () {
        if (typeof google == 'undefined') {
            console.warn('Warning - Google Charts library is not loaded.');
            return;
        }

        // Initialize chart
        google.charts.load('current', {
            callback: function () {
                $.ajax({
                    type: "POST",
                    // contentType: "application/json; charset=utf-8",
                    url: '/Deshboard/DeshHVACAlerts?DType=5,8',
                    data: {},
                    //  dataType: "json",
                    success: function (data) {
                        var myJSON = JSON.parse(data);

                        // Draw chart

                        drawDonut3dExploded2(myJSON);

                        // Resize on sidebar width change
                        var sidebarToggle = document.querySelector('.sidebar-control');
                        sidebarToggle && sidebarToggle.addEventListener('click', drawDonut3dExploded);

                        // Resize on window resize
                        var resizeDonut3dExploded;
                        window.addEventListener('resize', function () {
                            clearTimeout(resizeDonut3dExploded);
                            resizeDonut3dExploded = setTimeout(function () {
                                drawDonut3dExploded();
                            }, 200);
                        });
                    },
                    error: function (result) {
                        HideLoading($('#columns_basic2'));
                        ShowMessage('0', 'Something Went Wrong!');
                    }
                });
            },
            packages: ['corechart']
        });

        // Chart settings
        function drawDonut3dExploded2(ddd) {

            // Define charts element
            var donut_3d_exploded_element = document.getElementById('google-3d-exploded2');

            // Data
            //var data = google.visualization.arrayToDataTable([
            //    ['Language', 'Speakers (in millions)'],
            //    ['Deep Freezer - Veg', 13],
            //    ['Deep Freezer - Non Veg', 83],
            //    ['Deep Freezer - Ice Cream', 46],
            //    ['Makeline', 90],
            //    ['Vertical Fridge - Veg', 90],
            //    ['Vertical Fridge - Non-Veg', 50],
            //    ['Vertical Fridge - Near Under Counter Chiller', 40],
            //    ['Oven', 30],

            //]);

            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Country');
            data.addColumn('number', 'Population');
            //data.addRows([
            //    ['China', 1361512535],
            //    ['India', 1251695584],
            //    ['US', 321362789],
            //    ['Indonesia', 255993674],
            //    ['Brazil', 204259812]
            //]);

            $.each(ddd, function (index, row) {
                data.addRow([
                    row.DispalyName,
                    row.CO
                ]);
            });

            // Options
            var options = {
                fontName: 'Roboto',
                height: 300,
                width: 1000,
                backgroundColor: 'transparent',
                colors: [
                    '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
                    '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
                    '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
                    '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
                ],
                chartArea: {
                    left: 50,
                    width: '95%',
                    height: '95%'
                },
                is3D: true,
                //pieSliceText: 'label',
                //slices: {
                //    2: { offset: 0.15 },
                //    8: { offset: 0.1 },
                //    10: { offset: 0.15 },
                //    11: { offset: 0.1 }
                //}
            };

            // Instantiate and draw our chart, passing in some options.
            var pie_3d_exploded = new google.visualization.PieChart(donut_3d_exploded_element);
            pie_3d_exploded.draw(data, options);
        }
    };


    //
    // Return objects assigned to module
    //

    return {
        init: function () {
            _googleDonut3dExploded();
        }
    }
}();


// Initialize module
// ------------------------------

GoogleDonut3dExploded.init();
GoogleDonut3dExploded1.init();
GoogleDonut3dExploded2.init();
