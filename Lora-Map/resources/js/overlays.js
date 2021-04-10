var OverlayObject = {
  /// private variables
  _DensitySettings: {},
  /// public functions
  ParseAJAXCameraModel: function (json) {
    this._ParseAJAXCount(json.Counter);
    this._ParseAJAXDensity(json.Density);
  },
  ParseAJAXSettings: function (json) {
    this._DensitySettings = json["DensityArea"];
  },
  Start: function () {
    return this;
  },
  /// private functions
  _ParseAJAXCount: function (cameracounts) {
    var camerastext = "";
    for (var cameraid in cameracounts) {
      if (Object.prototype.hasOwnProperty.call(cameracounts, cameraid)) {
        var camera = cameracounts[cameraid];
        var cameratext = "<div class='camera'>";
        cameratext += "<span class='name'>" + cameraid + "</span>";
        cameratext += "<span class='in'>" + camera["Incoming"] + "</span>";
        cameratext += "<span class='out'>" + camera["Outgoing"] + "</span>";
        cameratext += "<span class='total'>" + camera["Total"] + "</span>";
        cameratext += "</div>";
        camerastext += cameratext;
      }
    }
    document.getElementById("cameracount").innerHTML = camerastext;
  },
  _ParseAJAXDensity: function (cameradensy) {
    var densystext = "";
    for (var densyid in cameradensy) {
      if (Object.prototype.hasOwnProperty.call(cameradensy, densyid)) {
        if (Object.prototype.hasOwnProperty.call(this._DensitySettings, densyid)) {
          var densy = cameradensy[densyid];
          var densytext = "<div class='camera'>";
          densytext += "<span class='name'>" + this._DensitySettings[densyid].Alias + "</span>";
          densytext += "<span class='count'>" + densy["DensityCount"] + "</span>";
          densytext += "</div>";
          densystext += densytext;
        }
      }
    }
    document.getElementById("crwoddensy").innerHTML = densystext;
  }
}.Start();