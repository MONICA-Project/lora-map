using System;
using System.Globalization;
using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model {
  class Panicclient {
    public Double Rssi { get; private set; }
    public Double Snr { get; private set; }
    public DateTime Upatedtime { get; private set; }
    public Double Latitude { get; private set; }
    public Double Longitude { get; private set; }
    public Double Hdop { get; private set; }
    public Boolean Fix { get; private set; }
    public Double Height { get; private set; }
    public DateTime Triggerdtime { get; private set; }

    public Panicclient(JsonData json) => this.Update(json);

    public void Update(JsonData json) {
      this.Triggerdtime = DateTime.Now;
      this.Rssi = (Double)json["Rssi"];
      this.Snr = (Double)json["Snr"];
      if(DateTime.TryParse((String)json["Receivedtime"], DateTimeFormatInfo.InvariantInfo, DateTimeStyles.AssumeUniversal, out DateTime updatetime)) {
        this.Upatedtime = updatetime;
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

    public static String GetId(JsonData json) => (String)json["Name"];

    public static Boolean CheckJson(JsonData json) => json.ContainsKey("Rssi") && json["Rssi"].IsDouble
      && json.ContainsKey("Snr") && json["Snr"].IsDouble
      && json.ContainsKey("Receivedtime") && json["Receivedtime"].IsString
      && json.ContainsKey("Gps") && json["Gps"].IsObject
      && json["Gps"].ContainsKey("Latitude") && json["Gps"]["Latitude"].IsDouble
      && json["Gps"].ContainsKey("Longitude") && json["Gps"]["Longitude"].IsDouble
      && json["Gps"].ContainsKey("LastLatitude") && json["Gps"]["LastLatitude"].IsDouble
      && json["Gps"].ContainsKey("LastLongitude") && json["Gps"]["LastLongitude"].IsDouble
      && json["Gps"].ContainsKey("Hdop") && json["Gps"]["Hdop"].IsDouble
      && json["Gps"].ContainsKey("Fix") && json["Gps"]["Fix"].IsBoolean
      && json["Gps"].ContainsKey("Height") && json["Gps"]["Height"].IsDouble
      && json.ContainsKey("Name") && json["Name"].IsString;
  }
}