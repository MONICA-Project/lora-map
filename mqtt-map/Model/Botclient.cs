using System;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using BlubbFish.Utils;

namespace Fraunhofer.Fit.IoT.MqttMap.Model {
  class Botclient {

    public Botclient(Int32 paketrssi, Int32 rssi, Double snr, String updatetime, Double lat, Double lon, Double hdop, Double battery, Boolean fix) {
      this.PacketRssi = paketrssi;
      this.Rssi = rssi;
      this.Snr = snr;
      this.Upatedtime = updatetime;
      this.Latitude = lat;
      this.Longitude = lon;
      this.Hdop = hdop;
      this.Battery = battery;
      this.Fix = fix;
    }

    public Int32 PacketRssi { get; private set; }
    public Int32 Rssi { get; private set; }
    public Double Snr { get; private set; }
    public String Upatedtime { get; private set; }
    public Double Latitude { get; private set; }
    public Double Longitude { get; private set; }
    public Double Hdop { get; private set; }
    public Double Battery { get; private set; }
    public Boolean Fix { get; private set; }

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
