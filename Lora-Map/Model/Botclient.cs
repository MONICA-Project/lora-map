using System;
using System.Globalization;
using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model {
  class Botclient {
    public Double Rssi { get; private set; }
    public Double Snr { get; private set; }
    public DateTime Upatedtime { get; private set; }
    public Double Latitude { get; private set; }
    public Double Longitude { get; private set; }
    public Double Hdop { get; private set; }
    public Double Battery { get; private set; }
    public Int32 Batterysimple { get; private set; }
    public Boolean Fix { get; private set; }
    public Double Height { get; private set; }
    public String Name { get; private set; }
    public String Icon { get; private set; }

    public Botclient(JsonData json, JsonData marker) {
      this.Update(json);
      String id = GetId(json);
      if(marker.ContainsKey(id)) {
        if(marker[id].ContainsKey("name") && marker[id]["name"].IsString) {
          this.Name = (String)marker[id]["name"];
        } else {
          this.Name = id;
        }
        if(marker[id].ContainsKey("marker.svg") && marker[id]["marker.svg"].IsObject) {
          this.Icon = Marker.ParseMarkerConfig(marker[id]["marker.svg"], this.Name);
        } else if(marker[id].ContainsKey("icon") && marker[id]["icon"].IsString) {
          this.Icon = (String)marker[id]["icon"];
        } else {
          this.Icon = null;
        }
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
      && json["Gps"].ContainsKey("Hdop") && json["Gps"]["Hdop"].IsDouble
      && json["Gps"].ContainsKey("Fix") && json["Gps"]["Fix"].IsBoolean
      && json["Gps"].ContainsKey("Height") && json["Gps"]["Height"].IsDouble
      && json.ContainsKey("Name") && json["Name"].IsString;

    public static String GetId(JsonData json) => (String)json["Name"];
    public void Update(JsonData json) {
      this.Rssi = (Double)json["Rssi"];
      this.Snr = (Double)json["Snr"];
      if(DateTime.TryParse((String)json["Receivedtime"], DateTimeFormatInfo.InvariantInfo, DateTimeStyles.AssumeUniversal, out DateTime updatetime)) {
        this.Upatedtime = updatetime;
      }
      this.Battery = Math.Round((Double)json["BatteryLevel"], 2);
      if(this.Battery < 3) {
        this.Batterysimple = 0;
      } else if(this.Battery < 3.2) {
        this.Batterysimple = 1;
      } else if(this.Battery < 3.5) {
        this.Batterysimple = 2;
      } else if(this.Battery < 3.8) {
        this.Batterysimple = 3;
      } else {
        this.Batterysimple = 4;
      }
      this.Latitude = (Double)json["Gps"]["Latitude"];
      this.Longitude = (Double)json["Gps"]["Longitude"];
      this.Fix = (Boolean)json["Gps"]["Fix"];
      if(!this.Fix) {
        this.Latitude = (Double)json["Gps"]["LastLatitude"];
        this.Longitude = (Double)json["Gps"]["LastLongitude"];
      }
      this.Hdop = (Double)json["Gps"]["Hdop"];
      this.Height = (Double)json["Gps"]["Height"];
    }

    
  }
}
