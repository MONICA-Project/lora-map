var mymap = L.map('bigmap').setView(["{%START_LOCATION%}"], 14);

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

mymap.on("click", hidePanel);

function hidePanel(e) {
  showHidePanel(null);
}