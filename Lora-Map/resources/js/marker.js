var markers = {};
var serverLocation = {};

setInterval(datarunner, 1000);
function datarunner() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = parsedata;
  xhttp.open("GET", "http://{%REQUEST_URL_HOST%}:8080/loc", true);
  xhttp.send();
}

//https://leafletjs.com/reference-1.4.0.html#marker
function parsedata() {
  if (this.readyState === 4 && this.status === 200) {
    serverLocation = JSON.parse(this.responseText);
    for (var key in serverLocation) {
      if (serverLocation.hasOwnProperty(key)) {
        var markeritem = serverLocation[key];
        if (markeritem['Latitude'] !== 0 || markeritem['Longitude'] !== 0) {
          if (!markers.hasOwnProperty(key)) {
            var marker = null;
            if (markeritem['Icon'] === null) {
              marker = L.marker([markeritem['Latitude'], markeritem['Longitude']], { 'title': markeritem['Name'] });
            } else {
              var myIcon = L.divIcon({
                className: 'pos-marker',
                iconSize: [56, 80],
                iconAnchor: [0, 80],
                html: '<object data="'+markeritem['Icon']+'" type="image/svg+xml" style="height:80px; width:56px;"></object>'
              });
              marker = L.marker([markeritem['Latitude'], markeritem['Longitude']], { 'title': markeritem['Name'], 'icon': myIcon });
            }
            markers[key] = marker.addTo(mymap).on("click", showMarkerInfo, key);
          } else {
            markers[key].setLatLng([markeritem['Latitude'], markeritem['Longitude']]);
          }
        }
      }
    }
    updateStatus();
    updateDeviceStatus();
  }
}