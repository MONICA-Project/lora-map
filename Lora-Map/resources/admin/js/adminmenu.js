var AdminMenu = {
  //public functions
  ExImport: function () {
    var ajaxrequest = new XMLHttpRequest();
    ajaxrequest.onreadystatechange = function () {
      if (ajaxrequest.readyState === 4 && ajaxrequest.status === 200) {
        var json = JSON.parse(ajaxrequest.responseText);
        ExImport.ParseJson(json.name, json.geo, json.setting);
      }
    };
    ajaxrequest.open("GET", "/admin/api/json/name,geo,setting", true);
    ajaxrequest.send();
    return false;
  },
  Names: function () {
    var ajaxrequest = new XMLHttpRequest();
    ajaxrequest.onreadystatechange = function () {
      if (ajaxrequest.readyState === 4 && ajaxrequest.status === 200) {
        var json = JSON.parse(ajaxrequest.responseText);
        NamesEditor.ParseJson(json.name);
      }
    };
    ajaxrequest.open("GET", "/admin/api/json/name", true);
    ajaxrequest.send();
    return false;
  },
  Overlay: function () {
    return false;
  },
  Settings: function () {
    var ajaxrequest = new XMLHttpRequest();
    ajaxrequest.onreadystatechange = function () {
      if (ajaxrequest.readyState === 4 && ajaxrequest.status === 200) {
        var json = JSON.parse(ajaxrequest.responseText);
        Settings.ParseJson(json.setting);
      }
    };
    ajaxrequest.open("GET", "/admin/api/json/setting", true);
    ajaxrequest.send();
    return false;
  }
};