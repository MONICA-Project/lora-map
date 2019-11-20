var MarkerObject = {
  _Markers: {},
  PanicData: {},
  LocationData: {},
  VisibleMarkers: {},
  _Sensors: {},
  _SensorSettings: {},
  Start: function () {
    return this;
  },
  _ParseAJAXLoc: function (serverLocation) {
    this.LocationData = serverLocation;
    for (var key in this.LocationData) {
      if (this.LocationData.hasOwnProperty(key)) {
        var positionItem = this.LocationData[key];
        if (positionItem['Latitude'] !== 0 || positionItem['Longitude'] !== 0) {
          if (!this._Markers.hasOwnProperty(key)) {
            var marker = null;
            if (positionItem['Icon'] === null) {
              marker = L.marker([positionItem['Latitude'], positionItem['Longitude']], { 'title': positionItem['Name'] });
            } else {
              var myIcon = L.divIcon({
                className: 'pos-marker',
                iconSize: [56, 80],
                iconAnchor: [0, 80],
                html: '<img src="' + positionItem['Icon'] + '" height="80" width="56" />'
              });
              marker = L.marker([positionItem['Latitude'], positionItem['Longitude']], { 'title': positionItem['Name'], 'icon': myIcon });
            }
            this._Markers[key] = marker.addTo(MapObject.Map).on("click", function () { MenuObject.statusToDevice = this; MenuObject.ShowHidePanel("pannels_info"); }, key);
          } else {
            this._Markers[key].setLatLng([positionItem['Latitude'], positionItem['Longitude']]);
            if (positionItem['Icon'] !== null) {
              if (this._Markers[key]._icon.children.length === 0) {
                this._Markers[key].setIcon(L.divIcon({
                  className: 'pos-marker',
                  iconSize: [56, 80],
                  iconAnchor: [0, 80],
                  html: '<img src="' + positionItem['Icon'] + '" height="80" width="56" />'
                }));
              } else if (this._Markers[key]._icon.children[0].hasAttribute("src")) {
                var old = this._Markers[key]._icon.children[0]["src"].substring(this._Markers[key]._icon.children[0]["src"].indexOf("/", 7) + 1);
                if (old !== positionItem['Icon']) {
                  this._Markers[key]._icon.children[0]["src"] = positionItem['Icon'];
                }
              }
            } else {
              if (this._Markers[key]._icon.children.length === 1 && this._Markers[key]._icon.children[0].hasAttribute("src")) {
                this._Markers[key].removeFrom(MapObject.Map);
                this._Markers[key] = L.marker([positionItem['Latitude'], positionItem['Longitude']], { 'title': positionItem['Name'] }).addTo(MapObject.Map).on("click", function () { MenuObject.statusToDevice = this; MenuObject.ShowHidePanel("pannels_info"); }, key);
              }
            }
          }
          if (positionItem.Group !== null && this.VisibleMarkers.hasOwnProperty("___isset") && !this.VisibleMarkers.hasOwnProperty(positionItem.Group)) {
            this._Markers[key]._icon.style.opacity = 0;
          } else {
            var lasttime = FunctionsObject.TimeCalculation(positionItem['Recievedtime'], "diffraw");
            if (lasttime <= 5 * 60) {
              this._Markers[key]._icon.style.opacity = 1;
            } else if (lasttime > 5 * 60 && lasttime <= 15 * 60) {
              this._Markers[key]._icon.style.opacity = 0.9 - (lasttime - 5 * 60) / (15 * 60 - 5 * 60) * (0.9 - 0.7);
            } else if (lasttime > 15 * 60 && lasttime <= 30 * 60) {
              this._Markers[key]._icon.style.opacity = 0.7 - (lasttime - 15 * 60) / (30 * 60 - 15 * 60) * (0.7 - 0.5);
            } else if (lasttime > 30 * 60 && lasttime <= 60 * 60) {
              this._Markers[key]._icon.style.opacity = 0.5 - (lasttime - 30 * 60) / (30 * 60 - 30 * 60) * (0.5 - 0.25);
            } else if (lasttime > 60 * 60) {
              this._Markers[key]._icon.style.opacity = 0.25;
            }
          }
        }
      }
    }
    MenuObject.UpdateStatus();
    MenuObject._Update_pannels_info();
  }, 
  _ParseAJAXPanic: function (serverPanic) {
    this.PanicData = serverPanic;
    for (var id in this.PanicData) {
      if (this.PanicData.hasOwnProperty(id)) {
        var alertItem = this.PanicData[id];
        if (this._Markers.hasOwnProperty(id)) {
          var marker = this._Markers[id];
          if (!(this.LocationData[id].Group !== null && this.VisibleMarkers.hasOwnProperty("___isset") && !this.VisibleMarkers.hasOwnProperty(this.LocationData[id].Group))) {
            if (FunctionsObject.TimeCalculation(alertItem["Recievedtime"], "diffraw") <= 10 && marker._icon.className.indexOf(" marker-alert") === -1) {
              marker._icon.className += " marker-alert";
              MenuObject.ShowMarkerInfoPerId(id);
            } else if (FunctionsObject.TimeCalculation(alertItem["Recievedtime"], "diffraw") > 10 && marker._icon.className.indexOf(" marker-alert") !== -1) {
              marker._icon.className = marker._icon.className.replace(" marker-alert", "");
            }
          }
        }
      }
    }
  },
  _ParseAJAXSensors: function (sensorjson) {
    for (var sensorid in sensorjson) {
      if (sensorjson.hasOwnProperty(sensorid)) {
        if (this._SensorSettings.hasOwnProperty(sensorid)) {
          var sensordata = sensorjson[sensorid];
          var sensorsettings = this._SensorSettings[sensorid];

          if (!this._Sensors.hasOwnProperty(sensorid)) { //Sensor is not drawn until now
            var sensor = null;
            var sensorIcon = L.divIcon({
              className: 'sensoricon',
              iconSize: [60, 120],
              iconAnchor: [30, 60],
              html: '<div class="mapsensor" id="MapSensor_id_' + sensorid + '"><span class="name">' + sensorsettings.Alias + '</span>' +
                '<span class="temp">' + sensordata.Temperature + ' °C</span>' +
                '<span class="wind">' + sensordata.Windspeed + ' m/s</span>' +
                '<span class="hum">' + sensordata.Humidity + ' %rl</span></div>'
            });
            sensor = L.marker(sensorsettings.Coordinates, { 'title': sensorsettings.Alias, 'icon': sensorIcon });
            this._Sensors[sensorid] = sensor.addTo(MapObject.Map);
          } else { //Sensor refresh!

          }
        }
      }
    }
  },
  _ParseAJAXSettings: function(json) {
    this._SensorSettings = json["Sensors"];
  },
  ChangeFilter: function (select) {
    this.VisibleMarkers = {};
    if (select.selectedOptions.length > 0) {
      for (var i = 0; i < select.selectedOptions.length; i++) {
        this.VisibleMarkers[select.selectedOptions[i].value] = true;
      }
      this.VisibleMarkers["no"] = true;
      this.VisibleMarkers["___isset"] = true;
    }
    this._ParseAJAXLoc(this.LocationData);
  }
}.Start();