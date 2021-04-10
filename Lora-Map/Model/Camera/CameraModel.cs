using System;
using System.Collections.Generic;
using System.Text;

using BlubbFish.Utils;

using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Camera {
  public class CameraModel : OwnSingeton<CameraModel> {
    private readonly Object lockFight = new Object();
    private readonly Object lockCount = new Object();
    private readonly Object lockDensy = new Object();

    public SortedDictionary<String, CameraCounter> Counter {
      get; private set;
    }
    public SortedDictionary<String, CameraDensity> Density {
      get; private set;
    }
    public SortedDictionary<String, CameraFights> Fights {
      get; private set;
    }

    protected CameraModel() {
      this.Counter = new SortedDictionary<String, CameraCounter>();
      this.Density = new SortedDictionary<String, CameraDensity>();
      this.Fights = new SortedDictionary<String, CameraFights>();
    }

    public void ParseMqttJson(JsonData mqtt, String from) {
      if(from.Contains("camera/count") && CameraCounter.CheckJson(mqtt)) {
        String cameraid = CameraCounter.GetId(mqtt);
        lock(this.lockCount) {
          if(this.Counter.ContainsKey(cameraid)) {
            this.Counter[cameraid].Update(mqtt);
          } else {
            this.Counter.Add(cameraid, new CameraCounter(mqtt));
          }
        }
      } else if((from.Contains("sfn/crowd_density_local") || from.Contains("camera/crowd")) && CameraDensity.CheckJsonCrowdDensityLocal(mqtt) || from.Contains("sfn/flow") && CameraDensity.CheckJsonFlow(mqtt)) {
        String cameraid = CameraDensity.GetId(mqtt);
        lock(this.lockDensy) {
          if(this.Density.ContainsKey(cameraid)) {
            this.Density[cameraid].Update(mqtt);
          } else {
            this.Density.Add(cameraid, new CameraDensity(mqtt));
          }
        }
      } else if((from.Contains("camera/fighting_detection") || from.Contains("sfn/fighting_detection")) && CameraFights.CheckJsonFightingDetection(mqtt)) {
        String cameraid = CameraFights.GetId(mqtt);
        lock(this.lockFight) {
          if(this.Fights.ContainsKey(cameraid)) {
            this.Fights[cameraid].Update(mqtt);
          } else {
            this.Fights.Add(cameraid, new CameraFights(mqtt));
          }
        }
      }
    }
  }
}
