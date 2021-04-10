var Settings = {
  //public functions
  Abort: function (el) {
    el.parentNode.removeChild(el);
  },
  AddDensity: function () {
    var newrow = document.createElement("tr");
    newrow.innerHTML = "<td><input style='width: 145px;'/></td>";
    newrow.innerHTML += "<td><input style='width: 195px;'/></td>";
    newrow.innerHTML += "<td><textarea style='width: 240px;height: 60px;'></textarea></td>";
    newrow.innerHTML += "<td><input style='width: 145px;'/></td>";
    newrow.innerHTML += "<td><img src='../icons/general/save.png' onclick='Settings.SaveRowdensity(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Abort(this.parentNode.parentNode)' class='pointer'></td>";
    document.getElementById("crowdtable").children[1].appendChild(newrow);
  },
  AddFight: function () {
    var newrow = document.createElement("tr");
    newrow.innerHTML = "<td><input style='width: 145px;'/></td>";
    newrow.innerHTML += "<td><textarea style='width: 240px;height: 60px;'></textarea></td>";
    newrow.innerHTML += "<td><input style='width: 145px;'/></td>";
    newrow.innerHTML += "<td><input style='width: 145px;'/></td>";
    newrow.innerHTML += "<td><img src='../icons/general/save.png' onclick='Settings.SaveRowfight(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Abort(this.parentNode.parentNode)' class='pointer'></td>";
    document.getElementById("fighttable").children[1].appendChild(newrow);
  },
  AddSensor: function () {
    var newrow = document.createElement("tr");
    newrow.innerHTML = "<td><input style='width: 145px;'/></td>";
    newrow.innerHTML += "<td><input style='width: 145px;'/></td>";
    newrow.innerHTML += "<td><input style='width: 250px;'/></td>";
    newrow.innerHTML += "<td><input style='width: 145px;'/></td>";
    newrow.innerHTML += "<td><img src='../icons/general/save.png' onclick='Settings.SaveRowSensor(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Abort(this.parentNode.parentNode)' class='pointer'></td>";
    document.getElementById("sensortable").children[1].appendChild(newrow);
  },
  Delete: function (el) {
    var answ = window.prompt("Wollen sie den Eintrag für \"" + el.firstChild.innerHTML + "\" wirklich löschen?", "");
    if (answ !== null) {
      el.parentNode.removeChild(el);
    }
  },
  EditDensity: function (el) {
    el.innerHTML = "<td><input style='width: 145px;' value='" + el.children[0].innerText + "'/></td>" +
      "<td><input style='width: 195px;' value='" + el.children[1].innerText + "'/></td>" +
      "<td><textarea style='width: 240px;height: 60px;'>" + el.children[2].innerText + "</textarea></td>" +
      "<td><input style='width: 145px;' value='" + el.children[3].innerText + "'/></td>" +
      "<td><img src='../icons/general/save.png' onclick='Settings.SaveRowdensity(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Abort(this.parentNode.parentNode)' class='pointer'></td>";
  },
  EditFight: function (el) {
    el.innerHTML = "<td><input style='width: 145px;' value='" + el.children[0].innerText + "'/></td>" +
      "<td><textarea style='width: 240px;height: 60px;'>" + el.children[1].innerText + "</textarea></td>" +
      "<td><input style='width: 145px;' value='" + el.children[2].innerText + "'/></td>" +
      "<td><input style='width: 145px;' value='" + el.children[3].innerText + "'/></td>" +
      "<td><img src='../icons/general/save.png' onclick='Settings.SaveRowfight(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Abort(this.parentNode.parentNode)' class='pointer'></td>";
  },
  EditSensor: function (el) {
    el.innerHTML = "<td><input style='width: 145px;' value='" + el.children[0].innerText + "'/></td>" +
      "<td><input style='width: 145px;' value='" + el.children[1].innerText + "'/></td>" +
      "<td><input style='width: 250px;' value='" + el.children[2].innerText + "'/></td>" +
      "<td><input style='width: 145px;' value='" + el.children[3].innerText + "'/></td>" +
      "<td><img src='../icons/general/save.png' onclick='Settings.SaveRowSensor(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Abort(this.parentNode.parentNode)' class='pointer'></td>";
  },
  ParseJson: function (jsonsettings) {
    if (typeof jsonsettings.StartPos === "undefined") {
      jsonsettings.StartPos = { lat: 0, lon: 0 };
    }
    if (typeof jsonsettings.CellIds === "undefined") {
      jsonsettings.CellIds = [];
    }
    if (typeof jsonsettings.GridRadius === "undefined") {
      jsonsettings.GridRadius = 1000;
    }
    if (typeof jsonsettings.FightDedection === "undefined") {
      jsonsettings.FightDedection = [];
    }
    if (typeof jsonsettings.CrwodDensity === "undefined") {
      jsonsettings.CrwodDensity = [];
    }
    if (typeof jsonsettings.Counting === "undefined") {
      jsonsettings.Counting = [];
    }
    if (typeof jsonsettings.Sensors === "undefined") {
      jsonsettings.Sensors = [];
    }
    var html = "<div id='settingseditor'><div class='title'>Einstellungen</div>";
    html += "<div class='startloc'>Startpunkt: <input value='" + jsonsettings.StartPos.lat + "' id='startlat'> Lat, <input value='" + jsonsettings.StartPos.lon + "' id='startlon'> Lon</div>";
    html += "<div class='wetterwarnings'>CellId's für DWD-Wetterwarnungen: <input value='" + jsonsettings.CellIds.join(";") + "' id='wetterids'> (Trennen durch \";\", <a href='https://www.dwd.de/DE/leistungen/opendata/help/warnungen/cap_warncellids_csv.html'>cap_warncellids_csv</a>)</div>";
    html += "<div class='gridradius'>Radius für das Grid um den Startpunkt: <input value='" + jsonsettings.GridRadius + "' id='gridrad'>m</div>";
    html += "<div class='fightdedection'>Fight Dedection Kameras: <br>" + this._renderFightDedection(jsonsettings.FightDedection) + "</div>";
    html += "<div class='crowddensity'>Crowd Density Kameras: <br>" + this._renderCrowdDensity(jsonsettings.CrwodDensity) + "</div>";
    html += "<div class='sensorsettings'>Sensors: <br>" + this._renderSensorSettings(jsonsettings.Sensors) + "</div>";
    html += "<div class='savesettings'><img src='../icons/general/save.png' onclick='Settings.Save()' class='pointer'></div>";
    document.getElementById("content").innerHTML = html + "</div>";
  },
  Save: function () {
    var ret = {};
    ret.StartPos = {};
    ret.StartPos.lat = parseFloat(document.getElementById("startlat").value.replace(",", "."));
    ret.StartPos.lon = parseFloat(document.getElementById("startlon").value.replace(",", "."));
    ret.CellIds = document.getElementById("wetterids").value.split(";");
    ret.GridRadius = parseInt(document.getElementById("gridrad").value);

    var rowsf = document.getElementById("fighttable").children[1].children;
    var fightjson = {};
    for (var i = 0; i < rowsf.length; i++) {
      if (rowsf[i].children[0].children.length === 1) {
        alert("Bitte zuerst alle Zeilen speichern oder Löschen!");
        return;
      }
      var id = rowsf[i].children[0].innerText;
      var coords = rowsf[i].children[1].innerHTML.split("<br>");
      var polyjson = [];
      for (var j = 0; j < coords.length; j++) {
        var coord = coords[j].split(";");
        polyjson[j] = { "Lat": this._filterFloat(coord[0]), "Lon": this._filterFloat(coord[1]) };
      }
      fightjson[id] = { "Poly": polyjson, "Alias": rowsf[i].children[2].innerText, "Level": this._filterFloat(rowsf[i].children[3].innerText) };
    }
    ret.FightDedection = fightjson;

    var rowsc = document.getElementById("crowdtable").children[1].children;
    var crowdjson = {};
    for (i = 0; i < rowsc.length; i++) {
      if (rowsc[i].children[0].children.length === 1) {
        alert("Bitte zuerst alle Zeilen speichern oder Löschen!");
        return;
      }
      id = rowsc[i].children[0].innerText;
      var num = this._filterFloat(rowsc[i].children[1].innerText);
      coords = rowsc[i].children[2].innerHTML.split("<br>");

      polyjson = [];
      for (j = 0; j < coords.length; j++) {
        coord = coords[j].split(";");
        polyjson[j] = { "Lat": this._filterFloat(coord[0]), "Lon": this._filterFloat(coord[1]) };
      }
      crowdjson[id] = {
        "Poly": polyjson,
        "Count": num,
        "Alias": rowsc[i].children[3].innerText
      };
    }
    ret.CrwodDensity = crowdjson;

    var rowss = document.getElementById("sensortable").children[1].children;
    var sensorjson = {};
    for (i = 0; i < rowss.length; i++) {
      if (rowss[i].children[0].children.length === 1) {
        alert("Bitte zuerst alle Zeilen speichern oder Löschen!");
        return;
      }
      id = rowss[i].children[0].innerText;
      coord = rowss[i].children[2].innerHTML.split(";");
      sensorjson[id] = {
        "Poly": {
          "Lat": this._filterFloat(coord[0]),
          "Lon": this._filterFloat(coord[1])
        },
        "Level": this._filterFloat(rowss[i].children[3].innerText),
        "Alias": rowss[i].children[1].innerText
      };
    }
    ret.Sensors = sensorjson;

    var savesettings = new XMLHttpRequest();
    savesettings.onreadystatechange = function () {
      if (savesettings.readyState === 4) {
        if (savesettings.status === 200) {
          alert("Änderungen gespeichert!");
        } else if (savesettings.status === 501) {
          alert("Ein Fehler ist aufgetreten (invalid JSON)!");
        }
      }
    };
    savesettings.open("PUT", "/admin/api/json/setting", true);
    savesettings.send(JSON.stringify(ret));
  },
  SaveRowdensity: function (el) {
    var coords = el.children[2].children[0].value.replace(/\n/gi, "<br>");
    var coordscheck = coords.split("<br>");
    var fail = false;
    for (var i = 0; i < coordscheck.length; i++) {
      var coord = coordscheck[i].split(";");
      if (coord.length !== 2) {
        fail = true;
        break;
      }
      if (isNaN(this._filterFloat(coord[0])) || isNaN(this._filterFloat(coord[1]))) {
        fail = true;
        break;
      }
    }
    if (fail) {
      alert("Die Eingabe der Koordinaten ist nicht Korrekt!\n\nBeispiel:\n50.7;7.8\n50.6;7.9");
      return;
    }
    if (isNaN(this._filterFloat(el.children[1].children[0].value))) {
      alert("Die Eingabe der Maximalen Anzahl der Personen ist nicht Korrekt, erwarte eine Zahl.");
      return;
    }
    el.innerHTML = "<td>" + el.children[0].children[0].value + "</td>" +
      "<td>" + el.children[1].children[0].value + "</td>" +
      "<td>" + coords + "</td>" +
      "<td>" + el.children[3].children[0].value + "</td>" +
      "<td><img src='../icons/general/edit.png' onclick='Settings.EditDensity(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Delete(this.parentNode.parentNode)' class='pointer'></td>";
  },
  SaveRowfight: function (el) {
    var coords = el.children[1].children[0].value.replace(/\n/gi, "<br>");
    var coordscheck = coords.split("<br>");
    var fail = false;
    for (var i = 0; i < coordscheck.length; i++) {
      var coord = coordscheck[i].split(";");
      if (coord.length !== 2) {
        fail = true;
        break;
      }
      if (isNaN(this._filterFloat(coord[0])) || isNaN(this._filterFloat(coord[1]))) {
        fail = true;
        break;
      }
    }
    if (isNaN(this._filterFloat(el.children[3].children[0].value))) {
      alert("Die Eingabe des Alertlevel erwartet einen Float");
      return;
    }
    if (fail) {
      alert("Die Eingabe der Koordinaten ist nicht Korrekt!\n\nBeispiel:\n50.7;7.8\n50.6;7.9");
      return;
    }
    el.innerHTML = "<td>" + el.children[0].children[0].value + "</td>" +
      "<td>" + coords + "</td>" +
      "<td>" + el.children[2].children[0].value + "</td>" +
      "<td>" + this._filterFloat(el.children[3].children[0].value) + "</td>" +
      "<td><img src='../icons/general/edit.png' onclick='Settings.EditFight(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Delete(this.parentNode.parentNode)' class='pointer'></td>";
  },
  SaveRowSensor: function (el) {
    var coords = el.children[2].children[0].value;
    var coord = coords.split(";");
    var fail = false;
    if (coord.length !== 2) {
      fail = true;
    } else if (isNaN(this._filterFloat(coord[0])) || isNaN(this._filterFloat(coord[1]))) {
      fail = true;
    }
    if (isNaN(this._filterFloat(el.children[3].children[0].value))) {
      alert("Die Eingabe des Alertlevel erwartet einen Float");
      return;
    }
    if (fail) {
      alert("Die Eingabe der Koordinaten ist nicht Korrekt!\n\nBeispiel:\n50.7;7.8");
      return;
    }
    el.innerHTML = "<td>" + el.children[0].children[0].value + "</td>" +
      "<td>" + el.children[1].children[0].value + "</td>" +
      "<td>" + coords + "</td>" +
      "<td>" + this._filterFloat(el.children[3].children[0].value) + "</td>" +
      "<td><img src='../icons/general/edit.png' onclick='Settings.EditSensor(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Delete(this.parentNode.parentNode)' class='pointer'></td>";
  },
  //private functions
  _filterFloat: function (value) {
    if (/^(-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
      return Number(value);
    }
    return NaN;
  },
  _renderCrowdDensity: function (json) {
    var ret = "";
    ret += "<table id='crowdtable' class='settingstable'>";
    ret += "<thead><tr><th width='150'>ID</th><th width='200'>Personenanzahl</th><th width='250'>Koordinaten</th><th width='150'>Alias</th><th width='50'></th></tr></thead>";
    ret += "<tbody>";
    for (var id in json) {
      var coords = [];
      for (var i = 0; i < json[id].Poly.length; i++) {
        coords[i] = json[id].Poly[i].Lat + ";" + json[id].Poly[i].Lon;
      }
      ret += "<tr>" +
        "<td>" + id + "</td>" +
        "<td>" + json[id].Count + "</td>" +
        "<td>" + coords.join("<br>") + "</td>" +
        "<td>" + json[id].Alias + "</td>" +
        "<td><img src='../icons/general/edit.png' onclick='Settings.EditDensity(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Delete(this.parentNode.parentNode)' class='pointer'></td>" +
        "</tr>";
    }
    ret += "</tbody>";
    ret += "<tfoot><tr><td></td><td></td><td></td><td></td><td><img src='../icons/general/add.png' onclick='Settings.AddDensity()' class='pointer'></td></tr></tfoot>";
    ret += "</table>";
    return ret;
  },
  _renderFightDedection: function (json) {
    var ret = "";
    ret += "<table id='fighttable' class='settingstable'>";
    ret += "<thead><tr><th width='150'>ID</th><th width='250'>Koordinaten</th><th width='150'>Alias</th><th width='150'>Alertlimit</th><th width='50'></th></tr></thead>";
    ret += "<tbody>";
    for (var id in json) {
      var coords = [];
      for (var i = 0; i < json[id].Poly.length; i++) {
        coords[i] = json[id].Poly[i].Lat + ";" + json[id].Poly[i].Lon;
      }
      ret += "<tr>" +
        "<td>" + id + "</td>" +
        "<td>" + coords.join("<br>") + "</td>" +
        "<td>" + json[id].Alias + "</td>" +
        "<td>" + json[id].Level + "</td>" +
        "<td><img src='../icons/general/edit.png' onclick='Settings.EditFight(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Delete(this.parentNode.parentNode)' class='pointer'></td>" +
        "</tr>";
    }
    ret += "</tbody>";
    ret += "<tfoot><tr><td></td><td></td><td></td><td></td><td><img src='../icons/general/add.png' onclick='Settings.AddFight()' class='pointer'></td></tr></tfoot>";
    ret += "</table>";
    return ret;
  },
  _renderSensorSettings: function (json) {
    var ret = "";
    ret += "<table id='sensortable' class='settingstable'>";
    ret += "<thead><tr><th width='150'>ID</th><th width='150'>Alias</th><th width='250'>Koordinaten</th><th width='150'>Warn above</th><th width='50'></th></tr></thead>";

    ret += "<tbody>";
    for (var id in json) {
      ret += "<tr>" +
        "<td>" + id + "</td>" +
        "<td>" + json[id].Alias + "</td>" +
        "<td>" + json[id].Poly.Lat + ";" + json[id].Poly.Lon + "</td>" +
        "<td>" + json[id].Level + "</td>" +
        "<td><img src='../icons/general/edit.png' onclick='Settings.EditSensor(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Delete(this.parentNode.parentNode)' class='pointer'></td>" +
        "</tr>";
    }
    ret += "</tbody>";

    ret += "<tfoot><tr><td></td><td></td><td></td><td></td><td><img src='../icons/general/add.png' onclick='Settings.AddSensor()' class='pointer'></td></tr></tfoot>";
    ret += "</table>";
    return ret;
  },
};