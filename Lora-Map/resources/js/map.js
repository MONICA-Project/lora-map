var mymap = L.map('bigmap').setView(["{%START_LOCATION%}"], 14);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

mymap.on("click", hidePanel);

function hidePanel(e) {
  showHidePanel(null);
}