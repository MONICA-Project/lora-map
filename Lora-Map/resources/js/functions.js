setInterval(timecorrectionrunner, 60000);
timecorrectionrunner();

function timecorrectionrunner() {
  var timecorrection = new XMLHttpRequest();
  timecorrection.onreadystatechange = parseAjaxTimecorrection;
  timecorrection.open("GET", "http://{%REQUEST_URL_HOST%}:8080/currenttime", true);
  timecorrection.send();
}

var timeOffset = 0;

function parseAjaxTimecorrection() {
  if (this.readyState === 4 && this.status === 200) {
    utcobject = JSON.parse(this.responseText);
    if (utcobject.hasOwnProperty("utc")) {
      timeOffset = Date.now() - Date.parse(utcobject["utc"]);
    }
  }
}

function timeCalculation(timestr, type) {
  if (type === "diffraw" || type === "difftext") {
    var diff = Math.round((Date.now() - Date.parse(timestr) - timeOffset) / 1000);
    if (type === "diffraw") {
      return diff;
    }
    if (diff < 60) {
      return diff + " s";
    }
    if (diff < 60 * 60) {
      return Math.floor(diff / 60) + " m";
    }
    if (diff < 60 * 60 * 24) {
      return Math.floor(diff / (60 * 60)) + " h";
    }
    return Math.floor(diff / (60 * 60 * 24)) + " d";
  } else if (type === "str") {
    var date = new Date(Date.parse(timestr) + timeOffset);
    var str = date.toLocaleString();
    return str;
  }
}