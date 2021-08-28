using System;
using System.Globalization;

using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.JsonObjects {
  public class LoraData {
    #region mandatory field
    public Double BatteryLevel {
      get;
    }
    public Boolean CorrectInterface {
      get;
    }
    public LoraDataGps Gps {
      get;
    }
    public String Hash {
      get;
    }
    public String Name {
      get;
    }
    #endregion

    #region optional field
    public DateTime Receivedtime {
      get;
    }
    public Double Rssi {
      get;
    }
    public Double Snr {
      get;
    }
    #endregion


    public static Boolean CheckJson(JsonData json) =>
      json.ContainsKey("BatteryLevel") && (json["BatteryLevel"].IsDouble || json["BatteryLevel"].IsInt)
      && json.ContainsKey("CorrectInterface") && json["CorrectInterface"].IsBoolean
      && json.ContainsKey("Gps") && json["Gps"].IsObject
      && LoraDataGps.CheckJson(json["Gps"])
      && json.ContainsKey("Hash") && json["Hash"].IsString
      && json.ContainsKey("Name") && json["Name"].IsString;

    public LoraData(JsonData json) {
      //mandatory field
      this.BatteryLevel = json["BatteryLevel"].IsInt ? (Int32)json["BatteryLevel"] : (Double)json["BatteryLevel"];
      this.CorrectInterface = (Boolean)json["CorrectInterface"];
      this.Gps = new LoraDataGps(json["Gps"]);
      this.Hash = (String)json["Hash"];
      this.Name = (String)json["Name"];
      //optional field
      this.Rssi = json.ContainsKey("Rssi") && (json["Rssi"].IsDouble || json["Rssi"].IsInt) ? json["Rssi"].IsInt ? (Int32)json["Rssi"] : (Double)json["Rssi"] : 0;
      this.Snr = json.ContainsKey("Snr") && (json["Snr"].IsDouble || json["Snr"].IsInt) ? json["Snr"].IsInt ? (Int32)json["Snr"] : (Double)json["Snr"] : 0;
      this.Receivedtime = json.ContainsKey("Receivedtime") && json["Receivedtime"].IsString && DateTime.TryParse((String)json["Receivedtime"], DateTimeFormatInfo.InvariantInfo, DateTimeStyles.AssumeUniversal, out DateTime updatetime) ? updatetime.ToUniversalTime() : DateTime.UtcNow;
    }
  }

  public class LoraDataGps {
    #region mandatory field
    public Double Latitude {
      get;
    }
    public Double Longitude {
      get;
    }
    public Boolean Fix {
      get;
    }
    public Double Height {
      get;
    }
    #endregion

    #region optional field
    public Double Hdop {
      get;
    }
    #endregion

    public static Boolean CheckJson(JsonData json) =>
      json.ContainsKey("Latitude") && (json["Latitude"].IsDouble || json["Latitude"].IsInt)
      && json.ContainsKey("Longitude") && (json["Longitude"].IsDouble || json["Longitude"].IsInt)
      && json.ContainsKey("Fix") && json["Fix"].IsBoolean
      && json.ContainsKey("Height") && (json["Height"].IsDouble || json["Height"].IsInt);

    public LoraDataGps(JsonData json) {
      //mandatory field
      this.Latitude = json["Latitude"].IsInt ? (Int32)json["Latitude"] : (Double)json["Latitude"];
      this.Longitude = json["Longitude"].IsInt ? (Int32)json["Longitude"] : (Double)json["Longitude"];
      this.Fix = (Boolean)json["Fix"];
      this.Height = json["Height"].IsInt ? (Int32)json["Height"] : (Double)json["Height"];
      //optional field
      this.Hdop = json.ContainsKey("Hdop") && (json["Hdop"].IsDouble || json["Hdop"].IsInt) ? json["Hdop"].IsInt ? (Int32)json["Hdop"] : (Double)json["Hdop"] : 0;
    }
  }
}
