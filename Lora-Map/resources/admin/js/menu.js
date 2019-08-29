﻿var AdminMenu = {
  Names: function () {
    var ajaxnames = new XMLHttpRequest();
    ajaxnames.onreadystatechange = function () {
      if (ajaxnames.readyState === 4 && ajaxnames.status === 200) {
        NamesEditor.ParseJson(ajaxnames.responseText);
      }
    };
    ajaxnames.open("GET", "/admin/get_json_names", true);
    ajaxnames.send();
    return false;
  },
  Overlay: function () {
    return false;
  },
  Settings: function () {
    var ajaxsettings = new XMLHttpRequest();
    ajaxsettings.onreadystatechange = function () {
      if (ajaxsettings.readyState === 4 && ajaxsettings.status === 200) {
        Settings.ParseJson(JSON.parse(ajaxsettings.responseText));
      }
    };
    ajaxsettings.open("GET", "/admin/get_json_settings", true);
    ajaxsettings.send();
    return false;
  },
  ExImport: function () {
    var ajaxnames = new XMLHttpRequest();
    ajaxnames.onreadystatechange = function () {
      if (ajaxnames.readyState === 4 && ajaxnames.status === 200) {
        var ajaxgeo = new XMLHttpRequest();
        ajaxgeo.onreadystatechange = function () {
          if (ajaxgeo.readyState === 4 && ajaxgeo.status === 200) {
            var ajaxsettings = new XMLHttpRequest();
            ajaxsettings.onreadystatechange = function () {
              if (ajaxsettings.readyState === 4 && ajaxsettings.status === 200) {
                ExImport.ParseJson(ajaxnames.responseText, ajaxgeo.responseText, ajaxsettings.responseText);
              }
            };
            ajaxsettings.open("GET", "/admin/get_json_settings", true);
            ajaxsettings.send();
          }
        };
        ajaxgeo.open("GET", "/admin/get_json_geo", true);
        ajaxgeo.send();
      }
    };
    ajaxnames.open("GET", "/admin/get_json_names", true);
    ajaxnames.send();
    return false;
  }
};

