﻿var visiblePanel = null;
function showHidePanel(name) {
  if (visiblePanel === null && name !== null) {
    document.getElementById("pannels").style.display = "block";
    document.getElementById(name).style.display = "block";
    visiblePanel = name;
    if (typeof window["update_" + name] === "function") {
      window["update_" + name]();
    }
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
    if (typeof window["update_" + name] === "function") {
      window["update_" + name]();
    }
  }
}

var statusToDevice = null;
function showMarkerInfo(e) {
  statusToDevice = this;
  showHidePanel("pannels_info");
}

function showMarkerInfoPerId(id) {
  statusToDevice = id;
  showHidePanel("pannels_info");
}

function showMarkerInfoMenu() {
  statusToDevice = this.getAttribute("rel");
  showHidePanel("pannels_info");
}

function update_pannels_info() {
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
    html += "<div class=\"coord\">" + positionItem["UTM"]["MGRS"] + "</div>";
    html += "<div class=\"planquad\"><span class=\"bold\">Planquadrat:</span> " + positionItem["UTM"]["FieldWidth"] + ", " + positionItem["UTM"]["FieldHeight"] + "</div>";
    html += "<div class=\"section\"><span class=\"bold\">Ausschnitt:</span> " + positionItem["UTM"]["Width"] + ", " + positionItem["UTM"]["Height"]+"</div>";
    html += "<div class=\"height\"><span class=\"bold\">Höhe:</span> " + positionItem["Height"].toFixed(1) + " m</div>";
    html += "<div class=\"hdop\"><span class=\"bold\">HDOP:</span>  " + positionItem["Hdop"].toFixed(1) + "</div>";
    html += "<div class=\"lanlot\"><span class=\"bold\">Dezimal:</span> " + positionItem["Latitude"].toFixed(5) + ", " + positionItem["Longitude"].toFixed(5) + "</div>";
    html += "<div class=\"lastgps\"><span class=\"bold\">Letzter Wert:</span> Vor: " + timeCalculation(positionItem["Lastgpspostime"], "difftext") + "</div>";
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
  if (positionItem['Icon'] === null) {
    var icon = document.getElementById("overview-icon-id-" + id);
    if (icon.children[0].hasAttribute("data")) {
      document.getElementById("overview-icon-id-" + id).innerHTML = "<img src =\"icons/marker/map-marker.png\">";
    }
  } else {
    if (document.getElementById("overview-icon-id-" + id).children[0].hasAttribute("data")) {
      if (document.getElementById("overview-icon-id-" + id).children[0]["data"].substring(document.getElementById("overview-icon-id-" + id).children[0]["data"].indexOf("/", 7) + 1) !== positionItem['Icon'] + "&marker-bg=hidden") {
        document.getElementById("overview-icon-id-" + id).children[0]["data"] = positionItem['Icon'] + "&marker-bg=hidden";
      }
    } else {
      document.getElementById("overview-icon-id-" + id).innerHTML = "<object data=\"" + positionItem['Icon'] + "&marker-bg=hidden" + "\" type=\"image/svg+xml\"></object>";
    }
  }
}

function createOverviewElement(positionItem, id) {
  var divItem = document.createElement("div");
  divItem.className = "item";
  divItem.onclick = showMarkerInfoMenu;
  divItem.setAttribute("rel", id);
  divItem.innerHTML = "<span class=\"color\" id=\"overview-color-id-" + id + "\"></span>";
  if (positionItem['Icon'] !== null) {
    divItem.innerHTML += "<span class=\"icon\" id=\"overview-icon-id-" + id + "\"><object data=\"" + positionItem['Icon'] + "&marker-bg=hidden" + "\" type=\"image/svg+xml\"></object></span>";
  } else {
    divItem.innerHTML += "<span class=\"icon\" id=\"overview-icon-id-" + id + "\"><img src=\"icons/marker/map-marker.png\"></span>";
  }
  divItem.innerHTML += "<div class=\"line1\">" +
    "<span class=\"name\" id=\"overview-name-id-" + id + "\"></span>" +
    "<span class=\"akku\"><img id=\"overview-akkuimg-id-" + id + "\" src=\"icons/akku/" + positionItem["Batterysimple"] + "-4.png\"></span>" +
    "</div>";
  divItem.innerHTML += "<div class=\"line2\" style=\"color: red;\" id=\"overview-gps-id-" + id + "\">kein GPS-Empfang</div>";
  divItem.innerHTML += "<div class=\"line3\" id=\"overview-update-id-" + id + "\">Letzter Datenempfang: vor " + timeCalculation(positionItem["Recievedtime"], "difftext") + "</div>";
  return divItem;
}


function update_pannels_admin() {
  var testadmin = new XMLHttpRequest();
  testadmin.onreadystatechange = parseAjaxPannelAdmin;
  testadmin.open("GET", "http://{%REQUEST_URL_HOST%}/admin", true);
  testadmin.send();
}

function parseAjaxPannelAdmin() {
  if (this.readyState === 4 && this.status === 403) {
    var html = "<h3>Login to Adminpannel</h3><form onsubmit='submitloginform();return false;'>";
    html += "<div><span class='label'>Username:</span><input id='pannels_admin_name'></div>";
    html += "<div><span class='label'>Passwort:</span><input type='password' id='pannels_admin_pass'></div>";
    html += "<div><span class='login'><input type='submit'></span></div></form>";
    document.getElementById("pannels_admin").innerHTML = html;
  } else if (this.readyState === 4 && this.status === 200) {
    document.getElementById("pannels_admin").innerHTML = "<a href='/admin/' target='_blank'>Adminpannel</a>";
  }
}

function submitloginform() {
  var adminlogin = new XMLHttpRequest();
  adminlogin.onreadystatechange = parseAjaxLogin;
  adminlogin.open("POST", "http://{%REQUEST_URL_HOST%}/admin/login", true);
  adminlogin.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  adminlogin.send("user=" + encodeURI(document.getElementById("pannels_admin_name").value) + "&pass=" + encodeURI(document.getElementById("pannels_admin_pass").value));
}

function parseAjaxLogin() {
  if (this.readyState === 4 && this.status === 200) {
    update_pannels_admin();
  }
}