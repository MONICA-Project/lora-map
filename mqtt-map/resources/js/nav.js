var mymap = L.map('bigmap').setView([{%START_LOCATION%}], 14);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 20,
  id: 'mapbox.streets',
  accessToken: '{%YOUR_API_KEY%}'
}).addTo(mymap);

var markers = {};

setInterval(datarunner, 1000);
function datarunner() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = parsedata;
  xhttp.open("GET", "http://{%REQUEST_URL_HOST%}:8080/loc", true);
  xhttp.send();
}
//https://leafletjs.com/reference-1.4.0.html#marker
function parsedata() {
  if (this.readyState == 4 && this.status == 200) {
    var items = JSON.parse(this.responseText);
    for (var key in items) {
      if (items.hasOwnProperty(key)) {
        var markeritem = items[key];
        if (!markers.hasOwnProperty(key)) {
          markers[key] = L.marker([markeritem['Latitude'], markeritem['Longitude']]).addTo(mymap);
        } else {
          markers[key].setLatLng([markeritem['Latitude'], markeritem['Longitude']]);
        }
      }
    }
  }
}



/*var devices = {};
function get_elm() {
    var colors = new Array(
        "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
        "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    );
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var obj = JSON.parse(this.responseText);
            var i = 0;
            for (var names in obj) {
                if (obj.hasOwnProperty(names)) {
                    if (!devices.hasOwnProperty(names)) {
                        devices[names] = 0;
                    }
                    var list = obj[names];
                    var j = devices[names];
                    for (var pos in list) {
                        if (list.hasOwnProperty(pos)) {
                            var m = new google.maps.Marker({
                                icon: colors[i % colors.length],
                                position: new google.maps.LatLng(list[pos]["Latitude"], list[pos]["Longitude"]),
                                animation: google.maps.Animation.DROP
                            });
                            var infowindow = new google.maps.InfoWindow({
                                content: "<div>" +
                                    "Name: " + names + "<br>" +
                                    "PacketRssi: " + list[pos]["PacketRssi"] + "<br>" +
                                    "Rssi: " + list[pos]["Rssi"] + "<br>" +
                                    "Snr: " + list[pos]["Snr"] + "<br>" +
                                    "Upatedtime: " + list[pos]["Upatedtime"] + "<br>" +
                                    "Hdop: " + list[pos]["Hdop"] + "<br>" +
                                    "Battery: " + list[pos]["Battery"] + "<br>" +
                                    "Fix: " + list[pos]["Fix"] +
                                    "</div>"
                            });
                            m.addListener('click', function () {
                                infowindow.open(map, m);
                            });
                            m.setMap(map);
                            if (!center_set) {
                                map.setCenter(new google.maps.LatLng(list[pos]["Latitude"], list[pos]["Longitude"]));
                                smoothZoom(15, map.getZoom());
                                center_set = true;
                            }
                            j++;
                        }
                    }
                    devices[names] = j;
                    i++;
                }
            }
        }
    };
    var qstring = "";
    for (var item in devices) {
        if (devices.hasOwnProperty(item)) {
            qstring += item + ":" + devices[item];
        }
        qstring += ";";
    }
    xhttp.open("GET", "http://{%REQUEST_URL_HOST%}:8080/loc?i=" + qstring.substr(0, qstring.length - 1), true);
    xhttp.send();
}
setInterval(get_elm, 5000);
function smoothZoom(max, current) {
    if (current >= max) {
        return;
    } else {
        var z = google.maps.event.addListener(map, 'zoom_changed', function (event) {
            google.maps.event.removeListener(z);
            smoothZoom(max, current + 1);
        });
        setTimeout(function () { map.setZoom(current) }, 150);
    }
}
*/
/*var map;
var center_set = false;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: new google.maps.LatLng(0, 0)
    });
}
*/