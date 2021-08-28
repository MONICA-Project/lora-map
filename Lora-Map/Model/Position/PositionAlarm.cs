using System;
using System.Collections.Generic;
using System.Linq;

using Fraunhofer.Fit.IoT.LoraMap.Model.JsonObjects;

namespace Fraunhofer.Fit.IoT.LoraMap.Model.Position {
  public class PositionAlarm : PositionItem {
    private readonly SortedDictionary<DateTime, String> buttonhistory = new SortedDictionary<DateTime, String>();

    public List<DateTime> ButtonPressed => this.buttonhistory.Keys.ToList();

    public PositionAlarm(LoraData data) : base(data, null) {
    }

    public override void Update(LoraData data) {
      base.Update(data);
      this.SetHistory(data);
    }

    private void SetHistory(LoraData data) {
      if(!this.buttonhistory.ContainsValue(data.Hash)) {
        this.buttonhistory.Add(DateTime.UtcNow, data.Hash);
        if(this.buttonhistory.Count > 10) {
          _ = this.buttonhistory.Remove(this.buttonhistory.Keys.ToList().First());
        }
      }
    }      
  }
}
