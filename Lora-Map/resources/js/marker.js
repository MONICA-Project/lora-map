var MarkerObject = {
  _Markers: {},
  PanicData: {},
  LocationData: {},
  Start: function () {
    setInterval(this._Runner1000, 1000);
    this._Runner1000();
    return this;
  },
  _Runner1000: function () {
    var loc = new XMLHttpRequest();
    loc.onreadystatechange = function () {
      if (loc.readyState === 4 && loc.status === 200) {
        MarkerObject._ParseAJAXLoc(JSON.parse(loc.responseText));
      }
    };
    loc.open("GET", "/loc", true);
    loc.send();

    var panic = new XMLHttpRequest();
    panic.onreadystatechange = function () {
      if (panic.readyState === 4 && panic.status === 200) {
        MarkerObject._ParseAJAXPanic(JSON.parse(panic.responseText));
      }
    };
    panic.open("GET", "/panic", true);
    panic.send();
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
}.Start();