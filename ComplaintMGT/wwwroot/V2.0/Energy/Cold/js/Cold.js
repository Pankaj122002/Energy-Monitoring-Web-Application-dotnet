var selectedParentCheckedItem = 0; //start with 0 so decrease by 1 from config.json file
var selectedChildCheckedItem = 2; //index 2 = "Energy Consumption vs Temperature (Live)" (Graph 3)

// ===========================
// GRAPH 3 METER FILTER HELPERS (kept from current - Graph 3 is dynamic with 2 APIs)
// ===========================

// Show/hide meter filter container - shown for Graph 1, 2, 3, 4, 8, 401, 402, 601, 602, 801, 802, 1401, 1402
function toggleMeterFilterContainer(graphId) {
    var meterFilterContainer = document.getElementById('meterFilterContainer');
    var dateFilterContainer = document.getElementById('dateFilterContainer');
    if (meterFilterContainer) {
        if (graphId === 1 || graphId === 2 || graphId === 3 || graphId === 4 ||
            graphId === 401 || graphId === 402 ||
            graphId === 8 || graphId === 801 || graphId === 802 ||
            graphId === 601 || graphId === 602 ||
            graphId === 1401 || graphId === 1402) {
            meterFilterContainer.classList.add('active');
        } else {
            meterFilterContainer.classList.remove('active');
        }
    }
    // Date filter: only for graphs 1 and 3 (live single-day view)
    if (dateFilterContainer) {
        if (graphId === 1 || graphId === 3) {
            dateFilterContainer.style.display = 'flex';
        } else {
            dateFilterContainer.style.display = 'none';
        }
    }
}

// Check if the currently active carousel slide needs the meter filter container shown
// Covers: Graph 1, 2, 3, 4, 8, 401, 402, 601, 602, 801, 802, 1401, 1402
// Container IDs now use "HourlyActual..." and "HourlyAverage..." prefixes for frequency graphs
function checkCurrentSlideForGraph3() {
    var activeSlide = document.querySelector('#carouselEnergyTrendColdIndicators .carousel-item.active');
    if (activeSlide) {
        var g1Container = activeSlide.querySelector('[id$="EnergyConsumptionLive"]');
        var g2Container = activeSlide.querySelector('[id$="CumulativeEnergyConsumptionLive"]');
        var g3Container = activeSlide.querySelector('[id$="EnergyConsumptionvsTemperatureLive"]');
        var g4Container = activeSlide.querySelector('[id$="EnergyConsumptionwithPeakEnergyConsumption"]');
        var g8Container = activeSlide.querySelector('[id$="EnergyConsumptionKWHvsKVAHvsTemperatureHourly"]');
        var g801Container = activeSlide.querySelector('[id$="EnergyConsumptionKWHvsKVAHvsTemperature"]');
        var g601Container = activeSlide.querySelector('[id$="EnergyConsumptionKWHvsKVAH"]');
        var g1401Container = activeSlide.querySelector('[id$="EnergyProfile"]');

        // Detect Actual vs Average variants via container ID prefix
        var containerId = '';
        var foundContainer = g4Container || g8Container || g801Container || g601Container || g1401Container;
        if (foundContainer) containerId = foundContainer.id || '';

        var isAverage = containerId.indexOf('HourlyAverage') === 0;

        if (g1Container) {
            toggleMeterFilterContainer(1);
        } else if (g2Container) {
            toggleMeterFilterContainer(2);
        } else if (g3Container) {
            toggleMeterFilterContainer(3);
        } else if (g4Container) {
            toggleMeterFilterContainer(isAverage ? 402 : 401);
        } else if (g8Container) {
            toggleMeterFilterContainer(isAverage ? 802 : 801);
        } else if (g801Container) {
            toggleMeterFilterContainer(isAverage ? 802 : 801);
        } else if (g601Container) {
            toggleMeterFilterContainer(isAverage ? 602 : 601);
        } else if (g1401Container) {
            toggleMeterFilterContainer(isAverage ? 1402 : 1401);
        } else {
            toggleMeterFilterContainer(null);
        }
    }
}

