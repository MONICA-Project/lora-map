var markers = {};

setInterval(datarunner, 1000);
function datarunner() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = parsedata;
  xhttp.open("GET", "http://{%REQUEST_URL_HOST%}:8080/loc", true);
  xhttp.send();
}

//https://leafletjs.com/reference-1.4.0.html#marker
function parsedata() {
  if (this.readyState == 4 && this.status == 200) {
    var items = JSON.parse(this.responseText);
    for (var key in items) {
      if (items.hasOwnProperty(key)) {
        var markeritem = items[key];
        if (markeritem['Latitude'] != 0 || markeritem['Longitude'] != 0) {
          if (!markers.hasOwnProperty(key)) {
            markers[key] = L.marker([markeritem['Latitude'], markeritem['Longitude']]).addTo(mymap);
          } else {
            markers[key].setLatLng([markeritem['Latitude'], markeritem['Longitude']]);
          }
        }
      }
    }
    parseStatus(items);
  }
}

function parseStatus(items) {
  document.getElementById("pannels_pos").innerHTML = "";
  for (var name in items) {
    if (items.hasOwnProperty(name)) {
      var markeritem = items[name];
      var divItem = document.createElement("div");
      divItem.className = "item";
      var spanColor = document.createElement("span");
      spanColor.className = "color";
      if (markeritem["Batterysimple"] == 0) {
        spanColor.style.backgroundColor = "red";
      } else if (markeritem["Batterysimple"] == 1 || markeritem["Batterysimple"] == 2) {
        spanColor.style.backgroundColor = "yellow";
      } else if (markeritem["Batterysimple"] == 3 || markeritem["Batterysimple"] == 4) {
        spanColor.style.backgroundColor = "green";
      }
      divItem.appendChild(spanColor);
      var spanIcon = document.createElement("span");
      spanIcon.className = "icon";
      var imgIcon = document.createElement("img");
      imgIcon.src = "icons/marker/map-marker.png";
      spanIcon.appendChild(imgIcon);
      divItem.appendChild(spanIcon);
      var divLine1 = document.createElement("div");
      divLine1.className = "line1";
      var spanName = document.createElement("span");
      spanName.className = "name";
      spanName.innerText = name;
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
  if (diff < (60 * 60)) {
    return Math.floor(diff / 60) + " m";
  }
  if (diff < (60 * 60 * 24)) {
    return Math.floor(diff / (60 * 60)) + " h";
  }
  return Math.floor(diff / (60 * 60 * 24)) + " d";
}