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

function showMarkerInfoPerId(id) {
  showHidePanel("pannels_info");
  statusToDevice = id;
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
    var positionItem = serverLocation[statusToDevice];
    var html = "<div class=\"name\">Name: <span class=\"bold\">" + positionItem["Name"] + "</span></div>";
    html += "<div class=\"batt\"><span class=\"bold\">Batterie:</span> " + positionItem["Battery"] + "V <img src=\"icons/akku/" + positionItem["Batterysimple"] + "-4.png\"></div>";
    if (positionItem["Fix"]) {
      html += "<div class=\"gps\" style=\"color: green;\">GPS-Empfang</div>";
    } else {
      html += "<div class=\"gps\" style=\"color: red;\">kein GPS-Empfang</div>";
    }
    html += "<div class=\"coord\">" + positionItem["Latitude"].toFixed(7) + ", " + positionItem["Longitude"].toFixed(7) + "</div>";
    html += "<div class=\"lastgps\"><span class=\"bold\">Letzter Wert:</span> Vor: " + timeCalculation(positionItem["Lastgpspostime"], "difftext") + "</div>";
    html += "<div class=\"height\"><span class=\"bold\">Höhe:</span> " + positionItem["Height"].toFixed(1) + " m</div>";
    html += "<div class=\"hdop\"><span class=\"bold\">HDOP:</span>  " + positionItem["Hdop"].toFixed(1) + "</div>";
    html += "<div class=\"update\"><span class=\"bold\">Update:</span> " + timeCalculation(positionItem["Recievedtime"], "str") + "<br><span class=\"bold\">Vor:</span> " + timeCalculation(positionItem["Recievedtime"], "difftext") + "</div>";
    html += "<div><span class=\"bold\">RSSI:</span> " + positionItem["Rssi"] + ", <span class=\"bold\">SNR:</span> " + positionItem["Snr"] + "</div>";
    document.getElementById("pannels_info").innerHTML = html;
  }
}

var overviewStatus = new Array();

function updateStatus() {
  for (var id in serverLocation) {
    if (serverLocation.hasOwnProperty(id)) {
      var positionItem = serverLocation[id];
      if (typeof overviewStatus[id] === "undefined") {
        overviewStatus[id] = createOverviewElement(positionItem, id);
        document.getElementById("pannels_pos").appendChild(overviewStatus[id]);
      }
      updateOverviewElement(positionItem, id);
    }
  }
}

function updateOverviewElement(positionItem, id) {
  if (positionItem["Batterysimple"] === 0) {
    document.getElementById("overview-color-id-" + id).style.backgroundColor = "red";
  } else if (positionItem["Batterysimple"] === 1 || positionItem["Batterysimple"] === 2) {
    document.getElementById("overview-color-id-" + id).style.backgroundColor = "yellow";
  } else if (positionItem["Batterysimple"] === 3 || positionItem["Batterysimple"] === 4) {
    document.getElementById("overview-color-id-" + id).style.backgroundColor = "green";
  }
  document.getElementById("overview-name-id-" + id).innerText = positionItem["Name"];
  document.getElementById("overview-akkuimg-id-" + id).src = "icons/akku/" + positionItem["Batterysimple"] + "-4.png";
  if (positionItem["Fix"]) {
    document.getElementById("overview-gps-id-" + id).innerText = "GPS-Empfang";
    document.getElementById("overview-gps-id-" + id).style.color = "green";
  } else {
    document.getElementById("overview-gps-id-" + id).innerText = "kein GPS-Empfang";
    document.getElementById("overview-gps-id-" + id).style.color = "red";
  }
  document.getElementById("overview-update-id-" + id).innerText = "Letzter Datenempfang: vor " + timeCalculation(positionItem["Recievedtime"], "difftext");
}

function createOverviewElement(positionItem, id) {
  var divItem = document.createElement("div");
  divItem.className = "item";
  divItem.onclick = showMarkerInfoMenu;
  divItem.setAttribute("rel", id);
  divItem.innerHTML = "<span class=\"color\" id=\"overview-color-id-" + id + "\"></span>";
  if (positionItem['Icon'] !== null) {
    divItem.innerHTML += "<span class=\"icon\"><object data=\"" + positionItem['Icon'] + "&marker-bg=hidden" + "\" type=\"image/svg+xml\"></object></span>";
  } else {
    divItem.innerHTML += "<span class=\"icon\"><img src=\"icons/marker/map-marker.png\"></span>";
  }
  divItem.innerHTML += "<div class=\"line1\">" +
    "<span class=\"name\" id=\"overview-name-id-" + id + "\"></span>" +
    "<span class=\"akku\"><img id=\"overview-akkuimg-id-" + id + "\" src=\"icons/akku/" + positionItem["Batterysimple"] + "-4.png\"></span>" +
    "</div>";
  divItem.innerHTML += "<div class=\"line2\" style=\"color: red;\" id=\"overview-gps-id-" + id + "\">kein GPS-Empfang</div>";
  divItem.innerHTML += "<div class=\"line3\" id=\"overview-update-id-" + id + "\">Letzter Datenempfang: vor " + timeCalculation(positionItem["Recievedtime"], "difftext") + "</div>";
  return divItem;
}