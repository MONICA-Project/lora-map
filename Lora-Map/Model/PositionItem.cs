using System;
using System.Globalization;
using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model {
  public class PositionItem {
    private Double _lastLat = 0;
    private Double _lastLon = 0;

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
      if(marker != null && marker.ContainsKey(id)) {
        this.Name = marker[id].ContainsKey("name") && marker[id]["name"].IsString ? (String)marker[id]["name"] : id;
        this.Icon = marker[id].ContainsKey("marker.svg") && marker[id]["marker.svg"].IsObject ? Marker.ParseMarkerConfig(marker[id]["marker.svg"], this.Name) : marker[id].ContainsKey("icon") && marker[id]["icon"].IsString ? (String)marker[id]["icon"] : null;
        this.Group = marker[id].ContainsKey("Group") && marker[id]["Group"].IsString ? (String)marker[id]["Group"] : "no";
      } else {
        this.Name = id;
        this.Icon = null;
        this.Group = null;
      }
    }
    public static Boolean CheckJson(JsonData json) => 
      json.ContainsKey("BatteryLevel") && (json["BatteryLevel"].IsDouble || json["BatteryLevel"].IsInt)
      && json.ContainsKey("Gps") && json["Gps"].IsObject
      && json["Gps"].ContainsKey("Latitude") && (json["Gps"]["Latitude"].IsDouble || json["Gps"]["Latitude"].IsInt)
      && json["Gps"].ContainsKey("Longitude") && (json["Gps"]["Longitude"].IsDouble || json["Gps"]["Longitude"].IsInt)
      && json["Gps"].ContainsKey("Fix") && json["Gps"]["Fix"].IsBoolean
      && json["Gps"].ContainsKey("Height") && (json["Gps"]["Height"].IsDouble || json["Gps"]["Height"].IsInt)
      && json.ContainsKey("Name") && json["Name"].IsString;

    public static String GetId(JsonData json) => (String)json["Name"];

    public virtual void Update(JsonData json) {
      this.Rssi = json.ContainsKey("Rssi") && (json["Rssi"].IsDouble || json["Rssi"].IsInt) && Double.TryParse(json["Rssi"].ToString(), out Double rssi) ? rssi : 0;
      this.Snr = json.ContainsKey("Snr") && (json["Snr"].IsDouble || json["Snr"].IsInt) && Double.TryParse(json["Snr"].ToString(), out Double snr) ? snr : 0;
      this.Lorarecievedtime = json.ContainsKey("Receivedtime") && json["Receivedtime"].IsString && DateTime.TryParse((String)json["Receivedtime"], DateTimeFormatInfo.InvariantInfo, DateTimeStyles.AssumeUniversal, out DateTime updatetime) ? updatetime.ToUniversalTime() : DateTime.UtcNow;
      this.Recievedtime = DateTime.UtcNow;
      this.Battery = Math.Round(json["BatteryLevel"].IsInt ? (Int32)json["BatteryLevel"] : (Double)json["BatteryLevel"], 2);
      this.Batterysimple = this.Battery < 3.44 ? 0 : this.Battery < 3.53 ? 1 : this.Battery < 3.6525 ? 2 : this.Battery < 3.8825 ? 3 : 4;

      this.Latitude = json["Gps"]["Latitude"].IsInt ? (Int32)json["Gps"]["Latitude"] : (Double)json["Gps"]["Latitude"];
      this.Longitude = json["Gps"]["Longitude"].IsInt ? (Int32)json["Gps"]["Longitude"] : (Double)json["Gps"]["Longitude"];
      this.Fix = (Boolean)json["Gps"]["Fix"];
      this.Height = json["Gps"]["Height"].IsInt ? (Int32)json["Gps"]["Height"] : (Double)json["Gps"]["Height"];
      this.Hdop = json["Gps"].ContainsKey("Hdop") && (json["Gps"]["Hdop"].IsDouble || json["Gps"]["Hdop"].IsInt) && Double.TryParse(json["Gps"]["Hdop"].ToString(), out Double hdop) ? hdop : 0;

      if(!this.Fix) {
        this.Latitude = this._lastLat;
        this.Longitude = this._lastLon;
      } else {
        this._lastLat = this.Latitude;
        this._lastLon = this.Longitude;
        this.Lastgpspostime = DateTime.UtcNow;
      }
      this.UTM = new UTMData(this.Latitude, this.Longitude);      
    }

    
  }
}
