setInterval(datarunner, 1000);
function datarunner() {
  var loc = new XMLHttpRequest();
  loc.onreadystatechange = parseAjaxLoc;
  loc.open("GET", "/loc", true);
  loc.send();

  var panic = new XMLHttpRequest();
  panic.onreadystatechange = parseAjaxPanic;
  panic.open("GET", "/panic", true);
  panic.send();
}

var markers = {};
var serverLocation = {};
//https://leafletjs.com/reference-1.4.0.html#marker
function parseAjaxLoc() {
  if (this.readyState === 4 && this.status === 200) {
    serverLocation = JSON.parse(this.responseText);
    for (var key in serverLocation) {
      if (serverLocation.hasOwnProperty(key)) {
        var positionItem = serverLocation[key];
        if (positionItem['Latitude'] !== 0 || positionItem['Longitude'] !== 0) {
          if (!markers.hasOwnProperty(key)) {
            var marker = null;
            if (positionItem['Icon'] === null) {
              marker = L.marker([positionItem['Latitude'], positionItem['Longitude']], { 'title': positionItem['Name'] });
            } else {
              var myIcon = L.divIcon({
                className: 'pos-marker',
                iconSize: [56, 80],
                iconAnchor: [0, 80],
                html: '<object data="'+positionItem['Icon']+'" type="image/svg+xml" style="height:80px; width:56px;"></object>'
              });
              marker = L.marker([positionItem['Latitude'], positionItem['Longitude']], { 'title': positionItem['Name'], 'icon': myIcon });
            }
            markers[key] = marker.addTo(mymap).on("click", showMarkerInfo, key);
          } else {
            markers[key].setLatLng([positionItem['Latitude'], positionItem['Longitude']]);
            if (positionItem['Icon'] !== null) {
              if (markers[key]._icon.children.length === 0) {
                markers[key].setIcon(L.divIcon({
                  className: 'pos-marker',
                  iconSize: [56, 80],
                  iconAnchor: [0, 80],
                  html: '<object data="' + positionItem['Icon'] + '" type="image/svg+xml" style="height:80px; width:56px;"></object>'
                }));
              } else if (markers[key]._icon.children[0].hasAttribute("data")) {
                var old = markers[key]._icon.children[0]["data"].substring(markers[key]._icon.children[0]["data"].indexOf("/", 7) + 1);
                if (old !== positionItem['Icon']) {
                  markers[key]._icon.children[0]["data"] = positionItem['Icon'];
                }
              }
            } else {
              if (markers[key]._icon.children.length === 1 && markers[key]._icon.children[0].hasAttribute("data")) {
                markers[key].removeFrom(mymap);
                markers[key] = L.marker([positionItem['Latitude'], positionItem['Longitude']], { 'title': positionItem['Name'] }).addTo(mymap).on("click", showMarkerInfo, key);
              }
            }
          }
        }
      }
    }
    updateStatus();
    update_pannels_info();
  }
}

function parseAjaxPanic() {
  if (this.readyState === 4 && this.status === 200) {
    var panics = JSON.parse(this.responseText);
    for (var id in panics) {
      if (panics.hasOwnProperty(id)) {
        var alertItem = panics[id];
        if (markers.hasOwnProperty(id)) {
          var marker = markers[id];
          if (timeCalculation(alertItem["Recievedtime"], "diffraw") <= 10 && marker._icon.className.indexOf(" marker-alert") === -1) {
            marker._icon.className += " marker-alert";
            showMarkerInfoPerId(id);
          } else if (timeCalculation(alertItem["Recievedtime"], "diffraw") > 10 && marker._icon.className.indexOf(" marker-alert") !== -1) {
            marker._icon.className = marker._icon.className.replace(" marker-alert", "");
          }
        }
      }
    }
  }
}