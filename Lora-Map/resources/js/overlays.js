setInterval(overlayrunner, 1000);
function overlayrunner() {
  var cam = new XMLHttpRequest();
  cam.onreadystatechange = parseAjaxCam;
  cam.open("GET", "/cameracount", true);
  cam.send();
}

function parseAjaxCam() {
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