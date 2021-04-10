using LitJson;
using System;
using System.Globalization;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Camera {
  public class CameraFights {
    public CameraFights(JsonData json) => this.Update(json);

    public DateTime LastUpdate { get; private set; }
    public DateTime TimeStamp { get; private set; }
    public String Situation { get; private set; }
    public Double FightProbability { get; private set; }

    public static Boolean CheckJsonFightingDetection(JsonData json) => json.ContainsKey("camera_ids") && json["camera_ids"].IsArray && json["camera_ids"].Count == 1 &&
      json.ContainsKey("confidence") && json["confidence"].IsString &&
      json.ContainsKey("type_module") && json["type_module"].IsString && json["type_module"].ToString() == "fighting_detection" &&
      json.ContainsKey("situation") && json["situation"].IsString &&
      json.ContainsKey("timestamp") && json["timestamp"].IsString;

    public static String GetId(JsonData json) => (String)json["camera_ids"][0];

    public void Update(JsonData json) {
      if (CheckJsonFightingDetection(json)) {
        if (Double.TryParse((String)json["confidence"], NumberStyles.Float, CultureInfo.InvariantCulture, out Double cofidence)) {
          this.FightProbability = cofidence;
        }
        this.Situation = (String)json["situation"];
        if (DateTime.TryParse((String)json["timestamp"], DateTimeFormatInfo.InvariantInfo, DateTimeStyles.AssumeUniversal, out DateTime updatetime)) {
          this.TimeStamp = updatetime.ToUniversalTime();
        }
        this.LastUpdate = DateTime.UtcNow;
      }
    }
  }
}
