var visiblePanel = null;
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
  if (MarkerObject.LocationData.hasOwnProperty(statusToDevice)) {
    var positionItem = MarkerObject.LocationData[statusToDevice];
    var html = "<div class=\"name\">Name: <span class=\"bold\">" + positionItem["Name"] + "</span></div>";
    html += "<div class=\"batt\"><span class=\"bold\">Batterie:</span> " + positionItem["Battery"] + "V <img src=\"icons/akku/" + positionItem["Batterysimple"] + "-4.png\"></div>";
    if (positionItem["Fix"]) {
      html += "<div class=\"gps\" style=\"color: green;\">GPS-Empfang</div>";
    } else {
      html += "<div class=\"gps\" style=\"color: red;\">kein GPS-Empfang</div>";
    }
    html += "<div class=\"coord\">" + positionItem["UTM"]["Base"] + " <span style=\"color: #b1a831;\">" + positionItem["UTM"]["FieldWidth"] + "</span><span style=\"color: #218c00;\">" + positionItem["UTM"]["Width"] + "</span> <span style=\"color: #b1a831;\">" + positionItem["UTM"]["FieldHeight"] + "</span><span style=\"color: #218c00;\">" + positionItem["UTM"]["Height"] + "</span></div>";
    html += "<div class=\"height\"><span class=\"bold\">Höhe:</span> " + positionItem["Height"].toFixed(1) + " m</div>";
    html += "<div class=\"hdop\"><span class=\"bold\">HDOP:</span>  " + positionItem["Hdop"].toFixed(1) + "</div>";
    html += "<div class=\"lanlot\"><span class=\"bold\">Dezimal:</span> " + positionItem["Latitude"].toFixed(5) + ", " + positionItem["Longitude"].toFixed(5) + "</div>";
    html += "<div class=\"lastgps\"><span class=\"bold\">Letzter Wert:</span> Vor: " + FunctionsObject.TimeCalculation(positionItem["Lastgpspostime"], "difftext") + "</div>";
    html += "<div class=\"update\"><span class=\"bold\">Update:</span> " + FunctionsObject.TimeCalculation(positionItem["Recievedtime"], "str") + "<br><span class=\"bold\">Vor:</span> " + FunctionsObject.TimeCalculation(positionItem["Recievedtime"], "difftext") + "</div>";
    html += "<div><span class=\"bold\">RSSI:</span> " + positionItem["Rssi"] + ", <span class=\"bold\">SNR:</span> " + positionItem["Snr"] + "</div>";
    if (MarkerObject.PanicData.hasOwnProperty(statusToDevice)) {
      var panicData = MarkerObject.PanicData[statusToDevice];
      if (panicData["ButtonPressed"].length > 0) {
        html += "<div class='alerts'><span class=\"bold\">Alerts:</span>";
        for (var i = 0; i < panicData["ButtonPressed"].length; i++) {
          html += "<span class='panicitem'>" + FunctionsObject.TimeCalculation(panicData["ButtonPressed"][i], "str") + " (vor " + FunctionsObject.TimeCalculation(panicData["ButtonPressed"][i],"difftext")+")</span>";
        }
        html += "</div>";
      }
    }
    document.getElementById("pannels_info").innerHTML = html;
  }
}

var overviewStatus = new Array();

function updateStatus() {
  for (var id in MarkerObject.LocationData) {
    if (MarkerObject.LocationData.hasOwnProperty(id)) {
      var positionItem = MarkerObject.LocationData[id];
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
  document.getElementById("overview-update-id-" + id).innerText = "Letzte Werte: vor " + FunctionsObject.TimeCalculation(positionItem["Recievedtime"], "difftext");
  if (positionItem['Icon'] === null) {
    var icon = document.getElementById("overview-icon-id-" + id);
    if (icon.children[0].hasAttribute("rel")) {
      document.getElementById("overview-icon-id-" + id).innerHTML = "<img src =\"icons/marker/map-marker.png\">";
    }
  } else {
    if (document.getElementById("overview-icon-id-" + id).children[0].hasAttribute("src")) {
      if (document.getElementById("overview-icon-id-" + id).children[0]["src"].substring(document.getElementById("overview-icon-id-" + id).children[0]["src"].indexOf("/", 7) + 1) !== positionItem['Icon'] + "&marker-bg=hidden") {
        document.getElementById("overview-icon-id-" + id).children[0]["src"] = positionItem['Icon'] + "&marker-bg=hidden";
      }
    } else {
      document.getElementById("overview-icon-id-" + id).innerHTML = "<img src=\"" + positionItem['Icon'] + "&marker-bg=hidden" + "\" rel='svg'/>";
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
    divItem.innerHTML += "<span class=\"icon\" id=\"overview-icon-id-" + id + "\"><img src=\"" + positionItem['Icon'] + "&marker-bg=hidden" + "\" rel='svg'/></span>";
  } else {
    divItem.innerHTML += "<span class=\"icon\" id=\"overview-icon-id-" + id + "\"><img src=\"icons/marker/map-marker.png\" /></span>";
  }
  divItem.innerHTML += "<div class=\"line1\">" +
    "<span class=\"name\" id=\"overview-name-id-" + id + "\"></span>" +
    "<span class=\"akku\"><img id=\"overview-akkuimg-id-" + id + "\" src=\"icons/akku/" + positionItem["Batterysimple"] + "-4.png\"></span>" +
    "</div>";
  divItem.innerHTML += "<div class=\"line2\" style=\"color: red;\" id=\"overview-gps-id-" + id + "\">kein GPS-Empfang</div>";
  divItem.innerHTML += "<div class=\"line3\" id=\"overview-update-id-" + id + "\">Letzte Werte: vor " + FunctionsObject.TimeCalculation(positionItem["Recievedtime"], "difftext") + "</div>";
  return divItem;
}


function update_pannels_admin() {
  var testadmin = new XMLHttpRequest();
  testadmin.onreadystatechange = parseAjaxPannelAdmin;
  testadmin.open("GET", "/admin", true);
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
  adminlogin.open("POST", "/admin/login", true);
  adminlogin.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  adminlogin.send("user=" + encodeURI(document.getElementById("pannels_admin_name").value) + "&pass=" + encodeURI(document.getElementById("pannels_admin_pass").value));
}

function parseAjaxLogin() {
  if (this.readyState === 4 && this.status === 200) {
    update_pannels_admin();
  }
}