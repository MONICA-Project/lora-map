var FunctionsObject = {
  _internalTimeOffset: 0,
  Start: function () {
    setInterval(this._Runner60000, 60000);
    setInterval(this._Runner1000, 1000);
    this._Runner60000();
    this._Runner1000();
    this._RunnerOnce();
    return this;
  },
  _Runner60000: function () {
    var get60000 = new XMLHttpRequest();
    get60000.onreadystatechange = function () {
      if (get60000.readyState === 4 && get60000.status === 200) {
        var json = JSON.parse(get60000.responseText);
        FunctionsObject._ParseAJAX(json["currenttime"]);
      }
    };
    get60000.open("GET", "/get60000", true);
    get60000.send();
  },
  _Runner1000: function () {
    var get1000 = new XMLHttpRequest();
    get1000.onreadystatechange = function () {
      if (get1000.readyState === 4 && get1000.status === 200) {
        var json = JSON.parse(get1000.responseText);
        MarkerObject._ParseAJAXLoc(json["loc"]);
        MarkerObject._ParseAJAXPanic(json["panic"]);
        OverlayObject._ParseAJAXCount(json["cameracount"]);
        OverlayObject._ParseAJAXDensity(json["crowdcount"]);
      }
    };
    get1000.open("GET", "/get1000", true);
    get1000.send();
  },
  _RunnerOnce: function () {
    var getonce = new XMLHttpRequest();
    getonce.onreadystatechange = function () {
      if (getonce.readyState === 4 && getonce.status === 200) {
        var json = JSON.parse(getonce.responseText);
        MapObject._ParseAJAXLayers(json["getlayer"]);
        MapObject._ParseAJAXGeo(json["getgeo"]);
      }
    };
    getonce.open("GET", "/getonce", true);
    getonce.send();
  },
  _ParseAJAX: function (utcobject) {
    if (utcobject.hasOwnProperty("utc")) {
      this._internalTimeOffset = Date.now() - Date.parse(utcobject["utc"]);
    }
  },
  TimeCalculation: function (timestr, type) {
    if (type === "diffraw" || type === "difftext") {
      var diff = Math.round((Date.now() - Date.parse(timestr) - this._internalTimeOffset) / 1000);
      if (type === "diffraw") {
        return diff;
      }
      if (diff < 60) {
        return diff + " s";
      }
      if (diff < 60 * 60) {
        return Math.floor(diff / 60) + " m";
      }
      if (diff < 60 * 60 * 24) {
        return Math.floor(diff / (60 * 60)) + " h";
      }
      return Math.floor(diff / (60 * 60 * 24)) + " d";
    } else if (type === "str") {
      var date = new Date(Date.parse(timestr) + this._internalTimeOffset);
      var str = date.toLocaleString();
      return str;
    }
  }
}.Start();