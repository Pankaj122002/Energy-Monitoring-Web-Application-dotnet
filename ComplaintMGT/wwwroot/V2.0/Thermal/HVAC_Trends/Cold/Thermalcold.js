// ===========================
// Hot.js - HVAC Thermal Trends (4 Graphs Only)
// Graphs:
//   1 → Thermal Monitoring HVAC (Live)          → hvacLive graph
//   2 → Thermal Monitoring HVAC - Peak Temp     → hvacPeak graph
//   3 → Thermal Monitoring HVAC - Hourly Avg    → hvacHourlyAvg graph
//   4 → Thermal Profile - Hourly Average        → hvacHeatmap graph
// ===========================

$(document).ready(function () {
    // Load config JSON and initialize all 4 graphs
    $.getJSON('/v2.0/Thermal/HVAC_Trends/cold/EnergyConsumption_Graph_Config.json', function (data) {
        buildAllGraphs(data);
    }).fail(function () {
        // Fallback: build without config
        buildAllGraphs(null);
    });
});

function buildAllGraphs(configData) {
    var graphConfigs = [
        { id: 1, name: 'Thermal Monitoring HVAC (Live)', containerId: 'hvacLiveGraph' },
        { id: 2, name: 'Thermal Monitoring HVAC - Peak Temperature', containerId: 'hvacPeakGraph' },
        { id: 3, name: 'Thermal Monitoring HVAC - Weekly Average', containerId: 'hvacHourlyAvgGraph' },
        { id: 4, name: 'Thermal Profile - Weekly Average', containerId: 'hvacHeatmapGraph' }
    ];

    graphConfigs.forEach(function (g) {
        if (typeof hvacThermalDashboard !== 'undefined') {
            hvacThermalDashboard.init(g.id, g.containerId);
        }
    });
}

// ===========================
// UI EVENT LISTENERS
// ===========================

// Quick Links open/close
var qLinksBtn = document.querySelector('.qLinks-button');
if (qLinksBtn) {
    qLinksBtn.addEventListener('click', function () {
        var rightBar = document.querySelector('.quick-links');
        if (rightBar) {
            rightBar.style.display = 'block';
            rightBar.style.zIndex = '1000';
            var box = document.querySelector('.main-box');
            if (box) { box.style.zIndex = '999'; box.style.opacity = '.2'; }
        }
    });
}

var xBtn = document.querySelector('.X');
if (xBtn) {
    xBtn.addEventListener('click', function () {
        var rightBar = document.querySelector('.quick-links');
        if (rightBar) {
            rightBar.style.display = 'none';
            rightBar.style.zIndex = '0';
            var box = document.querySelector('.main-box');
            if (box) { box.style.zIndex = '0'; box.style.opacity = '1'; }
        }
    });
}

// Filter sidebar open/close
var filterBtn = document.querySelector('.filter-button');
if (filterBtn) {
    filterBtn.addEventListener('click', function () {
        var rightBar = document.querySelector('.filter-box');
        if (rightBar) {
            rightBar.style.display = 'block';
            rightBar.style.zIndex = '1000';
            var box = document.querySelector('.main-box');
            if (box) { box.style.zIndex = '999'; box.style.opacity = '.2'; }
        }
    });
}

var x1Btn = document.querySelector('.X1');
if (x1Btn) {
    x1Btn.addEventListener('click', function () {
        var rightBar = document.querySelector('.filter-box');
        if (rightBar) {
            rightBar.style.display = 'none';
            rightBar.style.zIndex = '0';
            var box = document.querySelector('.main-box');
            if (box) { box.style.zIndex = '0'; box.style.opacity = '1'; }
        }
    });
}

// Sidebar menu toggle
var menuBtn = document.querySelector('.menu_button');
if (menuBtn) {
    menuBtn.addEventListener('click', function () {
        var isActive = $('.sidebar-menu').hasClass('active');
        if (!isActive)
            $('.energy-header').css('margin-left', '-15.5%');
        else
            $('.energy-header').css('margin-left', '0%');
    });
}