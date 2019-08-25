﻿using System;
using System.Globalization;
using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model {
  class PositionItem {
    public Double Rssi { get; private set; }
    public Double Snr { get; private set; }
    public DateTime Lorarecievedtime { get; private set; }
    public DateTime Recievedtime { get; private set; }
    public Double Latitude { get; private set; }
    public Double Longitude { get; private set; }
    public UTMData UTM { get; private set; }
    public Double Hdop { get; private set; }
    public DateTime Lastgpspostime { get; private set; }
    public Double Battery { get; private set; }
    public Int32 Batterysimple { get; private set; }
    public Boolean Fix { get; private set; }
    public Double Height { get; private set; }
    public String Name { get; private set; }
    public String Icon { get; private set; }
    public String Group { get; private set; }

    public PositionItem(JsonData json, JsonData marker) {
      this.Update(json);
      this.UpdateMarker(marker, GetId(json));
    }

    public void UpdateMarker(JsonData marker, String id) {
      if(marker.ContainsKey(id)) {
        this.Name = marker[id].ContainsKey("name") && marker[id]["name"].IsString ? (String)marker[id]["name"] : id;
        this.Icon = marker[id].ContainsKey("marker.svg") && marker[id]["marker.svg"].IsObject ? Marker.ParseMarkerConfig(marker[id]["marker.svg"], this.Name) : marker[id].ContainsKey("icon") && marker[id]["icon"].IsString ? (String)marker[id]["icon"] : null;
        this.Group = marker[id].ContainsKey("Group") && marker[id]["Group"].IsString ? (String)marker[id]["Group"] : "no";
      } else {
        this.Name = id;
        this.Icon = null;
      }
    }
    public static Boolean CheckJson(JsonData json) => json.ContainsKey("Rssi") && json["Rssi"].IsDouble
      && json.ContainsKey("Snr") && json["Snr"].IsDouble
      && json.ContainsKey("Receivedtime") && json["Receivedtime"].IsString
      && json.ContainsKey("BatteryLevel") && json["BatteryLevel"].IsDouble
      && json.ContainsKey("Gps") && json["Gps"].IsObject
      && json["Gps"].ContainsKey("Latitude") && json["Gps"]["Latitude"].IsDouble
      && json["Gps"].ContainsKey("Longitude") && json["Gps"]["Longitude"].IsDouble
      && json["Gps"].ContainsKey("LastLatitude") && json["Gps"]["LastLatitude"].IsDouble
      && json["Gps"].ContainsKey("LastLongitude") && json["Gps"]["LastLongitude"].IsDouble
      && json["Gps"].ContainsKey("LastGPSPos") && json["Gps"]["LastGPSPos"].IsString
      && json["Gps"].ContainsKey("Hdop") && json["Gps"]["Hdop"].IsDouble
      && json["Gps"].ContainsKey("Fix") && json["Gps"]["Fix"].IsBoolean
      && json["Gps"].ContainsKey("Height") && json["Gps"]["Height"].IsDouble
      && json.ContainsKey("Name") && json["Name"].IsString;

    public static String GetId(JsonData json) => (String)json["Name"];

    public void Update(JsonData json) {
      this.Rssi = (Double)json["Rssi"];
      this.Snr = (Double)json["Snr"];
      if(DateTime.TryParse((String)json["Receivedtime"], DateTimeFormatInfo.InvariantInfo, DateTimeStyles.AssumeUniversal, out DateTime updatetime)) {
        this.Lorarecievedtime = updatetime.ToUniversalTime();
      }
      this.Recievedtime = DateTime.UtcNow;
      this.Battery = Math.Round((Double)json["BatteryLevel"], 2);
      this.Batterysimple = this.Battery < 3.44 ? 0 : this.Battery < 3.53 ? 1 : this.Battery < 3.6525 ? 2 : this.Battery < 3.8825 ? 3 : 4;
      this.Latitude = (Double)json["Gps"]["Latitude"];
      this.Longitude = (Double)json["Gps"]["Longitude"];
      this.Fix = (Boolean)json["Gps"]["Fix"];
      if(!this.Fix) {
        this.Latitude = (Double)json["Gps"]["LastLatitude"];
        this.Longitude = (Double)json["Gps"]["LastLongitude"];
      }
      this.UTM = new UTMData(this.Latitude, this.Longitude);
      if(DateTime.TryParse((String)json["Gps"]["LastGPSPos"], DateTimeFormatInfo.InvariantInfo, DateTimeStyles.AssumeUniversal, out DateTime lastgpstime)) {
        this.Lastgpspostime = lastgpstime.ToUniversalTime();
      }
      this.Hdop = (Double)json["Gps"]["Hdop"];
      this.Height = (Double)json["Gps"]["Height"];
    }

    
  }
}