// ===========================
// APPLY FILTER
// Supports: single frequency (Actual or Average), both frequencies simultaneously,
// and non-frequency graphs — all with correct carousel slide numbering.
// ===========================
$('#imgApplyFilter').click(function () {
    var allSelectedGraph = $('.sub-text [type=checkbox]:checked');

    $("#carouselEnergyTrendColdIndicators .carousel-indicators").empty();
    $("#carouselEnergyTrendColdIndicators .carousel-inner").empty();

    var hourlyActualSelected = $('[data-id="17"]').prop('checked');
    var hourlyAverageSelected = $('[data-id="18"]').prop('checked');

    // slideIndex tracks the true carousel slide number across all appended slides
    // (a single graph with both frequencies selected will produce 2 slides)
    var slideIndex = 0;

    // We need the JSON config for all frequency-enabled graphs.
    // Load it once, then build all slides synchronously.
    var needsFrequency = false;
    $.each(allSelectedGraph, function (key, value) {
        if ($(value).data('frequencyenable') == true && $(value).data('enablegraph') == true) {
            needsFrequency = true;
        }
    });

    // Map: slide index → graphId. Built during buildSlides, used by refreshFilterForActiveSlide.
    // This avoids re-detecting the graphId from DOM container IDs on every swipe.
    window._slideGraphIdMap = {};

    function buildSlides(configData) {
        slideIndex = 0;
        window._slideGraphIdMap = {};

        $.each(allSelectedGraph, function (key, value) {
            var selectedGraphText = $(value).siblings('label').text();
            var graphId = $(value).data('id');
            var enableGraph = $(value).data('enablegraph');
            var frequencyEnable = $(value).data('frequencyenable');
            var baseContainerID = selectedGraphText.replaceAll(" ", "").replaceAll("-", "").replace("(", "").replace(")", "");

            if (enableGraph != true) return;

            if (frequencyEnable == true && configData) {
                var selectedGraphData = null;
                try {
                    selectedGraphData = configData.CategoryGraph
                        .find(x => x.SubGraph.some(item => item.Name === selectedGraphText))
                        .SubGraph.find(x => x.Name == selectedGraphText);
                } catch (e) { selectedGraphData = null; }

                if (!selectedGraphData) return;

                // Determine which frequency variants to render
                // If neither checkbox is ticked, default to Actual only
                var showActual = hourlyActualSelected || (!hourlyActualSelected && !hourlyAverageSelected);
                var showAverage = hourlyAverageSelected;

                // Render Hourly Actual slide
                if (showActual) {
                    var actualId = selectedGraphData.FrequencyIndex[0];
                    var actualText = "Weekly Actual " + selectedGraphText;
                    var actualContainerID = "HourlyActual" + baseContainerID;
                    var activeClass = slideIndex === 0 ? " active" : "";

                    var divIndicator = '<button type="button" class="' + activeClass + '" data-bs-target="#carouselEnergyTrendColdIndicators" style="background-color:black;" data-bs-slide-to="' + slideIndex + '" aria-label="Slide ' + (slideIndex + 1) + '"></button>';
                    $("#carouselEnergyTrendColdIndicators .carousel-indicators").append(divIndicator);

                    setCorousalItem(activeClass, actualText, actualContainerID);
                    energyColdDashboard.init(actualId, actualContainerID);
                    window._slideGraphIdMap[slideIndex] = actualId;

                    if (slideIndex === 0) {
                        toggleMeterFilterContainer(actualId);
                    }
                    slideIndex++;
                }

                // Render Hourly Average slide
                if (showAverage) {
                    var avgId = selectedGraphData.FrequencyIndex[1];
                    var avgText = "Weekly Average " + selectedGraphText;
                    var avgContainerID = "HourlyAverage" + baseContainerID;
                    var activeClassAvg = slideIndex === 0 ? " active" : "";

                    var divIndicatorAvg = '<button type="button" class="' + activeClassAvg + '" data-bs-target="#carouselEnergyTrendColdIndicators" style="background-color:black;" data-bs-slide-to="' + slideIndex + '" aria-label="Slide ' + (slideIndex + 1) + '"></button>';
                    $("#carouselEnergyTrendColdIndicators .carousel-indicators").append(divIndicatorAvg);

                    setCorousalItem(activeClassAvg, avgText, avgContainerID);
                    energyColdDashboard.init(avgId, avgContainerID);
                    window._slideGraphIdMap[slideIndex] = avgId;

                    if (slideIndex === 0) {
                        toggleMeterFilterContainer(avgId);
                    }
                    slideIndex++;
                }

            } else {
                // Non-frequency graph — render as a single slide
                var activeClass = slideIndex === 0 ? " active" : "";

                var divIndicator = '<button type="button" class="' + activeClass + '" data-bs-target="#carouselEnergyTrendColdIndicators" style="background-color:black;" data-bs-slide-to="' + slideIndex + '" aria-label="Slide ' + (slideIndex + 1) + '"></button>';
                $("#carouselEnergyTrendColdIndicators .carousel-indicators").append(divIndicator);

                setCorousalItem(activeClass, selectedGraphText, baseContainerID);
                energyColdDashboard.init(graphId, baseContainerID);
                window._slideGraphIdMap[slideIndex] = graphId;

                if (slideIndex === 0) {
                    toggleMeterFilterContainer(graphId);
                }
                slideIndex++;
            }
        });

        $('.X1').trigger('click');

        // After all slides are built, refresh the filter for the first (active) slide.
        // slid.bs.carousel only fires on transitions, not on the initial render.
        setTimeout(function () { refreshFilterForActiveSlide(); }, 100);
    }

    if (needsFrequency) {
        $.getJSON('/v2.0/Energy/Cold/js/EnergyConsumption_Graph_Config.json', function (data) {
            buildSlides(data);
        });
    } else {
        buildSlides(null);
    }
});

