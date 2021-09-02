let markers = [];
var marker = [];
var data_map;
var maps;
var info;
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
    var mapOptions = {
        center: { lat: Number(_lat), lng: Number(_lng) },
        zoom: 15,
        options: {
            gestureHandling: 'greedy'
        }
    }
    maps = new google.maps.Map(document.getElementById("map"), mapOptions);
    //var marker;
    marker = new google.maps.Marker({
        // position: new google.maps.LatLng(_lat, _lng),
        map: maps,
        options: {
            gestureHandling: 'greedy'
        }
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
            map: maps,
        });
        markers.push(marker);
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
        center: { lat: Number(mapCurrents.lat), lng: Number(mapCurrents.lng) },
        // center: { lat: 13.8018, lng: 100.5841 },
        zoom: 15,
        zoomControl: false,
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
        var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = window.location.search.substring(1),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;
            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                }
            }
        };
        var latitude = getUrlParameter('latitude');
        var longitude = getUrlParameter('longitude');

        if (latitude != undefined) {
            var jsonObj = [{ "location": "", "latitude": latitude, "longitude": longitude }]
            var mapOptions = {
                center: { lat: Number(jsonObj[0].latitude), lng: Number(jsonObj[0].longitude) },
                zoom: 15,
                options: {
                    gestureHandling: 'greedy'
                  }
            }
            markers.push(marker);
            var maps = new google.maps.Map(document.getElementById("map"), mapOptions);
            search(maps);
            var marker, info;
            $.each(jsonObj, function (i, item) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(item.latitude, item.longitude),
                    map: maps,
                    options: {
                        gestureHandling: 'greedy'
                    }
                });
                info = new google.maps.InfoWindow();
                google.maps.event.addListener(marker, 'click', (function (marker, i) {
                    return function () {
                        info.setContent(item.location);
                        info.open(maps, marker);
                    }
                })(marker, i));
            });
            markers.push(marker);
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

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                if (longitude == undefined) {
                    Currentmap(position.coords.latitude, position.coords.longitude)
                }
            });
        }
    });
});