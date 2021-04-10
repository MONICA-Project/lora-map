using System;
using System.Collections.Generic;
using System.Text;

using BlubbFish.Utils;

using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Sensor {
  public class SensorModel : OwnSingeton<SensorModel> {
    private readonly Object lockSensor = new Object();

    public SortedDictionary<String, SensorEnviromentData> Enviroments {
      get; private set;
    }
    public SensorWeather Weather {
      get; private set;
    }

    protected SensorModel() {
      this.Enviroments = new SortedDictionary<String, SensorEnviromentData>();
      this.Weather = new SensorWeather();
    }

    public void ParseMqttJson(JsonData mqtt, String from) {
      if(from.Contains("lora/sensor") && SensorEnviromentData.CheckJson(mqtt)) {
        String sensorid = SensorEnviromentData.GetId(mqtt);
        lock(this.lockSensor) {
          if(this.Enviroments.ContainsKey(sensorid)) {
            this.Enviroments[sensorid].Update(mqtt);
          } else {
            this.Enviroments.Add(sensorid, new SensorEnviromentData(mqtt));
          }
        }
        Console.WriteLine("Umweltdaten erhalten!");
      }
    }

    public void Dispose() => this.Weather.Dispose();
  }
}
