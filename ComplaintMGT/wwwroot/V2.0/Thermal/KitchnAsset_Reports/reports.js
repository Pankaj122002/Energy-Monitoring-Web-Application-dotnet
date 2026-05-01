document.addEventListener('DOMContentLoaded', function () {


    $.ajax({
        type: "post",
        url: "/Thermal/GetKitchenAssetReport",
        data: {},
        success: function (data) {

            let JSONObj = JSON.parse(data);
            if (JSONObj != null && JSONObj.length > 0) {

                let arrObj = [...JSONObj];
                let tboday = document.getElementById("kitchenassetreport-body");

                arrObj.forEach((o, i) => {

                    let tr = document.createElement("tr");

                    let siteNameCol = document.createElement("td");
                    let assetNameCol = document.createElement("td");
                    let transactionDateCol = document.createElement("td");
                    let transactionTimeCol = document.createElement("td");
                    let temperatureCol = document.createElement("td");

                    siteNameCol.innerText = o.SiteName;
                    assetNameCol.innerText = o.AssetName;
                    transactionDateCol.innerText = o.TransactionDate.split("T")[0];
                    transactionTimeCol.innerText = o.TransactionTime;
                    temperatureCol.innerText = o.Temperature;

                    tr.appendChild(siteNameCol);
                    tr.appendChild(assetNameCol);
                    tr.appendChild(transactionDateCol);
                    tr.appendChild(transactionTimeCol);
                    tr.appendChild(temperatureCol);

                    tboday.appendChild(tr);

                    if ((i + 1) === arrObj.length)
                        new DataTable('#kitchenassetreport');

                })

            }

        }
    });
});