var NamesEditor = {
  iconeditorcounter: 0,
  filterGropus: { no: "immer Sichtbar", fw: "Feuerwehr", sani: "Sanitäter", pol: "Polizei", oa: "Ordnungsamt", si: "Sicherheitsdienst", thw: "Technisches Hilfswerk", crew: "Veranstalter", dev: "Entwickler" },
  ParseJson: function (jsontext) {
    document.getElementById("content").innerHTML = "";
    var namesconfig = JSON.parse(jsontext);
    var html = "<div id='nameeditor'><div class='title'>Namenseinträge in den Einstellungen</div>";
    html += "<table id='nametable' class='settingstable'>";
    html += "<thead><tr><th width='60'>ID</th><th width='250'>Name</th><th width='65'>Icon</th><th width='150'>Filter Gruppe</th><th width='50'></th></tr></thead>";
    html += "<tbody>";
    for (var id in namesconfig) {
      if (namesconfig.hasOwnProperty(id)) {
        var nameentry = namesconfig[id];
        html += "<tr>" +
          "<td>" + id + "</td>" +
          "<td>" + nameentry["name"] + "</td>";
        if (nameentry.hasOwnProperty("marker.svg")) {
          html += "<td>" + this.ParseIcon(nameentry["marker.svg"]) + "</td>";
        } else if (nameentry.hasOwnProperty("icon")) {
          html += "<td><img src='"+nameentry["icon"]+"'></td>";
        } else {
          html += "<td><img src='../js/leaflet/images/marker-icon.png'></td>";
        }
        var gfilter = typeof nameentry.Group === "undefined" ? "no" : nameentry.Group;
        html += "<td rel='" + gfilter + "'>" + this.filterGropus[gfilter] + "</td>";
        html += "<td><img src='../icons/general/edit.png' onclick='NamesEditor.Edit(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='NamesEditor.Delete(this.parentNode.parentNode)' class='pointer'></td>" +
          "</tr>";
      }
    }
    html += "</tbody>";
    html += "<tfoot><tr><td></td><td></td><td></td><td></td><td><img src='../icons/general/add.png' onclick='NamesEditor.Add()' class='pointer'> <img src='../icons/general/save.png' onclick='NamesEditor.Save()' class='pointer'></td></tr></tfoot>";
    html += "</table>";
    document.getElementById("content").innerHTML = html + "</div>";
  },
  ParseIcon: function (markerobj) {
    var url = "../icons/marker/Marker.svg";
    if (markerobj.hasOwnProperty("person")) {
      url += "?icon=person&marker-bg=hidden";
      if (markerobj["person"].hasOwnProperty("org")) {
        url += "&person-org=" + markerobj["person"]["org"];
      }
      if(markerobj["person"].hasOwnProperty("funct")) {
        url += "&person-funct=" + markerobj["person"]["funct"];
      }
      if(markerobj["person"].hasOwnProperty("rang")) {
        url += "&person-rang=" + markerobj["person"]["rang"];
      }
      if(markerobj["person"].hasOwnProperty("text")) {
        url += "&person-text=" + markerobj["person"]["text"];
      }
      if (markerobj["person"].hasOwnProperty("typ") && Array.isArray(markerobj["person"]["typ"])) {
        for (i in markerobj["person"]["typ"]) {
          url += "&person-typ=" + markerobj["person"]["typ"][i];
        }
      }
    }
    return "<object data='"+url+"' type='image/svg+xml' style='height:50px; width:50px;'></object>";
  },
  BuildIconJson: function (url) {
    var query = this.SplitQueryIntoObject(this.SplitUrlIntoParts(url).query);
    var markerobj = {};
    if (query.hasOwnProperty("icon") && query["icon"] === "person") {
      markerobj["person"] = {};
      if (query.hasOwnProperty("person-org")) {
        markerobj["person"]["org"] = query["person-org"];
      }
      if (query.hasOwnProperty("person-funct")) {
        markerobj["person"]["funct"] = query["person-funct"];
      }
      if (query.hasOwnProperty("person-rang")) {
        markerobj["person"]["rang"] = query["person-rang"];
      }
      if (query.hasOwnProperty("person-text")) {
        markerobj["person"]["text"] = query["person-text"];
      }
      if (query.hasOwnProperty("person-typ")) {
        if (Array.isArray(query["person-typ"])) {
          markerobj["person"]["typ"] = new Array();
          for (var i in query["person-typ"]) {
            markerobj["person"]["typ"].push(query["person-typ"][i]);
          }
        } else {
          markerobj["person"]["typ"] = new Array();
          markerobj["person"]["typ"].push(query["person-typ"]);
        }
      }
    }
    return markerobj;
  },
  Add: function () {
    var newrow = document.createElement("tr");
    newrow.innerHTML = "<td><input style='width: 55px;'/></td>";
    newrow.innerHTML += "<td><input style='width: 245px;'/></td>";
    newrow.innerHTML += "<td><img src='../icons/general/icon_edit.png' onclick='NamesEditor.IconEditor(this.parentNode)' class='pointer'> wähle Icon</td>";
    newrow.innerHTML += "<td>" + this.CreateSelectBox("", "item", { item: "" }, this.filterGropus, null, null, true);
    newrow.innerHTML += "<td><img src='../icons/general/save.png' onclick='NamesEditor.SaveRow(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='NamesEditor.Abort(this.parentNode.parentNode)' class='pointer'></td>";
    document.getElementById("nametable").children[1].appendChild(newrow);
  },
  Save: function () {
    var rows = document.getElementById("nametable").children[1].children;
    var namejson = {};
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].children[0].children.length === 1) {
        alert("Bitte zuerst alle Zeilen speichern oder Löschen!");
        return;
      }
      var id = rows[i].children[0].innerText;
      var name = rows[i].children[1].innerText;
      namejson[id] = { "name": name, "Group": rows[i].children[3].attributes.rel.nodeValue };
      if (rows[i].children[2].children[0].hasAttribute("data")) {
        namejson[id]["marker.svg"] = this.BuildIconJson(rows[i].children[2].children[0].data);
      }
    }
    var savenames = new XMLHttpRequest();
    savenames.onreadystatechange = function () {
      if (savenames.readyState === 4) {
        if (savenames.status === 200) {
          alert("Änderungen gespeichert!");
        } else if (savenames.status === 501) {
          alert("Ein Fehler ist aufgetreten (invalid JSON)!");
        }
      }
    };
    savenames.open("POST", "/admin/set_json_names", true);
    savenames.send(JSON.stringify(namejson));
  },
  Delete: function (el) {
    var name = el.firstChild.innerHTML;
    var answ = window.prompt("Wollen sie den Eintrag für \"" + name + "\" wirklich löschen?", "");
    if (answ !== null) {
      el.parentNode.removeChild(el);
    }
  },
  Edit: function (el) {
    var id = el.children[0].innerText;
    var name = el.children[1].innerText;
    var url = null;
    var gfilter = el.children[3].attributes.rel.nodeValue;
    if (el.children[2].children[0].hasAttribute("data")) {
      url = el.children[2].children[0].data;
    }
    el.innerHTML = "<td><input style='width: 55px;' value='" + id + "'/></td>";
    el.innerHTML += "<td><input style='width: 245px;' value='" + name + "'/></td>";
    if (url === null) {
      el.innerHTML += "<td><img src='../icons/general/icon_edit.png' onclick='NamesEditor.IconEditor(this.parentNode)' class='pointer'> wähle Icon</td>";
    } else {
      el.innerHTML += "<td><img src='../icons/general/icon_edit.png' onclick='NamesEditor.IconEditor(this.parentNode)' class='pointer'> <object data='" + url + "' type='image/svg+xml' style='height:50px; width:50px;'></object></td>";
    }
    el.innerHTML += "<td>" + this.CreateSelectBox("", "item", { item: gfilter }, this.filterGropus, null, null, true);
    el.innerHTML += "<td><img src='../icons/general/save.png' onclick='NamesEditor.SaveRow(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='NamesEditor.Abort(this.parentNode.parentNode)' class='pointer'></td>";
  },
  Abort: function (el) {
    el.parentNode.removeChild(el);
  },
  SaveRow: function (el) {
    var id = el.children[0].children[0].value;
    var name = el.children[1].children[0].value;
    var url = null;
    var gfilter = el.children[3].children[0].selectedOptions[0].value;
    if (gfilter === "---") {
      gfilter = "no";
    }
    if (el.children[2].children.length === 2) {
      url = el.children[2].children[1].data;
    }
    el.innerHTML = "<td>" + id + "</td>" +
      "<td>" + name + "</td>";
    if (url === null) {
      el.innerHTML += "<td><img src='../js/leaflet/images/marker-icon.png'></td>";
    } else {
      el.innerHTML += "<td><object data='" + url +"' type='image/svg+xml' style='height:50px; width:50px;'></object></td>";
    }
    el.innerHTML += "<td rel='" + gfilter + "'>" + this.filterGropus[gfilter] + "</td>";
    el.innerHTML += "<td><img src='../icons/general/edit.png' onclick='NamesEditor.Edit(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='NamesEditor.Delete(this.parentNode.parentNode)' class='pointer'></td>";
  },
  IconEditor: function (el) {
    var url = "../icons/marker/Marker.svg?marker-bg=hidden";
    el.id = "icon_edit_" + this.iconeditorcounter++;
    if (el.children.length === 2) {
      url = el.children[1].data;
    }
    var query = this.SplitQueryIntoObject(this.SplitUrlIntoParts(url).query);
    var ie = document.createElement("div");
    ie.id = "iconeditor";
    ie.innerHTML = "<div class='innerbox'>" +
      "<div class='preview'><object id='markerprev' data='" + url + "' type='image/svg+xml' style='height:200px; width:200px;'></object></div>" +
      "<div class='controls'>" +
      this.CreateSelectBox("Typ", "icon", query, { "person": "Person" }, null, "iconeditor-type-") + "<br>" +
      "<div id='iconeditor-type-person' style='display: " + (query.hasOwnProperty("icon") && query["icon"] === "person" ? "block" : "none") + ";'>" +
      this.CreateSelectBox("Organisation", "person-org", query, { "fw": "Feuerwehr", "thw": "Technisches Hilfswerk", "hilo": "Hilfsorganisationen, Bundeswehr", "fueh": "Einrichtungen der Führung", "pol": "Polizei, Bundespolizei, Zoll", "sonst": "Sonstige Einrichtungen der Gefahrenabwehr" }) + "<br>" +
      this.CreateSelectBox("Funktion", "person-funct", query, { "sonder": "Sonder", "fueh": "Führung" }) + "<br>" +
      this.CreateSelectBox("Rang", "person-rang", query, { "trupp": "Trupp", "grupp": "Gruppe", "zug":"Zug" }) + "<br>" +
      "Text: <input onchange='NamesEditor.ChangeLinkPreview(\"person-text\",this.value);' value='" + (query.hasOwnProperty("person-text") ? query["person-text"] : "") + "'><br>" +
      this.CreateSelectBox("Typ", "person-typ", query, { "loesch": "Brandbekämpfung/Löscheinsatz", "sani": "Rettungswesen, Sanitätswesen, Gesundheitswesen", "betreu": "Betreuung" }, true) + "<br>" +
      "</div>" +
      "</div>" +
      "<div class='save'><button onclick='NamesEditor.SaveIconEditor(\"" + el.id + "\"); '>Schließen</botton></div>" +
      "</div>";
    document.getElementsByTagName("body")[0].appendChild(ie);
  },
  CreateSelectBox: function (title, key, query, options, muliple, group, noonchange) {
    var html = title !== "" ? title + ": " : "";
    var onchange = "";
    if (!(typeof noonchange !== "undefined" && noonchange === true)) {
      var eventtext = "NamesEditor.ChangeLinkPreview(\"" + key + "\",this.selectedOptions);";
      if (typeof group !== "undefined" && group !== null) {
        eventtext += " document.getElementById(\"" + group + "\"+this.value).style.display = \"block\";'";
      }
      onchange = " onchange='" + eventtext + "'";
    }
    html += "<select" + onchange + (typeof muliple !== "undefined" && muliple !== null ? " multiple" : "") + ">";
    if (typeof muliple === "undefined" || muliple === null) {
      html += "<option>---</option>";
    }
    for (var value in options) {
      if (query.hasOwnProperty(key) && query[key] === value) {
        html += "<option value='" + value + "' selected>" + options[value] + "</option>";
      } else if (query.hasOwnProperty(key) && Array.isArray(query[key])) {
        var notinqueryarray = true;
        for (var i in query[key]) {
          if (query[key][i] === value) {
            notinqueryarray = false;
            html += "<option value='" + value + "' selected>" + options[value] + "</option>";
          }
        }
        if (notinqueryarray) {
          html += "<option value='" + value + "'>" + options[value] + "</option>";
        }
      } else {
        html += "<option value='" + value + "'>" + options[value] + "</option>";
      }
    }
    html += "</select>";
    return html;
  },
  SaveIconEditor: function (id) {
    var cell = document.getElementById(id);
    cell.innerHTML = "<img src='../icons/general/icon_edit.png' onclick='NamesEditor.IconEditor(this.parentNode)' class='pointer'> <object data='" + document.getElementById("markerprev").data + "' type='image/svg+xml' style='height:50px; width:50px;'></object>";
    cell.removeAttribute("id");
    document.getElementById("iconeditor").remove();
  },
  SplitQueryIntoObject: function (query) {
    if (query.indexOf("?") !== -1) {
      query = query.split("?")[1];
    }
    var queryobj = {};
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");
      if (queryobj.hasOwnProperty(decodeURIComponent(pair[0]))) {
        if (Array.isArray(queryobj[decodeURIComponent(pair[0])])) {
          queryobj[decodeURIComponent(pair[0])].push(decodeURIComponent(pair[1] || ""));
        } else {
          var tmp = queryobj[decodeURIComponent(pair[0])];
          queryobj[decodeURIComponent(pair[0])] = new Array();
          queryobj[decodeURIComponent(pair[0])].push(tmp);
          queryobj[decodeURIComponent(pair[0])].push(decodeURIComponent(pair[1] || ""));
        }
      } else {
        queryobj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
      }
    }
    return queryobj;
  },
  JoinObjectIntoQuery: function (queryobj) {
    var query = new Array();
    for (var id in queryobj) {
      if (Array.isArray(queryobj[id])) {
        for (var i in queryobj[id]) {
          query.push(encodeURIComponent(id) + "=" + encodeURIComponent(queryobj[id][i]));
        }
      } else {
        query.push(encodeURIComponent(id) + "=" + encodeURIComponent(queryobj[id]));
      }
    }
    return query.join("&");
  },
  SplitUrlIntoParts: function (url) {
    var parts = url.split("?");
    return { "file": parts[0], "query": parts[1] || "" };
  },
  ChangeLinkPreview: function (key, val) {
    var cur = this.SplitUrlIntoParts(document.getElementById("markerprev").data);
    var query = this.SplitQueryIntoObject(cur.query);
    if (typeof val === "object") {
      query[key] = new Array();
      for (var i = 0; i < val.length; i++) {
        query[key].push(val[i].value);
        if (val[i].value === "---") {
          delete query[key];
          break;
        }
      }
    } else {
      if (val === "---" || val === "") {
        delete query[key];
      } else {
        query[key] = val;
      }
    }
    document.getElementById("markerprev").data = cur.file + "?" + this.JoinObjectIntoQuery(query);
  }
};