// ===========================
// DOCUMENT READY
// ===========================
$(document).ready(function () {
    setFilterItem();

    // On carousel slide change: show/hide the filter container AND re-render
    // the correct graph's meter checkboxes so each graph has its own isolated filter state.
    $('#carouselEnergyTrendColdIndicators').on('slid.bs.carousel', function () {
        checkCurrentSlideForGraph3();
        refreshFilterForActiveSlide();
    });
});

// ===========================
// REFRESH FILTER FOR ACTIVE SLIDE
// Looks up the active slide index in _slideGraphIdMap (built during buildSlides)
// and calls energyColdDashboard.refreshFilter(graphId) with the exact graphId
// that was registered when the slide was created — no DOM detection needed.
// This guarantees 1401 and 1402 are never confused.
// ===========================
function refreshFilterForActiveSlide() {
    var carousel = document.querySelector('#carouselEnergyTrendColdIndicators');
    if (!carousel) return;

    // Find active slide index from Bootstrap's active indicator button
    var activeIndicator = document.querySelector('#carouselEnergyTrendColdIndicators .carousel-indicators button.active');
    var slideIndex = activeIndicator ? parseInt(activeIndicator.getAttribute('data-bs-slide-to')) : 0;

    // Fallback: count active slide position in carousel-inner
    if (isNaN(slideIndex)) {
        var slides = carousel.querySelectorAll('.carousel-item');
        slideIndex = 0;
        slides.forEach(function (slide, i) {
            if (slide.classList.contains('active')) slideIndex = i;
        });
    }

    var graphId = window._slideGraphIdMap && window._slideGraphIdMap[slideIndex];
    if (graphId == null) return;

    if (typeof energyColdDashboard !== 'undefined' && energyColdDashboard.refreshFilter) {
        console.log('🔄 refreshFilterForActiveSlide → slideIndex:', slideIndex, '→ graphId:', graphId);
        energyColdDashboard.refreshFilter(graphId);
    }
}

// ===========================
// CAROUSEL ITEM BUILDER
// ===========================
function setCorousalItem(activeClass, selectedGraphText, graphContainerID) {
    var carousalItem = '<div class="carousel-item ' + activeClass + '" data-bs-interval="30000">' +
        '<div class="img1-header" style="margin-bottom: 3%">' +
        '<div class="icon-h">' +
        '<a href="javascript:return false;" style="text-decoration: none;">' +
        '<img src="/v2.0/common/images/4.png" alt="" class="icon">' +
        '</a>' +
        '<div class="img1-button" style="display: block;" id="h1">' + selectedGraphText + '</div>' +
        '</div>' +
        '</div>' +
        '<div class="chart-container fix_height" id="' + graphContainerID + '"></div>' +
        '</div>';

    $("#carouselEnergyTrendColdIndicators .carousel-inner").append(carousalItem);
}

