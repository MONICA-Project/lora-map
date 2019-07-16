var FunctionsObject = {
  _internalTimeOffset: 0,
  Start: function () {
    setInterval(this._Runner, 60000);
    this._Runner();
    return this;
  },
  _Runner: function () {
    var timecorrection = new XMLHttpRequest();
    timecorrection.onreadystatechange = function () {
      if (timecorrection.readyState === 4 && timecorrection.status === 200) {
        FunctionsObject._ParseAJAX(JSON.parse(timecorrection.responseText));
      }
    };
    timecorrection.open("GET", "/currenttime", true);
    timecorrection.send();
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