var Settings = {
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
    var html = "<div id='settingseditor'><div class='title'>Einstellungen</div>";
    html += "<div class='startloc'>Startpunkt: <input value='" + jsonsettings.StartPos.lat + "' id='startlat'> Lat, <input value='" + jsonsettings.StartPos.lon + "' id='startlon'> Lon</div>";
    html += "<div class='wetterwarnings'>CellId's für DWD-Wetterwarnungen: <input value='" + jsonsettings.CellIds.join(";") + "' id='wetterids'> (Trennen durch \";\", <a href='https://www.dwd.de/DE/leistungen/opendata/help/warnungen/cap_warncellids_csv.html'>cap_warncellids_csv</a>)</div>";
    html += "<div class='gridradius'>Radius für das Grid um den Startpunkt: <input value='" + jsonsettings.GridRadius + "' id='gridrad'>m</div>";
    html += "<div class='fightdedection'>Fight Dedection Kameras: <br>" + this._renderFightDedection(jsonsettings.FightDedection) + "</div>";
    html += "<div class='crowddensity'>Crowd Density Kameras: <br>" + this._renderCrowdDensity(jsonsettings.CrwodDensity) + "</div>";
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
      fightjson[id] = { "Poly": polyjson };
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
        "Count": num
      };
    }
    ret.CrwodDensity = crowdjson;

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
    savesettings.open("POST", "/admin/set_json_settings", true);
    savesettings.send(JSON.stringify(ret));
  }, 
  _renderFightDedection: function (json) {
    var ret = "";
    ret += "<table id='fighttable' class='settingstable'>";
    ret += "<thead><tr><th width='150'>ID</th><th width='250'>Koordinaten</th><th width='50'></th></tr></thead>";
    ret += "<tbody>";
    for (var id in json) {
      var coords = [];
      for (var i = 0; i < json[id].Poly.length; i++) {
        coords[i] = json[id].Poly[i].Lat + ";" + json[id].Poly[i].Lon;
      }
      ret += "<tr>" +
        "<td>" + id + "</td>" +
        "<td>" + coords.join("<br>") + "</td>" +
        "<td><img src='../icons/general/edit.png' onclick='Settings.EditFight(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Delete(this.parentNode.parentNode)' class='pointer'></td>" +
        "</tr>";
    }
    ret += "</tbody>";
    ret += "<tfoot><tr><td></td><td></td><td><img src='../icons/general/add.png' onclick='Settings.AddFight()' class='pointer'></td></tr></tfoot>";
    ret += "</table>";
    return ret;
  },
  _renderCrowdDensity: function (json) {
    var ret = "";
    ret += "<table id='crowdtable' class='settingstable'>";
    ret += "<thead><tr><th width='150'>ID</th><th width='200'>Personenanzahl</th><th width='250'>Koordinaten</th><th width='50'></th></tr></thead>";
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
        "<td><img src='../icons/general/edit.png' onclick='Settings.EditDensity(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Delete(this.parentNode.parentNode)' class='pointer'></td>" +
        "</tr>";
    }
    ret += "</tbody>";
    ret += "<tfoot><tr><td></td><td></td><td></td><td><img src='../icons/general/add.png' onclick='Settings.AddDensity()' class='pointer'></td></tr></tfoot>";
    ret += "</table>";
    return ret;
  },
  AddFight: function () {
    var newrow = document.createElement("tr");
    newrow.innerHTML = "<td><input style='width: 145px;'/></td>";
    newrow.innerHTML += "<td><textarea style='width: 240px;height: 60px;'></textarea></td>";
    newrow.innerHTML += "<td><img src='../icons/general/save.png' onclick='Settings.SaveRowfight(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Abort(this.parentNode.parentNode)' class='pointer'></td>";
    document.getElementById("fighttable").children[1].appendChild(newrow);
  },
  AddDensity: function () {
    var newrow = document.createElement("tr");
    newrow.innerHTML = "<td><input style='width: 145px;'/></td>";
    newrow.innerHTML += "<td><input style='width: 195px;'/></td>";
    newrow.innerHTML += "<td><textarea style='width: 240px;height: 60px;'></textarea></td>";
    newrow.innerHTML += "<td><img src='../icons/general/save.png' onclick='Settings.SaveRowdensity(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Abort(this.parentNode.parentNode)' class='pointer'></td>";
    document.getElementById("crowdtable").children[1].appendChild(newrow);
  },
  Abort: function (el) {
    el.parentNode.removeChild(el);
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
    if (fail) {
      alert("Die Eingabe der Koordinaten ist nicht Korrekt!\n\nBeispiel:\n50.7;7.8\n50.6;7.9");
      return;
    }
    el.innerHTML = "<td>" + el.children[0].children[0].value + "</td>" +
      "<td>" + coords + "</td>" +
      "<td><img src='../icons/general/edit.png' onclick='Settings.EditFight(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.DeleteFight(this.parentNode.parentNode)' class='pointer'></td>";
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
      "<td><img src='../icons/general/edit.png' onclick='Settings.EditDensity(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.DeleteFight(this.parentNode.parentNode)' class='pointer'></td>";
  },
  Delete: function (el) {
    var answ = window.prompt("Wollen sie den Eintrag für \"" + el.firstChild.innerHTML + "\" wirklich löschen?", "");
    if (answ !== null) {
      el.parentNode.removeChild(el);
    }
  },
  EditFight: function (el) {
    el.innerHTML = "<td><input style='width: 145px;' value='" + el.children[0].innerText + "'/></td>" +
      "<td><textarea style='width: 240px;height: 60px;'>" + el.children[1].innerText + "</textarea></td>" +
      "<td><img src='../icons/general/save.png' onclick='Settings.SaveRowfight(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Abort(this.parentNode.parentNode)' class='pointer'></td>";
  },
  EditDensity: function (el) {
    el.innerHTML = "<td><input style='width: 145px;' value='" + el.children[0].innerText + "'/></td>" +
      "<td><input style='width: 195px;' value='" + el.children[1].innerText + "'/></td>" +
      "<td><textarea style='width: 240px;height: 60px;'>" + el.children[2].innerText + "</textarea></td>" +
      "<td><img src='../icons/general/save.png' onclick='Settings.SaveRowdensity(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='Settings.Abort(this.parentNode.parentNode)' class='pointer'></td>";
  },
  _filterFloat: function (value) {
    if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
      return Number(value);
    }
    return NaN;
  }
};

