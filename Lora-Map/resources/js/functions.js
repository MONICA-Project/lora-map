var FunctionsObject = {
  /// private variables
  _internalTimeOffset: 0,
  /// public functions
  Start: function () {
    setInterval(this._QueryJsonEveryMinute, 60000);
    setInterval(this._QueryJsonEverySecond, 1000);
    this._QueryJsonEveryMinute();
    this._QueryJsonEverySecond();
    this._QueryJsonStartup();
    return this;
  },
  TimeCalculation: function (timestr, type) {
    if (type === "diffraw" || type === "difftext" || type === "difftextn") {
      var diff = Math.round((Date.now() - Date.parse(timestr) - this._internalTimeOffset) / 1000);
      if (type === "diffraw") {
        return diff;
      }
      if (type === "difftextn" && diff < 0) {
        diff = diff * -1;
      }
      var isneg = false;
      if (diff < 0) {
        isneg = true;
        diff = diff * -1;
      }
      if (diff < 60) {
        return (isneg ? "-" : "") + diff + " s";
      }
      if (diff < 60 * 60) {
        return (isneg ? "-" : "") + Math.floor(diff / 60) + " m";
      }
      if (diff < 60 * 60 * 24) {
        return (isneg ? "-" : "") + Math.floor(diff / (60 * 60)) + " h";
      }
      return (isneg ? "-" : "") + Math.floor(diff / (60 * 60 * 24)) + " d";
    } else if (type === "str") {
      var date = new Date(Date.parse(timestr) + this._internalTimeOffset);
      var str = date.toLocaleString();
      return str;
    }
  },
  /// private functions
  _ParseAJAX: function (utcobject) {
    if (Object.prototype.hasOwnProperty.call(utcobject, "utc")) {
      this._internalTimeOffset = Date.now() - Date.parse(utcobject["utc"]);
    }
  },
  _QueryJsonEveryMinute: function () {
    var get60000 = new XMLHttpRequest();
    get60000.onreadystatechange = function () {
      if (get60000.readyState === 4 && get60000.status === 200) {
        var json = JSON.parse(get60000.responseText);
        FunctionsObject._ParseAJAX(json);
      }
    };
    get60000.open("GET", "/api/time", true);
    get60000.send();
  },
  _QueryJsonEverySecond: function () {
    var get1000 = new XMLHttpRequest();
    get1000.onreadystatechange = function () {
      if (get1000.readyState === 4 && get1000.status === 200) {
        var json = JSON.parse(get1000.responseText);
        MarkerObject.ParseAJAXPositionModel(json.position);
        MarkerObject.ParseAJAXSensorModel(json.sensor);

        OverlayObject.ParseAJAXCameraModel(json.camera);

        MapObject.ParseAJAXCameraModel(json.camera);

        MenuObject.ParseAJAXSensorModel(json.sensor);
      }
    };
    get1000.open("GET", "/api/json/position,camera,sensor", true);
    get1000.send();
  },
  _QueryJsonStartup: function () {
    var getonce = new XMLHttpRequest();
    getonce.onreadystatechange = function () {
      if (getonce.readyState === 4 && getonce.status === 200) {
        var json = JSON.parse(getonce.responseText);
        MarkerObject.ParseAJAXSettings(json.settings);

        OverlayObject.ParseAJAXSettings(json.settings);

        MapObject.ParseAJAXSettings(json.settings);
      }
    };
    getonce.open("GET", "/api/json/settings", true);
    getonce.send();
  }
}.Start();