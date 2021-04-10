using System;
using System.Collections.Generic;
using System.Linq;
using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Position {
  public class PositionAlarm : PositionItem {
    private readonly SortedDictionary<DateTime, String> buttonhistory = new SortedDictionary<DateTime, String>();

    public List<DateTime> ButtonPressed => this.buttonhistory.Keys.ToList();

    public PositionAlarm(JsonData json) : base(json, null) {
    }

    public override void Update(JsonData json) {
      base.Update(json);
      this.SetHistory(json);
    }

    private void SetHistory(JsonData json) {
      if(json.ContainsKey("Hash") && json["Hash"].IsString) {
        String key = json["Hash"].ToString();
        if(!this.buttonhistory.ContainsValue(key)) {
          this.buttonhistory.Add(DateTime.UtcNow, key);
          if(this.buttonhistory.Count > 10) {
            _ = this.buttonhistory.Remove(this.buttonhistory.Keys.ToList().First());
          }
        }
      }      
    }
  }
}
