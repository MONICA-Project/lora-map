using System;
using System.Collections.Generic;

using BlubbFish.Utils;

using Fraunhofer.Fit.IoT.LoraMap.Model.JsonObjects;

using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Position {
  public class PositionModel : OwnSingeton<PositionModel> {
    private readonly Object lockData = new Object();
    private readonly Object lockAlarm = new Object();
    private NamesModel marker;

    public SortedDictionary<String, PositionItem> Positions {
      get; private set;
    }

    public SortedDictionary<String, PositionAlarm> Alarms {
      get; private set;
    }

    protected PositionModel() {
      this.Positions = new SortedDictionary<String, PositionItem>();
      this.Alarms = new SortedDictionary<String, PositionAlarm>();
      this.marker = new NamesModel();
    }

    public void ParseMqttJson(JsonData mqtt, String from) {
      if((from.Contains("lora/data") || from.Contains("lora/panic")) && LoraData.CheckJson(mqtt)) {
        LoraData data = new LoraData(mqtt);
        lock(this.lockData) {
          if(this.Positions.ContainsKey(data.Name)) {
            this.Positions[data.Name].Update(data);
          } else {
            this.Positions.Add(data.Name, new PositionItem(data, this.marker));
          }
        }
        if(from.Contains("lora/panic")) {
          lock(this.lockAlarm) {
            if(this.Alarms.ContainsKey(data.Name)) {
              this.Alarms[data.Name].Update(data);
            } else {
              this.Alarms.Add(data.Name, new PositionAlarm(data));
            }
          }
          Console.WriteLine("PANIC erhalten!");
        }
        Console.WriteLine("Koordinate erhalten!");
      }
    }

    public void ReloadNames(Object sender, EventArgs e) {
      this.marker = new NamesModel();
      foreach(KeyValuePair<String, PositionItem> item in this.Positions) {
        item.Value.UpdateMarker(this.marker, item.Key);
      }
      Console.WriteLine("Namen und Icons aktualisiert!");
    }
  }
}
