function menu_names() {
  var parsenames = new XMLHttpRequest();
  parsenames.onreadystatechange = function() {
    if(parsenames.readyState === 4 && parsenames.status === 200) {
      NamesEditor.ParseJson(parsenames.responseText);
    }
  };
  parsenames.open("GET", "http://{%REQUEST_URL_HOST%}:8080/admin/get_json_names", true);
  parsenames.send();
}

function menu_overlay() {

}

function menu_export() {

}

function menu_import() {

}

var NamesEditor = {
  ParseJson: function (jsontext) {
    document.getElementById("content").innerHTML = "";
    var namesconfig = JSON.parse(jsontext);
    var html = "<div id='nameeditor'><div class='title'>Namenseinträge in den Einstellungen</div>";
    html += "<table id='nametable'>";
    html += "<thead><tr><th class='rowid'>ID</th><th class='rowname'>Name</th><th class='rowicon'>Icon</th><th class='rowedit'></th></tr></thead>";
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
          html += "<td>kein Icon</td>";
        }
        html += "<td><img src='../icons/general/edit.png' onclick='NamesEditor.Edit(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='NamesEditor.Delete(this.parentNode.parentNode)' class='pointer'></td>" +
          "</tr>";
      }
    }
    html += "<tfoot><tr><td></td><td></td><td></td><td><img src='../icons/general/add.png' onclick='NamesEditor.Add()' class='pointer'> <img src='../icons/general/save.png' onclick='NamesEditor.Save()' class='pointer'></td></tr></tfoot>";
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
    }
    return "<object data='"+url+"' type='image/svg+xml' style='height:50px; width:50px;'></object>";
  },
  Add: function () {
    var newrow = document.createElement("tr");
    newrow.innerHTML = "<td><input class='name'/></td>";
    newrow.innerHTML += "<td><input /></td>";
    newrow.innerHTML += "<td><img src='../icons/general/icon_edit.png' onclick='NamesEditor.IconEditor(this.parentNode)' class='pointer'> wähle Icon</td>";
    newrow.innerHTML += "<td><img src='../icons/general/save.png' onclick='NamesEditor.SaveRow(this.parentNode.parentNode)' class='pointer'> <img src='../icons/general/remove.png' onclick='NamesEditor.Abort(this.parentNode.parentNode)' class='pointer'></td>";
    document.getElementById("nametable").children[1].appendChild(newrow);
  },
  Save: function () {
    alert("Save");
  },
  Delete: function (el) {
    var name = el.firstChild.innerHTML;
    var answ = window.prompt("Wollen sie den Eintrag für \"" + name + "\" wirklich löschen?", "");
    if (answ !== null) {
      el.parentNode.removeChild(el);
    }
  },
  Edit: function (el) {
    alert("Edit " + el);
  },
  Abort: function (el) {
    el.parentNode.removeChild(el);
  },
  SaveRow: function (el) {
    var id = el.children[0].children[0].value;
    var name = el.children[1].children[0].value;
    alert("Save Row: id: " + id + " name: " + name);
  },
  IconEditor: function (el) {
    var url = "../icons/marker/Marker.svg?marker-bg=hidden";
    if (el.children.length == 2) {

    }
    var ie = document.createElement("div");
    ie.id = "iconeditor";
    ie.innerHTML = "<div class='innerbox'>" +
      "<div class='preview'><object id='markerprev' data='" + url + "' type='image/svg+xml' style='height:200px; width:200px;'></object></div>" +
      "<div class='controls'>" +
      "Typ: <select onchange='NamesEditor.ChangeLinkPreview(\"icon\",this.value);'><option>---</option><option value='person'>Person</option></select><br>"+
      "</div>" +
      "<div class='save'><button onclick='document.getElementById(\"iconeditor\").remove()'>Schließen</botton></div>"+
      "</div>";
    document.getElementsByTagName("body")[0].appendChild(ie);
  },
  ChangeLinkPreview: function (key, val) {
    var cur = document.getElementById("markerprev").data;
    alert(cur+" "+key+" "+val);
  }
};