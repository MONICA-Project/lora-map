setInterval(overlayrunner, 1000);
function overlayrunner() {
  var ccount = new XMLHttpRequest();
  ccount.onreadystatechange = parseAjaxCount;
  ccount.open("GET", "/cameracount", true);
  ccount.send();
  var cdensity = new XMLHttpRequest();
  cdensity.onreadystatechange = parseAjaxDensity;
  cdensity.open("GET", "/crowdcount", true);
  cdensity.send();
}

function parseAjaxCount() {
  if (this.readyState === 4 && this.status === 200) {
    var cameracounts = JSON.parse(this.responseText);
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
  }
}

function parseAjaxDensity() {
  if (this.readyState === 4 && this.status === 200) {
    var cameradensy = JSON.parse(this.responseText);
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
}