// ===========================
// FILTER ITEM BUILDER
// ===========================
function setFilterItem() {
    $.getJSON('/v2.0/Energy/Cold/js/EnergyConsumption_Graph_Config.json', function (data) {
        var detailHtml = '';
        $.each(data.CategoryGraph, function (key, value) {
            detailHtml += '<div class="details-text">' +
                '<div class="form-check form-switch" style="display: flex;">' +
                '<label style="margin-left: -8%;margin-top: -1%;" class="form-check-label" for="flexSwitchCheckDefault' + (key + 1) + '">' + value.Name + '</label>' +
                '</div>';

            if (value.SubGraph.length > 0) {
                detailHtml += '<div class="sub-text">';
            }

            $.each(value.SubGraph, function (keyChild, valueChild) {
                var frequencyEnable = valueChild.Frequency != null && valueChild.Frequency.length > 0 ? true : false;
                if (key == selectedParentCheckedItem && keyChild == selectedChildCheckedItem) {
                    detailHtml += '<div class="form-check form-switch" style="display: flex;">' +
                        '<input class="form-check-input" type="checkbox" data-frequencyEnable="' + frequencyEnable + '" data-enableGraph="' + valueChild.EnableGraph + '" data-Id="' + valueChild.Id + '" checked="true" role="switch" id="flexSwitchCheckDefault' + (key + 1) + '' + (keyChild + 1) + '">' +
                        '<label class="form-check-label" for="flexSwitchCheckDefault' + (key + 1) + '' + (keyChild + 1) + '">' + valueChild.Name + '</label>' +
                        '</div>';
                } else {
                    detailHtml += '<div class="form-check form-switch" style="display: flex;">' +
                        '<input class="form-check-input" type="checkbox" data-frequencyEnable="' + frequencyEnable + '" data-enableGraph="' + valueChild.EnableGraph + '" data-Id="' + valueChild.Id + '" role="switch" id="flexSwitchCheckDefault' + (key + 1) + '' + (keyChild + 1) + '">' +
                        '<label class="form-check-label" for="flexSwitchCheckDefault' + (key + 1) + '' + (keyChild + 1) + '">' + valueChild.Name + '</label>' +
                        '</div>';
                }
            });

            if (value.SubGraph.length > 0) {
                detailHtml += '</div>';
            }
            detailHtml += '</div>';
        });

        $(detailHtml).insertBefore('.page1 .Apply-filters');

        // Set default graph - direct trigger same as old working version
        $('#imgApplyFilter').trigger('click');
    });
}

// ===========================
// UI EVENT LISTENERS (with null checks to prevent crashes if elements missing)
// ===========================

document.querySelector(".qLinks-button").addEventListener("click", function () {
    var rightBar = document.querySelector(".quick-links");
    if (rightBar) {
        rightBar.style.display = "block";
        var box = document.querySelector('.main-box');
        if (box) {
            rightBar.style.zIndex = '1000';
            box.style.zIndex = '999';
            box.style.opacity = '.2';
        }
    }
});

document.querySelector(".X").addEventListener("click", function () {
    var rightBar = document.querySelector(".quick-links");
    if (rightBar) {
        rightBar.style.display = "none";
        var box = document.querySelector('.main-box');
        if (box) {
            rightBar.style.zIndex = '0';
            box.style.zIndex = '0';
            box.style.opacity = '1';
        }
    }
});

document.querySelector(".filter-button").addEventListener("click", function () {
    var rightBar = document.querySelector(".filter-box");
    if (rightBar) {
        rightBar.style.display = "block";
        var box = document.querySelector('.main-box');
        if (box) {
            rightBar.style.zIndex = '1000';
            box.style.zIndex = '999';
            box.style.opacity = '.2';
        }
    }
});

document.querySelector(".X1").addEventListener("click", function () {
    var rightBar = document.querySelector(".filter-box");
    if (rightBar) {
        rightBar.style.display = "none";
        var box = document.querySelector('.main-box');
        if (box) {
            rightBar.style.zIndex = '0';
            box.style.zIndex = '0';
            box.style.opacity = '1';
        }
    }
});

document.getElementById("home-tab").addEventListener("click", function () {
    var page1 = document.querySelector(".page1");
    var page2 = document.querySelector(".page2");
    var page3 = document.querySelector(".page3");
    var page4 = document.querySelector(".page4");
    page1.style.display = "block";
    page2.style.display = "none";
    page3.style.display = "none";
    page4.style.display = "none";
});

document.getElementById("profile-tab").addEventListener("click", function () {
    var page1 = document.querySelector(".page1");
    var page2 = document.querySelector(".page2");
    var page3 = document.querySelector(".page3");
    var page4 = document.querySelector(".page4");
    page1.style.display = "none";
    page2.style.display = "block";
    page3.style.display = "none";
    page4.style.display = "none";
});

document.getElementById("contact-tab").addEventListener("click", function () {
    var page1 = document.querySelector(".page1");
    var page2 = document.querySelector(".page2");
    var page3 = document.querySelector(".page3");
    var page4 = document.querySelector(".page4");
    page1.style.display = "none";
    page2.style.display = "none";
    page3.style.display = "block";
    page4.style.display = "none";
});

document.getElementById("ops-tab").addEventListener("click", function () {
    var page1 = document.querySelector(".page1");
    var page2 = document.querySelector(".page2");
    var page3 = document.querySelector(".page3");
    var page4 = document.querySelector(".page4");
    page1.style.display = "none";
    page2.style.display = "none";
    page3.style.display = "none";
    page4.style.display = "block";
});

document.querySelector(".menu_button").addEventListener("click", function () {
    var isActive = $('.sidebar-menu').hasClass('active');
    if (!isActive)
        $('.energy-header').css('margin-left', '-15.5%');
    else
        $('.energy-header').css('margin-left', '0%');
});