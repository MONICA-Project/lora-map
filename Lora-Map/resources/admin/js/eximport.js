var ExImport = {
  //public functions
  ParseJson: function (jsonnames, jsongeo, jsonsettings) {
    html = "<div id='eximport'><div class='title'>Ex- und Import der Einstellungen</div>";
    html += "<div class='names'>names.json (Namen und Icons)<br/><textarea id='ex_names'></textarea> <img src='../icons/general/save.png' onclick='ExImport.SaveNames()' class='pointer'></div>";
    html += "<div class='names'>geo.json (Layer on the MAP) <a href='https://mapbox.github.io/togeojson/'>Kml Konverter</a><br/><textarea id='ex_geo'></textarea> <img src='../icons/general/save.png' onclick='ExImport.SaveGeo()' class='pointer'></div>";
    html += "<div class='names'>settings.json (Settings of the Map)<br/><textarea id='ex_settings'></textarea> <img src='../icons/general/save.png' onclick='ExImport.SaveSettings()' class='pointer'></div>";
    html += "</div>";
    document.getElementById("content").innerHTML = html;
    document.getElementById("ex_names").value = JSON.stringify(jsonnames);
    document.getElementById("ex_geo").value = JSON.stringify(jsongeo);
    document.getElementById("ex_settings").value = JSON.stringify(jsonsettings);
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
    savenames.open("PUT", "/admin/api/json/name", true);
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
    savegeo.open("PUT", "/admin/api/json/geo", true);
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
    savesettings.open("PUT", "/admin/api/json/setting", true);
    savesettings.send(document.getElementById("ex_settings").value);
  }
};