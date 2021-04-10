var MapObject = {
  /// public variables
  GeoJson: {},
  Map: {},
  /// private variables
  _DensityAreas: {},
  _FightDedection: {},
  _SpecialMarkers: new Array(),
  /// public functions
  JumpTo: function (lat, lon) {
    this.Map.flyTo([lat, lon], 19);
  },
  ParseAJAXCameraModel: function (json) {
    this._ParseAJAXFightDedection(json.Fights);
    this._ParseAJAXDensity(json.Density);
  },
  ParseAJAXSettings: function (settings) {
    this._ParseAJAXLayers(settings.Layers);
    this._ParseAJAXGeo(settings.GeoLayer);
    this.Map.panTo([settings.Startloclat, settings.Startloclon]);
    this._GenerateGrid(settings.Grid);
    this._GenerateFightBoxes(settings.FightDedection);
    this._GenerateDensityBoxes(settings.DensityArea);
  },
  Start: function () {
    this.Map = L.map('bigmap').setView([0, 0], 16);
    this._SetupMapZoomFontsize();
    this._SetupClickHandler();
    return this;
  },
  /// private functions
  _createRGB: function (current, max) {
    return "hsl(" + 120 * (1 - current / max) + ",100%,50%)";
  },
  _GenerateDensityBoxes: function (densityareas) {
    for (var cameraid in densityareas) {
      this._DensityAreas[cameraid] = { 'Poly': L.polygon(densityareas[cameraid].Polygon, { color: 'hsl(120,100%,50%)', weight: 1 }).addTo(this.Map), 'Maximum': densityareas[cameraid].Maximum };
      this._DensityAreas[cameraid].Poly.bindPopup("<strong>Besuchermenge:</strong><br>" +
        "Besucher <strong>(0/" + this._DensityAreas[cameraid].Maximum + ")</strong> Personen<br>" +
        "<progress value='0' max='" + this._DensityAreas[cameraid].Maximum + "'></progress>");
    }
  },
  _GenerateFightBoxes: function (fightdedection) {
    for (var cameraid in fightdedection) {
      this._FightDedection[cameraid] = {};
      this._FightDedection[cameraid].Box = L.polygon(fightdedection[cameraid].Polygon, { color: 'black', weight: 1 }).addTo(this.Map);
      this._FightDedection[cameraid].Box.bindPopup("Fightdedection " + fightdedection[cameraid].Alias);
      this._FightDedection[cameraid].Level = fightdedection[cameraid].Level;
    }
  },
  _GenerateGrid: function (grid) {
    for (var i = 0; i < grid.Major.length; i++) {
      var linemajor = grid.Major[i];
      L.polyline([[linemajor.from[0], linemajor.from[1]], [linemajor.to[0], linemajor.to[1]]], { color: "red", weight: 1, interactive: false }).addTo(this.Map);
    }
    for (var j = 0; j < grid.Minor.length; j++) {
      var lineminor = grid.Minor[j];
      L.polyline([[lineminor.from[0], lineminor.from[1]], [lineminor.to[0], lineminor.to[1]]], { color: "red", weight: 0.7, opacity: 0.5, interactive: false }).addTo(this.Map);
    }
  },
  _HidePanel: function (e) {
    MenuObject.ShowHidePanel(null);
  },
  _ParseAJAXDensity: function (json) {
    for (var cameraid in json) {
      if (Object.prototype.hasOwnProperty.call(this._DensityAreas, cameraid)) {
        var crowd = json[cameraid];
        var box = this._DensityAreas[cameraid].Poly;
        var max = this._DensityAreas[cameraid].Maximum;
        var cur = crowd.DensityCount;
        if (cur > max) {
          cur = max;
        }
        box.setStyle({ color: this._createRGB(cur, max) });
        var p = box.getPopup().setContent("<strong>Besuchermenge:</strong><br>" +
          "Besucher <strong>(" + crowd.DensityCount + "/" + max + ")</strong> Personen<br>" +
          "<progress value='" + cur + "' max='" + max + "'></progress>").update();
      }
    }
  },
  _ParseAJAXFightDedection: function (json) {
    for (var cameraid in json) {
      if (Object.prototype.hasOwnProperty.call(this._FightDedection, cameraid)) {
        var fight = json[cameraid];
        var box = this._FightDedection[cameraid].Box;
        var diff = FunctionsObject.TimeCalculation(fight["LastUpdate"], "diffraw");
        if (fight["FightProbability"] > this._FightDedection[cameraid].Level) {
          if (diff <= 10 && box.options.color === "black") {
            box.setStyle({ color: 'rgb(' + fight["FightProbability"] * 255 + ',0,0)' });
          } else if (diff <= 10 && box.options.color !== "black") {
            if (diff % 2 === 0) {
              box.setStyle({ color: 'rgb(' + fight["FightProbability"] * 255 + ',0,0)' });
            } else {
              box.setStyle({ color: 'green' });
            }
          } else if (diff > 10 && box.options.color !== "black") {
            box.setStyle({ color: 'black' });
          }
        }
      }
    }
  },
  _ParseAJAXGeo: function (geo) {
    if (!(Object.keys(geo).length === 0 && geo.constructor === Object)) {
      this.GeoJson = geo;
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
          if (feature.geometry.type === "Polygon" || feature.geometry.type === "Point" && Object.prototype.hasOwnProperty.call(feature.properties, "icon")) {
            var text = "<b>" + feature.properties.name + "</b>";
            if (Object.prototype.hasOwnProperty.call(feature.properties, "description")) {
              text = text + "<br>" + feature.properties.description;
            }
            layer.bindPopup(text, { maxWidth: 485 });
          }
        },
        pointToLayer: function (geoJsonPoint, latlng) {
          if (Object.prototype.hasOwnProperty.call(geoJsonPoint.properties, "description") && geoJsonPoint.properties["description"] === "snumber" && !Object.prototype.hasOwnProperty.call(geoJsonPoint.properties, "icon")) {
            var snumbericon = L.marker(latlng, {
              icon: new L.DivIcon({
                className: "snumber-icon",
                html: geoJsonPoint.properties["name"],
                iconSize: [8, 8]
              }),
              interactive: false
            });
            MapObject._SpecialMarkers.push(snumbericon);
            return snumbericon;
          } else if (Object.prototype.hasOwnProperty.call(geoJsonPoint.properties, "description") && geoJsonPoint.properties["description"] === "coord" && !Object.prototype.hasOwnProperty.call(geoJsonPoint.properties, "icon")) {
            var coordicon = L.marker(latlng, {
              icon: new L.DivIcon({
                className: "coord-icon",
                html: geoJsonPoint.properties["name"]
              }),
              interactive: false
            });
            MapObject._SpecialMarkers.push(coordicon);
            return coordicon;
          } else if (Object.prototype.hasOwnProperty.call(geoJsonPoint.properties, "icon")) {
            return L.marker(latlng, { icon: L.icon({ iconUrl: "css/icons/cctv.png", iconSize: [32, 32] }) });
          }
        }
      }).addTo(this.Map);
    }
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
        if (!Object.prototype.hasOwnProperty.call(baseMaps, maps[key]["title"])) {
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
  _SetupClickHandler: function () {
    this.Map.on("click", this._HidePanel);
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
      MarkerObject.ScaleSensors("zoom");
    });
  }
}.Start();