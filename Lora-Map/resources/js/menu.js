var visiblePanel = null;
function showHidePanel(name) {
  if (visiblePanel === null) {
    document.getElementById("pannels").style.display = "block";
    document.getElementById(name).style.display = "block";
    visiblePanel = name;
  } else if (visiblePanel === name) {
    document.getElementById("pannels").style.display = "none";
    visiblePanel = null;
  } else {
    document.getElementById(visiblePanel).style.display = "none";
    document.getElementById(name).style.display = "block";
    visiblePanel = name;
  }
}