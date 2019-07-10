﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model {
  class AlarmItem {
    public Double Rssi { get; private set; }
    public Double Snr { get; private set; }
    public DateTime Lorarecievedtime { get; private set; }
    public DateTime Recievedtime { get; private set; }
    public Double Latitude { get; private set; }
    public Double Longitude { get; private set; }
    public UTMData UTM { get; private set; }
    public Double Hdop { get; private set; }
    public Boolean Fix { get; private set; }
    public Double Height { get; private set; }
    public List<DateTime> ButtonPressed => this.buttonhistory.Keys.ToList();

    private readonly SortedDictionary<DateTime, String> buttonhistory = new SortedDictionary<DateTime, String>();

    public AlarmItem(JsonData json) => this.Update(json);

    public void Update(JsonData json) {
      this.Rssi = (Double)json["Rssi"];
      this.Snr = (Double)json["Snr"];
      if(DateTime.TryParse((String)json["Receivedtime"], DateTimeFormatInfo.InvariantInfo, DateTimeStyles.AssumeUniversal, out DateTime updatetime)) {
        this.Lorarecievedtime = updatetime.ToUniversalTime();
      }
      this.Recievedtime = DateTime.UtcNow;
      this.Latitude = (Double)json["Gps"]["Latitude"];
      this.Longitude = (Double)json["Gps"]["Longitude"];
      this.Fix = (Boolean)json["Gps"]["Fix"];
      if(!this.Fix) {
        this.Latitude = (Double)json["Gps"]["LastLatitude"];
        this.Longitude = (Double)json["Gps"]["LastLongitude"];
      }
      this.UTM = new UTMData(this.Latitude, this.Longitude);
      this.Hdop = (Double)json["Gps"]["Hdop"];
      this.Height = (Double)json["Gps"]["Height"];
      this.SetHistory(json);
    }

    private void SetHistory(JsonData json) {
      String key = ((Double)json["BatteryLevel"]).ToString();
      key += "_" + ((Int32)json["Calculatedcrc"]).ToString();
      key += "_" + ((Double)json["Gps"]["Hdop"]).ToString();
      key += "_" + ((Double)json["Gps"]["Height"]).ToString();
      key += "_" + ((Boolean)json["Gps"]["Fix"]).ToString();
      key += "_" + ((Double)json["Gps"]["LastLatitude"]).ToString();
      key += "_" + ((Double)json["Gps"]["LastLongitude"]).ToString();
      key += "_" + ((String)json["Gps"]["Time"]);
      if(!this.buttonhistory.ContainsValue(key)) {
        this.buttonhistory.Add(DateTime.UtcNow, key);
        if(this.buttonhistory.Count > 10) {
          this.buttonhistory.Remove(this.buttonhistory.Keys.ToList().First());
        }
      }
    }

    public static String GetId(JsonData json) => (String)json["Name"];

    public static Boolean CheckJson(JsonData json) => 
      json.ContainsKey("Rssi") && json["Rssi"].IsDouble &&
      json.ContainsKey("Snr") && json["Snr"].IsDouble &&
      json.ContainsKey("Receivedtime") && json["Receivedtime"].IsString &&
      json.ContainsKey("Gps") && json["Gps"].IsObject &&
      json["Gps"].ContainsKey("Latitude") && json["Gps"]["Latitude"].IsDouble &&
      json["Gps"].ContainsKey("Longitude") && json["Gps"]["Longitude"].IsDouble &&
      json["Gps"].ContainsKey("LastLatitude") && json["Gps"]["LastLatitude"].IsDouble &&
      json["Gps"].ContainsKey("LastLongitude") && json["Gps"]["LastLongitude"].IsDouble &&
      json["Gps"].ContainsKey("Hdop") && json["Gps"]["Hdop"].IsDouble &&
      json["Gps"].ContainsKey("Fix") && json["Gps"]["Fix"].IsBoolean &&
      json["Gps"].ContainsKey("Height") && json["Gps"]["Height"].IsDouble &&
      json["Gps"].ContainsKey("Time") && json["Gps"]["Time"].IsString &&
      json.ContainsKey("Name") && json["Name"].IsString &&
      json.ContainsKey("Calculatedcrc") && json["Calculatedcrc"].IsInt &&
      json.ContainsKey("BatteryLevel") && json["BatteryLevel"].IsDouble;
  }
}