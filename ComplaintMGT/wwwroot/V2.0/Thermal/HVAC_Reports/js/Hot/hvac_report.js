
var table;
var table2;
var table3;
var table4;

var RenderTable = function (assetid) {

    let siteName = "";

    $.ajax({
        type: "post",
        url: "/Thermal/GetSiteNameByAssetId?assetid=" + assetid,
        data: {},
        success: function (data) {
            let site = JSON.parse(data);
            siteName = site[0].SiteName;

            $.ajax({
                type: "post",
                url: "/Thermal/GetHotThermalMonitoringSeries?assetid=" + assetid,
                data: {},
                success: function (data) {
                    var JSONObj = JSON.parse(data);

                    console.log(JSONObj);

                    if (JSONObj != null && JSONObj.length > 0) {

                        let arrObj = [...JSONObj];
                        let tboday = document.getElementById("hvacreport-body");

                        if (table)
                            table.destroy();

                        tboday.innerHTML = '';

                        arrObj.forEach((o, i) => {

                            let tr = document.createElement("tr");

                            let siteNameCol = document.createElement("td");
                            let assetNameCol = document.createElement("td");
                            let transactionDateCol = document.createElement("td");
                            let transactionTimeCol = document.createElement("td");
                            let temperatureCol = document.createElement("td");

                            siteNameCol.innerText = siteName;
                            assetNameCol.innerText = o.DeviceName;
                            transactionDateCol.innerText = new Date().toLocaleDateString();
                            transactionTimeCol.innerText = o.LogTime;
                            temperatureCol.innerText = o.Temperature;

                            tr.appendChild(siteNameCol);
                            tr.appendChild(assetNameCol);
                            tr.appendChild(transactionDateCol);
                            tr.appendChild(transactionTimeCol);
                            tr.appendChild(temperatureCol);

                            tboday.appendChild(tr);

                            if ((i + 1) === arrObj.length) {
                                table = new DataTable('#hvacreport');
                            }

                        })

                    } else {

                        if (table)
                            table.destroy();

                        table = new DataTable('#hvacreport');
                    }
                }
            })
        }
    });
}

var RenderTable2 = function (assetid) {

    let siteName = "";

    $.ajax({
        type: "post",
        url: "/Thermal/GetSiteNameByAssetId?assetid=" + assetid,
        data: {},
        success: function (data) {
            let site = JSON.parse(data);
            siteName = site[0].SiteName;

            $.ajax({
                type: "post",
                url: "/Thermal/ConsolidatedThermalMonitoringHot",
                data: {},
                success: function (data) {

                    var JSONObj = JSON.parse(data);

                    console.log(JSONObj);

                    if (JSONObj != null && JSONObj.length > 0) {

                        let arrObj = [...JSONObj];
                        let tboday = document.getElementById("hvacreport-body_2")
                        if (table2)
                            table2.destroy();

                        tboday.innerHTML = '';

                        arrObj.forEach((o, i) => {

                            let tr = document.createElement("tr");

                            let siteNameCol = document.createElement("td");
                            let assetNameCol = document.createElement("td");
                            let transactionDateCol = document.createElement("td");
                            let temperatureCol = document.createElement("td");

                            siteNameCol.innerText = siteName;
                            assetNameCol.innerText = o.DeviceName;
                            transactionDateCol.innerText = o.TransactionHour
                            temperatureCol.innerText = o.Temperature;

                            tr.appendChild(siteNameCol);
                            tr.appendChild(assetNameCol);
                            tr.appendChild(transactionDateCol);
                            tr.appendChild(temperatureCol);

                            tboday.appendChild(tr);

                            if ((i + 1) === arrObj.length) {
                                table = new DataTable('#hvacreport_2');
                            }

                        })

                    } else {

                        if (table2)
                            table2.destroy();

                        table2 = new DataTable('#hvacreport_2')
                    }
                }
            });
        }
    });

    

    
}

