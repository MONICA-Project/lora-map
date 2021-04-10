using System;
using System.Collections.Generic;
using System.IO;

using BlubbFish.Utils;

using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Position {
  public class PositionModel : OwnSingeton<PositionModel> {
    private readonly Object lockData = new Object();
    private readonly Object lockPanic = new Object();
    private JsonData marker;

    public SortedDictionary<String, PositionItem> Positions {
      get; private set;
    }

    public SortedDictionary<String, PositionAlarm> Alarms {
      get; private set;
    }

    protected PositionModel() {
      this.Positions = new SortedDictionary<String, PositionItem>();
      this.Alarms = new SortedDictionary<String, PositionAlarm>();
      this.CheckJsonFile();
      this.marker = JsonMapper.ToObject(File.ReadAllText("json/names.json"));
      
    }

    public void ParseMqttJson(JsonData mqtt, String from) {
      if((from.Contains("lora/data") || from.Contains("lora/panic")) && PositionItem.CheckJson(mqtt)) {
        String name = PositionItem.GetId(mqtt);
        lock(this.lockData) {
          if(this.Positions.ContainsKey(name)) {
            this.Positions[name].Update(mqtt);
          } else {
            this.Positions.Add(name, new PositionItem(mqtt, this.marker));
          }
        }
        if(from.Contains("lora/panic")) {
          lock(this.lockPanic) {
            if(this.Alarms.ContainsKey(name)) {
              this.Alarms[name].Update(mqtt);
            } else {
              this.Alarms.Add(name, new PositionAlarm(mqtt));
            }
          }
          Console.WriteLine("PANIC erhalten!");
        }
        Console.WriteLine("Koordinate erhalten!");
      }
    }

    public void ReloadNames(Object sender, EventArgs e) {
      this.CheckJsonFile();
      this.marker = JsonMapper.ToObject(File.ReadAllText("json/names.json"));
      foreach(KeyValuePair<String, PositionItem> item in this.Positions) {
        item.Value.UpdateMarker(this.marker, item.Key);
      }
      Console.WriteLine("Namen und Icons aktualisiert!");
    }

    private void CheckJsonFile() {
      if(!Directory.Exists("json")) {
        _ = Directory.CreateDirectory("json");
      }
      if(!File.Exists("json/names.json")) {
        File.WriteAllText("json/names.json", "{}");
      }
    }
  }
}
