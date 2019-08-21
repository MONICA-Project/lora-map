var MapObject = {
  Map: {},
  _FightDedection: {},
  _SpecialMarkers: new Array(),
  Start: function () {
    this.Map = L.map('bigmap').setView([0, 0], 16);
    this._SetupMapZoomFontsize();
    this._SetupClickHandler();
    return this;
  },
  _ParseAJAXSettings: function (settings) {
    this.Map.panTo([settings.Startloclat, settings.Startloclon]);
    this._GenerateGrid(settings.Grid);
    this._GenerateFightBoxes(settings.FightDedection);
  },
  _ParseAJAXLayers: function (maps) {
    var i = 0;
    for (var key in maps) {
      i++;
    }
    if (i === 1) {
      L.tileLayer(maps["online"]["url"], {
        attribution: maps["online"]["attribution"],
        minZoom: maps["online"]["minZoom"],
        maxZoom: maps["online"]["maxZoom"]
      }).addTo(this.Map);
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
          basemap.addTo(this.Map);
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
      L.control.layers(baseMaps).addTo(this.Map);
    }
  },
  _GenerateGrid: function (grid) {
    for (var i = 0; i < grid.Major.length; i++) {
      var linemajor = grid.Major[i];
      L.polyline([[linemajor.from[0], linemajor.from[1]], [linemajor.to[0], linemajor.to[1]]], { color: "red", weight: 1 }).addTo(this.Map);
    }
    for (var j = 0; j < grid.Minor.length; j++) {
      var lineminor = grid.Minor[j];
      L.polyline([[lineminor.from[0], lineminor.from[1]], [lineminor.to[0], lineminor.to[1]]], { color: "red", weight: 0.7, opacity: 0.5 }).addTo(this.Map);
    }
  },
  _GenerateFightBoxes: function (fightdedection) {
    for (var cameraid in fightdedection) {
      this._FightDedection[cameraid] = L.polygon(fightdedection[cameraid], { color: 'black', weight: 1 }).addTo(this.Map);
      this._FightDedection[cameraid].bindPopup("Fightdedection für Kamera: " + cameraid);
    }
  },
  _ParseAJAXFightDedection: function (json) {
    for (var cameraid in json) {
      if (this._FightDedection.hasOwnProperty(cameraid)) {
        var fight = json[cameraid];
        var box = this._FightDedection[cameraid];
        var diff = FunctionsObject.TimeCalculation(fight["LastUpdate"], "diffraw");
        if (diff <= 10 && box.options.color === "black") {
          box.setStyle({ color: 'rgb(' + (fight["FightProbability"]*255)+',0,0)' });
        } else if (diff <= 10 && box.options.color !== "black") {
          if (diff % 2 == 0) {
            box.setStyle({ color: 'rgb(' + (fight["FightProbability"] * 255) + ',0,0)' });
          } else {
            box.setStyle({ color: 'green' });
          }
        } else if (diff > 10 && box.options.color !== "black") {
          box.setStyle({ color: 'black' });
        }
      }
    }
  },
  _ParseAJAXGeo: function (geo) {
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
          if (feature.geometry.type === "Polygon" || feature.geometry.type === "Point" && feature.properties.hasOwnProperty("icon")) {
            var text = "<b>" + feature.properties.name + "</b>";
            if (feature.properties.hasOwnProperty("description")) {
              text = text + "<br>" + feature.properties.description;
            }
            layer.bindPopup(text);
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
            MapObject._SpecialMarkers.push(snumbericon);
            return snumbericon;
          } else if (geoJsonPoint.properties.hasOwnProperty("description") && geoJsonPoint.properties["description"] === "coord" && !geoJsonPoint.properties.hasOwnProperty("icon")) {
            var coordicon = L.marker(latlng, {
              icon: new L.DivIcon({
                className: "coord-icon",
                html: geoJsonPoint.properties["name"]
              })
            });
            MapObject._SpecialMarkers.push(coordicon);
            return coordicon;
          } else if (geoJsonPoint.properties.hasOwnProperty("icon")) {
            return L.marker(latlng, { icon: L.icon({ iconUrl: "css/icons/cctv.png", iconSize: [32, 32] }) });
          }
        }
      }).addTo(this.Map);
    }
  },
  _SetupMapZoomFontsize: function () {
    this.Map.on('zoomend', function () {
      var currentZoom = MapObject.Map.getZoom();
      if (currentZoom < 14) {
        MapObject._SpecialMarkers.forEach(function (elem, index) {
          if (elem.feature.properties["description"] === "snumber") {
            elem._icon.style.fontSize = "0px";
            elem._icon.style.marginLeft = "0px";
            elem._icon.style.marginTop = "0px";
          }
          if (elem.feature.properties["description"] === "coord") {
            elem._icon.style.fontSize = "0px";
          }
        });
      } else if (currentZoom === 14) {
        MapObject._SpecialMarkers.forEach(function (elem, index) {
          if (elem.feature.properties["description"] === "snumber") {
            elem._icon.style.fontSize = "0px";
            elem._icon.style.marginLeft = "0px";
            elem._icon.style.marginTop = "0px";
          }
          if (elem.feature.properties["description"] === "coord") {
            elem._icon.style.fontSize = "6px";
          }
        });
      } else if (currentZoom === 15) {
        MapObject._SpecialMarkers.forEach(function (elem, index) {
          if (elem.feature.properties["description"] === "snumber") {
            elem._icon.style.fontSize = "0px";
            elem._icon.style.marginLeft = "0px";
            elem._icon.style.marginTop = "0px";
          }
          if (elem.feature.properties["description"] === "coord") {
            elem._icon.style.fontSize = "9px";
          }
        });
      } else if (currentZoom === 16) {
        MapObject._SpecialMarkers.forEach(function (elem, index) {
          if (elem.feature.properties["description"] === "snumber") {
            elem._icon.style.fontSize = "5px";
            elem._icon.style.marginLeft = "-4px";
            elem._icon.style.marginTop = "-4px";
          }
          if (elem.feature.properties["description"] === "coord") {
            elem._icon.style.fontSize = "13px";
          }
        });
      } else if (currentZoom === 17) {
        MapObject._SpecialMarkers.forEach(function (elem, index) {
          if (elem.feature.properties["description"] === "snumber") {
            elem._icon.style.fontSize = "5px";
            elem._icon.style.marginLeft = "-4px";
            elem._icon.style.marginTop = "-4px";
          }
          if (elem.feature.properties["description"] === "coord") {
            elem._icon.style.fontSize = "16px";
          }
        });
      } else if (currentZoom === 18) {
        MapObject._SpecialMarkers.forEach(function (elem, index) {
          if (elem.feature.properties["description"] === "snumber") {
            elem._icon.style.fontSize = "8px";
            elem._icon.style.marginLeft = "-5px";
            elem._icon.style.marginTop = "-6px";
          }
          if (elem.feature.properties["description"] === "coord") {
            elem._icon.style.fontSize = "25px";
          }
        });
      } else if (currentZoom === 19) {
        MapObject._SpecialMarkers.forEach(function (elem, index) {
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
  },
  _SetupClickHandler: function () {
    this.Map.on("click", this._HidePanel);
  },
  _HidePanel: function (e) {
    MenuObject.ShowHidePanel(null);
  }
}.Start();