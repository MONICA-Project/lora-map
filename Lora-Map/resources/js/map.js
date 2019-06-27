var mymap = L.map('bigmap').setView(["{%START_LOCATION%}"], 16);

GetMapLayers();
function GetMapLayers() {
  var layergetter = new XMLHttpRequest();
  layergetter.onreadystatechange = function () {
    if (layergetter.readyState === 4 && layergetter.status === 200) {
      var maps = JSON.parse(layergetter.responseText);
      var i = 0;
      for (var key in maps) {
        i++;
      }
      if (i === 1) {
        L.tileLayer(maps["online"]["url"], {
          attribution: maps["online"]["attribution"],
          minZoom: maps["online"]["minZoom"],
          maxZoom: maps["online"]["maxZoom"]
        }).addTo(mymap);
      } else {
        var baseMaps = {};
        for (key in maps) {
          if (key !== "online") {
            var basemap = L.tileLayer(maps[key]["url"], {
              attribution: maps[key]["attribution"],
              minZoom: maps[key]["minZoom"],
              maxZoom: maps[key]["maxZoom"],
              errorTileUrl: "css/icons/failtile.png"
            });
            basemap.addTo(mymap);
            baseMaps[maps[key]["title"]] = basemap;
            break;
          }
        }
        for (key in maps) {
          if (!baseMaps.hasOwnProperty(maps[key]["title"])) {
            baseMaps[maps[key]["title"]] = L.tileLayer(maps[key]["url"], {
              attribution: maps[key]["attribution"],
              minZoom: maps[key]["minZoom"],
              maxZoom: maps[key]["maxZoom"],
              errorTileUrl: "css/icons/failtile.png"
            });
          }
        }
        L.control.layers(baseMaps).addTo(mymap);
      }
    }
  };
  layergetter.open("GET", "/getlayer", true);
  layergetter.send();
}

var SpecialMarkers = new Array();
GetGeoLayer();
function GetGeoLayer() {
  var geogetter = new XMLHttpRequest();
  geogetter.onreadystatechange = function () {
    if (geogetter.readyState === 4 && geogetter.status === 200) {
      var geo = JSON.parse(geogetter.responseText);
      if (!(Object.keys(geo).length === 0 && geo.constructor === Object)) {
        L.geoJSON(geo, {
          style: function (features) {
            return {
              color: typeof features.properties["stroke"] === "undefined" ? '#000000' : features.properties["stroke"],
              weight: typeof features.properties["stroke-width"] === "undefined" ? 1 : features.properties["stroke-width"],
              opacity: typeof features.properties["stroke-opacity"] === "undefined" ? 1 : features.properties["stroke-opacity"],
              fillColor: typeof features.properties["fill"] === "undefined" ? '#ffffff' : features.properties["fill"],
              fillOpacity: typeof features.properties["fill-opacity"] === "undefined" ? 1 : features.properties["fill-opacity"]
            };
          },
          onEachFeature: function (feature, layer) {
            if (feature.geometry.type === "Polygon" || (feature.geometry.type === "Point" && feature.properties.hasOwnProperty("icon"))) {
              layer.bindPopup(feature.properties.name);
            }
          },
          pointToLayer: function (geoJsonPoint, latlng) {
            if (geoJsonPoint.properties.hasOwnProperty("description") && geoJsonPoint.properties["description"] === "snumber" && !geoJsonPoint.properties.hasOwnProperty("icon")) {
              var snumbericon = L.marker(latlng, {
                icon: new L.DivIcon({
                  className: "snumber-icon",
                  html: geoJsonPoint.properties["name"],
                  iconSize: [8, 8]
                })
              });
              SpecialMarkers.push(snumbericon);
              return snumbericon;
            } else if (geoJsonPoint.properties.hasOwnProperty("description") && geoJsonPoint.properties["description"] === "coord" && !geoJsonPoint.properties.hasOwnProperty("icon")) {
              var coordicon = L.marker(latlng, {
                icon: new L.DivIcon({
                  className: "coord-icon",
                  html: geoJsonPoint.properties["name"]
                })
              });
              SpecialMarkers.push(coordicon);
              return coordicon;
            } else if (geoJsonPoint.properties.hasOwnProperty("icon")) {
              return L.marker(latlng, { icon: L.icon({ iconUrl: "css/icons/cctv.png", iconSize: [32, 32] }) });
            }
          }
        }).addTo(mymap);
      }
    }
  };
  geogetter.open("GET", "/getgeo", true);
  geogetter.send();
}

mymap.on('zoomend', function () {
  var currentZoom = mymap.getZoom();
  if (currentZoom < 14) {
    SpecialMarkers.forEach(function (elem, index) {
      if (elem.feature.properties["description"] === "snumber") {
        elem._icon.style.fontSize = "0px";
        elem._icon.style.marginLeft = "0px";
        elem._icon.style.marginTop = "0px";
      }
      if (elem.feature.properties["description"] === "coord") {
        elem._icon.style.fontSize = "0px";
      }
    });
  } else if (currentZoom == 14) {
    SpecialMarkers.forEach(function (elem, index) {
      if (elem.feature.properties["description"] === "snumber") {
        elem._icon.style.fontSize = "0px";
        elem._icon.style.marginLeft = "0px";
        elem._icon.style.marginTop = "0px";
      }
      if (elem.feature.properties["description"] === "coord") {
        elem._icon.style.fontSize = "6px";
      }
    });
  } else if (currentZoom == 15) {
    SpecialMarkers.forEach(function (elem, index) {
      if (elem.feature.properties["description"] === "snumber") {
        elem._icon.style.fontSize = "0px";
        elem._icon.style.marginLeft = "0px";
        elem._icon.style.marginTop = "0px";
      }
      if (elem.feature.properties["description"] === "coord") {
        elem._icon.style.fontSize = "9px";
      }
    });
  } else if (currentZoom == 16) {
    SpecialMarkers.forEach(function (elem, index) {
      if (elem.feature.properties["description"] === "snumber") {
        elem._icon.style.fontSize = "5px";
        elem._icon.style.marginLeft = "-4px";
        elem._icon.style.marginTop = "-4px";
      }
      if (elem.feature.properties["description"] === "coord") {
        elem._icon.style.fontSize = "13px";
      }
    });
  } else if (currentZoom == 17) {
    SpecialMarkers.forEach(function (elem, index) {
      if (elem.feature.properties["description"] === "snumber") {
        elem._icon.style.fontSize = "5px";
        elem._icon.style.marginLeft = "-4px";
        elem._icon.style.marginTop = "-4px";
      }
      if (elem.feature.properties["description"] === "coord") {
        elem._icon.style.fontSize = "16px";
      }
    });
  } else if (currentZoom == 18) {
    SpecialMarkers.forEach(function (elem, index) {
      if (elem.feature.properties["description"] === "snumber") {
        elem._icon.style.fontSize = "8px";
        elem._icon.style.marginLeft = "-5px";
        elem._icon.style.marginTop = "-6px";
      }
      if (elem.feature.properties["description"] === "coord") {
        elem._icon.style.fontSize = "25px";
      }
    });
  } else if (currentZoom == 19) {
    SpecialMarkers.forEach(function (elem, index) {
      if (elem.feature.properties["description"] === "snumber") {
        elem._icon.style.fontSize = "14px";
        elem._icon.style.marginLeft = "-8px";
        elem._icon.style.marginTop = "-11px";
      }
      if (elem.feature.properties["description"] === "coord") {
        elem._icon.style.fontSize = "45px";
      }
    });
  }
});

mymap.on("click", hidePanel);

function hidePanel(e) {
  showHidePanel(null);
}