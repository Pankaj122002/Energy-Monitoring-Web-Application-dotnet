

$(document).ready(function () {
    SetMapData();
});

function SetMapData() {
    ShowLoading($('#map_basic'));
    $.ajax({
        type: "post",
        url: "/Deshboard/GetMapDetials/",
        data: {},
        datatype: "json",
        success: function (result) {

            var myJSON = JSON.parse(result);
            var locations = myJSON;
          
            var infowindow = new google.maps.InfoWindow();

            var lat = locations.length ? locations[1].Lat : 25.6080208;
            var longt = locations.length ? locations[1].Lng : 85.0730019;
            var pth = new Array();
            var map = new google.maps.Map(document.getElementById('map_basic'), {
                 zoom: 14,
                center: new google.maps.LatLng(lat, longt),
                mapTypeId: google.maps.MapTypeId.terrain

            });

          

           


            var contentString;
            var marker, i;
            var latlngbounds = new google.maps.LatLngBounds();
            var iconBase = '../global_assets/images/';
            var geocoder = geocoder = new google.maps.Geocoder();
            for (i = 0; i < locations.length; i++) {

                var myLatlng = new google.maps.LatLng(locations[i].Lat, locations[i].Lng);
                //var address = GetAddress(locations[i].Lat, locations[i].Lng, geocoder);


                contentString = "<div style='float:right; padding: 10px;font-size: 14px;background-color: #33414E;color: white;'>CP Site-" + locations[i].CPSite + "<br/>Address-" + locations[i].Adress + "</div>";

                

                        marker = new google.maps.Marker({
                            position: myLatlng,
                            map: map,
                            icon: iconBase + '1200px-Map-icon-shop.svg.png',
                            content: contentString
                        });
                       

                google.maps.event.addListener(marker, 'mouseover', (function (marker, i) {
                    return function () {
                        infowindow.setContent(marker.content);
                        infowindow.open(map, marker);
                    }
                })(marker, i));
                google.maps.event.addListener(marker, 'mouseout', (function (marker, i) {
                    return function () {
                        infowindow.close(map, marker);
                    }
                })(marker, i));
                //Extend each marker's position in LatLngBounds object.
                latlngbounds.extend(marker.position);
            }

            //Get the boundaries of the Map.
            var bounds = new google.maps.LatLngBounds();

            //Center map and adjust Zoom based on the position of all markers.
            map.setCenter(latlngbounds.getCenter());
            map.fitBounds(latlngbounds);

            HideLoading($('#map_basic'));
        },
        error: function (xhr, status, error) {
            HideLoading($('#map_basic'));
            massage(1,"Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
        }
    });
}

function createMarker(map, coords, title) {
    var marker = new google.maps.Marker({
        position: coords,
        map: map,
        title: title,
        draggable: false
    });
    return marker;
}