var ExImport = {
  ParseJson: function (jsonnames, jsongeo, jsonsettings) {
    html = "<div id='eximport'><div class='title'>Ex- und Import der Einstellungen</div>";
    html += "<div class='names'>names.json (Namen und Icons)<br/><textarea id='ex_names'></textarea> <img src='../icons/general/save.png' onclick='ExImport.SaveNames()' class='pointer'></div>";
    html += "<div class='names'>geo.json (Layer on the MAP) <a href='https://mapbox.github.io/togeojson/'>Kml Konverter</a><br/><textarea id='ex_geo'></textarea> <img src='../icons/general/save.png' onclick='ExImport.SaveGeo()' class='pointer'></div>";
    html += "<div class='names'>settings.json (Settings of the Map)<br/><textarea id='ex_settings'></textarea> <img src='../icons/general/save.png' onclick='ExImport.SaveSettings()' class='pointer'></div>";

    html += "</div>";
    document.getElementById("content").innerHTML = html;
    document.getElementById("ex_names").value = jsonnames;
    document.getElementById("ex_geo").value = jsongeo;
    document.getElementById("ex_settings").value = jsonsettings;
  },
  SaveNames: function () {
    var savenames = new XMLHttpRequest();
    savenames.onreadystatechange = function () {
      if (savenames.readyState === 4) {
        if (savenames.status === 200) {
          alert("Änderungen an names.json gespeichert!");
        } else if (savenames.status === 501) {
          alert("Ein Fehler ist aufgetreten (invalid JSON)!");
        }
      }
    };
    savenames.open("POST", "/admin/set_json_names", true);
    savenames.send(document.getElementById("ex_names").value);
  },
  SaveGeo: function () {
    var savegeo = new XMLHttpRequest();
    savegeo.onreadystatechange = function () {
      if (savegeo.readyState === 4) {
        if (savegeo.status === 200) {
          alert("Änderungen an geo.json gespeichert!");
        } else if (savegeo.status === 501) {
          alert("Ein Fehler ist aufgetreten (invalid JSON)!");
        }
      }
    };
    savegeo.open("POST", "/admin/set_json_geo", true);
    savegeo.send(document.getElementById("ex_geo").value);
  },
  SaveSettings: function () {
    var savesettings = new XMLHttpRequest();
    savesettings.onreadystatechange = function () {
      if (savesettings.readyState === 4) {
        if (savesettings.status === 200) {
          alert("Änderungen an settings.json gespeichert!");
        } else if (savesettings.status === 501) {
          alert("Ein Fehler ist aufgetreten (invalid JSON)!");
        }
      }
    };
    savesettings.open("POST", "/admin/set_json_settings", true);
    savesettings.send(document.getElementById("ex_settings").value);
  }
};