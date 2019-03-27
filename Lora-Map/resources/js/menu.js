var visiblePanel = null;
function showHidePanel(name) {
  if (visiblePanel === null && name !== null) {
    document.getElementById("pannels").style.display = "block";
    document.getElementById(name).style.display = "block";
    visiblePanel = name;
  } else if (visiblePanel === name && name !== "pannels_info" || name === null) {
    document.getElementById("pannels").style.display = "none";
    if (visiblePanel !== null) {
      document.getElementById(visiblePanel).style.display = "none";
    }
    visiblePanel = null;
  } else {
    document.getElementById(visiblePanel).style.display = "none";
    document.getElementById(name).style.display = "block";
    visiblePanel = name;
  }
}

var statusToDevice = null;
function showMarkerInfo(e) {
  showHidePanel("pannels_info");
  statusToDevice = this;
  updateDeviceStatus();
}

function showMarkerInfoMenu() {
  showHidePanel("pannels_info");
  statusToDevice = this.getAttribute("rel");
  updateDeviceStatus();
}

function updateDeviceStatus() {
  document.getElementById("pannels_info").innerHTML = "";
  if (serverLocation.hasOwnProperty(statusToDevice)) {
    var markeritem = serverLocation[statusToDevice];
    var html = "<div class=\"name\">Name: <span class=\"bold\">" + markeritem["Name"] + "</span></div>";
    html += "<div class=\"batt\"><span class=\"bold\">Batterie:</span> " + markeritem["Battery"] + "V <img src=\"icons/akku/" + markeritem["Batterysimple"] + "-4.png\"></div>";
    if (markeritem["Fix"]) {
      html += "<div class=\"gps\" style=\"color: green;\">GPS-Empfang</div>";
    } else {
      html += "<div class=\"gps\" style=\"color: red;\">kein GPS-Empfang</div>";
    }
    html += "<div class=\"coord\">" + markeritem["Latitude"].toFixed(7) + ", " + markeritem["Longitude"].toFixed(7) + "</div>";
    html += "<div class=\"height\"><span class=\"bold\">Höhe:</span> " + markeritem["Height"].toFixed(1) + " m</div>";
    html += "<div class=\"hdop\"><span class=\"bold\">HDOP:</span>  " + markeritem["Hdop"].toFixed(1) + "</div>";
    html += "<div class=\"update\"><span class=\"bold\">Update:</span> " + markeritem["Upatedtime"] + "<br><span class=\"bold\">Vor:</span> " + timeDiffToText(markeritem["Upatedtime"]) + "</div>";
    html += "<div><span class=\"bold\">RSSI:</span> " + markeritem["Rssi"] + ", <span class=\"bold\">SNR:</span> " + markeritem["Snr"] + "</div>";
    document.getElementById("pannels_info").innerHTML = html;
  }
}

var overviewStatus = new Array();

function updateStatus() {
  for (var id in serverLocation) {
    if (serverLocation.hasOwnProperty(id)) {
      var markeritem = serverLocation[id];
      if (typeof (overviewStatus[id]) == "undefined") {
        overviewStatus[id] = createOverviewElement(markeritem, id);
        document.getElementById("pannels_pos").appendChild(overviewStatus[id]);
      }
      updateOverviewElement(markeritem, id);
    }
  }
}

function updateOverviewElement(markeritem, id) {
  if (markeritem["Batterysimple"] === 0) {
    document.getElementById("overview-color-id-" + id).style.backgroundColor = "red";
  } else if (markeritem["Batterysimple"] === 1 || markeritem["Batterysimple"] === 2) {
    document.getElementById("overview-color-id-" + id).style.backgroundColor = "yellow";
  } else if (markeritem["Batterysimple"] === 3 || markeritem["Batterysimple"] === 4) {
    document.getElementById("overview-color-id-" + id).style.backgroundColor = "green";
  }
  document.getElementById("overview-name-id-" + id).innerText = markeritem["Name"];
  document.getElementById("overview-akkuimg-id-" + id).src = "icons/akku/" + markeritem["Batterysimple"] + "-4.png";
  if (markeritem["Fix"]) {
    document.getElementById("overview-gps-id-" + id).innerText = "GPS-Empfang";
    document.getElementById("overview-gps-id-" + id).style.color = "green";
  } else {
    document.getElementById("overview-gps-id-" + id).innerText = "kein GPS-Empfang";
    document.getElementById("overview-gps-id-" + id).style.color = "red";
  }
  document.getElementById("overview-update-id-" + id).innerText = "Letzter Datenempfang: vor " + timeDiffToText(markeritem["Upatedtime"]);
}

function createOverviewElement(markeritem, id) {
  var divItem = document.createElement("div");
  divItem.className = "item";
  divItem.onclick = showMarkerInfoMenu;
  divItem.setAttribute("rel", id);
  divItem.innerHTML = "<span class=\"color\" id=\"overview-color-id-" + id + "\"></span>";
  if (markeritem['Icon'] !== null) {
    divItem.innerHTML += "<span class=\"icon\"><object data=\"" + markeritem['Icon'] + "&marker-bg=hidden" + "\" type=\"image/svg+xml\"></object></span>";
  } else {
    divItem.innerHTML += "<span class=\"icon\"><img src=\"icons/marker/map-marker.png\"></span>";
  }
  divItem.innerHTML += "<div class=\"line1\">" +
    "<span class=\"name\" id=\"overview-name-id-" + id + "\"></span>" +
    "<span class=\"akku\"><img id=\"overview-akkuimg-id-" + id + "\" src=\"icons/akku/" + markeritem["Batterysimple"] + "-4.png\"></span>" +
    "</div>";
  divItem.innerHTML += "<div class=\"line2\" style=\"color: red;\" id=\"overview-gps-id-" + id + "\">kein GPS-Empfang</div>";
  divItem.innerHTML += "<div class=\"line3\" id=\"overview-update-id-" + id + "\">Letzter Datenempfang: vor " + timeDiffToText(markeritem["Upatedtime"]) + "</div>";
  return divItem;
}

function timeDiffToText(time) {
  var diff = Date.now() - Date.parse(time);
  diff = Math.round(diff / 1000);
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
}