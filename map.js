let markers = [];
var marker = [];
var data_map;
var maps;
function getCurrent() {
    // return new Promise(resolve => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var myLatlng = { lat: position.coords.latitude, lng: position.coords.longitude };
            //  myLatlng = { lat: 13.8050916, lng: 100.5907284 };
            console.log(myLatlng)
            data_map = myLatlng
            //resolve(myLatlng)
            return myLatlng;
        });
    }
    // });
}
function Currentmap(_lat, _lng) {
    console.log(_lat, _lng)
    var mapOptions = {
        center: { lat: _lat, lng: _lng },
        zoom: 15,
    }
    maps = new google.maps.Map(document.getElementById("map"), mapOptions);
    //var marker;
    marker = new google.maps.Marker({
        // position: new google.maps.LatLng(_lat, _lng),
        map: maps,
    });
    markers.push(marker);
    search(maps);
    maps.addListener('click', function (mapsMouseEvent) {
        console.log(markers.length)
        if (markers.length > 0) {
            markers.pop().setMap(null);
        }
        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng

        });
        infoWindow.setContent(mapsMouseEvent.latLng.toString());
        var checkmarker = infoWindow.content.split(",")
        // // console.log(checkmarker)
        console.log(checkmarker[0].substring(1, checkmarker[0].length))
        console.log(checkmarker[1].replace(" ", "").substring(0, checkmarker[0].length - 1))
        var lat = checkmarker[0].substring(1, checkmarker[0].length);
        var lng = checkmarker[1].replace(" ", "").substring(0, checkmarker[0].length - 1);
        var marker;
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: maps
        });
        // console.log(infoWindow)
        markers.push(marker);
        // document.getElementById("latitude").value = lat;
        // document.getElementById("longitude").value = lng.replace(")", "");

        Cookies.set('latitude', lat)
        Cookies.set('longitude', lng.replace(")", ""))
    });



}
function search(map) {
    var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
    google.maps.event.addListener(searchBox, 'places_changed', function () {
        searchBox.set('map', null);
        var places = searchBox.getPlaces();
        if (markers.length > 0) {
            markers.pop().setMap(null);
        }
        var bounds = new google.maps.LatLngBounds();
        var i, place;
        for (i = 0; place = places[i]; i++) {
            (function (place) {
                var marker = new google.maps.Marker({
                    position: place.geometry.location
                });
                console.log(document.getElementById('pac-input').value)
                marker.bindTo('map', searchBox, 'map');
                google.maps.event.addListener(marker, 'map_changed', function () {
                    if (!this.getMap()) {
                        this.unbindAll();
                    }
                });
                var lat = marker.getPosition().lat();
                var lng = marker.getPosition().lng();
                console.log(lat)
                console.log(lng)
                markers.push(marker);
                bounds.extend(place.geometry.location);
                // document.getElementById("point_name").value = document.getElementById('pac-input').value;
                // document.getElementById("latitude").value = lat;
                // document.getElementById("longitude").value = lng;
                Cookies.set('latitude', lat)
                Cookies.set('longitude', lng)
            }(place));

        }
         map.fitBounds(bounds);
        searchBox.set('map', map);
        map.setZoom(Math.min(map.getZoom(), 18));
    });
}
function _m() {
    var mapOptions = {
        // center: { lat: Number(mapCurrents.lat), lng: Number(mapCurrents.lng) },
        center: { lat: 13.8018, lng: 100.5841 },
        zoom: 15,
    }
    var maps = new google.maps.Map(document.getElementById("map"), mapOptions);
    var marker, info, poly;
    marker = new google.maps.Marker({
        //position: new google.maps.LatLng(mapCurrents.lat, mapCurrents.lng),
        position: new google.maps.LatLng(13.8018, 100.5841),
        map: maps,
    });
    maps.addListener('click', function (mapsMouseEvent) {
        console.log(markers.length)
        if (markers.length > 0) {
            markers.pop().setMap(null);
        }
        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng

        });
        infoWindow.setContent(mapsMouseEvent.latLng.toString());
        var checkmarker = infoWindow.content.split(",")
        // // console.log(checkmarker)
        console.log(checkmarker[0].substring(1, checkmarker[0].length))
        console.log(checkmarker[1].replace(" ", "").substring(0, checkmarker[0].length - 1))
        var lat = checkmarker[0].substring(1, checkmarker[0].length);
        var lng = checkmarker[1].replace(" ", "").substring(0, checkmarker[0].length - 1);
        var marker;
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: maps
        });
        markers.push(marker);
    });
}
$(function () {
    $(document).ready(function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                Currentmap(position.coords.latitude, position.coords.longitude)
            });
        }
    });
});