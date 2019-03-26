var visiblePanel = null;
function showHidePanel(name) {
  if (visiblePanel === null) {
    document.getElementById("pannels").style.display = "block";
    document.getElementById(name).style.display = "block";
    visiblePanel = name;
  } else if (visiblePanel === name && name !== "pannels_info" || name === null) {
    document.getElementById("pannels").style.display = "none";
    document.getElementById(visiblePanel).style.display = "none";
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

function updateStatus() {
  document.getElementById("pannels_pos").innerHTML = "";
  for (var name in serverLocation) {
    if (serverLocation.hasOwnProperty(name)) {
      var markeritem = serverLocation[name];
      var divItem = document.createElement("div");
      divItem.className = "item";
      divItem.onclick = showMarkerInfoMenu;
      divItem.setAttribute("rel", name);
      var spanColor = document.createElement("span");
      spanColor.className = "color";
      if (markeritem["Batterysimple"] === 0) {
        spanColor.style.backgroundColor = "red";
      } else if (markeritem["Batterysimple"] === 1 || markeritem["Batterysimple"] === 2) {
        spanColor.style.backgroundColor = "yellow";
      } else if (markeritem["Batterysimple"] === 3 || markeritem["Batterysimple"] === 4) {
        spanColor.style.backgroundColor = "green";
      }
      divItem.appendChild(spanColor);
      var spanIcon = document.createElement("span");
      spanIcon.className = "icon";
      if (markeritem['Icon'] !== null) {
        var objectIcon = document.createElement("object");
        objectIcon.data = markeritem['Icon'] + "&marker-bg=hidden";
        objectIcon.type = "image/svg+xml";
        //<object data="'+markeritem['Icon']+'" type="image/svg+xml" style="height:80px; width:56px;"></object>
        spanIcon.appendChild(objectIcon);
      } else {
        var imgIcon = document.createElement("img");
        imgIcon.src = "icons/marker/map-marker.png";
        spanIcon.appendChild(imgIcon)
      }
      divItem.appendChild(spanIcon);
      var divLine1 = document.createElement("div");
      divLine1.className = "line1";
      var spanName = document.createElement("span");
      spanName.className = "name";
      spanName.innerText = markeritem["Name"];
      divLine1.appendChild(spanName);
      var spanAkku = document.createElement("span");
      spanAkku.className = "akku";
      var imgAkku = document.createElement("img");
      imgAkku.src = "icons/akku/" + markeritem["Batterysimple"] + "-4.png";
      spanAkku.appendChild(imgAkku);
      divLine1.appendChild(spanAkku);
      divItem.appendChild(divLine1);
      var divLine2 = document.createElement("div");
      divLine2.className = "line2";
      if (markeritem["Fix"]) {
        divLine2.style.color = "green";
        divLine2.innerText = "GPS-Empfang";
      } else {
        divLine2.style.color = "red";
        divLine2.innerText = "kein GPS-Empfang";
      }
      divItem.appendChild(divLine2);
      var divLine3 = document.createElement("div");
      divLine3.className = "line3";
      divLine3.innerText = "Letzter Datenempfang: vor " + timeDiffToText(markeritem["Upatedtime"]);
      divItem.appendChild(divLine3);
      document.getElementById("pannels_pos").appendChild(divItem);
    }
  }
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