using LitJson;
using System;
using System.Globalization;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Camera {
  public class CameraCounter {
    public DateTime Lastcameradata { get; private set; }
    public String Name { get; private set; }
    public Int32 Total { get; private set; }
    public Int32 Incoming { get; private set; }
    public Int32 Outgoing { get; private set; }

    public CameraCounter(JsonData json) => this.Update(json);

    internal static String GetId(JsonData json) => (String)json["camera_id"];

    internal static Boolean CheckJson(JsonData json) => json.ContainsKey("camera_id") && json["camera_id"].IsString
      && json.ContainsKey("count") && json["count"].IsString
      && json.ContainsKey("name") && json["name"].IsString
      && json.ContainsKey("timestamp") && json["timestamp"].IsString;

    internal void Update(JsonData json)
    {
      if(Int32.TryParse((String)json["count"], out Int32 count)) {
        if((String)json["name"] == "total") {
          this.Total = count;
        } else if((String)json["name"] == "incoming") {
          this.Incoming = count;
        } else if((String)json["name"] == "outgoing") {
          this.Outgoing = count * -1;
        }
      }
      if (DateTime.TryParse((String)json["timestamp"], DateTimeFormatInfo.InvariantInfo, DateTimeStyles.AssumeUniversal, out DateTime updatetime)) {
        this.Lastcameradata = updatetime.ToUniversalTime();
      }
      this.Name = (String)json["name"];
    }
  }
}
