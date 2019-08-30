﻿using System.Resources;
using System.Reflection;
using System.Runtime.InteropServices;

// Allgemeine Informationen über eine Assembly werden über die folgenden
// Attribute gesteuert. Ändern Sie diese Attributwerte, um die Informationen zu ändern,
// die einer Assembly zugeordnet sind.
[assembly: AssemblyTitle("Lora-Map")]
[assembly: AssemblyDescription("Displays Items with Coordinates from Mqtt on a Map")]
[assembly: AssemblyConfiguration("")]
[assembly: AssemblyCompany("Fraunhofer FIT")]
[assembly: AssemblyProduct("Lora-Map")]
[assembly: AssemblyCopyright("Copyright ©  2018 - 30.08.2019")]
[assembly: AssemblyTrademark("Fraunhofer FIT, BlubbFish")]
[assembly: AssemblyCulture("")]
[assembly: NeutralResourcesLanguage("de-DE")]

// Durch Festlegen von ComVisible auf FALSE werden die Typen in dieser Assembly
// für COM-Komponenten unsichtbar.  Wenn Sie auf einen Typ in dieser Assembly von
// COM aus zugreifen müssen, sollten Sie das ComVisible-Attribut für diesen Typ auf "True" festlegen.
[assembly: ComVisible(false)]

// Die folgende GUID bestimmt die ID der Typbibliothek, wenn dieses Projekt für COM verfügbar gemacht wird
[assembly: Guid("95d6f48a-9488-42a6-a973-941b45b26db8")]

// Versionsinformationen für eine Assembly bestehen aus den folgenden vier Werten:
//
//      Hauptversion
//      Nebenversion
//      Buildnummer
//      Revision
//
// Sie können alle Werte angeben oder Standardwerte für die Build- und Revisionsnummern verwenden,
// übernehmen, indem Sie "*" eingeben:
// [assembly: AssemblyVersion("1.0.*")]
[assembly: AssemblyVersion("1.2.9")]
[assembly: AssemblyFileVersion("1.2.9")]

/*
* 1.1.1 Add Debian package config
* 1.1.2 #2 Show versions number in Site
* 1.1.3 #1 Click on icon and show details
* 1.1.4 #3 Create icons for devices
* 1.1.5 Add support for alert button
* 1.1.6 #5 Create admin area
* 1.1.7 #8 Editor for Names
* 1.2.0 #4 Possible to Ex and Import Setting
* 1.2.1 #6 Load the map from the Device
* 1.2.2 Bugfix, if only recieve panic packet with gps data, update the marker on the map also
* 1.2.3 #9 display polygons and marker on the map
* 1.2.4 Can draw Textmarkers on the Map, use MGRS (UTM) on the Map
* 1.2.5 #10 text Letzer Datenempfang is too long when scrollbar is there and #11 set textsize for every zoomlevel
* 1.2.6 New Types of marker for person
* 1.2.7 Reorganise a lot of things, add Support for Cameradata
* 1.2.8 Improving the UI
* 1.2.9 The PüMa Release
*/
