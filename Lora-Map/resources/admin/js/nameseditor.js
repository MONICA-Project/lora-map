var NamesEditor = {
  //public variables
  iconeditorcounter: 0,
  filterGropus: { no: "immer Sichtbar", fw: "Feuerwehr", sani: "Sanitäter", pol: "Polizei", oa: "Ordnungsamt", si: "Sicherheitsdienst", thw: "Technisches Hilfswerk", crew: "Veranstalter", dev: "Entwickler" },
  //public functions
  Abort: function (el) {
    el.parentNode.removeChild(el);
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
  BuildIconJson: function (url) {
    var query = this.SplitQueryIntoObject(this.SplitUrlIntoParts(url).query);
    var markerobj = {};
    if (Object.prototype.hasOwnProperty.call(query, "icon") && query["icon"] === "person") {
      markerobj["person"] = {};
      if (Object.prototype.hasOwnProperty.call(query, "person-org")) {
        markerobj["person"]["org"] = query["person-org"];
      }
      if (Object.prototype.hasOwnProperty.call(query, "person-funct")) {
        markerobj["person"]["funct"] = query["person-funct"];
      }
      if (Object.prototype.hasOwnProperty.call(query, "person-rang")) {
        markerobj["person"]["rang"] = query["person-rang"];
      }
      if (Object.prototype.hasOwnProperty.call(query, "person-text")) {
        markerobj["person"]["text"] = query["person-text"];
      }
      if (Object.prototype.hasOwnProperty.call(query, "person-typ[]")) {
        if (Array.isArray(query["person-typ[]"])) {
          markerobj["person"]["typ"] = new Array();
          for (var i in query["person-typ[]"]) {
            markerobj["person"]["typ"].push(query["person-typ[]"][i]);
          }
        } else {
          markerobj["person"]["typ"] = new Array();
          markerobj["person"]["typ"].push(query["person-typ[]"]);
        }
      }
    }
    return markerobj;
  },
  ChangeLinkPreview: function (key, val, multiple) {
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
  },
  CreateSelectBox: function (title, key, query, options, muliple, group, noonchange) {
    var html = title !== "" ? title + ": " : "";
    var onchange = "";
    if (!(typeof noonchange !== "undefined" && noonchange === true)) {
      var eventtext = "NamesEditor.ChangeLinkPreview(\"" + key + "\", this.selectedOptions, multiple);";
      if (typeof group !== "undefined" && group !== null) {
        eventtext += " document.getElementById(\"" + group + "\"+this.value).style.display = \"block\";'";
      }
      onchange = " onchange='" + eventtext + "'";
    }
    html += "<select" + onchange + (typeof muliple !== "undefined" && muliple === true ? " multiple" : "") + ">";
    if (typeof muliple === "undefined" || muliple === null) {
      html += "<option>---</option>";
    }
    for (var value in options) {
      if (Object.prototype.hasOwnProperty.call(query, key) && query[key] === value) {
        html += "<option value='" + value + "' selected>" + options[value] + "</option>";
      } else if (Object.prototype.hasOwnProperty.call(query, key) && Array.isArray(query[key])) {
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
      el.innerHTML += "<td><img src='../icons/general/icon_edit.png' onclick='NamesEditor.IconEditor(this.parentNode)' class='pointer'> <object data='" + url + "' type='image/svg+xml' style='height:57px; width:50px;'></object></td>";
    }
    el.innerHTML += "<td>" + this.CreateSelectBox("", "item", { item: gfilter }, this.filterGropus, null, null, true);
    el.innerHTML += "<td><img src='../icons/general/save.png' onclick='NamesEditor.SaveRow(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='NamesEditor.Abort(this.parentNode.parentNode)' class='pointer'></td>";
  },
  IconEditor: function (el) {
    var url = "../api/svg/person.svg?";
    el.id = "icon_edit_" + this.iconeditorcounter++;
    if (el.children.length === 2) {
      url = el.children[1].data;
    }
    var query = this.SplitQueryIntoObject(this.SplitUrlIntoParts(url).query);
    var ie = document.createElement("div");
    ie.id = "iconeditor";
    ie.innerHTML = "<div class='innerbox'>" +
      "<div class='preview'><object id='markerprev' data='" + url + "' type='image/svg+xml' style='height:226px; width:200px;'></object></div>" +
      "<div class='controls'>" +
      this.CreateSelectBox("Typ", "icon", query, { "person": "Person" }, null, "iconeditor-type-") + "<br>" +
      "<div id='iconeditor-type-person' style='display: " + (Object.prototype.hasOwnProperty.call(query, "icon") && query["icon"] === "person" ? "block" : "none") + ";'>" +
      this.CreateSelectBox("Organisation", "person-org", query, { "fw": "Feuerwehr", "thw": "Technisches Hilfswerk", "hilo": "Hilfsorganisationen, Bundeswehr", "fueh": "Einrichtungen der Führung", "pol": "Polizei, Bundespolizei, Zoll", "sonst": "Sonstige Einrichtungen der Gefahrenabwehr" }) + "<br>" +
      this.CreateSelectBox("Funktion", "person-funct", query, { "sonder": "Sonder", "fueh": "Führung" }) + "<br>" +
      this.CreateSelectBox("Rang", "person-rang", query, { "trupp": "Trupp", "grupp": "Gruppe", "zug": "Zug" }) + "<br>" +
      "Text: <input onchange='NamesEditor.ChangeLinkPreview(\"person-text\", this.value, false);' value='" + (Object.prototype.hasOwnProperty.call(query, "person-text") ? query["person-text"] : "") + "'><br>" +
      this.CreateSelectBox("Typ", "person-typ[]", query, { "loesch": "Brandbekämpfung/Löscheinsatz", "sani": "Rettungswesen, Sanitätswesen, Gesundheitswesen", "betreu": "Betreuung" }, true) + "<br>" +
      "</div>" +
      "</div>" +
      "<div class='save'><button onclick='NamesEditor.SaveIconEditor(\"" + el.id + "\"); '>Schließen</botton></div>" +
      "</div>";
    document.getElementsByTagName("body")[0].appendChild(ie);
  },
  JoinObjectIntoQuery: function (queryobj) {
    var query = new Array();
    for (var id in queryobj) {
      if (Array.isArray(queryobj[id])) {
        for (var i in queryobj[id]) {
          query.push(id + "=" + encodeURIComponent(queryobj[id][i]));
        }
      } else {
        query.push(id + "=" + encodeURIComponent(queryobj[id]));
      }
    }
    return query.join("&");
  },
  ParseIcon: function (markerobj) {
    var url = "../api/svg/person.svg";
    if (Object.prototype.hasOwnProperty.call(markerobj, "person")) {
      url += "?icon=person";
      if (Object.prototype.hasOwnProperty.call(markerobj["person"], "org")) {
        url += "&person-org=" + markerobj["person"]["org"];
      }
      if (Object.prototype.hasOwnProperty.call(markerobj["person"], "funct")) {
        url += "&person-funct=" + markerobj["person"]["funct"];
      }
      if (Object.prototype.hasOwnProperty.call(markerobj["person"], "rang")) {
        url += "&person-rang=" + markerobj["person"]["rang"];
      }
      if (Object.prototype.hasOwnProperty.call(markerobj["person"], "text")) {
        url += "&person-text=" + markerobj["person"]["text"];
      }
      if (Object.prototype.hasOwnProperty.call(markerobj["person"], "typ") && Array.isArray(markerobj["person"]["typ"])) {
        for (i in markerobj["person"]["typ"]) {
          url += "&person-typ[]=" + markerobj["person"]["typ"][i];
        }
      }
    }
    return "<object data='" + url + "' type='image/svg+xml' style='height:57px; width:50px;'></object>";
  },
  ParseJson: function (namesconfig) {
    document.getElementById("content").innerHTML = "";
    var html = "<div id='nameeditor'><div class='title'>Namenseinträge in den Einstellungen</div>";
    html += "<table id='nametable' class='settingstable'>";
    html += "<thead><tr><th width='60'>ID</th><th width='250'>Name</th><th width='65'>Icon</th><th width='150'>Filter Gruppe</th><th width='50'></th></tr></thead>";
    html += "<tbody>";
    for (var id in namesconfig) {
      if (Object.prototype.hasOwnProperty.call(namesconfig, id)) {
        var nameentry = namesconfig[id];
        html += "<tr>" +
          "<td>" + id + "</td>" +
          "<td>" + nameentry["name"] + "</td>";
        if (Object.prototype.hasOwnProperty.call(nameentry, "marker.svg")) {
          html += "<td>" + this.ParseIcon(nameentry["marker.svg"]) + "</td>";
        } else if (Object.prototype.hasOwnProperty.call(nameentry, "icon")) {
          html += "<td><img src='" + nameentry["icon"] + "'></td>";
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
    savenames.open("PUT", "/admin/api/json/name", true);
    savenames.send(JSON.stringify(namejson));
  },
  SaveIconEditor: function (id) {
    var cell = document.getElementById(id);
    cell.innerHTML = "<img src='../icons/general/icon_edit.png' onclick='NamesEditor.IconEditor(this.parentNode)' class='pointer'> <object data='" + document.getElementById("markerprev").data + "' type='image/svg+xml' style='height:57px; width:50px;'></object>";
    cell.removeAttribute("id");
    document.getElementById("iconeditor").remove();
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
      el.innerHTML += "<td><object data='" + url + "' type='image/svg+xml' style='height:57px; width:50px;'></object></td>";
    }
    el.innerHTML += "<td rel='" + gfilter + "'>" + this.filterGropus[gfilter] + "</td>";
    el.innerHTML += "<td><img src='../icons/general/edit.png' onclick='NamesEditor.Edit(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='NamesEditor.Delete(this.parentNode.parentNode)' class='pointer'></td>";
  },
  SplitQueryIntoObject: function (query) {
    if (query.indexOf("?") !== -1) {
      query = query.split("?")[1];
    }
    var queryobj = {};
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split("=");
      if (Object.prototype.hasOwnProperty.call(queryobj, decodeURIComponent(pair[0]))) {
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
  SplitUrlIntoParts: function (url) {
    var parts = url.split("?");
    return { "file": parts[0], "query": parts[1] || "" };
  }
};