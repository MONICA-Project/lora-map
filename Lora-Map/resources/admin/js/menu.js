function menu_names() {
  var parsenames = new XMLHttpRequest();
  parsenames.onreadystatechange = function() {
    if(parsenames.readyState === 4 && parsenames.status === 200) {
      NamesEditor.parseJson(parsenames.responseText);
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
  parseJson: function (jsontext) {
    document.getElementById("content").innerHTML = "";
    var namesconfig = JSON.parse(jsontext);
    var html = "<div>Einträge</div>";
    for (var id in namesconfig) {
      if (namesconfig.hasOwnProperty(id)) {
        var nameentry = namesconfig[id];
        html += "<div>" +
          "<span>" + id + "</span>" +
          "<span>"+nameentry["name"]+"</span>"+
          "</div>";
      }
    }
    document.getElementById("content").innerHTML = html;
  }
};