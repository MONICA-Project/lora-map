using LitJson;
using System;
using System.Globalization;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Camera {
  public class CameraDensity {
    public Int32 DensityCount { get; private set; }
    public DateTime TimeStamp { get; private set; }
    public Double AverageFlowMagnitude { get; private set; }
    public Double AverageFlowDirection { get; private set; }
    public DateTime LastUpdate { get; private set; }

    public CameraDensity(JsonData json) => this.Update(json);

    public static Boolean CheckJsonCrowdDensityLocal(JsonData json) => json.ContainsKey("camera_ids") && json["camera_ids"].IsArray && json["camera_ids"].Count == 1 &&
      json.ContainsKey("density_map") && json["density_map"].IsArray &&
      json.ContainsKey("type_module") && json["type_module"].IsString && json["type_module"].ToString() == "crowd_density_local" &&
      json.ContainsKey("density_count") && json["density_count"].IsInt &&
      json.ContainsKey("timestamp_1") && json["timestamp_1"].IsString;

    public static Boolean CheckJsonFlow(JsonData json) => json.ContainsKey("camera_ids") && json["camera_ids"].IsArray && json["camera_ids"].Count == 1 &&
      json.ContainsKey("average_flow_magnitude") && json["average_flow_magnitude"].IsArray &&
      json.ContainsKey("type_module") && json["type_module"].IsString && json["type_module"].ToString() == "flow" &&
      json.ContainsKey("average_flow_direction") && json["average_flow_direction"].IsArray &&
      json.ContainsKey("timestamp") && json["timestamp"].IsString;

    public static String GetId(JsonData json) => (String)json["camera_ids"][0];

    public void Update(JsonData json) {
      if(CheckJsonCrowdDensityLocal(json)) {
        this.DensityCount = (Int32)json["density_count"];
        if (DateTime.TryParse((String)json["timestamp_1"], DateTimeFormatInfo.InvariantInfo, DateTimeStyles.AssumeUniversal, out DateTime updatetime)) {
          this.TimeStamp = updatetime.ToUniversalTime();
        }
      } else if(CheckJsonFlow(json)) {
        if (json["average_flow_magnitude"].Count == 1) {
          this.AverageFlowMagnitude = (Double)json["average_flow_magnitude"][0];
        }
        if (json["average_flow_direction"].Count == 1) {
          this.AverageFlowDirection = (Double)json["average_flow_direction"][0];
        }
        if (DateTime.TryParse((String)json["timestamp"], DateTimeFormatInfo.InvariantInfo, DateTimeStyles.AssumeUniversal, out DateTime updatetime)) {
          this.TimeStamp = updatetime.ToUniversalTime();
        }
      } 
      this.LastUpdate = DateTime.UtcNow;
    }
  }
}
