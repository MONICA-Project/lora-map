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
  layergetter.open("GET", "http://{%REQUEST_URL_HOST%}/getlayer", true);
  layergetter.send();
}

GetGeoLayer();
function GetGeoLayer() {
  var geogetter = new XMLHttpRequest();
  geogetter.onreadystatechange = function () {
    if (geogetter.readyState === 4 && geogetter.status === 200) {
      var geo = JSON.parse(geogetter.responseText);
      L.geoJSON(geo, {
        style: function (features) {
          if (typeof features.properties["stroke-width"] === "undefined") {
            //alert("no!");
          }
          return {
            color: typeof features.properties["stroke"] === "undefined" ? '#000000' : features.properties["stroke"],
            weight: typeof features.properties["stroke-width"] === "undefined" ? 1 : features.properties["stroke-width"],
            opacity: typeof features.properties["stroke-opacity"] === "undefined" ? 1 : features.properties["stroke-opacity"],
            fillColor: typeof features.properties["fill"] === "undefined" ? '#ffffff' : features.properties["fill"],
            fillOpacity: typeof features.properties["fill-opacity"] === "undefined" ? 1 : features.properties["fill-opacity"]
          };
        },
        onEachFeature: function (feature, layer) {
          if (feature.geometry.type !== "LineString") {
            layer.bindPopup(feature.properties.name);
          }
        },
        pointToLayer: function (geoJsonPoint, latlng) {
          return L.marker(latlng, { icon: L.icon({iconUrl: "css/icons/cctv.png", iconSize: [32,32]}) });
        }
      }).addTo(mymap);
    }
  };
  geogetter.open("GET", "http://{%REQUEST_URL_HOST%}/getgeo", true);
  geogetter.send();
}

mymap.on("click", hidePanel);

function hidePanel(e) {
  showHidePanel(null);
}