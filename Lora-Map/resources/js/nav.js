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

var visiblePanel = null;
function showHidePanel(name) {
  if (visiblePanel == null) {
    document.getElementById("pannels").style.display = "block";
    document.getElementById(name).style.display = "block";
    visiblePanel = name;
  } else if (visiblePanel == name) {
    document.getElementById("pannels").style.display = "none";
    visiblePanel = null;
  } else {
    document.getElementById(visiblePanel).style.display = "none";
    document.getElementById(name).style.display = "block";
    visiblePanel = name;
  }
}