var RenderTable3 = function (assetid) {

    let siteName = "";

    $.ajax({
        type: "post",
        url: "/Thermal/GetSiteNameByAssetId?assetid=" + assetid,
        data: {},
        success: function (data) {
            let site = JSON.parse(data);
            siteName = site[0].SiteName;

            $.ajax({
                type: "post",
                url: "/Thermal/GetHotThermalMonitoringSeries?assetid=" + assetid,
                data: {},
                success: function (data) {
                    var JSONObj = JSON.parse(data);

                    console.log(JSONObj);

                    if (JSONObj != null && JSONObj.length > 0) {

                        let arrObj = [...JSONObj];
                        let tboday = document.getElementById("hvacreport-body_3")
                        if (table3)
                            table3.destroy();

                        tboday.innerHTML = '';

                        arrObj.forEach((o, i) => {

                            let tr = document.createElement("tr");

                            let siteNameCol = document.createElement("td");
                            let assetNameCol = document.createElement("td");
                            let transactionDateCol = document.createElement("td");
                            let temperatureCol = document.createElement("td");

                            siteNameCol.innerText = siteName;
                            assetNameCol.innerText = o.DeviceName;
                            transactionDateCol.innerText = o.LogTime
                            temperatureCol.innerText = o.Temperature;

                            tr.appendChild(siteNameCol);
                            tr.appendChild(assetNameCol);
                            tr.appendChild(transactionDateCol);
                            tr.appendChild(temperatureCol);

                            tboday.appendChild(tr);

                            if ((i + 1) === arrObj.length) {
                                table3 = new DataTable('#hvacreport_3');
                            }

                        })

                    } else {

                        if (table3)
                            table3.destroy();

                        table3 = new DataTable('#hvacreport_3')
                    }
                }
            });
        }
    });

   

}

var RenderTable4 = function (assetid) {

    let siteName = "";

    $.ajax({
        type: "post",
        url: "/Thermal/GetSiteNameByAssetId?assetid=" + assetid,
        data: {},
        success: function (data) {
            let site = JSON.parse(data);
            siteName = site[0].SiteName;

            $.ajax({
                type: "post",
                url: "/Thermal/ThermalMonitoringHeatMapHot?assetid=" + assetid,
                data: {},
                success: function (data) {

                    var JSONObj = JSON.parse(data);

                    console.log(JSONObj);

                    if (JSONObj != null && JSONObj.length > 0) {

                        let arrObj = [...JSONObj];
                        let tboday = document.getElementById("hvacreport-body_4")
                        if (table4)
                            table4.destroy();

                        tboday.innerHTML = '';

                        arrObj.forEach((o, i) => {

                            let tr = document.createElement("tr");

                            let siteNameCol = document.createElement("td");
                            let assetNameCol = document.createElement("td");
                            let transactionDateCol = document.createElement("td");
                            let temperatureCol = document.createElement("td");

                            siteNameCol.innerText = siteName;
                            assetNameCol.innerText = o.DeviceName;
                            transactionDateCol.innerText = new Date().toLocaleDateString(); 
                            temperatureCol.innerText = o.Temperature;

                            tr.appendChild(siteNameCol);
                            tr.appendChild(assetNameCol);
                            tr.appendChild(transactionDateCol);
                            tr.appendChild(temperatureCol);

                            tboday.appendChild(tr);

                            if ((i + 1) === arrObj.length) {
                                table4 = new DataTable('#hvacreport_4');
                            }

                        })

                    } else {

                        if (table4)
                            table4.destroy();

                        table4 = new DataTable('#hvacreport_4')
                    }
                }
            });
        }
    });
}

var RenderAssetList = function () {

    var AssetLists = function () {

        $.ajax({
            type: "post",
            url: "/Thermal/GetHVACThermalAssets",
            data: {},
            success: function (data) {

                var assetLis = JSON.parse(data);

                var asstNavOuter = document.getElementById("flowBoxes");

                for (let i = 0; i < assetLis.length; i++) {

                    let aNav = document.createElement("div");
                    aNav.id = `hvac-${assetLis[i].AssetId}`;
                    aNav.innerText = assetLis[i].Name;
                    aNav.style = "white-space: nowrap; cursor: pointer"

                    if (i == 0) {
                        aNav.className = "right active";
                        RenderTable(assetLis[i].AssetId)
                        RenderTable2(assetLis[i].AssetId)
                        RenderTable3(assetLis[i].AssetId)
                        RenderTable4(assetLis[i].AssetId)

                    }
                    else if (i + 1 == assetLis.length)
                        aNav.className = "left";
                    else
                        aNav.className = "left right";

                    aNav.onclick = function () {
                        aNav.classList.add('active');
                        for (let j = 0; j < assetLis.length; j++) {
                            let _nav = document.getElementById(`hvac-${assetLis[j].AssetId}`)
                            if (j != i)
                                _nav.classList.remove('active')
                        }

                        RenderTable(assetLis[i].AssetId)
                        RenderTable2(assetLis[i].AssetId)
                        RenderTable3(assetLis[i].AssetId)
                        RenderTable4(assetLis[i].AssetId)

                    };

                    asstNavOuter.appendChild(aNav);
                }

            }
        });

    }



    return {
        init: function () {
            AssetLists();
        }
    }
}();

document.addEventListener('DOMContentLoaded', function () {

    console.log('Content Loaded');
    RenderAssetList.init();

})