# Changelogs

## 1.3.1 - Laufwege Visualisieren
### New Features
* Add posibility to make the past of a marker visible
* Validating the input of Json, against defined models and only parse them if the match
* Remove dublicated packets and if a correct one gets in replace the metadata of position
### Bugfixes
* If the settings are changed while collecting weather, ignore the exception
* Fixing encoding problems in SVG
* Fixing overlay with icon editor to be on the correct place at the screen
* Coreccting the imagesize in the admin menu for SVG
* Fixing a bug when open the nameseditor directly after start that images are not created
### Changes
* Refactoring
* Change the SVG link to the correct array behavour
* Used the new methods of AWebserverDataBackend

## 1.3.0 - New Gateway
### New Features
* Implement Lora-Gateway-Data 1.1.0 Format
### Bugfixes
### Changes
* Refactoring
* Make requests.conf not needed anymore.

## 1.2.10
### New Features
* Posibility to display sensor data on map
### Bugfixes
* Parse also all Doublevalues as Int
### Changes
* Change Online Map MaxZoom to 19
* Searchfunction case insensitive
* Show Numbers from a Place not with linebreaking
* Numbers on places are not clickable, also as the grid
* Search in Description of Polygons
* Change Sani to Rettungsdienst
* Display GateCounting Boxes in a line not a collumn
* Create Aliases for Camera Count
* Filter Fight under level
* Refactoring
* Porting to .NET Core

## 1.2.9
### New Features
* Add setting model to code
* #19 grid automatisch generieren
* #24 Add information about weather/warning
* #28 Fightdedection Plygon on Map
* #27 Draw Camera-Desity bock on map
* #16 filter nach kategorien/tracker einbauen
* #15 suche nach ständen einbauen
### Bugfixes
* Add Correct Dispose Handling
* TimeCalculation now handle negative values correct
### Changes
* Refactoring of all JS
* Make only one request per second instead of four per AJAX
* Refactoring adminpannel and add settings.json
* New function in TimeCalculation, so you can not have negative Timespans

## 1.2.8
### New Features
* Implement #12 Make icon transparent if there is no data update
* Implement #18 history an panikbutton pressed
### Bugfixes
* Implement #13 fixing issue with port when using proxy
* Implement #14 show description on map in tooltip on area
* Implement #25 Icons flickering when using ssl
* Add some errorhandling with locks
### Changes
* Move CoordinateSharp to own Library
* Changes to new Mqtt topic for camera density

## 1.2.7
### New Features
* Add support to display camera values that counts people. needs to be on a mqtt toipc camera/counting
* Display Crowd-Density Data on Map
### Bugfixes
* Rename Adminmodel.cs to AdminModel.cs, cause it sould be Uppercase!
* Fix a Parsing Bug in Lora-Map/Model/PositionItem.cs
### Changes
* Move the Dockerfile to the parent project Repository

## 1.2.6
### New Features
* New types of marker for a person, so you can add drawing inside

## 1.2.5
### New Features
* Implement #10 text Letzer Datenempfang is too long when scrollbar is there
### Bugfixes
* Implement #11 set textsize for every zoomlevel
### Changes
* Add an link to kml to geojson converter

## 1.2.4
### New Features
* Possible to draw textmarkers on map (eg. for static text in a polygon)
* Now using MGRS as default output

## 1.2.3
### New Features
* Implement #9 display polygons and marker on the map
### Bugfixes
* change the wort get to post
### Changes
* Default zoomlevel is now 16

## 1.2.2
### Bugfixes
* When only recieve a panic packet with gps data, update also the normal location on the map

## 1.2.1
### New Features
* Implement #6 Load the map from the Device
### Bugfixes
* Show now output 200 of images from Webserver
### Changes
* Now layers.png is also exported

## 1.2.0
### New Features
* Implement #4 Possible to Ex and Import Settings
### Bugfixes
* Move username and password to configfile
### Changes
* Verifiy names.json when sending
* Add logger to Programm

## 1.1.7
### New Features
* Implement #8 Editor for Names and Icons
### Bugfixes
* Fixing missing dependencys of Mono.System.Web in deb packet
* Fixing a Bug when map is not running on port 8080
### Changes
* New Batterylevels
* Change textcolors in Marker.svg

## 1.1.6
### New Features
* new Levels for Battery, so that is ~ 1/5 of time for each Icon
* #5 Create adminpannel

## 1.1.5
### New Features
* Shows a red border on the marker on the map, when the panicbutton is pressed
* Icons are now created by a script from the SVG directly, so all big marker icons are SVGs
* Icons are also now shown in the marker list
* Using Leaflet 1.4.0 now
* Menu with new markers
### Bugfixes
* Times are now complete in UTC internaly and will calculated in the browser to local time.
### Changes
* requests.conf must now have a section `js/map.js` instead of `js/nav.js`
* names.json format has changed

## 1.1.4
### New Features
* Implement #3 Create icons for devices

## 1.1.3
### New Features
* Implement #1 Click on icon and show details

## 1.1.2
### New Features
* Implement #2 Show versions number in Site

## 1.1.1
### New Features
* Add Debian package config

## 1.1.0.0
### New Features
* Change to new JSON format, and make it usable for more than one listener

## 1.0.0.0
### New Features
* First Version, only used as a testoutput for debugging tracker