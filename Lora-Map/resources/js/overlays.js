var OverlayObject = {
  Start: function () {
    setInterval(this._Runner1000, 1000);
    this._Runner1000();
    return this;
  },
  _Runner1000: function () {
    var ccount = new XMLHttpRequest();
    ccount.onreadystatechange = function () {
      if (ccount.readyState === 4 && ccount.status === 200) {
        OverlayObject._ParseAJAXCount(JSON.parse(ccount.responseText));
      }
    };
    ccount.open("GET", "/cameracount", true);
    ccount.send();

    var cdensity = new XMLHttpRequest();
    cdensity.onreadystatechange = function () {
      if (cdensity.readyState === 4 && cdensity.status === 200) {
        OverlayObject._ParseAJAXDensity(JSON.parse(cdensity.responseText));
      }
    };
    cdensity.open("GET", "/crowdcount", true);
    cdensity.send();
  },
  _ParseAJAXCount: function (cameracounts) {
    var camerastext = "";
    for (var cameraid in cameracounts) {
      if (cameracounts.hasOwnProperty(cameraid)) {
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
      if (cameradensy.hasOwnProperty(densyid)) {
        var densy = cameradensy[densyid];
        var densytext = "<div class='camera'>";
        densytext += "<span class='name'>" + densyid + "</span>";
        densytext += "<span class='count'>" + densy["DensityCount"] + "</span>";
        densytext += "</div>";
        densystext += densytext;
      }
    }
    document.getElementById("crwoddensy").innerHTML = densystext;
  }
}.Start();