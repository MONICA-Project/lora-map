using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Reflection;
using BlubbFish.Utils;
using LitJson;

namespace Fraunhofer.Fit.IoT.LoraMap.Model {
  class Botclient {

    public Botclient(JsonData json) {
      if (json.ContainsKey("Rssi") && json["Rssi"].IsDouble) {
        this.Rssi = (Double)json["Rssi"];
      }
      if (json.ContainsKey("Snr") && json["Snr"].IsDouble) {
        this.Snr = (Double)json["Snr"];
      }
      if (json.ContainsKey("Receivedtime") && json["Receivedtime"].IsString) {
        if (DateTime.TryParse((String)json["Receivedtime"], DateTimeFormatInfo.InvariantInfo, DateTimeStyles.AssumeUniversal, out DateTime updatetime)) {
          this.Upatedtime = updatetime;
        }
      }
      if (json.ContainsKey("BatteryLevel") && json["BatteryLevel"].IsDouble) {
        this.Battery = Math.Round((Double)json["BatteryLevel"], 2);
        if(this.Battery < 3) {
          this.Batterysimple = 0;
        } else if(this.Battery < 3.2) {
          this.Batterysimple = 1;
        } else if(this.Battery < 3.5) {
          this.Batterysimple = 2;
        } else if(this.Battery < 3.8) {
          this.Batterysimple = 3;
        } else {
          this.Batterysimple = 4;
        }
      }
      if (json.ContainsKey("Gps") && json["Gps"].IsObject) {
        if (json["Gps"].ContainsKey("Latitude") && json["Gps"]["Latitude"].IsDouble) {
          this.Latitude = (Double)json["Gps"]["Latitude"];
        }
        if (json["Gps"].ContainsKey("Longitude") && json["Gps"]["Longitude"].IsDouble) {
          this.Longitude = (Double)json["Gps"]["Longitude"];
        }
        if (json["Gps"].ContainsKey("Fix") && json["Gps"]["Fix"].IsBoolean) {
          this.Fix = (Boolean)json["Gps"]["Fix"];
        }
        if (json["Gps"].ContainsKey("LastLatitude") && json["Gps"]["LastLatitude"].IsDouble && !this.Fix) {
          this.Latitude = (Double)json["Gps"]["LastLatitude"];
        }
        if (json["Gps"].ContainsKey("LastLongitude") && json["Gps"]["LastLongitude"].IsDouble && !this.Fix) {
          this.Longitude = (Double)json["Gps"]["LastLongitude"];
        }
        if (json["Gps"].ContainsKey("Hdop") && json["Gps"]["Hdop"].IsDouble) {
          this.Hdop = (Double)json["Gps"]["Hdop"];
        }
        if (json["Gps"].ContainsKey("Height") && json["Gps"]["Height"].IsDouble) {
          this.Height = (Double)json["Gps"]["Height"];
        }
      }
    }

    public Double Rssi { get; private set; }
    public Double Snr { get; private set; }
    public DateTime Upatedtime { get; private set; }
    public Double Latitude { get; private set; }
    public Double Longitude { get; private set; }
    public Double Hdop { get; private set; }
    public Double Battery { get; private set; }
    public Int32 Batterysimple { get; private set; }
    public Boolean Fix { get; private set; }
    public Double Height { get; private set; }

    public virtual Dictionary<String, Object> ToDictionary() {
      Dictionary<String, Object> dictionary = new Dictionary<String, Object>();
      foreach (PropertyInfo item in this.GetType().GetProperties()) {
        if (item.CanRead && item.GetValue(this) != null) {
          if (item.GetValue(this).GetType().GetMethod("ToDictionary") != null) {
            dictionary.Add(item.Name, item.GetValue(this).GetType().GetMethod("ToDictionary").Invoke(item.GetValue(this), null));
          } else if (item.GetValue(this).GetType().HasInterface(typeof(IDictionary))) {
            Dictionary<String, Object> subdict = new Dictionary<String, Object>();
            foreach (DictionaryEntry subitem in (IDictionary)item.GetValue(this)) {
              if (subitem.Value.GetType().GetMethod("ToDictionary") != null) {
                subdict.Add(subitem.Key.ToString(), subitem.Value.GetType().GetMethod("ToDictionary").Invoke(subitem.Value, null));
              }
            }
            dictionary.Add(item.Name, subdict);
          } else if (item.GetValue(this).GetType().BaseType == typeof(Enum)) {
            dictionary.Add(item.Name, Helper.GetEnumDescription((Enum)item.GetValue(this)));
          } else {
            dictionary.Add(item.Name, item.GetValue(this));
          }
        }
      }
      return dictionary;
    }
  }
}
