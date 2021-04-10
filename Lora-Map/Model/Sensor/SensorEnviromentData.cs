using System;
using System.Globalization;

using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Sensor {
  public class SensorEnviromentData {
    public String Name { get; private set; }
    public Double Rssi { get; private set; }
    public Double Snr { get; private set; }
    public Double Temperature { get; private set; }
    public Double Humidity { get; private set; }
    public Double Windspeed { get; private set; }
    public DateTime Lorarecievedtime { get; private set; }

    public SensorEnviromentData(JsonData json) => this.Update(json);

    public void Update(JsonData json) {
      this.Name = GetId(json);
      this.Rssi = json["Rssi"].IsInt ? (Int32)json["Rssi"] : (Double)json["Rssi"];
      this.Snr = json["Snr"].IsInt ? (Int32)json["Snr"] : (Double)json["Snr"];
      this.Temperature = json["Temperature"].IsInt ? (Int32)json["Temperature"] : (Double)json["Temperature"];
      this.Humidity = json["Humidity"].IsInt ? (Int32)json["Humidity"] : (Double)json["Humidity"];
      this.Windspeed = json["Windspeed"].IsInt ? (Int32)json["Windspeed"] : (Double)json["Windspeed"];
      if(DateTime.TryParse((String)json["Receivedtime"], DateTimeFormatInfo.InvariantInfo, DateTimeStyles.AssumeUniversal, out DateTime updatetime)) {
        this.Lorarecievedtime = updatetime.ToUniversalTime();
      }
    }

    public static Boolean CheckJson(JsonData json) => 
      json.ContainsKey("Name") && json["Name"].IsString &&
      json.ContainsKey("Rssi") && (json["Rssi"].IsDouble || json["Rssi"].IsInt) &&
      json.ContainsKey("Snr") && (json["Snr"].IsDouble || json["Snr"].IsInt) &&
      json.ContainsKey("Temperature") && (json["Temperature"].IsDouble || json["Temperature"].IsInt) &&
      json.ContainsKey("Humidity") && (json["Humidity"].IsDouble || json["Humidity"].IsInt) &&
      json.ContainsKey("Windspeed") && (json["Windspeed"].IsDouble || json["Windspeed"].IsInt) &&
      json.ContainsKey("Receivedtime") && json["Receivedtime"].IsString;

    public static String GetId(JsonData json) => (String)json["Name"];
  }
}
